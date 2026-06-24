# Interview #55 — Transcript
## Polyunity Tech: Digital Inventory & AM for Healthcare
**Interviewee:** Steven (Co-Founder & Chief Medical Officer, Polyunity Tech)
**Format:** Video call
**Date:** February 25, 2026
**Program:** Lab2Market Oceans 2026
**Conducted by:** Mahmoud (Michael) Kiasari, Dalhousie University

---

## Background — Interviewee Introduction

Steven is a trained physician who transitioned into industry full-time as Co-Founder and CMO of Polyunity Tech. His interest in 3D printing began approximately 12 years ago when he saw a video of a 3D printer and then observed NASA printing a part in space. At the time he was working in a rural Newfoundland and Labrador hospital where parts were duct-taped together — a direct result of being at the end of a supply chain.

This observation led to the creation of **Monmet 3D**, a research entity at Memorial University, which received approximately $1M in funding to build a state-of-the-art 3D printing facility. That facility served the medical school for simulation, design, and student-led projects.

Monmet 3D eventually spun out into **Polyunity Tech**, incorporated out of Memorial University. Polyunity's core mission: use digital inventory, supply chain resilience tools, and remote manufacturing to service hospitals for critical spare part inventories, novel design creation, and quality and regulatory compliance.

> *"There's a reason this thing is called Polyunity and not MenParts 3D. The infrastructure we've built is transferable — defense, oil and gas, mining — insert industry here where you need digital inventory and a part out the other side."*

---

## Section 1 — Workflow: From Idea to Deployed Part

**Q: When a hospital identifies a broken piece of equipment and decides they want a 3D-printed replacement, what is the workflow?**

Steven described an end-to-end pipeline:

1. **Idea intake portal** — the request comes in with a spec. A human step is included early to validate that the spec is appropriate.
2. **Feasibility gate** — based on material and machine capabilities: Can we proceed with this? Yes or No? If no, the route is closed. If yes, proceed.
3. **Prototype and fit assessment** — one prototype is sent for best-fit evaluation.
4. **Clinical engineering review** — they evaluate: what is it made of, what is its intended use, is it Health Canada certified, what is the manufacturing standard.
5. **Infection prevention and control** — is this a vector for infection? Is the material appropriate? What are the cleaning/sanitization modalities?
6. **Finance and procurement** — cross-reference existing OEM contracts and warranty windows to ensure no conflict.
7. **Part is lit up green** — enters the digital inventory catalogue.
8. **Requester places order** — any quantity, cost reconciled back to their department.

**Key efficiency insight:** If a part has already gone through this pipeline and been approved by one hospital, other hospitals can access it in the digital inventory with the full audit trail already attached. They can skip the full front-end design and approval process — just order directly.

> *"Once it's hosted there and approved for use by one hospital, typically the rest of them are okay with it — because it's already gone through the rigor of one hospital."*

---

## Section 2 — Business Model: Three Tiers of Customer

Polyunity meets organizations where they are on the 3D printing maturity spectrum:

**Tier 1 — Beginners:** Organization has no 3D printing experience. They use the platform to access parts; click a button, part shows up. Polyunity handles everything.

**Tier 2 — Intermediate:** Organization has one or two 3D printers already. They want order and quality assurance around what they have. Polyunity's platform provides the QMS layer — same machine, same material, same work instructions, controlled variables. The software manages quality so in-house prints are consistent and defensible.

**Tier 3 — Advanced / Enterprise:** Organization has a very mature 3D printing ecosystem (e.g., 200 biomeds across 13 hospitals, a printer per hospital) but is managing everything on spreadsheets and email. Polyunity licenses its full platform software to them — they run it themselves. Hands-off for Polyunity. Pure software revenue.

> *"We can take all of the processes that we do internally to fill parts and give it to this very mature ecosystem so they can do it themselves."*

---

## Section 3 — IP Strategy

**Q: You have 500+ pre-certified parts in your platform. How did you deal with protective IP owners and OEMs?**

Key points:

- Of Polyunity's ~600 parts, approximately **10 were designed entirely by Polyunity** from scratch. The rest were requested by frontline healthcare workers ("I wish I had something like this").
- **Novel requests:** The worker describes a problem — not a specific device. Since they describe a problem and not a design, the IP for the resulting design belongs to Polyunity. "You told us a problem. That's not intellectual property. We take the thing, spin it up, make the design, put it in our inventory. It's our IP."
- **Replacement parts for OEM equipment:** OEMs typically protect the entire unit, not individual components. Individual components are often not individually IP-protected. The right to order from Polyunity emerges once warranty windows expire, and clinical engineers have authority under Canada's **right to repair legislation** to make decisions on repairs without going back to OEMs.
- **Liability:** Liability falls on the hospital — that is why the multi-stage check gates exist. The hospital signs off. The audit trail is the protection. Polyunity provides the arms around them — the QMS, the audit trail, the quality management — to keep their case tight.

> *"I haven't cracked the nut in a positive way with med-tech or healthcare OEMs either. But I think we're moving into a future where they'll have no choice but to digitize the parts they can — or they'll say: host all our parts and be a licensed distributor. You can make them using additive, but it's our catalogue."*

---

## Section 4 — Government and Procurement

**Q: What was the single biggest barrier when working with hospital procurement teams at the beginning?**

- Government is not adversarial — it is scrutinous. Taxpayer dollars, due diligence.
- Timelines: multi-year from first contact to contract or dollars in the bank. 50% is education. 50% is finding a use case with enough ROI to justify engagement.
- **Entry strategy used:** Find a single department with a single problem where the dollar value of the project falls **below the discretionary budget threshold** (often ~$10,000 per department). Spend $5K, solve a $100K problem. Use that case to elevate to CEO/CFO.
- The target contract model is **enterprise-level** (full hospital, full province). Polyunity already has two or three provincial-level contracts signed.
- The path to enterprise: start small, show disproportionate ROI, then scale the package upward.

> *"You spent five grand on this job — we designed it, prototyped it, made it, distributed it, and solved a $100,000 problem. That's your elevator pitch to the CFO."*

---

## Section 5 — Cybersecurity

**Q: How do you handle cybersecurity concerns from organizations worried about IP being leaked from your platform?**

- Polyunity operates in healthcare — the most highly regulated personal information ecosystem imaginable.
- They have been required to comply with provincial cybersecurity requirements for transferring personal health information.
- The architecture built to satisfy those requirements is transferable to other industries (oil and gas, defense, mining).

---

## Section 6 — AI (Poly)

**Q: What role does Poly (your AI) actually play — is it an assistant or doing more?**

**Current state:** Poly is a quality management chatbot. It allows clinical engineers and decision-makers to:
- Fine-tune ideas
- Walk through quality assurance and quality management requirements
- Navigate ISO certification and standard requirements

**Target state (in development):** A fully automated compliance engine — idea to deployed part with zero human touch:
- Input: speak or type a description of what you need
- Poly cross-references against all QA metrics and applicable standards
- Produces a 90% first-pass design
- Selects the right machine, the right material, the right facility
- Pushes the job to production automatically
- Part comes off the machine ready to use

> *"When we get this thing done, it's going to be a full pipeline that pushes product all the way through — ideally something pops off a machine ready to rock without ever having to touch it."*

---

## Section 7 — Potential Collaboration / Closing

Steven turned the conversation around and asked about the stage of Mahmoud's development:

- He framed Polyunity and AddManuChain as **synergistic, marginally competitive** — not true competitors
- Expressed concern about duplicating work: "We can't afford to compete as an industry. We need to raise all ships."
- Explicit ask: *"If you're progressing with the development of these things, and I have a definitive need for them, work with me to figure those things out versus me building them, you building them, and then we're competing for the same oil and gas contract."*

Mahmoud's update provided:
- Currently has an MVP (platform, initial phase)
- Attending the Engine Summit in Toronto, March 31–April 1, to present MVP to industry
- Companies engaged: ExxonMobil, Equinor (pioneering digital inventory with Siemens), Suncor (in outreach)
- Canada-based positioning seen as a differentiator — no dominant Canadian player in this space
- University-industry hybrid structure (Dalhousie + Ottawa-based industrial partner)
- Seeking funding: IRAP, NSERC, defense-linked funding (DND visit to Dalhousie lab — Admiral toured the facility)

Steven's final advice:
- Cautionary tale: he lost IP when he tried to commercialize out of Memorial — had to restart from zero to create Polyunity
- Defense and O&G spending to academic entities will be massive — much easier access than as a startup
- Trade-off: you get capital access inside academia, but what do you own at the end?
- Strongly suggested a follow-up conversation: *"I think there's a world in which we can put these pieces together in an interesting way."*

---

## Notes

- Atlantic Excel (Halifax) was mentioned — they recently received the first Lloyd's Register certification in 3D printing. Steven congratulated this as a very significant milestone.
- Polyunity has ongoing work with a group at a large Canadian health authority managing 200 biomeds across 13 hospitals.
- Canadian right-to-repair legislation was referenced as a structural tailwind for digital inventory and AM adoption in regulated industries.

---

*Transcript cleaned and structured from raw spoken recording — Feb 25, 2026.*
