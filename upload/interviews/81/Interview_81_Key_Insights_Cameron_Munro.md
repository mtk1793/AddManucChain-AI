# Interview 81: Key Insights & Strategic Lessons — Cameron Munro

**Date:** March 2026  
**Interviewee:** Cameron Munro, Defence Scientist, DRDC Atlantic Research Centre  
**Organization:** Defence Research and Development Canada (DRDC)  
**Project:** Victoria-Class Submarine Supply Chain Modernization  
**Duration:** ~45 minutes  
**Key Themes:** Naval asset procurement, sovereign capability, AM certification for defence, digital inventory management

---

## CRITICAL DEFENCE PROCUREMENT INSIGHTS

### 1. **Lead Time, Not Cost, Is the Primary Driver**

**Cameron's Direct Statement:**
> "I think the driver—the important thing to understand—is that for want of these capabilities, it's less about cost and more about lead time required to get parts through traditional supply chains or via additive manufacturing."

**What This Means:**
- 30+ year old submarines require replacement parts that original suppliers no longer make
- Original manufacturers have consolidated, left market, or lost technical expertise
- Single-source vendors for critical components can mean 1-2 year procurement timelines
- **This is not acceptable for operational readiness**

**Concrete Example from Conversation:**
- Small production runs (e.g., half dozen parts) cost **hundreds of thousands of dollars** just to create tooling for traditional casting/forging
- Seawater handling systems, pump components, impellers have no viable traditional procurement path
- Lead time reduction is THE competitive advantage, not pricing

**Implication for AddManuChain:**
- Mining companies face similar dynamics (lead times on SAG mill components)
- Defence procurement is willing to pay premium pricing for lead time reduction
- "Cost optimization" messaging is wrong; "supply chain resilience" is right

### 2. **Victoria-Class Submarine: Icon of Aging Asset Obsolescence**

**Ship Timeline:**
- Built: 1980s–1990s
- Current age: 30–40+ years old
- Original suppliers: Mostly defunct, consolidated, or de-skilled
- Impact: Thousands of parts now classified as "difficult to procure" or "obsolete"

**Material Focus:**
- NOT standard aluminum or steel (commercial AM focus)
- **Copper-based and nickel-based alloys** for marine applications (seawater corrosion resistance)
- Most AM vendors ignore these materials (low commercial demand)
- DRDC is solving a niche that commercial 3D printing companies haven't prioritized

**Component Categories (Per Cameron):**
- Impellers and pump components
- Valves for seawater handling systems
- Corrosion-resistant fittings and seals
- Precision castings that require specialized foundries

**Sovereign Capability Angle:**
> "Right now there's so much focus and interest on developing supply chains within Canada, so we're not beholden to our allies or other countries for these components."

- Canada wants domestic production capability for critical military spares
- Reduces geopolitical vulnerability (e.g., US export controls, allied restrictions)
- "Made in Canada" solution will be "viewed very favorably"

### 3. **Defence Certification Is Ad-Hoc, Not Standardized**

**Current State:**
> "We don't have really clear, concise guidance from Lloyd's and ABS on the implementation or acceptance of AM parts. We've been addressing those issues in what I'd call an ad hoc manner."

**What This Means:**
- NO standardized certification pathway for AM parts in naval vessels
- Each part goes through custom risk assessment with DND operators
- Lack of established framework = slower adoption, but also **opportunity for whoever builds the framework**

**Testing Approach:**
- Show that AM part meets **design intent** of original part
- Perform same testing as traditional casting/forging
- Add **additional samples** to verify build-to-build consistency in AM
- Document everything for operator confidence

**Key Insight:** The barrier is NOT technical (they know how to test); it's **procedural/governance** (framework doesn't exist yet)

### 4. **IP Ownership: Complex When Supplier Still in Business**

**Scenario 1: Original Supplier Defunct (Majority of Victoria Cases)**
- DRDC performs reverse engineering on physical part
- Creates new CAD designs based on measured samples
- **Canada owns the resulting IP/drawings**
- Can manufacture replacements without supplier involvement
- No IP conflict because original supplier no longer exists

**Scenario 2: Original Supplier Still in Business (Minority Cases)**
> "That can be an issue if we're talking about systems that still have a manufacturer in business... our agreements with them don't say they must turn over drawings."

- Supplier agreement often doesn't grant design access
- DRDC cannot legally produce replacement parts without supplier consent
- Creates strategic vulnerability
- Reverse engineering remains only legal avenue

**Implication for Platform IP Governance:**
- Platform must clearly distinguish between:
  - **Reverse-engineered designs** (Canada owns, free to produce)
  - **Active vendor components** (IP restricted, requires agreements)
  - **Expired supplier relationships** (opportunity zone)
- Clear IP status for each part is critical

### 5. **Prequalification Framework Would Enable Scaling**

**Current Vision:**
> "If there's a 'made in Canada' solution to provide parts not only on submarines but on surface ships as well, that's going to be viewed very favorably… Right now, that framework doesn't exist. But once that's in place, I would definitely see a great appetite for using made-in-Canada solutions."

**What Needs to Exist:**
1. **Prequalification standard** for regional 3D printing facilities
2. **Quality assurance framework** for AM production partners
3. **Vetting process** for new vendors
4. **Contracting model** for secure procurement

**Cameron's Openness:**
> "I think yes, definitely… You're right to say that some sort of prequalified or accepted framework has to exist. So yes, once that's in place, I think we'd have great demand."

**Strategic Opportunity:** AddManuChain could BUILD this framework for defence, making it the de facto standard

### 6. **Allied Nation (NATO/Five Eyes) Governance Drives Security Requirements**

**Canada's Position:**
> "Our current system for material and information management is called DRMSMIS. It has levels of security, but we're usually pretty eager to collaborate with our allies… Usually, it's our allies—particularly the US—that have much higher security requirements."

**Key Dynamic:**
- **Canada's requirements:** Moderate (mature system already exists)
- **US requirements:** HIGH (controlled goods, export controls, classified design protection)
- **Actual limiting factor:** US, not Canada

**What US Requires:**
- "Controlled goods" compliance (ITAR-equivalent for defence equipment)
- Classified design handling procedures
- Secure information storage and access control
- Ally-only distribution (not shared with non-Five Eyes nations)

**Platform Implication:** If AddManuChain wants defence market, must meet **US standards, not Canadian minimums**

### 7. **Digital Inventory Management Is Massive Gap**

**Current Problem:**
> "[On Victoria-class] if you look at how many parts are obsolete or difficult to procure, it's thousands and thousands. People are having to go through line by line or figure out their own software-based processes."

**Why This Matters:**
- Thousands of parts per vessel = manual labor to identify candidates for AM
- Current systems don't proactively flag at-risk parts
- No integration between inventory management and procurement planning
- Decision-making is reactive, not proactive

**Cameron's Assessment:**
> "It doesn't allow us to be proactive… [the process] is still very labor-intensive."

**This is a MASSIVE opportunity for AddManuChain's digital inventory angle**

### 8. **AI Application #1: AM Certification via Sensor Data**

**Problem Cameron Identified:**
> "Right now, AM systems collect sensor data, but people don't really do anything with it. It would be useful to go back, look at sensor data, compare it to part performance afterwards, and figure out what it actually meant."

**AI Solution:**
- Use machine learning on **sensor data from AM builds** (e.g., laser power, temperature, layer quality)
- Cross-reference with **post-build testing results**
- Build predictive model: "If sensor signature = X, part will pass/fail quality test"
- Enable faster certification (don't need to manually test every build)

**Value Proposition:**
- Speed up part qualification process
- Reduce manual inspection labor
- Lower cost per certified part
- Improve consistency

### 9. **AI Application #2: Predictive Inventory & AM Candidate Identification**

**Problem:**
- Thousands of parts on vessel; need to identify which are:
  - (a) Obsolete or difficult to procure
  - (b) Suitable for AM manufacturing
  - (c) High-priority (will cause shutdown if unavailable)

**AI Solution:**
> "[Apply AI to] inventory management so there can be notifications or forewarning that 'this set of parts is going to be problematic in the future'… You can handle that data, apply an algorithm, and say, 'Here are some parts that are going to be problematic, and these parts are also suitable for AM.'"

**Specific Use Case:**
- Scan all 10,000+ parts across fleet
- Flag parts where:
  - Lead time > 6 months (stock running low)
  - Original supplier no longer in business
  - Load/stress profile compatible with CNC/AM manufacturing
  - Cost-benefit justifies new part design
- Prioritize by risk (failure would cause catastrophic downtime)

**Value Proposition:**
- Convert 10,000 part inventory into prioritized 50–100 part candidates for AM
- Proactive planning (vs. reactive crisis when part fails)
- Leverage existing part failure data to predict future needs

**Cameron's Reaction:**
> "That's a fantastic idea… That would be so useful."

---

## STRATEGIC POSITIONING FOR ADDMANUCHAIN

### 10. **Defence Market Golden Triangle: Lead Time + Sovereignty + Certification**

**Three Customer Needs Converge:**

1. **Lead Time Crisis** (supply chain embarrassment)
   - Cannot wait 2 years for pump seal
   - Current alternatives all unacceptable
   
2. **Sovereignty Imperative** (strategic independence)
   - Canada wants domestic manufacturing for critical spares
   - Not "just cheaper," but "under Canadian control"
   - Allies (US) support this geopolitically
   
3. **Certification Vacuum** (no one else has solved it)
   - Lloyd's/DNV haven't standardized AM defence parts
   - DRDC is doing ad-hoc, case-by-case assessments
   - First mover to build certification framework = market leader

**AddManuChain Opportunity:**
Build certification framework, position as trusted partner for:
- Copper/nickel alloys (marine-grade materials)
- Defence-grade quality assurance
- Sovereign Canadian capability
- AI-enabled candidate identification

### 11. **Defence Procurement Is More Patient Than Commercial**

**Key Difference:**
- Commercial OEMs want ROI in 18 months
- Defence procurement will wait 2–3 years for strategic capability
- Can invest in relationships, frameworks, pilot programs
- **Less pressure for fast commercialization; more pressure for perfection**

**Cameron's Tone:**
- Professional, measured, collaborative
- Not asking about pricing (doesn't care)
- Asking about governance, standards, security
- **High willingness to co-develop solutions**

### 12. **Dalhousie Collaboration Is Real Path to Credibility**

**Current Partnerships:**
- Cameron works with Dr. Bishop at Dalhousie University
- NSERC (Natural Sciences funding) + CFI (research infrastructure)
- Industry partners already engaged
- **This is not startup hustle; this is established research program**

**For AddManuChain:**
- Dalhousie connection = credibility
- NSERC/CFI funding = proof of government interest
- Dr. Bishop could be champion for platform adoption at DRDC

### 13. **Five Eyes Ecosystem Is Addressable**

**Potential Expansion:**
- If you solve for Canada + US, reach other Five Eyes:
  - UK (has similar aging naval assets)
  - Australia (has similar Victoria-class submarine maintenance pain)
  - New Zealand
- Common standards, interoperable frameworks

**Cameron's Hint:**
> "...particularly [the US]... have much higher security requirements. So I think we'd need to be sure that information shared within that platform would meet the US requirements around controlled goods."

**Translation:** Build to US standard, Canada comes for free; then expand to other allies

---

## PARTNERSHIP POTENTIAL: 8/10

**Positive Factors:**
- ✅ Actively solving the problem (not theoretical)
- ✅ Already funded through NSERC/CFI
- ✅ Has decision-maker contacts (willing to make introductions)
- ✅ Faces exactly the pain points AddManuChain solves (inventory, certification, lead time)
- ✅ Strategic alignment (sovereignty, domestic capability)
- ✅ Open to follow-up conversations and co-development

**Concerns:**
- ❌ Defence procurement moves slowly (not quick validation cycle)
- ❌ Security/IP complexity may slow implementation
- ❌ Can't publicly celebrate wins (classified programs)

**Recommended Approach:**
1. **Build certification framework** (copper/nickel alloys + AM sensor data validation)
2. **Pilot with one component family** (pump seals? valve components?)
3. **Create Dalhousie-DRDC-AddManuChain consortium** (formal partnership)
4. **Position for Five Eyes expansion** Once Canada/US model proven

---

## KEY QUOTES

### On Lead Time as Primary Driver:
> "It's less about cost and more about lead time required to get parts through traditional supply chains."

### On Vendor Lock-In:
> "In some instances, we're talking about a small number of parts that might take one or two years to procure traditionally. That's just not a solution."

### On Sovereign Capability:
> "Right now there's so much focus and interest on developing supply chains within Canada, so we're not beholden to our allies or other countries for these components."

### On Certification Gap:
> "We don't have really clear, concise guidance from Lloyd's and ABS on the implementation or acceptance of AM parts. We've been addressing those issues in what I'd call an ad hoc manner."

### On Framework Opportunity:
> "Right now, that framework doesn't exist. But once that's in place, I would definitely see a great appetite for using made-in-Canada solutions."

### On Inventory Challenge:
> "If you look at how many parts are obsolete or difficult to procure on a naval vessel, it's thousands and thousands. People are having to go through line by line... It's still very labor-intensive."

### On AI Potential:
> "That's where AI dealing with large amounts of data could be very useful... Flagging those earlier would be a useful outcome."

---

**END OF INSIGHTS**
