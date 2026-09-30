# PRD-10 — Notifications (Desk › Kotak masuk)

| Field | Value |
|---|---|
| Version | 1.4.1 (supersedes 1.4) |
| Status | Draft — release 1 (in-app + account-critical email) |
| Owner | [TBD — Product Owner agere/org] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE (PRD-00) |
| Depends on | PRD-00b (delivery, catalog), PRD-04 (read-time `checkBatch`), PRD-01 (email adapter), PRD-12 (timezone) |
| Resolves review items | Per-PRD gaps for 10 (policy, deduplication, mark all read, realtime, retention); C-08 |

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

### Change log v1.4 → v1.4.1 (28 Sep 2026 — agents, PRD-17 v1.0; languages, D45)

- **Agent actions:** one Kotak masuk item per agent run for the approver (`agent.action.created`), with **Setujui** / **Tolak** inline; it counts as one unread notification (no separate counter, QA-02 A-02). Expired actions update the item to "Usulan ini kedaluwarsa" without a new notification. No email by default.
- **AI usage thresholds** (`agent.usage.threshold_reached` at 80 % and 100 %) notify the Owner in Kotak masuk and by email (account-critical class, not switchable).
- **Languages (D45):** every notification and email is rendered in the **recipient's** language (user preference → organization default → English) at send time, not in the actor's language. Names and user content inside the message are not translated.

### Change log v1.3 → v1.4 (28 Sep 2026 — prototype v17.1, Agere DS 6.4)

- **Top-bar bell (D34, proposed):** prototype v14–v17.1 has **no bell**; the rail **Desk** badge is the single unread signal and opens Desk › Kotak masuk. The v1.3 text "unread badge on the rail and the bell" (§4) and the bell `Popover`/`Sheet` (§7) apply **only if D34 is rejected**. Reason: three counters for one inbox (bell dot, Desk badge, Kotak masuk count) were the audit's top "unclear counts" finding (QA-02 A-02). If accepted: FE −0.5 ideal day (PRD-00 v1.2.7 §4.2 step 8).
- **Desk badge content (D36, proposed with PRD-15):** badge = unread notifications **+** requests past SLA the user can act on — the assignee, members of the target team, and Owner/Admin (a requester does not count their own late request; they see its status in *Permintaan saya*); the badge's accessible name spells out both numbers ("Desk, 3 notifikasi belum dibaca, 1 permintaan lewat SLA"), and its tooltip repeats them. Without PRD-15 the badge is unread notifications only.
- **Agent proposals (PRD-17, release 3):** a proposal from a trigger arrives in the recipient's Kotak masuk as a normal item with **Terima** / **Tolak**; accepting applies the change with the recipient as actor (PRD-17 T2).
- **Email preferences per type (release 2, Should; resolves the release-2 part of C-08):** Pengaturan › Preferensi › *Notifikasi email* lists five switches — *Ringkasan harian* (on), *Saya ditugaskan* (on), *Saya disebut* (on), *Permintaan mendekati SLA* (off; with PRD-15), *Usulan agen menunggu keputusan* (off; with PRD-17). Account-critical email (security, ownership, deletion) is not switchable. Release 1 keeps the rule table without preferences (C-08).
- **Toasts** follow UI-01 v2.4: bottom-left, above any SaveBar, max 3 visible (DS 6.4 `Toaster position="bottom-left"`), so they never cover Save buttons or dialog footers (QA-02 B-12).
- Status text in Kotak masuk rows (e.g. *Lewat SLA*) uses DS 6.4 `*-on-surface` tokens (D37).

**Acceptance criteria (additions):**

```gherkin
Given D34 is accepted and I have 3 unread notifications and 1 request past SLA
Then no bell is rendered in the top bar
And the rail Desk item shows "4" with the accessible name "Desk, 3 notifikasi belum dibaca, 1 permintaan lewat SLA"
When I open Desk › Kotak masuk and choose "Tandai semua dibaca"
Then the Desk badge shows "1" and its accessible name says "0 notifikasi belum dibaca, 1 permintaan lewat SLA"
Given release 2 and "Saya disebut" is off in Notifikasi email
When Yoga mentions me in a task comment
Then I get the Kotak masuk item and no email
```

### Change log v1.2 → v1.3 (27 Sep 2026 — Desk, Kotak masuk redesign)

- The inbox is **Desk › Kotak masuk** (D20): Desk is the first rail item and the landing screen after sign-in. Route `/{slug}/desk/kotak-masuk` (old `/{slug}/notifikasi` redirects). Kotak masuk holds **notifications only**; requests from forms live in Desk › Permintaan (PRD-15, proposed).
- **Tabs** Semua · Belum dibaca · **Untuk saya** (assigned or mentioned), with counts; **day groups** Hari ini · Kemarin · Sebelumnya.
- Row: unread dot · actor avatar (or system icon) · sentence · type label · time; hover actions **Tandai dibaca** and **Arsipkan** (new). Empty: "Semua beres".
- New column `archived_at`; archived items leave every tab and the unread count and are purged with the 90-day rule.
- The Desk panel shows **Fokus hari ini** (my tasks due today/tomorrow, max 4) and **SLA perlu perhatian** (max 3) from existing queries; the rail Desk badge = unread notifications + requests past SLA.
- Lead rows in §5 are removed (C-16). New inactive rows: Agen proposals (PRD-17, release 3).
- Capacity: BE +1 (archive, filters), FE +1 (PRD-00 v1.2.6 §4.2 step 7).

### Change log v1.1 → v1.2 (26 Sep 2026)

- New rules for later releases, inactive until their module ships: chat mention and DM badge (PRD-14, release 2 candidate); deal changed by someone else (PRD-05 A3, QA CH1); linked doc to-do (PRD-08 D2).
- Release 1 addition: project status change notifies the project owner when set by someone else (PRD-06 §6.8, Should).
- Preferences for work email and "my deal/task was changed" stay release 2 (QA SE3).

### Change log v1.0 → v1.1

- Added the **notification rule table** (the "notification policy" v1.0 referenced).
- Split channels: in-app inbox for work events; **email only for account-critical events**.
- Bulk operations produce one summary.
- Delivery is polling, not realtime; inbox retention is 90 days.
- Per-type preferences are deferred to release 2.

---

## 1. Problem

Assignments and access changes happen while people are elsewhere. Without a reliable, low-noise inbox, work gets missed and members stop trusting the product. A noisy inbox gets ignored just as fast.

## 2. Goal

Tell each person, once, about things that need their action or change what they can do. Nothing else.

> Principle (v1.0, kept): notifications surface action; they are not a second activity feed.

## 3. Success metrics

| Metric | Target | Window | Type |
|---|---|---|---|
| Deep-link completion (opened notification → target page loaded) | ≥ 95% [H] | Weekly | Primary |
| Notification read rate within 72 h | ≥ 60% [H] | Weekly | Primary |
| Duplicate notifications for one event | **0** | Continuous | Guardrail (PRD-00b D5) |
| Notifications shown for items the user cannot view | **0** | Continuous | Guardrail |
| Median assignment → notification visible | ≤ 60 s (polling interval) [H] | Weekly | Secondary |

## 4. Scope

**Must (release 1):**

- In-app inbox per organization (**Desk › Kotak masuk**), with unread badge on the rail and the bell.
- Open (marks read), "Tandai dibaca", "Tandai semua dibaca", **"Arsipkan"**.
- Tabs **Semua · Belum dibaca · Untuk saya** and day groups (§7).
- Deep links; source module, time and type on each item.
- The §5 rule table.
- Bulk summaries.
- Account-critical email.
- Read-time authorization.
- 90-day retention.

**Should:** daily "Jatuh tempo hari ini" digest at 08.00 in the user's timezone (in-app).

**Release 2:** per-type preferences (PRD-12), email for work events, realtime push, browser/mobile push, reminders for due times.

**Won't:** SMS, WhatsApp delivery, activity feed.

## 5. Rule table (release 1)

The actor never gets a notification about their own action. Every in-app item is scoped to the event's organization.

| Event (PRD-00b) | Recipients | Channel | Copy (id-ID) |
|---|---|---|---|
| `space.task.assigned` (user) | Assignee | In-app | "**Rina** menugaskan **Riset harga** kepada Anda · Q4 Launch" |
| `space.task.assigned` (team) | Team members who can view the project | In-app | "**Rina** menugaskan **Riset harga** kepada **Tim Sales**" |
| `space.comment.created` with mention (Should) | Mentioned users who can view | In-app | "**Rina** menyebut Anda di **Riset harga**" |
| `membership.work.reassigned` | Each target | In-app | "**12 tugas** dari Budi Santoso dialihkan kepada Anda" |
| `membership.member.activated` | Owners and Admins | In-app | "**Dewi** bergabung ke Maju Jaya" |
| `membership.member.suspended` / `.reactivated` / `.removed` | Affected user | **Email** (they may no longer see the inbox) | "Akses Anda ke Maju Jaya ditangguhkan" / "diaktifkan kembali" / "telah berakhir" |
| `access.role.changed` | Affected user | In-app | "Peran Anda di Maju Jaya kini **Admin**" |
| `access.app_grant.created` / `.revoked` | Affected user, or team members | In-app | "Anda kini punya akses ke **Project**" / "Akses Anda ke **Project** dicabut" |
| `org.ownership.transferred` | New and previous Owner | In-app + email | "**Yacobus** mengalihkan kepemilikan Maju Jaya kepada Anda" |
| `org.organization.deletion_scheduled` | All Owners and Admins | In-app + email | "Maju Jaya dijadwalkan dihapus permanen pada **24 Okt 2026**" |
| `org.organization.deletion_cancelled` | All Owners and Admins | In-app | "Penghapusan Maju Jaya dibatalkan" |
| `org.organization.suspended` / `.reactivated` | Owners | Email | "Maju Jaya ditangguhkan oleh agere" / "diaktifkan kembali" |
| `security.*` (user scope) | The user | **Email** (always on; cannot be disabled) | e.g. "Kata sandi Anda baru saja diubah. Bukan Anda? Reset sekarang." |
| `identity.account.deletion_requested` (user scope) | The user | Email | "Permintaan hapus akun Anda diterima. Data pribadi Anda dihapus dalam 30 hari." |
| `space.project.updated` (status change, Should) | Project owner, if not the actor | In-app | "**Rina** mengubah status **Q4 Launch** menjadi **Berisiko**" |
| `agent.proposal.created` (release 3, PRD-17) | People who can accept the proposal, one item per run | In-app | "**Agen** mengusulkan 2 tindakan dari **/triase** · PRM-0149" |
| `chat.message.created` with mention (release 2, PRD-14) | Mentioned users who can view the conversation (project channel: can view the project) | In-app | "**Rina** menyebut Anda di **Peluncuran Q4**" / "di **#pemasaran**" |
| `chat.message.created` in a DM (release 2) | No inbox item; reflected in the Chat unread badge | — | — |

**Bulk rule:** events that carry `bulk_operation_id` (PRD-00b §6) are **not** notified individually. The operation's producer publishes one summary event per recipient (for example `membership.work.reassigned`).

**Account-critical email** goes through the email adapter (PRD-01 §6.1). It is sent from the Notifications consumer with idempotency on `(event_id, recipient)`, uses a plain-text-first template, and contains no workspace content beyond names.

## 6. Design

- **Storage:** `notifications(id, organization_id, recipient_user_id, event_id, type, title_vars, target_url, subject_ref, created_at, read_at, archived_at)`, with a unique constraint on `(event_id, recipient_user_id)`. "Untuk saya" = type in (`space.task.assigned`, mention types, `membership.work.reassigned`).
- **Read-time authorization:** the inbox API runs `checkBatch` (PRD-04) on each item's `subject_ref`. Items the user cannot view are hidden but not deleted, so they reappear if access returns.
- **Unread count:** counts only visible items; shown as "99+" above 99.
- **Delivery to the UI:** the inbox badge polls `GET /{slug}/api/notifications/unread-count` every 60 s while the tab is visible, plus on window focus [H]. Opening the inbox fetches 50 items per page.
- **Deep links:** `target_url` is always `/{slug}/…` (PRD-02 §6.2). A missing or unauthorized target shows the item page state "Item ini sudah dihapus atau Anda tidak punya akses." — never an error page.
- **Other organizations:** the switcher shows a dot on organizations with unread items. The count comes from one query across the user's active memberships.
- **Retention:** 90 days, then purged (PRD-13).
- **Digest (Should):** an hourly cron finds users whose local time is 08.00 and creates one "Jatuh tempo hari ini" item per organization when they have ≥ 1 task due today (via Schedulable). It is idempotent per user, organization and date.

## 7. UX

**Desk › Kotak masuk** (reading column 880 px, UI-01 v2.2). *(v1.4: the bell below applies only if D34 is rejected.)* The bell in the top bar opens the same list as a `Popover` (desktop) or `Sheet` (below 768 px) with the 5 newest items and "Lihat semua".

```text
Kotak masuk                                         [✓ Tandai semua dibaca]
3 belum dibaca
Semua 5   Belum dibaca 3   Untuk saya 2
───────────────────────────────────────────────────────────────────────────
Hari ini
┌──────────────────────────────────────────────────────────────────────┐
│ ● (RK) Rina menugaskan Riset harga paket baru kepada Anda       ✓ 🗄 │
│        Ditugaskan · 28 Sep 08.10                                      │
│ ● (DP) Dimas menyebut Anda di Moodboard kampanye Q4                   │
│        Disebut · 28 Sep 08.00                                         │
└──────────────────────────────────────────────────────────────────────┘
Kemarin …   Sebelumnya …
```

- Unread: dot in `brand-default` **and** full-contrast text plus the screen-reader label "Belum dibaca"; read items use `fg-subtle` text.
- Row = one button (opens the target, marks read); hover/focus reveals "Tandai dibaca" and "Arsipkan" (icon buttons with labels).
- Tabs follow the Agere DS Tabs underline variant with counts.

| State | Behavior and microcopy |
|---|---|
| Ideal | Newest first; day groups Hari ini · Kemarin · Sebelumnya |
| Empty | Icon ✓ + "Semua beres" + "Tidak ada notifikasi di sini." (tab Belum dibaca: "Tidak ada notifikasi yang belum dibaca.") |
| Loading | 5 skeleton rows |
| Error | "Notifikasi belum bisa dimuat. Coba lagi." with "Coba lagi" |
| Partial | Unread count failed but the list loaded: hide the badge number and keep the list. Target gone: the missing-item state in §6 |

## 8. User stories & acceptance criteria

**US-1 — Assignment notification.**

```gherkin
Given Rina can view project Q4 Launch
When Yacobus assigns her a task there
Then exactly one in-app notification exists for Rina, visible within 60 s, linking to /maju-jaya/projects/…/tasks/tsk_1
```

**US-2 — No duplicates (PRD-00b D5).**

```gherkin
Given the space.task.assigned delivery is retried after a crash
Then Rina still has exactly one notification for that event
```

**US-3 — Read state (v1.0 AC preserved).**

```gherkin
Given Rina opens a notification
When the inbox reloads
Then it is read and the unread count has decreased by 1
When she chooses "Tandai semua sudah dibaca"
Then all visible notifications in this organization are read
```

**US-4 — Access lost (v1.0 AC preserved).**

```gherkin
Given Rina has a notification about a task in project P
And her access to P is removed
When she opens the inbox
Then the notification is not shown and is not counted as unread
```

**US-5 — Bulk summary.**

```gherkin
Given Budi is removed and 12 tasks are reassigned to Yacobus
Then Yacobus receives one "12 tugas … dialihkan" notification and no per-task notifications
```

**US-6 — Account-critical email.**

```gherkin
Given Budi is suspended
Then Budi receives one email "Akses Anda ke Maju Jaya ditangguhkan" and no in-app item
```


**US-7 — Archive (v1.3).**

```gherkin
Given Rina has 3 unread notifications
When she chooses "Arsipkan" on one of them
Then it disappears from every tab, the unread count becomes 2, and the toast "Notifikasi diarsipkan." is shown
And the item is purged with the 90-day rule
```

**US-8 — Tabs and groups (v1.3).**

```gherkin
Given Rina has 5 notifications: 2 today, 1 yesterday, 2 older; 3 unread; 2 are assignments or mentions
When she opens Desk › Kotak masuk
Then the tabs read "Semua 5", "Belum dibaca 3", "Untuk saya 2" and the list is grouped Hari ini, Kemarin, Sebelumnya
When she chooses "Untuk saya"
Then only the 2 assignment or mention items are listed
Given every notification is read
Then the header subtitle reads "Semua sudah dibaca" and "Tandai semua dibaca" is hidden
```

## 9. Edge cases

| Case | Behavior |
|---|---|
| A recipient is removed before delivery | Consumer skips non-members at delivery time |
| The organization is in pending_deletion | Only deletion notices are delivered |
| An email bounces | Logged; not retried beyond the adapter policy; the in-app copy still exists where applicable |
| The user has 10,000 old notifications | Paginated; purged at 90 days |

## 10. Non-functional requirements

- Unread count: p95 ≤ 100 ms including `checkBatch` on ≤ 200 unread items [H].
- Email: sent within 5 minutes of the event (p95) [H].
- WCAG 2.1 AA; badge changes announced politely (`aria-live="polite"`).

## 11. Dependencies

PRD-00b (catalog, `bulk_operation_id`, delivery), PRD-01 (email adapter), PRD-02 (URLs, organization status), PRD-03 (the `membership.work.reassigned` producer), PRD-04 (`checkBatch`), PRD-06 (Project events, Schedulable), PRD-12 (timezone; preferences in release 2), PRD-13 (retention).
