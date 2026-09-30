# PRD-08 — Doc

> ## Project Doc tab — slide-out preview (v1.1.3 — 29 Sep 2026, D47 revised)
>
> **Replaces the preview panel of v1.1.2 below** (PO: "seperti slide out modal"). The clean list of v1.1.2 stays. Prototype v18.3.
>
> - **Slide-out modal:** choosing a doc opens a sheet docked right over the dialog scrim (`role="dialog"`, `aria-modal="true"`, labelled by the doc title). Width min(720 px, viewport − 16), full height with an 8 px inset, `radius-xl`, `shadow-elevation-5`; slides in 24 px + fades (none with reduced motion). ≤ 767 px: full screen, no radius.
> - **Header (56 px):** previous / next doc (outline sm icon pair, disabled at the ends) · **Edit** (outline sm; closes the sheet and opens the doc page, D39) · **Bagikan** (outline sm; the doc share dialog) · close (ghost icon, "Tutup · Esc").
> - **Body:** doc tile + title (24/32) + "Doc  Diperbarui {tanggal} oleh {nama}" · linked-project chips · divider · content read-only (16/24, max. 640 px). Empty doc: "Doc ini masih kosong. Pilih Edit untuk mulai menulis."
> - **Focus:** it moves into the sheet on open and stays inside it (Tab and Shift+Tab wrap). Esc, close or the scrim closes it; focus returns to the row of the doc **last shown** (after previous/next too). **Bagikan** opens the share dialog; closing that dialog returns to the sheet with focus on Bagikan.
> - The chat/agent launcher is hidden while the sheet is open (PRD-17 §10.2).
>
> ```gherkin
> Given Studio Desain has 2 linked docs
> When I choose "Cara mengajukan permintaan" in its Doc tab
> Then a sheet slides in from the right over a scrim with Edit, Bagikan and Close
> And pressing Tab repeatedly never moves focus outside the sheet
> When I choose Next doc and then press Esc
> Then the sheet closes and focus is on the "Logo dan warna Maju Jaya" row
> When I open a doc, choose Bagikan and close the share dialog
> Then the sheet is open again with focus on Bagikan
> When I choose Edit
> Then the sheet closes and the doc page opens, ready to type
> ```

> ## Project Doc tab amendment (v1.1.2 — 29 Sep 2026, D47) — *preview panel superseded by v1.1.3 above; list rules stay*
>
> Binding for the **Doc tab inside a project** (release 3). Prototype v18.2.
>
> - **Clean list, no table.** Header: "Doc terkait" + count · **Tautkan Doc** (ghost sm) · **Doc baru** (outline sm; the project header keeps the only default button). One row per linked doc: doc icon tile 32 px · title (14/20 600, one line) · first line of content as excerpt (13/20 `fg-subtle`, one line) · owner avatar + first name · updated date. Rows 64 px min, divider between rows, hover `bg-muted`, selected `bg-subtle`. No column headers.
> - **Preview panel** (like a file preview): choosing a row opens a panel on the right (list 280–380 px, preview fills the rest; sticky, max. viewport height). Header: doc icon · title · "Doc  Diperbarui {tanggal} oleh {nama}" · **Edit** (outline sm, opens the doc page where typing starts, D39) · **Bagikan** (outline sm, the doc share dialog) · close (ghost icon). No "expand" button: Edit already opens the full page. Body: linked-project chips, then the doc content read-only (`type-body-lg` 16/24, headings 20/28, lists, quotes, code). Empty doc: "Doc ini masih kosong. Pilih Edit untuk mulai menulis."
> - **Keyboard:** rows are buttons (`aria-pressed`, `aria-controls` the panel); ↑/↓ moves between docs and updates the preview; **Esc** closes it and focus returns to the row. Choosing the selected row again closes the preview.
> - **< 1024 px:** the preview replaces the list, with a **back** button instead of close; focus moves to it.
> - Leaving the project's Doc tab closes the preview, so returning starts from the list.
> - Empty tab: "Belum ada Doc terkait" with the same two actions.
>
> ```gherkin
> Given Studio Desain has 2 linked docs
> When I open its Doc tab
> Then I see 2 rows with title, excerpt, owner and date, and no table header
> When I choose "Cara mengajukan permintaan"
> Then a preview opens on the right with Edit, Bagikan and Close, showing the doc content read-only
> When I press the Down arrow
> Then the preview shows "Logo dan warna Maju Jaya"
> When I press Esc
> Then the preview closes and focus is on the "Logo dan warna Maju Jaya" row
> Given the screen is narrower than 1024 px
> When I choose a doc
> Then the preview replaces the list and focus moves to "Kembali ke daftar Doc"
> ```

> ## Agent provenance & languages amendment (v1.1.1 — 28 Sep 2026)
>
> - **Docs created by an agent** (PRD-17 v1.0 §9.4) show a collapsible provenance block under the meta line: *Dibuat oleh {agent}, disetujui {nama}, {tanggal}* and **Sumber** (links to the tasks, docs and messages used; sources the reader cannot open are counted as "{n} sumber terbatas"). At permission level *Draf* the doc is saved as a draft visible only to the approver until published.
> - **Languages (D45):** editor chrome, slash menu, SaveStatus and import/export dialogs follow the viewer's language (English default). Doc content is never translated. Markdown shortcuts are language-independent.

> ## Always-editable editor amendment (v1.1 — 28 Sep 2026)
>
> Binding with v1.0.1–v1.0.3; **release stays 3** (PRD-00 §3.3). Adds decisions **D39** (editor model) and **D40** (import). Prototype: "Prototipe agere/org v17.1", rail › Doc. Design system: **Agere DS 6.4** (Patterns › Block editor, `SaveStatus`). Supersedes E4 (*Edit / Selesai* toggle), E5 (import as a **read-only** doc) and the "edit mode" wording of E6.
>
> ### 1. Why (PO lens)
>
> | | |
> |---|---|
> | Problem | v1.0.3 asked the reader to switch into *Edit* before typing and to press *Simpan*. In the PO review of prototype v15 (28 Sep 2026) the mode switch and the placeholder text ("Mulai menulis di sini", and "Doc tanpa judul" inserted as the real title) were rejected: the placeholder became saved content as soon as the user typed next to it. No pilot data exists yet [Hypothesis: Needs Validation — measure mode-switch drop-off if Option B of an Edit mode is ever reconsidered]. |
> | Decision (D39, PO 28 Sep 2026) | A doc is **always editable** for anyone with edit access, **autosaved**, and **never shows placeholder text**, like Notion. Readers without edit access get the same page read-only. |
> | KPI | Time from *Doc baru* to first saved character ≤ 5 s (median, [Hypothesis: Needs Validation]); docs created in a session that are later edited again ≥ 40 % (retention of the doc habit, [Hypothesis]); zero docs saved with placeholder strings (measurable: search for the old strings = 0). |
> | Opportunity cost | Without it, SOPs stay in Google Docs and Doc stays a viewer; Doc's value to the Desk → Space loop ("Jadikan tugas") is lost. |
>
> ### 2. MoSCoW (release 3)
>
> | Must | Should | Could | Won't (release 3) |
> |---|---|---|---|
> | Always-editable title + body, autosave with `SaveStatus`, no placeholder, slash menu, Markdown shortcuts, block handle (+ / ⋮⋮), to-do blocks, task mention, *Jadikan tugas* from a selection, import `.md` / `.markdown` / `.txt` (D40), export menu | Selection toolbar (Bold · Italic · Strike · Code), version history (last 30 versions) | Real-time co-editing presence (avatars), toggles, images | Comments inside a doc, public links (D27), embeds |
>
> ### 3. Behaviour
>
> - **F1 — New doc (D39).** *Doc baru* creates an empty doc (title `""`, body = one empty paragraph) and opens it with the caret in the title. **No placeholder** is rendered in the title or in empty blocks (UI-01 v2.4 "Tanpa placeholder"). Enter in the title moves the caret to the first block. A doc with an empty title is listed as **"Tanpa judul"** in the panel, Semua Doc, search and breadcrumbs — a *list label*, never text inside the editor.
> - **F2 — Autosave.** Every change is saved 500 ms after the last keystroke with a version check (TECH-01 v1.3 F13). The page toolbar shows `SaveStatus` (DS 6.4): *Tersimpan* → *Menyimpan…* → *Tersimpan*; on failure *Gagal menyimpan* + *Coba lagi*; offline *Offline — perubahan disimpan di perangkat ini* and a retry when back online. There is **no Save button and no Edit/Selesai toggle**.
> - **F3 — Blocks.** Paragraph, Judul 1 (`type-heading-xl` 24/32), Judul 2 (`type-heading-lg` 20/28), Daftar poin, Daftar nomor, Daftar tugas (checkbox, click toggles), Kutipan, Kode (`type-code` 13/20), Pemisah, **Sebut tugas** (non-editable chip that opens the task modal). Body text `type-body-lg` 16/24; title `type-display-lg` 36/44, weight 600.
> - **F4 — Slash menu.** `/` anywhere opens a listbox of the F3 blocks, filtered as the user types; ↑ ↓ Enter; Esc or a double space closes it and keeps the typed text.
> - **F5 — Markdown shortcuts.** `#` + Space → Judul 1, `##` → Judul 2, `-` / `*` → Daftar poin, `1.` → Daftar nomor, `[]` → Daftar tugas, `>` → Kutipan; `---` + Enter → Pemisah; ```` ``` ```` + Enter → Kode. Backspace at the start of a heading/quote/code turns it back into a paragraph.
> - **F6 — Block handle.** On hover the left gutter shows **+** (insert a block below and open the slash menu) and **⋮⋮** (menu: *Ubah jadi…*, *Duplikat*, *Hapus blok*). Every gutter action is reachable from the slash menu or a shortcut (keyboard parity).
> - **F7 — Selection toolbar.** Selecting text shows a floating toolbar: **B** · *I* · ~~S~~ · `Kode` · **Jadikan tugas** (opens *Tugas baru* with the selection as title and "Dari Doc {judul}." in the description).
> - **F8 — Import (D40).** Semua Doc header action **Impor** (outline, the general verb because formats will grow). The dialog lists the supported formats: **Markdown** (`.md`, `.markdown`: headings, lists, to-dos, quotes, code) and **Teks biasa** (`.txt`: blank lines split paragraphs); max **1 MB**. The file becomes a **normal, editable doc** (E5's read-only rule is void: File is on hold, D22, so there is no source record to keep in sync); the source file name is shown as a badge ("`.md`") in lists. Errors: "Format .{ext} belum didukung. Gunakan .md, .markdown, atau .txt." · "Ukuran file maksimal 1 MB."
> - **F9 — Export.** Doc ⋯ › *Ekspor*: Markdown (`.md`) now; PDF, Word, HTML stay as in v1.0.2 (release 3, same menu). Downloads go through the browser download flow with user confirmation.
> - **F10 — Page chrome.** Toolbar (sticky, 53 px): folder crumb (caption, `fg-subtle`) · `SaveStatus` · last editor avatar · **Bagikan** (outline sm) · ⋯ (ghost icon sm: Ekspor, Salin tautan, Pindahkan ke folder, Tautkan ke proyek, Pindahkan ke Sampah). Meta line under the title: owner · updated · linked projects as chips + **Tautkan** (ghost chip, visible on hover/focus).
>
> ### 4. Layout & DS spec (Agere DS 6.4)
>
> ```
> ┌ doc toolbar (sticky, border-b, bg-background/88 + blur) ───────────────────────────────┐
> │ 📁 SOP Operasional                     ✓ Tersimpan  (RK)  [Bagikan]  [⋯]             │
> └────────────────────────────────────────────────────────────────────────────────────────┘
>            ┌ article max-w 760, px 40, pt 56, pb 160 ─────────────────────────┐
>        + ⋮⋮│ Cara mengajukan permintaan            ← display-lg 36/44 · 600    │
>            │ Yacobus · Diperbarui 25 Sep 2026 · [SD Studio Desain] [Tautkan]   │ caption 13, gap 8/16
>            │ ───────────────────────────────────────────── border-default ───  │ mb 24
>            │ Paragraph …                                ← body-lg 16/24        │ blocks 2 px apart
>            └──────────────────────────────────────────────────────────────────┘
> ```
>
> | Part | Layout | Spacing | Type | Color / elevation |
> |---|---|---|---|---|
> | Article | block, centered | max-w 760; padding 56 / 40 / 160 (390 px: 32 / 20 / 120) | — | `bg-background` |
> | Title | contenteditable `h1` | mb 8 | `type-display-lg` 36/44, 600 (390 px: 28/36) | `fg-emphasis` |
> | Meta | flex wrap | gap 8 × 16; pb 16; mb 24; border-b | 13/20 | `fg-subtle`; chips `bg-subtle`, radius md, h 24 |
> | Gutter | flex, absolute, left −56 px | gap 2; buttons 24 × 24 | — | icons `fg-muted` → hover `bg-subtle` / `fg-emphasis` |
> | Slash menu | Popover listbox 280 × ≤ 320 | items min-h 44, icon tile 32 radius md | label 14, hint `caption` | `bg-popover`, `shadow-lg` |
> | Selection toolbar | fixed, flex | p 4, gap 2; buttons h 28 | 13 | `bg-popover`, border, `shadow-lg`, radius md |
> | To-do | list, checkbox 16 radius xs at left 0 | pl 28 | body-lg | checked: `brand-default` fill, text `fg-subtle` + strike |
> | Task chip | inline-flex h 26 | px 8, gap 6 | 14 / 500 | border `border-default`, `bg-surface`, radius md |
>
> ### 5. States
>
> | State | Behaviour |
> |---|---|
> | Ideal | Editable page, `SaveStatus` = Tersimpan |
> | Empty (new doc) | Empty title with caret, one empty paragraph; **no placeholder text**; the gutter + and `/` are the only affordances |
> | Loading | Skeleton title bar + 3 paragraph bars; editor mounts read-only until the version is known |
> | Error (save) | `SaveStatus` error + *Coba lagi*; content stays in the editor; after 3 failures a banner "Perubahan belum tersimpan. Salin isi sebelum menutup halaman." |
> | Partial / edge | Conflict (another editor saved a newer version): banner "Doc ini baru saja diubah {nama}. Muat versi terbaru" — local changes are kept as a draft version, never discarded; read-only viewers see the page without gutter, toolbar or slash menu |
>
> ### 6. User stories & acceptance criteria
>
> **US-D1 — Write immediately, no placeholder.** *As a member, I want a new doc to open ready to type, so that I start writing without a mode switch.*
>
> ```gherkin
> Given I can edit docs in Maju Jaya
> When I choose "Doc baru"
> Then a doc opens with the caret in an empty title and one empty paragraph
> And no placeholder text is rendered anywhere in the editor
> And the panel lists the doc as "Tanpa judul"
> When I type "SOP Gudang", press Enter and type "Langkah pertama"
> Then 500 ms after the last keystroke SaveStatus shows "Menyimpan…" then "Tersimpan"
> And the panel label changes to "SOP Gudang"
> ```
>
> **US-D2 — Blocks from the keyboard.**
>
> ```gherkin
> Given the caret is at the start of an empty paragraph
> When I type "[]" and Space
> Then the paragraph becomes a to-do item and the caret stays in it
> When I type "/kode" and press Enter
> Then the block becomes a code block
> When I press Esc while the slash menu is open
> Then the menu closes and the typed "/" text stays in the paragraph
> ```
>
> **US-D3 — Autosave failure keeps the text (edge).**
>
> ```gherkin
> Given the network drops while I type
> When autosave fails
> Then SaveStatus shows "Gagal menyimpan" with "Coba lagi" and my text stays on screen
> When the connection returns and I choose "Coba lagi"
> Then the change is saved with a version check and SaveStatus shows "Tersimpan"
> Given Sari saved version 12 while my page still holds version 11
> When my autosave sends version 11
> Then the server rejects it with 409, my change is kept as a draft version and the conflict banner appears
> ```
>
> **US-D4 — Import keeps formats honest (D40).**
>
> ```gherkin
> Given I choose "Impor" on Semua Doc and pick "rapat.markdown" (40 KB) whose first line is "# Catatan rapat"
> Then a new editable doc "Catatan rapat" is created with its to-do items as to-do blocks and opened
> Given I pick "laporan.docx"
> Then the dialog says "Format .docx belum didukung. Gunakan .md, .markdown, atau .txt." and nothing is created
> Given I pick a 1.4 MB ".md" file
> Then the dialog says "Ukuran file maksimal 1 MB."
> ```
>
> **US-D5 — Text to task.**
>
> ```gherkin
> Given I select "Kirim notulen ke klien" in a doc linked to Studio Desain
> When I choose "Jadikan tugas" in the selection toolbar
> Then "Tugas baru" opens with that title, project Studio Desain and description "Dari Doc {judul}."
> ```
>
> ### 7. Edge-case audit & trade-offs
>
> - **Accidental edits** in an always-editable page: mitigated by version history (Should) and *Urungkan* (Ctrl+Z) per session; readers without edit access never get an editable surface.
> - **Autosave storms:** 500 ms debounce + coalescing on the server; publish at most one `doc.page.updated` event per doc per user per 5 minutes of continuous editing (the save itself is not throttled) [Hypothesis: Needs Validation — confirm against the PRD-00b outbox budget in release 3 planning].
> - **Paste from Word/Google Docs:** sanitized to the F3 block set; unknown formatting becomes plain text.
>
> | | Option A — Pragmatic | Option B — Strategic |
> |---|---|---|
> | Engine | Wrap an existing editor engine (Tiptap / ProseMirror or Lexical) styled with DS 6.4 tokens | Build a custom contenteditable block model (as in the prototype) |
> | Effort (release 3, [H]) | BE 2 · FE 6 | BE 3 · FE 14 |
> | Risk | Library bundle size (~120 KB gz), upgrade cadence | IME / mobile keyboards, paste sanitation, undo stack — long tail of editor bugs |
> | Collaboration later | Yjs bindings exist | Must be designed |
> | **Recommendation** | **Choose A.** The prototype's editor is a behaviour spec, not the implementation. | — |
>
> **Capacity (release 3, Option A, [H]):** BE 2 (autosave endpoint with version check, import parser, export .md), FE 6 (engine integration, slash menu, shortcuts, gutter, selection toolbar, SaveStatus, import dialog). Re-estimate at release 3 planning.


> ## Doc redesign & folders amendment (v1.0.3 — 27 Sep 2026)
>
> Binding with v1.0.1 and v1.0.2; release stays **3** (PRD-00 §3.3). Adds decision **D26** and the Doc parts of C-18. Prototype: "Prototipe agere/org v13", rail › Doc.
>
> - **E1 — Folders are the primary structure (D26).** The Doc panel shows **Semua Doc** + a **folder tree** (collapse/expand, doc count per folder). Header actions (icon buttons): **Folder baru**, **Doc baru**, **Impor .md**, **?** (Panduan). Folder ⋯: *Doc baru di folder ini*, *Ganti nama*, *Hapus folder*. Deleting a folder never deletes docs: its docs move to **"Tanpa folder"** (created on demand, removed when empty) and the toast says how many moved. Folder names are unique per organization (case-insensitive), ≤ 60 characters. Folders are ACL containers (v1.0.1 rule 1); moving a doc applies the target folder's ACL immediately (PRD-04 I2) and shows the access-change warning when access narrows or widens.
> - **E2 — Moving docs.** Doc ⋯ › *Pindahkan ke folder* (list with the current folder ticked, plus *Folder baru…*) and **drag a doc onto a folder** in the panel or on Semua Doc (drop target highlighted). Both publish `doc.page.moved`.
> - **E3 — Semua Doc page.** Header "Doc" + "{n} Doc dalam {m} folder" + actions *Folder baru* · *Impor .md* · primary **Doc baru**. Body = the list pattern (PRD-06 §6.10) grouped by folder: Nama · Pemilik · Diperbarui · ⋯.
> - **E4 — Doc page.** Breadcrumb **Doc › {folder} › {doc}**; top row = meta line (folder · owner · updated) on the left and an attached **ButtonGroup** on the right: *Edit* (→ *Selesai*, pressed state black) · *Ekspor ⌄* (PDF, Word .docx, HTML, Markdown) · *Lepas dari proyek* (when opened from a project). For docs created from `.md`: *Perbarui .md* · *Jadikan editable* · *Ekspor*. Second row: source badge (.md) and **Proyek terkait** chips + *Tautkan*.
> - **E5 — Markdown import (C-18).** A `.md` file becomes a **read-only** doc (headings, paragraphs, lists, to-dos, tables, quotes, code); re-uploading a file with the same name updates it; *Jadikan editable* detaches it (stops syncing). Export to PDF, DOCX, HTML and MD runs client-side.
> - **E6 — Block editor.** Edit mode shows per-block tools (+ between blocks, drag handle, delete with "Urungkan" for 5 s); `/` in an empty block opens the block type menu. Table cells are editable in place.
> - **E7 — Docs in projects (replaces v1.0.2 D1, pinned doc tabs).** Project view **Doc** (PRD-06 §6.7): list of related docs + **Baru** · **Impor** · **Tautkan** (ButtonGroup). A doc can relate to several projects (`page_projects`), which never changes its access.
> - **E8 — No duplicate navigation.** When the Doc panel is open, the page's own doc tree is hidden (it appears only when the panel is collapsed, Ctrl+B).
> - **Events:** `doc.folder.created` / `.renamed` / `.deleted` (deleted audited), `doc.page.moved`, `doc.page.imported`, `doc.page.exported` (no audit).
> - **Capacity (release 3, [H]):** folders + move + drag + Semua Doc: BE 1.5, FE 2; re-estimate at release 3 planning.
>
> **Acceptance criteria (additions):**
>
> ```gherkin
> Given folder "Panduan Brand" holds 2 docs
> When I delete the folder
> Then both docs move to "Tanpa folder", no doc is deleted, doc.folder.deleted is audited
> And the toast says "Folder dihapus. 2 Doc dipindah ke "Tanpa folder"."
>
> Given I drag "Cara mengajukan permintaan" onto folder "SOP Operasional"
> Then the doc appears in that folder, takes the folder's access, and doc.page.moved is published
> Given the folder is Terbatas and the doc was Semua anggota
> Then before the move completes I see "Akses Doc ini akan mengikuti folder SOP Operasional (Terbatas)." with "Pindahkan" and "Batal"
>
> Given a folder named "Keuangan" exists
> When I create a folder named "keuangan"
> Then it is rejected with "Folder dengan nama itu sudah ada."
> ```

> ## Release status & alignment addendum (v1.0.1 — 25 Sep 2026)
>
> **Release:** deferred to **release 3** (PRD-00 §3.3). It is not part of the MVP.
>
> **Before build:** upgrade to template v1.1. Until then, these rules are binding and **override any conflicting v1.0 text**:
>
> 1. **Access:** folders and top-level pages are ACL containers; nested pages, blocks and embedded files inherit (PRD-04 §6.4). "Hanya saya" is the default for personal pages.
> 2. **Deletion:** "Permanent delete" means immediate purge from Sampah by a user with manage. Otherwise trash items purge after 30 days (PRD-13).
> 3. **Decisions required before build:** single-writer lock vs real-time co-editing (autosave with two editors must never silently lose data), and version history (required for release).
> 4. **Editor:** use a maintained open-source block editor [Hypothesis]. Video/audio blocks are out of the first Doc release; file blocks use PRD-07.
> 5. **Events:** `doc.page.trashed` / `.restored` / `.purged` per the PRD-00b catalog (audited).


> ## Project & QA amendment (v1.0.2 — 26 Sep 2026)
>
> Binding with the v1.0.1 addendum; release stays **3**.
>
> - **D1 — Pinned doc tabs (PRD-06 §6.7).** A page can be pinned as a tab in a project by **manage** on the project ("Sematkan dokumen…" or "Dokumen baru" from "+ Tampilan"). The tab shows a read view with "Edit di Doc" and "Lepas dari tab". Pinning never changes the page's access: a member who cannot view the page does not see the tab. Unpinning does not delete the page. "Project association" in §3 means `pages.project_id` plus the pin; pinned pages also appear under the project in the sidebar tree.
> - **D2 — To-do → task (QA PO1).** The block menu of a to-do has **"Jadikan tugas"** (project with edit, assignee, due). The block then shows a chip with the task status, assignee and due date; ticking the to-do moves the task to its board's first `done` column and unticking moves it to the first `todo` column (requires edit on the project; otherwise the checkbox is reverted with "Anda tidak punya akses edit ke tugas tertaut."). The task's description and `data.source = {module:"doc", type:"page", id, block}` link back. Readers without access to the project see "Tugas terbatas". `@orang` and `#tugas` inside Doc text follow the Chat token model (PRD-14 §6) [Should].
> - **D3 — Access clarity (QA DC1).** The access button on a page in a folder reads "Akses: folder {nama}" (aria "Akses halaman ini mengikuti folder {nama}. Kelola akses folder"). "Halaman baru" asks for a location (folder or Pribadi) instead of silently using the first folder. Per-page access for confidential pages is evaluated with the design partners [Hypothesis].
> - **D4 — Backlog decided (QA PO2, PO4, DC2–DC4).** Should: inline comments per block with resolve and a document status Draft / Review / Disetujui. Could: templates (PRD, notulen, SOP; organization templates). Must for the editor choice: table header placeholders, keyboard exit from tables (Esc, ↓ on the last row), markdown shortcuts ("- ", "1. ", "[] ", "> ", "#"), "Pindahkan ke…" with an access-change warning. Version history always contains the initial version (QA DC5).

---

## 1. Problem

Teams need a shared organizational knowledge layer for strategy, meeting
notes, requirements, research, and operational documentation.

## 2. Goal

Provide a Notion-style document workspace integrated with Agere projects
and files.

## 3. Features

### Structure

- Folders
- Documents/pages
- Unlimited nested pages
- Breadcrumbs
- Favorites
- Trash
- Restore
- Permanent delete

### Editor

- Headings
- Paragraphs
- Lists
- To-dos
- Toggles
- Quotes
- Code
- Tables
- Images
- Video/audio
- Files

### Page options

- Icon
- Cover
- Full width
- Small text
- Autosave

### Navigation

- Search
- Table of contents
- Current-heading highlight
- Project association

## 4. Success metrics

- Documents created per active organization
- Weekly active writers
- Search-to-document-open rate
- Autosave failure rate

## 5. Acceptance criteria

**Given** a user edits a document, **When** changes are made, **Then**
autosave persists them without requiring manual save.

**Given** a page is nested under another page, **When** the user opens
it, **Then** breadcrumb and parent navigation remain accurate.

**Given** a deleted page is in trash, **When** a user restores it,
**Then** the page returns to its previous hierarchy where valid.

**Given** an unauthorized user accesses a document URL directly,
**Then** server-side authorization blocks access.
