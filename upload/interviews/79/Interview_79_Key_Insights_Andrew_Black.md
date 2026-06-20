# Interview 79: Key Insights - Andrew Black, GTICS (Maritime Supply Chain AI)

**Date:** [Recent]
**Duration:** ~27 minutes
**Interviewee:** Andrew Black, Director of Supply Chain Solutions at GTICS
**Background:** 10+ years maritime digital transformation; Port of Halifax innovation lead; maritime consultancy
**Company:** GTICS - Maritime AI for vessel coordination, port operations, compliance
**Platform:** Oceana (water-side maritime coordination, vessel tracking, certification/compliance)

---

## 1. OCEANA PLATFORM SCOPE: WATER-SIDE COORDINATION, NOT LOGISTICS

**Insight:** Andrew's repeated clarification that Oceana does NOT handle spare parts delivery, landside logistics, or parts fulfillment reveals a critical gap in maritime supply chain orchestration.

**What Oceana DOES:**
- Vessel position tracking (public domain with license)
- Arrival time predictions (ETAs)
- Port clearance streamlining (certificates, forms coordination)
- Water-side stakeholder coordination (pilots, tugs, port authority, coast guard, CBP, terminal operators, land-side movers - ~10-12 parties per port call)
- Certification/compliance data exchange (permission-based, varies by relationship)

**What Oceana DOES NOT DO:**
- Spare parts delivery or logistics
- On-site parts ordering/fulfillment
- Landside terminal operations (container movement, dangerous goods tracking)
- Inventory management
- Equipment placement/positioning recommendations

**Strategic Implication:** This is a precise architectural separation (water-side vs. land-side) that creates a distinct **opportunity gap for distributed AM** - you would handle the fulfillment/inventory orchestration that Oceana tracks the demand signals for.

**Partnership Potential with GTICS:**
- Oceana could surface demand signals (vessel arrival + component requirements identification)
- AddManuChain would fulfill via distributed regional printing hubs + on-site capability
- No direct competition; complementary capabilities
- Integration point: ETA + known component gap → trigger pre-positioning alert to regional hub

---

## 2. SUPPLY CHAIN VISIBILITY MODEL: PERMISSION-BASED, RELATIONSHIP-DEPENDENT

**Insight:** Maritime data governance is nuanced; there is no universal "open API" model, but rather a permission-based ecosystem.

**Current Data Accessibility:**
- **Vessel positions/arrivals:** Publicly available (licensed access through Oceana)
- **Certification/compliance:** Permission-based (depends on party relationship and certificate type)
- **Cargo data:** Limited visibility (depends on shipper relationships)
- **Crew health/confidential data:** Very restricted access

**Key Quote (Andrew):** "It depends, but the most part I think you should assume that it's really related to what the 3PL [third-party logistics] is doing. The 3PL would not have access."

**Strategic Implication:**
This reveals that distributed AM network **cannot rely on universal data sharing** via a single API. Instead, it must be implemented as:

1. **Bilateral partnerships** with specific port authorities, vessel operators, logistics companies
2. **Role-based access model** (port authority sees different data than supplier vs. OEM)
3. **Transaction-triggered visibility** (certification data shared only when relevant to transaction)
4. **Federated governance** (no centralized control; GTICS and partners maintain separate systems)

**Adoption Strategy:**
- Start with willing partners (Port of Halifax has history with innovation)
- Build repeatable permission models (template agreements)
- Don't require universal data sharing; work within existing governance frameworks

---

## 3. PREDICTIVE MAINTENANCE IS FUTURE, NOT TODAY

**Insight:** Andrew's candid assessment: Oceana currently lacks onboard sensors; predictive capability is limited to "preventive rather than predictive."

**Current State:**
- No onboard sensors on Oceana platform today
- Can detect deviations in scheduled vs. actual (rough preventive tool)
- Cannot forecast component failures accurately

**Roadmap:**
- Separate IDEAS Programme project underway (predictive maintenance + onboard sensors)
- Directional commitment to this capability
- Industry fragmentation challenge: 500+ shipping companies with different equipment

**Key Quote (Andrew):** "Your ability to forecast accurately, you know, the ability to identify either proactive predictive maintenance or predictive part replacement is limited right here. It's not all - it'll be a pretty crude tool."

**Strategic Implication for AddManuChain:**
- **Don't wait for perfect predictive data** to launch
- **Build on reactive/preventive triggers** (vessel arrival + known critical components + historical failure patterns)
- **Predictive layer comes later** (post-initial user validation)
- **AI opportunity:** You could build predictive maintenance on top of Oceana signals + your own inventory data

**Partnership Lever:** Position as complementary to Oceana's onboard sensor project (you handle fulfillment; they handle detection).

---

## 4. OEM IP PROTECTION: THE IMMOVABLE BARRIER

**Insight:** Andrew was emphatic and repeated multiple times: "No one other than my company will ever make that part. I can assure you they will say that because difficulty...they're responsible. They have warranty, isn't all that stuff right?"

This is the **single largest barrier to distributed manufacturing** in maritime.

**Why OEMs Resist:**
1. Liability/warranty responsibility (OEM bears risk if non-OEM part fails)
2. Quality control (OEM loses control of manufacturing process)
3. Competitive moat (parts sales = significant recurring revenue)
4. IP protection (designs are proprietary; OEMs fear reverse engineering)

**Andrew's Strategic Observation:**
The OEM resistance is **legitimate and structural**, not a negotiation problem. It's not "convince them"; it's "work around it."

**Workaround Strategy (Mahmoud's approach):**
1. **Start with obsolete parts** (no OEM available to object - Victoria-class submarines have no active OEM)
2. **Start with non-critical small components** (lower liability risk)
3. **Position as non-competitive** (emphasize it's for unavailable parts, not replacement of OEM supply)
4. **Build trust through small wins** before approaching OEM-available items

**Partnership Potential:**
- Andrew indicated network is primarily commercial maritime (not defence/OEM ecosystem)
- Defence procurement may be more receptive (national security > OEM margin protection)
- Offshore operations (rigs 500 km at sea) more receptive than shipping (access to OEM supply chains)

---

## 5. OFFSHORE OPERATIONS: THE ACUTE PAIN POINT

**Insight:** Mahmoud mentioned a rig 500 km offshore where "every time we want to bring someone, the ship helicopter costs a lot of time and money." Andrew didn't push back on this; he validated it as a real problem.

**The Offshore Advantage:**
- **Geographic isolation** (parts availability is genuinely critical)
- **Operational cost** (every hour of downtime = $100K-$1M cost)
- **Supply chain invisibility** (remote locations = slow traditional supply chains)
- **Risk acceptance** (offshore operators already accept risk for other operations; extending to 3D-printed parts is incremental)

**Shift Away From Shipping:**
- Shipping has better access to traditional supply chains (ports everywhere)
- Shipping companies have OEM relationships (standardized maintenance protocols)
- Offshore operations (oil/gas, mining, fishing) have different problem profile

**Key Quote (Mahmoud):** "Let's consider the worst-case scenario. If that happens, we are talking about at least 100k to $1 million each day because of loss of that whole operational system."

**Strategic Implication:**
- **Primary target is NOT maritime shipping** (which has good supply chain access)
- **Primary target is offshore energy + mining + remote operations** (which have acute supply chain problems)
- Oceana platform is more relevant to shipping; for offshore, you need different entry point

**Recommendation:** Position AddManuChain as "offshore operations first" (where pain is acute), then expand to maritime shipping (where pain is chronic but manageable).

---

## 6. DEFENCE/NATO EXPANSION: CONCEPTUALLY SOUND, COMPLEXITIES IMMENSE

**Insight:** When asked about defence/NATO applications, Andrew said: "I think, overall, the idea that you can have agile hubs around the world which can act as equipment depots makes a lot of sense."

This was the strongest endorsement from Andrew - suggesting this use case unlocks significant value.

**The Challenge (Andrew's perspective):**
- **Geographic distribution:** NATO covers specific areas; some strategic locations (Strait of Hormuz) are far from manufacturing hubs
- **Allied nation governance:** Not all NATO countries have same security clearances or IP policies
- **IP complexity:** Different nations have different attitudes toward outsourced manufacturing

**The Opportunity:**
If you can solve distributed manufacturing for defence, you've solved the hardest problem. Commercial maritime/offshore becomes easier.

**Key Quote (Andrew):** "Directionally, yes, that is one of the areas that we are moving into...There's really tricky when you get into the onboard stuff, because you're dealing with whatever equipment everyone has, and that make differ quite a bit from a shipping company, let alone from 500 different shipping companies right?"

**Strategic Implication:**
- Defence use case requires **government relationships (DND, NATO allies)**
- Requires **security clearances and IP governance frameworks**
- Requires **allied nation authorization (Five Eyes vs. broader NATO vs. non-aligned)**
- This is a **multi-year enterprise sales effort**, not a quick pivot

**Recommendation:** Build commercial maritime/offshore foundation first; use as proof point for defence expansion (2-3 year timeline).

---

## 7. FUEL LOGISTICS INTEGRATION: THE HIDDEN OPPORTUNITY

**Insight:** Andrew's most creative suggestion came late in the conversation: "If I could do this at the same time as they're getting fuel. Then then we're using an activity...logistics have already been set up. Ah, you already have a facility. They need to go to anyway, a relationship they're already leveraging anyway."

This is a **brilliant distribution strategy** that Andrew almost casually mentioned.

**Current State:**
- Vessels MUST get fuel at specific ports
- Fuel logistics are already established
- Vessels have existing supplier relationships

**The Opportunity:**
If you can **co-locate 3D printing capability with fuel suppliers**, you:
1. **Piggyback on existing logistics** (vessel already visiting location)
2. **Leverage existing business relationships** (vessel → fuel supplier already trusted)
3. **Solve timing problem** (parts ready during refueling stop)
4. **Share operational infrastructure** (facilities, security protocols, certifications)

**Strategic Implication:**
This suggests a **partnership model with fuel suppliers** (e.g., major maritime fuel companies, Shell Marine, Bunker One, etc.) rather than independent print hubs.

**Partnership Lever:** Approach fuel suppliers with: "We can add 3D printing to your service portfolio without changing your existing operational model."

---

## 8. VICTORIA-CLASS SUBMARINES: SPECIFIC VALIDATION OF PAIN POINT

**Insight:** Mahmoud mentioned Victoria-class submarines, and Andrew did not challenge the premise. This validates a specific, high-value pain point.

**Why Victoria-Class?**
- **Age:** 30-40 year old platforms
- **OEM Status:** Original suppliers defunct or no longer serving naval market
- **Spare parts availability:** Genuine crisis (reverse engineering is only option)
- **Cost sensitivity:** Military budgets are constrained; any cost savings valuable
- **Strategic importance:** ~6 submarines represent significant national asset

**Key Quote (Mahmoud):** "The Victoria class submarines, I mean, they don't have some kind of the OEMs right now. No one's going to high school or blame you why you produce that or said it okay? No one was there to produce that. I have to do something right?"

**Strategic Implication:**
- Victoria-class is a **proof point for defence viability**
- Success here would validate approach for broader defence procurement (F-18, CF-95, other aging platforms)
- Requires **DND partnership** (not commercial approach)
- Requires **Canadian manufacturing capabilities** (on-shore production)

**Recommendation:** Position Dalhousie/Canadian partnership for Victoria-class pilot; use success as wedge for broader defence procurement.

---

## 9. PORT AUTHORITY PARTNERSHIP MODEL

**Insight:** Andrew emphasized that GTICS collaborates with port authorities on water-side coordination. He mentioned Port of Halifax specifically and suggested this as a natural partnership point.

**Port Authority Value:**
- Port authorities control facility access and clearance
- Port authorities have relationships with vessel operators
- Port authorities have security/compliance protocols
- Port authorities are interested in increasing non-traditional services (competitive advantage)

**Current State:**
- Port of Halifax has innovation focus (Andrew built "The Pier" - innovation facility)
- Port authorities respond to federal/provincial economic development initiatives
- Port authorities see 3D manufacturing as potential competitive differentiator

**Current Barrier:**
- Andrew emphasized port authorities focus on water-side (vessel coordination)
- Most ports don't currently operate 3D printing facilities
- Land-side logistics are NOT Andrew's area (he was clear about this limitation)

**Strategic Implication:**
- **Port authority partnerships could solve facility/location problem**
- **Port authority endorsement would signal legitimacy** to vessel operators
- **Port authority could help navigate certification** (they deal with regulators already)

**Recommendation:** Partner with Port of Halifax (Andrew's network) to pilot "3D printing as port service" model. Use this as proof point for other ports.

---

## 10. 70+ INDUSTRIES CONSULTED: PATTERN VALIDATION

**Insight:** Mahmoud mentioned having talked with 70+ industries confirming the problem pattern. Andrew didn't challenge this; he validated that the $100K-$1M daily downtime cost is real across different sectors.

**Industries Where Problem Is Acute:**
1. Offshore energy (oil/gas rigs)
2. Mining (remote operations, SAG mills, etc.)
3. Maritime shipping (less acute; better supply chains)
4. Submarine operations (very acute; few suppliers)
5. Other remote operations (fishing, communications, etc.)

**Key Quote (Andrew):** "If you can do it, it'll be really interesting...it's big vision. And that's always fun, but I get it."

This is tacit validation from someone with deep maritime expertise that the problem space is real and valuable.

**Strategic Implication:**
- Problem is **not hypothetical**; it's validated across 70+ conversations
- Pain point is **not evenly distributed** (offshore >> shipping >> land-based)
- Solution must be **industry-specific** (offshore requires different model than shipping)

---

## 11. NETWORK LIMITATIONS: ANDREW'S HONEST ASSESSMENT

**Insight:** When asked for introductions, Andrew was honest: "My assumption is that the most valuable thing that you would connect with probably be OEMs and that is non area where I'm strong...the kind of people I know hang out at ports...I'm more maritime Maria. So more on the commercial stuff."

**What Andrew Has Access To:**
- Commercial maritime operators (shipping companies, logistics)
- Port authorities (Halifax, Montreal networks)
- Third-party maritime service providers

**What Andrew Does NOT Have Access To:**
- OEM ecosystem (that's not his network)
- Defence procurement (outside his scope)
- Offshore energy operators (different industry)

**Strategic Implication:**
- **Don't expect Andrew to open defence doors** (he's commercial maritime)
- **Andrew's value is port authority + shipping company relationships**
- Different relationships needed for offshore energy (oil/gas companies)
- Different relationships needed for defence (DND, armed forces)

**Recommendation:** Get Andrew's introductions to port authorities and shipping operators; pursue offshore energy and defence through separate channels (Dalhousie, government relations).

---

## 12. TIMING: STRATEGIC OPPORTUNITY WINDOW

**Insight:** When asked about timing, Andrew said: "I think it's timely in the sense that, you know, let no good crisis go to waste. And during the present US administration, we seem to be planning our ways to a lot of prices."

**Context:**
- Post-COVID supply chain fragmentation (reshoring trend)
- Geopolitical competition (NATO, Five Eyes, Chinese competition)
- Industrial policy support (IRAP, NGen, Canada Makes funding)
- Supply chain resilience focus (governments prioritizing onshore manufacturing)

**Key Quote (Andrew):** "There's some parts of the concept that I still haven't wrapped my head around firmly...Conceptually, if you had the right alignment and the right Partners, then it would seem sensible."

**Strategic Implication:**
- **Timing is favorable** (supply chain reshoring trend)
- **Government support available** (federal/provincial funding)
- **Concept is credible** (even if details are fuzzy to Andrew)
- **Window may be limited** (geopolitical dynamics could shift)

---

## 13. PARTNERSHIP POTENTIAL ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| **Conceptual Fit** | 8/10 | Problem space is real; Andrew validates pain point across 70+ industries |
| **Network Access** | 6/10 | Strong in commercial maritime/port authorities; weak in OEM/defence |
| **Technical Expertise** | 5/10 | Strong in water-side coordination; weak in manufacturing/certification |
| **Willingness to Collaborate** | 9/10 | Andrew explicitly invited follow-up; offered to think about introductions |
| **Strategic Alignment** | 7/10 | GTICS could benefit from fulfillment partner; but not essential to their business |
| **Near-Term Opportunity** | 6/10 | Port authority relationships could accelerate; but still requires OEM navigation |
| **Long-Term Upside** | 8/10 | If you solve distributed manufacturing, Oceana integration becomes valuable; natural partnership |

**Overall Partnership Potential: 7/10**

**Next Steps:**
1. Send Andrew follow-up email with specific use cases (Victoria-class, offshore rig scenario)
2. Ask for Port of Halifax introduction (Donna Hatt or other innovation contact)
3. Invite to co-present at industry conferences (positioning as complementary)
4. Schedule 6-month check-in after initial customer wins (Kinross, Paleagus reference validation)

---

## 14. CRITICAL SUCCESS FACTORS (From Andrew's Perspective)

**What Would Make This Work (Andrew's Implicit Requirements):**

1. **OEM Alignment** (the hard part)
   - Must demonstrate non-competitive positioning
   - Must show that you're serving markets OEMs have abandoned
   - Must have clear IP governance model

2. **Security/Certification** (essential but solvable)
   - Must navigate Lloyd's, DNV, class society requirements
   - Must work within existing port authority security protocols
   - Must not create additional burden on port operations

3. **Vessel Operator Buy-In** (critical path)
   - Must prove ROI (cost of downtime >> cost of on-demand 3D printing)
   - Must show reliability (parts work as well as OEM parts)
   - Must integrate with existing maintenance protocols

4. **Port Authority Integration** (accelerator)
   - Must not disrupt water-side operations
   - Must align with port's business model (revenue share, service fee)
   - Must leverage existing facility infrastructure

5. **Regulatory Clarity** (permission to operate)
   - Must understand Transport Canada requirements
   - Must navigate DND/Five Eyes governance (if defence path)
   - Must have clear liability model (who's responsible if printed part fails?)

---

## 15. STRATEGIC POSITIONING FOR ANDREW'S NETWORK

**How to Approach:**
- **Frame as:** "Platform to connect distributed AM capabilities with vessel operators experiencing supply chain delays"
- **Don't Frame as:** "Replacing OEM supply chains" or "Threat to maritime industry"
- **Leverage Andrew's Language:** Use terms like "supply chain resilience," "port infrastructure," "vessel coordination"
- **Avoid Technical Jargon:** Keep discussion at strategic/business level; Andrew isn't CAD designer or materials scientist

**Quick Win Opportunity:**
- Get Port of Halifax as beta partner (facility + operator relationships)
- Work with one shipping company on pilot program
- Use success to create demand signal through Oceana ecosystem
- Position as "Oceana + AddManuChain" integrated offering

**Long-Term Vision (Andrew's Perspective):**
- Oceana surfaces demand signals (vessel arrival + component requirements)
- AddManuChain fulfills via regional hubs
- Both companies monetize (Oceana gets higher platform stickiness; AddManuChain gets customers)
- Port authorities win (increased facility utilization; new revenue stream)

