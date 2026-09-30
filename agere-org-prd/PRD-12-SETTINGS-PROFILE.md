# PRD-12 — Settings & Profile (personal)

| Field | Value |
|---|---|
| Version | 1.2.3 (supersedes 1.2.2) |
| Status | Draft — release 1 |
| Owner | [TBD — Product Owner agere/org] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE (PRD-00) |
| Depends on | PRD-01 (security), PRD-13 (account deletion, export), PRD-02 (organization default timezone) |
| Resolves review items | Per-PRD gaps for 12; C-06 (user timezone); C-07 (settings location); C-11 (theme default) |

### Change log v1.2.2 → v1.2.3 (28 Sep 2026 — two languages, D45)

- **Preferensi › Language / Bahasa** lists **English** and **Bahasa Indonesia**; a new account starts on the organization default (English unless the Owner chose otherwise). The change applies immediately to the whole app without signing out, and to notifications and emails from then on (PRD-10 v1.4.1). The option labels are always shown in their own language ("English", "Bahasa Indonesia").
- Dates, times, numbers and IDR amounts follow the chosen language (UI-01 v2.5 "Bahasa & format"); time zone stays a separate setting.
- The v1.2.2 note "Bahasa lists Bahasa Indonesia only (C-10)" and §4 "Language: fixed in release 1" are void (C-10 revised by D45).

```gherkin
Given my organization's default language is English and I never changed my preference
When I open Preferensi
Then Language shows "English"
When I choose "Bahasa Indonesia"
Then the navigation, page titles and buttons switch to Bahasa Indonesia without reloading
And the next email I receive is in Bahasa Indonesia
And task titles and doc content stay exactly as their authors wrote them
```

### Change log v1.2.1 → v1.2.2 (28 Sep 2026 — prototype v17.1)

- **Account deletion matches §5.4 in the prototype** (QA-02 B-22): *Akun & data* shows **Hapus akun** (destructive-outline, disabled) with the blocking reason — "Keluar dari {n} organisasi berikut sebelum menghapus akun." plus one **Keluar** per organization, or "Alihkan kepemilikan {organisasi} dulu." for a sole Owner. Prototype v17 had a "Tutup akun" flow that removed the user from every organization, which contradicted §5.4 and PRD-13 §6.3; it is gone.
- **Avatar upload** (§4): PNG, JPG or WebP ≤ 2 MB; errors as §6. Organization logo (PRD-02) stays ≤ 1 MB.
- **Account menu** gains *Pintasan keyboard* (**Ctrl /**, UI-01 v2.4) between *Preferensi* and the theme items.
- **Preferensi:** theme as three radio cards (Terang · Gelap · Ikuti sistem); *Bahasa* lists Bahasa Indonesia only (C-10); *Notifikasi email* per type is release 2 (PRD-10 v1.4).
- Profile fields have visible labels and **no placeholder text** (D33); formats go in helper text.

```gherkin
Given I am a Member of Maju Jaya and Sinar Retail
When I open Pengaturan › Akun & data
Then "Hapus akun" is disabled and described by "Keluar dari 2 organisasi berikut sebelum menghapus akun."
And each organization has a "Keluar" button that asks for confirmation first
Given I am the only Owner of Maju Jaya
Then the reason reads "Alihkan kepemilikan Maju Jaya dulu." and no "Keluar" buttons are shown
```

### Change log v1.1 → v1.2

- **Theme default is now Terang (light)** for every new user, product decision 25 Sep 2026. "Ikuti sistem" stays available as an option. Supersedes the v1.1 OS-following default and the index's "dark-first" note. Dark mode remains fully supported and QA covers both themes.

### Change log v1.0 → v1.1

- **Settings is personal only.** Organization configuration moved to Organisasi (PRD-02 §6.6, PRD-03 §6.5, PRD-04 §8.1). This removes the ambiguity v1.0 warned against.
- Added timezone, a theme default that follows the operating system, security activity, and account deletion.
- Notification preferences deferred to release 2 (PRD-10).


> **Amendment 26 Sep 2026:** the "Data saya" export labels its content by format (JSON), not "CSV" (QA SE2). Preferences for work-event email and "my deal/task was changed by someone else" are release 2 (QA SE3, PRD-10).

---

## 1. Problem

Users need one predictable place for things that affect **only them**. v1.0 mixed personal and organization settings in one area, which is exactly how people mistake a personal change for an organization-wide one.

## 2. Goal

A personal settings area where every control affects only the signed-in user, in every organization.

> Principle (v1.0, kept and enforced by structure): a user must never mistake a personal preference for an organization-wide change.

## 3. Success metrics

| Metric | Target | Type |
|---|---|---|
| Settings task success (usability: change timezone, change password, link Google) | ≥ 90% [H] | Primary |
| Settings-related support tickets per 100 active orgs | ≤ 1 / month [H] | Secondary |
| Account deletions completed within the PRD-13 deadline | 100% | Guardrail |

## 4. Scope

**Must (release 1):**

- **Profil:** name (2–80 characters), avatar (PNG/JPG/WebP ≤ 2 MB, cropped to 256 px; object storage as PRD-02 logo).
- **Keamanan (PRD-01):** change password; link/unlink Google; "Keluar dari semua perangkat"; security activity (last 30 days of the user's `security.*` events).
- **Preferensi:**
  - Theme: Terang (default), Gelap, Ikuti sistem.
  - Timezone: default "Ikuti organisasi"; else a chosen IANA timezone.
  - Language: English or Bahasa Indonesia (v1.2.3, D45); default = organization default.
- **Akun (PRD-13):** "Hapus akun".

**Should:** session list with per-device sign-out; MFA setup (PRD-01 Should); "Unduh data saya" (JSON export).

**Release 2:** notification preferences, English UI.

**Won't:** per-organization personal profiles.

## 5. Design

### 5.1 Information architecture

- Route: `/pengaturan/{profil|keamanan|preferensi|akun}`. It sits **outside** any `/{slug}` because nothing here is organization-scoped.
- Entry point: avatar menu › "Pengaturan akun".
- Every page header carries a `Badge` "Pribadi" and the helper text "Hanya berlaku untuk akun Anda di semua organisasi."
- Organization controls (Organisasi › Umum, Anggota, Tim, Akses, Aplikasi, Audit) are reached only from the organization sidebar. No link from Settings points to them.

### 5.2 Timezone resolution (single rule used everywhere)

`user.timezone` if set → else the organization's `default_timezone` (PRD-02) → else `Asia/Jakarta`.

Used by: overdue computation (PRD-00b §6.1, PRD-06 §6.4), Tugas saya sections, the digest (PRD-10), and date display (Intl `id-ID`, e.g. "24 Sep 2026 14.30 WIB").

### 5.3 Theme

- Stored per user. **Default: Terang.** Options: Terang, Gelap, Ikuti sistem ("Ikuti sistem" follows `prefers-color-scheme`).
- Before sign-in (auth screens) the app renders Terang.
- Agere DS light and dark tokens; `data-theme` is always set on the root before first paint (no flash), so an OS dark preference never overrides the default unless the user picks "Ikuti sistem".
- Design and QA cover both themes; light is the reference for screenshots and acceptance (resolves C-11, updated v1.2).
- A header toggle switches Terang ↔ Gelap in one click and saves the preference (UI-01).

### 5.4 Account deletion

Follows PRD-13 §6.3:

1. Blocked while the user is a member of any organization. The page lists them with "Keluar" links; the last-Owner rule applies.
2. Re-authentication is required (PRD-01 §6.3).
3. The confirmation dialog title is "Hapus akun"; the destructive button is "Hapus akun".
4. Sessions are revoked immediately; PII is scrubbed within the PRD-13 deadline.

## 6. UX states

| State | Behavior and microcopy |
|---|---|
| Ideal | Forms with saved values; saving shows the toast "Perubahan disimpan." |
| Empty | No avatar: initials; no linked Google: "Belum terhubung" plus "Hubungkan Google" |
| Loading | Form skeleton; the save button shows "Menyimpan…" |
| Error | "Perubahan belum tersimpan. Coba lagi." Avatar too large: "Foto maksimal 2 MB. Gunakan PNG, JPG, atau WebP." |
| Partial | Deletion blocked: "Keluar dari 2 organisasi berikut sebelum menghapus akun." with the list. Sole Owner: "Alihkan kepemilikan Maju Jaya dulu." |

## 7. User stories & acceptance criteria

**US-0 — Light by default.**

```gherkin
Given a new user whose operating system is set to dark mode
When they sign up and open agere/org
Then the app renders in Terang
When they choose "Ikuti sistem" in Preferensi
Then the app renders in Gelap
```

**US-1 — Theme is personal (v1.0 AC preserved).**

```gherkin
Given I change theme to Gelap
Then only my experience changes, in every organization, and other members see no change
```

**US-2 — Timezone.**

```gherkin
Given my timezone is "Ikuti organisasi" and Maju Jaya's default is Asia/Makassar
Then my Tugas saya "Hari ini" follows WITA in Maju Jaya
When I set my timezone to Asia/Jakarta
Then it follows WIB in every organization
```

**US-3 — No organization controls here (replaces v1.0 AC 2–3).**

```gherkin
Given any user opens /pengaturan
Then no control changes organization data
And organization settings are reachable only under /{slug}/organisasi with PRD-04 permissions enforced server-side
```

**US-4 — Account deletion guarded.**

```gherkin
Given I am the only Owner of Maju Jaya
When I try to delete my account
Then deletion is blocked until I transfer ownership and leave every organization
```

## 8. Non-functional requirements

WCAG 2.1 AA (labels, error association, focus management); the theme applies before first paint; all copy id-ID.

## 9. Dependencies

PRD-01 (security actions, re-authentication), PRD-02 (default timezone, last-Owner rule), PRD-03 (self-leave), PRD-10 (release 2 preferences), PRD-13 (deletion, export).
