# Interview #45 Analysis: Adam Saxty — Lloyd's Register (UK)
**Date:** February 18, 2026
**Duration:** ~60 minutes (group meeting — joined slightly late from UK)
**Format:** Virtual
**Interviewee:** Adam Saxty, Lead AM Technologist, Technical Directorate — Lloyd's Register, UK
**Prepared by:** Mahmoud (Michael) Kiasari

> **Note:** This was a three-person Lloyd's Register group meeting. Trevor Butler (Offshore Energy BD, St. John's) is documented in Interview #42. Dave Whitehouse (Naval/Defense Advisory, Dartmouth) is documented in Interview #46.

---

## INTERVIEWEE PROFILE

| Field | Detail |
|-------|--------|
| **Name** | Adam Saxty |
| **Title** | Lead AM Technologist, Technical Directorate |
| **Organization** | Lloyd's Register |
| **Location** | UK (remote) |
| **Focus** | Additive manufacturing certification, technical standards, in-process monitoring R&D |
| **Connection** | Michael reached out ~2 weeks prior; original 1:1 meeting merged into this group call |
| **Background** | Technical authority on AM certification within LR globally |

---

## EXECUTIVE SUMMARY

⭐⭐⭐⭐⭐ **EXTRAORDINARY — Technical Authority**

Adam Saxty is the foremost AM certification expert within Lloyd's Register's global technical directorate. His contribution to this meeting was the most technically dense and authoritative in 45 interviews. He provided the **complete 7-step AM certification pathway** in real time, identified the two separate certification tracks (marine vs. offshore), raised **machine variability** as the critical unsolved challenge for on-site printing, and described LR's R&D direction toward **in-process monitoring** as the future of AM certification. His insights directly validate the pre-certified parts library concept and define the technical roadmap for AddManuChain's platform architecture.

---

## KEY INSIGHT #1: THE FULL AM CERTIFICATION PATHWAY — 7 STEPS (Adam's Breakdown)

Adam provided the most authoritative, step-by-step AM certification breakdown in the entire customer discovery process.

### Step 1: Design Review
- Check part suitability for the application
- Happens regardless of manufacturing technology
- For AM: additional considerations around geometry, support structures, build orientation

### Step 2: Material Specification
> *"Obviously before traditional manufacturing there are lots of standards specifying chemistry, strength, material properties, but we don't have that for AM. There are one or two, but limited. So the designer has to produce their material specification, part by part, and quite often that will be based on a conventional specification. But you're never going to get exactly the same. So we want to understand what the differences are."*

- **No universal AM material standards exist yet** (the MMPDS equivalent gap)
- Designer must produce a custom material spec per part
- Based on conventional standards but adapted for AM process differences

### Step 3: Facility Qualification (Printing Center)
> *"If we are certifying a part, we need to have confidence in the facility that's producing the part in terms of quality assurance."*

Includes:
- Personnel training
- Machine maintenance and calibration
- Post-processing procedures
- CAD-to-machine translation (converting CAD model to machine build instructions)
- **Done ONCE per facility, not per part** — critical insight for platform model

### Step 4: Feedstock Qualification
> *"With powder-based processes — how is the feedstock going to change over time with every reuse? So is there a process for the powder qualification? And when we certify a part, we may need to witness some powder qualification."*

- Powder reuse tracking (contamination, chemistry drift over repeated reuse cycles)
- Batch consistency verification
- Wire-based processes: different and simpler feedstock concerns

### Step 5: Part Qualification (Prototype)
> *"My number one concern — certainly my number one concern — is: many of you're printing a replacement part, it's got to perform as good as the part it's replacing, if not better. And how are we going to prove that out? That's where part qualification comes in."*

- Build prototype part
- Destructive mechanical testing
- Prove performance equals or exceeds conventional equivalent

### Step 6: Production Certification
> *"Once we qualify the part and we're ready for production... there might be different certification clients depending on the nature of the part."*

- Build **test coupons alongside actual parts** using identical parameters
- Test coupons undergo mechanical testing to verify material properties
- Functional testing depending on part nature: pressure test, load test, etc.
- *"Most 3D printing centers are kind of doing that with their builds already."*

### Step 7: Installation Approval
- All documentation complete → part certified → part installed

---

## KEY INSIGHT #2: WHAT HAPPENS ONCE vs. EVERY ORDER

Trevor clarified the commercial implication after Adam's walkthrough (captured here because it directly applies to Adam's certification architecture):

| Phase | Frequency | Platform Implication |
|-------|----------|---------------------|
| Facility qualification (Steps 3–4) | **ONCE** per facility | Atlantic XL: already done |
| Design review + part qualification (Steps 1–2, 5) | **ONCE** per part design | Build into parts library |
| Production print + test coupon (Steps 6–7) | **Every order** | Lightweight per-order verification |

> *"You don't have to go through all that qualification process every single time. That should be a prerequisite to being included in a digital inventory."*
> — Trevor Butler (summarizing Adam's technical framework)

**This is the commercial case for the pre-certified parts library.** Adam's framework proves it's technically sound.

---

## KEY INSIGHT #3: MARINE vs. OFFSHORE — TWO SEPARATE CERTIFICATION TRACKS

> *"I don't know how much you're going to focus on marine as opposed to offshore, but if you're going to look at marine as well, that's a different set of rules that we have."*
> — Adam Saxty

| Track | Rules | Strictness |
|-------|-------|-----------|
| **Marine** | Lloyd's Register Rules (formal, prescriptive) | Stricter |
| **Offshore** | Application/international standards | More flexible |

**Platform implication:** AddManuChain needs two separate certification pathways — one for marine assets (vessels, naval), one for offshore installations (FPSOs, rigs). Do not conflate them in the pitch or the platform architecture.

---

## KEY INSIGHT #4: MACHINE VARIABILITY — THE UNSOLVED CHALLENGE FOR ON-SITE PRINTING

Adam raised the most technically significant unsolved problem for on-site AM:

> *"What if you had qualified a part on one machine, but then you wanted to print that part for use in production, and that might be on a machine which is in the middle of the Atlantic Ocean on an offshore rig, or it's onboard a ship? How are we going to have confidence that the part printed is going to be the same as the part that was qualified?"*

### The Problem:
- Part qualification is done on **a specific machine** with specific parameters
- If printing happens on a **different machine** (on-site or offshore), the qualification may not transfer
- No universal machine parameter equivalency standards exist yet
- Different machines from different manufacturers behave differently even for the same print job

### Current Industry Status:
- Each company/facility has unique machines and unique parts — mostly case-by-case
- No scalable cross-machine qualification framework exists
- This is the primary technical barrier to on-site and on-vessel AM printing

### Michael's Validation:
> *"The thing that you mentioned right now, Mr. Saxty, was our topic yesterday. I was talking to a Prof. in New Brunswick who is also working in additive manufacturing, and he brought the exact same idea that you mentioned."*

---

## KEY INSIGHT #5: IN-PROCESS MONITORING — LR'S R&D DIRECTION AND FUTURE MOAT

Adam disclosed LR's future research direction — the long-term solution to the machine variability problem:

> *"One of the areas which we are getting a bit broader within LR — and kind of the future — is how we can certify and verify parts which may move away a little bit from this CAD inspection testing regime with the final part, and how we can move to monitoring the manufacturing process."*

> *"AM is particularly suited to that because you've got the process monitoring techniques that you can do while you're printing, there by layer. So you may be monitoring the field there by layer, and we can then — how can we get that level of assurance through that route, rather than printing test coupons and destructively testing?"*

> *"I can't say we would — if we were to put this into a commercial solution tomorrow — we wouldn't be going that route yet because we don't know. But that is our future end goal."*

### Why This Matters for AddManuChain:
- **Short-term:** Test coupons remain the standard (shore-based facilities, Atlantic XL)
- **Medium-term:** In-process monitoring enables reduced destructive testing per order
- **Long-term:** In-process monitoring solves the machine variability problem → unlocks on-vessel printing
- **Partnership opportunity:** Propose a research collaboration with LR on in-process monitoring — aligns with Dr. Ali Nasiri's in-process defect detection work at Dalhousie

---

## HYPOTHESIS VALIDATION

| Hypothesis | Status | Adam's Evidence |
|------------|--------|----------------|
| Certification is achievable (not a permanent wall) | ✅ CONFIRMED | Full 7-step pathway maps exactly what needs to be done |
| Facility qualification is a one-time cost | ✅ CONFIRMED | Steps 3–4 are once per facility |
| Part qualification is a one-time cost per design | ✅ CONFIRMED | Steps 1–2, 5 are once per part design |
| No universal AM material standards exist | ✅ CONFIRMED | *"There are one or two, but limited"* (MMPDS equivalent gap) |
| Machine variability = unsolved barrier for on-site AM | ✅ CONFIRMED | Adam raised this explicitly as the key open question |
| In-process monitoring = future of AM cert | ✅ NEW INSIGHT | LR is actively investing R&D here |
| Marine ≠ Offshore certification | ✅ NEW INSIGHT | Two separate rule sets confirmed |

---

## STRATEGIC IMPLICATIONS

### 1. Platform Architecture — Two Certification Tracks
Build separate workflows for Marine (LR Rules) and Offshore (application standards). These are not interchangeable.

### 2. Short-Term Strategy — Shore-Based Only
Machine variability makes on-site/on-vessel AM technically unvalidatable today. **Lead only with shore-based certified facilities (Atlantic XL model) in the near term.**

### 3. Research Partnership Opportunity
LR is actively researching in-process monitoring for AM. This aligns exactly with Dalhousie's AM research capacity. A joint research proposal could:
- Give AddManuChain early access to in-process monitoring technology
- Give LR a commercial application partner
- Strengthen the Dalhousie–LR institutional relationship

### 4. Pre-Certified Parts Library — Technically Validated
Adam's 7-step framework confirms: once facility qualification and part qualification are done, subsequent orders are lightweight. The pre-certified parts library is not just commercially attractive — it's technically how LR certification actually works.

---

## KEY QUOTES

> *"My number one concern — certainly my number one concern — is: the part's got to perform as good as the part it's replacing, if not better. And how are we going to prove that out? That's where part qualification comes in."*
> — Adam Saxty

> *"How are we going to have confidence that the part printed [offshore] is going to be the same as the part that was qualified [onshore]?"*
> — Adam Saxty (machine variability challenge)

> *"That is our future end goal [in-process monitoring]. I can't say we would [do it commercially] tomorrow — we don't know yet."*
> — Adam Saxty

> *"If you're going to look at marine as well, that's a different set of rules that we have."*
> — Adam Saxty (two separate certification tracks)

---

## ACTION ITEMS

### Immediate (48 hours):
- [ ] **Record the 7-step certification pathway** in the platform architecture documentation
- [ ] **Update pitch deck** — certification barrier is front-loaded (once), not recurring

### Short-term (2 weeks):
- [ ] **Follow up Adam Saxty** — in-process monitoring research collaboration opportunity
- [ ] **Connect Adam with Dr. Ali Nasiri (Dalhousie)** — in-process defect detection alignment

### Strategic (30–90 days):
- [ ] **Propose LR research partnership** — in-process monitoring for on-site/on-vessel AM certification
- [ ] **Develop two-track certification model** in platform — Marine (LR Rules) vs. Offshore (application standards)
- [ ] **Build certification roadmap slide** using Adam's 7-step framework as the backbone

---

**Interview Rating: 10/10 — Technical authority; most detailed AM certification breakdown in 45 interviews**
**Conducted by:** Mahmoud (Michael) Kiasari + Alireza (Industrial Partner)
**Analysis prepared:** February 18, 2026 | Individual file created: February 19, 2026
