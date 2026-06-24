# Interview 60: Deep Strategic Insights — Enterprise Scale-Up for Digital AM Readiness - Craig Dicken

**Interview Subject:** Senior Principal, Materials Management at ExxonMobil; 20+ years in MRO supply chain, logistics, warehousing; previously Canada Supply Chain Manager at Imperial Oil

**Thesis:** Enterprise adoption of digital AM hinges not on the platform's capability, but on solving three interlocked enterprise problems: (1) cross-system visibility for distributed global operations, (2) digital readiness cost-scaling for use-case discovery, and (3) integration with existing SAP-centric supply chain workflows.

---

## Core Enterprise Tensions & Resolutions

### 1. **The Global Visibility Problem: Why Large Oil & Gas Operators Can't See Their Own Inventory**

ExxonMobil is a global oil and gas corporation with operations across multiple regions. You'd assume they have perfect visibility into their material flows. They don't. In fact, the opposite.

**The core issue (stated directly):**
> "If you think about ExxonMobil as a mobile oil and gas company... we could stock a similar part, the same part, in multiple regions across the world and not actually know what other organizations have it. When we get into a pinch and we need something because we've stocked out one location, and we need to get it from another location, we don't have good lineup sight to that today." (06:13–06:28)

**Why this matters for the digital AM platform:**
- Global companies operate as semi-independent business units with regional supply chains.
- A part needed urgently in Southeast Asia might exist in the Houston warehouse, but there's no system to check across regions.
- This creates both **overstocking** (regional redundancy) and **stockouts** (regional siloing).
- A digital inventory platform that could unify visibility across regions would unlock millions in working capital and reduce emergency procurement costs.

**The deeper implication:** Your platform's first value prop is not "print spare parts locally." It's **"give us a unified view of what parts exist across our global footprint, where they are, and what applications they fit."** Printing is the secondary (or even tertiary) lever.

**Tactical insight:** When you pitch to ExxonMobil or Shell, lead with: *"How much capital is tied up in redundant inventory because you can't see across regions? How many emergency shipments do you make per year that could have been avoided with cross-regional visibility?"*

---

### 2. **The Manual Overhead Tax: Why Systems Not Talking = Millions in Lost Productivity**

ExxonMobil runs SAP as its core ERP. But SAP doesn't cover all supply chain functions. They layer in other systems (TM, EWM, specialized vendors). The result: **significant manual intervention to bridge gaps.**

**Specific examples given:**
- Updating a delivery date from a vendor and propagating it through the system to end-users.
- Transmitting POs to vendors and confirming they received them (vendors sometimes miss POs, creating supply disruptions).
- Moving data between systems because they don't have direct integrations.

**The enterprise reality:** In large corporations, systems-of-record are not unified. SAP handles financials and some supply chain modules. But materials management, MRO, logistics, and ad-hoc procurement happen across multiple systems. Humans are duct-tape.

**Cost implication:** If a company has 5,000 supply chain professionals globally, and 20% of their time is manual bridging work, that's 1,000 FTEs worth of labor burned on "glue" instead of strategy.

**Why this matters for your platform:**
- Your digital AM + inventory system will face the same integration challenge.
- ExxonMobil will ask: *"Will this plug into our SAP environment? What's the data flow? How do we keep it in sync?"*
- If your answer is "manual export/import," you've handed them another manual-overhead tax.
- If your answer is "we directly integrate with SAP," you've unlocked enterprise value.

**Tactical implication:** Before you pitch to any Fortune 500 company, understand their SAP footprint and design for SAP integration (or at least standard supply chain APIs like EDIFACT, REST).

---

### 3. **The MRO Supply Chain Is the Weak Link — And That's Your Biggest Opportunity**

The interviewee explicitly segmented their supply chain:
- **Finished products & raw materials:** "We have a strong SNLP process... good line of sight, security of supply." Sophisticated, well-managed.
- **MRO (Maintenance, Repair, Operations):** "We are not as sophisticated as that... It's almost like a last-minute supply chain which creates a lot of pressure." (09:27–09:54)

**Why MRO is broken:**
- MRO is reactive, not planned. You don't know you need a bearing until the pump fails.
- You don't have good lead-time data. Is it 2 weeks or 12 weeks from the OEM?
- You don't have good inventory levels. So you either overstock (expensive) or stockout and emergency-purchase (very expensive).
- It's chaotic because it's not critical path—until it is.

**The opportunity for digital AM:**
- MRO parts are ideal for distributed printing because they're mostly standardized (bearings, seals, housings, valve bodies).
- Lead times are typically 4–12 weeks from OEMs.
- A local print service could deliver in 24–48 hours.
- The ROI is enormous *if* digital readiness (the TDP, qualifying the part, securing approvals) can be pre-done.

**The tension:** Solving MRO with local printing requires upfront investment in digital readiness. ExxonMobil doesn't want to pay that cost per part. They want a systematic way to pre-qualify parts at scale.

**Tactical implication:** Your value prop for enterprise MRO is not "print any part on demand." It's "let's systematically identify the top 100–500 MRO parts you buy every year, pre-qualify them for local printing, and give you a playbook for emergency printing when the OEM lead time exceeds your tolerance."

---

### 4. **Digital Readiness (DRL 1–3) Is the Hidden Scaling Problem**

ExxonMobil asked the critical question: *"How do you scale digital readiness in a way that you don't have to spend a disproportionate amount of money getting that image ready?"* (17:08)

This is **the** bottleneck your platform must solve.

**What is digital readiness?**
- **DRL 1:** You have a scan or CAD file of the part.
- **DRL 2:** The file is validated and ready for slicing (geometry, orientation, infill, etc.).
- **DRL 3:** The part goes through heat treatment, post-processing, and quality verification. It's "flight-ready" (or in this case, MRO-ready).

**The cost problem:**
- Getting from scan (DRL 1) to file-ready (DRL 2) might cost 1–2K per part (automated with some manual cleanup).
- Getting from file-ready (DRL 2) to qualified (DRL 3) can cost 5–20K per part (testing, certification, regulatory approvals).
- If you have 10,000 MRO parts across ExxonMobil's portfolio, pre-qualifying all of them is a $ 50–200M project.
- That's why they ask: *"How do you do this without disproportionate cost?"*

**The insight:** Your platform can't just be a digital inventory. It has to include a **tiered qualification framework** that lets users say:
- "Qualify this part to DRL 2 (file-ready, low-risk parts like brackets, covers)."
- "Qualify this part to DRL 3 (mission-critical seals, pressure parts, high-liability)."
- "Use this pre-qualified family of parts as a template for similar parts."

**Tactical implication:** Build a qualification decision tree that maps part categories (bracket vs. seal vs. pressure housing) to required DRL and cost. Package this as intellectual property. License it to OEMs, print providers, or enterprise customers.

---

### 5. **"Just Because You Can Print It Doesn't Mean You Should"**

The interviewee stated directly: *"Just because an item can be manufactured digitally or throughout the manufacturing doesn't mean that you actually should [use additive manufacturing] on the part."* (16:37)

This is a hard truth that founders often miss.

**The use-case filter:**
- A part's printability ≠ part's suitability for AM.
- A titanium pump housing might be technically printable but uneconomical or unsafe.
- A thermoplastic bracket might be printable but require post-processing that negates the cost advantage.

**Examples of poor use-cases:**
- Parts with high lead-time sensitivity but low unit cost (buy a spare, it's cheaper than printing).
- Parts needing complex post-processing (heat treat, CNC finishing, inspection) that consume the AM lead-time savings.
- Parts with legacy designs that don't leverage AM advantages (near-net-shape, topology-optimized geometries).

**Why this matters for your platform:**
- Your platform can't just say "print this." It has to include a **use-case qualification engine** that filters parts for AM suitability.
- Criteria: part cost, lead-time sensitivity, OEM availability, printability, post-processing cost, liability tier.
- A platform that pre-filters and recommends AM-suitable parts is vastly more valuable than one that accepts any part.

**Tactical implication:** Build a part-assessment module that scores each MRO part on AM suitability (1–100 scale). Rank by ROI potential. This becomes your customer discovery tool and your sales tool.

---

### 6. **Enterprise IT Risk & Data Privacy Are Non-Negotiable Gatekeepers**

When Mahmoud asked how ExxonMobil evaluates new supply chain solutions, the answer was clear:

> "Everything has to go through an IT risk process... where we work intimately with a software provider to make sure that all of our data is housed properly, encrypted properly... If it's a direct connect to our platform, if it's standalone, we still have a lot of IT screenings that we need to do." (10:37–10:59)

**The compliance checklist a founder must prepare:**
1. **Data housing:** Where is customer data stored? Is it on ExxonMobil's premises, in a secure cloud (AWS/Azure with compliant configs), or third-party?
2. **Encryption:** In transit and at rest? What's the key management?
3. **Access controls:** Who can see what data? Role-based access?
4. **Audit logging:** Can ExxonMobil see who accessed what and when?
5. **Integration architecture:** Direct feed to SAP or standalone? If standalone, what's the sync mechanism?
6. **Data privacy:** GDPR, CCPA, country-specific regulations?
7. **Disaster recovery & business continuity:** What's your RTO/RPO?

**Enterprise bottleneck:** This entire review process can take 6–12 months before a single line of code is deployed. A startup that hasn't prepared for this will encounter a wall.

**Tactical implication:** Before you pitch to an enterprise customer, have a **data security & compliance document** ready. Include: SOC 2 Type II audit, encryption specs, access controls, disaster recovery plan. This is table stakes.

---

### 7. **Software is an Enabler; Business Process Change is the Driver**

The interviewee was adamant:

> "It comes back to business process change for us. A software tool is there to help us operate in a different way, but it's not the driver... We have a business process that needs to be executed. We have a competitive advantage in a certain area, and we look to software to support that." (13:05–13:48)

**Translation:** ExxonMobil doesn't buy software to change how they work. They identify a competitive advantage (a new way of working) and then buy software to enable it.

**Contrasting approach (startup failure mode):**
- "Our platform uses AI to optimize X."
- "We have blockchain for transparency."
- "We use machine learning for demand forecasting."

These are **solution-first** pitches. They don't resonate with enterprise procurement.

**Winning approach (enterprise-fit):**
- "We've identified that your MRO lead-time is your critical constraint for offshore operations. By pre-qualifying parts digitally and enabling local printing, we reduce lead-time from 8 weeks to 2 days. Here's the business process change required, and here's how our software supports it."

**Tactical implication:** When you pitch, lead with business process. Lead with ROI. Lead with competitive advantage. The software is the supporting actor, not the star.

---

### 8. **Off-the-Shelf > Customized (Always)**

The interviewee said: *"We're trying to do off-the-shelf as much as possible, so we don't have customized solutions in our environment, which then makes it difficult to manage and control your costs."* (13:34)

**Enterprise philosophy:** Enterprises have learned (painfully) that customized software = technical debt, cost overruns, and maintenance hell. They prefer to adapt their process to fit off-the-shelf software rather than customize the software.

**Implication for your platform:**
- Don't over-customize for early customers.
- Build a flexible, configurable **baseline** (not infinitely customizable).
- If a customer asks for custom features, politely decline or bundle it as a premium service.
- The moment you start customizing, you're on the path to becoming a consulting services firm, not a platform.

**Tactical implication:** When you build your MVP, design for configuration not customization. Use role-based permissions, template-driven workflows, and parameter-driven logic.

---

## Synthesis: A Revised Go-to-Market Strategy for Enterprise

### Phase 1: Enterprise Pilot (Months 1–6)
1. **Target:** A major operator (ExxonMobil, Shell, Equinor, Aker) with an offshore MRO challenge.
2. **Scope:** 50–100 high-impact MRO parts; partner with a local print service in a key operating region.
3. **Deliverable:** 
   - Digital inventory for the part family (CAD, metadata, DRL classification).
   - Pre-qualified AM-readiness assessment per part.
   - Prototype platform for visibility + part search + printing request.
4. **Outcome:** Measurable MTTR reduction, downtime avoided, cost per part vs. OEM baseline.

### Phase 2: Compliance & Scale (Months 6–12)
1. **Secure IT approval:** SOC 2, encryption, access controls, disaster recovery.
2. **SAP integration:** Direct feed from their SAP system to your inventory system.
3. **Expand parts:** Move from 100 to 1,000 MRO parts; add 2nd operator or region.
4. **Funding round:** Use pilot + compliance as collateral for Series A or enterprise loan.

### Phase 3: Ecosystem & Network Effects (Year 2+)
1. **OEM partnerships:** Offer OEMs a licensing revenue model to contribute approved designs.
2. **Print provider network:** Expand to 5–10 qualified print services across North America.
3. **Enterprise replication:** Land 3–5 major operators in different sectors (oil & gas, offshore wind, mining).

---

## Critical Enterprise De-Risking Factors

| Risk | Mitigation |
|------|-----------|
| IT/compliance rejection | Pre-load SOC 2, encryption specs, disaster recovery plan; involve IT from day 1 |
| SAP integration complexity | Partner with a SAP consulting firm; build integration as part of MVP |
| Low initial ROI (too few qualified parts) | Focus on top-impact parts (high failure rate × high downtime cost); achieve 80/20 rule quickly |
| OEM/print-provider quality issues | Pre-qualify vendors; contractual SLAs; audit trail for every print |
| Change management resistance | Identify internal sponsor (Chief Engineer or VP Supply Chain); secure budget and authority |

---

## Final Thought: The Enterprise Opportunity is Massive But Requires Patience

ExxonMobil operates 7,000+ offshore and land-based facilities globally. Their annual maintenance budget is $ billions. A 1% improvement in MRO lead-time or cost translates to $ tens of millions in value.

But getting there requires:
1. **Solving the visibility problem** (cross-region inventory).
2. **Pre-qualifying parts systematically** (DRL framework).
3. **Integrating with their SAP ecosystem** (not bolting on a standalone tool).
4. **Earning IT's trust** (compliance, security, disaster recovery).
5. **Identifying the right sponsor** (someone with P&L authority and organizational clout).

The founder who can navigate this enterprise complexity—without losing the startup's speed and vision—will unlock a business worth billions.

The key insight from this interview: **Start narrow (one operator, one region, one part family), prove the business case, then expand systematically.** Enterprises don't adopt platforms; they adopt solutions to specific, costly problems.
