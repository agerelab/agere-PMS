# PRD-02 — Organization

| Field | Value |
|---|---|
| Version | 1.2.1 (supersedes 1.2) |
| Status | Draft — release 1 |
| Owner | [TBD — Product Owner agere/org] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE (PRD-00) |
| Depends on | PRD-01, PRD-04, PRD-00b, PRD-13 |
| Resolves review items | Per-PRD gaps for 02 (lifecycle, slug, creation rules, default organization); C-05 (ownership transfer); C-06 (organization default timezone); C-07 (organization settings location) |

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> **Amendment 26 Sep 2026 — QA v10 (QA-01):**
> - **Pending deletion (AD5, AD6, release 1.1):** while an organization is `pending_deletion`, edit controls are disabled with the reason inline (not a toast after clicking); blocked members see a page without navigation that states the deletion date and offers "Unduh data saya".
> - **Organization security policy (AD9, release 2):** Organisasi › Umum › Keamanan: require MFA, allowed email domains for invitations, session timeout.

### Change log v1.2 → v1.2.1 (28 Sep 2026 — two languages, D45)

- **Organization default language** (`organizations.default_locale`: `en` | `id`, default **`en`**): chosen in onboarding step 1 *Organisasi* next to the time zone, editable in Kelola › Umum by Owner/Admin. It sets the language for new members without a preference, invitations, public forms (PRD-15) and the content seeded by *Titik mulai* presets (space, project and column names, the three example tasks). Seeded content is then ordinary user content and is not translated when the default changes.
- Changing the default does not change members who chose a language themselves (PRD-12 v1.2.3).

### Change log v1.1.1 → v1.2 (28 Sep 2026 — onboarding in three steps, D30)

- **Onboarding has three steps (D30, decided by the PO on 28 Sep 2026):** **Organisasi → Titik mulai → Undang tim** (§8.1). The new middle step picks a starting structure (three presets) that seeds the first space and its projects; *Mulai di sini* is always included.
- **Landing after creation follows D20:** the user lands on **Desk › Kotak masuk** with the non-forced **"Selamat datang"** card (five optional steps, PRD-18); there is no product tour (PRD-18 Won't). The previous text (land on the starter project; later sign-ins on Project › Ringkasan) is void: Ringkasan was removed by D21 and the hierarchy is Space → Project since D18.
- The Amendment of 25 Sep 2026 (Space → Project) is superseded by C-18: URLs are `/{slug}/s/{space}/…` (PRD-06 v2.0 §6.5).
- Capacity: PRD-00 v1.2.7 §4.2 step 8 (BE +1, FE +1).

### Change log v1.0 → v1.1

- The organization slug is in every URL (`/{slug}/…`), so the active organization is always explicit.
- Defined the lifecycle state machine, creation rules and the default organization after sign-in.
- Added ownership transfer, organization deletion with a 30-day grace period, and a default timezone.
- Organization settings live under **Organisasi › Umum**; personal Settings (PRD-12) never holds organization controls.

---

## 1. Problem

Everything in agere/org is scoped to an organization. v1.0 named the entity but did not define:

- How the active organization is determined.
- What "lifecycle" means.
- How ownership changes hands.
- What happens when an organization is deleted.

## 2. Goal

One canonical Organization entity: always unambiguous in the URL, safely owned, and deletable in a way that is reversible for 30 days and then complete.

## 3. Personas & jobs to be done

| Persona | Job to be done |
|---|---|
| Founder / first user | "I want to create my company's workspace in under a minute and invite my team." |
| Member of several organizations (agency, consultant) | "I never want to wonder which company I'm working in." |
| Owner | "When I leave or hand over the company, ownership must move cleanly, and deletion must not be an accident." |

## 4. Success metrics

| Metric | Target | Window | Type |
|---|---|---|---|
| Organization setup completion (started → created) | ≥ 90% [H] | Weekly | Primary |
| Organization activation (PRD-00 §2) | ≥ 70% pilot [H] | Cohort | Primary (feeds the North Star) |
| Cross-organization data leakage | **0** | Continuous | Guardrail |
| Requests to organization-scoped routes without valid organization context | **0** (rejected by design) | Continuous | Guardrail |
| Accidental deletions restored within the grace period | Tracked; every restore request succeeds | Monthly | Guardrail |

## 5. Scope

**Must (release 1):**

- Create organization.
- Display name (required); legal name (optional).
- Logo.
- Slug.
- Default timezone.
- URL-based organization context and switcher; default organization after sign-in.
- **Organisasi › Umum** settings.
- Lifecycle.
- Last-Owner invariant; ownership transfer.
- Organization deletion (30-day grace, then purge per PRD-13).
- Platform suspension (platform admin only).

**Won't (release 1):**

- Changing the slug.
- Custom domains.
- Merging organizations.
- Multiple locales per organization (release 1 is id-ID only).
- Billing fields (PRD-00 §3.3).

## 6. Design

### 6.1 Entity

| Field | Rule |
|---|---|
| `organization_id` | `org_…`; the canonical tenancy key. `tenant` may describe the architecture but is never a competing entity name. |
| `slug` | 3–40 characters, `[a-z0-9-]`, no leading/trailing `-`, globally unique, reserved words blocked (`masuk`, `api`, `admin`, `settings`, `pengaturan`, …). Generated from the display name and editable at creation; **immutable afterwards** in release 1. |
| `display_name` | 2–80 characters; shown everywhere |
| `legal_name` | Optional, ≤ 120 characters; reserved for future invoices |
| `logo` | PNG/JPG/WebP ≤ 2 MB, square-cropped to 256 × 256 px; stored in object storage (Vercel Blob [H]). Without a logo, show the first letters of `display_name` in an `Avatar`. |
| `default_timezone` | IANA name; default `Asia/Jakarta`. Used when a member has no personal timezone (PRD-12). |
| `status` | See §6.4 |

### 6.2 Organization context (URL)

- Every organization-scoped page and API lives under **`/{slug}/…`**, for example `/maju-jaya/projects/prj_1`.
- On each request the server resolves `slug → organization_id`, then runs PRD-04 L1. Not a member (or unknown slug) → **404**, following PRD-04 E6.
- Opening a URL for another organization the user belongs to simply works in that organization; the URL *is* the context. The header always shows the current organization's logo and name.
- The session stores `last_organization_id` (PRD-01 §6.2), used **only** to pick the landing page after sign-in.

**Landing after sign-in:**

1. `redirect_to` if present.
2. Otherwise `/{slug of last_organization_id}` if the user is still an active member.
3. Otherwise, if the user has exactly one organization, that organization.
4. Otherwise the organization picker ("Pilih organisasi").
5. With no organizations and no pending invitations: onboarding ("Buat organisasi").

### 6.3 Creation

- Any user with a verified email can create an organization; limit **5 organizations created per user** [H] (abuse control).
- The creator becomes the **Owner**. The Space app (`space`) is enabled with app access for the Owner (PRD-04 §6.5). The **Titik mulai** chosen in onboarding (§8.1) seeds one space with its projects; every preset includes the starter project **"Mulai di sini"** with 3 example tasks [H: validate in pilot]. The user lands on **Desk › Kotak masuk** (D20) with the "Selamat datang" card.
- Publishes `org.organization.created` (audited).

### 6.4 Lifecycle

```text
active ──(Owner deletes, re-auth)──▶ pending_deletion ──(30 days)──▶ purged
  ▲                                        │
  └──────(Owner cancels within 30 days)────┘
active ◀──▶ suspended     (platform admin only; e.g., abuse or legal hold)
```

| Status | Member access | Notes |
|---|---|---|
| active | Normal | |
| pending_deletion | **Owners only**, read-only, with a banner "Organisasi ini akan dihapus permanen pada 24 Okt 2026. Batalkan penghapusan." Other members get the NOT_MEMBER-style page "Organisasi ini sedang dijadwalkan untuk dihapus." | No notifications except the deletion notices |
| suspended | None; the page says "Organisasi ini ditangguhkan. Hubungi support agere." | Actions audited with `actor.type = platform_admin` |
| purged | Gone; the slug stays reserved for 90 days [H] | Purge per PRD-13 |

### 6.5 Ownership

- **Invariant:** an organization in `active` status always has ≥ 1 active Owner. It is enforced server-side for demotion, removal, suspension and self-leave (PRD-03 R3, PRD-04 G3).
- An organization may have several Owners. Only an Owner grants the Owner role (PRD-04 matrix).
- **Transfer ownership ("Alihkan kepemilikan"):** an Owner selects an active member. Re-authentication is required (PRD-01 §6.3).
  - The target becomes Owner; the initiator chooses to stay Owner or become Admin.
  - Publishes `org.ownership.transferred` (audited; both parties notified).
- **Deleting the organization:** Owner only, with re-authentication. The confirmation requires typing the slug.

### 6.6 Information architecture

`Organisasi › Umum` holds display name, legal name, logo, slug (read-only) and default timezone, plus a **"Zona berbahaya"** card with "Alihkan kepemilikan" and "Hapus organisasi". Siblings: Anggota, Tim (PRD-03), Akses, Aplikasi (PRD-04), Audit (PRD-11).

- Members can view Umum read-only.
- Only Owner/Admin can edit (PRD-04 matrix), and only Owners see the Zona berbahaya actions.

## 7. Events (PRD-00b catalog)

| Event | Audit | Notify |
|---|:-:|---|
| `org.organization.created` | ✓ | — |
| `org.organization.updated` | ✓ | — |
| `org.ownership.transferred` | ✓ | new and previous Owner |
| `org.organization.deletion_scheduled` | ✓ | all Owners and Admins (email + in-app) |
| `org.organization.deletion_cancelled` | ✓ | all Owners and Admins (in-app) |
| `org.organization.suspended` / `.reactivated` | ✓ | Owners (email) |

## 8. UX

Agere DS: organization switcher = `DropdownMenu` in the `Sidebar` header (logo `Avatar` + display name + chevron). Items: the organization list, "Buat organisasi" and pending invitations with a `Badge` "Undangan". Onboarding uses the `MultiStepForm` block with **3 steps** (D30): Organisasi → Titik mulai → Undang tim (skippable); see §8.1.

| State | Behavior and microcopy |
|---|---|
| Ideal | Header shows the current organization; the switcher lists all active memberships |
| Empty | No organizations: "Buat organisasi pertama Anda" with fields Nama organisasi and Alamat (`agere.id/` + slug preview) and the button "Buat organisasi" |
| Loading | Switcher shows 3 skeleton rows; page content never renders before the organization is resolved |
| Error | Slug taken: "Alamat ini sudah dipakai. Coba maju-jaya-2." Logo too large: "Logo maksimal 2 MB. Gunakan PNG, JPG, atau WebP." Save failed: "Perubahan belum tersimpan. Coba lagi." |
| Partial | pending_deletion banner (§6.4); organization suspended page; user removed from the organization being viewed → "Anda tidak lagi menjadi anggota organisasi ini." plus a link to the picker |

### 8.1 Onboarding (D30, v1.2)

```text
┌ agere ───────────────────────────────┐┌──────────── Pratinjau organisasi Anda ┐
│ ✓ Organisasi ── ② Titik mulai ── ③ … ││ [MJ] Maju Jaya                         │
│ Mau mulai dari mana?                 ││      agere.id/maju-jaya               │
│ Pilih titik mulai. Semua bisa        ││  ▾ Marketing                           │
│ diubah, dan proyek Mulai di sini     ││     ▢ Mulai di sini                    │
│ selalu ikut.                         ││     ▢ Kalender Konten                  │
│ (●) Tim kreatif & marketing          ││     ▢ Studio Desain                    │
│ ( ) Tim produk                       ││                                        │
│ ( ) Mulai kosong                     ││                                        │
│ [← Kembali]              [Lanjut]    │└────────────────────────────────────────┘
└──────────────────────────────────────┘
```

| Step | Content | Rules |
|---|---|---|
| 1 · Organisasi | Title "Buat organisasi", lead "Organisasi adalah ruang kerja bersama tim Anda. Bisa diubah nanti."; fields **Nama organisasi** (≤ 60), **Alamat organisasi** (`agere.id/` addon + slug, generated from the name until edited), **Zona waktu** (`Select`, default Asia/Jakarta) | Slug rules §6.2; live help "Alamat tersedia" / "Alamat ini sudah dipakai. Coba maju-jaya-2."; all errors shown together |
| 2 · Titik mulai | Title "Mau mulai dari mana?"; three radio cards: **Tim kreatif & marketing** (space Marketing: Mulai di sini, Kalender Konten, Studio Desain) · **Tim produk** (space Product: Mulai di sini, Roadmap, Bug klien) · **Mulai kosong** (space Umum: Mulai di sini) | Default = Mulai kosong when nothing is chosen [H]; the preset only seeds names and default columns, never sample people or permissions; everything is editable afterwards |
| 3 · Undang tim | Title "Undang tim Anda"; **Email rekan kerja** (textarea; help "Pisahkan dengan koma atau baris baru, maksimal 20 email."), **Peran** (Member default / Admin) | Validation identical to PRD-03 invitations; **Lewati untuk sekarang** (outline) skips; **Kirim dan selesai** (default) sends |
| Selesai | Illustration `success`; "{Nama} siap dipakai"; checklist of what was created; **Buka Desk** | Creates everything in one transaction (§6.3) before this screen renders |

- **Layout:** split screen (UI-01 v2.4 §Auth): form column max 400 px on the left; on ≥ 960 px a dark preview panel on the right reads back the organization name, address, preset space and projects, and invited emails as the user types (`aria-hidden`; the form is the source of truth). Buttons are `lg` (40 px), as for every auth and onboarding submit (D32).
- **Stepper:** Agere DS `Stepper` horizontal, `aria-label="Langkah 2 dari 3"`, current step `aria-current="step"`, done steps show a check.
- **Back** keeps every value; closing the tab before step 3 creates nothing.

Accessibility: the switcher's `aria-label` is "Ganti organisasi, saat ini Maju Jaya". The slug-confirm field in the deletion dialog is labelled "Ketik maju-jaya untuk konfirmasi".

## 9. User stories & acceptance criteria

**US-1 — Create.**

```gherkin
Given I have a verified account and no organizations
When I create "Maju Jaya" with slug maju-jaya
Then I am its Owner, the Space app is enabled for me, and I land on Desk › Kotak masuk (/maju-jaya/desk/kotak-masuk) with the "Selamat datang" card
And on every later sign-in I land on Desk › Kotak masuk (D20)
And org.organization.created is audited

Given the slug maju-jaya exists
Then creation is blocked with an alternative suggestion
```

**US-1b — Titik mulai seeds the first space (D30).**

```gherkin
Given I am on step 2 of onboarding
When I choose "Tim kreatif & marketing" and finish step 3 with "Lewati untuk sekarang"
Then the organization has one space "Marketing" with projects "Mulai di sini", "Kalender Konten" and "Studio Desain"
And "Mulai di sini" holds 3 example tasks assigned to nobody
And no invitation is sent and the Selesai screen says "Undang tim bisa dilakukan kapan saja dari Desk"
When I go back from step 3 to step 2 and change the choice to "Mulai kosong"
Then the preview shows one space "Umum" with only "Mulai di sini", and nothing has been created yet
```

**US-1c — Invitations in step 3 follow PRD-03.**

```gherkin
Given I enter "rina@majujaya.co.id, bad-email" in step 3
When I choose "Kirim dan selesai"
Then nothing is created, the field shows "Format email belum benar: bad-email" and keeps focus
Given I enter 2 valid emails and role Member
Then the organization, its space and projects, and 2 invitations are created in one transaction
And the Selesai screen says "2 rekan diundang"
```

**US-2 — Context is explicit.**

```gherkin
Given I belong to maju-jaya and sinar-abadi
When I open /sinar-abadi/projects/prj_9
Then every query uses sinar-abadi's organization_id and the header shows Sinar Abadi

Given I do not belong to kopi-kita
When I open /kopi-kita/projects
Then I receive 404 and nothing about kopi-kita is disclosed
```

**US-3 — Last-Owner invariant.**

```gherkin
Given Maju Jaya has exactly one Owner
When that Owner tries to leave, demote themselves or be removed
Then the operation is rejected with "Alihkan kepemilikan dulu sebelum keluar."
```

**US-4 — Transfer ownership.**

```gherkin
Given I am an Owner whose last authentication is older than 10 minutes
When I transfer ownership to Rina and choose to become Admin
Then I must re-authenticate; afterwards Rina is Owner and I am Admin
And org.ownership.transferred is audited and both of us are notified
```

**US-5 — Delete and restore.**

```gherkin
Given I am an Owner
When I delete the organization after re-authentication and typing the slug
Then status becomes pending_deletion with purge date = now + 30 days
And all Owners and Admins receive email and in-app notices
And non-Owner members lose access

When an Owner cancels before the purge date
Then status returns to active and all data and access are unchanged

When the purge date passes
Then data is purged per PRD-13 and the slug is reserved for 90 days
```

**US-6 — Default timezone.**

```gherkin
Given the organization default timezone is Asia/Makassar and Dewi has no personal timezone
When a task is due on a date
Then its overdue state follows 23.59.59 Asia/Makassar (PRD-00b §6.1)
```

## 10. Edge cases

| Case | Behavior |
|---|---|
| A user creates a 6th organization | Blocked: "Anda sudah membuat 5 organisasi. Hubungi support untuk menambah." |
| An Owner's account is deleted (PRD-13) | Account deletion requires leaving every organization first, so the last-Owner rule applies |
| Two Owners delete and cancel concurrently | The latest committed action wins; both are audited |
| An organization in pending_deletion receives an invitation acceptance | Blocked: "Organisasi ini sedang dijadwalkan untuk dihapus." |
| A logo URL is used in email | Signed public URL with a long cache; replaced on update |

## 11. Non-functional requirements

- Slug resolution plus L1 membership: p95 ≤ 30 ms, part of the PRD-04 check budget.
- Organization switch (navigate to another slug): p95 ≤ 1.5 s to first contentful paint [H].
- WCAG 2.1 AA.

## 12. Dependencies

PRD-01 (re-authentication, `last_organization_id`), PRD-03 (the last-Owner rule in self-leave and removal), PRD-04 (L1, matrix, G3), PRD-12 (personal timezone overrides the default), PRD-13 (purge), PRD-00b (events).

## 13. Open questions

| # | Question | Proposed default |
|---|---|---|
| Q1 | Should the starter project be created automatically? | Yes (decided with D30: always part of the chosen Titik mulai); measure time to first task |
| Q2 | Should the slug be editable in release 2? | Yes, with 90-day redirects |
