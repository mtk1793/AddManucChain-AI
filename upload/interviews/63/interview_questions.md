#---
interviewee: "Jens Kroeger"
position: "Engineering & Technology Lead, AP&C—A Colibrium Additive Company"
focus_areas:
   - Additive manufacturing technology
   - Materials science
   - Production scaling
interview_number: 63
date: ""
interviewer: ""
tags: [additive, materials, manufacturing, digital-inventory, am-platform, apc]
#---
# Interview Questions: Jens Kroeger — Engineering & Technology Lead, AP&C
**Interviewee:** Jens Kroeger  
**Position:** Engineering & Technology Lead, AP&C—A Colibrium Additive Company  
**Focus Areas:** R&D de-risking, materials validation, production scaling, risk management  
**Interview Purpose:** Understand the R&D-to-production bottlenecks, materials data gaps, and how digital orchestration could accelerate technology transfer from concept to full-scale manufacturing

---

## SNAPSHOT SUMMARY: Interview 63 (Prepared)

**Interviewee Profile:** Jens Kroeger, AP&C (manufacturing partner, materials expertise, production scaling focus)  
**Interview Status:** Prepared (7 questions finalized); Ready to conduct  
**Key Focus:** R&D-to-production de-risking, materials validation costs, yield/quality drops, risk management frameworks, production scaling

**Expected Insights:**
- Materials qualification bottlenecks ($20k–$100k per part family testing costs)
- Yield drops during scale-up (lab 90% → production 75%+)
- Risk management frameworks (de-risking budget allocation, timeline pressure, failure costs)
- Design rework cycles ($50k–$200k per major design iteration)
- Process scaling complexity (handling batch variability, defect prevention, traceability)
- Batch traceability economics ($5k–$50k investigation costs for field failures)

**Strategic Value:** Bridge between certification/compliance (CNRL/ExxonMobil insight) and production reality (AP&C manufacturing perspective). Validates that digital orchestration + materials data could accelerate cost amortization across multiple part families.

---

---

## Main Questions (5)

### Q1: R&D-to-Production De-Risking: The Validation Pipeline & Cost of Scale Failures

**Key Question:**
Walk me through AP&C's detailed process for de-risking a technology from initial concept through full production qualification. What are the critical stages, gates, decision points? and how much yield/quality typically drops when moving from lab to production (e.g., 90% → 75%)?

**Sub-questions:**
- From initial concept to production-ready (including IQ/OQ/PQ), what's a typical timeline and budget? Does it vary significantly between materials vs. process innovations? (e.g., $50k–$500k per project?)
- How do you approach the transition from lab-scale validation (10–50 part batches) to pilot production (100–500 parts) to full-scale manufacturing (1,000+/month)? What's the cost difference?
- What's your risk-gating process? How do you decide which technical risks to address first vs. which can be deferred?
- When you move from R&D to pilot production, what percentage of designs require rework or re-testing? What are the costs of these failures?
- How much does production yield or part quality typically change when you move from lab to production? (e.g., "90% yield in lab, 75% in production"?)
- What's the biggest bottleneck and its cost impact: the actual testing/validation work, the documentation and compliance reporting, the approval cycles, or cross-team communication?
- If a material or process fails at pilot scale (after $100k+ investment), what's the typical cost to pivot or recover?

---

### Q2: Materials Data Gaps, Testing Redundancy & Cost of Qualification

**Key Question:**
From your materials expertise, what are the most significant gaps in standardized materials characterization for AM? Where does redundant testing happen—and what does that cost? How much could you save with a verified materials database ($30k–$50k per project, 3–6 months compression)?

**Sub-questions:**
- When AP&C qualifies a new material (alloy, powder chemistry, heat treatment condition), what's the full testing matrix? (tensile, fatigue, thermal cycling, environmental exposure, batch variation, geometry effects?)
- How much does materials qualification typically cost? (e.g., $20k–$100k per material/condition?) How much of that is duplicated testing?
- How much of your testing work duplicates characterization that's already been published or done by material suppliers, equipment OEMs, or other manufacturers?
- For critical properties (fatigue strength, fracture toughness, corrosion resistance), do you trust third-party data (supplier certs, published research) or do you always re-test? What's the cost delta if you reuse external data vs. generating your own?
- If you could access a verified materials database with fatigue curves, thermal properties, and environmental effects for common AM alloys, how much development time and cost would that save per project? (e.g., "3–6 months, $30k–$50k"?)
- Are there materials or conditions where standardized data doesn't exist at all? (e.g., hyperaging conditions, post-processing combinations?) What does that cost you?
- How do you handle batch-to-batch variation in powder or equipment? Do you re-test for every batch, or use statistical acceptance? What's the cost of each approach?

---

### Q3: Risk Management, De-Risking Strategy & ROI of Testing

**Key Question:**
You mentioned "addressing high-risk elements first with fast-paced tests." Walk me through your risk management framework—how do you identify, prioritize, validate risk reduction? What's the cost per de-risking experiment, and for a typical project, what percentage of your timeline and budget is spent on risk reduction ? 
**Sub-questions:**
- How do you conduct risk identification for a new material or process? (HAZOP, WHAT-IF, FMEA, or something else?) What's the cost of a formal risk assessment?
- What metrics do you use to score risk? (likelihood × impact, or something more nuanced?) How do you score "unproven assumptions"?
- Once you've identified high-risk elements, how do you design de-risking experiments? What's your approach to "fast-paced testing" while still maintaining statistical validity? What's the cost per experiment?
- Are there risks that can be addressed in parallel vs. sequentially? How do you manage the dependencies? Does parallelization increase costs but save time?
- For a typical project, what percentage of your timeline and budget is spent on risk reduction (testing, validation, documentation) vs. developing new capabilities? (e.g., "30% of timeline, 40% of budget"?)
- How do you know when a risk has been sufficiently de-risked? What's your exit criteria? Is it a specific test result, a threshold, or something qualitative?
- Have you encountered cases where R&D de-risking work didn't translate to production? What was the root cause, and what did those failures cost?
- What's the cost of moving forward with an insufficiently de-risked technology? (e.g., "One production failure costs $500k in scrap + warranty claims"?)
- Do you document your risk assessments and de-risking rationale in a way that's accessible to production before handoff?

---

### Q4: Design Documentation, Knowledge Transfer & Cost of Rework at Scale

**Key Question:**
When you transition a validated design from R&D to production, what metadata and documentation must transfer? Where does information loss happen, and what does rework cost in production? 

**Sub-questions:**
- What's the complete set of documentation required for a design to be production-ready? (CAD, heat treatment specs, process parameters, material batch requirements, inspection criteria, environmental limits, material substitution rules, known failure modes?)
- How much of this documentation is currently digital vs. paper-based or in people's heads?
- Do you currently have a system to track "which design is certified for which application"? (e.g., "Part X certified for 600°C service in marine environments"?)
- How many design iterations typically occur between initial R&D validation and production release? What changes and why? What's the cost per iteration?
- What's the most common reason a design requires rework after moving to production? (incomplete specifications, untested assumptions, manufacturing constraints not captured, operator error?) 
- When design rework is needed in production, what's the typical cost? (e.g., "$50k–$200k per design + 4–8 week delay"?)
- How do you handle design changes or corrections after a part is already in the field? How do you track which batches have the old design vs. new? What's the liability exposure?
- If a part fails in service, how quickly can you trace back to understand which design version was used, what assumptions were made in R&D, and what conditions contributed? (hours, days, weeks?)
- Are there designs or processes that are "too complex" to fully document? How do you manage that knowledge, and what's the risk?

---

### Q5: Process Scaling, Quality Control & Cost of Defects at Scale

**Key Question:**
You mentioned combining "old and new technology from metallurgy and additive manufacturing to machine vision and machine learning." What does that look like in practice, and what problems are you trying to solve at scale? What's the cost of implementation (ML/vision systems)?

**Sub-questions:**
- What's your current approach to real-time process monitoring during AM build? (Are you collecting build data, visual inspection, or something else?) What's the cost of implementing ML/vision systems?
- How do you catch process drift before it results in failed parts? (Do you use control charts, statistical sampling, or predictive models?) What's the cost of a single missed defect? (e.g., scrap + warranty + liability?)
- Where would machine learning add the most value in your production process? (Parameter optimization, defect prediction, material traceability?) What's the expected ROI?
- For batch-to-batch consistency, how do you confirm that powder, equipment, and environmental conditions are within spec? What's the cost/effort per batch?
- Have you experienced quality surprises at scale that weren't visible in R&D? (e.g., residual stress, thermal gradients, size effects, handling damage?) What did those failures cost?
- If you could predict which parts would fail before they reach the customer (based on build data + materials testing + design factors), would that change your quality strategy? What's the cost of prediction vs. cost of field failures?
- What's your post-delivery analytics approach? Do you have feedback loops from customer failures back to your materials/process team? What's the latency (days, weeks)?
- Are there process parameters or material properties that are difficult to characterize or predict? Where does intuition or empirical trial-and-error still dominate, and what does that cost?
- Across your portfolio, what percentage of parts have defects or require rework? What's the trend over time?

---

## Bonus Questions (2)

### Q6: Batch Traceability, Compliance & Economics of Field Failures

**Key Question:**
Walk me through your batch traceability system. If a part fails in service, how quickly can you trace it back to the original decision? What's the typical cost of a field failure investigation + response?

**Sub-questions:**
- What data points must you capture for a production part to meet compliance? (material batch, powder lot, machine ID, build parameters, post-processing history, testing results, operator, certification authority?)
- How is this data currently stored and accessed? (integrated database, spreadsheets, lab notebooks, manufacturing logs?) Can you query it efficiently?
- For a field failure, what's your root cause analysis process? On average, how long does it take to fully understand what went wrong? (days, weeks?)
- When a field failure occurs, what's the typical cost to investigate + respond? (investigation $5k–$50k, warranty replacement $10k–$100k+, reputational damage?)
- Are there design or material decisions that, in retrospect, you'd handle differently? What would you change, and why? What would that have cost to fix earlier?
- What regulatory or customer audit requirements do you face around documentation and traceability? Are those burdensome, and what's the cost of compliance?
- Do you maintain long-term records (5+ years) on all parts, or only a subset? What's the annual cost of record-keeping vs. potential liability from not having records?
- Have you had product recalls or field failures that could have been prevented with better traceability? What did those cost?
- What percentage of your production cost is spent on documentation and record-keeping?

---

### Q7: Lessons Learned: R&D Strategy, Scaling, and Industry Evolution

**Key Question:**
Based on your 15+ years managing R&D teams (graphene batteries, AM materials, current portfolio), what were you wrong about early in your career regarding timeline and cost to get R&D to production? When scaling from lab (10–50 parts) to high-volume (1,000+/month), what surprised you most, and what should the industry prioritize to break through today's bottlenecks?

**Sub-questions:**
- Early in your career, what were you wrong about in terms of how fast and how cheaply you could get R&D to production?
- When scaling from small batches to high-volume production, what surprised you most? What would you advise someone else to watch for?
- Looking at the AM industry today, what's holding back wider adoption? Is it technical maturity, supply chain, certification/regulatory frameworks, cost, or something else?
- If you were starting a new AM materials project from scratch today, what would you do differently compared to when you started at AP&C?
- Are there any areas of R&D methodology or manufacturing engineering where you feel the industry is still "behind"? (e.g., process control, data analytics, risk management?)
- As you look at the next 3–5 years, what do you think will be the biggest bottleneck for AM scaling—and what needs to happen to break that bottleneck?

---

## At End of Interview

*Based on what you've described about coordination challenges, data gaps, and validation complexity, we're exploring whether a platform that integrates traceability, process tracking, and cross-functional visibility could help teams move from R&D validation to production faster. Does that seem like a real problem you're facing?*
