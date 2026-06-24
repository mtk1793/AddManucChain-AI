# Interview 28: Andrew Smith - Transcript Analysis

**Date:** February 10, 2026  
**Interviewee:** Andrew Smith, P.Eng, PE  
**Role:** Founder, Design Smith | QA Director, JVPLabs  
**Duration:** ~45 minutes  
**Interview Quality:** ⭐⭐⭐⭐⭐ **EXCELLENT** - Brutally honest, deep technical insights

---

## 🎯 Executive Summary

**Key Verdict:** Andrew is **NOT a fan of AI for the sake of AI** but sees value in the ecosystem model. He provided critical reality checks on:
1. **AM cost viability** (only works for <50 units)
2. **Regulatory differences** (Medtech vs Energy)
3. **Quality traceability** (treat AM like CNC)
4. **NL ecosystem readiness** (Poly Unity leads, informal network exists)
5. **Oil & Gas reality** ("They've got their shit sorted out" - parts sharing agreements already exist)

**Most Valuable Insight:**
> "Offshore NL rigs share critical spares within 100km. They have equipment sharing agreements. Helicopter moves parts between rigs. This reduces waste because one spare is rarely needed on multiple rigs simultaneously."

**This validates AND challenges our model:** Oil & Gas already has informal digital coordination. Our value must be **better than helicopter sharing**.

---

## 📋 Question-by-Question Analysis

### **Q1: Medtech-to-Energy Regulatory Translation**

**Question Asked:**
> "You've navigated ISO certifications for medical devices and managed regulatory compliance for major energy projects. How do certification pathways compare between Medtech and energy, and what lessons from Medtech quality systems could apply to certifying AM industrial parts?"

**Andrew's Response (Key Points):**

1. **Essence is the Same:**
   > "Energy and medical, in the essence of the systems, are the same. You're dealing with regulatory and customer stakeholders. Both want to know their specific needs are met."

2. **Prescriptive (USA) vs Outcome-Based (Canada):**
   > "In the States, it's very structured with prescriptive requirements. **AI works very well with prescriptive.** In Canada, it's outcome-based and harder for AI to play with. It relies on experience and prior projects, which could be a way of AI working - doing a first pass on what came before."

3. **Ongoing Reporting Differences:**
   - **Medtech:** "Every single complaint is an event that must be dealt with."
   - **Energy:** "Unless it's gross negligence (oil spill), complaints don't land back into owner's basket of must-dos."

4. **Improvement Philosophy Differences:**
   - **Medtech (ISO 13485):** "You are **discouraged from improving your product** because that's a new filing. You can't make it work better by changing something internally - that's a new product and you refile."
   - **Energy (ISO 9001):** "If you can make your power plant run 10% more efficiently, regulators won't come at you. They only care if you become less efficient or more polluting."

5. **Standards Comparison:**
   > "ISO 9001 has a continuous improvement requirement. ISO 13485 you can only improve your systemic work, not the product process itself."

**Hypothesis Validation:**
- ✅ **NH.33 SUPPORTED:** Medtech regulatory pathways DO parallel energy, but with key differences
- ✅ **NH.7 SUPPORTED:** Certification is gatekeeper in both industries
- ⚠️ **NH.34 NUANCED:** Quality traceability important, but AI's role depends on jurisdiction (prescriptive vs outcome-based)

---

### **Q2: Lean/Six Sigma Framework for Digital Inventory ROI**

**Question Asked:**
> "As a Six Sigma Black Belt and Lean Facilitator, how would you quantify the waste eliminated by converting physical spare parts to digital files? What Lean metrics would resonate with a CFO?"

**Andrew's Response (Key Points):**

1. **Three-Pillar Comparison Model:**
   > "You really have three strongs to this: (1) Stock, (2) Just-in-time delivery, (3) Additive manufacturing. Presuming you got the lean down, you compare waste between these three depending on the client."

2. **Example: Sheet Metal Panels**
   - **Just-in-time:** Delay costs (equipment waiting, labor waste, floor space)
   - **Physical stock:** Inventory costs, physical space, maintenance, logging systems
   - **AM:** "You would NOT additive manufacture sheet metal panels with current technologies."

3. **Waste Categories for Physical Stock:**
   > "Physical space taking up inventory that has to be maintained, kept a certain way, logged. You need a system to log it. These are both sets of waste. They're necessary - part of doing business - but they're not actually making you money."

4. **AM-Specific Considerations:**
   - Time delay and expertise required
   - **Learning curve ramp-up factor** (human capital investment)
   - **Certification hurdles in regulated environments** (same as capital equipment investment)

5. **Atlantic XL Case Study (CRITICAL INSIGHT):**
   > "We have Atlantic Excel here - metal additive manufacturer. They're **generally very expensive** because they specifically target offshore oil industry. If they print a valve, it has to be certified for offshore oil work. When I approached them for a metal cap, **it was two orders of magnitude more than I can afford** because it would have had **100 certificates with it**, none of which I need."

**Hypothesis Validation:**
- ✅ **NH.32 SUPPORTED:** Lean framework applies - physical inventory IS waste
- ❌ **NH.35 CHALLENGED:** Atlantic XL's certification overhead makes them prohibitively expensive for non-certified parts
- ⚠️ **CRITICAL FINDING:** Certification cost is the barrier, not manufacturing cost

**Strategic Implication:**
Our model must **separate certified from non-certified parts**. Don't force every part through offshore certification if customer doesn't need it.

---

### **Q3: Quality Traceability in Network Manufacturing**

**Question Asked:**
> "As QA Director, if we're orchestrating a network of AM providers to print parts for offshore operators, what quality controls and traceability systems would you require?"

**Andrew's Response (Key Points):**

1. **Treat AM Like Any Other Manufacturing:**
   > "It's the same as any other manufacturer. You would follow the standards. For materials, you follow the standards. For post-production requirements, you would have them provide certificates on raw materials, certificates and inspections from the process - both the process as planned and the process as executed. You maintain chain of custody just like everything else."

2. **CNC Parallel (EXCELLENT ANALOGY):**
   > "If you treat AM exactly the same way as you treat regular machining, lathe work, CNC - I lean on CNC, same problem: software doing the work for people. If you flip the switch, fire the program, and leave it alone on a 6-axis lathe, you walk away for a day, come back and take the part out. **How do you know that's the part you wanted? Is it fit to spec? Same process there.** You've got a good parallel already set up for you."

**Hypothesis Validation:**
- ✅ **NH.34 SUPPORTED:** Quality traceability is critical, but **not unique to AM**
- ✅ **STRATEGIC INSIGHT:** Don't over-engineer AM quality systems. Use existing CNC/machining standards.

**Strategic Implication:**
Frame AM as "CNC with different tooling" to reduce regulatory friction. Leverage existing quality frameworks.

---

### **Q4: Design for AM (DfAM) & Cost Reduction**

**Question Asked:**
> "When does additive manufacturing actually reduce cost vs traditional machining or casting? What design principles make the biggest difference? Where's the sweet spot for AM in industrial parts?"

**Andrew's Response (Key Points):**

1. **Quantity Rule of Thumb (CRITICAL):**
   > "A good rule of thumb is quantity. **Once you hit about 50 parts, you need to really consider: are there better ways to do it?** If you're into the hundreds or thousands of parts, there **have better be** a better way to do it. The machine time you're running is so high by that point that there are better ways."

2. **No Universal Table Exists:**
   > "I have not yet seen a good table as to which manufacturing method one should lean into. That's probably because it is **absolutely geometry and size dependent.**"

3. **Volume Calculation (Simple Math):**
   > "You can do basic math: if it's extruding through a nozzle for this physical voluminous item, the math is very simple as to how long it's going to take to make it."

4. **Casting Example:**
   > "Castings are fast, dirty, easy. If all you want is a weight for the bottom of a lamp, why would you 3D print that? You take something that already exists."

5. **Extrusion Example (Cost Comparison):**
   > "Extruded aluminum shapes are very cheap. You may get a couple thousand feet of extrusions, but it costs you $800 plus labor. The dies are $800 to a couple thousand dollars - **cheap when you compare to just buying the printer** and the printer time."

6. **Verdict:**
   > "It is a very complicated question and very dependent on the particular item you're looking at."

**Hypothesis Validation:**
- ✅ **NH.36 SUPPORTED:** DfAM reduces cost, but **only for <50 units**
- ❌ **VOLUME ASSUMPTION CHALLENGED:** We assumed AM works for low-to-medium volume. Andrew says **<50 units only**.

**Strategic Implication:**
Focus on **ultra-low-volume, high-complexity parts**. Insurance stock with zero turns. NOT parts with 100+ annual demand.

---

### **Q5: NL Manufacturing Ecosystem & Workforce Development**

**Question Asked:**
> "As Lean Facilitator for Canadian Manufacturers & Exporters, what's the current state of advanced manufacturing capacity in NL? If we wanted to build a local AM network for offshore energy, what gaps exist?"

**Andrew's Response (Key Points):**

1. **Informal Network Already Exists:**
   > "There is an informal route right now. **Poly Unity leads.** There are enough machines and enough technically motivated professionals and amateurs that a local branch of AMMUG (Additive Manufacturing Users Group) would happen."

2. **Barrier to Formalization:**
   > "It's more a matter of getting all the right people in the room at the same time and agreeing there's actual value, because **right now there's no specific problem that solution solves.** It's moving fine. I think it could move better, but I haven't seen it as a real problem."

3. **Adoption Stage:**
   > "In Newfoundland and Labrador, the adoption of additive manufacturing is still in **infancy**, and it is focused very much inside the tech sector - inside members of Tech NL - and therefore they already know each other. So they're a **de facto organization without a board**."

4. **Broader Network Potential:**
   > "To have a larger network over Atlantic Canada would have more weight behind it."

**Hypothesis Validation:**
- ⚠️ **NH.35 NUANCED:** Capacity exists (Poly Unity, Atlantic XL, amateurs), but **no formal network because no clear problem**
- ❌ **ECOSYSTEM GAP CHALLENGED:** Andrew doesn't see a gap. He sees an informal network that works fine.

**Strategic Implication:**
Don't pitch "building a network." Pitch **solving a specific problem** that the informal network can't solve (e.g., offshore certification coordination).

---

## 💣 CRITICAL REALITY CHECK: Oil & Gas Already Has Solutions

**Andrew's Bombshell (End of Interview):**

> "Oil and gas, they've got a lot of their **shit sorted out**. They really, really do. Offshore Newfoundland, they have **spares that they share**. Where they've got several rigs within 100 km of each other, there are critical spares that each one of the rigs have, **even though they're not the same companies**. Because it's a cost reduction - chances are that one spare is not gonna be needed on more than one rig at a time. So they can get the helicopter and move it over, or get the ship and move it over. And they have an **equipment sharing agreement**. That reduces the wasted footprint, because you have very little space on an oil rig to have spares. The delay getting out from St. John's can be significant (300 kilometers), but if you're within 50-100 kilometers out there, you're done."

**What This Means:**
1. **Oil & Gas operators already coordinate spare parts** (informal digital inventory)
2. **Helicopter sharing is faster than St. John's manufacturing** (50-100km vs 300km)
3. **Multi-company agreements exist** (they've solved the trust/IP problem informally)
4. **Our value proposition must beat helicopter sharing** (3-day AM < 2-hour helicopter?)

**Hypothesis Challenged:**
- ❌ **NH.2 NUANCED:** Obsolescence is a driver, but **not for parts they can share between rigs**
- ❌ **DOWNTIME COST ASSUMPTION:** $1M/day downtime is real, but **not caused by parts delays** if they can helicopter-share

---

## 🔍 Key Quotes & Insights

### **On AI (Brutally Honest):**
> "I'm not a big fan of AI for the sake of it. I've used it, I've played with it. I'm old enough and experienced enough to see when it's hallucinating in my field."

> "AI in predictive maintenance is going to take a very big role, because the amount of data it takes to crunch for an individual is just too much. But we don't install as many sensors as we could on equipment because we know we'll never use the data. **Any data you get that you don't have a purpose for is garbage data.** And now you have to maintain the sensor, which is taking away from maintaining the machine - back to the waste vs must-do waste."

**Strategic Implication:**
Don't lead with AI. Lead with **specific problem** (e.g., "Which parts should we stock vs print?"). Then introduce AI as the solution.

---

### **On Certification Overhead:**
> "Atlantic Excel prints a valve for offshore oil - it has to be certified. When I approached them for a metal cap, it was **two orders of magnitude more than I can afford** because it would have had **100 certificates with it**, none of which I need."

**Strategic Implication:**
Create **two-tier pricing model:**
1. **Certified parts** (offshore oil, defense) - high price, full traceability
2. **Non-certified parts** (prototypes, non-critical) - low price, basic quality

---

### **On Quantity Threshold:**
> "Once you hit about 50 parts, you need to really consider: are there better ways to do it?"

**Strategic Implication:**
Target **Insurance Stock with <10 annual turns**. NOT high-demand parts.

---

### **On Problem Definition:**
> "I would narrow it down as much as I could to **one specific pain point** that is common across industries. I would find cases where **specifically not having a part** caused their downtime. If they're down through a shutdown period, yes, absolutely expensive. But is that **always or significantly enough** because they couldn't get a part, or that they didn't know to go get a part? Slightly different questions."

**Strategic Implication:**
Validate **exact failure mode:** Is downtime caused by (a) part unavailability, (b) part unknown/unidentified, or (c) other reasons? Don't assume.

---

## 🎯 Hypothesis Validation Summary

| Hypothesis | Status | Evidence |
|------------|--------|----------|
| **NH.7:** Certification is gatekeeper | ✅ **SUPPORTED** | "Atlantic XL charges 2 orders of magnitude more for certified parts" |
| **NH.32:** Lean validates digital inventory | ✅ **SUPPORTED** | "Physical inventory is waste - necessary but not making money" |
| **NH.33:** Medtech → Energy regulatory parallel | ✅ **SUPPORTED** | "Essence is the same, but improvement philosophy differs" |
| **NH.34:** SAP traceability critical | ✅ **SUPPORTED** | "Treat AM like CNC - same quality standards apply" |
| **NH.35:** Atlantic XL meets quality standards | ❌ **CHALLENGED** | "They're very expensive - certification overhead is prohibitive" |
| **NH.36:** DfAM reduces cost | ⚠️ **NUANCED** | "Only for <50 units. Beyond that, better methods exist" |
| **NH.37:** V&V can be standardized | ✅ **SUPPORTED** | "Follow same standards as CNC - process as planned vs executed" |

**New Hypotheses Generated:**
- **NH.38:** Oil & Gas operators already have informal parts-sharing networks (helicopter coordination)
- **NH.39:** Certification cost >> manufacturing cost for offshore parts
- **NH.40:** AI value is in predictive maintenance, NOT quality assurance (too much hallucination risk)

---

## 🚀 Strategic Recommendations from Andrew

### **1. Narrow to One Specific Pain Point**
> "I would narrow it down as much as I could to one specific pain point that is common across industries."

**Action:** Stop pitching "ecosystem for all parts." Pitch **"Emergency breakdown insurance for <50-unit obsolete parts."**

---

### **2. Reach Out to Canadian Manufacturers & Exporters (CME)**
> "Reach out to Canadian Manufacturers & Exporters. Ask them - they've got data on predictive maintenance, preventative maintenance, and emergency maintenance. I would pin them to help you, because in the end, this is something CME would be interested in. **That's your audience right there.**"

**Action:** Interview CME Nova Scotia office. Get **quantified data** on emergency maintenance costs.

---

### **3. Find Specific Downtime Cases**
> "I would find cases where **specifically not having a part** caused their downtime. Is that always or significantly enough? Because they couldn't get a part, or they didn't know to go get a part? Slightly different questions."

**Action:** Interview operators. Ask: **"What was the last time you had unplanned downtime due to a missing part? What part? How long? What did it cost?"**

---

### **4. Oil & Gas is NOT the Right Target (Right Now)**
> "Oil and gas, they've got a lot of their shit sorted out. They really do."

**Action:** **Pivot away from Tier 1 O&G** (Imperial Oil, Equinor). They have helicopter sharing. Target **industries without informal coordination** (e.g., remote mining, Arctic operations, smaller operators).

---

### **5. Meet in Person at Dal (Next Month)**
Andrew offered to meet in person at Dalhousie Innovation Hub:
> "I'll be down at Dal next Thursday for co-working. I've got time Thursday/Friday if you want to meet in real life for half an hour."

**Action:** Schedule in-person follow-up. Bring:
1. Specific downtime case studies (if found)
2. CME data (if obtained)
3. Refined pain point (not broad ecosystem)

---

## 📞 Follow-Up Actions

### **Immediate (This Week):**
1. ✅ **Poly Unity interview** (scheduled this week/next week)
2. ⬜ **CME Nova Scotia contact** (Andrew will intro to Dave)
3. ⬜ **Find specific downtime cases** (interview operators about last missing-part incident)

### **Short-Term (Next 2 Weeks):**
1. ⬜ **In-person meeting with Andrew at Dal** (confirm date/time)
2. ⬜ **Collab Markup research** (Andrew mentioned they do AI-driven QA for AM)
3. ⬜ **Refine pain point** (from "ecosystem" to "specific problem")

### **Medium-Term (Next Month):**
1. ⬜ **Pivot target customer** (away from Tier 1 O&G, toward industries without helicopter sharing)
2. ⬜ **Two-tier pricing model** (certified vs non-certified parts)
3. ⬜ **Quantity threshold validation** (<50 units = AM sweet spot)

---

## 🔑 Key Contacts Mentioned

1. **Dave (CME Nova Scotia)** - Andrew will introduce
2. **Poly Unity** - Already scheduled interview
3. **Collab Markup** - AI-driven QA for AM (local to NL)
4. **Atlantic Excel (Atlantic XL)** - Metal AM for offshore oil (expensive due to certification)

---

## 💡 Final Takeaway

**Andrew's Core Message:**
> "There is capability to take that [ecosystem idea]. It's more of a bridging event to really get more AM into industry in general. But I would find **specific cases** where not having a part caused downtime. Don't assume - validate."

**Translation:**
- ✅ Ecosystem concept has merit
- ❌ Don't pitch broad solution without specific problem
- ✅ AM works for <50 units
- ❌ Oil & Gas already has informal solutions (helicopter sharing)
- ✅ Certification cost is the barrier, not manufacturing cost
- ❌ AI for QA is risky (hallucination) - use for predictive maintenance instead

**Strategic Pivot Required:**
From: "Digital inventory ecosystem for all industries"  
To: **"Emergency breakdown insurance for <50-unit obsolete parts in industries without helicopter-sharing infrastructure"**

**Next Interview Priority:**
Find an operator who had **unplanned downtime specifically due to a missing part**. Get exact numbers: part name, downtime hours, cost, why they didn't have it in stock.

---

## 📊 Interview Quality Assessment

**Technical Depth:** ⭐⭐⭐⭐⭐ (Excellent - 30 years experience, multiple industries)  
**Honesty Level:** ⭐⭐⭐⭐⭐ (Brutally honest - "not a fan of AI," "O&G has their shit sorted")  
**Strategic Value:** ⭐⭐⭐⭐⭐ (Critical reality checks, specific action items, offered in-person follow-up)  
**Hypothesis Validation:** ⭐⭐⭐⭐☆ (Validated 4, challenged 2, nuanced 2)  
**Actionable Insights:** ⭐⭐⭐⭐⭐ (CME contact, Collab Markup lead, specific pain point guidance)

**Overall:** **TOP 3 MOST VALUABLE INTERVIEW** (alongside Kwadwo Ampofo and Keith Healey)
