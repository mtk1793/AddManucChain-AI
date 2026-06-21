/**
 * Seed script for the Workforce Knowledge & Memory feature.
 *
 * Grounded in customer interviews:
 *   • Jim Granger, MAN Energy #23: "Those guys are gone." — senior experts are
 *     retiring and their institutional knowledge must be captured.
 *   • Jordan Cumming #10: "Knowledge Capture / Workforce Memory" — highest
 *     immediate value signal.
 *
 * Seeds:
 *   • 8 employees: 4 senior/retiring experts + 4 junior/new hires (each junior
 *     paired with a senior mentor so the platform can simulate knowledge transfer).
 *   • 10 knowledge documents authored by the seniors: SOPs, lessons learned,
 *     troubleshooting guides, procedures, safety bulletins, case studies — all
 *     referencing the equipment already in the seeded inventory (thruster
 *     bearings, hydraulic valves, heat exchangers, impeller shafts, etc.).
 *   • 4 knowledge-transfer records linking seniors to juniors.
 *
 * Usage:  bun run prisma/seed-knowledge.ts
 */
import { db } from '../src/lib/db'

const BASE = new Date('2026-03-18T12:00:00Z').getTime()
const DAY = 86400000

async function main() {
  console.log('Seeding workforce knowledge...')

  // ── Employees ──────────────────────────────────────────────────────────────
  const employees = [
    // ── Senior / retiring experts (the "older generation") ──────────────────
    {
      employeeId: 'EMP-001',
      name: 'Robert Mackenzie',
      email: 'r.mackenzie@addmanuchain.com',
      phone: '+1 902 555 0142',
      title: 'Principal Additive Manufacturing Engineer',
      department: 'Engineering',
      seniority: 'retiring',
      hireDate: new Date(BASE - 32 * 365 * DAY),
      retirementDate: new Date(BASE + 120 * DAY), // retiring in ~4 months
      yearsExperience: 32,
      status: 'departing',
      specialties: JSON.stringify([
        'SLM titanium printing',
        'marine certification (DNV/LR)',
        'thruster bearing design',
        'heat exchanger weld repair',
        'failure analysis',
      ]),
      certifications: JSON.stringify(['PEng', 'DNV AM Inspector', 'CSWIP 3.1']),
      bio: 'Robert has been with the company since the original marine AM pilot. He personally qualified the first thruster bearing housing print with Lloyd\u2019s Register and wrote most of the in-house SOPs still in use today. He is planning to retire this summer.',
      avatarColor: '#0EA5E9',
    },
    {
      employeeId: 'EMP-002',
      name: 'Margaret Sullivan',
      email: 'm.sullivan@addmanuchain.com',
      phone: '+1 902 555 0188',
      title: 'Senior Quality & Inspection Lead',
      department: 'Quality',
      seniority: 'senior',
      hireDate: new Date(BASE - 24 * 365 * DAY),
      yearsExperience: 24,
      status: 'active',
      specialties: JSON.stringify([
        'CT inspection of AM parts',
        'porosity & defect classification',
        'API 510 pressure vessel inspection',
        'statistical process control',
      ]),
      certifications: JSON.stringify(['API 510', 'ASNT Level III', 'ISO 9001 Lead Auditor']),
      bio: 'Margaret owns the quality playbook. Every inspection report template and defect-acceptance criteria in use across the network traces back to her work.',
      avatarColor: '#10B981',
    },
    {
      employeeId: 'EMP-003',
      name: 'James O\u2019Connor',
      email: 'j.oconnor@addmanuchain.com',
      phone: '+1 902 555 0117',
      title: 'Senior Field Service Technician',
      department: 'Field Service',
      seniority: 'retiring',
      hireDate: new Date(BASE - 38 * 365 * DAY),
      retirementDate: new Date(BASE + 200 * DAY),
      yearsExperience: 38,
      status: 'departing',
      specialties: JSON.stringify([
        'offshore rig commissioning',
        'hydraulic valve line B swap procedure',
        'emergency breakdown response',
        'Helideck & crane critical parts',
      ]),
      certifications: JSON.stringify(['BOSIET', 'FIR', 'Confined Space Rescue']),
      bio: 'James has been on every offshore rig in the North Atlantic. He knows the failure modes of the legacy hydraulic systems by sound. Documenting his troubleshooting steps is a top priority before he retires.',
      avatarColor: '#F59E0B',
    },
    {
      employeeId: 'EMP-004',
      name: 'Dr. Aisha Patel',
      email: 'a.patel@addmanuchain.com',
      phone: '+1 902 555 0199',
      title: 'Senior Materials Scientist',
      department: 'Engineering',
      seniority: 'senior',
      hireDate: new Date(BASE - 18 * 365 * DAY),
      yearsExperience: 18,
      status: 'active',
      specialties: JSON.stringify([
        'Ti-6Al-4V parameter development',
        'SS316L powder reuse protocols',
        'post-print HIP & heat treatment',
        'tensile & fatigue testing',
      ]),
      certifications: JSON.stringify(['PhD Materials Engineering', 'ASM AM Specialist']),
      bio: 'Aisha developed the parameter sets the network uses for every titanium and stainless print. Her powder-reuse protocol alone cut material waste by 23%.',
      avatarColor: '#8B5CF6',
    },
    // ── Junior / new hires (the "newer generation") ─────────────────────────
    {
      employeeId: 'EMP-005',
      name: 'Tyler Beatty Jr.',
      email: 't.beatty@addmanuchain.com',
      phone: '+1 902 555 0210',
      title: 'Junior AM Engineer',
      department: 'Engineering',
      seniority: 'junior',
      hireDate: new Date(BASE - 60 * DAY),
      yearsExperience: 2,
      status: 'active',
      specialties: JSON.stringify(['CAD prep', 'basic SLM operation', 'orientation optimisation']),
      certifications: JSON.stringify(['BEng Mech (Dalhousie 2024)']),
      bio: 'Tyler joined straight out of Dalhousie. Strong on CAD, still learning the certification pathway. Paired with Robert as his mentor.',
      avatarColor: '#EF4444',
      mentorEmployeeId: 'EMP-001',
    },
    {
      employeeId: 'EMP-006',
      name: 'Priya Nair',
      email: 'p.nair@addmanuchain.com',
      phone: '+1 902 555 0221',
      title: 'Junior Quality Inspector',
      department: 'Quality',
      seniority: 'junior',
      hireDate: new Date(BASE - 90 * DAY),
      yearsExperience: 1,
      status: 'active',
      specialties: JSON.stringify(['CT scan setup', 'defect measurement']),
      certifications: JSON.stringify(['ASNT Level II (in progress)']),
      bio: 'Priya is fast on CT software but still building judgement on what counts as a rejectable defect. Margaret is mentoring her through the acceptance-criteria playbook.',
      avatarColor: '#EC4899',
      mentorEmployeeId: 'EMP-002',
    },
    {
      employeeId: 'EMP-007',
      name: 'Marcus Lee',
      email: 'm.lee@addmanuchain.com',
      phone: '+1 902 555 0232',
      title: 'Junior Field Service Technician',
      department: 'Field Service',
      seniority: 'junior',
      hireDate: new Date(BASE - 30 * DAY),
      yearsExperience: 0,
      status: 'active',
      specialties: JSON.stringify(['basic rig safety induction']),
      certifications: JSON.stringify(['BOSIET (just completed)']),
      bio: 'Marcus is on his first offshore rotation. James is shadowing him through two full breakdown-response cycles before retirement.',
      avatarColor: '#14B8A6',
      mentorEmployeeId: 'EMP-003',
    },
    {
      employeeId: 'EMP-008',
      name: 'Sofia Hernandez',
      email: 's.hernandez@addmanuchain.com',
      phone: '+1 902 555 0243',
      title: 'Junior Materials Engineer',
      department: 'Engineering',
      seniority: 'junior',
      hireDate: new Date(BASE - 120 * DAY),
      yearsExperience: 3,
      status: 'active',
      specialties: JSON.stringify(['powder characterisation', 'particle size analysis']),
      certifications: JSON.stringify(['MSc Materials (McGill 2024)']),
      bio: 'Sofia runs the lab\u2019s particle-size and rheology equipment. Aisha is teaching her how to translate powder data into parameter-set adjustments.',
      avatarColor: '#6366F1',
      mentorEmployeeId: 'EMP-004',
    },
  ]

  const createdEmployees: Record<string, { id: string }> = {}
  for (const emp of employees) {
    const { mentorEmployeeId, ...data } = emp as any
    const created = await db.employee.upsert({
      where: { employeeId: emp.employeeId },
      update: { ...data, mentorId: undefined },
      create: { ...data, mentorId: undefined },
    })
    createdEmployees[emp.employeeId] = created
  }
  // Second pass — wire mentorId now that all employees exist.
  for (const emp of employees) {
    const mentorId = (emp as any).mentorEmployeeId
    if (mentorId && createdEmployees[mentorId]) {
      await db.employee.update({
        where: { id: createdEmployees[emp.employeeId].id },
        data: { mentorId: createdEmployees[mentorId].id },
      })
    }
  }

  // ── Knowledge documents ────────────────────────────────────────────────────
  const docs = [
    {
      documentId: 'KD-001',
      title: 'Thruster Bearing Housing \u2014 Print Qualification SOP',
      category: 'sop',
      authorEmployeeId: 'EMP-001',
      summary: 'Step-by-step procedure Robert wrote to qualify a new build of the BP-1024 thruster bearing housing against Lloyd\u2019s Register rules. Covers orientation, support strategy, post-print HIP, and the exact inspection checkpoints.',
      content: `# Thruster Bearing Housing \u2014 Print Qualification SOP

**Author:** Robert Mackenzie, PEng
**Equipment:** BP-1024 Thruster Bearing Housing (Ti-6Al-4V)
**Certification pathway:** Lloyd\u2019s Register Part 7 Chapter 3 + DNV-OS-D202

## 1. Pre-print checks
1. Confirm powder lot is from the qualified reuse-protocol batch (see KD-007).
2. Verify build plate flatness \u2264 0.05 mm across the full 250 mm bed.
3. Load parameter set "Ti64-Bearing-v3" \u2014 do NOT edit layer thickness.

## 2. Orientation & supports
- Orient the housing with the flange face down (35\u00b0 from horizontal).
- Use tree supports on the bore ID; lattice supports on the outer web.
- **Common mistake:** orienting flage-flat saves supports but causes bore roundness to drift >0.2 mm. Always use the 35\u00b0 angle.

## 3. In-process monitoring
- Melt-pool monitoring MUST be on for layers 120\u2013180 (the bore region).
- If spatter density spikes >3\u03c3 on layer 140, pause and inspect. Do not continue blind.

## 4. Post-print
1. Wire-EDM off the build plate.
2. HIP at 920\u00b0C / 100 MPa / 2 h.
3. Stress-relieve at 650\u00b0C / 1 h, air cool.
4. Machine bore to final tolerance.

## 5. Inspection checkpoints (non-negotiable)
- CT scan at 195 \u00b5m voxel size. Reject if any pore >300 \u00b5m in the bore region.
- Tensile coupons from the web \u2014 YS \u2265 950 MPa, Elong \u2265 12%.
- Dimensional CMM on the flange face \u2014 flatness \u2264 0.05 mm.

## 6. Lessons learned (the painful way)
- 2024-04: skipped HIP on a rush job \u2192 fatigue crack at 11k hours. Never skip HIP on rotating parts.
- 2023-09: support removal gouged the bore \u2192 scrap. Use EDM, not hand tools, for bore ID supports.`,
      tags: JSON.stringify(['thruster bearing', 'titanium', 'qualification', 'lloyds register', 'HIP', 'CT scan']),
      equipmentTags: JSON.stringify(['BP-1024', 'thruster bearing housing']),
      criticality: 'critical',
    },
    {
      documentId: 'KD-002',
      title: 'Hydraulic Valve Line B \u2014 Emergency Swap Procedure',
      category: 'procedure',
      authorEmployeeId: 'EMP-003',
      summary: 'James\u2019s field procedure for swapping the BP-0892 hydraulic valve body on a live rig without shutting down the full line. Used 14 times in production, never failed.',
      content: `# Hydraulic Valve Line B \u2014 Emergency Swap Procedure

**Author:** James O\u2019Connor
**Equipment:** BP-0892 Hydraulic Valve Body (SS316L), Rig Alpha line B

## When to use this
When a valve body on line B is leaking past the seat AND shutting down the full line would cost >$80k/hour in deferred production.

## Tooling checklist (do not start without all of these on deck)
- 2x valve bodies pre-qualified (CT scan on file)
- Torque wrench calibrated within 30 days
- Line isolation clamps (green tag)
- Catch tray + 60 L drums for residual fluid

## Procedure
1. **Isolate** \u2014 close upstream block valve, lock the bypass open. Confirm pressure <2 barg on the gauge.
2. **Drain** \u2014 open the body bleed, drain into catch tray. Expect ~12 L residual.
3. **Unbolt** \u2014 opposite-corner pattern, 4 passes. Do NOT remove the top 2 bolts until the body is supported.
4. **Swap** \u2014 lower new body onto the seat ring, finger-tight all bolts, then torque in the spec pattern (see table).
5. **Pressure test** \u2014 bring line to 50% MAWP, hold 10 min, soap-test all flanges.
6. **Return to service** \u2014 open upstream slowly, watch the gauge for seat bounce.

## Torque spec (SS316L body, M16 bolts, dry)
| Pass | Torue (Nm) |
|------|------------|
| 1    | 40         |
| 2    | 80         |
| 3    | 120        |
| 4    | 145 (final)|

## Field wisdom
- If the seat ring is scored, do NOT re-use it. Pulling a scored seat costs you the new valve body within a week.
- Always stage the catch tray BEFORE you crack the body. Fluid comes out faster than you think.`,
      tags: JSON.stringify(['hydraulic valve', 'emergency', 'field service', 'rig', 'swap procedure']),
      equipmentTags: JSON.stringify(['BP-0892', 'hydraulic valve body']),
      criticality: 'critical',
    },
    {
      documentId: 'KD-003',
      title: 'Heat Exchanger Plate \u2014 Weld Crack Diagnosis Guide',
      category: 'troubleshooting',
      authorEmployeeId: 'EMP-001',
      summary: 'How to tell whether a crack in a BP-0566 heat exchanger plate is condemnable or repairable. Written after the 2024 MV Rosen Explorer incident where a repairable plate was condemned by mistake.',
      content: `# Heat Exchanger Plate \u2014 Weld Crack Diagnosis Guide

**Author:** Robert Mackenzie
**Equipment:** BP-0566 Heat Exchanger Plate (SS316L)

## The 4 crack types
1. **Toe crack** (weld toe, <25 mm long) \u2014 REPAIRABLE. Grind out + re-weld + re-CT.
2. **Through-thickness crack** (full penetration) \u2014 CONDEMN. No exceptions.
3. **Branch crack** (multiple offshoots) \u2014 CONDEMN. Indicates stress corrosion.
4. **HAZ microcrack** (<2 mm, in heat-affected zone) \u2014 REPAIRABLE if <5 microcracks per 100 mm of weld.

## Decision tree
- Dye-penetrant first to map the crack.
- If crack length >40 mm \u2192 condemn (no further inspection needed).
- If crack is in the toe and <25 mm \u2192 measure depth with UT. If <3 mm \u2192 repair.

## The 2024 mistake we are NOT repeating
On MV Rosen Explorer, a toe crack was misread as a through-thickness crack because the inspector did not have the UT probe calibrated. The plate was condemned and a $2,800 part was scrapped. Always calibrate UT on a known-good reference block before measuring crack depth.`,
      tags: JSON.stringify(['heat exchanger', 'weld crack', 'diagnosis', 'condemn', 'repair', 'UT']),
      equipmentTags: JSON.stringify(['BP-0566', 'heat exchanger plate']),
      criticality: 'important',
    },
    {
      documentId: 'KD-004',
      title: 'Ti-6Al-4V Parameter Set v3 \u2014 Development Notes',
      category: 'case_study',
      authorEmployeeId: 'EMP-004',
      summary: 'Aisha\u2019s lab notebook on how the production "Ti64-Bearing-v3" parameter set was developed. Includes the 3 failure modes that drove each iteration.',
      content: `# Ti-6Al-4V Parameter Set v3 \u2014 Development Notes

**Author:** Dr. Aisha Patel
**Material:** EOS Ti-6Al-4V Grade 23 (ELI)

## Why v3 exists
v2 produced parts that passed tensile but failed fatigue at 8k hours. v3 closed the fatigue gap by reducing lack-of-fusion porosity from 0.4% to 0.05%.

## Parameter evolution
| Version | Laser (W) | Speed (mm/s) | Hatch (\u00b5m) | Porosity | Fatigue @ 8k h |
|---------|-----------|--------------|------------|----------|----------------|
| v1      | 340       | 1400         | 140        | 0.8%     | FAIL           |
| v2      | 370       | 1300         | 120        | 0.4%     | FAIL           |
| v3      | 400       | 1250         | 100        | 0.05%    | PASS           |

## The 3 failure modes that drove each iteration
1. **v1 \u2192 v2:** Lack-of-fusion between hatch tracks. Solved by overlapping hatch 20 \u00b5m more.
2. **v2 \u2192 v3:** Keyhole porosity at the start of each track. Solved by adding a 0.5 ms ramp-up on the laser.
3. **v3 final:** Surface roughness on downskin. Solved by adding a contour pass at 280 W / 900 mm/s.

## What I would tell my past self
Do not optimise for density alone. We hit 99.6% density on v2 and still failed fatigue. The defect SHAPE matters more than the defect VOLUME \u2014 a few sharp lack-of-fusion voids are worse than many spherical gas pores.`,
      tags: JSON.stringify(['titanium', 'parameter development', 'fatigue', 'porosity', 'laser parameters']),
      equipmentTags: JSON.stringify(['Ti-6Al-4V', 'parameter set']),
      criticality: 'important',
    },
    {
      documentId: 'KD-005',
      title: 'Powder Reuse Protocol \u2014 5-Cycle Limit & Sieve Cadence',
      category: 'procedure',
      authorEmployeeId: 'EMP-004',
      summary: 'Aisha\u2019s powder-reuse protocol that cut material waste 23%. Defines the 5-cycle limit, sieve cadence, and the oxygen pick-up threshold that forces retirement.',
      content: `# Powder Reuse Protocol \u2014 5-Cycle Limit & Sieve Cadence

**Author:** Dr. Aisha Patel

## The rule
- Max 5 reuse cycles on Ti-6Al-4V. After cycle 5, retire the powder.
- Max 8 reuse cycles on SS316L. After cycle 8, retire.
- Sieve between EVERY build. No exceptions.

## Why these limits
- Ti64: oxygen pick-up averages +180 ppm per cycle. Above 0.20 wt% O, the elongation drops below the 12% spec floor.
- SS316L: the limit is driven by PSD drift, not chemistry. After 8 cycles the D90 exceeds 53 \u00b5m and flowability degrades.

## Sieve cadence
- 53 \u00b5m mesh for Ti64.
- 63 \u00b5m mesh for SS316L.
- Log the sieve weight retained on a 106 \u00b5m screen. If >2% retained, the powder is contaminated \u2014 retire immediately.

## The 23% saving
Before this protocol, the lab discarded powder after every build "to be safe". Tracking real oxygen and PSD let us confidently reuse 5 cycles, cutting Ti64 spend from $1.2M/yr to $924k/yr.`,
      tags: JSON.stringify(['powder reuse', 'titanium', 'stainless steel', 'sieve', 'oxygen', 'waste reduction']),
      equipmentTags: JSON.stringify(['powder', 'Ti-6Al-4V', 'SS316L']),
      criticality: 'important',
    },
    {
      documentId: 'KD-006',
      title: 'CT Inspection Acceptance Criteria \u2014 AM Parts',
      category: 'procedure',
      authorEmployeeId: 'EMP-002',
      summary: 'Margaret\u2019s master table of defect-acceptance criteria for AM parts, by part category. This is the single source of truth inspectors use to call pass/fail.',
      content: `# CT Inspection Acceptance Criteria \u2014 AM Parts

**Author:** Margaret Sullivan
**Applies to:** all AM parts produced in the AddManuChain network

## Voxel size rule
- Critical rotating parts: \u2264 195 \u00b5m
- Static structural parts: \u2264 400 \u00b5m
- Hydraulic bodies: \u2264 250 \u00b5m

## Defect acceptance by category
| Category | Max pore size | Max porosity % | Sharp LOF voids |
|----------|--------------|----------------|-----------------|
| Rotating (bearing, impeller) | 300 \u00b5m | 0.1% | ZERO |
| Static structural | 500 \u00b5m | 0.5% | <3 per part |
| Hydraulic body | 400 \u00b5m | 0.3% | ZERO in seal area |
| Thermal (heat exchanger) | 600 \u00b5m | 0.8% | <5 per part |

## How to call it
1. Measure the largest pore in the critical region. If over the limit \u2192 REJECT.
2. If under the limit, check total porosity %. If over \u2192 REJECT.
3. If both pass, scan for sharp lack-of-fusion voids (aspect ratio >4:1). If any in a "ZERO" zone \u2192 REJECT.

## Common inspector mistake
Calling a spherical gas pore "rejectable" just because it is 350 \u00b5m in a static part. The 500 \u00b5m limit exists for a reason \u2014 spherical pores are blunt, not crack-initiators. Save the reject call for sharp voids.`,
      tags: JSON.stringify(['CT scan', 'inspection', 'acceptance criteria', 'porosity', 'defect']),
      equipmentTags: JSON.stringify(['all AM parts']),
      criticality: 'critical',
    },
    {
      documentId: 'KD-007',
      title: 'Impeller Shaft Vibration \u2014 Field Troubleshooting Tree',
      category: 'troubleshooting',
      authorEmployeeId: 'EMP-003',
      summary: 'James\u2019s decision tree for when an impeller shaft starts vibrating. Walks the tech from "is it the shaft or the bearing?" through to "swap or re-balance".',
      content: `# Impeller Shaft Vibration \u2014 Field Troubleshooting Tree

**Author:** James O\u2019Connor
**Equipment:** BP-0789 Impeller Shaft

## Step 1 \u2014 Read the trend
- Vibration climbing SLOWLY over weeks \u2192 bearing wear. Plan a scheduled swap.
- Vibration SPIKED in hours \u2192 something came loose. Shut down immediately.

## Step 2 \u2014 Frequency signature (if you have a vib pen)
- Dominant 1x RPM \u2192 imbalance. Re-balance, do NOT swap shaft.
- Dominant 2x RPM \u2192 misalignment. Check coupling, not shaft.
- Dominant high-freq hash \u2192 bearing race spalling. Swap the bearing, shaft is fine.
- Dominant sub-synchronous \u2192 oil whirl. Check oil viscosity, not shaft.

## Step 3 \u2014 If you must swap the shaft
1. Lock the rotor.
2. Pull the coupling first (do NOT use the shaft as a pry bar \u2014 it bends).
3. Support the shaft at 3 points before unbolting the bearing housing.
4. Inspect the journal for scoring. If scored, the new shaft will fail in <500 hours \u2014 fix the bearing first.

## The shaft I threw away by mistake
2022, Horizon Platform 7. Vibration was 2x RPM = misalignment. I swapped the shaft thinking it was bent. The new shaft vibrated identically. The coupling was the problem. Cost us 6 hours of downtime and a $9,200 shaft. Check frequency FIRST.`,
      tags: JSON.stringify(['impeller shaft', 'vibration', 'troubleshooting', 'field service', 'bearing']),
      equipmentTags: JSON.stringify(['BP-0789', 'impeller shaft']),
      criticality: 'important',
    },
    {
      documentId: 'KD-008',
      title: 'Safety Bulletin \u2014 Powder Handling Fire Risk',
      category: 'safety_bulletin',
      authorEmployeeId: 'EMP-002',
      summary: 'Safety bulletin after the 2024 near-miss where a titanium powder fines bucket ignited. Defines the mandatory inert-atmosphere handling rules.',
      content: `# SAFETY BULLETIN \u2014 Powder Handling Fire Risk

**Author:** Margaret Sullivan (Quality, on behalf of HSE committee)
**Severity:** CRITICAL \u2014 mandatory compliance

## The incident
On 2024-06-12, a bucket of Ti-6Al-4V fines (sieved-out oversize + satellites) ignited during transfer from the build chamber to the recovery drum. The fire was contained by the inert purge but could have been catastrophic.

## Root cause
- Fines bucket was open to atmosphere for 4 minutes during transfer.
- Ambient humidity was 62% \u2014 enough moisture to start the reaction.

## Mandatory rules (effective immediately)
1. ALL powder transfers must happen under argon purge. No exceptions.
2. Fines drums must be <5% O\u2082 before sealing. Verify with the inline probe.
3. No powder handling when ambient humidity >55%. Use the climate-controlled room.
4. Class D fire extinguisher within 3 m of every powder station.

## What "inert transfer" actually means
1. Seal the build chamber, purge to <1% O\u2082.
2. Connect the transfer tube, purge the tube.
3. Transfer powder under continuous argon flow.
4. Seal the receiving drum under argon.

If you do not have a transfer tube, STOP. Do not improvise. Call engineering.`,
      tags: JSON.stringify(['safety', 'powder handling', 'fire', 'titanium', 'inert atmosphere']),
      equipmentTags: JSON.stringify(['powder station']),
      criticality: 'critical',
    },
    {
      documentId: 'KD-009',
      title: 'Onboarding Plan \u2014 Junior AM Engineer (Template)',
      category: 'procedure',
      authorEmployeeId: 'EMP-001',
      summary: 'Robert\u2019s onboarding template for a new junior AM engineer. 90-day plan with milestones, reading list, and the "must-shadow" build list.',
      content: `# Onboarding Plan \u2014 Junior AM Engineer (Template)

**Author:** Robert Mackenzie
**Audience:** any new junior AM engineer joining the team

## Days 1\u201330 \u2014 Foundations
- Read KD-001 (thruster bearing SOP), KD-006 (CT acceptance), KD-005 (powder reuse).
- Shadow 2 full builds of BP-1024 end-to-end.
- Complete the laser safety + inert-gas handling training.
- Milestone: explain the orientation choice for BP-1024 to your mentor without notes.

## Days 31\u201360 \u2014 Hands-on
- Run 1 build of BP-0892 (simpler geometry) under supervision.
- Perform CT inspection on your own build; compare your call to Margaret\u2019s.
- Attend 1 certification review meeting.
- Milestone: call pass/fail on 3 parts and match the senior inspector on all 3.

## Days 61\u201390 \u2014 Independence
- Run 3 builds solo, including 1 of BP-1024.
- Write the inspection report for each.
- Lead 1 powder-changeover with only verbal check-ins.
- Milestone: your mentor signs off that you can run BP-0892 unsupervised.

## The must-shadow build list
1. BP-1024 thruster bearing (the certification-heavy one)
2. BP-0892 hydraulic valve (the field-critical one)
3. BP-0789 impeller shaft (the rotating-fatigue one)

If you have not seen all 3 of these built at least once, you are not ready for solo runs.`,
      tags: JSON.stringify(['onboarding', 'junior engineer', 'training plan', '90 day', 'mentorship']),
      equipmentTags: JSON.stringify(['BP-1024', 'BP-0892', 'BP-0789']),
      criticality: 'important',
    },
    {
      documentId: 'KD-010',
      title: 'Case Study \u2014 The 2023 Rush Job That Cost Us $340k',
      category: 'case_study',
      authorEmployeeId: 'EMP-001',
      summary: 'Robert\u2019s post-mortem on the 2023 incident where skipping HIP to hit a deadline led to a field fatigue failure. Required reading for every engineer before they sign a deviation.',
      content: `# Case Study \u2014 The 2023 Rush Job That Cost Us $340k

**Author:** Robert Mackenzie
**Date of incident:** 2023-09-14

## What happened
A customer needed a BP-1024 thruster bearing in 6 days. Normal cycle is 12. The customer offered a $40k premium for the rush. We accepted.

To hit 6 days, we skipped HIP (saves 2 days) and shipped after stress-relief only.

## What went wrong
- Part passed all as-built inspections (CT, tensile, dimensional).
- Installed on the vessel 2023-09-20.
- 2024-08-04 (11k hours): fatigue crack initiated at a 220 \u00b5m lack-of-fusion void in the bore.
- Vessel down 3 days. Total cost: $340k (downtime + re-print + re-install + customer credit).

## Root cause
- The 220 \u00b5m void was within the 300 \u00b5m CT acceptance limit \u2014 so inspection correctly passed it.
- HIP would have closed the void. Without HIP, the void became a fatigue initiator.
- The acceptance criteria assume HIP has been done. Skipping HIP invalidates the criteria.

## The lesson
**The acceptance criteria are conditional on the full process being followed.** Skipping a step does not just save time \u2014 it changes what the part is. Never sign a deviation that skips HIP on a rotating part. The math never works: $40k premium vs $340k exposure.

## What we changed
- All deviations that skip HIP now require VP-level sign-off.
- The rush-quote tool now refuses to quote <12 day delivery on HIP-required parts.`,
      tags: JSON.stringify(['case study', 'HIP', 'fatigue', 'deviation', 'rush job', 'lesson learned']),
      equipmentTags: JSON.stringify(['BP-1024', 'thruster bearing housing']),
      criticality: 'critical',
    },
  ]

  const createdDocs: Record<string, { id: string }> = {}
  for (const doc of docs) {
    const { authorEmployeeId, ...data } = doc
    const author = createdEmployees[authorEmployeeId]
    if (!author) {
      console.warn(`Author ${authorEmployeeId} not found for doc ${doc.documentId}`)
      continue
    }
    const created = await db.knowledgeDocument.upsert({
      where: { documentId: doc.documentId },
      update: { ...data, authorId: author.id },
      create: { ...data, authorId: author.id },
    })
    createdDocs[doc.documentId] = created
  }

  // ── Knowledge transfers ────────────────────────────────────────────────────
  const transfers = [
    {
      transferId: 'KT-001',
      fromEmployeeId: 'EMP-001',
      toEmployeeId: 'EMP-005',
      documentId: 'KD-001',
      type: 'mentorship',
      status: 'in_progress',
      scheduledDate: new Date(BASE - 30 * DAY),
      notes: 'Robert is walking Tyler through the thruster bearing SOP over 3 build cycles.',
    },
    {
      transferId: 'KT-002',
      fromEmployeeId: 'EMP-002',
      toEmployeeId: 'EMP-006',
      documentId: 'KD-006',
      type: 'training_session',
      status: 'in_progress',
      scheduledDate: new Date(BASE - 14 * DAY),
      notes: 'Margaret is training Priya on the CT acceptance criteria \u2014 5 supervised inspections.',
    },
    {
      transferId: 'KT-003',
      fromEmployeeId: 'EMP-003',
      toEmployeeId: 'EMP-007',
      documentId: 'KD-002',
      type: 'handover',
      status: 'pending',
      scheduledDate: new Date(BASE + 30 * DAY),
      notes: 'James will shadow Marcus through 2 full valve-line-B swap cycles before retirement.',
    },
    {
      transferId: 'KT-004',
      fromEmployeeId: 'EMP-004',
      toEmployeeId: 'EMP-008',
      documentId: 'KD-005',
      type: 'mentorship',
      status: 'completed',
      scheduledDate: new Date(BASE - 10 * DAY),
      completedDate: new Date(BASE - 3 * DAY),
      notes: 'Aisha completed the powder-reuse protocol handover. Sofia is now running the sieve cadence solo.',
    },
  ]

  for (const t of transfers) {
    const { fromEmployeeId, toEmployeeId, documentId, ...data } = t
    await db.knowledgeTransfer.upsert({
      where: { transferId: t.transferId },
      update: {
        ...data,
        fromEmployeeId: createdEmployees[fromEmployeeId].id,
        toEmployeeId: createdEmployees[toEmployeeId].id,
        documentId: documentId ? createdDocs[documentId]?.id ?? null : null,
      },
      create: {
        ...data,
        fromEmployeeId: createdEmployees[fromEmployeeId].id,
        toEmployeeId: createdEmployees[toEmployeeId].id,
        documentId: documentId ? createdDocs[documentId]?.id ?? null : null,
      },
    })
  }

  console.log(`Seeded ${employees.length} employees, ${docs.length} knowledge docs, ${transfers.length} transfers.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
