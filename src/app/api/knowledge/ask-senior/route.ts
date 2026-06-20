import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/require-auth'
import { askAI } from '@/lib/ai'
import { db } from '@/lib/db'

// ─── "Ask a Senior" ──────────────────────────────────────────────────────────
//
// Grounded in Dean Dalpe, Enbridge #64: "We use ChatGPT for all our manuals…
// a guy in the field asks 'How do I do fusion on a 2-inch plastic pipe?' It
// comes back: 'Based on what you're saying, here's the manual section.'"
//
// A junior employee types a question. We:
//   1. Keyword-search the knowledge base for the most relevant documents.
//   2. Feed those document excerpts + the question to the LLM.
//   3. The LLM answers AS the senior expert would, citing the docs.
//   4. We bump viewCount on the docs we surfaced.

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const { question, seniorEmployeeId } = await req.json()
    if (!question) {
      return NextResponse.json({ error: 'question is required' }, { status: 400 })
    }

    // Load all published docs (optionally filtered to one senior).
    const where: any = { status: 'published' }
    if (seniorEmployeeId) {
      const senior = await db.employee.findFirst({ where: { employeeId: seniorEmployeeId } })
      if (senior) where.authorId = senior.id
    }
    const allDocs = await db.knowledgeDocument.findMany({
      where,
      include: { author: { select: { name: true, title: true, seniority: true, yearsExperience: true } } },
    })

    // Score by keyword overlap.
    const q = question.toLowerCase()
    const terms = q.split(/\s+/).filter((t) => t.length > 2)
    const scored = allDocs
      .map((d) => {
        const haystack = `${d.title} ${d.summary} ${d.content} ${d.tags} ${d.equipmentTags ?? ''}`.toLowerCase()
        let score = 0
        for (const t of terms) {
          const matches = (haystack.match(new RegExp(t, 'g')) || []).length
          score += matches
        }
        return { doc: d, score }
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)

    if (scored.length === 0) {
      return NextResponse.json({
        answer: `I couldn't find any captured knowledge that matches your question. Try rephrasing with specific equipment names (e.g., "thruster bearing", "hydraulic valve", "heat exchanger") or ask the AI Agent to surface all documents from a specific senior.`,
        citedDocs: [],
        question,
      })
    }

    // Bump view counts.
    await Promise.all(
      scored.map((x) =>
        db.knowledgeDocument.update({
          where: { id: x.doc.id },
          data: { viewCount: { increment: 1 } },
        }),
      ),
    )

    // Build the context for the LLM.
    const context = scored
      .map((x, i) => {
        const excerpt = x.doc.content.length > 1500 ? x.doc.content.slice(0, 1500) + '…' : x.doc.content
        return `--- DOCUMENT ${i + 1}: ${x.doc.title} ---
Author: ${x.doc.author.name} (${x.doc.author.title}, ${x.doc.author.yearsExperience} yrs)
Category: ${x.doc.category} | Criticality: ${x.doc.criticality}
Document ID: ${x.doc.documentId}

${excerpt}`
      })
      .join('\n\n')

    const answer = await askAI(
      `You are the AddManuChain "Ask a Senior" assistant. A junior employee has asked a question. Answer it by drawing ONLY on the captured knowledge documents provided below. Write in the voice of a senior expert giving practical, field-tested advice — the way an experienced mentor would explain it.

Rules:
- Cite documents by their Document ID in square brackets, e.g. [KD-001].
- If the documents do not fully answer the question, say what they DO cover and explicitly flag the gap.
- Be specific and actionable — give steps, numbers, torque values, etc. when the docs contain them.
- Never invent procedures or numbers that are not in the documents.
- Keep it to ~300 words unless the question needs more detail.`,
      `Junior employee's question:
${question}

Captured knowledge documents (most relevant first):
${context}

Answer the question as a senior mentor would:`,
    )

    return NextResponse.json({
      answer,
      citedDocs: scored.map((x) => ({
        documentId: x.doc.documentId,
        title: x.doc.title,
        author: x.doc.author.name,
        authorTitle: x.doc.author.title,
        category: x.doc.category,
        criticality: x.doc.criticality,
        relevanceScore: x.score,
      })),
      question,
      seniorScope: seniorEmployeeId ?? 'all-seniors',
    })
  } catch (error: any) {
    console.error('Ask-senior POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
