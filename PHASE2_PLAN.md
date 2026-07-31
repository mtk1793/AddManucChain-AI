# AddManuChain Phase 2 — Mitacs Implementation Plan

**Baseline:** LTE (Long-Term Evolution) — completed Phase 1 with role-based dashboards, DRM pipeline, localStorage persistence, hydration fixes.

**Reference:** Mitacs Plus Accelerate Research Proposal — 10 subprojects for intelligent distributed additive manufacturing.

---

## Batch 1 — Core Engine Completion
*Governance, QC step, cert lifecycle, hash chain*

| # | Task | Status |
|---|------|--------|
| 1.1 | Add QC (Quality Check) step to order lifecycle | ✅ DONE |
| 1.2 | Full SHA-256 hash chain across order state transitions | ✅ DONE |
| 1.3 | Dynamic cert lifecycle — expiry tracking, renewal alerts, compliance | ✅ DONE |
| 1.4 | Governance dashboard — cert health scores, approval bottlenecks, audit completeness | ✅ DONE |
| 1.5 | Wire QC + cert lifecycle into all dashboards | ✅ DONE |

## Batch 2 — Intelligence Layer
*AI Assistant, predictive maintenance*

| # | Task | Status |
|---|------|--------|
| 2.1 | AI Assistant upgrade — wire `/api/ai/agent` tools to chat | ⬜ TODO |
| 2.2 | Render result cards in AI chat (orders, blueprints, materials) | ⬜ TODO |
| 2.3 | Predictive maintenance tab in PrintCenterDashboard | ⬜ TODO |
| 2.4 | Equipment health cards + RUL charts + LSTM trend viz | ⬜ TODO |
| 2.5 | Maintenance alert feed + schedule | ⬜ TODO |

## Batch 3 — Distributed Operations
*Multi-facility fleet, smart scheduling, cross-facility orders*

| # | Task | Status |
|---|------|--------|
| 3.1 | Multi-facility fleet map view | ⬜ TODO |
| 3.2 | Smart scheduling — capacity, material, proximity routing | ⬜ TODO |
| 3.3 | Cross-facility job transfer + load balancing | ⬜ TODO |
| 3.4 | OrdersPage cross-facility scope + enhanced DRM badges | ⬜ TODO |

## Batch 4 — Polish
*Security viz, reports, collaboration*

| # | Task | Status |
|---|------|--------|
| 4.1 | Encryption/security visualization across all dashboards | ⬜ TODO |
| 4.2 | Structured reporting export (PDF/CSV mock) | ⬜ TODO |
| 4.3 | Collaboration — threaded comments on orders | ⬜ TODO |
| 4.4 | Final integration testing + cleanup | ⬜ TODO |

---

## Order Lifecycle (Target State)

```
pending → oem_approved → cert_approved → print_authorized → printing → quality_check → completed → archived
   ↓            ↓               ↓                ↓              ↓            ↓             ↓          ↓
 SHA-256     SHA-256         SHA-256          SHA-256        SHA-256      SHA-256       SHA-256    SHA-256
  seed       oemHash         certHash         tokenHash      printHash    qcHash        compHash   archiveHash
             (linked)        (linked)         (linked)       (linked)    (linked)      (linked)   (linked)
```

## Certification Lifecycle

```
active → expiring_soon (90d) → expired → (renewal) → active
                ↓                              
           alert sent                         
```

---

*Last updated: 2026-07-31*
