# Interview Analysis: Jens Kroeger - APNC (GE Aerospace)

**Date:** [Interview conducted]  
**Interviewee:** Jens Kroeger, Director of Technology, APNC  
**Company:** APNC (Part of GE Aerospace > Propulsion > GE Equilibrium Additive)  
**Location:** [Not specified]  
**Focus Area:** Additive Manufacturing - Metal Powders (Titanium & Nickel)

---

## Interviewee Background

### Professional Journey
- **Education:** PhD in Physics (2009), Masters in Physics, Bachelor's in Physics
- **Career Path:**
  - 1 semester college teaching (ultimately didn't pursue)
  - Postdoctoral research in academia
  - **9 years at Raymore startup** (plasma science, high-temperature processes, nanocarbon particle synthesis - progressed to Director of Technology)
  - **2019 onwards: APNC** (GE Aerospace division)

### Key Insight on Career Transition
Jens made a strategic shift from deep materials R&D to industrial production because:
- Materials development is extremely difficult and lengthy (decades from discovery to qualification)
- Startup patience requirements were unsustainable for his personal goals
- Sought more immediate impact in large enterprise environment

---

## Critical Insights on AM R&D to Production Transition

### Stage Gates & Decision Points (APNC Process)
**Small Projects (R&D focused):**
- Differentiation between R&D environment trials and production environment trials
- New sensor or improved production methods require:
  - Full documentation review against UK/RA regulations
  - Risk analysis to mitigate production environment risks
  - Impact assessment on product quality
  - **Formal validation planning** at outset (critical importance)

**Validation Framework:**
- Uses scientific method: hypothesis → support or invalidate
- Formal criteria for validation
- Validation methods documented
- Sampling frequency specified
- Strict adherence to plan

**Key Takeaway:** Validation is THE most important part of small project transitions - non-negotiable for aerospace/biomedical compliance

---

## Material Gaps in AM Standardization

### Main Challenge: Metal Powder Characterization
**Current Problem:**
- Metal powder behavior in printers is difficult to assess (even with extensive testing)
- Most tests are **not repeatable** - this is THE critical gap
- Too much variability in powder testing methodology

### Sources of Variability (Powder Rheology)
1. **Environmental factors:**
   - Humidity
   - Static electricity
2. **Powder properties:**
   - Size distribution
   - Morphology
   - Other intrinsic properties
3. **Measurement instrument issues**
4. **Technician handling variance**

### Current Testing Method (Inadequate)
- Uses funnels + timed flow tests
- Measures seconds for powder to flow through funnel ("pretty simple method")
- **High degree of limitations**, especially problematic for:
  - Low-density metals (aluminum, titanium)
  - Any application requiring high precision

### Cost of Redundant Testing
- Implicit in statement but not quantified
- Suggests significant testing duplication exists across industry
- **Opportunity:** Pre-tested powder libraries could reduce/eliminate redundant certification

---

## Risk Management Framework for AM

### Approach: Isolate & Address High-Risk Elements First

**Strategy:**
1. Separate projects into elements
2. Identify risks associated with each element
3. Watch for emerging risks at integration points
4. **Address highest-risk elements first** (fail-fast approach)

### Implementation Method:
- **Early phase:** Extensive trial-and-error
  - Do lots of tests
  - Learn rapidly
  - Mitigate risks concurrently
- **As credibility rises:**
  - Increase resource allocation
  - Plan longer timelines
  - Engage larger teams and budgets
  
**Critical Principle:** Must always maintain R&D phase for innovation. Jumping to big budgets/teams without testing basics leads to major problems.

### Aerospace Entry Model (Lesson)
Started with **brackets** (low-sensitivity components) rather than rotating parts  
→ This is the correct model for introducing AM to regulated industries

---

## Documentation & Metadata Loss During R&D→Production Transition

### APNC Quality System Components
- **ISO 9001** base (all industries)
- **Additional regulated industry certifications** for:
  - Biomedical sector
  - Aerospace sector
  
### Critical Transition Documentation

**Pre-transition Analysis Tools (NASA-originated):**
- **Security Risk Analysis** (operator safety)
- **Product Risk Analysis** (product impact)
- **Design Risk Analysis** (design integrity)
- **FMEA/DFMEA** (Failure Mode/Effects Analysis) - comprehensive failure identification

**R&D Handoff Documentation:**
- Comprehensive R&D reports
- Engineering project planning begins before production implementation
- Validation plan with multiple steps

### Stakeholder Inclusion (Critical for Success)
Must involve and document input from:
- Quality teams
- Supply chain/procurement
- Logistics teams
- Production teams
- Manufacturing engineering

**Purpose:** Capture all uncertainties, fears, questions about innovation before production

### Production Qualification Process: IQ-OQ-PQ
1. **IQ** - Installation Qualification
2. **OQ** - Operation Qualification (first run)
3. **PQ** - Production Qualification (repeat operations)

### Information Loss Risks
**How information gets lost:**
- Design strategy/sequence only in designer's head (not documented)
- Undocumented equipment complexity changes
- Process changes without clear rationale documentation

**Consequences:** Budget overruns, delivery timeline slips, project failures

---

## Prescribed Quality Assurance for Non-Critical Parts

### Jens's Key Answer: "It Depends"
**Risk Assessment Framework:**
- **Direct to consumer product?** → Higher QA requirements
- **Multi-step supply chain?** → Can accept lower QA if not customer-facing
- **Part criticality:**
  - Critical rotating engine parts → Full qualification required
  - Brackets/supporting components → Reduced qualification possible

### Aerospace Model
Started adoption with brackets → gradually moved to more critical applications  
This staged approach reduces regulatory burden while building confidence

---

## Scaling AM with AI/Machine Learning & Machine Vision

### Use Case Specificity (Critical Principle)
**Cannot blanket-apply AI/ML to manufacturing:**
- Must identify specific use cases
- Understand risk of failure for each use case
- Tolerable failure threshold varies by application

### Real-World APNC Implementation

**Translation/Language Processing:**
- Google Translate proved strong AI application
- Low risk: Incorrect translation = no catastrophic consequence
- Success model but not transferable to all domains

**Machine Vision (Current APNC Use):**
- Feature detection algorithms
- Faster and better than alternative algorithms
- **BUT must address:**
  - False positive consequences
  - False negative consequences
  - Human verification still required after ML recommendations

### Critical Success Factor
**Humans remain essential** - particularly in regulated manufacturing  
Human verification loop after ML predictions safeguards quality

---

## Platform & Ecosystem Collaboration

### Mahmoud's Concept Overview
**Goal:** Digital inventory platform connecting:
- End-user clients
- OEMs
- 3D printing facilities
- Certification/regulation bodies (DNV, Lloyd's Register)

**Purpose:** Enable on-site non-critical part production + digital inventory optimization

### Jens's Key Concern: Collaboration Barriers

**THE BIGGEST HURDLE: Intellectual Property & Confidentiality**

Oil & gas and similar industries:
- **Extremely risk-averse** about sharing supplier information
- View supply chain as competitive advantage
- Reluctant to share:
  - Supplier identities
  - Part quantities
  - Specific equipment/valve types
  - Any supply chain metrics

**Industry Attitude:** "This sounds ridiculous but companies really don't share this with public services"

### Gap Between Theory & Practice
- **Theory:** Many open collaboration platforms exist (AI, AM, nanosensors, etc.)
- **Reality:** Private companies don't engage with them
- **Partial Exception:** Very early-stage funding (when companies have no choice)
- **Rule:** When innovation becomes critical to growth/competitiveness → IP lockdown

### Current Market Pressure Assessment
**Jens's view:** No sufficient economic pressure yet to break IP barriers open  
This doesn't mean it's impossible, just the biggest hurdle remains unsolved

---

## Defense & Military as Potential Market Entry

### Opportunity Identification
- Defense/Navy actively seeking new technologies
- Increasing annual budgets for innovation
- Post-COVID revealed supply chain vulnerability (overreliance on China/Europe)
- National security interest in domestic resilience

### Military/Government Use Model
**Potential pathway:**
1. Develop platform for private sector
2. Military tests/studies it
3. If critical to operations → government mandates adoption
4. Could transition to non-public (government-only) version

**Strategic insight:** Military might be ideal first customer due to national security urgency

---

## Key Recommendations for Mahmoud's Platform

### Finding the Right First Customer (CRITICAL)
**Jens's advice:** "Define the right first customer. You're good to go for 10-30 years. If you can't find right fit, you won't go anywhere."

### Priorities to Overcome IP Inertia
1. Lock in intellectual property (copyrights, trademarks, patents)
2. Find individual decision-makers with specific problems
3. Build relationships before asking for ecosystem participation
4. Consider government/military as near-term customer
5. Prepare for 2-3 year regulatory/procurement cycles in Canada

---

## Critical Success Factors

✅ **Jens emphasized:**
- Don't give up, even if it looks grim - belief is key
- Understand your market positioning
- Know more than the people you're selling to
- Focus on finding that one right customer first
- Build patience into your timeline
- Validate assumptions rigorously before scaling

---

## Relevant Experience for Mahmoud's Thesis

**Most Relevant to Oil & Gas + AM:**
1. Powder characterization challenges (applies to custom-printed parts)
2. Risk management framework (applies to offshore reliability)
3. Documentation/metadata loss problem (applies to distributed manufacturing)
4. Multi-stakeholder coordination (applies to ecosystem)
5. IP as primary barrier to collaboration (key market insight)

---

## Follow-Up Opportunities

Jens expressed willingness for future touchbase in 15-20 minutes to:
- Share updated learnings
- Provide market validation (if progress on first customer)
- Discuss technical challenges as they emerge

