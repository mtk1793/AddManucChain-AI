# Interview Questions — JP Hudon (Interview #64)
**Interviewee:** JP Hudon  
**Position:** Asset Integrity Manager, Glencore Canada  
**Date:** TBD | **Interviewer:** Mahmoud Kiasari

---

## SNAPSHOT

**Profile:** 13+ years in maintenance/reliability/asset management in mining & smelting. Leads 180 people, $40M OPEX, and major shutdowns at Glencore Canada. Deep RCA practitioner, CMMS operator, and vocal about fighting maintenance backlogs and downtime.

**Interview Goal:** Understand the real pain points in managing asset integrity at scale — where time, money, and data are lost — and validate whether a digital orchestration/intelligence layer would change how decisions are made.

---

## Main Questions (5)

---

### Q1: The Real Cost of Unplanned Downtime on Critical Assets

> **"You've spoken about cutting critical asset downtime at Glencore. Can you walk me through what an unplanned failure on a critical asset actually costs — not just the repair bill, but the full cascade? How do you currently decide which assets get priority attention before they fail?"**

**Probes:**
- What is the estimated production loss per day when a critical asset like a converter or anode furnace goes down unexpectedly? (Order of magnitude: $100k/day? $500k/day?)
- How do you currently identify which assets are approaching failure — is this data-driven, experience-based, or a combination?
- What percentage of your $40M OPEX would you say is reactive (fixing failures) vs. proactive (preventing them)? Is that ratio improving?
- What's the single biggest gap between knowing an asset is at risk and actually acting on it in time?

**Why this matters:** Quantifies the problem statement. If downtime cost is high and the current system is lagging, there's strong ROI for early detection or smarter prioritization tooling.

---

### Q2: Maintenance Backlogs — What Creates Them and What Does It Cost to Carry Them?

> **"You've publicly talked about slashing maintenance backlogs. In your experience, what actually causes backlogs to build faster than teams can clear them — and what is the real organizational cost of carrying a large backlog (beyond just the deferred work)?"**

**Probes:**
- Is the backlog problem primarily a resource issue (not enough people/time), a prioritization issue (don't know which work matters most), or a data/visibility issue (can't see the full picture)?
- How much of your backlog is "invisible" — work that should exist but hasn't been identified or entered into the CMMS yet?
- When a backlog grows, what's the risk profile change? Do you see a meaningful uptick in failures or incidents as backlog ages?
- What tools or methods have worked best for you to reduce backlogs — was it process, technology, cultural change, or all three?

**Why this matters:** Validates the backlog problem as a major pain point and surfaces whether better data/visibility is the constraint vs. just more labor.

---

### Q3: RCA in Practice — The Gap Between Identifying Root Cause and Fixing It Permanently

> **"You're a serious advocate for RCA — your Deep Roots series shows the depth of your thinking here. But from your experience, where does RCA actually break down in practice? Do investigations happen too slowly, corrective actions get closed without being truly effective, or does the same failure recur because the organization doesn't fully execute the fix?"**

**Probes:**
- What is a typical cycle time from a critical failure event to a completed RCA with validated corrective actions? (Days? Weeks? Months?)
- What percentage of recurring failures at your sites would you say are truly "solved" after an RCA vs. temporarily patched?
- Where is the biggest bottleneck — triggering the RCA, doing the investigation, implementing the fix, or verifying the fix worked?
- If you could change one thing about how RCA is done in large industrial organizations, what would it be?

**Why this matters:** JP is an expert here — this question gives him the floor to share deep insight. If recurrence and incomplete corrective actions are the gap, there's a product opportunity in tracking and closing that loop digitally.

---

### Q4: CMMS Reality — What the Data Tells You vs. What You Actually Need

> **"You've managed CMMS systems across multiple Glencore North American sites. What does your CMMS do well — and where does it genuinely fall short in helping you make good maintenance and reliability decisions?"**

**Probes:**
- How much of the data in your CMMS would you trust to make a strategic investment or shutdown-scope decision without manual verification?
- What kinds of decisions still require you to go "outside the CMMS" — relying on experienced technicians, spreadsheets, or institutional knowledge?
- What does a typical asset's data history look like in practice: clean and complete, or patchy with gaps, inconsistent tagging, and missing failure modes?
- If your CMMS could do one thing it currently can't, what would be most valuable?

**Why this matters:** Surfaces the real data quality/usability gap. If CMMS data is unreliable or incomplete, that creates an opening for a layer that structures, interprets, and augments it.

---

### Q5: Major Shutdowns — Where Does Time and Money Actually Disappear?

> **"You led the reduction of Horne Smelter's shutdown from 15+ days to 12 days using Lean. For organizations that haven't done that work yet, where does time and money disappear during a major shutdown — and how close are most industrial sites to running their shutdowns as efficiently as possible?"**

**Probes:**
- In a typical major shutdown, what proportion of scope overruns, delays, or cost blowouts come from: (a) unexpected findings during disassembly, (b) poor pre-shutdown planning, (c) parts/material availability, (d) contractor coordination, (e) something else?
- How much of shutdown scope is typically unplanned when work actually starts vs. what was predicted during planning?
- What's the cost of a single-day overrun on a major shutdown at a Glencore-scale operation? ($500k? $1M+?)
- What would need to be true — in terms of data, tools, or workflow — to consistently run shutdowns within scope and schedule?

**Why this matters:** Shutdown overruns are a massive, quantifiable pain point. Understanding the root causes of overruns identifies where a planning/visibility solution could create direct financial value.

---

## Bonus Questions (2)

---

### B1: Digitalization Journey — Where Are Most Industrial Sites on the Maturity Curve?

> **"From your cross-site experience at Glencore and with Jacobs, how would you characterize where most large industrial maintenance organizations actually are on the digital maturity curve — and what's genuinely holding them back from getting further?"**

**Probes:**
- Are most sites you've seen at the "data collection" stage, "reporting/dashboards" stage, or genuinely at "predictive/prescriptive" capability?
- What's the #1 barrier: budget, talent, data quality, cultural resistance, or vendor solutions that don't fit operations reality?
- Have you seen any digital tools that actually delivered on their promise in a heavy industrial environment? What made them work?

**Why this matters:** Validates the market readiness and helps calibrate where early adopters vs. laggards are — and what your go-to-market positioning should be.

---

### B2: Buying Decisions — How Does a New Solution Get Adopted at Glencore?

> **"If a company came to you with a tool that could genuinely help with asset health monitoring, backlog prioritization, or shutdown planning — what would it take to get from 'interesting demo' to actual implementation? Who needs to say yes, and what are the real blockers?"**

**Probes:**
- Is budget the primary constraint, or is it IT/OT integration complexity, change management, or proving ROI before commitment?
- How long does a typical procurement cycle take for a new operational software tool at Glencore?
- What would a pilot need to prove in the first 90 days for you to recommend scaling it?
- Have you ever championed a new solution from the floor up — and what made that succeed or fail?

**Why this matters:** Critical for understanding the real sales cycle, decision-maker map, and what a minimum viable proof of value looks like in this segment.

---

## Closing Prompt

> *"Is there a challenge in asset integrity or maintenance that I haven't asked about — something that keeps you up at night that you don't think people outside the industry fully appreciate?"*
