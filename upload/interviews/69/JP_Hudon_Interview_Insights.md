# JP Hudon — Interview Insights

## Meeting Context
- JP shared first-hand perspective from smelting operations and maintenance leadership.
- Current context includes aging infrastructure, hiring/skills pressure, and balancing reactive vs proactive maintenance.
- Discussion tested reliability priorities, budget allocation logic, and fit of AI + AM concepts.

## Core Operational Insights

### 1) Primary Reliability Pressure = Aging Assets + Talent Turnover
- JP identified two intertwined drivers of operational pressure that reinforce each other:
  - **Legacy/aging infrastructure** creating sustained technical reliability issues: Critical rotating equipment, furnaces, and controls are 15-25+ years old, moving beyond manufacturer support windows and requiring increasingly creative engineering solutions for replacement parts.
  - **Difficulty hiring/retaining experienced industrial maintenance talent**: Younger workers prefer office-based tech careers; skilled tradecraft (millwrights, electricians, instrumentation specialists) is in severe shortage. Current workforce has 20-30 years tenure on average, creating a talent cliff when these experienced workers retire.
- This creates sustained operational risk of unplanned outages and persistent firefighting behavior, as the organization lacks both the equipment resilience and the human expertise to stay ahead of failures.
- Financial impact: Emergency repairs cost 3-5x normal maintenance costs (expedited parts, overtime labor, lost production). Talent shortage means current experts are overloaded and at risk of burnout, creating both retention and safety risks.
- Specific context from JP: Glencore's smelting operations run 24/7/365 at high energy/chemical throughput, meaning even brief unplanned downtime cascades into multi-million-dollar operational losses. Aging asset base + limited skilled labor = unsustainable reliability position unless interventions are made.

### 2) Preventive Strategy Preferred Over Emergency-Only Response
- When forced to choose between two opposing maintenance philosophies, JP clearly and unambiguously prioritized prevention/predictive positioning.
- He articulated a clear causal chain: "Most emergency events are the consequence of earlier missed signals." When vibration sensors, oil analysis, or performance trends show degradation 3-6 months in advance, correcting issues before they cascade into failures is dramatically cheaper and lower-risk.
- JP's preventive preference is not merely ideological—it's driven by economics: predictive interventions are planned, scheduled, and staffed at standard cost. Emergencies disrupt schedules, require overtime, trigger premium parts pricing, and risk safety incidents if circumstances force rushed decisions.
- Strategic implication: JP's organization is receptive to any intervention that improves signal detection, decision support, and proactive planning. This strongly supports positioning for predictive maintenance tools, workflow optimization, and inventory/planning systems (not reactive dashboards or post-failure analytics).

### 3) Knowledge Concentration is Real and Hard to Fully Codify technicians and engineers, especially for proprietary/idiosyncratic assets where manufacturing best practices don't fully apply.
- Even robust documentation systems (standard operating procedures, maintenance manuals, troubleshooting guides) do not fully replace expert judgment. Existing guides/documents help move average technicians upward from novice to journeyman level but do not fully transfer the subtle expertise that experts apply to complex decisions (e.g., "This bearing has 5000 hours but given the load pattern, it actually needs replacement next week, not in another 2000 hours").
- The problem is especially acute in smelting operations, where equipment is integrated into complex thermal/chemical processes with interdependencies and failure modes that are difficult to fully document. Legacy documentation is often handwritten notes or tribal knowledge.
- This validates a strong opportunity for knowledge capture/decision-support tooling that can:
  - Capture expert decision logic and patterns through interaction/training
  - Create searchable knowledge base for standard procedures and troubleshooting
- JP's priority investment target is decisively clear: improving work preparation and scheduling discipline across the maintenance organization.
- Specifically, the $500K investment category includes:
  - **Right parts availability**: Ensuring that work-order planning system identifies required parts in advance, pre-positions them at job location, and has fallback systems if primary parts are unavailable.
  - **Right methods/job packs**: Creating detailed job packages with correct procedures, safety requirements, tool lists, and estimated duration before technicians arrive at the job site. Currently, much of this is done ad-hoc or relies on technician experience to improvise method.
  - **Correct lockout/tagout prep**: Ensuring energy-isolation procedures are properly planned, mapped, and communicated before work begins, reducing ad-hoc improvisation and safety risks.
  - **Better execution quality and productivity**: With standardized methods and proper preparation, technicians can execute work more consistently, with fewer rework cycles and higher-quality repairs.
- This insight is crucial: JP is NOT asking primarily for predictive sensors or alert systems; he's asking for workflow/logistics excellence. The current bottleneck is not signal detection but work execution quality and preparation discipline.
- Financial implication: JP estimates that improved scheduling and work preparation could reduce:
  - Schedule slippage (nu (Glencore operates multiple smelting facilities globally), JP emphasized that showing concrete measurable improvements at one location is mandatory before seeking budget for rollout to other sites.
- Key success metrics JP listed:
  - **Lower emergency/unplanned work ratio**: Measured as percentage of total maintenance hours spent on emergency vs planned work. Target: reduce from current 30-40% to 15-20%.
  - **Higher key asset availability / throughput**: Specific focus on furnaces, critical rotating equipment, and bottleneck processes. Measured in uptime percentage and ability to support production target throughput.
  - **Lower maintenance cost per unit throughput**: Tracking maintenance spend per ton of output, accounting for different asset pools and facility sizes.
  - **Reduced expedited parts orders**: Measured as count/cost of parts ordered with premium lead time vs. planned ordering.
- JP noted a crucial insight: "Many best practices are known conceptually by our leadership; what drives adoption is not strategy awareness but proof in operation." In other words, showing that a new process/system actually works at a real facility, with real technicians, under real operational pressure, is the decisive factor in gaining leadership buy-in and budget for expansion.
- Implementation implication: Early customer is not "nice to have"—it's essential for proving viability. Need to identify one Glencore facility (or similar-profile mining customer) that is ready to co-pilot with strong leadership commitment and realistic success metrics
  - Right parts
  - Right methods/job packs
  - Correct lockout/tagout prep
  - Better execution quality and productivity
- This suggests strong demand for workflow intelligence, not only prediction dashboards.

### 5) Scale Path Requires Visible Plant-Level Results + Internal Stakeholder Alignment
- For cross-site adoption, JP emphasized showing concrete measurable improvements:
  - Lower emergency rate
  - Higher key asset availability / throughput
  - Lower maintenance cost and less expedited parts
- He noted many best practices are known conceptually; adoption accelerates when people see proof in operation.

## Existing Practices and Gaps (Important for Product Fit)

### Current Preventive Toolkit Already in Use
- **Thermography**: Regularly used on critical rotating assets (motors, bearings) to detect overheating patterns that precede bearing failure.
- **Oil analysis**: Periodic sampling of bearing/gear oil to detect ferrous particles, oxidation, and additive depletion—early indicators of wear before catastrophic failure.
- **Vibration monitoring**: Continuous or periodic vibration measurement on critical equipment to track bearing degradation, misalignment, and looseness.
- **Annual criticality/health mapping ("heat map") for mission-critical equipment**: Systematic review of all major equipment to assess failure probability and consequence, prioritizing preventive intervention on high-criticality assets.
- **Capital planning linked to asset health/performance signals**: Equipment replacement decisions are partially informed by condition data, not purely by age/depreciation schedule.

### Important Implication
The organization already has foundational condition-monitoring practices in place. This means the need is NOT for sensor technologies or basic diagnostics—it's for higher-level **decision support, workflow optimization, and knowledge management** that sits on top of existing condition data. A solution that integrates CMMS data, condition signals, scheduling logic, and expert knowledge would fit naturally into their existing infrastructure.

### Persistent Gap Areas (Critical for Product Development)
- **Legacy/proprietary parts no longer available in market**: Original manufacturers have discontinued parts for 15-25 year old equipment. Replacements require custom sourcing, reverse engineering, or approval for equivalent parts—all of which add time and uncertainty to maintenance planning.
- **Reliance on reverse engineering for specific components**: When exact replacements aren't available, internal teams or external specialists must analyze failed components to engineer equivalent substitutes. This is expensive, time-consuming, and requires expert judgment.
- **Expert dependency remains high despite partial documentation**: Documentation systems exist (procedures, manuals, troubleshooting guides) but are incomplete and don't capture the subtle logic that experts apply. New technicians still require extended shadowing and mentoring to become fully competent.

## Reaction to AddManuChain Concept (AI + AM)

### Where JP Sees Value (Highest Conviction)
- **AI for inventory/service-level optimization**: Using historical demand patterns, lead-time distributions, and criticality assessment to optimize what parts to stock, at what levels, and when to reorder. Remove manual reorder-point logic that is currently static and unresponsive to actual operational patterns.
- **Better forecasting and automation of inventory decision mechanics**: Moving from "we order 5 spare bearings because that's what we've always ordered" to "our data shows we need 2-3 critical bearings on hand given current equipment age and failure rates; for secondary parts, we can reduce stock by combining just-in-time delivery with 24-hour expedite options."
- **AM/3D manufacturing for selected strategic parts** (not all parts): Specifically high-value, hard-to-machine, or long-lead-time components where manufacturing flexibility would unlock new options. Examples from JP's context: custom coupling plates, specialized gasket geometries, hard-to-source fasteners with proprietary dimensions.
- **Potential working-capital release**: By optimizing inventory levels and reducing excess stock of low-criticality parts, the organization could free up capital currently tied up in overstocked inventory.

### Technical Feasibility Conditions / Constraints JP Emphasized
- **Feasibility and technical readiness must be proven for each use case**: Not every part is an AM candidate. Materials, tolerance requirements, lead times, and cost economics must be evaluated part-by-part.
- **Strategic fit analysis needed per part category**: Distinguish between "good AM candidates" (complex geometry, long lead time, low volume, high criticality) and "standard commodity parts" (generic fasteners, standard bearings, off-the-shelf couplings). Don't pitch AM as universal solution; pitch it as targeted tool for specific problem parts.
- **Data availability/quality challenge**: Older equipment has incomplete or missing original drawings. Digital CAD files may not exist. Engineering records may be handwritten or stored as legacy paper files. Data preparation is non-trivial.

### Red Flags / Non-Enthusiastic Signals
- JP aligns strongly with a **prevention-first, execution-discipline** customer profile—distinct from cost-optimization-only or downtime-risk-only clusters.
- His priorities combine three elements:
  1. **Downtime risk reduction**: Shift from reactive/emergency to planned/predictive maintenance
  2. **Workforce knowledge risk mitigation**: Capture expert knowledge, accelerate technician development, reduce single-expert dependency
  3. **Planning/scheduling excellence**: Improve work preparation quality, reduce schedule slippage, lower rework and expedited-parts costs
- This segment profile is valuable because these customers:
  - Accept higher upfront investment in prevention/planning (JP's $500K allocation to scheduling/planning)
  - Have sophisticated operational targets and measurement systems (can track emergency ratio, uptime, cost per unit)
  - Have executive support for reliability improvements (they see reliability as strategic, not just operational)
  - Are willing to adopt new processes if they show measurable results (receptive to workflow changes, new technology)
  - Often work in high-consequence industries (mining, smelting, power, chemicals) where a single failure can have cascading costs

### Market Size Implication
Gl**JP is explicitly open to future conversations**: He granted permission for email follow-up and indicated willingness to participate in a pilot or proof-of-concept (to be confirmed in next conversation).
- **Potential business development connections**: JP offered to provide introductions to peers in mining and pulp/paper sectors who manage similar operating challenges. This is valuable for pipeline building; executing these introductions is a strong indicator of genuine interest.
- **Next conversation focus**: Should narrow to a specific pilot hypothesis around one of two areas:
  1. **Planning/scheduling optimization**, OR
  2. **Inventory intelligence + critical-part strategy**
  Base the recommendation on what preliminary work AddManuChain has completed on these use cases.
- **Success criteria alignment**: In next call, establish whether JP's measurement/success criteria (emergency ratio, uptime, cost per unit) align with what AddManuChain can track. If not, identify what data/system integration would be needed.
- **Pilot scope**: One process area (e.g., "Critical Rotating Equipment," "Furnace Assembly," or "Hydrometallurgical Plant Section") with measurable emergency reduction and schedule quality lift.
- **Duration**: 90-120 day pilot with goal of establishing baseline metrics, collecting 4-6 weeks of operational data, and demonstrating improvement.
- **KPI set for pilot**:
  - **Emergency work ratio**: Percentage of total maintenance hours scheduled as emergency/unplanned. Target: reduce from baseline (assumed 30-40%) to 15-20% by end of pilot.
  - **Schedule compliance**: Percentage of planned jobs completed on target date. Target: improve from baseline (assumed 70%) to 85-90%.
  - **MTBF on selected critical assets**: Mean time between failures on 3-5 selected high-consequences assets. Target: track baseline and demonstrate stability or improvement.
  - **Expedited part orders**: Count and cost of parts ordered with premium lead time (vs. plan). Target: reduce count by 20-30%.
  - **Maintenance cost variance**: Actual maintenance spend vs. budget, adjusted for production volume. Target: reduce overages driven by emergency work.
  
- **Value narrative for pilot proposal**: 
  "Improve preventive reliability by optimizing work preparation, scheduling discipline, and inventory intelligence. Reduce emergency maintenance costs, improve asset uptime, and accelerate knowledge transfer to new technicians. First-phase focus: planning and scheduling excellence. Second-phase opportunity: inventory optimization and targeted additive manufacturing for strategic legacy parts."

- **Success criteria for expansion**: If pilot demonstrates:
  - 50% reduction in emergency ratio, OR
  - 15+ percentage-point improvement in schedule compliance, OR
  - $500K+ annual savings in emergency/expedite costs
  Then executive case for site-wide rollout becomes straightforward, and expansion to other Glencore facilities becomes feasible.
  1) planning/scheduling optimization, and/or
  2) inventory intelligence + critical-part strategy.

## Suggested Next-Step Pilot Framing
- Pilot scope: one process area with measurable emergency reduction and schedule quality lift.
- KPI set:
  - Emergency work ratio
  - Schedule compliance
  - MTBF on selected critical assets
  - Expedited part orders
  - Maintenance cost variance
- Value narrative: “preventive reliability + better execution quality + targeted inventory intelligence.”

## One-Line Meeting Conclusion
JP confirmed strong practical value for prevention-led reliability improvements and AI-supported inventory/planning workflows, while positioning AM as high-value for selected strategic parts rather than a universal first-step solution.
