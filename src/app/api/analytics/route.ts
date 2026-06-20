import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// Get predictions and forecasts
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const period = searchParams.get('period')
    
    // Get active prediction models
    const models = await db.predictionModel.findMany({
      where: {
        status: 'active',
        type: type || undefined,
      },
    })
    
    // Get forecasts
    const forecasts = await db.forecast.findMany({
      where: {
        modelId: { in: models.map(m => m.id) },
        period: period || undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    
    return NextResponse.json({
      models,
      forecasts: forecasts.map(f => ({
        ...f,
        predictions: JSON.parse(f.predictions),
        recommendations: f.recommendations ? JSON.parse(f.recommendations) : null,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 })
  }
}

// Generate forecast
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { modelId, forecastType, period } = await request.json()
    
    const model = await db.predictionModel.findUnique({
      where: { id: modelId },
    })
    
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }
    
    // Generate forecast based on model type
    const forecast = await generateForecast(modelId, model.type, forecastType, period)
    
    const newForecast = await db.forecast.create({
      data: {
        modelId,
        forecastType,
        period,
        predictions: JSON.stringify(forecast.predictions),
        confidence: forecast.confidence,
        baselineMetric: forecast.baselineMetric,
        forecastedMetric: forecast.forecastedMetric,
        variance: forecast.variance,
        recommendations: JSON.stringify(forecast.recommendations),
      },
    })
    
    return NextResponse.json({
      success: true,
      forecast: {
        ...newForecast,
        predictions: forecast.predictions,
        recommendations: forecast.recommendations,
      },
    })
  } catch (error) {
    console.error('Forecast generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 })
  }
}

// Train prediction model
export async function PUT(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { modelId, trainingData } = await request.json()
    
    const model = await db.predictionModel.findUnique({
      where: { id: modelId },
    })
    
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }
    
    // Update model status
    await db.predictionModel.update({
      where: { id: modelId },
      data: { status: 'training' },
    })
    
    // Train model asynchronously
    trainModel(modelId, model.type, trainingData).catch(err => {
      console.error('Model training failed:', err)
    })
    
    return NextResponse.json({
      success: true,
      status: 'training',
      message: 'Model training started',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to train model' }, { status: 500 })
  }
}

// Generate forecast logic
async function generateForecast(
  modelId: string,
  modelType: string,
  forecastType: string,
  period: string
): Promise<any> {
  // Simplified forecasting logic - in production, use actual ML models
  
  let predictions: any[] = []
  let confidence = 0.85
  let baselineMetric = 0
  let forecastedMetric = 0
  let variance = 0
  let recommendations: string[] = []
  
  switch (modelType) {
    case 'demand':
      // Get recent order data to baseline
      const orders = await db.order.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
      })
      
      baselineMetric = orders.length
      forecastedMetric = Math.round(baselineMetric * 1.15) // 15% growth forecast
      variance = ((forecastedMetric - baselineMetric) / baselineMetric) * 100
      
      predictions = [
        { date: '2026-04-10', quantity: Math.round(baselineMetric * 0.3) },
        { date: '2026-04-17', quantity: Math.round(baselineMetric * 0.35) },
        { date: '2026-04-24', quantity: Math.round(baselineMetric * 0.4) },
      ]
      
      if (variance > 10) {
        recommendations.push('Consider increasing print center capacity')
        recommendations.push('Pre-order materials for forecasted demand')
      }
      break
      
    case 'lead_time':
      const avgLeadTime = 5 // days
      baselineMetric = avgLeadTime
      forecastedMetric = avgLeadTime * 1.1
      variance = 10
      
      predictions = [
        { date: '2026-04-10', leadTime: 5 },
        { date: '2026-04-17', leadTime: 5.5 },
        { date: '2026-04-24', leadTime: 5.5 },
      ]
      
      if (forecastedMetric > 6) {
        recommendations.push('Monitor center queue lengths')
        recommendations.push('Consider load balancing across centers')
      }
      break
      
    case 'risk':
      confidence = 0.72
      predictions = [
        { date: '2026-04-10', riskScore: 35, category: 'material' },
        { date: '2026-04-17', riskScore: 42, category: 'supply' },
        { date: '2026-04-24', riskScore: 38, category: 'operational' },
      ]
      
      recommendations.push('Monitor supplier availability')
      recommendations.push('Increase safety stock for critical materials')
      break
      
    case 'cost':
      baselineMetric = 5000
      forecastedMetric = 5200
      variance = 4
      
      predictions = [
        { date: '2026-04-10', cost: 5050 },
        { date: '2026-04-17', cost: 5100 },
        { date: '2026-04-24', cost: 5200 },
      ]
      
      if (variance > 3) {
        recommendations.push('Review material pricing')
        recommendations.push('Consolidate shipments for cost savings')
      }
      break
  }
  
  return {
    predictions,
    confidence,
    baselineMetric,
    forecastedMetric,
    variance,
    recommendations,
  }
}

// Train model logic
async function trainModel(modelId: string, modelType: string, trainingData: any[]) {
  try {
    // In production, implement actual ML training
    // For now, simulate training
    
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const accuracy = Math.random() * 100
    
    await db.predictionModel.update({
      where: { id: modelId },
      data: {
        status: accuracy > 75 ? 'active' : 'inactive',
        accuracy,
        trainedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Training error:', error)
  }
}
