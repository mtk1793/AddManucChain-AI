#---
interviewee: "Shelley Hessian"
position: "NS Regional IP Counsellor, Springboard Atlantic IP Advantage"
focus_areas:
   - Intellectual property strategy
   - Startup ecosystem
   - Innovation commercialization
interview_number: 61
date: ""
interviewer: ""
tags: [startup, ip, commercialization, digital-inventory, am-platform]
#---
# Interview Questions: Shelley Hessian — IP Counsellor & Startup Ecosystem
**Interviewee:** Shelley Hessian  
**Position:** NS Regional IP Counsellor, Springboard Atlantic IP Advantage  
**Focus Areas:** Intellectual property strategy, startup commercialization, funding readiness, Atlantic ecosystem support  
**Interview Purpose:** Understand IP frameworks that attract institutional investment; explore funding pathways (federal, provincial, angel, corporate); identify ecosystem support mechanisms for deep-tech startups in Atlantic Canada

---

## Q1: IP Strategy for Multi-Stakeholder Platforms & Investment Attractiveness

**Key Question:**
When building a platform that orchestrates a network of OEMs, AM facilities, operators, and classification societies—each protecting proprietary IP and operational data—what IP governance structure most effectively de-risks the business for institutional investors while simultaneously protecting all ecosystem participants?

**Context & Business Model Implication:**
Our platform architecture stores encrypted CAD files (design IP managed by OEMs), maintains audit trails of printing workflows (operator production data), and coordinates qualification/certification (regulatory compliance). We recognize that a poorly structured IP framework becomes a bottleneck during Series A fundraising (investors view unclear IP ownership as a catastrophic liability). Similarly, OEMs resist platforms where they fear design leakage to competitors. We're currently proposing a hybrid model combining: (1) encrypted escrow storage with zero-knowledge architecture, (2) revenue-share licensing with per-print auditing, and (3) temporal access controls. But we're uncertain whether this framework provides sufficient legal certainty to be fundable **and** acceptable to enterprise participants.

**Extended Sub-questions:**
- In your experience advising portfolio companies that successfully raised Series A–B capital, how did they structure multi-party IP governance to satisfy both institutional investors (who demand clear, defensible ownership) and enterprise partners (who demand privacy assurances)?
- What IP ownership model would most appeal to Fortune 500 OEMs (e.g., ExxonMobil, Shell, GE) from a legal/procurement standpoint? Specifically: do they prefer technology licensing (where they license access to the platform but don't touch the IP layer) versus data partnerships (where they contribute IP to a governed consortium)?
- Is encryption + cryptographic audit trails + smart contract enforcement sufficient to satisfy enterprise legal teams, or do you advise supplementing with additional legal frameworks (escrow agreements, IP indemnification clauses, third-party audit rights)?
- How should we structure IP dispute resolution mechanisms? Should we reserve IP arbitration authority (requiring both parties to litigate through our platform), or does that create liability for us?
- From a **fundraising perspective**, which IP structure is most attractive to VCs and corporate investors: highly centralized (we own certification IP, license everything) versus distributed (consortium owns shared assets, members own their contributions)?

---

## Q2: OEM Licensing Models, Revenue Economics & Fundability

**Key Question:**
How should we structure OEM licensing and revenue-share agreements such that the financial model is **simultaneously attractive to OEMs** (compensating them fairly for IP contribution), **scalable and auditable for our platform** (reducing operational/legal complexity), and **compelling to institutional investors** (demonstrating clear, recurring, high-margin revenue with minimal customer concentration risk)?

**Context & Funding Challenge:**
OEMs currently derive 30–50% gross margins from aftermarket spare parts (a $XX billion annually market). Our platform disintermediates that margin by enabling distributed manufacturing. However, this creates a fundamental alignment problem during investor due diligence: VCs recognize that OEMs have structural disincentive to cannibalize their own aftermarket business, which suggests that enterprise adoption may be "customer-hostile revenue model" that requires prohibitively expensive incentives. We're currently testing a revenue-share structure where OEMs receive 5–15% per part printed on the platform, our platform takes 20–30% (for software, orchestration, certification coordination), and the AM print provider takes 50–70%. But we have three unresolved questions that are blocking our fundraising: (1) **Is this 5–15% OEM share sufficient to overcome their resistance, or is it table stakes and need significant uplift?** (2) **How do we make this revenue-share agreement binding and auditable at scale when OEMs may have thousands of legacy designs globally?** (3) **What financial structures do investors prefer for enterprise-dependent SaaS platforms: % of SaaS revenue, or % of transactional revenue (print-based)?**

**Extended Sub-questions:**
- From your work advising portfolio companies, what revenue-share splits have successfully incentivized large enterprise partners to participate in platform ecosystems where they previously controlled the entire value chain? Are there real-world precedents in supply chain software, manufacturing, or energy sectors?
- Should we tier the OEM revenue-share based on engagement level (e.g., actively managed IP library = 15–20%; legacy/archived designs = 5–10%)? Does tiering create administrative complexity that investors would flag, or does it create better alignment?
- How do we handle the **legacy parts problem**: OEMs may have thousands of obsolete designs (parts they no longer manufacture but operators still need for older equipment). Should obsolete parts have zero license fee (forcing us to compete on volume), or premium revenue-share (since there's no OEM aftermarket revenue to protect)?
- From a **legal/auditing standpoint**, what mechanisms ensure revenue-share is transparently calculated and auditable at scale? Should we require API integrations (print providers emit real-time print data to OEMs), or is periodic reporting sufficient? How do investors evaluate this operational risk?
- **Investor perspective**: Do Series A investors in B2B2C or multi-sided platform companies prefer valuation models based on SaaS subscription fees (predictable, but may be low) versus transactional revenue (higher upside, but concentrated customer risk and revenue volatility)? How do you advise founders to position this trade-off?

---

## Q3: Startup Ecosystem & Funding in Atlantic Canada
Funding Architecture, Pathways & Ecosystem Support for Deep-Tech Startups in Atlantic Canada

**Key Question:**
Recognizing that we're a pre-revenue deep-tech platform startup (complex IP, multi-stakeholder governance, regulatory dependencies), what is the optimal funding architecture to maximize capital efficiency while building sustainable operations? Specifically: which funding sources should we prioritize in which sequence, and how do we position ourselves to attract both government/foundation support **and** institutional venture capital?

**Context & Funding Planning:**
We have strong market validation (65+ customer discovery interviews across maritime, offshore, aerospace, defense, and energy sectors) and have identified Atlantic XL as an anchor partner. However, our capital requirements are substantial: platform development ($500k–$1M), certification pathway establishment ($200k–$400k), initial regional expansion ($300k–$500k), and regulatory/compliance infrastructure ($100k–$200k). We're pre-revenue and currently operating from a laboratory environment with minimal runway remaining. We recognize that Atlantic Canada offers unique funding mechanisms unavailable elsewhere (ACOA, provincial innovation programs, university partnerships) but also recognize that we may require US capital later (Series A VCs are concentrated in SF, Boston, NY, and Toronto). We need clarity on: (1) which Atlantic funding sources are realistic and mission-appropriate, (2) how to sequence funding to build toward Series A, and (3) whether a Canadian HQ is an asset or liability for securing institutional investment.

**Extended Sub-questions:**
- What are the **most realistic** government/non-dilutive funding mechanisms that actually support deep-tech startups at our stage in Atlantic Canada? Specifically: NRC-IRAP grants (how much runway can we realistically expect? What is the application-to-award timeline?), ACOA funding (are there specific programs for supply chain or sustainability tech?), provincial innovation grants (Quebec, Ontario, BC all have robust programs — does NS/Atlantic Canada?), university innovation funds, or Canada Foundation for Innovation grants?
- How should we sequence funding to minimize dilution while maximizing founder control? For example: (1) NRC-IRAP (~$200k, non-dilutive, 12–18 months), (2) angel/friends-and-family ($250k–$500k, 20–25% dilution acceptable), (3) pre-seed VC ($500k–$1M, further dilution), then Series A once product-market signals are clear. Is this sequencing prudent, or should we pursue institutional capital earlier?
- **Corporate venture capital**: Are there energy, maritime, or manufacturing corporations in Atlantic Canada/Canada that have internal venture arms that might view our platform as strategic? (e.g., Irving Oil, Imperial Oil, AltusGroup, Emera) How do we approach corporate VCs without visibility/IP being compromised?
- From your experience, do **US institutional VCs** (Sequoia, Menlo, Venrock, etc.) view Canadian founding teams and Atlantic Canada operations as a liability or neutral? Should we consider US incorporation even if we maintain operations in Atlantic Canada?
- What is Springboard Atlantic's **specific capacity** to support us post-funding? Can they facilitate introductions to investors, customers, and partners? Do they have a formal investment arm, or are they primarily a mentoring/education organization? Are there fee structures, equity expectations, or other considerations we should understand upfront
---

## Q4: Intellectual Property for Pre-Certified Parts
Pre-Certified Parts Library as Defensible IP Asset & Revenue Driver

**Key Question:**
As we build a proprietary library of pre-certified AM parts (e.g., "Lloyd's Register Approved Bearing Design v2.1" + corresponding process documentation + material qualifications), how should we structure the ownership, licensing, and commercialization of this library such that it represents a defensible, valuable, and fundable IP asset that simultaneously incentivizes OEM participation and generates recurring licensing revenue?

**Context & IP/Valuation Challenge:**
Classification societies (Lloyd's Register, DNV, ABS) certify **processes and facilities**, not individual part designs. However, the combination of an OEM's part design + certified printing process + material/quality qualifications creates new IP: a "pre-approved design" that operators can implement without re-certifying. This library could become a significant competitive moat and revenue generator. However, current IP ownership is ambiguous: (1) Is the pre-certified design a co-owned asset (OEM + platform), or platform-owned (with OEM licensing rights)? (2) Can we license access to competitors' certified designs to other operators (which could cannibalize the partner OEM's aftermarket business)? (3) How do we value/monetize the library given that its utility is derived from the underlying designs we don't personally own? (4) How do investors evaluate the IP value and defensibility of a library we don't technically own? Our current thinking: we fund the certification process and retain the right to license pre-certified designs to operators (for a % of revenue), while OEMs retain design attribution/control. But we're uncertain whether this is legally sound, commercially viable, or attractive to investors.

**Extended Sub-questions:**
- From a **legal precedent standpoint**, are there examples in other industries (pharmaceuticals, software, aerospace) where one party funds the regulatory certification of another party's asset and retains licensing/commercialization rights? How are ownership and revenue-share structured in those contexts?
- Should the pre-certified parts library be structured as a **separate legal entity** (owned by the consortium, licensed by the platform) to create clear separation of ownership and allow for independent monetization? Would investors view this as cleaner governance, or unnecessarily complex?
- If an OEM funds the certification of their own design (instead of us funding it), do they own the pre-certified IP, or do we? And in either case, can we license that design to competitors (which would violate the original OEM's benefit expectation)?
- What licensing model should we use to monetize the pre-certified library? One-time license fee per design ($50k–$500k)? Per-installation license? Per-operator seats? Subscription to the entire library? Which structure is most attractive to: (a) operators (customers), (b) OEMs (reluctant partners), and (c) investors (venture capitalists)?
- **Investor due diligence**: How do VCs evaluate the defensibility of a licensing library where you don't directly own the underlying IP? Does lack of direct IP ownership significantly reduce valuation multiples, or can you compensate through evidence of exclusive licensing agreements with OEM
---

## Q5: Startup IP Protection & Defensibility

**Key QCompetitive Positioning Through Strategic IP & Patentability Roadmap

**Key Question:**
Beyond the pre-certified library, what are the specific technical and process innovations in our platform that warrant IP protection (patents, trade secrets, trademarks), and how should we strategically allocate limited IP budget to maximize competitive defensibility while remaining attractive to venture investors?

**Context & Competitive Differentiation:**
We recognize that FieldNode (backed by major energy majors: Shell, BP, Equinor, ConocoPhillips) already occupies the "digital inventory for AM" market positioning. However, our differentiation rests on: (1) a **novel certification coordination workflow** (automated qualification tracking, smart contract-enabled enforcement), (2) a **pre-certified parts library** (as discussed in Q4), and (3) **integrated ecosystem governance** (connecting OEMs, print providers, classification societies, and operators in a transparent, audited network). However, we're unclear on which of these are **patentable** (potentially licensable to competitors, or defensible against larger players), which are **software trade secrets** (AI/ML algorithms for design reengineering, recommendation engines, predictive maintenance), and which are **branding/trademark assets** (the market positioning itself). We also recognize that investors often expect startups to have filed at least provisional IP applications before Series A (signals defensibility and strategic thinking). We're unsure whether we should file broad patents (expensive, long timelines, may reveal competitive strategy) versus rely on trade secrets (faster, cheaper, but no legal recourse if copied) versus focus on open standards (reduces IP but increases ecosystem adoption).

**Extended Sub-questions:**
- In your experience advising portfolio companies, how do you decide whether to pursue provisional patents, trade secret protection, or hybrid strategies? Specifically: for a B2B platform company in a regulated industry (maritime/offshore), do investors prefer defensible IP (patents) or rapid market adoption (open standards)?
- Which elements of our platform are realistically patentable? For example: (a) a **certification workflow process** (claim: automating qualification tracking + audit trails across multi-stakeholder ecosystem) — is this patentable, or is it just "business process software" (which faces higher obviousness bar)? (b) **Design reengineering algorithms** (claim: AI-accelerated topology optimization for converting traditional designs to AM-viable designs) — is this novel enough to patent, or is it just application of known techniques? (c) **Blockchain/distributed ledger elements** (claim: transparent audit chain for lifecycle tracking) — is this patentable post-2020?
- What IP filing strategy would you recommend for a capital-constrained startup? Should we file provisional patents now (low cost, buys time for full application), or focus resources on product development and defer IP applications until post-seed funding?
- From a **geographic IP strategy**, which jurisdictions matter most? US patent protection (most expensive, most battle-tested) versus Canadian/EU only (cheaper, but less protective against US competitors)? Should we pursue PCT (Patent Cooperation Treaty) to preserve global options, or focus on specific markets?
- Regarding **open standards versus proprietary approaches**: Many ecosystem platforms (Linux Foundation, OCP, hyperledger) offer network benefits by open-sourcing core standards. Would open-sourcing our **ecosystem governance standards** (how partners interoperate) while keeping **proprietary the platform implementation** (the actual software) be an attractive strategy to build adoption faster

## Q6: Ecosystem Governance & IP Rights

**Key Question:**
If we create a multi-stakeholder governance body (operators, OEMs, print providers, classification societies), how should IP rights be managed?
Multi-Stakeholder Governance, IP Rights Management & Institutional Structure

**Key Question:**
If we establish a formal multi-stakeholder governance framework (operators, OEMs, print providers, classification societies, regulators), how should IP rights, data ownership, and contributed assets be contractually managed such that the structure is simultaneously (a) legally defensible against IP disputes, (b) attractive to enterprise participants (who fear their contributions will be exploited), (c) compatible with venture capital investment (VCs want clear exit mechanisms, not entangled consortium structures), and (d) scalable across geographies/sectors?

**Context & Governance Challenge:**
Many successful platform ecosystems (hyperledger, 3GPP in telecom, standards bodies like IEEE) use consortium or non-profit governance structures to signal neutrality and reduce IP contention. However, venture-backed startups struggle with such structures because: (1) **Exit ambiguity**: if the company is acquired, what happens to consortium IP? (2) **Control dilution**: governance by committee often paralyzed decision-making, (3) **IP entanglement**: if stakeholders contribute IP to a shared pool, who benefits from improvements or derivative works? We're considering a hybrid model: for-profit platform company (owned by Springboard Atlantic investors) + formal operating agreement with partners (defining contribution, usage, revenue-sharing, governance voting). But we're uncertain whether this signals sufficient neutrality to enterprise participants, or whether we should form a separate 501(c)(3) foundation (like Eclipse Foundation or Linux Foundation) to hold shared IP assets.

**Extended Sub-questions:**
- **Precedent analysis**: Looking across platform ecosystems in adjacent industries (automotive's Open Connectivity Foundation, energy's EPRI consortium, maritime's Digital Container Shipping Association), what governance structures have been most effective at (a) preventing IP disputes, (b) encouraging stakeholder contribution, and (c) maintaining venture-friendliness? Are non-profit consortiums inherently incompatible with VC backing, or are there success stories?
- Should stakeholders be **contractually required** to contribute relevant IP to a shared pool (to prevent competitive hoarding), or should contribution be voluntary/incentivized? If required, how do we handle situations where a stakeholder contributes technology that later becomes highly valuable — do they have perpetual usage rights, or do we create equity/revenue-share mechanisms to compensate them?
- What **operational governance structures** prevent one stakeholder from exploiting another's IP or contributions outside the platform? For example: if we certify an OEM design, and a print provider then uses that design to serve a competitor OEM, has the original OEM's IP been compromised? What enforcement mechanisms exist (contractual penalties, IP indemnification, governance voting rights)?
- **InsGo-to-Market Sequencing, Revenue Ramp & Funding Requirements Roadmap

**Key Question:**
Given the IP, regulatory, and multi-stakeholder complexities, what is the optimal commercialization sequence that simultaneously (a) achieves early revenue/traction (demonstrates product-market fit to investors), (b) minimizes legal/IP risk (avoids premature engagement with contentious OEM partnerships), and (c) builds toward sustainable, scalable revenue (showing clear path to $1M+/year ARR within 2–3 years)?

**Context & Phasing Uncertainty:**
We have multiple potential commercialization pathways, each with different IP/timing/funding implications: **(1) Non-critical parts first** (less OEM resistance, faster certification, immediate revenue from operators) — but lower margin and limited total addressable market. **(2) Anchor customer model** (focus exclusively on Atlantic XL as print provider + 2–3 initial operator customers) — provides revenue validation but constrains growth and makes it harder to convince capital providers of scalability. **(3) Pre-certified library monetization** (partner with Lloyd's Register or classification societies to rapidly certify a library of parts for licensees) — high margin, but requires deep institutional relationships. **(4) B2B2C marketplace** (become horizontal platform connecting all operators to all print providers) — largest TAM but longest time to traction (network effects take years). These aren't mutually exclusive, but sequencing matters for fundraising: VCs want to see which you're optimizing for and why. Our current thinking is (Year 1) focus on non-critical parts + anchor customer, (Year 2) expand to revenue-share OEM partnerships, (Year 3) launch pre-certified library as premium product. But we're unsure if this pace is realistic or satisfies investor expectations.

**Extended Sub-questions:**
- **Path to revenue**: Which commercialization pathway gets us to sustainable revenue fastest? Is "non-critical parts first" (your hypothesis) actually viable, or are non-critical parts so commoditized that margins are too thin? How do you advise founders to think about this revenue-speed tradeoff?
- **Anchor customer strategy**: Atlantic XL is eager to participate, but they're a captive print provider (limited volume unless we expand operator base). Should we anchor exclusively on Atlantic XL to reduce risk, or parallel-path with 2–3 additional print providers to prove ecosystem scalability? From an investor perspective, does exclusive anchor customer look like dependency risk or strategic focus?
- **Regulatory/certification timeline**: Our assumption is that certification of non-critical parts takes 3–6 months per part. Is that realistic? Do classification societies have bandwidth to certify new designs rapidly, or are they bottlenecked? If certification is slow, does the whole "quick traction" strategy collapse?
- **OEM partnership realism**: When should we approach OEMs (Shell, ExxonMobil, others) with revenue-share propositions? Too early (before we have traction) = dismissal. Too late (after we've scaled with non-critical parts) = they're less interested because the market is already developing without them. When is the optimal window?
- **Funding bridgeCompliance, Data Governance & Cross-Border Operational Risk

**Key Question:**
What are the critical regulatory, compliance, and data governance considerations that could materially impede our operations across jurisdictions, and how should we structure our business (data location, IP ownership, subsidiary entities) to minimize regulatory risk while remaining attractive to international capital investors and enterprise customers?

**Context & Compliance Risk:**
Our platform will likely operate across multiple regulatory regimes simultaneously: (1) **ITAR (International Traffic in Arms Regulations)**: if we store CAD files or design data for US defense contractors or NATO-affiliated operators, ITAR likely applies, restricting data access to US persons and limiting export. (2) **GDPR (EU data protection)**: if we serve European operators, we must comply with stringent data residency, processing, and privacy requirements. (3) **Canadian data governance**: Canada is signatory to various trade agreements that may restrict data localization, but also has sectoral privacy laws (PIPEDA). (4) **Sector-specific regulations**: maritime (SOLAS), offshore (IMCA), defense (US/allied contracting regulations), aviation (FAA). (5) **Emerging AI regulations**: if we use machine learning to recommend designs or optimize processes, upcoming AI regulation (EU AI Act, Canada's AI bill) may apply. We're currently operating on a simplified model (store data in Canada, assume encryption provides sufficient protection), but we suspect this undershoots actual regulatory complexity and could become a material bottleneck during fundraising (VCs invest in companies with clear regulatory compliance) or customer acquisition (enterprises won't participate if compliance is uncertain).

**Extended Sub-questions:**
- **ITAR risk assessment**: Is our platform likely to trigger ITAR, even if we don't explicitly target defense customers? For example: if a US oil company (like ExxonMobil) uses our platform to manage designs for subsea equipment (which has dual-use military applications), could ITAR apply? How do we know whether a customer/design is "ITAR-controlled"?
- **Data residency strategy**: Should we locate our primary server infrastructure in Canada, US, or EU? Or should we maintain regional deployments (Canada for CAD, US for operations data, EU for GDPR-compliant storage)? Are multi-regional architectures realistic for a startup, or should we choose a single jurisdiction and build compliance around it?
- **GDPR and international scale**: If we serve European operators and store their operational data, GDPR likely applies. Are there standard compliance strategies (data processing agreements, consent frameworks, or hybrid cloud solutions) that make GDPR manageable for startups, or is it a deal-breaker for early-stage operations?
- **IP export control**: If we develop proprietary algorithms (design reengineering, process optimization), could **technology export regulations** (beyond ITAR) prevent us from selling internationally? Should we pre-emptively compartmentalize our IP (keep algorithms US-based, data international) to reduce risk?
- **InvConsolidated Strategic Recommendations for IP/Funding/Ecosystem

**Key Question:**
Based on our market validation (65+ customer interviews), technical architecture (multi-stakeholder digital platform for AM supply chain coordination), funding stage (pre-revenue, seeking Seed capital), and geographic constraints (Atlantic Canada operations with global ambitions), what are your top **5–7 consolidated strategic recommendations** for simultaneously optimizing: (a) IP defensibility, (b) enterprise customer attractiveness, (c) institutional investor confidence, and (d) ecosystem partner alignment?

**Context:**
Rather than evaluating the above strategy elements in isolation, we recognize that they interact: IP decisions affect customer trust and investor risk assessment; funding source choices affect governance structure; regulatory strategy affects geographic expansion and IP strategy. We're seeking consolidated recommendations that help us navigate these trade-offs coherently rather than optimizing locally for each dimension. For example: should we prioritize fast revenue (non-critical parts, narrow partner base) or ecosystem credibility (broader partnerships, longer traction timeline)? Should we file patents aggressively or rely on trade secrets and standards adoption? Should we seek Nova Scotia provincial support (tied to local operations) or national/international capital (less constrained)? We recognize that these constraints are real business decisions, not purely strategic choices.
---

## Q9: Strategic Recommendations

**Key Question:**as Strategic Partner, Advisor & Ecosystem Connector

**Key Question:**
Beyond traditional IP counselling, how can Springboard Atlantic strategically support our company's **fundraising, ecosystem development, and go-to-market execution** such that we can simultaneously maintain Atlantic Canada operations/credibility **and** access broader capital and market opportunities (Canada-wide, North America-wide, or international)?

**Context & Partnership Model:**
We view Springboard Atlantic not merely as an IP advisor, but as a potential strategic ecosystem partner that can: (1) facilitate introductions to investors (angel, institutional, corporate VCs), (2) connect us with enterprise customers and ecosystem partners (OEMs, classification societies, government procurement), (3) help us navigate government funding programs (NRC-IRAP, ACOA, provincial innovation funds), (4) lend credibility/endorsement to our early fundraising efforts, and (5) potentially serve as a governance advisor (representing Atlantic Canada stakeholder interests in our multi-stakeholder consortium). However, we're unclear on what Springboard Atlantic can realistically deliver versus what we need to source separately (VC mentoring from external advisors, enterprise sales expertise, regulatory/legal counsel).

**Extended Sub-questions:**
- **Springboard Atlantic's capacity & model**: Beyond IP counselling, what are Springboard Atlantic's core competencies around startup fundraising, ecosystem development, and institutional relationships? Do you have formal partnerships with angel networks, early-stage VCs (Canadian or otherwise), or corporate innovation programs that you can activate for portfolio companies?
- **Introductions & leverage**: Which investor groups, corporate partners, government agencies, or enterprise customers should we prioritize contacting, and would Springboard Atlantic be willing to make warm introductions? Are there specific criteria (stage, sector, geographic) where Springboard Atlantic has particularly strong relationships?
- **Government funding navigation**: Beyond general awareness, can Springboard Atlantic help us craft a specific NRC-IRAP application (including timeline, budget, metrics)? Are there ACOA or provincial programs we should pursue, and can Springboard Atlantic facilitate those applications?
- **Governance & stakeholder integration**: If we establish a formal multi-stakeholder governance body (operators, OEMs, print providers, classification societies), would Springboard Atlantic be interested in a seat on the board or advisory council (representing Atlantic Canada interests and regulatory perspective)? Alternatively, could Springboard Atlantic facilitate introductions to government stakeholders (DND, Transport Canada, provincial innovation departments) who might have strategic interest in our platform?
- **Alliance/equity interest**: Beyond advisory relationships, is Springboard Atlantic interested in any formal investment, revenue-share, or strategic alliance structure? (For example: would Springboard Atlantic take an equity stake in exchange for ongoing support, or do you prefer a service-based relationship?) Are there terms we should discuss upfront to avoid misalignment later?
- **Expansion strategy**: If we successfully fundraise and expand beyond Atlantic Canada, what role would Springboard Atlantic want to play? Do you see our platform as fundamentally Atlantic-rooted (and thus Springboard Atlantic benefits from our success as a regional company), or as a broader Canadian company (with Atlantic Canada as HQ)?
- **Referral/endorsement**: Would Springboard Atlantic be willing to publicly endorse our company/platform to investors, customers, and ecosystem partners? ("Springboard Atlantic has vetted X company on IP strategy and business fundamentals...")

---

## Closing: Final Synthesis Question

*Based on this conversation, we're building a critical piece of infrastructure for the energy transition, supply chain resilience, and manufacturing competitiveness — problems that matter at Atlantic, Canadian, and North American levels. What's your gut reaction: do you think we have a defensible, fundable, and genuinely valuable business here? And if so, what would you want to see from us in the next 90 days to validate that conviction
- Are there introductions/partnerships you'd recommend?
- Would Springboard Atlantic be interested in a pilot partnership with our platform?
- What resources/support can we access through Springboard Atlantic?

---

## At End of Interview

*Based on what you've said about what investors need and how founders derisk ideas, we're working on a platform for supply chain coordination in manufacturing. What's your gut reaction on whether that's the kind of problem worth solving at scale?*
