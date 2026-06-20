# Interview 84: Key Insights & Strategic Lessons — Bachar Reaction Dynamics

**Date:** April-May 2026  
**Interviewee:** Engineering/Operations Lead, Bachar Reaction Dynamics  
**Organization:** Aerospace Rocket Engine Manufacturer using Metal Additive Manufacturing  
**Duration:** 17 minutes  
**Key Theme:** Conservative Aerospace Manufacturing Philosophy, Turnkey AM Solutions, Liability & Quality Mindset

---

## CRITICAL MANUFACTURING INSIGHTS

### 1. **Traditional QA Mindset Applied to Additive Manufacturing**

**Core Position:**
> "Printing 3D printing is still a manufacturing process. And it still involves some engineering. It's not like the magic where you press a button and the part is perfect. This is, and it will never be like this."

**Implications:**
- ❌ No "push-button" manufacturing expectations
- ❌ Cannot delegate QA responsibility to printer OEM
- ✅ Must build in-house testing/validation processes
- ✅ Must understand material characteristics through own procedures
- ✅ Engineer-to-engineer responsibility (not software-to-engineer)

**Quality Assurance Requirements:**
- Print parts → own quality assessment → own quality assurance → validate against requirements
- In-house processes to validate material characteristics and performance
- Full traceability from design through production to delivery
- Cannot rely on printer vendor's software/automation alone

### 2. **Velo 3D's Turnkey Strategy: Software as Lock-In Mechanism**

**What Velo Provides:**
- Integrated software stack: slicing + printability assessment + real-time monitoring + inspection recording
- "Reduce the barrier to entry, they're increasing their customer base"
- Seamless workflow: design → send to operator → slice → print (3-4 weeks) → pickup

**Competitive Advantage:**
- Other printer vendors struggle because customers must cobble together separate software tools
- Software ecosystem creates switching costs higher than hardware differences
- Turnkey solution reduces adoption friction significantly

**Limitation Recognized:**
- Works well for single-facility operations (4-5 printers)
- Complex multi-facility tracking still requires external systems (Excel works for now)
- Market segment: Companies buying their own printers, not shared/rented facilities

### 3. **Liability Is Non-Negotiable: Manufacturer Always Responsible**

**Clear Legal Boundary:**
> "You are the one using that tool to build a solution and you have to ensure that the solution you're putting forth respects the quality criteria... You cannot delegate that responsibility and you cannot really shift the blame on the company making the printer."

**Why:**
- Printer OEM provides tool, not solution
- Manufacturer designs, engineers, produces the final part
- End-customer (aircraft/rocket operator) relies on manufacturer's certification
- "If the part is bad, just don't buy the printer" — due diligence required upfront

**Aerospace Example:**
- Airplane parts: 40-year lifespan expectation
- Test/development parts: 4-minute lifespan acceptable
- Same quality standards apply regardless — manufacturer responsibility doesn't change

**Conservative Industry Behavior:**
- Many companies try to defer liability (described as "very lazy thing")
- Interviewee frustrated by peers seeking to shift responsibility
- "You have to be owner and responsible regardless where you situate yourself in the value chain"

### 4. **AI: Currently Administrative, Engineering Potential Unproven**

**Current Usage:**
- Email drafting
- Documentation generation
- Administrative productivity only

**Engineering Potential (Theoretical):**
> "AI can be a very powerful tool if you use it to support your engineering and decision-making... if AI helps you reduce failure rate from 1 out of 50 to 1 out of 100, that's already great usage."

**Reality Check:**
- Interviewee explicitly: "I'm not an expert in AI"
- No concrete engineering use cases deployed yet
- Skeptical of hype — focuses on measurable impact (failure rate reduction)
- Recognizes potential but hasn't operationalized

**Philosophy on AI & Jobs:**
> "AI will replace tasks, not people... It will change how we do our work... ensure that some of the work that these analysts are doing can be automated. So they can do more work with the same amount of people."

### 5. **Scale & Complexity: Small Operation, Simple Solutions**

**Current State:**
- 4-5 Velo printers in single facility
- Single operator manages entire printing process
- Excel spreadsheet suffices for printer tracking/part traceability
- No need for sophisticated manufacturing execution system (MES)

**When Complexity Grows:**
- Acknowledges multi-facility or shared-facility scenarios would need better software
- But at current scale, overhead not justified
- "I will not wake up in the morning and say, oh wow, I wish I really had that"

**Key Insight:** Platform/marketplace solutions must prove ROI at small scale before complexity is valued

### 6. **Aerospace Market Realities: Conservative, Risk-Averse, Slow-Moving**

**Customer Psychology:**
- "Working towards conservative industries... used to their way of running business"
- "If you try to change too much... you'll have very, very big challenges"
- Willingness to change exists but within tightly bounded constraints

**Change Management Strategy:**
- Don't change both manufacturing method AND sales channel simultaneously
- OEMs fearful of disrupting existing revenue streams (spare parts business)
- Must prove value before asking for business model changes

**Regulatory/Certification Context:**
- No discussion of specific aerospace certs (FAA, etc.) but implied through "quality criteria"
- Testing and validation are internal responsibilities regardless of external standards

---

## STRATEGIC LESSONS FOR ADDMANUCHAIN

### 7. **Target Customer Profile: Conservative, Not Early-Adopter**

**Ideal Customer:**
- Traditional manufacturer adopting AM as production method (not AM-native startup)
- Has existing quality systems and engineering discipline
- Applying known manufacturing principles to new technology
- Risk-averse, needs proof before investment

**Not Ideal Customer:**
- Companies expecting "push-button" manufacturing
- Those wanting to delegate QA to software/platform
- Marketplace brokers (not actual manufacturers)
- Organizations seeking rapid, disruptive change

**Messaging Should Focus On:**
- Enabling traditional manufacturing excellence through AM
- Traceability, compliance, repeatability
- Integration with existing QA workflows
- Not "democratization" or "disruption"

### 8. **Software Must Integrate, Not Replace Printer Native Software**

**Architecture Insight:**
- Velo's integrated stack is competitive moat
- Third-party platform would need to interface with/privacy respect native printer software
- Attempting to replace slicing/monitoring/inspection = losing value proposition
- Platform value lies in orchestration across multiple printers/facilities, not per-printer control

**Integration Requirements:**
- API access to printer-native systems
- Data aggregation (not replacement) of print data
- Cross-printer inventory/order management (where Excel breaks down)
- But NOT replacing slicing or real-time monitoring (Velo already does this well)

### 9. **Liability Framework: Platform Cannot Absolve Manufacturer**

**Critical Constraint:**
- AddManuChain platform cannot take on manufacturing liability
- Platform users (manufacturers) remain fully responsible
- Platform can provide tools for traceability, documentation, standards compliance
- But cannot be "responsible party" in part certification

**Platform Value in QA Context:**
- Standardized checklists/workflows
- Digital twin/recipe management
- Audit trail generation
- Compliance template libraries
- But execution responsibility remains with manufacturer

### 10. **AI Use Cases: Administrative First, Engineering Later**

**Realistic Adoption Path:**
1. Phase 1: Documentation templates, email drafting, report generation
2. Phase 2: Data aggregation and anomaly detection (failure pattern recognition)
3. Phase 3: Predictive process optimization (reduce failures from 1/50 to 1/100)
4. Phase 4: Cross-project learning (knowledge management across builds)

**Sales Insight:**
- Current state: Customers using ChatGPT for emails, not engineering
- Don't over-sell AI capabilities — conservative industry skeptical
- Frame as "reducing tedious work" not "replacing engineers"
- Emphasize failure reduction (measurable) over automation (threatening)

### 11. **Market Size Constraint: Niche, Not Mass Market**

**Addressable Market (Per Interviewee):**
- Companies buying their own metal AM printers for production (not prototyping)
- Specifically Velo customers (other printer vendors have different software stacks)
- Conservative industries (aerospace, defense, medical — not consumer products)
- Single-facility or small multi-printer operations initially

**Market NOT Addressed:**
- Shared printer facilities / "Airbnb for 3D printers" model
- Hobbyist or prototyping use cases
- Companies unwilling to invest in in-house QA capability
- Organizations expecting turnkey "press button, get certified part" experience

**Implication:** TAM smaller than generic "additive manufacturing software" category

---

## COMPETITIVE LANDSCAPE INSIGHTS

### 12. **Printer OEM Software as Competitive Moat**

**Velo Strategy:**
- Bundled software reduces barrier to entry → more printer sales
- Creates ecosystem lock-in (switching costs high once processes built around their stack)
- "Other companies had that problem. That was scrubbing" — fragmentation hurts usability

**Competitor Weakness:**
- Printer vendors without integrated software sell hardware only
- Customers then must buy/develop complementary tools
- Software usability becomes competitive differentiator

**Platform Opportunity:**
- Work across multiple printer OEMs requires integration, not replacement
- Multi-vendor fleet management where Excel breaks down
- But must respect each OEM's software primacy

### 13. **In-House Expertise Requirement: Barrier to Entry**

**Non-Negotiable:**
- Must have engineers who understand materials, processes, testing
- Cannot outsource QA to platform or printer vendor
- "You need people that know what they're doing"

**Platform Role:**
- Provide knowledge templates, best practices, certification guidelines
- But cannot substitute for in-house competency
- Platform success depends on customer having basic engineering capability

**Target Customer Must-Have:**
- Minimum viable engineering team (even if small)
- Commitment to in-house testing/validation
- Understanding that AM still requires traditional manufacturing discipline

---

## QUOTES & MENTORSHIP MOMENTS

### **On 3D Printing Realism:**
> "It's not like the magic where you press a button and the part is perfect. This is, and it will never be like this. I mean, maybe maybe in 10-15 years."

### **On Liability:**
> "You are the one using that tool to build a solution and you have to ensure that the solution you're putting forth respects the quality criteria... You cannot delegate that responsibility and you cannot really shift the blame on the company making the printer."

### **On AI's Role:**
> "I will not replace people. AI will replace tasks... You will ensure that that engineer can do more with the same tools... It will change how we do our work, but it will not change it by removing the task of analyst."

### **On Conservative Industries:**
> "They're working towards conservative industries. This is not in our Airbnb. They're used to their way of running business... If you try to change too much, you'll have very, very big challenges."

### **On Using ChatGPT Today:**
> "For me, I use AI to help draft emails, and that's the best use of emails... so far we've been using it but not necessarily for engineering as much as it is, you know, emails and documentation and stuff like that."

---

## STRATEGIC RECOMMENDATIONS FOR ADDMANUCHAIN

**Primary Positioning:**
1. **Not a marketplace** — this customer doesn't want to rent or share printers
2. **Not replacing printer software** — integrate with Velo/DMX/others' native stacks
3. **Manufacturing excellence enablement** — help conservative manufacturers do AM correctly
4. **Liability tooling, not liability transfer** — help users document their own QA processes

**Product Priorities:**
- Digital recipe management aligned with printer-native workflows
- Cross-facility traceability when Excel breaks (at ~10+ printers or 2+ locations)
- Certification documentation templates (ISO, AS, etc.)
- Failure tracking and analytics (help achieve 1/50 → 1/100 failure rate)
- Administrative AI for documentation (not engineering AI)

**Go-to-Market:**
- Target Velo 3D customers specifically (they already have software stack)
- Pitch as "complement to Velo's system" not "alternative"
- Focus on companies with existing engineering teams
- Avoid "disruptive" messaging — emphasize "enabling traditional manufacturing"

**Pivot Signal:**
If majority of interested customers are:
- Broker/platform companies (not manufacturers) → reposition away from this segment
- Companies without engineering staff → educate or disqualify
- Organizations demanding AI engineering automation → under-promise, focus on admin

---

**END OF INSIGHTS**
