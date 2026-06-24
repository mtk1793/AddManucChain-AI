# Deep Interview Analysis: Mike Paulin - C-CORE / Memorial University
**Interview #31**  
**Date:** February 12, 2026  
**Analyst:** Michael Kiasari  
**Analysis Date:** February 12, 2026

---

## Executive Summary

This interview with Mike Paulin, a 37-year veteran of Arctic offshore pipeline engineering (C-CORE, semi-retired adjunct Prof. at Memorial), provided **MODERATE-HIGH** strategic value. While Mike's expertise is pipeline-specific (not rotating equipment), he delivered critical validation on **Arctic spare parts logistics**, **downtime economics**, and **certification pathways**. He clarified that **C-CORE does NOT certify components** — they do design validation only — and pointed us firmly toward **DNV, Lloyd's, and ABS** as the real certification gatekeepers. He also reinforced the **OEM warranty risk** for wind turbines and confirmed **Energy NL (Dave Finn)** and **Dwayne Hopkins** as key contacts.

### Key Validation Metrics:
- ✅ **Arctic logistics pain confirmed**: Remote platforms stranded during ice formation/breakup — helicopter-only access
- ✅ **Downtime cost formula validated**: Production rate × oil price = daily loss (up to 100,000 bbl/day × $70)
- ✅ **Spare parts cooperatives exist**: Gulf of Mexico pooled inventory model (validates platform/marketplace concept)
- ⚠️ **C-CORE misconception corrected**: They do design validation, NOT component certification
- ✅ **Bay du Nord confirmed**: $10B project, 1000m depth, FPSO, billion-barrel potential — still in negotiation
- ✅ **AI in maintenance validated**: Shift from prescriptive → performance-based/risk-based maintenance
- ⚠️ **Wind turbine OEM warranty risk**: Non-OEM parts could void warranties — significant barrier for offshore wind

**Interview Quality:** ⭐⭐⭐⭐ **VERY GOOD** — Arctic logistics expert, certification pathway clarifier, Lab2Market alumni interviewer

---

## Deep Dive Analysis

### 1. Arctic & Remote Spare Parts Logistics 🧊

#### What Mike Said:
> "Some of these places are fairly remote and some of the projects that I've worked on are on the North Slope of Alaska... When the ice is forming or the ice is breaking up, you're sort of stranded on the platform."

> "When I worked on projects for Sakhalin Island the East Coast of Russia, you know, there could be days that you can't access the platforms due to weather and fog."

#### Critical Insights:
1. **Three access windows for Arctic platforms:**
   - **Open water**: Boat access ✅
   - **Solid ice**: Vehicle/sled access ✅
   - **Ice formation / breakup**: **STRANDED** — helicopter only (expensive, weather-dependent) ❌
2. **Spare part hoarding is rational**: "You will have spare parts on hand" — keeping inventory is standard practice
3. **Cost of not stocking**: "In an extreme case, maybe 2 of them break and you don't have them there" — catastrophic risk

#### Quantitative Data:
- **Downtime range**: $0 (minor component) → **100,000 bbl/day × $70/bbl = $7M/day** (full shutdown)
- **Production range**: 10,000 – 100,000 barrels/day depending on platform
- **Oil price benchmark**: $70/barrel used as reference

#### Strategic Implications:
- ✅ **Validates Keith Healey's Arctic niche hypothesis** — remoteness makes spare parts logistics critical
- ✅ **Validates Jason Power's $500K-$1M/day downtime** — Mike's math shows even larger numbers possible
- 🆕 **New insight: Ice transition periods** create 2-4 week windows where platforms are effectively isolated
- 🆕 **Geographic scope**: Not just NL — Alaska North Slope, Sakhalin Island (Russia), Kazakhstan all face identical challenges

---

### 2. Gulf of Mexico Cooperative Model 🤝

#### What Mike Said:
> "In the Gulf of Mexico, there's cooperatives that with companies that come together and they might have spare parts as a group. Not everybody keeps their spare parts, but there's a collective or cooperative. They keep a pool of commonly used spare parts. And you withdraw after that. And then replace it."

#### Critical Insights:
1. **Shared inventory model already exists** — Gulf of Mexico operators pool commonly used spare parts
2. **Draw-and-replace system**: Withdraw what you need, then replenish the pool
3. **Only works at scale**: "That's the Gulf of Mexico, where there's a very big offshore and gas industry" — not feasible for remote single-platform locations
4. **Gap identified**: Arctic/Atlantic Canada has **NO such cooperative** — each operator manages alone

#### Strategic Implications:
- ✅ **Validates the AddManuChain platform concept** — cooperative spare parts pools already accepted in industry
- 🆕 **AddManuChain could BE the digital cooperative** — instead of physical pooled warehouses, our digital inventory serves the same function globally
- ⚠️ **Competitive risk**: GoM cooperatives could resist digital disruption if they're working well enough physically
- 🎯 **Beachhead opportunity**: Atlantic Canada (no cooperative) is a better launch market than GoM (has cooperative)

---

### 3. Certification Pathway Clarification ⚖️

#### What Mike Said:
> "I don't know where you've got this impression that C-CORE does certification... We did designs, and we did validation of pipeline designs from an ice gouge or ice scour perspective."

> "You probably need to have some sort of case from certification authorities — DNV or Lloyd's, ABS."

> "Depends on what the certifying authority might tell you, hey, you need to check the strength, you need to check the corrosion resistance. You need to check the resistance to acids or CO2."

#### Critical Insights:
1. **C-CORE = Design validation only** (not component certification) — important misconception corrected
2. **Certification hierarchy**:
   - **DNV / Lloyd's / ABS** → Set standards and issue certifications
   - **C-CORE** → Physical/numerical modeling for design validation (centrifuge, g-forces)
   - **Memorial University** → Lab testing (load machines, loading frames)
   - **Government NRC Lab** → Large-scale testing
3. **Testing is dictated by certifying authority**: They tell you what to test, then you find the appropriate lab
4. **Component-specific certification**: Each component type has different requirements (strength, corrosion, flexibility, rigidity)

#### Validated Certification Pathway:
```
Step 1: Certifying Authority (DNV/Lloyd's/ABS) defines test requirements
Step 2: Testing facility (C-CORE/Memorial/NRC) performs validation tests
Step 3: Results submitted back to certifying authority
Step 4: Certification issued (or denied)
```

#### Strategic Implications:
- ✅ **Confirms Dwane Hopkins' recommendation**: Lloyd's Register (Trevor Butler) is the right first contact
- ✅ **Validates Andrew Smith's certification pathway**: CME/CSA → Lloyd's/DNV is the ladder
- 🆕 **Testing facility opportunity**: Memorial and C-CORE could be testing partners for AM component validation
- 🎯 **Action**: Must approach DNV/Lloyd's FIRST to understand requirements, THEN find testing partner

---

### 4. OEM vs AM Component Equivalence Challenge 🔧

#### What Mike Said:
> "Is that drive shaft or whatever component as good as an OEM piece of equipment from the original equipment manufacturer? Is it as strong, as flexible, as rigid?"

> "Maybe it doesn't have as long of life, but you accept that. And you accept that you're going to replace it more often. Perhaps or until you can get the OEM piece of equipment."

#### Critical Insights:
1. **OEM equivalence is the gold standard** — AM parts must match OEM specs
2. **Acceptable trade-off identified**: Shorter life AM part is OK IF:
   - It gets you running quickly
   - You plan to replace with OEM part when available
   - Cost of downtime > cost of more frequent replacement
3. **"Bridge part" concept**: AM part as temporary fix until OEM arrives

#### Strategic Implications:
- 🆕 **"Bridge Part" value proposition**: Don't position AM as permanent OEM replacement — position as **emergency bridge** to reduce downtime
- ✅ **Validates Jason Power's "last resort" framing**: AM is accepted when alternative is extended shutdown
- 🎯 **Pricing model**: AM bridge part priced against downtime cost, not against OEM part cost

---

### 5. Pipeline vs. Platform Component Dynamics 🏗️

#### What Mike Said:
> "A pipeline is a linear structure. Essentially, it's a piece of steel with a hole in the middle... generally, they don't break."

> "The weak link on a production platform, it's going to be in other areas... pumps and rotating equipment and they are definitely critical to your production."

#### Critical Insights:
1. **Pipelines are NOT an AM target** — no moving parts, rarely fail, intelligent pigging catches issues early
2. **Platform process equipment IS the target** — pumps, compressors, rotating equipment
3. **Pipeline failures are catastrophic but rare** — when they happen, it's months and millions (not an AM use case)
4. **Intelligent pigging**: Smart tools detect corrosion/defects before failure — preventive, not reactive

#### Strategic Implications:
- ❌ **Remove pipelines from target components** — Mike confirms they're not suitable for AM replacement
- ✅ **Focus on rotating/process equipment** — validates Jason Power's compressor/pump focus
- 🆕 **Intelligent pigging = AI predecessor**: Industry already uses data-driven maintenance for pipelines — can extend to platform equipment

---

### 6. Bay du Nord Project Intelligence 🇳🇴

#### What Mike Said:
> "500 km offshore. In very deep water about 1000 m, water depths... potential for a billion barrels of oil."

> "It will be a floating ship. A FPSO (Floating Production Storage and Offloading) structure."

> "Billion times $70 a barrel. And 70 billion may cost you 10 billion to develop."

#### Critical Insights:
1. **Project economics**: ~$70B revenue potential vs. ~$10B development cost
2. **Platform type**: FPSO (Floating Production Storage & Offloading) — new to NL offshore
3. **Remoteness**: 500km offshore, 1000m depth — the most remote NL platform ever
4. **Status**: Still in benefits agreement negotiation with province — NOT confirmed yet
5. **Timeline**: Decision expected within months (per Dwane Hopkins' meeting)

#### Strategic Implications:
- ✅ **Validates Keith Healey's Bay du Nord beachhead** — FPSO is new build (greenfield), no existing warehouse system
- ✅ **FPSO = equipment-dense platform** — more rotating/process equipment than gravity-based platforms
- 🎯 **Timing**: Equinor decision upcoming — must establish contact before project ramp-up begins
- 🆕 **FPSO-specific**: Mooring systems, drilling risers, production risers — all have maintenance needs

---

### 7. AI for Maintenance: Prescriptive → Performance-Based 🤖

#### What Mike Said:
> "There's been a debate around Prescriptive maintenance... you will change the filter on this pump every 3 months full stop. Doesn't matter filter's dirty or clean."

> "Why do I need to do that if I can do it on a more performance-based or risk-based approach? If we can maybe let the filter go 5 months, because we've seen the data has shown that we can."

> "These things may be intertwined... they may have linkages to other pieces of the entire plant with hundreds of thousands of components."

#### Critical Insights:
1. **Industry tension**: Regulators mandate prescriptive schedules, operators want performance-based
2. **Regulators evolving**: "Have started to evolve to the point where taking data and information can be used to help guide the maintenance schedules"
3. **Complexity**: Components are interconnected — can't optimize one in isolation
4. **Scale challenge**: "Hundreds of thousands of components" — impossible to track manually
5. **Human validation required**: "AI says we need to change that filter every 10 minutes. Well, but that's obviously wrong."

#### Strategic Implications:
- ✅ **Validates AI/predictive maintenance module** — industry actively moving this direction
- ✅ **Validates "too much data, not enough people" insight** from earlier interviews
- 🆕 **Regulatory angle**: AI can help operators demonstrate compliance with performance-based approach → cost savings
- ⚠️ **Human-in-the-loop mandatory**: AI recommendations must be validated by experienced engineers

---

### 8. Offshore Wind: OEM Warranty Barrier 🌊💨

#### What Mike Said:
> "If you have that and you put in non-OEM parts. How does that affect your warranty?"

> "It's like your car — you start putting in not OEM parts, then Volkswagen might say, hey, you put in cheap Chinese brake pads. And that's when screwed up your brake."

> "A wind turbine... it's that one piece that's generating your power. That's fairly compact, integrated piece of equipment that may all come under the OEM."

#### Critical Insights:
1. **OEM warranty risk**: Siemens/Vestas turbines are integrated systems — non-OEM parts could void warranty
2. **Contrast with O&G platforms**: Oil platforms have diverse equipment from multiple OEMs — easier to swap individual components
3. **Wind turbine structure**: Mast + nacelle + blades — nacelle is the critical, compact, OEM-controlled unit
4. **Nova Scotia push**: Premier Tim Houston pushing offshore wind aggressively — opportunity ahead

#### Strategic Implications:
- ⚠️ **Offshore wind is HARDER than O&G for AM** — OEM control is tighter
- 🎯 **Potential entry**: Mast/foundation components (non-OEM-controlled), NOT nacelle internals
- 🆕 **Timing**: Wait for wind industry to mature before targeting — focus on O&G first

---

## 🔍 Key Quotes & Insights

### On Arctic Logistics:
> "When the ice is forming or the ice is breaking up, you're sort of stranded on the platform. And now they can do helicopter lifts, but again, that can be expensive."

### On Downtime Economics:
> "You can figure out if you have a platform that's doing 20,000 barrels a day times the price of oil... to completely shut down."

### On Gulf of Mexico Cooperative:
> "There's cooperatives... they keep a pool of commonly used spare parts. And you withdraw after that. And then replace it."

### On AM as Bridge Solution:
> "Maybe it doesn't have as long of life, but you accept that... until you can get the OEM piece of equipment."

### On AI Validation:
> "We still need a human element. Human component to that."

---

## 📊 Hypothesis Validation Summary

| Hypothesis | Status | Evidence |
|---|---|---|
| **NH.1:** Spare parts logistics is major offshore pain | ✅ **VALIDATED** | Arctic stranding, 3 access windows, helicopter-only periods |
| **NH.3:** Downtime costs justify AM investment | ✅ **VALIDATED** | Up to 100K bbl/day × $70 = $7M/day theoretical max |
| **NH.8:** Post-COVID inventory hoarding trend | ✅ **SUPPORTED** | Keeping "something on a shelf" is standard practice |
| **NH.10:** IP/OEM protection is major blocker | ✅ **SUPPORTED** | Must match OEM specs, warranty implications |
| **NH.11:** Certification is gatekeeping barrier | ✅ **CLARIFIED** | DNV/Lloyd's/ABS are gatekeepers, NOT C-CORE |
| **NH.22:** AI predictive maintenance opportunity | ✅ **VALIDATED** | Prescriptive → performance-based shift underway |
| **NH.27:** Bay du Nord is beachhead opportunity | ✅ **SUPPORTED** | $10B project, FPSO, 1000m depth, billion-barrel potential |
| **NEW:** Cooperative spare parts model exists (GoM) | 🆕 **DISCOVERED** | AddManuChain = digital version of physical cooperative |
| **NEW:** AM "bridge part" concept is acceptable | 🆕 **DISCOVERED** | Temporary AM until OEM arrives — industry would accept |
| **NEW:** Wind turbine OEM warranty is barrier | ⚠️ **CAUTION** | Compact integrated systems harder to penetrate than O&G |

---

## 🎯 Actionable Next Steps

### 1. Prioritize Lloyd's/DNV Contact (Highest Priority)
> Mike confirmed certification authorities dictate testing requirements — must understand THEIR process first.

**Action:** Contact Trevor Butler (Lloyd's Register, St. John's) — referral from Dwane Hopkins.

### 2. Position AM as "Bridge Parts" (Not OEM Replacement)
> Mike's insight that operators will accept shorter-life AM parts as temporary fix during downtime.

**Action:** Update pitch to emphasize "bridge-to-OEM" value proposition — reduces resistance.

### 3. Pursue Digital Cooperative Model
> Gulf of Mexico physical spare parts cooperatives validate the shared inventory concept.

**Action:** Position AddManuChain as the "digital cooperative" — same concept, global reach, lower cost.

### 4. Remove Pipeline Components from Target List
> Mike confirmed pipelines don't break, no moving parts, intelligent pigging catches issues early.

**Action:** Focus AM targets on **rotating/process equipment only** (pumps, compressors, valves, motors).

### 5. Follow Up with Energy NL (Dave Finn)
> After March 10-11 Digitalization Conference — Dave will be more available.

**Action:** Re-contact Dave Finn after March 11 — reference Mike Paulin and Dwayne Hopkins.

### 6. Delay Offshore Wind Entry
> OEM warranty barrier is significant — wind turbines are too integrated for AM penetration now.

**Action:** Focus on O&G platforms first — revisit offshore wind when NS projects mature.

---

## 📞 Contacts & Referrals

| Contact | Organization | Referred By | Status |
|---|---|---|---|
| Dwayne Hopkins | Lab2Market Mentor | Already known | ✅ Active mentor |
| Dave Finn | Energy NL (CEO) | Mike Paulin + Keith Healey | ⬜ Contact after March 11 conference |
| Energy NL Staff | Energy NL | Mike Paulin | ⬜ Ask Dwayne who's the best technical person |
| Trevor Butler | Lloyd's Register (St. John's) | Dwayne Hopkins | ⬜ HIGH PRIORITY contact |

---

## 🔄 Cross-Reference with Previous Interviews

| Topic | Mike Paulin (#31) | Confirming Interview |
|---|---|---|
| Arctic logistics pain | Stranded during ice transition | Keith Healey (#27) — remote access challenges |
| Downtime cost formula | Production × oil price | Jason Power (#4) — $500K-$1M/day |
| Bay du Nord beachhead | FPSO, $10B, billion barrels | Keith Healey (#27) — Equinor greenfield |
| Certification pathway | DNV/Lloyd's/ABS are gatekeepers | Andrew Smith (#28) — CME/CSA pathway |
| GoM spare parts cooperative | Physical pooled inventory | Jason Power (#4) — operator inventory hoarding |
| Prescriptive → performance maintenance | Industry shifting | Multiple interviews — AI gap |
| Atlantic Excel exists | Mike knows them | Andrew Smith (#28) — competitor awareness |
| Human-in-the-loop for AI | Must validate AI outputs | Keith Healey (#27) — regulator knowledge gap |
