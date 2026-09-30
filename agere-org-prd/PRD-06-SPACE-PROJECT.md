# PRD-06 — Space & Project

| Field | Value |
|---|---|
| Version | 2.1.2 (supersedes 2.1.1) |
| Status | Draft — release 1 (wedge app); structure per D18 (Index C-18) |
| Owner | [TBD — Product Owner agere/org] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE (PRD-00) |
| Depends on | PRD-04 v1.5 (ACL containers incl. `space`), PRD-03 (Work Ownership, teams), PRD-00b (events, `due`, Schedulable), PRD-10, PRD-13 (trash), PRD-18 (Panduan), UI-01 v2.4 (navigasi ganda, daftar gaya ClickUp, aksi header), Agere DS 6.4 |
| Resolves review items | Per-PRD gaps for 06 (status model, visibility, concurrent reorder, collaboration scope); C-02 for Project |

### Change log v2.1.1 → v2.1.2 (29 Sep 2026 — no "Semua proyek", minimal project card, D46)

- **"Semua proyek" is removed** (PO decision D46). The Space rail item opens the **last space the user visited** in this organization; the first time, the first space they can open (panel order). An organization without spaces shows an empty state on the Space landing: "Belum ada space" with **Space baru** for Owner/Admin, or "Minta Owner atau Admin membuat space." for members. Cross-space discovery stays in the Space panel tree, **Favorit** and ⌘K. §6.6 "Semua proyek", US-17, the panel row "Semua proyek", the URL `/{slug}/s` as a page and its performance target are **void**; `/{slug}/s` now redirects to the last visited space so old links keep working. Breadcrumbs start at the space ("Marketing › Studio Desain"), without a "Space" root.
- **Minimal project card** (space page): project tile (48 px), project name, description (max. 2 lines; "Belum ada deskripsi." when empty) and **exception chips only**: *Berisiko*, *Keluar jalur*, *Selesai*, *Terbatas*. A healthy, open project shows no chip. Removed from the card: progress bar, task counts, overdue count, lead avatar, target date and the access badge. The Favorit star appears on hover/focus, or always when the project is a favorite (always on touch devices). The whole card opens the project. Health detail lives in the project header chip and Ringkasan (§6.8).
- **Trade-off (accepted by the PO):** health is no longer readable at a glance from numbers; exception chips keep the risky projects visible.

```gherkin
Given I last opened Kampanye Q4 in space Marketing
When I choose Space in the rail
Then the Marketing space page opens and no "Semua proyek" row exists in the Space panel
Given I open an old link to /maju-jaya/s
Then I land on my last visited space
Given Kalender Konten is "Berisiko" and Studio Desain is "Sesuai rencana" with Ikut space access
Then the Kalender Konten card shows only the chip "Berisiko" and the Studio Desain card shows no chip
And no card shows a progress bar, task counts, lead or target date
Given the organization has no spaces and I am a Member
When I choose Space in the rail
Then I see "Belum ada space" and "Minta Owner atau Admin membuat space."
```

### Change log v2.1 → v2.1.1 (28 Sep 2026 — agents, PRD-17 v1.0, D44; languages, D45)

- **Minta agent membantu** (release 3, with PRD-17) in the task detail and row ⋯: binds an agent run to the task. While a run or an action is open, the task shows a *Dibantu {agent}* marker (visual per design decision DD-5). **The assignee never changes; agents are never listed in the assignee picker** (PRD-04 v1.5.1).
- Tasks and comments created through an approved agent action carry `data.source = {module:"agent", type:"action", id}`; the activity feed reads "Dibuat lewat {agent}, disetujui {nama}".
- `@agent` in task comments starts a run with the task as context (release 3).
- **Languages (D45):** all system text in Space follows the viewer's language (English default, Bahasa Indonesia). Column names seeded by presets and default columns are created in the **organization's default language** and are then ordinary user content (renaming is not translated). Timeline import accepts English and Indonesian month abbreviations (UI-01 v2.5).

### Change log v2.0 → v2.1 (28 Sep 2026 — prototype v17.1, PO review)

- **Subtasks designed (D28a, §6.12):** one level; created inline from a list row; shown nested in Daftar, as a count on board cards and with a parent caption in Tugas saya. **Release placement is decision D38** (recommended release 2; PRD-00 v1.2.7 §4.2 step 8). Labels stay open (D28b).
- **Drag and drop in Daftar (§6.10, §6.12):** reorder within a group (release 1, uses the existing `order_key`), drop on another group = change status (release 1), drop into a row = make subtask (with D28a). Every drag has a row-menu equivalent (WCAG 2.5.7).
- **Counts (§6.13, D-bugfix from QA-02):** tab and group counts count top-level tasks on the current board, so they always match the cards on the board.
- **Project header actions (D32, §6.7):** Bagikan stays a button and is **not** repeated in ⋯; ⋯ = Status proyek · Pemicu otomatis (with PRD-17) · Salin tautan proyek · Arsipkan · Pindahkan ke Sampah. Badge order: status → access → Akses admin. Space page: **Edit space moves into ⋯** (§6.9).
- **Timeline import (D40, §6.11):** label **Impor**; `.md` table **or** `.csv`; one date grammar shared with UI-01 (ISO, `DD/MM/YYYY`, `5 Okt 2026`, relative `W1–W26`); max 512 KB. Resolves the PRD-06/UI-01 mismatch (Index C-27).
- **Task detail layout v2 (D41, §8.1):** no duplicate status chip, borderless title, *Dibuat* as a property (replaces *Zona waktu*), no placeholder text anywhere (D33), unsaved state in the footer, composer with a visible label.
- Status text on neutral surfaces uses Agere DS 6.4 `*-on-surface` tokens (D37).

### Change log v1.3 → v2.0 (27 Sep 2026 — Space as container, navigasi ganda, daftar gaya ClickUp)

- **Space is a container above projects (D18, Index C-18).** Hierarchy: Organization → **Space** → **Project** → views. A space carries its own ACL; a project inherits it or narrows it, never widens it (PRD-04 v1.5 rule I1). Internal app id stays `space`; the new container type is `space.space` (table `spaces`).
- **Space is editable (D23):** name, icon (10 built-in icons **or an uploaded icon**: PNG/SVG/JPG/WebP, square, ≤ 1 MB), description and access; a space that still holds projects cannot be deleted (§6.9).
- **No app-home Ringkasan (D21).** The org-level "Ringkasan Project" (KPI cards, status donut, task table) is removed. Space's home is **Semua proyek**: tabs per space + project cards that show which space owns the project (§6.6). Per-project **Ringkasan** stays a project view. Capacity: BE −1, FE −2.
- **Views per project (§6.7):** Daftar · Papan · Ringkasan (release 1); Kalender · Timeline (incl. import from `.md`) · Channel (release 2); Doc (release 3). Tab bar = Agere DS Tabs, underline variant, with counts.
- **Daftar = ClickUp list pattern (D25, §6.10)** shared with Desk › Tugas saya and Permintaan: status groups with a coloured pill, column headers per group, hover row actions, inline rename, quick-set empty fields, multi-select with a floating bulk bar. Capacity: BE +1, FE +3.
- **Tugas saya moves to Desk** (D20; rail order Desk · Space · Chat · Doc · Agen; Desk is the landing screen after sign-in). Query and sections are unchanged (§6.3).
- **Share dialog** follows PRD-04 v1.5 §8.1 (ClickUp-style: private link, organization toggle, "Akses lanjutan").
- **Navigation (UI-01 v2.2):** Space panel = search · Semua proyek · Favorit · Semua space (tree space › project › view shortcuts); ⋯ per space row: Edit space, Proyek baru, Hapus.
- Capacity impact in PRD-00 v1.2.6 §4.2 step 7.

### Change log v1.2 → v1.3 (26 Sep 2026 — ClickUp-style project space, QA v10)

- **Project space with tabs** (pattern adopted from ClickUp, visuals from Agere DS; §6.7). Release 1 tabs: **Ringkasan · Papan · Daftar**. Release 2 adds **Channel** (PRD-14), **Tenggat**, and "+ Tampilan" (manage can show/hide tabs). Release 3 adds **Doc tersemat** tabs (PRD-08). The `ViewSwitcherBar` is replaced by the tab bar; URLs change from `?view=` to a path segment (§6.5).
- **Landing rule:** last tab used → (release 2) Channel if followed and non-empty → Papan (QA ON1: never land on an empty screen).
- **Sidebar:** "Proyek aktif" becomes a **Proyek** tree: each project expands to its boards (and, when released, its Channel and pinned docs); starred projects appear under **Favorit** (§6.5).
- **Project status** (QA PM1): owner, target date and a manual status with a note replace the derived "Tepat waktu" label on project cards (§6.8). Should #2 in PRD-00 §3.2.
- **Assignee picker** only offers people and teams with access (QA C9, §6.1).
- **Ringkasan** keeps no primary action in its page header (UI-01 rule for every app home); its `h1` is "Ringkasan Project" (QA V7).
- `createTask` accepts an optional `source` (chat message or doc block) and publishes it in `space.task.created` (§7; PRD-14, PRD-08).
- Capacity impact (release 1): FE +2 ideal days (sidebar tree 1, assignee picker 0.5, tab bar replacing the view switcher + landing rule 0.5); project status (BE 1 + FE 1) is Should, not counted. Totals in PRD-00 v1.2 §4.

### Change log v1.1 → v1.2

- **Task detail is a large modal** (26 Sep 2026), not a side sheet: detail pane + activity pane (§8.1).

- **Renamed Space → Project** (user-facing name). The internal app id stays `space`: event names (`space.*`), the app registry key, grants and tables do not change (PRD-00b §5 naming note). URLs move from `/{slug}/space/…` to `/{slug}/projects/…`.
- **Navigation:** Project ▸ **Ringkasan** · **Proyek** · **Tugas saya** (§6.5). All labels are Bahasa Indonesia.
- **Added "Ringkasan"** (app home, §6.6): release 1 = KPI cards, status donut and task table from live data. The trend chart moves to release 2 because it needs a daily snapshot table.
- Capacity impact: BE +1, FE +2 ideal days (PRD-00 §4, v1.1).

### Change log v1.0 → v1.1

- Visibility comes from the **project ACL** (PRD-04 §6.4); boards and tasks inherit it.
- Statuses are **board columns mapped to a category** (`todo`, `in_progress`, `done`).
- Ordering uses fractional keys with optimistic UI and rollback.
- Added "Tugas saya" (my tasks across projects). Release 1 has no Calendar, so this is where users see what is due.
- Explicit release 1 cut: comments are Should; attachments are release 2 (PRD-07); subtasks, recurrence and time tracking are Won't.

---

## 1. Problem

Small Indonesian teams run work across WhatsApp groups, spreadsheets and free task tools. None of these knows the organization's people, teams or access rules. Assignments get lost when people change roles, and private work leaks to the whole group.

## 2. Goal

A fast, familiar project/board/task tool that is **native to the agere/org organization**: members, teams, access, notifications and audit work without setup. Work is grouped in **spaces** (one per division, e.g. Marketing, Product & Tech) that hold projects, so access is set once per division and inherited. It must become the daily habit that drives WACO (PRD-00 §2).

## 3. Personas & jobs to be done

| Persona | Job to be done | Evidence |
|---|---|---|
| Team lead | "Every morning I want to see what's stuck and who is overloaded, without chasing people in chat." | [Hypothesis: validate in design-partner interviews] |
| Member | "I want one list of what I must do today across all projects." | [Hypothesis] |
| Owner | "I want sensitive projects (HR, finance) visible only to the right people." | [Hypothesis] |

## 4. Success metrics

| Metric | Target | Window | Type |
|---|---|---|---|
| Project activation (project with ≥ 5 tasks and ≥ 2 members acting within 7 days) | ≥ 50% of projects [H] | Cohort | Primary |
| Weekly active Project users ÷ active members | ≥ 60% [H] | Weekly | Primary (feeds WACO) |
| Task completion rate (tasks → done within 30 days) | ≥ 50% [H] | Monthly | Secondary |
| Due-date adherence (done on or before due) | Baseline in pilot | Monthly | Secondary |
| Failed moves shown as saved | **0** | Continuous | Guardrail |

## 5. Scope

**Must (release 1):**

- **Spaces (§6.9):** create, edit (name, icon incl. upload, description, access), delete when empty; Share dialog (PRD-04 v1.5 §8.1). Every organization starts with one space ("Umum") holding the starter project.
- **Semua proyek (§6.6):** space home with tabs per space and project cards that show the owning space.
- **Space page:** name, description, access line, search, status tabs (Semua · Favorit · Sesuai rencana · Berisiko · Selesai), project cards, forms that route into the space.
- **Projects:** create inside a space, rename, description, archive/restore, delete (to trash); Share dialog.
- **Boards:** a default board per project; add, rename, reorder and delete boards.
- **Columns** per board: add, rename, reorder, delete (only when empty), each with a category.
- **Tasks:** title, description, assignee (a user, a team, or none), due date, column/status, manual order, created by/at; move between columns and boards within a project; delete (to trash).
- **Views (§6.7):** **Daftar** (ClickUp list pattern, §6.10), **Papan** (Kanban, drag-and-drop plus keyboard "Pindahkan ke…"), **Ringkasan** (per project), Task detail (large modal, §8.1). **Tugas saya** is served by this module and shown in Desk (§6.3).
- **Interfaces:** Work Ownership (PRD-03 §6.3), Schedulable (PRD-00b §8.2); events per the PRD-00b catalog.

**Should (in PRD-00 §3.2 rank order):**

- Comments with @mention.
- **Project status** (§6.8): owner, target date, manual status + note.
- Priority field (none/low/medium/high/urgent, using the Agere DS `priority-*` tokens with the word always shown).
- **Favorit** (star a project; it appears under Favorit in the Space panel).

**Release 2:** file attachments (PRD-07, **on hold**, D22); **Kalender** view (D15); **Timeline** view incl. import from a `.md` table (§6.11); **Channel** view (PRD-14, if gate G-Chat passes); due *time* (the `instant` kind); **"+ Tampilan"** (configurable views); **checklist** and **labels** on tasks (QA PO3; see open decision D28 for **subtasks**); **milestones** (QA PM2); system categories **Review** and **Diblokir** (QA PM3); cross-project **workload** (QA PM4); combined filters and search (QA PM5).

**Release 3:** **Doc** view per project (PRD-08: related docs, new doc in project, `.md` import); estimates on tasks (QA PO3). Task dependencies stay Won't until milestones (release 2) show demand.

**Won't:** dependencies, recurring tasks, time tracking, custom fields, templates (the *Titik mulai* presets in onboarding are organization seeding, PRD-02 v1.2, not project templates; the preset picker shown in prototype v17.1's *Proyek baru* dialog is **not release 1**; it is a Could candidate for release 2, decision D43, Index C-24), public sharing (open decision D27), guest users. **Subtasks:** designed in v2.1 (D28a, §6.12); release placement = D38. **Labels:** open (D28b).

## 6. Design

### 6.1 Model & inheritance

```text
Space    (ACL container — PRD-04 v1.5 §6.4; default "Semua anggota") { name ≤ 60, icon: builtin key | uploaded asset, description ≤ 500 }
 └── Project  (ACL container; inherits the space ACL or narrows it — rule I1) { space_id }
      └── Board  (inherits)
      └── Column  { name, category: todo | in_progress | done, order }
           └── Task  (inherits) { title ≤ 200, description ≤ 10,000 chars (plain text + basic markdown),
                                   assignee: user | team | null, due: {kind:"date"} | null,
                                   order_key (fractional), version }
```

- A project always belongs to exactly one space. Moving a project to another space is **manage on both** and applies the new space's ACL immediately unless the project is narrowed (PRD-04 I2).
- A new board has 3 columns: **Belum dikerjakan** (todo), **Sedang dikerjakan** (in_progress), **Selesai** (done).
- A task's status is its column, and the column's category drives completion. "Done" means the category is `done`: done tasks never show as overdue and do not count as open work.
- **Visibility:** everything in a project is visible exactly to principals with ≥ view on the project. Creating and editing tasks requires edit; deleting the project or changing access requires manage.
- **Team assignment** does not grant visibility (PRD-03 §6.4). Assigning a team whose members lack access shows the PRD-03 warning.
- **Assignee picker (QA C9):** offers only members who can view the project, and only teams with at least one active member holding an explicit grant on the project (governance override does not count). A team with partial access still shows the PRD-03 warning. The server rejects an assignee outside this set with `VALIDATION` ("{nama} belum punya akses ke proyek ini. Bagikan dulu.").
- **Archived project:** read-only, hidden from default lists and "Tugas saya", restorable (manage).
- **Deleted project or task:** goes to **Sampah** for 30 days, restorable by anyone with manage on the project (PRD-13), then purged.
- **Limits [H]:** 500 active projects per organization, 20 boards per project, 20 columns per board, 5,000 tasks per project.

### 6.2 Ordering & concurrency

- Each task has an `order_key` (fractional index string) within its column. A move writes only the moved task: `{column_id, order_key, version}`.
- **Optimistic UI:** the card moves immediately. If the server rejects the move (version conflict, task deleted, access lost, network error), the card animates back and a toast says "Gagal memindahkan tugas. Coba lagi." It never stays in a position that was not saved (v1.0 AC preserved).
- **Concurrent edits** to the same field: last write wins with a version check. On conflict: "Tugas ini baru saja diubah oleh Rina. Perubahan Anda belum disimpan." with the action "Muat ulang".
- **Freshness:** open boards refetch on window focus and every 30 s while visible [H]. There is no WebSocket in release 1.

### 6.3 Tugas saya

- Lists all open tasks (category ≠ done) where the user is the assignee, or a member of the assigned team, **and** the user can view the project.
- Shown in **Desk › Tugas saya** (D20) with the list pattern (§6.10). Sections: **Terlambat**, **Hari ini**, **7 hari ke depan**, **Nanti**, **Tanpa tenggat**, **Selesai** (collapsed, last 30 days). Columns: Nama · Proyek · Tenggat/SLA · Prioritas. Header: "Tugas saya" + "n tugas terbuka · n terlambat" + "Tugas baru".
- "Today" follows the user's timezone: the PRD-12 preference, else the organization default, else Asia/Jakarta.
- Served by Project's `listSchedulable` implementation (PRD-00b §8.2). Release 2 Calendar reuses it.

### 6.4 Overdue

A task is overdue when its category ≠ done and `due.date` < today in the **assignee's** timezone (PRD-00b §6.1). For team assignment, the organization default timezone is used.

### 6.5 Naming & navigation

| Layer | Value | Note |
|---|---|---|
| Rail item (UI) | **Space** (second rail item, after Desk) | Rail + contextual panel (UI-01 v2.2) |
| App id (code, registry, events, grants) | `space` | Unchanged. Container types: `space.space`, `space.project` |
| Space panel | Search · ~~Semua proyek~~ (removed, D46) · **Favorit** · **Semua space** (tree: space → projects → view shortcuts of the open project) | ⋯ on a space row: Edit space, Proyek baru, Hapus |
| URLs | ~~Semua proyek~~ `/{slug}/s` redirects to the last visited space (D46) · space `/{slug}/s/{space}` · project `/{slug}/s/{space}/{project_id}/{daftar\|papan\|ringkasan\|kalender\|timeline\|doc\|channel}` · task modal `…/tasks/{task_id}` · Tugas saya `/{slug}/desk/tugas-saya` | Old `/{slug}/projects/…` URLs redirect |
| Entity copy | "space", "proyek", "tugas", "papan", "kolom" | "Space" is not translated (product noun) |

Access-denied copy uses the entity: "Anda belum punya akses ke space ini" / "…ke proyek ini" (PRD-04 §8.3). Sharing copy: "Bagikan space" / "Bagikan tampilan ini".

### 6.6 Semua proyek and space pages (replaces the app-home Ringkasan, D21) — ⛔ *v2.1.2: "Semua proyek" is void (D46); the space page below stays, with the minimal card of the v2.1.2 change log*

**Semua proyek** (Space home; landing of the Space rail item):

- Header: "Semua proyek" · "{n} proyek di {m} space" · primary "Proyek baru".
- Tabs (underline, with counts): **Semua** · one tab per space the user can view.
- Project card: **space chip** (space icon + name; click opens the space) · project badge + name (+ ★) · lead · access · description (2 lines) · progress bar "{selesai}/{total} selesai" (+ "{n} terlambat" in `error-fg`) · status badge · "Buka proyek".
- Only projects the user can **view** are listed and counted (`authz.filter`).

**Space page** (`/{slug}/s/{space}`): overline "Space" with the space icon · name (`heading-xl`) · description · access line ("Semua anggota · 3 proyek · 2 formulir masuk ke space ini") · actions **Edit** (manage), **Bagikan**, primary **Proyek baru** · search · status tabs · project cards · table "Formulir yang masuk ke space ini" (when PRD-15 ships).

**Removed (D21):** the org-level Ringkasan (KPI cards, status donut, task table, bulk "Tandai selesai"). What it answered moves to **Desk** (Tugas saya sections, Fokus hari ini in the Desk panel) and to the per-project **Ringkasan** view. The release-2 trend chart moves to the per-project Ringkasan.

### 6.7 Project space: views and landing

| View (tab) | Release | Content |
|---|---|---|
| Daftar | 1 | ClickUp list pattern (§6.10) of the selected board, grouped by status |
| Papan | 1 | Kanban of the selected board; "Tambah kolom" at the end |
| Ringkasan | 1 | About (desc, access, members, owner, target, status), per-project KPIs (open, overdue, due in 7 days, unassigned); trend chart in release 2 |
| Kalender | 2 | Month view of tasks with a due date (D15) |
| Timeline | 2 | Gantt-like bars from start → due; import from a `.md` table (§6.11) |
| Doc | 3 | Related docs, new doc in project, `.md` import (PRD-08) |
| Channel | 2 | Project channel (PRD-14) |

- Tab bar: Agere DS **Tabs, underline variant**; counts in a small grey pill (Daftar and Papan show open **top-level** tasks on the current board, §6.13); release badges (R2/R3) only in the prototype. "+" = "+ Tampilan" (release 2): a saved view = name, type (Daftar · Papan · Kalender), filters (assignee incl. "the person opening it", priority, overdue only), shown as an extra tab to everyone with access.
- **Header (D32, Agere DS 6.4 `PageHeader` + `PageHeaderActions`):** back link to the space · leading tile 48 px (`radius-xl`) · title `type-heading-xl` · ☆ · badges in the order **status** (button for manage: opens Status proyek) → **access** (Terbatas / Semua anggota, tooltip with the full rule) → **Akses admin** (governance override) · description. Actions: access avatar stack (opens Bagikan) · **Bagikan** (outline) · **Tugas baru** (default) · ⋯ (Status proyek · Pemicu otomatis [PRD-17, release 3] · Salin tautan proyek · — · Arsipkan · Pindahkan ke Sampah). Bagikan is never repeated in ⋯ on desktop; below 768 px it becomes the first ⋯ item (UI-01 v2.4).
- Assignee filter (Select DS) sits under the tab bar for Daftar and Papan.
- **Landing (unchanged order):** 1) last view opened in that project (per user per device); else 2) from release 2, **Channel** if followed **and** non-empty; else 3) **Papan**.
- **Keyboard:** ARIA tabs pattern (←/→, Home/End, automatic activation).

### 6.8 Project status (Should, QA PM1)

- Fields on the project: `owner_user_id` (default creator; must have edit), `target_date` (date, optional), `status` ∈ `on_track | at_risk | off_track`, `status_note` (≤ 280 chars), `status_updated_at/by`.
- Edited by **manage** in the dialog "Status proyek"; publishes `space.project.updated` with before/after status.
- Shown as a chip in the project header ("Berisiko · target 30 Okt 2026"), in Ringkasan › Tentang proyek, and on project cards. A card without status shows "Belum ada target" — the derived "Tepat waktu" label is removed because nothing was compared.
- Overdue task counts stay visible next to the status (they are facts; the status is a judgment).

### 6.9 Space editing and icons (D23)

- **Who:** manage on the space (Owner/Admin by governance override, audited).
- **Dialog "Edit space"** (also used for "Space baru"): Nama (required, ≤ 60, unique per organization, case-insensitive) · **Ikon**: preview tile 52 px, "Unggah ikon" (PNG, SVG, JPG, WebP; square; ≤ 1 MB; stored in Vercel Blob as an org asset, SVG sanitized on upload) and "Hapus", plus 10 built-in icons · Deskripsi (≤ 500) · "Siapa yang bisa membuka" (Select: Semua anggota / Terbatas · Tim …) with help "Proyek di dalamnya mengikuti akses ini, kecuali proyek yang dibatasi sendiri." · footer: "Hapus space" (ghost, destructive) · Batal · Simpan.
- The icon appears in the Space panel, project-card space chips, the space page overline and pickers.
- **Delete:** blocked while the space holds projects: toast "Space berisi {n} proyek. Pindahkan atau arsipkan proyeknya dulu." An empty space goes to Sampah (30 days, PRD-13).
- **Where the actions live (D32, v2.1):** space page header = **Bagikan** (outline) · **Proyek baru** (default) · ⋯ (Edit space · — · Hapus space). The panel ⋯ on a space row keeps Bagikan space · Edit space · Proyek baru di sini · Hapus space, because nothing else on the panel offers them. The dialog footer's *Hapus space* is `destructive-outline` on the left; only the confirm dialog uses solid `destructive`.
- **Events:** `space.space.created` / `.updated` / `.deleted` (deleted audited); access changes are `access.acl.changed`.

### 6.10 Daftar — list pattern (D25; shared with Desk)

| Part | Behaviour |
|---|---|
| Group header | Collapse caret · **status pill** (status `*-bg` tint with `*-fg` text, **sentence case** label, status icon; D32) · count · "+" on hover · the whole header is a drop target (change status). The done group is collapsed by default |
| Column header | Repeated per group: Nama · Penanggung jawab · Tenggat/SLA · Prioritas (module-specific columns allowed, e.g. Proyek in Tugas saya, Pemohon in Permintaan). The *Nama* label starts at the same x as the task-name text in the rows, whatever sits before the name (grip, checkbox, caret, status) |
| Row (44 px) | Drag handle + checkbox (visible on hover or when selected) · caret (24 px, only when the task has subtasks) · status icon (24 px; click = change status, same as "Pindahkan ke…") · name · hover actions: **+ Tambah subtugas** (D28a), Label (release 2), **Ganti nama** (inline, Enter saves, Esc cancels) · columns · ⋯. Nothing before the name may shrink (`flex: none`), so status icons line up on every row |
| Drag and drop | Handle only. Top 30 % of a row → before · bottom 30 % → after · middle 40 % → make subtask (D28a) · group header or empty group → change status. Indicators: 2 px line (before/after), 1.5 px outline + `bg-subtle` (nest), dashed outline (group). Keyboard and touch alternative in the row ⋯: Naikkan · Turunkan · Pindahkan ke status… · Jadikan subtugas dari… · Lepas dari induk. Each move is announced and offers **Urungkan** in a toast |
| Empty fields | Grey icons (person, calendar+, flag) that open the matching picker in place |
| Multi-select | Floating bar at the bottom: "{n} dipilih · Tandai selesai · Tugaskan · ✕". "Tandai selesai" runs `completeTasks` (one transaction; items without edit are skipped and reported) |
| Group footer | "+ Tambah tugas" (creates in that status) |
| Mobile (< 768 px) | Name + one column; column headers hidden |

Performance: groups are paginated server-side at 50 rows; collapsed groups do not load rows.

### 6.11 Timeline import (release 2; D40, v2.1)

- **Entry:** Timeline tab toolbar: **Unduh contoh** (ghost sm; menu Markdown `.md` · CSV `.csv`) and **Impor** (outline sm). The label is the general verb because formats will grow (D40).
- **Formats:** a Markdown table (first table in the file) or a CSV file (comma separated, first row = headers). Columns are recognised by header: **Tugas** (required), **Mulai**, **Selesai** (required), **Penanggung jawab** (optional; matched to a member who can view the project, else created unassigned with a warning). Max **512 KB**.
- **One date grammar** (shared with UI-01 v2.4): `2026-10-05` · `05/10/2026` (DD/MM/YYYY) · `5 Okt 2026` (Indonesian month abbreviations) · relative weeks `W1–W26`, where **W1 = the week of the import** (Mulai = its Monday, Selesai = its Friday) [Hypothesis: validate with pilot planners]. Invalid calendar dates (31/02) are errors.
- **Always through a preview:** each row shows *Siap* or its error (*Tanggal tidak valid*, end before start); rows with errors are skipped, never imported. **Impor {n} tugas** creates the tasks in the first `todo` column in one transaction, with `start` and `due` set.
- **States:** wrong format → "Format .{ext} belum didukung. Gunakan .md atau .csv."; too large → "Ukuran file maksimal 512 KB."; no table found → "Tidak ada baris yang dikenali. Unduh contoh untuk acuan."

### 6.12 Subtasks & nested list (D28a, v2.1; release per D38)

| Part | Rule |
|---|---|
| Model | `task.parent_task_id` (nullable, same project). **One level:** a subtask cannot have subtasks; a task that has subtasks cannot become a subtask. A subtask has its own status, assignee, due and priority. Order: `order_key` within its parent (§6.2 applies unchanged) |
| Daftar | Subtasks sit under their parent regardless of their own status; 28 px indent per level with a 1 px connector (`border-emphasis`); rows 40 px (parent 44 px). Caret (IconButton xs, `aria-expanded`, name "Bentangkan 3 subtugas {tugas}") and a count chip "0/3" after the name |
| Inline add | "+ Tambah subtugas" on row hover opens a row under the parent: name input (label "Nama subtugas untuk {tugas}"), quick-set icons (Penanggung jawab · Tenggat · Prioritas), **Batal** (ghost xs), **Simpan ↵** (default xs). Enter saves and keeps the row open for the next subtask; Esc closes |
| Papan | Shows top-level tasks only; a card shows "0/3" with the subtask icon |
| Tugas saya | Subtasks assigned to me appear as normal rows with a parent caption (icon + parent title, ellipsis) |
| Task detail | Section **Subtugas** (list with status toggle, title opens the subtask, due, assignee; "+ Tambah subtugas" reveals an input). A subtask's breadcrumb shows its parent |
| Moves | Dropping a parent into its own subtask, or making a two-level tree, is rejected (Agere DS 6.4 `canDrop`/`moveTreeItem` implement these rules). Moving a parent to another status leaves its subtasks' statuses unchanged |
| Deletion | Deleting a parent moves its subtasks to Sampah with it (one restore restores all) |
| Events | `space.task.created` / `.updated` carry optional `data.parent_task_id` (optional field, no `version` bump, PRD-00b D7) |
| Estimate (when D38 places subtasks in a release) | **BE 3** (`parent_task_id`, depth and same-project rules, cascade to Sampah, nest in the move endpoint) · **FE 4** (nested rows + caret, inline add row with quick-set, nest drop zone, board count chip, Tugas saya caption, Subtugas section in the task modal) [Hypothesis: re-estimate at release 2 planning] |

### 6.13 Counts (v2.1)

- Tab counts (Daftar, Papan), group counts and project-card progress count **top-level tasks on the current board**; subtasks are counted inside their parent ("0/3"). Ringkasan KPIs follow the same rule and say so ("{n} tugas utama").
- Reason (QA-02 B-07): prototype v15 counted subtasks and other boards (found in the v16 QA pass, fixed before v16 was published), so the Papan tab said 5 while the board showed 3 open cards.

## 7. Events (PRD-00b catalog)

| Event | Audit | Notify |
|---|:-:|---|
| `space.space.created` / `.updated` | — | — |
| `space.space.deleted` | ✓ | — |
| `space.project.created` / `.updated` / `.archived` / `.restored` / `.moved` (to another space) | — | — |
| `space.project.deleted` | ✓ | — |
| `space.task.created` / `.updated` / `.deleted` | — | — |
| `space.task.assigned` | — | assignee (user) or team members who can view the project, excluding the actor (PRD-10) |
| `space.comment.created` (Should) | — | mentioned users who can view |

Access changes on a project are `access.acl.changed` (PRD-04), not Project events.

`space.task.created` carries an optional `data.source = {module: "chat" | "doc", type, id}` when a task is created from a chat message (PRD-14) or a doc to-do (PRD-08). Optional fields do not bump `version` (PRD-00b D7). `space.project.updated` carries status changes (§6.8).

## 8. UX

Agere DS 6.4: `PageHeader` + `PageHeaderActions` (§6.7), `Tabs` (underline, §6.7), `KanbanCardClickup`, `TaskList` (list pattern §6.10), `TaskFields`, `ButtonGroup` (attached secondary actions), `Select` (DS listbox, never the native dropdown), `ScrollArea`, `Dialog` (large, two panes) for task detail (§8.1), `EmptyState`, `Toast`. Brand is black (UI-01 v2.2); selected navigation is grey. Use `data-density="compact"` on List view. Task status colors use `task-*` tokens with their indicator shapes. Page `h1` = project name (`heading-xl`).

```text
┌ ‹ Marketing │ (SD) Studio Desain ☆ [Terbatas · Tim Desain] [Sesuai rencana]      [Bagikan] [+ Tugas baru] ┐
│ Daftar 5   Papan 5   Ringkasan   Kalender R2   Timeline R2   Doc R3   Channel R2   +                        │
│ [Papan utama 9] [Konten 2] [+]                      Penanggung jawab: Semua ▾              │
│ ┌ Belum dikerjakan 4 ┐ ┌ Sedang dikerjakan 2 ┐ ┌ Selesai 7 ┐  [+ Kolom]            │
│ │ ▢ Riset harga      │ │ ▢ Draft proposal    │ │ ✓ Kickoff  │                       │
│ │  Rina · 3 Okt      │ │  Tim Sales · 1 Okt  │ │            │                       │
│ └────────────────────┘ └─────────────────────┘ └────────────┘                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

One primary button per view ("+ Tugas baru" in the project header; "Proyek baru" on the space page; v2.1.2: "Semua proyek" no longer exists).

| State | Behavior and microcopy |
|---|---|
| Ideal | Board with columns and cards; overdue due-dates use `error-on-surface` (Agere DS 6.4) **and** the word "Terlambat" (card: "⚠ Terlambat" with the date in the tooltip and accessible name; list: "Terlambat sejak 25 Sep") |
| Empty | No projects: `EmptyState` titled "Mulai proyek pertama Anda", description "Kelompokkan tugas tim dalam satu proyek dan pantau progresnya.", action "Buat proyek". Empty column: "Belum ada tugas" plus inline "+ Tambah tugas". Tugas saya empty: "Tidak ada tugas untuk Anda. Semua beres." |
| Loading | Column skeletons (3 × 4 cards); List shows 10 × 40 px rows |
| Error | Move failed: rollback + toast (§6.2). Load failed: "Proyek belum bisa dimuat. Periksa koneksi Anda, lalu coba lagi." with "Coba lagi" |
| Partial / edge | View-only access: no drag handles and an info banner "Anda hanya bisa melihat proyek ini." Archived: banner "Proyek ini diarsipkan." with "Pulihkan" (manage only). Task in trash opened from a notification: PRD-10 missing-item state. |

**Accessibility:**

- Drag-and-drop always has a keyboard equivalent: focus a card → the Space key opens "Pindahkan ke…" (column and position). Moves are announced via `aria-live`: "Riset harga dipindahkan ke Sedang dikerjakan, posisi 1."
- Cards are buttons with an accessible name that includes the due date and assignee.
- Targets are ≥ 24 × 24 px.

### 8.1 Task detail modal (layout v2, D41)

- Size: up to 1440 × 900 px with 24 px margin; full screen below 768 px (panes stack).
- **Top bar (56 px):** previous/next task in the current board order (↑/↓), breadcrumb (project badge + project / board / [parent task] / task id), badge **Akses admin** when opened through the governance override, **Bagikan** (outline sm), ⋯ (Salin tautan tugas, Salin ID, Pindahkan ke Sampah for manage), close. "Dibuat" moves out of the top bar.
- **Detail pane (left, padding 24/32 px, gap 28 px):** editable title (`type-heading-xl` 24/32, **no border**; hover and focus = `bg-muted`), then properties in two columns inside one ruled block (label column 160 px with 16 px icon; rows 40 px): Status · Penanggung jawab · Tenggat (with a "Terlambat" badge when overdue) · Prioritas · Proyek · **Dibuat** ("20 Sep oleh Dimas"). There is **no status chip above the title** (it duplicated the Status property). Then **Deskripsi** (editable in place, no box and no placeholder; hover/focus `bg-muted`), **Subtugas** (§6.12, with D38), **Checklist** (release 2). Lampiran stays hidden while File is on hold (C-20).
- **Footer (sticky):** left = "⚠ Perubahan belum disimpan" (`attention-on-surface`, only while dirty); right = **Batal** (ghost) · **Simpan perubahan** (default).
- **Activity pane (right, 400 px, `bg-muted`):** "Aktivitas" feed (newest at the bottom); composer pinned at the bottom with a visible label **Komentar**, a bordered box (textarea without placeholder + caption "Enter untuk kirim, Shift+Enter untuk baris baru" + send icon button). Comments send immediately and are not part of the unsaved state.
- "+ Tambah subtugas" and "+ Tambah item" are buttons that reveal their input on click (no empty borderless inputs).
- Focus lands in the title; Esc closes (unsaved changes → "Perubahan belum disimpan. Buang perubahan ini?" bar); previous/next is blocked while there are unsaved changes, with the toast "Simpan atau batalkan perubahan dulu sebelum pindah tugas."
- View-only users see the same layout with disabled fields and no composer.

## 9. User stories & acceptance criteria

**US-1 — Create and share a project.**

```gherkin
Given I have Project access
When I create project "Q4 Launch"
Then it has a default board with 3 columns, I have manage, and visibility is "Semua anggota"
When I change visibility to "Terbatas" with Tim Sales = Edit
Then only I and Tim Sales can see the project and its tasks (PRD-04 US-1)
```

**US-2 — Assign and notify.**

```gherkin
Given a task in a project Rina can view
When I assign it to Rina
Then space.task.assigned is published and Rina gets an in-app notification (PRD-10)
When I assign it to myself
Then no notification is created
```

**US-3 — Move with persistence (v1.0 AC preserved).**

```gherkin
Given I have edit on the project
When I move a task to "Sedang dikerjakan" at position 1
Then after reload the task is in that column at that position

Given the network fails during the move
Then the card returns to its original position and the failure toast is shown
```

**US-4 — Keyboard move.**

```gherkin
Given focus is on a card
When I press the Space key and choose "Selesai"
Then the task moves, the change is announced, and focus stays on the card
```

**US-5 — Tugas saya.**

```gherkin
Given I am assignee of tasks in 3 projects and a member of Tim Ops, which is assigned 1 task in a project I cannot view
When I open Tugas saya
Then I see the tasks from the 3 projects grouped by due section, and not the Tim Ops task
```

**US-6 — Cross-organization isolation (v1.0 AC preserved).**

```gherkin
Given a task belongs to organization A
When a user of organization B requests it by ID or URL
Then the response is 404
```

**US-7 — Trash.**

```gherkin
Given I have manage on a project
When I delete a task
Then it moves to Sampah, disappears from views, and can be restored for 30 days with its column and order
When I restore it and its column was deleted
Then it returns to the board's first todo column
```

**US-9 — Ringkasan (app home).** ⛔ Void from v2.0 (D21): the org-level Ringkasan is removed. Per-project Ringkasan KPIs follow the same access rule: nothing from a project the viewer cannot open is counted.

**US-8 — Removed assignee (PRD-03).**

```gherkin
Given Budi is assignee of 12 open tasks
When Budi is removed with target Yacobus
Then all 12 are assigned to Yacobus in the same transaction and Yacobus gets one summary notification
```

**US-10 — Project space and landing.**

```gherkin
Given I have never opened project "Q4 Launch"
When I open it from the sidebar
Then the Papan tab is selected and the URL ends with /papan
When I switch to Daftar and later open the project again on the same device
Then the Daftar tab is selected
When I press → on the focused tab bar
Then the next tab is selected and focused
```

**US-11 — Project status (Should).**

```gherkin
Given I have manage on "Q4 Launch"
When I set status "Berisiko", target 30 Okt 2026 and a note
Then the header chip reads "Berisiko · target 30 Okt 2026", space.project.updated is published with before/after,
And project cards show "Berisiko" instead of "Tepat waktu"
Given I only have edit
Then the chip is read-only
```

**US-12 — Assignee picker respects access (QA C9).**

```gherkin
Given project "Rekrutmen & gaji 2027" is private to Rina
When Rina opens the assignee picker
Then Tim Sales is offered only if at least one active member of Tim Sales has an explicit grant on the project
And a member without access is not offered
Given an API call assigns the task to Budi, who cannot view the project
Then the response is VALIDATION and the task is unchanged
```


**US-13 — Create and edit a space.**

```gherkin
Given I am Admin
When I create space "Marketing" with icon "spark" and access "Semua anggota"
Then the space appears in the Space panel (v2.1.2: no Semua proyek page), and space.space.created is published
When I open "Edit" on the space and change the name to "Marketing & Brand"
Then the panel, the space page title and every project-card space chip show "Marketing & Brand" on the next render
Given another space is already named "marketing & brand"
Then saving is rejected with "Nama space sudah dipakai. Pilih nama lain."
```

**US-14 — Upload a space icon.**

```gherkin
Given I have manage on space "Marketing"
When I upload a 64×64 PNG of 20 KB in "Edit space" and save
Then the icon is stored as an organization asset and shown in the panel, the space page and the project-card chips
Given I upload a 3 MB JPG
Then the dialog shows "Ukuran ikon maksimal 1 MB." and nothing is uploaded
Given I upload a GIF
Then the dialog shows "Format belum didukung. Pakai PNG, SVG, JPG, atau WebP."
Given an uploaded SVG contains a script
Then the stored file has the script removed (sanitized) before it is served
```

**US-15 — Space deletion guard.**

```gherkin
Given space "Sales" holds 2 projects
When I choose "Hapus space"
Then nothing is deleted and the toast says "Space berisi 2 proyek. Pindahkan atau arsipkan proyeknya dulu."
Given the space is empty
Then it moves to Sampah, space.space.deleted is published (audited) and it can be restored for 30 days
```

**US-16 — Project inherits and never widens space access.**

```gherkin
Given space "Accounting & Finance" is Terbatas to Tim Keuangan
When I create project "Tagihan Vendor" in it
Then only Tim Keuangan (and Owner/Admin via audited override) can see the project
When I try to set the project to "Semua anggota"
Then the option is disabled with "Proyek tidak bisa lebih terbuka dari space-nya."
```

**US-17 — Semua proyek shows the owning space.** ⛔ *Void in v2.1.2 (D46); see the v2.1.2 change log.*

```gherkin
Given I can view 9 projects in 4 spaces and cannot view project "Rekrutmen & gaji 2027"
When I open Space in the rail
Then "Semua proyek" opens with tabs Semua 9 and one tab per space with its count
And each card shows the space chip of its owning space, and "Rekrutmen & gaji 2027" is neither listed nor counted
When I click the "Marketing" chip on a card
Then the Marketing space page opens
```

**US-19 — Create a subtask inline (D28a; release per D38).**

```gherkin
Given I have edit on Studio Desain and "Banner promo" has no subtasks
When I hover the row, choose "+ Tambah subtugas", type "Varian biru", set Penanggung jawab Sarah and press Enter
Then "Varian biru" is created with parent_task_id = Banner promo, in the first todo column, assigned to Sarah
And the input stays open for the next subtask, the parent shows "0/1" and a caret, and Sarah is notified
When I press Esc
Then the inline row closes and focus returns to "+ Tambah subtugas"
Given I try to add a subtask to "Varian biru"
Then the action is not offered (one level only)
```

**US-20 — Drag and drop in Daftar with a keyboard equivalent.**

```gherkin
Given "Rapikan aset brand" (no subtasks) and "Moodboard kampanye Q4" are top-level tasks in Belum dikerjakan
When I drag "Rapikan aset brand" onto the middle of "Moodboard kampanye Q4"
Then it becomes a subtask of "Moodboard kampanye Q4", keeps its own status, and a toast offers "Urungkan"
When I drag a parent that has subtasks onto the middle of another task
Then the nest indicator is not shown and nothing changes
When I drag "Moodboard kampanye Q4" onto the header of group Sedang dikerjakan
Then its status becomes Sedang dikerjakan, it is appended to that group, and its subtasks keep their statuses
Given I use only the keyboard
When I open the row ⋯ and choose "Jadikan subtugas dari…" › "Moodboard kampanye Q4"
Then the result is the same as the drag, and the move is announced via aria-live
```

**US-21 — Counts match the board (§6.13).**

```gherkin
Given Engineering has 4 open top-level tasks, 3 on board "Papan utama" and 1 on "Bug klien", plus 1 open subtask
When I open Papan with "Papan utama" selected
Then the Papan and Daftar tab counts show 3 and the board shows 3 open cards
```

**US-22 — Timeline import with the shared date grammar (D40, release 2).**

```gherkin
Given a CSV "Tugas,Mulai,Selesai" with rows "Riset,W1,W2" and "Uji,12 Okt 2026,9 Okt 2026" imported on Monday 28 Sep 2026
When I choose Impor and pick the file
Then the preview marks "Riset" as Siap (28 Sep → 9 Okt 2026) and "Uji" as "Tanggal tidak valid"
And "Impor 1 tugas" creates only "Riset"
Given a 600 KB file
Then it is rejected with "Ukuran file maksimal 512 KB."
```

**US-18 — List pattern: inline rename and bulk complete.**

```gherkin
Given I have edit on the project
When I hover a row in Daftar and choose "Ganti nama", type "Banner promo v2" and press Enter
Then the task title is saved with version check and space.task.updated is published
When I press Esc instead
Then the title returns to its previous value and nothing is saved
Given I select 3 rows and I have edit on only 2 of their projects (Tugas saya)
When I choose "Tandai selesai" in the bulk bar
Then 2 tasks move to their board's first done column in one transaction
And the toast says "2 tugas selesai. 1 tugas dilewati karena Anda hanya bisa melihat."
```

## 10. Edge cases

| Case | Behavior |
|---|---|
| Deleting a column with tasks | Blocked: "Pindahkan tugas di kolom ini dulu." |
| Moving a task to another project | Won't (release 1); duplicate-and-delete is not offered either |
| An assignee loses project access | Task stays assigned; it disappears from their Tugas saya; project managers see a "Tanpa akses" badge on the assignee |
| A team is deleted | Its tasks become unassigned (PRD-03 §6.4) |
| 5,000-task project in List | Server-side pagination (50 per page) and filtering |
| A due date in the past at creation | Allowed; shown as overdue immediately |
| A project is moved to a stricter space | Members who lose access see it disappear on their next request; their assigned tasks follow the "assignee loses access" rule |
| Uploaded space icon is deleted from storage | The panel falls back to the built-in "layers" icon |

## 11. Non-functional requirements

- Board load (≤ 300 visible tasks): p95 ≤ 800 ms server; LCP ≤ 2.5 s on a mid-range Android over 4G [H].
- Move persist: p95 ≤ 300 ms [H].
- Tugas saya: p95 ≤ 500 ms for ≤ 1,000 open tasks [H].
- ~~Semua proyek: p95 ≤ 500 ms for ≤ 200 viewable projects~~ (void, D46). Space page: p95 ≤ 500 ms for ≤ 50 projects in the space [H].
- Daftar: first 50 rows of each open group p95 ≤ 600 ms [H]; collapsed groups load on expand.
- Space icon upload: ≤ 1 MB, stored and visible p95 ≤ 3 s [H].
- WCAG 2.1 AA; all copy id-ID.

## 12. Dependencies

PRD-04 (containers, Share dialog, `checkBatch`), PRD-03 (Work Ownership: open tasks where the assignee is the user), PRD-00b (events, `due`, Schedulable), PRD-10 (rule table), PRD-12 (timezone), PRD-13 (trash and purge).

## 13. Open questions

| # | Question | Proposed default |
|---|---|---|
| Q1 | Is the 30 s refresh enough for the pilot? | Yes; revisit realtime in release 2 |
| Q2 | Should "Tugas saya" include tasks created by me but unassigned? | No |
| Q3 | Where do members without Space access land? | Desk › Kotak masuk (D20), which every member has |
| Q5 | Subtasks and labels: release 2 or later? | **Subtasks designed (D28a); release = D38**, recommended release 2 (not counted in PRD-00 v1.2.7 §4.2 step 8; estimate in §6.12). Labels release 2 (D28b, open) |
| Q6 | Do uploaded space icons need moderation? | No; only manage can upload, uploads are audited in `space.space.updated` |
| Q4 | Should project status become automatic (e.g. "Berisiko" when > 20% open tasks are overdue)? | No in release 1: manual status + visible overdue count; revisit with pilot data |
