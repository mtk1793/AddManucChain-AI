import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/require-auth'
import { db } from '@/lib/db'

// ─── Employees API ───────────────────────────────────────────────────────────
//
// Returns the workforce directory — senior/retiring experts and junior/new
// hires — with their mentor links, knowledge-doc counts, and active transfer
// counts. This is the "database for new employees based on older generation"
// the user asked for.

function serialize(emp: any) {
  return {
    id: emp.id,
    employeeId: emp.employeeId,
    name: emp.name,
    email: emp.email,
    phone: emp.phone,
    title: emp.title,
    department: emp.department,
    seniority: emp.seniority,
    hireDate: emp.hireDate,
    retirementDate: emp.retirementDate,
    yearsExperience: emp.yearsExperience,
    status: emp.status,
    specialties: emp.specialties ? JSON.parse(emp.specialties) : [],
    certifications: emp.certifications ? JSON.parse(emp.certifications) : [],
    bio: emp.bio,
    mentorId: emp.mentorId,
    mentor: emp.mentor ? {
      employeeId: emp.mentor.employeeId,
      name: emp.mentor.name,
      title: emp.mentor.title,
    } : null,
    mentees: emp.mentees ? emp.mentees.map((m: any) => ({
      employeeId: m.employeeId,
      name: m.name,
      title: m.title,
    })) : [],
    knowledgeDocCount: emp.knowledgeDocs ? emp.knowledgeDocs.length : 0,
    activeTransfersFrom: emp.transfersFrom ? emp.transfersFrom.filter((t: any) => t.status !== 'completed').length : 0,
    activeTransfersTo: emp.transfersTo ? emp.transfersTo.filter((t: any) => t.status !== 'completed').length : 0,
    avatarColor: emp.avatarColor,
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const { searchParams } = new URL(req.url)
    const seniority = searchParams.get('seniority') // junior | senior | retiring | all
    const department = searchParams.get('department')

    const where: any = {}
    if (seniority && seniority !== 'all') where.seniority = seniority
    if (department && department !== 'all') where.department = department

    const employees = await db.employee.findMany({
      where,
      include: {
        mentor: { select: { employeeId: true, name: true, title: true } },
        mentees: { select: { employeeId: true, name: true, title: true } },
        knowledgeDocs: { where: { status: 'published' }, select: { id: true } },
        transfersFrom: { select: { status: true } },
        transfersTo: { select: { status: true } },
      },
      orderBy: [
        { seniority: 'desc' }, // retiring + senior first
        { yearsExperience: 'desc' },
      ],
    })

    const departments = await db.employee.findMany({
      distinct: ['department'],
      select: { department: true },
    })

    return NextResponse.json({
      employees: employees.map(serialize),
      departments: departments.map((d) => d.department).filter(Boolean),
      summary: {
        total: employees.length,
        retiring: employees.filter((e) => e.seniority === 'retiring').length,
        senior: employees.filter((e) => e.seniority === 'senior').length,
        junior: employees.filter((e) => e.seniority === 'junior').length,
        atRiskDocs: employees.filter((e) => e.seniority === 'retiring' && e.knowledgeDocs.length === 0).length,
      },
    })
  } catch (error: any) {
    console.error('Employees GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const body = await req.json()
    const employee = await db.employee.create({
      data: {
        employeeId: body.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        title: body.title,
        department: body.department,
        seniority: body.seniority ?? 'junior',
        hireDate: body.hireDate ? new Date(body.hireDate) : new Date(),
        retirementDate: body.retirementDate ? new Date(body.retirementDate) : null,
        yearsExperience: body.yearsExperience ?? 0,
        status: body.status ?? 'active',
        specialties: JSON.stringify(body.specialties ?? []),
        certifications: JSON.stringify(body.certifications ?? []),
        bio: body.bio ?? null,
        mentorId: body.mentorId ?? null,
        avatarColor: body.avatarColor ?? '#0EA5E9',
      },
      include: {
        mentor: { select: { employeeId: true, name: true, title: true } },
      },
    })
    return NextResponse.json({ employee: serialize(employee) })
  } catch (error: any) {
    console.error('Employees POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
