# PRD-00 — agere/org MVP Release Plan (Release 1)

| Field | Value |
|---|---|
| Version | 1.2.14 |
| Status | Proposed — for Product Owner and engineering sign-off |
| Owner | [TBD — Product Owner agere/org] |
| Last updated | 29 Sep 2026 |
| Team | 1 Frontend Engineer (FE), 1 Backend Engineer (BE) |
| Method | **Kanban** with a weekly cadence and WIP limits; no sprints. Plan in weeks W0–W26 (release 1) and W27–W38 (release 2 candidate); timeline artifact "Timeline agere/org" and §4.3 |
| Stack | Next.js modular monolith on Vercel (Pro), Postgres, Agere DS, Google Antigravity IDE |
| Governs | Which PRD capabilities ship in release 1, the capacity plan and the go/no-go gates |

> **v1.2.14 (30 Sep 2026) — QA v18.5:** D48 unchanged in scope; PRD-14 v1.5.1 records four QA fixes (Undang only in the channel header per D32, "Bagikan proyek" dialog title, sizes < 1 KB, time format per language). No capacity change; D48a stays open.

> **v1.2.13 (29 Sep 2026) — D48:** Chat message collaboration (invite, attachments with link previews, reactions, copy, DM from a channel, edit/delete; PRD-14 v1.5). Attachments leave the D22 hold **for Chat only** (PRD-07 v1.0.4). Release 2 grows by ≈ 18,5 ideal dev-days [H]; timing is **D48a** (Option A +2 weeks, Option B +1 week with video and server-side link previews in 2.1). Release 1 is unchanged.

> **v1.2.12 (29 Sep 2026) — D47 revised:** the doc preview is a slide-out modal (PRD-08 v1.1.3). QA also found that dialogs did not keep focus inside (all modals); UI-01 v2.9 makes the focus trap a global rule. No capacity change.

> **v1.2.11 (29 Sep 2026) — D47:** project Doc tab as a clean list with a preview panel (PRD-08 v1.1.2, release 3; no release-1 impact).

> **v1.2.10 (29 Sep 2026) — D46:** no "Semua proyek" page and a minimal project card (PRD-06 v2.1.2). Capacity neutral: one page less, one card simpler, one redirect and an empty state [H: FE −0.5, not re-baselined].

> **v1.2.9 (29 Sep 2026) — timeline table:** §4.3 now shows the 29-week plan (Option A, §4.2 step 9); the week-by-week execution plan, CI gates and vibe-coding workflow are in **PLAN-01**.

> **v1.2.8 (28 Sep 2026) — two languages, English default (D45) and AI Agent model (D44):** release 1 ships **English (default) and Bahasa Indonesia**; §4.2 step 9 re-baselines release 1 to **29 weeks** (Option A, recommended) or **28 weeks** (Option B: list drag-and-drop → 1.1); the 26-week Option B of step 8 is void. AI Agent: PRD-17 v1.0 replaces the skill-centric v0.2 with the agent model of the input document "PRD — AI Agent for Project Management System v1.0" (Option B), adapted to agere/org. Release placement unchanged (release 3, proposed, D29); estimate **Must 8 weeks, Must + Should 9 weeks** [H]. Release 1 capacity (§4.2 step 8) is **not** affected. UI placement and visual execution are open design decisions DD-1…DD-6 for the UI/UX Designer (PRD-17 §10.4).

> **v1.2.7 (28 Sep 2026) — prototype v17.1 decisions (D28a–D43) and capacity:** onboarding in three steps (D30), Otomatisasi merged into Agen › Pemicu (D31), page-header actions and CTA hierarchy (D32), no placeholder text (D33), Doc always editable (D39, release 3), **Impor** with multiple formats and one date grammar (D40), task detail v2 (D41), subtasks designed (D28a; release = D38), Agere DS 6.4 (D37). Release 1 re-baselined in §4.2 step 8: **Option A = 27 weeks** (recommended, slack 0.64 week), **Option B = 26 weeks** only if drag and drop in Daftar moves to release 1.1 **and** D34 is accepted (slack 0.07 week). Decisions table §8 extended; release 2 candidates §9 updated.

> **v1.2.6 (27 Sep 2026) — prototype v13 decisions (D19–D26) and capacity:** navigasi ganda (rail + contextual panel), **Desk** first and the landing screen, org-level Ringkasan removed (Space home = **Semua proyek** with space tabs and space chips), Space editable with **uploaded icons**, **ClickUp list pattern** for Daftar/Tugas saya/Permintaan, Kotak masuk redesign (tabs, day groups, archive), Bagikan ClickUp-style, **Panduan** in-app (PRD-18), brand **black** + official agere logo, **File on hold**, Doc folders (release 3), **Agen & Skill** proposed for release 3 (PRD-17). Release 1: **BE 70.5 / FE 78 → rebalanced 74.25 / 74.25 → 26 weeks** (+2 vs v1.2.5), slack ≈ 0.54 week (§4.2 step 7). Milestones: M1 end W10, **M2 end W18**, **M3 end W26**; Chat candidate moves to W27–W38. Open decisions D27 (public link), D28 (subtasks).

> **v1.2.5 (27 Sep 2026) — Space as container (D18, supersedes D17):** Organization → Space → Project → views. Release 1 adds the Space container: **BE +4, FE +5 ideal days** [Hypothesis — re-estimate in W0] (spaces table, ACL inheritance, events/audit; sidebar Space group, Space page with project cards, search and filter, create/share). Kalender becomes a project view (D15 decided). Timeline view, Kalender view and project Channel are release 2; Doc tab, `.md` import and Doc export (PDF, DOCX, HTML, MD) are release 3. Capacity impact in §4.2 step 6.

> **v1.2.4 (26 Sep 2026) — Project → Space:** the work app's display name is now **Space** (decision **D17**, Index C-17). Internal id `space`, events and tables are unchanged; units inside stay "proyek". Every "Project" in this plan means the Space app; scope and capacity are unchanged. URLs are `/{slug}/space/…` (UI-01 v1.8).

> **v1.2.3 (26 Sep 2026) — Lead CRM removed:** PRD-05 Lead CRM and everything derived from it (companies, contacts, deals, pipeline, tindak lanjut, sales reports, `lead.*` events) leave the roadmap (decision **D16**, Index C-16). Release 1 capacity is unchanged because Lead was release 3. Calendar (PRD-09) loses its second source, so its release 2 scope needs re-evaluation (decision **D15**).

> **v1.2.2 (26 Sep 2026) — relative weeks:** all calendar dates are removed because the kick-off date is not set. W0 = preparation week, W1 = kick-off week; milestones are stated as week ends (M1 end W10, M2 end W16, M3 end W22). New decision **D7** (kick-off date) in §9.

> **v1.2.1 (26 Sep 2026) — Kanban:** the team works in Kanban, not sprints. Capacity is 3.5 ideal days per person per week; the plan is expressed in weeks and phases (§4.3). Former sprint labels map as Sn = W(2n−1)–W(2n).

> **v1.2 (26 Sep 2026):** Project adopts a ClickUp-style **project space** (tabs Ringkasan · Papan · Daftar in release 1; Channel, Tenggat and "+ Tampilan" in release 2; pinned Doc tabs in release 3) and a **Proyek** sidebar tree (PRD-06 v1.3). QA v10 fixes that belong to release 1 are absorbed (QA-01): global form rules, focus return, state rule and mobile cards (UI-01 v1.5), role-change confirmation and revoke-with-impact (PRD-04 v1.4), password rules (PRD-01). **PRD-14 Team Chat** is registered as a release 2 candidate behind gate **G-Chat** (§9). Capacity in §4: still 22 weeks, slack **~0.06 week** — see §4.2 step 5 for the decision this needs.

> **v1.1 (25 Sep 2026):** Space is renamed **Project** (internal id `space` unchanged). Project gains **Ringkasan** (app home: KPI cards, status donut and task table; the trend chart is release 2). Theme default is Terang (PRD-12 v1.2). Capacity recalculated in §4: still 11 sprints, slack reduced from ~0.9 to ~0.5 sprint.

> **Single source of truth for scope.** When a PRD's MoSCoW list and this plan disagree about release 1, this plan wins, and the PRD must be amended in the same week.

---

## 1. Release thesis

**Release 1 proves that a small Indonesian team will run its daily work in agere/org:** one identity, one organization, clear access, **Space** (internal id `space`; spaces → projects) as the wedge app, and **Desk** as the daily entry point (Kotak masuk, Tugas saya).

Doc and Calendar are deferred; File is on hold (D22). They only add value once organizations, access and daily task execution are trusted. Lead CRM is no longer on the roadmap (D16).

## 2. North Star & release metrics

**North Star — Weekly Active Collaborative Organizations (WACO):** organizations where **≥ 2 active members** each performed **≥ 1 Project action** (create, update, move or complete a task) in the ISO week.

Rationale: WACO measures the platform thesis (one organization, many people) and the wedge app together. It is not inflated by single-user trials.

| Metric | Definition | Pilot target (closed pilot, 5–10 design-partner orgs) | Public MVP target (first 8 weeks) |
|---|---|---|---|
| WACO | As above | ≥ 60% of pilot orgs by pilot week 4 [H] | ≥ 40% of created orgs [H] |
| Organization activation | Org reaches ≥ 2 active members **and** ≥ 5 tasks within 7 days of creation | ≥ 70% [H] | ≥ 40% [H] |
| Week-4 org retention | Activated orgs that are WACO in week 4 | ≥ 60% [H] | ≥ 35% [H] |
| Time to first task | Median, from sign-up to first task created | ≤ 10 min [H] | ≤ 10 min [H] |
| Guardrail: cross-org disclosure | Confirmed incidents | **0** | **0** |
| Guardrail: unauthorized access | Confirmed incidents | **0** | **0** |
| Guardrail: lost events / missing audit rows | Reconciliation (PRD-00b D12) | **0** | **0** |

The instrumentation for these metrics is itself release-1 scope (§6, gate G9).

## 3. Scope

### 3.1 In release 1 (Must)

| PRD | Release 1 scope |
|---|---|
| 00b Event Contract v1.2.1 | All Must: outbox, same-transaction audit, fast path + sweeper, reconciliation |
| 01 Identity & SSO v1.2.1 | All Must: email/password + verification + reset, Google + safe linking, DB sessions, lockout, re-authentication, platform admin with MFA; QA ON3/ON4 password and sign-up rules (QA-01) |
| 02 Organization v1.1.1 | Create, slug URL context, switcher, Organisasi › Umum (display name, logo, default timezone), ownership transfer, organization deletion with a grace period |
| 03 People & Teams v1.2.1 | All Must: invitations, states, suspend/remove + "Alihkan pekerjaan", self-leave, teams |
| 04 Roles, App Access & ACL v1.5 | All Must, incl. the **Space** container above Project and the ClickUp-style Share dialog (public link excluded, D27). The app registry lists **Space only** in release 1. Role changes via confirmation (Owner with re-auth) and app-access revoke with impact + handover (QA AD1/AD2). |
| 06 Space & Project v2.0 | All Must: **spaces** (create, **edit incl. uploaded icon**, delete when empty), **Semua proyek** (space tabs, space chip on cards), space page, projects, boards, columns, tasks, views **Daftar (ClickUp list pattern) · Papan · Ringkasan (per project)** with landing rule, task detail, **Tugas saya in Desk**, access-aware assignee picker. Org-level Ringkasan removed (D21). Kalender, Timeline (`.md` import), Channel, "+ Tampilan" = release 2 |
| 10 Notifications v1.3 | All Must: **Desk › Kotak masuk** (tabs Semua · Belum dibaca · Untuk saya, day groups, archive), rule table, reassignment summaries, account-critical email |
| 11 Audit Trail v1.1.1 | Same-transaction write path, redaction, viewer for Owner/Admin |
| 12 Settings & Profile v1.2.1 | Personal only: profile, security, preferences (theme, timezone), account deletion |
| UI-01 v2.2 shell | **Navigasi ganda** (rail: Desk · Space · Chat · Doc · Agen · Panduan · Kelola; contextual panel with search, Ctrl+B collapse, hover-peek, Alt+1…7), brand black + agere logo, Agere DS Select/ButtonGroup/Tabs/ScrollArea; Chat, Doc and Agen rail items appear only when their app ships |
| 18 Panduan v1.0 | Cara pakai per menu + Alur kerja per peran, "Tunjukkan di layar", progress per user (PRD-18) |
| 13 Data Lifecycle & Privacy v1.0.1 | Retention jobs, trash, account and organization deletion, consent record, rights-request runbook |

### 3.2 Pulled in only if capacity remains (Should, ranked)

1. Comments + @mention on tasks (PRD-06)
2. Project status: owner, target date, manual status (PRD-06 §6.8, QA PM1) — BE 1, FE 1
3. Daily due-today digest (PRD-10)
4. MFA for Owners/Admins (PRD-01)
5. Session list in settings (PRD-12)
6. Audit CSV export (PRD-11)
7. Priority field on tasks (PRD-06)
8. Favorit projects in the sidebar (PRD-06)
9. Full search results page from ⌘K (UI-01 v2.4; D43) — BE 1, FE 1.5 [H]
10. Keyboard shortcuts dialog, Ctrl / (UI-01 v2.4; D43) — FE 0.25

### 3.3 Deferred

| PRD | Release | Why |
|---|---|---|
| 07 File | **On hold (D22)** | Removed from navigation and from the release 2 candidates; avatars, logos and space icons use Blob directly. Lift criteria in PRD-07 v1.0.3 |
| 09 Calendar | 2 — scope under review (D15) | "Tugas saya" covers what is due in release 1. With Lead removed, Project tasks are the only source, so Calendar may become Project's Tenggat tab instead of a separate app |
| 14 Team Chat (incl. project channels) | 2 — candidate | Only if gate G-Chat passes at M3 (§9); 12 weeks, W27–W38 (PRD-14 v1.3 §12) |
| 08 Doc (incl. folders, `.md` import, export, block editor; PRD-08 v1.0.3) | 3 | Competes with entrenched tools; low confidence (RICE 44) |
| 17 Agen (AI Agent) | 3 — **proposed** | Agents created from plain language (Blueprint), platform skills and a tool registry, permission matrix, approvals, evidence policy, AI Gateway with tiers and metering (D44). Must BE 23.5 / FE 21 → 8 weeks; with triggers (Should) BE 27.5 / FE 24 → 9 weeks [H] (PRD-17 v1.0 §13) |
| 15 Permintaan (formulir antar divisi, SLA hari kerja) | Proposed (D8) | Shown in the prototype under Desk; PRD not written. Enters release 1 only under pivot option B |
| Billing & packaging | Before paid launch | **Release 1 and the pilot are free.** Seats are not counted. |
| English UI | 2 | Release 1 is Bahasa Indonesia only (Agere DS content rule) |

### 3.4 Removed

| PRD | Decision | Why |
|---|---|---|
| 05 Lead CRM and derivatives | Removed 26 Sep 2026 (D16) | Product focus moves to cross-division operations; CRM is a separate category with specialist competitors; largest scope with narrow reach (RICE 50); removes third-party contact PII from the UU PDP scope. PRD-05 is kept as an archive; void references are listed in Index C-16 |

## 4. Capacity model

### 4.1 Method

- **Ideal dev-days** per capability, estimated per role [Hypothesis — re-estimate with the team in W0].
- **Focus factor 0.7** → **3.5 ideal days per person per week** (meetings, reviews, support). Kanban: work is pulled continuously; weeks are the planning unit.
- **Contingency 20%** for unknowns.
- Antigravity agent assistance is treated as **upside, not assumed**. No productivity multiplier is applied.

| Capability | BE | FE |
|---|--:|--:|
| Foundation: repo, CI, Postgres, Vercel, Agere DS integration, auth spike | 4 | 3 |
| PRD-00b events, audit writer, sweeper, reconciliation, ops page | 6 | 1 |
| PRD-01 identity (incl. QA ON3/ON4: +1 BE) | 9 | 5 |
| PRD-02 organization | 5 | 5 |
| PRD-03 people & teams | 7 | 6 |
| PRD-04 access (authz module, ACL, share dialog, denied states; QA AD1/AD2: BE +1, FE +1) | 9 | 6 |
| PRD-06 Project (incl. Ringkasan: BE +1, FE +2; project space + sidebar tree + picker: FE +2) | 9 | 16 |
| PRD-10 notifications | 4 | 3 |
| PRD-11 audit viewer | 2 | 3 |
| PRD-12 personal settings | 2 | 4 |
| PRD-13 lifecycle & privacy | 5 | 2 |
| UI-01 v1.5 global rules: dirty guard, all-errors validation, focus return, state rule, mobile table cards, titles/skip link | 0 | 2 |
| Hardening: a11y, performance, security review, pilot fixes | 5 | 5 |
| **Total** | **67** | **61** |

Removing Lead CRM changes no row: none of this release 1 work was Lead-specific.

### 4.2 Calculation

1. Total effort = 67 + 61 = **128 ideal days**; with 20% contingency = 128 × 1.2 = **153.6 ideal days**.
2. Unbalanced, BE is the bottleneck: 67 × 1.2 ÷ 3.5 = **22.97 weeks**, versus FE at 61 × 1.2 ÷ 3.5 = 20.91 weeks.
3. **Rebalance: move 3 BE days to FE** (v1.1 moved 5; personal-settings endpoints now stay with BE because FE also absorbs the UI-01 global rules). FE owns the audit-viewer queries (2) and the inbox polling endpoint (1). This gives BE 64 and FE 64.
4. Balanced: 64 × 1.2 ÷ 3.5 = **21.94 weeks** for both roles → **22 weeks** (W1–W22), milestones unchanged (M1 end W10, M2 end W16, M3 end W22). Slack drops from ~1.1 weeks to **~0.06 week** (≈ 0.2 ideal day per person).
5. **Decision D6 (needed before W1):** with no slack, Should #1 (comments) no longer fits by default. Options: **A** — keep full release 1 and pull Should items only if measured velocity after W8 is > 1.0 (PRD-14 §14 formula); **B** — pre-approve the §4.4 cut "Audit viewer → release 1.1" (frees BE 2 / FE 3: BE 65, FE 58; rebalance 3 days via inbox endpoint + personal-settings endpoints → BE 62, FE 61; 62 × 1.2 ÷ 3.5 = 21.26 weeks → slack ≈ 0.74 week) so comments fit. **Recommendation: B**, because comments feed gate G-Chat (b) and the audit writes stay in release 1.

6. **Space container (D18):** Option A (release 1 unchanged otherwise): BE 64 + 4 = 68, FE 64 + 5 = 69; FE is the bottleneck: 69 × 1.2 ÷ 3.5 = **23.66 → 24 weeks** (+2), slack ≈ 0.34 week. Under the proposed pivot Option B (review doc, D8): BE 80 + 4 = 84, FE 80 + 5 = 85; 85 × 1.2 ÷ 3.5 = **29.14 → 30 weeks** (+2), slack ≈ 0.86 week.

7. **Prototype v13 decisions (27 Sep 2026, D19–D26), on top of step 6 Option A (BE 68, FE 69):**

   | Change | Decision | BE | FE |
   |---|---|--:|--:|
   | Navigasi ganda: rail + contextual panel, hover-peek, Alt shortcuts (replaces the sidebar tree) | D19 | 0 | +2 |
   | Desk: Kotak masuk tabs, day groups, archive; Desk panel Fokus hari ini / SLA perlu perhatian | D20 | +1 | +1 |
   | Org-level Ringkasan removed (KPI cards, donut, table) | D21 | −1 | −2 |
   | Space edit + uploaded icon + Semua proyek with space tabs and chips | D23 | +1 | +2 |
   | ClickUp list pattern (groups, inline rename, quick-set fields, bulk bar) for Daftar, Tugas saya | D25 | +1 | +3 |
   | Bagikan ClickUp-style (private link, organization switch; public link excluded) | PRD-04 v1.5 | 0 | +1 |
   | Panduan: Cara pakai + Alur kerja + progress | D24, PRD-18 | +0.5 | +2 |
   | Brand black + agere logo; DS Select, ButtonGroup, Tabs underline, ScrollArea | D24 | 0 | 0 (DS components) |
   | **Net** | | **+2.5** | **+9** |

   1. New totals: BE 68 + 2.5 = **70.5**; FE 69 + 9 = **78**. Unbalanced, FE is the bottleneck: 78 × 1.2 ÷ 3.5 = 26.74 → 27 weeks.
   2. **Rebalance 3.75 ideal days FE → BE** as full-stack slices BE can own end to end: Space edit + icon upload (1.5), Kotak masuk tabs + archive (1.0), Panduan progress + selector tests (1.0), Semua proyek space tabs (0.25). Result: BE 74.25, FE 74.25.
   3. 74.25 × 1.2 ÷ 3.5 = **25.46 → 26 weeks** (W1–W26), slack = 26 − 25.46 = **0.54 week** (≈ 1.9 ideal days per person). **+2 weeks** versus step 6.
   4. Milestones: M1 end **W10** (unchanged), M2 end **W18** (+2), M3 end **W26** (+4 vs v1.2.4's W22, +2 vs step 6).
   5. **Leaner alternative** (if the date must hold closer to 24 weeks): Panduan and the list bulk bar/inline rename → release 1.1 (BE −1, FE −3.5): BE 69.5, FE 74.5 → balanced 72 / 72 → 72 × 1.2 ÷ 3.5 = 24.69 → **25 weeks**, slack 0.31 week. **Not recommended:** Panduan and the list pattern target time-to-first-task and organization activation, the release thesis metrics (§2).
   6. Under pivot Option B (D8): BE 84 + 2.5 = 86.5, FE 85 + 9 = 94 → balanced 90.25 / 90.25 → 90.25 × 1.2 ÷ 3.5 = 30.94 → **31 weeks**, slack 0.06 week; B would need the leaner cut above.
   7. **Recommendation:** accept 26 weeks with the full set; keep D6 (audit viewer → release 1.1) as the first cut if throughput after W8 is below plan.

8. **Prototype v17.1 decisions (28 Sep 2026, D28a–D43), on top of step 7 (BE 74.25, FE 74.25).** *(Plan length superseded by step 9; the scope rows stay valid.)* Only release 1 items count; items of later releases are estimated in their PRDs.

   | Change (release 1) | Decision | BE | FE |
   |---|---|--:|--:|
   | Onboarding step *Titik mulai*: three presets seed the first space and projects (TECH-01 F14) | D30, PRD-02 v1.2 | +1 | +1 |
   | Page header on `PageHeaderActions` (DS 6.4): ≤ 2 outline, 1 default, ⋯, overflow below 768 px, empty state owns the primary | D32 | 0 | +0.5 |
   | Task detail layout v2 (no duplicate status chip, *Dibuat* property, footer state, composer label) | D41 | 0 | +0.5 |
   | Daftar: drag to reorder and drop on a group to change status, with row-menu parity (Naikkan/Turunkan) and Urungkan; reuses the F4 move endpoint and `order_key` (TECH-01 F11) | PRD-06 v2.1 §6.10 | 0 | +2 |
   | 404 page (empty state + Cari + Kembali ke Desk) | UI-01 v2.4 | 0 | +0.25 |
   | No placeholder text (D33), status text on `*-on-surface` (D37), toasts bottom-left, counts from top-level tasks on the current board | D33, D37, UI-01 v2.4 | 0 | 0 (copy, tokens, query rule) |
   | **Net** | | **+1** | **+4.25** |

   1. New totals: BE 75.25, FE 78.5 (sum 153.75). Unbalanced, FE is the bottleneck: 78.5 × 1.2 ÷ 3.5 = 26.91 → 27 weeks.
   2. **Rebalance 1.625 ideal days FE → BE** as end-to-end slices: *Titik mulai* step UI + success screen (0.75), drag-and-drop persistence tests and optimistic rollback (0.875). Result: BE 76.875, FE 76.875.
   3. **Option A (recommended):** 76.875 × 1.2 ÷ 3.5 = **26.36 → 27 weeks** (W1–W27), slack **0.64 week** (≈ 2.25 ideal days per person). If D34 (remove the top-bar bell, FE −0.5) is accepted: 26.27 → still 27 weeks, slack 0.73 week.
   4. **Option B (hold 26 weeks):** drag and drop in Daftar → release 1.1 (FE −2) **and** accept D34 (FE −0.5): sum 151.25 → 75.625 × 1.2 ÷ 3.5 = **25.93 → 26 weeks**, slack **0.07 week** (≈ 0.25 ideal day per person). Without D34, Option B is 26.01 → 27 weeks, so D34 is a precondition of B.
   5. **Comparison:**

      | | Option A — 27 weeks | Option B — 26 weeks |
      |---|---|---|
      | Scope | Full release 1 incl. drag and drop in Daftar | Reorder only through Tugas modal/board; list drag and drop in 1.1 |
      | Slack | 0.64 week | 0.07 week — any slip moves M3 |
      | Risk | Pilot starts one week later | No buffer for the W1–W2 auth spike (D3) or DS adoption surprises |
      | **Recommendation** | **Choose A**: 0.07 week of slack is not a plan. | Only if the M3 date is contractual |
   6. Milestones under A: M1 end **W10** and M2 end **W18** unchanged; **M3 end W27** (+1). The extra week sits in the last phase, where the list work and header adoption land [Hypothesis: confirm when the W8 throughput is known]. Release 2 dates shift by one week (Chat W28–W39, PRD-14) — superseded by step 9.
   7. D6 (audit viewer → release 1.1) stays the first cut if throughput after W8 is below plan.

9. **Two languages, English default (D45, 28 Sep 2026), on top of step 8 (BE 75.25, FE 78.5 before rebalancing).** i18n must land in release 1: retrofitting string keys after release is more expensive than building them in.

   | Change (release 1) | BE | FE |
   |---|--:|--:|
   | i18n foundation: message catalogs `en` / `id`, ICU plurals, `<html lang>`, lint that rejects hard-coded UI strings | 0.5 | 2 |
   | Locale model: `users.locale`, `organizations.default_locale`, server-side resolution (user → organization → `en`), onboarding field, Preferensi field | 1 | 0.5 |
   | Key every release-1 string (≈ 36 routes, dialogs, empty/error states) [H] | 0 | 3 |
   | Locale-aware dates, times, numbers, IDR, relative time | 0 | 1 |
   | Notifications and emails rendered in the recipient's language | 1 | 0 |
   | Pseudo-localization / text-expansion QA pass | 0 | 0.5 |
   | **Net** | **+2.5** | **+7** |

   English and Indonesian copy is written by a UX writer, outside developer capacity (≈ 6 working days for release 1 [H]); the Indonesian microcopy already in the PRDs becomes the `id` catalog, English becomes the default and source catalog.

   1. New totals: BE 77.75, FE 85.5 (sum 163.25). Rebalance **3.875 FE → BE** as full-stack slices: keying server-rendered strings and API error messages (2), formatting helpers + tests (1), locale fields in onboarding and Preferensi (0.875) → 81.625 each.
   2. **Option A (recommended), 29 weeks:** 81.625 × 1.2 ÷ 3.5 = 27.99 → 28 weeks with **0.01 week** of slack, which is not a plan; plan **29 weeks** (slack **1.01 weeks**). Milestones [Hypothesis]: M1 end **W11** (the i18n foundation and locale model land before feature strings are written), M2 end **W19**, M3 end **W29**.
   3. **Option B, 28 weeks:** list drag-and-drop → release 1.1 (FE −2): 161.25 → 80.625 × 1.2 ÷ 3.5 = 27.64 → **28 weeks**, slack **0.36 week** (0.44 with D34). M1 W11, M2 W19, M3 W28.
   4. **Comparison:**

      | | Option A — 29 weeks | Option B — 28 weeks |
      |---|---|---|
      | Scope | Full release 1 incl. list drag-and-drop, two languages | Two languages; list drag-and-drop and its row-menu reorder move to 1.1 |
      | Slack | 1.01 weeks | 0.36 week |
      | **Recommendation** | **Choose A**: the only option with a real buffer | Only if the M3 date is contractual |
   5. The 26-week Option B of step 8 no longer exists. Release 2 dates shift by two weeks under A (Chat W30–W41, PRD-14).

*(v1.1: 65 + 56 = 121 × 1.2 = 145.2; balanced 60/61 → 20.91 weeks. v1.0: 64 + 54 = 118 × 1.2 = 141.6; balanced 59/59 → 20.23 weeks.)*

### 4.3 Timeline by week and phase (Kanban)

Weeks are relative: **W0** = preparation before kick-off, **W1** = kick-off week. Calendar dates are set when the kick-off date is decided (decision D7). Public holidays are not deducted from capacity; once dates are known, mark holiday weeks (e.g. Christmas–New Year, Idulfitri) as buffer.

*(v1.2.9: the table below is the 29-week Option A plan; the 26-week table of v1.2.6 is void. Detail per week and per role: PLAN-01 §7.)*

| Phase | Weeks | BE focus | FE focus | Exit / milestone |
|---|---|---|---|---|
| 0 · Persiapan | W0 | Decisions (Option A/B, D34–D38, D43, D7); repo with all PLAN-01 §6 gates | Kanban backlog with AC; UX writer starts the `en` catalog (C-31) | Decisions recorded; CI green |
| 1 · Fondasi platform | W1–W7 | Auth spike (W1); identity (W3–W4); organizations, onboarding in three steps + Titik mulai (W5–W6); outbox + audit + sweeper (W6–W7) | i18n foundation + locale model (W1–W2); navigasi ganda shell, DS primitives, global UI rules (W2–W4); auth, onboarding, settings (W5–W7) | Sign in, create org, invite — in EN and ID |
| 2 · Akses & orang | W8–W11 | Authz space → project, ACL, role matrix (W8–W9); invitations, members, teams, revoke (W10–W11) | Apps, Access, Bagikan + Akses lanjutan, denied states; Members, invitations, Teams | **M1 — internal dogfood (end of W11)** |
| 3 · Space + Desk | W12–W19 | Work Ownership, spaces, projects, boards, columns (W12–W14); tasks, ordering + list drag-and-drop, My tasks, events (W15–W17); notifications + emails in the recipient's language, Panduan (W18–W19) | All projects, space page, List/Board/Overview, task detail v2 (W12–W17); Desk, Inbox, Panduan EN/ID (W18–W19) | **M2 — closed pilot (end of W19)** |
| 4 · Siklus data & pengerasan | W20–W26 | Trash/purge, account and organization deletion, ownership transfer (W20–W22); security, performance, reconciliation (W23–W26) | Trash, Settings, danger zone (W20–W22); audit viewer (or release 1.1, D6); pseudo-localization + final EN/ID copy; accessibility pass (W23–W26) | All automated gates green |
| 5 · Go/no-go | W27–W29 | Pilot fixes, restore test, runbooks | Pilot fixes, copy and Panduan review in both languages | **M3 — go/no-go (end of W29)**; gate G-Chat evaluated |
| 6 · Rilis 2: Chat (conditional) | W30–W41 | PRD-14 v1.4.1 §12 (+3 weeks) | PRD-14 v1.4.1 §12 (+3 weeks) | Dogfood done end of W41 |

**Kanban policies (binding for planning):** columns Backlog → Siap (max 6) → Dikerjakan (max 2 per person: one locked-lane item + one free-lane item) → Review (max 2) → Preview QA (max 3) → Selesai. Definition of Ready: Gherkin AC, lane marked, fakes available, slice ≤ 1 ideal day. Definition of Done: CI 4 gates green, preview checked by PO, merged behind a flag if unreleased. Classes of service: Darurat (tenancy/security/data loss; may exceed WIP, max 1), Tanggal tetap (milestone and G7 items), Standar, Tak terikat (≤ 20% of weekly throughput). Cadence: daily 10-minute board walk (right to left), Monday replenishment, Friday demo + metrics (throughput, cycle time p85, items older than 5 working days), phase-exit review. From W4, dates are forecast from measured throughput, not from the initial estimate.

### 4.4 If the date must come earlier

A leaner cut:

- Audit viewer → release 1.1 (writes stay).
- Organization self-deletion → handled by a support request.
- Per-project Ringkasan tab (project overview) → release 1.1 (the project space then opens on Papan and Daftar only).

This saves BE 4 / FE 6 days. It only moves the date by about two weeks, because the platform foundation (PRD-00b, 01–04) is fixed cost. **Recommendation (v1.2):** apply only the first cut — audit viewer → release 1.1 — to restore slack (decision D6, §4.2 step 5); keep the rest of release 1 and open the closed pilot at M2.

## 5. Dependencies & sequencing rules

- **Nothing organization-scoped ships before the PRD-04 authz module (W7–W8).** Every later module calls it from its first commit.
- **`events.publish()` exists before the first mutation that needs audit (W5–W6).**
- Work Ownership (W11–W12) must be in place before any member can be removed in the pilot. M1 dogfood runs without removals.
- Legal documents (G7) are drafted in parallel from W9–W10 and finalized before M2.

## 6. Go/no-go gates (all must pass for M3; G1–G4 and G7 also for M2)

| Gate | Criterion | Evidence |
|---|---|---|
| G1 Acceptance | Every Must user story's Given-When-Then AC is an automated test, and all pass in CI | CI report |
| G2 Tenancy & access | Automated matrix: role × action × resource × organization, including cross-org 404, suspended user, removed user, disabled app; 100% pass | Test report |
| G3 Security | Authentication checklist (PRD-01 §11) reviewed; no critical/high dependency or secret-scan findings; platform-admin MFA enforced | Review notes |
| G4 Data integrity | Reconciliation job running with 0 gaps for 7 consecutive days on staging/pilot; dead-delivery alert tested | Dashboard |
| G5 Performance | PRD budgets met on staging seeded with a 500-member organization and a 5,000-task project | Load-test report |
| G6 Accessibility | Automated axe: 0 critical/serious on the 10 key flows; manual keyboard + screen-reader pass | Checklist |
| G7 Legal & privacy | Terms of Service, Privacy Policy and pilot agreement reviewed by counsel; consent capture live; rights-request and breach runbooks written (PRD-13) | Signed-off docs |
| G8 Operations | Backup restore tested; error tracking and uptime monitor on; incident runbook; BE on-call for pilot hours | Runbook |
| G9 Measurement | WACO, activation and retention computed from production data in a saved query | Query link |
| G10 Content | All UI copy is Bahasa Indonesia ("Anda"), sentence case, reviewed against Agere DS content rules | Copy review |

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Bus factor: 1 BE owns identity, access and events | High | High | ADRs in the repository; FE reviews every BE PR; runbooks by M2 |
| Auth spike picks a library that cannot meet a Must | Medium | High | W1–W2 spike with an explicit Must checklist; fallback to the managed provider (PRD-01 Option B) |
| Project is not compelling versus free tools | Medium | High | Recruit design partners who need the org and access layer (multi-team or agency); weekly pilot interviews |
| Design partners expect sales tracking after Lead removal | Medium | Low | Say so during recruitment; they can run a sales list as a generic Project; no sales template is provided (D16) |
| Holidays fall inside a phase (e.g. Christmas–New Year, Idulfitri) | High | Medium | When the kick-off date is set, mark holiday weeks as buffer and move milestone dates, not scope |
| Vercel Pro and Postgres costs exceed budget | Low | Medium | Pilot scale is small; confirm plan before W1 (PRD-00b Q1) |
| Data residency or cross-border concerns from a pilot customer | Medium | Medium | Legal review in PRD-13; Singapore region documented in the Privacy Policy |

## 8. Decisions needed before W1

| # | Decision | Recommended | Owner |
|---|---|---|---|
| D1 | Vercel Pro plan approved | Yes | Budget owner |
| D2 | Postgres provider via Vercel Marketplace | Pick in W1–W2 against: Singapore region, point-in-time restore, branching for previews | BE |
| D3 | Auth approach | Library on own Postgres, decided by the W1–W2 spike | BE + PO |
| D4 | Design partners recruited (5–10 orgs) | Start outreach now; needed by M2 (end of W18) | PO |
| D5 | Legal counsel engaged for Terms, Privacy Policy and DPA | Engage by W9–W10 | PO |
| D7 | Kick-off date (W1), which converts all Wn to calendar dates | Decide after D1–D6; plan holiday buffer weeks then | PO + engineering |
| D6 | How to restore slack after the QA v10 amendments (§4.2 step 5) | Option B: audit viewer → release 1.1 | PO + engineering |
| D13 | Slack integration | **Decided 26 Sep 2026: removed.** New-request broadcast uses the in-app inbox + email to the team lead (release 1), project channels (PRD-14, release 2) and an optional generic outgoing webhook (release 2) | PO |
| D14 | Product name | **Decided 26 Sep 2026: agere/org.** "NexusOps" (Master PRD v3.0) is not used; its AI layer becomes an agere/org module (PRD-17, proposed) | PO |
| D15 | Calendar (PRD-09) after Lead removal | **Decided 27 Sep 2026: Kalender is a project view** (release 2); PRD-09 stays the Schedulable read contract | PO + FE |
| D17 | Work app display name | ⛔ Superseded by D18 on 27 Sep 2026 | PO |
| D18 | Hierarchy | **Decided 27 Sep 2026: Space is a container above projects** (ClickUp pattern). Views per project: Daftar, Papan (R1); Kalender, Timeline, Channel (R2); Doc (R3). Release 1 +2 weeks (§4.2 step 6) | PO |
| D19 | Navigation | **Decided 27 Sep 2026: navigasi ganda** — rail (icon + label) + contextual panel per section; Ctrl+B collapses the panel, the rail stays; UI-01 v2.0–v2.2 | PO |
| D20 | Daily entry point | **Decided 27 Sep 2026: Desk** (Kotak masuk · Permintaan · Tugas saya) is the first rail item and the landing screen after sign-in | PO |
| D21 | Org-level Ringkasan | **Decided 27 Sep 2026: removed.** Space home = Semua proyek; per-project Ringkasan stays | PO |
| D22 | File module | **Decided 27 Sep 2026: on hold** (PRD-07 v1.0.3) | PO |
| D23 | Space editing | **Decided 27 Sep 2026:** name, icon (built-in or **uploaded**), description, access; delete only when empty | PO |
| D24 | Brand & guidance | **Decided 27 Sep 2026:** brand **black** (orange from the same day reverted), official **agere logo** in the rail and favicon; **Panduan** in-app (PRD-18) in release 1 | PO |
| D25 | List pattern | **Decided 27 Sep 2026: ClickUp list pattern** is the single pattern for Daftar, Tugas saya, Permintaan and Semua Doc (PRD-06 §6.10) | PO |
| D26 | Doc structure | **Decided 27 Sep 2026: folders** with move and drag; Semua Doc page (PRD-08 v1.0.3, release 3) | PO |
| D27 | Public read-only link ("Bagikan tautan ke siapa saja") | **Open.** Recommended: stay Won't in release 1 (PRD-04 §5), re-evaluate with guests in release 2 | PO + Legal |
| D28 | Subtasks and labels | ⛔ Split on 28 Sep 2026 into D28a and D28b | PO |
| D28a | Subtasks | **Decided 28 Sep 2026: designed** — one level, inline add from a list row, drag to nest, row-menu parity (PRD-06 v2.1 §6.12). Release = D38 | PO |
| D28b | Labels | **Open.** Recommended: release 2 | PO |
| D29 | Agen & Skill (PRD-17) | **Proposed:** release 3, manual `/perintah` first, every write is a proposal | PO |
| D30 | Onboarding steps | **Decided 28 Sep 2026: three steps** — Organisasi → Titik mulai → Undang tim (skippable); land on Desk with the Selamat datang card (PRD-02 v1.2) | PO |
| D31 | Otomatisasi | **Decided 28 Sep 2026: merged into Agen › Pemicu** — a trigger starts a skill, the result is always a proposal; no separate module or Kelola menu (PRD-17 v0.2, Index C-25) | PO |
| D32 | Actions & CTA | **Decided 28 Sep 2026:** one labelled primary per view; ≤ 2 outline in a page header; ⋯ last; one action, one place; outline moves into ⋯ below 768 px; primary and second actions never icon-only; general verbs (Impor, Ekspor) (UI-01 v2.4) | PO |
| D33 | Placeholder text | **Decided 28 Sep 2026: none in authoring fields**; search fields only; formats in helper text | PO |
| D34 | Top-bar bell | **Proposed:** remove; the rail Desk badge is the single unread signal (PRD-10 v1.4). Recommended: accept (FE −0.5; precondition of §4.2 step 8 Option B) | PO |
| D35 | Page title scale | **Proposed:** 24/32 (`type-heading-xl`, Agere DS 6.4) instead of UI-01 v2.1's 26/34, which has no DS token. UI-01 v2.4 uses 24/32 until the PO decides otherwise | PO + design |
| D36 | Desk badge content | **Proposed with PRD-15:** unread notifications + requests past SLA the user can act on (PRD-10 v1.4) | PO |
| D37 | Status text colour | **Decided 28 Sep 2026 (Agere DS 6.4):** `*-on-surface` tokens on neutral surfaces | Design system |
| D38 | Subtasks release | **Open.** Recommended: **release 2** (not in step 8; estimate BE 3, FE 4, PRD-06 v2.1 §6.12 [H]) | PO |
| D39 | Doc editor model | **Decided 28 Sep 2026: always editable, autosaved, no placeholder, no Edit mode** (PRD-08 v1.1, release 3) | PO |
| D40 | Import | **Decided 28 Sep 2026:** label **Impor**; Doc `.md`/`.markdown`/`.txt` ≤ 1 MB; Timeline `.md` table or `.csv` ≤ 512 KB; one date grammar (UI-01 v2.4) | PO |
| D41 | Task detail layout v2 | **Decided 28 Sep 2026** (PRD-06 v2.1 §8.1, UI-01 v2.4) | PO |
| D42 | Prototype as reference | **Decided 28 Sep 2026:** prototype v17.1 shows every planned release ("full version"); release labels are off by default and can be switched on in the prototype dock. It defines behaviour and design, **not** scope or release | PO |
| D43 | Surfaces added in the prototype without a PRD | **Open.** Langganan (billing): out of scope until a billing PRD exists · *Titik mulai* presets in Proyek baru: Could, release 2 (C-24) · full search results page: Should, release 1 if capacity remains · keyboard shortcuts dialog: Should (§3.2 #10) | PO |
| D44 | AI Agent model | **Decided 28 Sep 2026: Option B** — PRD-17 v1.0 adopts the agent model (Agent → Skill → Tool; plain-language creation with a Blueprint; permission matrix; approvals; evidence policy; AI Gateway, tiers, metering) and keeps v0.2 triggers T1–T6. Organization-defined custom skills → P2. Agents never become task assignees. Supersedes the skill-centric scope of D29 (placement stays release 3) | PO |
| D45 | Languages | **Decided 28 Sep 2026:** release 1 ships **English (default) and Bahasa Indonesia**. Resolution: user preference → organization default (set in onboarding step 1 and Kelola › Umum, default English) → English. Signed-out pages start in English with a language switcher; public forms and tracking pages use the organization default. User content is never translated. Capacity: §4.2 step 9 | PO |
| D46 | Space landing and project card | **Decided 29 Sep 2026 (PO):** no "Semua proyek" page — Space opens the last visited space (first space the first time; empty state when none); discovery through the panel tree, Favorit and ⌘K. Project card = tile, name, 2-line description, exception chips only (Berisiko, Keluar jalur, Selesai, Terbatas). PRD-06 v2.1.2, UI-01 v2.7 | PO |
| D47 | Project Doc tab | **Decided 29 Sep 2026 (PO), revised the same day:** clean list (no table); choosing a doc opens a **slide-out modal** from the right with previous/next, Edit, Bagikan and Close (the side panel of v1.1.2 is withdrawn). PRD-08 v1.1.3, UI-01 v2.9 | PO |
| D48 | Chat collaboration | **Decided 29 Sep 2026 (PO):** invite to channels (project channel → Bagikan proyek), attachments (image, video, file, link with thumbnail), 6 fixed reactions, copy text/link, DM from name/menu/member list, edit own and delete own or moderate. D22 partially lifted for Chat attachments. PRD-14 v1.5, PRD-07 v1.0.4, TECH-01 v1.5, UI-01 v2.10 | PO |
| D48a | Release 2 timing for D48 | **Open.** Option A: all of D48 in release 2 (≈ +2 weeks, dogfood W43). **Option B (recommended):** invite, reactions, copy, DM, edit/delete, image and file attachments in release 2 (≈ +1 week); video and server-side link previews (SSRF-guarded unfurl) in 2.1. PRD-14 v1.5 | PO |
| D16 | Lead CRM and derivatives | **Decided 26 Sep 2026: removed from the roadmap** (§3.4, Index C-16) | PO |

D8–D12 are proposals in the doc "Review Master PRD v2.0 & diferensiasi Agere vs ClickUp" (pivot option, PRD v2.0/v3.0 status, approvals boundary, holiday data, WhatsApp concierge test) and are added here once accepted.

## 9. Release 2 candidates and gate G-Chat

- **Candidates** (ordered with WSJF after M3): PRD-14 Team Chat incl. project channels and member panel (12 weeks, W27–W38), Kalender and Timeline views (D15, `.md` import), per-project Ringkasan trend chart, Space release 2 items ("+ Tampilan", checklist, labels (D28), milestones, workload; PRD-06 §5), English UI. PRD-07 File is on hold (D22).
- **Gate G-Chat** is evaluated in the M3 meeting (end of W26) (PRD-14 §2): at least 2 of (a) median ≥ 3 "Salin tautan tugas" per WACO org per week, (b) ≥ 40% of WACO orgs comment on tasks weekly, (c) ≥ 3 pilot orgs name chat among their top-3 reasons to use other tools.
- **Pilot interview questions added from M2** (weekly, 0 engineering cost): "Di mana tim Anda membahas tugas minggu ini?", "Kapan terakhir keputusan di grup WhatsApp tidak masuk ke agere/org?", "Apa yang masih membuat tim Anda kembali ke WhatsApp?"
- **Telemetry for gate (a):** event "Salin tautan tugas" in the task modal (< 0.5 FE day, inside the PRD-06 row).
