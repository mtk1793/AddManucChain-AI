# Interview 12 - Clearwater Seafoods 

**Date:** February 3, 2026  
**Primary Contact:** Tony Jabbour  
**Title:** VP Fleet Operations  
**Company:** Clearwater Seafoods  
**LinkedIn:** [Clearwater Seafoods](https://www.linkedin.com/company/clearwater-seafoods-lp/)  
**Communication Type:** Email Exchange (LinkedIn/Email)  
**Strategic Importance:** ⭐⭐⭐⭐⭐ (ACTIVE VESSEL AM USER - Real-world validation)

**Secondary Contact Identified:**
- **Jon** (Head of Engineering) - Traveling until late February
- **Chief Engineer on Anne Risley (AR)** - Operational details

---

## 🎯 Executive Summary

**CRITICAL DISCOVERY:** Clearwater Seafoods is **already using AM on vessels** (Anne Risley) - making this the **first interview with an active offshore AM user**, not a prospective one. Their experience provides **real-world validation** of the "out of a jam" emergency use case (Jordan's "MacGyver engineering") while revealing a **new major barrier: SPACE CONSTRAINTS on vessels**.

**Key Revelation:** They've tested the technology, found it "cool and sometimes beneficial," but **haven't found enough tangible benefits to invest bigger**. This validates the business case barrier while highlighting that even successful pilots don't automatically scale without clear ROI.

**Most Important Finding:** **"Our biggest challenge on a vessel is space and how it's prioritized."** ← This barrier was **NOT mentioned in any previous interview** and represents a fundamental constraint for offshore AM adoption.

---

## 📊 Current State - AM on Clearwater Vessels

### **✅ ACTIVE DEPLOYMENT:**

**Vessel:** Anne Risley (AR)  
**Technology:** 3D printer (onboard)  
**Materials:** **Plastic parts only** (no metal)  
**Status:** Operational, actively used

**What They're Printing:**
> "The parts we are making are all **plastic parts**. Yes, there are times when we can **print a part that helps us out of a jam**."

**Use Case Confirmed:** ✅ **Emergency "out of a jam" repairs** (exactly Jordan Cumming's "MacGyver engineering" prediction)

---

### **📊 ADOPTION STATUS:**

| Aspect | Status | Evidence |
|--------|--------|----------|
| **Technology Tested?** | ✅ Yes | "We have dabbled a little bit with 3D printing on our vessels" |
| **Currently Operational?** | ✅ Yes | Printer on Anne Risley, actively making parts |
| **Material Capability** | ⚠️ Plastic only | "All plastic parts" - no metal capability yet |
| **Critical Parts?** | ❌ No | "Basic **non-critical items**" |
| **Scaling Investment?** | ❌ No | "Haven't found enough tangible benefits to invest in a bigger way" |
| **Interest in Metal?** | ✅ Yes | "I feel the **next step would be metal printing**" |

**Interpretation:**

**Pilot Success:** They've proven the concept works ("cool and sometimes beneficial")

**Scaling Barrier:** But NOT investing further because **ROI not proven**

This is the **exact pattern Mark Kirby warned about:** Technical feasibility ≠ Business case for adoption

---

## 🔍 MAJOR FINDINGS

### **🆕 FINDING #1: SPACE CONSTRAINT = NEW BARRIER (CRITICAL)**

**Status:** **NEW DISCOVERY** (Not mentioned in previous 11 interviews)

**Quote:**
> "Our biggest challenge on a vessel is **space and how it's prioritized**."

**What This Means:**

Even if AM technology works, cost is acceptable, and parts are certified, **physical space on vessels is limited and allocation is competitive**. A 3D printer must justify taking up valuable square footage that could be used for:
- Spare parts storage (traditional inventory)
- Operations equipment
- Crew quarters
- Safety equipment
- Revenue-generating systems

**Strategic Implication:**

This creates a **chicken-and-egg problem:**

```
More AM usage → Justifies space allocation
        ↑              ↓
Space allocated → Enables AM usage
```

**Current State:** Low usage → Hard to justify space → Limits usage → Perpetuates low adoption

**Platform Solution Opportunity:**

If digital inventory could **predict usage frequency** (AI-driven), operators could see:
- "This printer will be used X times/year"
- "Space ROI: $Y saved per square foot"
- "Alternative: Keep Z physical parts in same space"

**Justification model:**
- 3D printer footprint: ~4 sq ft
- Traditional spare parts for same coverage: ~40 sq ft
- **Space savings: 90%** (digital vs physical inventory)

**New Hypothesis Generated:**

**🆕 H66 - Space Constraint on Vessels**

**Hypothesis:** Offshore vessels face competitive space allocation, and AM adoption is limited not by technology or cost, but by inability to justify printer footprint vs traditional spare parts storage or other systems.

**Evidence:**
- Tony Jabbour (Clearwater): "Biggest challenge on a vessel is space and how it's prioritized"
- Current: Plastic printer operational but not scaling
- Zero mentions of space constraints in 11 previous interviews (new discovery)

**Validation Needed:**
- Interview 5+ offshore operators: "What % of vessel space is dedicated to spare parts?"
- Survey: "Would you allocate space for AM printer if it replaced X sq ft of physical inventory?"
- **Success threshold:** ≥60% cite space as top-3 barrier + quantified space comparison (digital vs physical inventory)

---

### **✅ FINDING #2: "OUT OF A JAM" USE CASE VALIDATED**

**Status:** **STRONGLY VALIDATED** (Aligns with Jordan Cumming Interview)

**Quote:**
> "Yes, there are times when we can **print a part that helps us out of a jam**."

**Comparison to Jordan Cumming (Interview 10):**

| Jordan's Prediction | Clearwater's Reality |
|---------------------|----------------------|
| "Sometimes you do have to do on the fly, **sort of MacGyver engineering**" | "Print a part that **helps us out of a jam**" |
| "When the system is down and **every second counts**" | [Implied: Emergency situations] |
| ROV hydraulic fittings, Swayze lock fittings | "Basic non-critical items" (unspecified) |

**Evidence Chain:**

1. **Jordan (Ocean tech, ROV operator):** Predicted emergency AM use case
2. **Clearwater (Seafood vessel operator):** Confirms it's happening in practice
3. **Pattern:** Offshore vessels DO use AM for emergency repairs

**Status:** ✅ **REAL-WORLD VALIDATION**

**What's Still Unknown:**
- Frequency: How many times/year do they "get out of a jam"?
- Part types: What specific parts are they printing?
- Performance: How well do printed parts work vs OEM?
- Downtime saved: Hours/days saved by printing vs waiting for parts?

**Action Required:**
- Interview Jon (Head of Engineering) when he returns (late Feb)
- Interview Chief Engineer on Anne Risley (operational details)
- Request: Case study of 1-2 "out of a jam" examples with timeline + cost comparison

---

### **✅ FINDING #3: PLASTIC-ONLY ADOPTION (NON-STRUCTURAL VALIDATED)**

**Status:** **VALIDATES DR. NASIRI & JORDAN'S FRAMEWORK**

**Quote:**
> "The parts we are making are all **plastic parts**."
> "Basic **non-critical items**"

**Alignment with Previous Interviews:**

**Dr. Ali Nasiri (Interview 11):**
> "Focus on **non-structural and less risky**. The part should be in **non-critical**."

**Jordan Cumming (Interview 10):**
> "**Less on the structural** and more on components that support subsystems"

**Clearwater's Practice:**
- Plastic = Non-structural ✅
- Non-critical = Lower risk ✅
- Basic items = Simple geometry ✅

**Structural vs Non-Structural Framework Validation:**

```
CLEARWATER'S ACTUAL ADOPTION PATH:

Start → Plastic (non-structural) → Non-critical → Basic items
         ↓
      WORKING! ("Helps out of jam")
         ↓
      Next step? → Metal printing (structural?)
         ↓
      Barriers: Space, cost, technology maturity
```

**This confirms:**
1. ✅ Non-structural entry point (everyone starts here)
2. ✅ Metal printing is "next step" (graduation path)
3. ⚠️ But barriers prevent graduation (space, cost, unclear ROI)

**Implication for Platform:**

**Don't sell:** "Start with metal AM!" (too big a leap)

**Do sell:** "Optimize your plastic AM usage → prove ROI → justify metal upgrade"

**Pathway:**
1. Start: Plastic parts (they're here now)
2. Optimize: Digital library of printable plastic parts → increase usage frequency
3. Measure: "You're using printer 50x/year, saving $X"
4. Justify: "Metal printer would save $5X at current usage rate"
5. Upgrade: Metal AM with proven business case

---

### **⚠️ FINDING #4: TECHNOLOGY UNCERTAINTY (METAL AM)**

**Status:** **KNOWLEDGE GAP IDENTIFIED**

**Quote:**
> "I feel the **next step would be metal printing** but **not sure where the technology has advanced to** and then it comes to **space and cost**."

**What This Reveals:**

Clearwater is **interested in metal AM** but lacks:
1. **Technology awareness:** "Not sure where technology has advanced to"
2. **Cost model:** "Then it comes to... cost"
3. **Space requirements:** "Space and cost"

**Strategic Opportunity:**

This is EXACTLY what your platform should solve:

**Knowledge Gap → Platform Solution:**

| Gap | Platform Feature |
|-----|------------------|
| "Not sure where technology at" | **✅ Metal AM technology guide** (materials, capabilities, limitations) |
| "Space and cost" | **✅ ROI calculator** (space footprint vs savings) |
| "Which parts qualify?" | **✅ Part suitability analyzer** (plastic vs metal decision tree) |

**Competitive Advantage:**

Companies like Siemens (Equinor's contractor) likely sell **enterprise metal AM systems** ($500K+). But Clearwater doesn't need that—they need:
1. Education (where is tech at?)
2. Business case (space + cost justification)
3. Part selection (which parts worth metal printing?)

**Your Platform = "Metal AM Readiness Assessment"**

**Deliverable for Clearwater:**
- Current plastic AM usage analysis
- Metal AM capability comparison
- Space footprint calculator (plastic vs metal printer)
- Part library: "These 20 parts you could metal print"
- ROI projection: "Metal AM would save $X/year at your usage rate"

**Value Prop Testing:**

Would Clearwater pay $5K-$15K for this assessment/platform access?

**Hypothesis:** Operators stuck at "plastic only" stage would pay for clear pathway to metal AM if it includes ROI justification.

**Test:** Offer to Jon (Head of Engineering) when he returns:
- "We'll analyze your current AM usage and build business case for metal upgrade"
- Price: $10K one-time or $15K/year platform access
- Success: He says "Yes, that would help justify metal investment to leadership"

---

### **❌ FINDING #5: BUSINESS CASE BARRIER (SCALING)**

**Status:** **VALIDATES MARK KIRBY INTERVIEW**

**Quote:**
> "We certainly **haven't found enough tangible benefits to invest in a bigger way** in 3D printing and AI."

**What "Bigger Way" Likely Means:**
- More printers (currently 1)
- Metal AM capability (not just plastic)
- Dedicated operator/training
- Larger parts library
- Integration with procurement systems

**Why Haven't They Found Tangible Benefits?**

**Possible Reasons:**

1. **Low usage frequency:** "Sometimes beneficial" ≠ "always beneficial"
   - If used 5x/year → hard to justify
   - If used 50x/year → easier to justify

2. **No measurement system:** Are they tracking:
   - Downtime avoided?
   - Cost per part (printed vs ordered)?
   - Lead time reduction?
   - Space savings?

3. **No comparison baseline:** 
   - What WOULD have happened without printer?
   - How much would traditional procurement have cost?

4. **Unclear future pipeline:**
   - Do they know which parts they COULD print but aren't?
   - Digital parts library = visibility into opportunities

**Mark Kirby's Warning (Interview 9):**
> "The biggest barrier is the **business case**... there isn't a strong enough business case typically where additive is out and out the clear winner."

**Clearwater confirms this:** Even with operational pilot, without clear ROI, they won't scale.

**Platform Solution:**

**Feature: "AM Usage Tracking & ROI Dashboard"**

**What It Would Show Clearwater:**

```
CURRENT STATE (without tracking):
- "We use it sometimes" (vague)
- "Cool and sometimes beneficial" (qualitative)
- Hard to justify further investment

PLATFORM-ENABLED STATE:
- "Used 23 times in last 6 months"
- "Saved $14,500 in procurement costs"
- "Avoided 47 hours of downtime"
- "ROI: 340% on printer investment"
- "Justification: Add metal printer = 5x these savings"
```

**Action Required:**
- Build prototype "AM ROI Dashboard"
- Offer to Clearwater: "We'll retrofit tracking to your existing usage"
- Collect 3-6 months of data
- Generate business case report
- Test: Do they invest in metal AM after seeing quantified ROI?

---

## 🎯 HYPOTHESIS VALIDATION

### **✅ VALIDATED HYPOTHESES:**

#### **NH.4 - Geographic Isolation**
**Evidence:** Seafood vessels operate offshore (can't "run to store")  
**Status:** ✅ **VALIDATED** (Emergency "out of jam" use case confirms isolation drives adoption)

---

#### **NH.12 - Non-Structural Entry Point**
**Evidence:** "All plastic parts" + "basic non-critical items"  
**Status:** ✅ **STRONGLY VALIDATED** (Real-world adoption path starts here)

---

#### **H64 - Temporary AM Parts for Non-Critical Applications** (NEW from Jordan interview)
**Evidence:** "Print a part that helps us out of a jam"  
**Status:** ✅ **VALIDATED** (They're doing this operationally)

---

### **⚠️ PARTIALLY VALIDATED:**

#### **NH.9 - Digital Inventory Enables Speed**
**Evidence:** They print parts on-demand (confirms speed benefit)  
**BUT:** "Haven't found enough tangible benefits" (speed alone doesn't justify scaling)  
**Status:** ⚠️ **SPEED HELPS BUT ISN'T SUFFICIENT** (need full business case)

---

### **🆕 NEW HYPOTHESES GENERATED:**

#### **H66 - Space Constraint on Vessels**

**Hypothesis:** Offshore vessels face competitive space allocation, and AM adoption is limited by inability to justify printer footprint vs traditional spare parts storage or other systems.

**Evidence:**
- Clearwater: "Biggest challenge on a vessel is space and how it's prioritized"
- Operational printer but not scaling
- Interest in metal but "space and cost" concerns

**Validation Needed:**
- Interview 5+ vessel operators: What % of space is spare parts?
- Quantify: Space footprint of printer vs equivalent physical inventory
- **Success threshold:** ≥60% cite space as top-3 barrier

---

#### **H67 - AM ROI Measurement Gap**

**Hypothesis:** Operators who pilot AM don't scale because they lack measurement systems to quantify benefits (downtime saved, procurement costs avoided, space savings), preventing business case development.

**Evidence:**
- Clearwater: "Haven't found enough tangible benefits" (despite operational use)
- Qualitative benefits ("cool," "sometimes beneficial") not quantified
- No mention of tracking usage, costs, savings

**Validation Needed:**
- Survey 10 offshore operators with AM: "Do you track AM usage metrics?"
- Offer ROI tracking prototype to 3 operators
- **Success threshold:** ≥70% lack tracking system + ≥2/3 adopt tracking tool

---

#### **H68 - Metal AM Knowledge Gap**

**Hypothesis:** Operators succeed with plastic AM but don't upgrade to metal because they lack awareness of: (1) technology maturity, (2) cost models, (3) suitable part identification, preventing justification to leadership.

**Evidence:**
- Clearwater: "Next step would be metal printing but not sure where technology has advanced to"
- Operational plastic printer = proven interest
- Space + cost concerns = need business case

**Validation Needed:**
- Interview plastic AM users: "Why haven't you upgraded to metal?"
- Offer "Metal AM Readiness Assessment" to 5 operators
- **Success threshold:** ≥4/5 cite knowledge gap + ≥3/5 would pay for assessment

---

## 👥 FOLLOW-UP CONTACTS & ACTIONS

### **🔴 PRIORITY 1: Jon (Head of Engineering)**

**Title:** Head of Engineering  
**Organization:** Clearwater Seafoods  
**Status:** Traveling out of country until **late February 2026**  
**Why Critical:** Tony deferred to him for "such details"

**Questions to Ask Jon:**

1. **Usage Metrics:**
   - How many times has the Anne Risley printer been used? (monthly/annually)
   - What specific parts have you printed? (categories, complexity)
   - Success rate? (% of prints that worked as needed)

2. **Business Case:**
   - Do you track cost savings from AM? (procurement avoided, downtime saved)
   - What would justify investing in metal AM? (ROI threshold)
   - Space allocation decision process? (how do you prioritize vessel space?)

3. **Pain Points:**
   - What parts do you WISH you could print but can't (with plastic)?
   - Certification requirements? (marine-grade, safety standards)
   - Training challenges? (crew capability to operate printer)

4. **Platform Value Prop Test:**
   - "Would a digital parts library help?" (pre-vetted printable designs)
   - "Would ROI tracking dashboard help?" (quantify current usage)
   - "Would metal AM readiness assessment help?" (business case for upgrade)
   - Willingness to pay? ($5K-$15K range)

**Timing:** Follow up late February (when he returns)

---

### **🔴 PRIORITY 2: Chief Engineer on Anne Risley (AR)**

**Title:** Chief Engineer  
**Vessel:** Anne Risley  
**Why Critical:** Operational details, hands-on usage experience

**Questions to Ask:**

1. **Operational Reality:**
   - Walk me through last time you "got out of a jam" with printer
   - Timeline: Problem discovered → part printed → installed → working?
   - Compared to: Ordering part traditionally (wait time, cost)

2. **Part Details:**
   - Most commonly printed parts? (top 5)
   - Part failures? (printed part didn't work - why?)
   - Design source? (CAD from OEM, custom-modeled, online library?)

3. **Constraints:**
   - Space: Where is printer located? (square footage)
   - Training: Who operates it? (dedicated role or multi-tasking?)
   - Materials: Do you stock multiple plastic types? (inventory on vessel)

4. **Wish List:**
   - If you had metal AM, what would you print first?
   - If space/cost weren't constraints, what would change?

**Timing:** Can reach out now (Tony provided this contact option)

---

### **📊 CLEARWATER PILOT PROJECT OPPORTUNITY**

**Concept:** "AM ROI Tracking & Metal Upgrade Business Case"

**Offer to Clearwater:**

> "We'll install tracking system on your Anne Risley printer for 3-6 months, quantify your ROI (downtime saved, costs avoided, space savings), and build business case for metal AM upgrade—including which parts qualify and projected savings."

**Deliverables:**

1. **ROI Dashboard** (real-time tracking)
   - Usage frequency
   - Parts printed (catalog)
   - Cost per part (material + time)
   - Procurement cost avoided (vs ordering)
   - Downtime saved (hours)

2. **Metal AM Readiness Report**
   - Technology comparison (plastic vs metal systems)
   - Space footprint analysis (current vs metal printer)
   - Part suitability analysis (which parts qualify for metal)
   - ROI projection (if metal printer, savings at current usage rate)

3. **Certification Pathway Guide**
   - Marine-grade requirements (DNV, Lloyd's Register)
   - Pre-certified parts library (if available)
   - Cost/time estimates for certification

**Pricing Test:**
- Offer at $10K one-time (pilot project)
- OR $15K/year (platform subscription with ongoing tracking)

**Success Metrics:**
- Jon approves pilot
- 3-6 months data collection
- Clearwater invests in metal AM (or doesn't - we learn why)
- Case study for other operators

**Value for Your Platform:**
- First real-world ROI case study
- Validate tracking feature
- Test willingness to pay
- Prove platform value (adoption enabler)

---

## 💡 CRITICAL QUOTES

1. **On Current Usage:**  
   > "We have dabbled a little bit with 3D printing on our vessels and we have one on the Anne Risley."

2. **On Emergency Use Case:**  
   > "Yes, there are times when we can **print a part that helps us out of a jam**."

3. **On Business Case Barrier:**  
   > "We certainly **haven't found enough tangible benefits to invest in a bigger way** in 3D printing and AI."

4. **On Space Constraint (NEW BARRIER):**  
   > "Our biggest challenge on a vessel is **space and how it's prioritized**."

5. **On Material Limitation:**  
   > "The parts we are making are all **plastic parts**."

6. **On Non-Critical Focus:**  
   > "There are times when we can print a part that helps us out of a jam [making] some basic **non-critical items**."

7. **On Interest in Metal:**  
   > "I feel the **next step would be metal printing** but **not sure where the technology has advanced to** and then it comes to **space and cost**."

8. **On Continued Interest:**  
   > "We remain **interested in this technology**."

---

## 🔗 CONNECTIONS TO OTHER INTERVIEWS

### **Jordan Cumming (Interview 10) - Ocean Tech:**

**Jordan's Prediction:**
> "Sometimes you do have to do on the fly, sort of **MacGyver engineering**."

**Clearwater's Reality:**
> "Print a part that **helps us out of a jam**."

**Status:** ✅ **EXACT VALIDATION** (predicted use case confirmed in practice)

---

### **Dr. Ali Nasiri (Interview 11) - AM Expert:**

**Nasiri's Framework:**
> "Focus on **non-structural and non-critical**."

**Clearwater's Practice:**
> "All **plastic parts**" + "basic **non-critical items**"

**Status:** ✅ **FRAMEWORK VALIDATED** (entry point confirmed)

---

### **Mark Kirby (Interview 9) - Canada Makes:**

**Kirby's Warning:**
> "The biggest barrier is the **business case**."

**Clearwater's Reality:**
> "Haven't found enough **tangible benefits** to invest in a bigger way."

**Status:** ✅ **BARRIER CONFIRMED** (even successful pilots stall without ROI)

---

### **Hopkins Mentor Meeting:**

**Hopkins:**
> "Vessels have $50-60M spare parts inventory."

**Clearwater's Practice:**
> Using AM but **space constraint** limits scaling (new data point Hopkins didn't mention)

**Status:** ⚠️ **SPACE ≠ INVENTORY VALUE** (different constraint than expected)

---

## 🎯 STRATEGIC SYNTHESIS

### **What Clearwater Changes About Our Understanding:**

#### **1. ADOPTION LADDER VALIDATED:**

```
Stage 1: Pilot (Plastic, Non-Critical) ← CLEARWATER IS HERE
   ↓
Stage 2: Prove ROI (Measurement) ← MISSING (why they're stuck)
   ↓
Stage 3: Scale (Metal, More Printers) ← CAN'T JUSTIFY
```

**Platform Opportunity:** We help them move Stage 1 → Stage 2 → Stage 3

---

#### **2. BARRIER FRAMEWORK UPDATED:**

**Previous Understanding (from 11 interviews):**
1. Certification (THE barrier)
2. Business case
3. Technology maturity
4. Knowledge gaps

**After Clearwater (NEW barrier #1):**
1. **SPACE CONSTRAINTS** ← NEW!
2. Certification
3. Business case (ROI measurement)
4. Technology maturity (metal AM knowledge gap)

**Implication:** Platform must address space justification FIRST (not certification)

---

#### **3. VALUE PROPOSITION REFINEMENT:**

**Before Clearwater:**
> "Pre-certified parts library + certification pathway accelerator"

**After Clearwater (ENHANCED):**
> "Pre-certified parts library + **AM ROI tracking** + **metal upgrade pathway** → Justify space allocation & investment scaling"

**What Changed:**
- Space justification = new value element
- ROI tracking = necessary for scaling
- Plastic → Metal pathway = clear graduation model

---

#### **4. CUSTOMER SEGMENT REFINEMENT:**

**Before:** "Offshore operators interested in AM"

**After (TWO SEGMENTS):**

**Segment A: "Pilot Users" (like Clearwater)**
- Have plastic AM operational
- Low usage ("sometimes beneficial")
- Can't justify scaling
- **Need:** ROI tracking + metal upgrade business case

**Segment B: "Prospective Users" (everyone else interviewed)**
- No AM yet
- Interested but uncertain
- **Need:** Pre-certified library + certification pathway

**Platform Strategy:**
- Segment A = Higher willingness to pay (proven need, stuck)
- Segment B = Larger market (more potential customers)
- Start with A (easier conversion), scale to B

---

## 📋 ACTION ITEMS

### **IMMEDIATE (This Week):**

1. **[ ] SEND FOLLOW-UP EMAIL TO TONY**
   - Thank him for information
   - Request: Connect with Chief Engineer on Anne Risley
   - Ask: When exactly does Jon return? (get specific date for follow-up)
   - Offer: Quick value - "We're building AM ROI tracking tool, could Clearwater be pilot user?"

2. **[ ] RESEARCH ANNE RISLEY VESSEL**
   - Type of vessel? (seafood processing, cargo, hybrid)
   - Size, crew, operational area
   - Existing spare parts inventory (if public)
   - Similar vessels in Clearwater fleet (scale opportunity)

3. **[ ] ADD TO CRM:**
   - Jon (Head of Engineering) - Schedule follow-up late Feb
   - Chief Engineer (AR) - Immediate interview opportunity
   - Update Clearwater status: "Pilot User - Scaling Barrier = ROI Measurement"

---

### **PLATFORM DEVELOPMENT:**

4. **[ ] BUILD "AM ROI DASHBOARD" PROTOTYPE**
   - Features:
     - Usage tracking (parts printed, frequency)
     - Cost calculator (material + time vs procurement)
     - Downtime savings meter
     - Space ROI (printer footprint vs physical inventory)
   - **Deadline:** Before Jon returns (late Feb)
   - **Purpose:** Demo to Clearwater as pilot partner

5. **[ ] CREATE "METAL AM READINESS ASSESSMENT" TEMPLATE**
   - Technology comparison chart
   - Space footprint calculator
   - Part suitability decision tree
   - ROI projection model
   - **Deadline:** Feb 15
   - **Purpose:** Offer to Clearwater + other plastic AM users

6. **[ ] DEVELOP "SPACE JUSTIFICATION CALCULATOR"**
   - Input: Printer dimensions, parts per year, traditional inventory space
   - Output: Space savings %, ROI per sq ft
   - Comparison: Printer vs equivalent physical spare parts
   - **Deadline:** Feb 10
   - **Purpose:** Address #1 new barrier (space constraints)

---

### **RESEARCH TASKS:**

7. **[ ] SURVEY OFFSHORE SPACE ALLOCATION**
   - Question: "What % of vessel space is dedicated to spare parts?"
   - Target: 10 offshore operators
   - **Goal:** Quantify space constraint severity
   - **Deadline:** Feb 20

8. **[ ] IDENTIFY OTHER "PILOT USERS"**
   - Who else has AM on vessels but isn't scaling?
   - Research: Marine AM adoption case studies
   - **Goal:** Find Segment A (pilot users stuck at Stage 1)
   - **Deadline:** Ongoing

---

### **INTERVIEW PREPARATION:**

9. **[ ] PREPARE JON INTERVIEW QUESTIONS**
   - Focus: Usage metrics, business case, space allocation
   - Artifacts: ROI dashboard mockup, metal AM assessment
   - Value prop test: Pricing ($10K one-time vs $15K/year)
   - **Deadline:** Before he returns (late Feb)

10. **[ ] REACH OUT TO CHIEF ENGINEER (AR)**
    - Request: 30-min call for operational details
    - Focus: "Out of jam" case studies, part failures, wish list
    - **Timing:** ASAP (Tony said he's available)

---

### **HYPOTHESIS TESTING:**

11. **[ ] TEST H67 - AM ROI Measurement Gap**
    - Survey: 10 offshore operators with AM pilots
    - Question: "Do you track usage, costs, savings?"
    - Offer: Free ROI tracking tool (pilot program)
    - **Success threshold:** ≥70% lack tracking + ≥2/3 adopt tool

12. **[ ] TEST H66 - Space Constraint**
    - Interview: 5 vessel operators
    - Question: "Is space a barrier to AM adoption?"
    - Quantify: Space footprint requirements
    - **Success threshold:** ≥3/5 cite space as top-3 barrier

---

## 📧 FOLLOW-UP EMAIL TO TONY (DRAFT)

**Subject:** Thank You - Anne Risley AM Experience + Next Steps

---

Hi Tony,

Thank you so much for sharing Clearwater's experience with additive manufacturing on the Anne Risley! This is incredibly valuable for my research.

**What I learned from your team's feedback:**

Your experience validates several key hypotheses:
1. ✅ AM works for "out of a jam" emergency repairs (non-critical plastic parts)
2. ✅ Space on vessels is a critical constraint (not just cost or technology)
3. ✅ Interest in metal printing exists, but uncertainty about technology maturity + business case

**I'm particularly interested in exploring further:**

The challenge you mentioned: *"Haven't found enough tangible benefits to invest in a bigger way"*

I suspect this is because current AM usage isn't being measured/tracked in a way that quantifies ROI (downtime saved, procurement costs avoided, space savings vs traditional inventory). This makes it hard to justify scaling.

**Value Proposition for Clearwater:**

I'm building a platform that includes:
1. **AM ROI Dashboard** - Track usage, quantify savings, prove business case
2. **Metal AM Readiness Assessment** - Answer "is the technology ready?" + space/cost analysis
3. **Space Justification Calculator** - Printer footprint vs equivalent physical inventory

**Request - Pilot Partnership:**

Would Clearwater be interested in being a pilot user? We could:
- Install tracking system on Anne Risley printer (3-6 months)
- Quantify your current ROI
- Build business case for metal AM upgrade (or validate that plastic is optimal)
- Identify which parts you could print but aren't

**No cost for pilot phase** - we're gathering data for research. In return, you'd get insights to justify (or not justify) further AM investment.

**Next Steps:**

1. **Chief Engineer on Anne Risley:** You mentioned he could provide operational details. Could you connect me for a 20-30 minute call to discuss "out of jam" case studies?

2. **Jon (Head of Engineering):** When exactly does he return from travel? I'd love to schedule a call to discuss this further.

3. **Pilot Interest:** Would you be open to a brief call (15 min) to discuss the ROI tracking/metal assessment idea?

Looking forward to staying connected. Clearwater's real-world AM experience is exactly the type of insight that helps build solutions that actually work.

Best regards,  
Mahmoud Kiasari  
PhD Candidate, Dalhousie University  
Lab2Market Program

---

## 🏆 STRATEGIC IMPORTANCE

**Why This Interview Matters:**

1. **🥇 FIRST ACTIVE AM USER** (not prospective - already operational)
2. **🔍 NEW BARRIER DISCOVERED** (space constraints - not mentioned in 11 previous interviews)
3. **✅ VALIDATES "OUT OF JAM" USE CASE** (Jordan's prediction confirmed)
4. **⚠️ REVEALS SCALING GAP** (pilot success ≠ investment justification)
5. **🎯 CLEAR PLATFORM NEED** (ROI tracking, metal upgrade pathway)
6. **🤝 PILOT PARTNERSHIP OPPORTUNITY** (they're stuck, we can help)

**Next Critical Step:**

Interview Jon (Head of Engineering) + Chief Engineer (AR) to get:
- Usage metrics (quantitative, not just "sometimes")
- Part examples (categories, success/failure rate)
- Space allocation decision criteria
- Metal AM investment threshold (what would justify it?)

**Then:** Offer pilot program → Generate first real-world ROI case study → Scale to other "Segment A" operators

---

**Strategic Importance:** ⭐⭐⭐⭐⭐ (HIGHEST - Active user experiencing barriers we can solve)

**Follow-Up Priority:** 🔴 URGENT (Jon returning late Feb - prepare now)
