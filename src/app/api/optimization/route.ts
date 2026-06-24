import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// Get cost optimization suggestions
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    
    const suggestions = await db.optimizationSuggestion.findMany({
      where: {
        category: category || undefined,
        priority: priority || undefined,
        status: { not: 'rejected' },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    })
    
    // Calculate total potential savings
    const totalSavings = suggestions.reduce((sum, s) => sum + s.potentialSavings, 0)
    
    return NextResponse.json({
      suggestions,
      totalPotentialSavings: totalSavings,
      count: suggestions.length,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
  }
}

// Generate cost optimizations
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { type, targetEntity, targetEntityId } = await request.json()
    
    const optimizationId = `OPT-${Date.now()}`
    
    // Generate recommendations based on type
    const recommendations = await generateOptimizations(type, targetEntity, targetEntityId)
    
    const optimization = await db.costOptimization.create({
      data: {
        optimizationId,
        type,
        targetEntity,
        targetEntityId,
        currentCost: recommendations.currentCost,
        estimatedSavings: recommendations.estimatedSavings,
        recommendations: JSON.stringify(recommendations.recommendations),
        status: 'pending',
      },
    })
    
    // Create suggestions
    for (const rec of recommendations.recommendations) {
      const suggestionId = `SG-${Date.now()}-${Math.random()}`
      await db.optimizationSuggestion.create({
        data: {
          suggestionId,
          category: rec.category,
          priority: rec.priority,
          description: rec.description,
          potentialSavings: rec.potentialSavings,
          implementationDifficulty: rec.difficulty,
          timeToImplement: rec.timeToImplement,
          affectedEntities: JSON.stringify(rec.affectedEntities),
          status: 'suggested',
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      optimization,
      recommendations: recommendations.recommendations,
    })
  } catch (error) {
    console.error('Optimization generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate optimizations' }, { status: 500 })
  }
}

// Approve optimization
export async function PUT(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { optimizationId } = await request.json()
    
    const optimization = await db.costOptimization.update({
      where: { id: optimizationId },
      data: {
        status: 'approved',
        approvedBy: session.user.id,
        approvedAt: new Date(),
      },
    })
    
    // Queue implementation
    implementOptimization(optimization).catch(err => {
      console.error('Implementation failed:', err)
    })
    
    return NextResponse.json({ success: true, optimization })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve optimization' }, { status: 500 })
  }
}

// Accept suggestion
export async function PATCH(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { suggestionId, action } = await request.json()
    
    const suggestion = await db.optimizationSuggestion.update({
      where: { id: suggestionId },
      data: { status: action === 'accept' ? 'implemented' : 'rejected' },
    })
    
    return NextResponse.json({ success: true, suggestion })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 })
  }
}

// Generate optimization recommendations
async function generateOptimizations(
  type: string,
  targetEntity: string,
  targetEntityId: string
): Promise<any> {
  let currentCost = 0
  let estimatedSavings = 0
  let recommendations: any[] = []
  
  switch (type) {
    case 'material_consolidation':
      const materials = await db.material.findMany()
      const stocks = await db.materialStock.findMany({ take: 100 })
      
      currentCost = stocks.reduce((sum, s) => sum + (s.stock * 10), 0) // Assume $10 per unit
      
      // Recommend consolidating low-usage materials
      const lowUsage = materials.filter(m => m.totalStock < m.reorderPoint)
      estimatedSavings = lowUsage.length * 150
      
      recommendations.push({
        category: 'material',
        priority: 'high',
        description: `Consolidate ${lowUsage.length} low-usage materials to reduce inventory costs`,
        potentialSavings: estimatedSavings,
        difficulty: 'easy',
        timeToImplement: 16,
        affectedEntities: lowUsage.map(m => m.id),
      })
      break
      
    case 'route_optimization':
      const orders = await db.order.findMany({ take: 50 })
      const centers = await db.printCenter.findMany()
      
      currentCost = orders.length * 150 // Assume $150 per shipment
      estimatedSavings = currentCost * 0.15 // 15% savings potential
      
      recommendations.push({
        category: 'route',
        priority: 'medium',
        description: 'Consolidate shipments to nearby centers to reduce logistics costs',
        potentialSavings: estimatedSavings,
        difficulty: 'medium',
        timeToImplement: 32,
        affectedEntities: centers.map(c => c.id),
      })
      break
      
    case 'capacity_planning':
      const allCenters = await db.printCenter.findMany()
      const utilizationRates = allCenters.map(c => c.currentJobs / c.totalPrinters)
      const avgUtilization = utilizationRates.reduce((a, b) => a + b, 0) / utilizationRates.length
      
      currentCost = allCenters.length * 5000 // Assume $5000 per center
      
      if (avgUtilization < 0.6) {
        estimatedSavings = currentCost * 0.2
        recommendations.push({
          category: 'capacity',
          priority: 'high',
          description: 'Consolidate operations at underutilized centers to reduce overhead',
          potentialSavings: estimatedSavings,
          difficulty: 'hard',
          timeToImplement: 160,
          affectedEntities: allCenters.map(c => c.id),
        })
      }
      break
      
    case 'waste_reduction':
      const recentOrders = await db.order.findMany({ take: 100 })
      
      currentCost = recentOrders.length * 50 // Assume $50 waste per order
      estimatedSavings = currentCost * 0.25 // 25% waste reduction target
      
      recommendations.push({
        category: 'waste',
        priority: 'medium',
        description: 'Implement quality control measures to reduce material waste',
        potentialSavings: estimatedSavings,
        difficulty: 'medium',
        timeToImplement: 80,
        affectedEntities: recentOrders.map(o => o.id),
      })
      break
  }
  
  return {
    currentCost,
    estimatedSavings,
    recommendations,
  }
}

// Implement optimization
async function implementOptimization(optimization: any) {
  try {
    // Simulate implementation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    await db.costOptimization.update({
      where: { id: optimization.id },
      data: {
        status: 'implementing',
      },
    })
    
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const actualSavings = optimization.estimatedSavings * (0.8 + Math.random() * 0.4)
    
    await db.costOptimization.update({
      where: { id: optimization.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        actualSavings,
      },
    })
  } catch (error) {
    console.error('Implementation error:', error)
  }
}
