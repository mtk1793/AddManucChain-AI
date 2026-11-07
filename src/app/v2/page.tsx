import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowRight, Boxes, Check, ClipboardCheck, Factory, FileCheck2, Fingerprint, Globe2, LockKeyhole, Network, PackageCheck, ShieldCheck, Workflow } from "lucide-react"

export const metadata: Metadata = {
  title: "AddManuChain | Controlled digital supply for critical parts",
  description: "Connect operators, OEMs, certification bodies, and qualified additive manufacturing facilities through a secure, traceable parts workflow.",
}

const steps = [
  { number: "01", title: "Identify the part", body: "Start with an operational need and a structured part record, including available drawings, requirements, and revision.", icon: Boxes },
  { number: "02", title: "Authorize the route", body: "Record OEM or IP-owner permissions and send the request through the required review and certification steps.", icon: ClipboardCheck },
  { number: "03", title: "Route to production", body: "Coordinate an approved facility, production conditions, inspection requirements, and the evidence needed for the order.", icon: Factory },
  { number: "04", title: "Close the digital thread", body: "Keep production, inspection, delivery, and approval records together for traceability and future reorders.", icon: PackageCheck },
]

const capabilities = [
  { title: "Digital parts inventory", body: "Keep part definitions, revisions, supporting files, readiness information, and supply options in a governed record.", icon: Boxes },
  { title: "Controlled IP and access", body: "Give each organization access to the information and actions appropriate to its role, with permissions and decisions recorded.", icon: Fingerprint },
  { title: "Approval-aware workflows", body: "Coordinate OEM authorization, certification review, production release, and quality checks in the required sequence.", icon: Workflow },
  { title: "Distributed production", body: "Connect demand to qualified facilities and capture production status, inspection evidence, and delivery details.", icon: Network },
  { title: "Auditable part history", body: "Keep approvals, revisions, work records, and quality evidence connected to the part and its order history.", icon: FileCheck2 },
  { title: "Readiness and prioritization", body: "Help teams review inventory for obsolescence, operational need, manufacturing feasibility, and the work required before release.", icon: Globe2 },
]

const roles = [
  { name: "Operators", text: "Find parts, explain the need, and follow the request through supply and delivery." },
  { name: "OEMs and IP owners", text: "Manage part data, usage rights, revisions, and authorized production routes." },
  { name: "Certification bodies", text: "Review defined requirements and record the approvals and evidence within their scope." },
  { name: "Qualified facilities", text: "Receive controlled production requests and return manufacturing and inspection records." },
]

function Wordmark() {
  return <Link href="/v2" className="flex items-center gap-2.5" aria-label="AddManuChain home">
    <span className="grid size-9 place-items-center rounded-xl bg-[#103d36] text-white"><Network className="size-5" strokeWidth={1.8} /></span>
    <span className="text-[15px] font-semibold tracking-[-0.04em] text-[#15332f]">AddManuChain</span>
  </Link>
}

function WorkflowPreview() {
  return <div className="relative mx-auto w-full max-w-[570px]">
    <div className="absolute -inset-5 rounded-[2rem] bg-[#dce9df]/70 blur-2xl" aria-hidden="true" />
    <div className="relative overflow-hidden rounded-[1.5rem] border border-[#dce4dc] bg-white shadow-[0_32px_100px_-48px_rgba(12,48,40,0.45)]">
      <div className="flex items-center justify-between border-b border-[#e8ede7] px-5 py-4 sm:px-6">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#73837d]">Part record · Illustrative</p><p className="mt-1 text-sm font-semibold text-[#193b34]">Sea-water pump impeller</p></div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4d9] px-2.5 py-1 text-[10px] font-semibold text-[#8a5a11]"><span className="size-1.5 rounded-full bg-[#d89b32]" />Review in progress</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-[#edf0eb]">
        {[
          ["Part reference", "SWP-IMP-042"],
          ["Revision", "C · controlled"],
          ["Supply status", "Digital record ready"],
          ["Production route", "Qualified facility"],
        ].map(([label, value]) => <div key={label} className="bg-white px-5 py-4 sm:px-6"><p className="text-[10px] font-medium uppercase tracking-[0.11em] text-[#86918b]">{label}</p><p className="mt-1.5 text-xs font-semibold text-[#263f38]">{value}</p></div>)}
      </div>
      <div className="px-5 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between"><p className="text-xs font-semibold text-[#29463e]">Controlled workflow</p><p className="text-[10px] text-[#84918b]">Example status view</p></div>
        <div className="space-y-3">
          {[
            ["Part request", "Submitted by operator", "complete"],
            ["OEM authorization", "Awaiting decision", "active"],
            ["Certification review", "Starts after authorization", "queued"],
            ["Production and inspection", "Evidence required", "queued"],
          ].map(([title, detail, state], index) => <div key={title} className="flex items-center gap-3">
            <div className="relative flex w-5 justify-center">
              {index < 3 && <span className="absolute top-5 h-7 w-px bg-[#dfe7df]" />}
              <span className={state === "complete" ? "grid size-5 place-items-center rounded-full bg-[#2c7560] text-white" : state === "active" ? "grid size-5 place-items-center rounded-full border-2 border-[#d69b37] bg-[#fffaf0]" : "grid size-5 place-items-center rounded-full border border-[#d4ddd5] bg-white"}>
                {state === "complete" ? <Check className="size-3" /> : state === "active" ? <span className="size-1.5 rounded-full bg-[#d69b37]" /> : null}
              </span>
            </div>
            <div className="flex flex-1 items-center justify-between gap-3"><div><p className="text-xs font-medium text-[#29443c]">{title}</p><p className="mt-0.5 text-[10px] text-[#89948e]">{detail}</p></div><span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#8b9790]">{state === "complete" ? "Recorded" : state === "active" ? "In review" : "Next"}</span></div>
          </div>)}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-[#e8ede7] bg-[#f8faf7] px-5 py-3 text-[10px] text-[#6e7d76] sm:px-6"><LockKeyhole className="size-3.5 text-[#427565]" />Access, decisions, revisions, and evidence stay linked to the part record.</div>
    </div>
  </div>
}

export default function AddManuChainVersionTwo() {
  return <main className="min-h-screen bg-[#f7f8f4] text-[#1d302b]">
    <header className="sticky top-0 z-40 border-b border-[#e4e9e1]/90 bg-[#f7f8f4]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#52635d] md:flex" aria-label="Main navigation">
          <a href="#platform" className="transition hover:text-[#163f35]">Platform</a><a href="#workflow" className="transition hover:text-[#163f35]">Workflow</a><a href="#roles" className="transition hover:text-[#163f35]">Who it serves</a><a href="#governance" className="transition hover:text-[#163f35]">Governance</a>
        </nav>
        <Link href="/dashboard/overview" className="inline-flex items-center gap-2 rounded-full bg-[#153e35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#20594b] sm:px-5">Explore the platform<ArrowRight className="size-3.5" /></Link>
      </div>
    </header>

    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-36 -top-32 size-[520px] rounded-full border border-[#dfe7dc]" aria-hidden="true" /><div className="pointer-events-none absolute -right-12 -top-8 size-[300px] rounded-full border border-[#e4eae2]" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="relative z-10 max-w-[590px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d8e3da] bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#426a5c]"><span className="size-1.5 rounded-full bg-[#6d9a71]" />Secure digital orchestration for distributed manufacturing</div>
          <h1 className="text-[clamp(2.7rem,5.1vw,4.9rem)] font-semibold leading-[0.99] tracking-[-0.065em] text-[#15372f]">Critical parts.<br />Controlled from<br />request to release.</h1>
          <p className="mt-7 max-w-[520px] text-[15px] leading-7 text-[#64736c] sm:text-[17px] sm:leading-8">Connect operators, OEMs, certification bodies, and qualified manufacturing facilities through one secure workflow for digital inventory, approvals, production, and quality evidence.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#workflow" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#153e35] px-6 text-sm font-semibold text-white transition hover:bg-[#20594b]">See how it works<ArrowDown className="size-4" /></a>
            <Link href="/dashboard/overview" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#cfd9d0] bg-white px-6 text-sm font-semibold text-[#28453c] transition hover:border-[#94ad9e] hover:bg-[#fbfcfa]">Open the platform demo<ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-[#7b8982]"><span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#527f6d]" />Role-aware access</span><span className="inline-flex items-center gap-2"><FileCheck2 className="size-4 text-[#527f6d]" />Traceable decisions</span><span className="inline-flex items-center gap-2"><Network className="size-4 text-[#527f6d]" />Multi-party coordination</span></div>
        </div>
        <WorkflowPreview />
      </div>
    </section>

    <section className="border-y border-[#e5e9e2] bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 sm:px-8 sm:py-8">
        {[
          ["One governed record", "Parts, revisions, requirements, and evidence stay connected."],
          ["Clear handoffs", "Each organization sees the decisions and actions it owns."],
          ["A repeatable route", "Approved supply paths can support the next request."],
        ].map(([title, body], index) => <div key={title} className={"sm:px-5 " + (index > 0 ? "sm:border-l sm:border-[#e8ece6]" : "")}><p className="text-sm font-semibold text-[#23463b]">{title}</p><p className="mt-1.5 max-w-sm text-xs leading-5 text-[#77847d]">{body}</p></div>)}
      </div>
    </section>

    <section id="platform" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#668a73]">The platform</p><h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#183b32] sm:text-4xl">The coordination layer between part data and production.</h2></div><p className="max-w-2xl text-sm leading-7 text-[#68776f] lg:justify-self-end">AddManuChain brings the organizations, part records, permissions, workflow states, production resources, and quality evidence into a shared digital thread. Teams can coordinate distributed production while keeping each approval and responsibility visible.</p></div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ title, body, icon: Icon }, index) => <article key={title} className="group rounded-2xl border border-[#e3e9e1] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#c7d7ca] hover:shadow-[0_18px_45px_-32px_rgba(20,63,51,0.3)] sm:p-7"><div className={"grid size-10 place-items-center rounded-xl " + (index % 3 === 1 ? "bg-[#f8f0dc] text-[#9b712d]" : "bg-[#eaf2eb] text-[#47755f]")}><Icon className="size-[18px]" strokeWidth={1.8} /></div><h3 className="mt-5 text-[15px] font-semibold text-[#25443a]">{title}</h3><p className="mt-2 text-[13px] leading-6 text-[#748179]">{body}</p></article>)}
        </div>
      </div>
    </section>

    <section id="workflow" className="scroll-mt-24 bg-[#153b33] px-5 py-20 text-white sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b3cdb8]">From need to evidence</p><h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">A controlled chain of decisions, not a disconnected set of tools.</h2></div><p className="max-w-xl text-sm leading-7 text-[#cfdbd1] md:justify-self-end">Route each request through the right people and records. The sequence can reflect the part, the responsible organizations, and the evidence required before production.</p></div>
        <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(({ number, title, body, icon: Icon }, index) => <article key={number} className="relative rounded-2xl border border-white/15 bg-white/[0.045] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="text-xs font-semibold tracking-[0.16em] text-[#a9c8ae]">{number}</span><Icon className="size-[18px] text-[#c4d9b6]" strokeWidth={1.7} /></div><h3 className="mt-9 text-base font-semibold">{title}</h3><p className="mt-2 text-[13px] leading-6 text-[#c1d0c6]">{body}</p>{index < steps.length - 1 && <span className="absolute -right-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 rotate-45 border-r border-t border-[#7c9b86] bg-[#153b33] xl:block" />}</article>)}
        </div>
      </div>
    </section>

    <section id="roles" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#668a73]">One process, distinct responsibilities</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#183b32] sm:text-4xl">Give every participant a clear place in the chain.</h2></div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{roles.map((role, index) => <article key={role.name} className="rounded-2xl border border-[#e1e8e0] bg-white p-6"><span className="text-[11px] font-semibold text-[#78927d]">0{index + 1}</span><h3 className="mt-5 text-sm font-semibold text-[#25443a]">{role.name}</h3><p className="mt-2 text-xs leading-6 text-[#758179]">{role.text}</p></article>)}</div>
      </div>
    </section>

    <section id="governance" className="scroll-mt-24 border-y border-[#e5e9e2] bg-[#eef2ec] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[auto_1fr] md:items-start"><div className="grid size-12 place-items-center rounded-2xl bg-white text-[#47755f] shadow-sm"><ShieldCheck className="size-6" strokeWidth={1.7} /></div><div className="max-w-4xl"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#668a73]">Governance by design</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#183b32] sm:text-3xl">Keep the decision with the organization responsible for it.</h2><p className="mt-4 text-sm leading-7 text-[#65746c]">AddManuChain coordinates permissions, workflow, and records. Engineering acceptance, certification decisions, and manufacturing release remain with the qualified organizations responsible for those activities. The platform links their decisions and evidence to the part and order history.</p></div></div>
    </section>

    <section className="px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[1.75rem] bg-[#e3ebdf] p-7 sm:p-10 md:flex-row md:items-center md:p-12"><div className="max-w-2xl"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#668a73]">Explore AddManuChain</p><h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#183b32] sm:text-3xl">See how a controlled digital supply workflow fits your operation.</h2><p className="mt-3 text-sm leading-6 text-[#68776f]">Explore the product experience and its role-based tools for coordinating parts, approvals, facilities, and evidence.</p></div><Link href="/dashboard/overview" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#153e35] px-6 text-sm font-semibold text-white transition hover:bg-[#20594b]">Open the platform demo<ArrowRight className="size-4" /></Link></div>
    </section>

    <footer className="border-t border-[#e4e9e1] bg-white px-5 py-7 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><Wordmark /><p className="text-[11px] text-[#849088]">Secure coordination for distributed additive manufacturing.</p><Link href="/login" className="text-xs font-medium text-[#426a5c] transition hover:text-[#153e35]">Sign in</Link></div></footer>
  </main>
}
