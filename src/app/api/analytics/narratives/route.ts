import { NextRequest, NextResponse } from 'next/server'

interface AnalyticsMetric {
  label: string
  value: number | string
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  narrative: string
}

function generateAnalyticsNarratives(): {
  metrics: AnalyticsMetric[]
  executiveSummary: string
  forecastTrendline: string
  topInsights: string[]
  generatedAt: string
} {
  const metrics: AnalyticsMetric[] = [
    {
      label: 'On-Time Delivery Rate',
      value: '96.4%',
      trend: 'up',
      trendPercent: 3.2,
      narrative:
        'Delivery performance improved 3.2% this month. Emergency response system reduced average resolution time from 4.2h to 2.4h.',
    },
    {
      label: 'Print Center Utilization',
      value: '78.2%',
      trend: 'up',
      trendPercent: 8.9,
      narrative:
        'Utilization climbed 8.9% as new workload distribution algorithm balanced across 5 centers. Still 15% capacity available for emergency orders.',
    },
    {
      label: 'Material Stockout Risk',
      value: '12%',
      trend: 'down',
      trendPercent: -4.1,
      narrative:
        'Stockout risk dropped 4.1% with AI-powered inventory scoring. Only 3 parts at critical risk vs. 8 last month. Pre-queuing working well.',
    },
    {
      label: 'Quality Pass Rate',
      value: '98.7%',
      trend: 'up',
      trendPercent: 1.4,
      narrative:
        'QA pass rate improved 1.4% via better print verification. Zero rework orders this week. DRM audit logging catching edge cases early.',
    },
    {
      label: 'Avg Print Time',
      value: '3.8h',
      trend: 'down',
      trendPercent: -12.5,
      narrative:
        'Average print time decreased 12.5% due to optimized slicing algorithm and material pre-processing. High-complexity parts seeing greatest gains.',
    },
    {
      label: 'OEM Approval Cycle',
      value: '2.1d',
      trend: 'down',
      trendPercent: -18.3,
      narrative:
        'OEM approval cycle shortened 18.3% (+6.2 hours faster). Integration with IP licensing automated docstring routing. Cert Authority still at 3.4d baseline.',
    },
  ]

  const executiveSummary = `
🎯 **April Operations Summary**

Operational metrics show strong momentum across all KPIs. Delivery reliability hit 96.4%, supported by emergency response improvements and balanced workload distribution.

**Key Wins:**
- Emergency response turnaround: 4.2h → 2.4h (-43%)
- Print utilization: 70.3% → 78.2% (+8.9%)
- OEM approval cycle: 2.6d → 2.1d (-18.3%)
- Quality baseline: 98.7% pass rate (zero rework)

**Areas of Focus:**
- Cert Authority approval cycle remains at 3.4d (target: 2.8d)
- 3 high-priority materials flagged for Q2 reorder planning
- St. John's AM facility requires maintenance next week

**30-Day Forecast:** Expect 4-6% utilization gain as new orders from Hibernia platform confirmed. Stockout risk trending favorable with current pre-queue strategy.
`

  const forecastTrendline = `
📈 **Trend Analysis & 30-Day Forecast**

Over the last 30 days, on-time delivery has improved consistently:
- Week 1: 92.1% → Week 2: 93.8% → Week 3: 95.2% → Week 4: 96.4%
- Forecast (Week 5): 97.1% ↑

Print utilization climbing steadily with new workload:
- 3/5 centers at 85%+ capacity
- 2/5 centers at 65-70% (room for emergency surge)
- Forecast: 80-82% utilization by month-end

Material stockout risk decreasing via early detection:
- Critical parts: 8 → 4 → 3 (this week)
- AI risk scoring now predicts 7+ days out
- Forecast: Sub-10% risk by month-end if current ordering maintained

Quality rate stable at excellence level (98%+). No trend change expected.

Print time optimization continuing with algorithmic improvements (-12.5% this month). Forecast: -3 to 5% additional gains in May.
`

  const topInsights = [
    'Emergency Response: The new AI triage system reduced mean resolution time by 43%. Recommend expanding to all PLC downtime scenarios.',
    'Workload Balancing: ML-based distribution algorithm improved utilization 8.9% without capacity additions. Cost savings ~$4k/month in avoided infrastructure.',
    'Quality Control: Zero rework orders this week. DRM audit trail integration catching edge cases in pre-printing stage.',
    'Cert Bottleneck: OEM approval cycle improved 18.3%, but Cert Authority approval at 3.4d is new constraint. Recommend parallel pre-audit with certifier.',
    'Material Planning: AI risk scoring preventing stockouts 7+ days early. Pre-queuing strategy reducing emergency premium costs by 22%.',
    'Facility Maintenance: St. John\'s AM offline next week. Recommend pre-load 2-3 jobs to Halifax XL and DNV Calgary to maintain customer SLA.',
  ]

  return {
    metrics,
    executiveSummary,
    forecastTrendline,
    topInsights,
    generatedAt: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const analytics = generateAnalyticsNarratives()
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
