import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/require-auth'
import { db } from '@/lib/db'

// ─── Knowledge Documents API ─────────────────────────────────────────────────
//
// CRUD for the institutional-memory store. Each document is authored by a
// senior/retiring employee and tagged with equipment + keywords so juniors can
// find it.

function serialize(doc: any) {
  return {
    id: doc.id,
    documentId: doc.documentId,
    title: doc.title,
    category: doc.category,
    criticality: doc.criticality,
    summary: doc.summary,
    content: doc.content,
    tags: doc.tags ? JSON.parse(doc.tags) : [],
    equipmentTags: doc.equipmentTags ? JSON.parse(doc.equipmentTags) : [],
    viewCount: doc.viewCount,
    helpfulCount: doc.helpfulCount,
    status: doc.status,
    publishedAt: doc.publishedAt,
    author: doc.author ? {
      employeeId: doc.author.employeeId,
      name: doc.author.name,
      title: doc.author.title,
      seniority: doc.author.seniority,
      department: doc.author.department,
      yearsExperience: doc.author.yearsExperience,
      retirementDate: doc.author.retirementDate,
      avatarColor: doc.author.avatarColor,
    } : null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const authorId = searchParams.get('authorId')
    const q = searchParams.get('q')
    const id = searchParams.get('id')

    if (id) {
      const doc = await db.knowledgeDocument.findFirst({
        where: { documentId: id },
        include: { author: true },
      })
      if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      // Bump view count
      await db.knowledgeDocument.update({
        where: { id: doc.id },
        data: { viewCount: { increment: 1 } },
      })
      return NextResponse.json({ document: serialize({ ...doc, viewCount: doc.viewCount + 1 }) })
    }

    const where: any = { status: 'published' }
    if (category && category !== 'all') where.category = category
    if (authorId) where.authorId = authorId
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { tags: { contains: q } },
        { equipmentTags: { contains: q } },
      ]
    }

    const docs = await db.knowledgeDocument.findMany({
      where,
      include: { author: true },
      orderBy: { publishedAt: 'desc' },
    })

    return NextResponse.json({
      documents: docs.map(serialize),
      summary: {
        total: docs.length,
        critical: docs.filter((d) => d.criticality === 'critical').length,
        byAuthor: docs.reduce((acc: Record<string, number>, d) => {
          const name = d.author?.name ?? 'Unknown'
          acc[name] = (acc[name] ?? 0) + 1
          return acc
        }, {}),
      },
    })
  } catch (error: any) {
    console.error('Knowledge docs GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const body = await req.json()
    const doc = await db.knowledgeDocument.create({
      data: {
        documentId: body.documentId || `KD-${Date.now().toString().slice(-4)}`,
        title: body.title,
        category: body.category ?? 'procedure',
        authorId: body.authorId,
        summary: body.summary,
        content: body.content,
        tags: JSON.stringify(body.tags ?? []),
        equipmentTags: JSON.stringify(body.equipmentTags ?? []),
        criticality: body.criticality ?? 'standard',
        status: body.status ?? 'published',
      },
      include: { author: true },
    })
    return NextResponse.json({ document: serialize(doc) })
  } catch (error: any) {
    console.error('Knowledge docs POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
