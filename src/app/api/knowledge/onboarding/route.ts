import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/require-auth'
import { askAIJson } from '@/lib/ai'
import { db } from '@/lib/db'

// ─── Onboarding Plan Generator ───────────────────────────────────────────────
//
// "Database for new employees based on older generation ones" — the user asked
// for exactly this. Pick a retiring/senior employee, and the AI generates a
// 90-day onboarding plan for their replacement, drawing ONLY on that senior's
// captured knowledge documents.

interface OnboardingPlan {
  newHireTitle: string
  overview: string
  days1to30: string[]
  days31to60: string[]
  days61to90: string[]
  mustReadDocs: string[]
  mustShadowBuilds: string[]
  milestones: { week: string; milestone: string }[]
  risksOfKnowledgeLoss: string[]
  recommendedMentor: string
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const { seniorEmployeeId } = await req.json()
    if (!seniorEmployeeId) {
      return NextResponse.json({ error: 'seniorEmployeeId is required' }, { status: 400 })
    }

    const senior = await db.employee.findFirst({
      where: { employeeId: seniorEmployeeId },
      include: {
        knowledgeDocs: { where: { status: 'published' }, orderBy: { criticality: 'desc' } },
        transfersFrom: {
          include: {
            toEmployee: { select: { name: true, title: true, employeeId: true } },
            document: { select: { title: true, documentId: true } },
          },
        },
        mentees: { select: { name: true, title: true, employeeId: true } },
      },
    })

    if (!senior) {
      return NextResponse.json({ error: `Employee ${seniorEmployeeId} not found` }, { status: 404 })
    }

    const docsDigest = senior.knowledgeDocs
      .map((d, i) => `${i + 1}. ${d.title} [${d.documentId}]
   Category: ${d.category} | Criticality: ${d.criticality}
   Summary: ${d.summary}`)
      .join('\n')

    const transfersDigest = senior.transfersFrom.length
      ? senior.transfersFrom.map((t) => `- ${t.type} with ${t.toEmployee.name} (${t.toEmployee.title}) — status: ${t.status}${t.document ? ` via ${t.document.title}` : ''}`).join('\n')
      : '(no knowledge transfers scheduled yet)'

    const plan = await askAIJson<OnboardingPlan>(
      `You are the AddManuChain workforce-knowledge AI. A senior employee is retiring (or departing) and we need to generate a 90-day onboarding plan for their replacement. The plan MUST transfer the specific knowledge encoded in this senior's captured documents.

Be specific:
- Reference real document titles and IDs in mustReadDocs.
- Use the senior's actual specialties to populate mustShadowBuilds.
- The milestones should be measurable (e.g., "Run 3 supervised builds of BP-1024").
- risksOfKnowledgeLoss should call out specific gaps — topics the senior knows but has NOT documented.
- recommendedMentor should name a plausible role (not a real person) who could co-mentor during transition.

Respond as JSON only with this exact shape:
{ newHireTitle, overview, days1to30: [...], days31to60: [...], days61to90: [...], mustReadDocs: [...], mustShadowBuilds: [...], milestones: [{week, milestone}], risksOfKnowledgeLoss: [...], recommendedMentor }`,
      `Retiring/departing senior:
- Name: ${senior.name}
- Title: ${senior.title}
- Department: ${senior.department}
- Years of experience: ${senior.yearsExperience}
- Retirement date: ${senior.retirementDate ?? 'not set'}
- Specialties: ${senior.specialties}
- Certifications: ${senior.certifications ?? '—'}
- Bio: ${senior.bio ?? '—'}

Captured knowledge documents (${senior.knowledgeDocs.length} total):
${docsDigest || '(NONE — this is a critical risk; the plan must flag it loudly)'}

Existing knowledge transfers from this senior:
${transfersDigest}

Existing mentees: ${senior.mentees.length ? senior.mentees.map((m) => m.name).join(', ') : 'none'}

Generate the 90-day onboarding plan for the replacement hire:`,
      {
        newHireTitle: senior.title.replace(/Senior|Principal/gi, 'Junior').trim(),
        overview: `Onboarding plan to replace ${senior.name}.`,
        days1to30: ['Read all captured knowledge documents'],
        days31to60: ['Shadow a mentor on live work'],
        days61to90: ['Run supervised work', 'Solo sign-off'],
        mustReadDocs: senior.knowledgeDocs.map((d) => d.title),
        mustShadowBuilds: [],
        milestones: [],
        risksOfKnowledgeLoss: senior.knowledgeDocs.length === 0
          ? [`CRITICAL: ${senior.name} has 0 captured knowledge documents. Their ${senior.yearsExperience} years of experience will be lost unless documentation is captured before departure.`]
          : ['Some specialty areas may not yet be documented — schedule exit interviews.'],
        recommendedMentor: 'A peer senior in the same department',
      },
    )

    return NextResponse.json({
      senior: {
        employeeId: senior.employeeId,
        name: senior.name,
        title: senior.title,
        department: senior.department,
        yearsExperience: senior.yearsExperience,
        retirementDate: senior.retirementDate,
        specialties: JSON.parse(senior.specialties),
      },
      plan,
      docCount: senior.knowledgeDocs.length,
      transferCount: senior.transfersFrom.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Onboarding POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
