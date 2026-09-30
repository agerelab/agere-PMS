# PRD-03 — People & Teams

| Field | Value |
|---|---|
| Version | 1.2.1 (supersedes 1.2) |
| Status | Draft — ready for engineering review |
| Owner | [TBD — Product Owner, agere/org platform] |
| Last updated | 26 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE |
| Depends on | PRD-01 Identity & SSO, PRD-02 Organization, PRD-04 Roles, App Access & Resource ACL, PRD-00b Event Contract |
| Consumed by | PRD-05 Lead CRM, PRD-06 Project, PRD-08 Doc, PRD-10 Notifications, PRD-11 Audit |
| Resolves review items | Per-PRD gaps for 03; conflicts C-01 (team permissions) and C-04 (orphaned work); prerequisite for C-05 (ownership transfer) |

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> **Amendment 26 Sep 2026 — QA v10 (QA-01):**
> - Owners and Admins see **full email addresses** in the invite dialog (V14); masking applies only where the viewer is not allowed to see the member list.
> - Team cards count **active** members and flag suspended ones ("2 anggota aktif · 1 ditangguhkan") (AD4).
> - The "Diundang" tab counter counts only pending, unexpired invitations; expired ones are listed separately (AD8).
> - Invitation page: dates formatted "30 Sep 2026"; "Tolak" asks for confirmation (ON7). Onboarding invite errors are shown inline like in Anggota (ON6, release 1.1).
> - Revoking app access reuses Work Ownership to hand over open work in the same transaction (PRD-04 §6.5 v1.4).

### Change log v1.1 → v1.2

- Reassignment notifications use one `membership.work.reassigned` summary per target; per-item events carry `bulk_operation_id` (PRD-00b, PRD-10).
- Accepting an invitation lands the user in `/{slug}` (PRD-02 §6.2).
- Seat counting is not applicable in release 1 (free pilot, PRD-00 §3.3).

### Change log v1.0 → v1.1

- Defined member and invitation state machines, invitation expiry, resend and revoke.
- Separated **suspend** from **remove**.
- Added the mandatory **"Alihkan pekerjaan"** (reassign work) flow so no open record is left without an owner.
- Teams are now access principals (PRD-04 §6.3). **Team assignment no longer implies visibility**: visibility always comes from the ACL.
- Aligned permissions with the PRD-04 role × action matrix; added events, UX states, microcopy and stories.

---

## 1. Problem

Organizations need one place to see who belongs to them, which teams they are in, and what happens to their work when they change or leave.

v1.0 left three dangerous gaps:

1. **"Team permissions"** were referenced but never defined.
2. **Removing a member** left their deals, tasks and next actions without an owner.
3. **Invitations** had no expiry, resend or revoke rules.

## 2. Goal

Centralize member and team management on top of one global identity (PRD-01). Every change must take effect everywhere immediately, and no work may be left orphaned.

## 3. Personas & jobs to be done

| Persona | Job to be done | Evidence |
|---|---|---|
| Admin/Owner | "When someone joins, I want them working in minutes; when someone leaves, I want their access gone and their work handed over, in one flow." | [Hypothesis: Needs Validation] |
| Member | "I want to accept an invitation without creating yet another account." | [Hypothesis: Needs Validation] |
| Team lead (a Member) | "I want work assigned to my team to reach everyone on it." | [Hypothesis: Needs Validation] |

## 4. Success metrics

[H] = hypothesis target; baselines are captured during the first 30 days.

| Metric | Target | Window | Type |
|---|---|---|---|
| Invitation acceptance within 7 days | ≥ 60% [H] | Monthly cohort | Primary |
| Median time from invitation to active member | ≤ 24 h [H] | Monthly | Primary |
| Open items without an active owner or assignee after a removal | **0** | Continuous | Guardrail |
| Access still working after removal (PRD-04 revocation target) | **0** occurrences beyond p95 10 s | Continuous | Guardrail |
| Member-management error rate (failed invite, remove or role actions ÷ attempts) | ≤ 1% [H] | Weekly | Secondary |

## 5. Scope

### Must (release 1)

- Member list with tabs Aktif / Diundang / Ditangguhkan, plus search by name/email and filter by role or team.
- Invite by email (single), with role Member or Admin.
- Invitation expiry, resend and revoke.
- Activation via PRD-01.
- Member detail, including the PRD-04 "Akses" tab.
- Suspend, reactivate and remove, with **"Alihkan pekerjaan"**.
- "Keluar dari organisasi" (self-leave).
- Teams: create, rename, delete, add/remove members, team detail. Teams usable as ACL principals and as assignees.

### Should

- Invite up to 20 emails at once (comma- or newline-separated).
- Default app access per team (PRD-04 Should).

### Won't (release 1)

- CSV import of members.
- Directory sync (Google Workspace, SCIM).
- Nested teams.
- A team-lead role with its own permissions.
- Custom member profile fields.

## 6. Design

### 6.1 State machines

```text
Invitation:  pending ──accept──▶ accepted
                │  └─resend──▶ pending (new token; old token invalid)
                ├──expire (7 days [H])──▶ expired
                └──revoke──▶ revoked

Membership:  active ◀──reactivate── suspended
               │  └──suspend──────────▲
               └──remove / leave──▶ removed   (terminal; a new invitation creates a new membership)
```

| | Suspended | Removed |
|---|---|---|
| Can access the organization | No (PRD-04 L1) | No |
| Shown in | "Ditangguhkan" tab | Not listed; history shows "Budi S. (mantan anggota)" |
| Direct ACL grants and team memberships | **Kept** (restored on reactivation) | **Deleted** |
| Open work | Stays assigned. The admin is offered "Alihkan pekerjaan" (optional). | **Must** be reassigned (§6.3) |
| Global identity (PRD-01) | Intact | Intact |
| Reversible | Yes — "Aktifkan kembali" | No — re-invite instead; previous grants are not restored |
| Seat counting | Not applicable in release 1 (free pilot, PRD-00 §3.3) | Not applicable |

### 6.2 Invitation rules

- **Who can invite:** Owner and Admin (PRD-04 §6.2). Assignable roles at invite time are **Member or Admin**; the Owner role is granted only to active members (PRD-04 matrix).
- **Email matching:** case-insensitive, trimmed.
- **Already an active or suspended member:** blocked with "r***@maju.co.id sudah menjadi anggota."
- **Pending invitation exists:** offer "Kirim ulang undangan" instead of creating a duplicate.
- **Expiry:** 7 days [H]. Resend issues a new token and invalidates the old one.
- **Activation:** the invite link leads to sign-in or sign-up (PRD-01). The account's **verified** email must equal the invited email. On a mismatch: "Undangan ini untuk r***@maju.co.id. Masuk dengan email tersebut untuk menerimanya."
- **Accepting:** the membership becomes active with the invited role, and the user lands in `/{slug}` of that organization (PRD-02 §6.2).

### 6.3 "Alihkan pekerjaan" (reassign work) — resolves C-04

Every app module implements a **Work Ownership interface**:

- `countOpenWork(user_id, organization_id)` returns counts per item type.
- `reassignOpenWork(from_user_id, to_user_id, organization_id, tx)` performs the reassignment.

| App | Items reassigned (open only; completed or closed history keeps the original person) |
|---|---|
| Project (PRD-06) | Tasks where the user is assignee and status ≠ done |
| Lead CRM (PRD-05) | Open deals and leads the user owns; open next actions assigned to the user |
| Doc (PRD-08) | None (authorship is history) |
| Resource ACL (PRD-04) | Restricted/Private containers where the user is the **last `manage` holder** (rule I3) |

Rules:

- **R1.** On **remove**, the wizard shows counts per app and a target per app. The default target is **the admin performing the removal**, who has app access by default (PRD-04 §6.5). Any other target must be an active member with access to that app.
- **R2.** Removal and every `reassignOpenWork` call run in **one database transaction**. If any step fails, nothing changes and the admin sees an error.
- **R3.** On **self-leave**, open work goes to the **earliest-joined active Owner**, who is notified. The last-Owner rule (PRD-02) blocks the last Owner from leaving.
- **R4.** On **suspend**, reassignment is optional and uses the same wizard.
- **R5.** Each module publishes its own per-item events for reassigned items (for example `space.task.assigned`) with a shared `bulk_operation_id`. People then publishes one `membership.work.reassigned` per target with counts per app. Notifications sends only that summary (PRD-10 §5 bulk rule).

### 6.4 Teams

- A team name is unique per organization (case-insensitive), 1–50 characters.
- Create, rename and delete: Owner/Admin (PRD-04 matrix). Add/remove members: Owner/Admin.
- A team is a **principal** in Resource ACL (PRD-04 §6.3) and in app-access grants (PRD-04 §6.5).
- **Team assignment does not grant visibility.** A task or next action assigned to a team is visible to a team member only if that member can view the item's container under PRD-04.
  - At assignment time the UI warns: "2 anggota Tim Sales tidak punya akses ke project ini. Bagikan project atau pilih tim lain." The assignment is still allowed.
- **Deleting a team:**
  1. All `team:<id>` grants are removed (PRD-04 I4).
  2. The ACL rule I3 is enforced on affected containers.
  3. Open items assigned to the team become **unassigned**, and their container managers are notified.
  - The confirmation dialog shows these counts first.
- A member leaving a team loses the team-derived access at their next request (PRD-04 E3).

### 6.5 Information architecture (resolves C-07 for this module)

```text
Organisasi
 ├── Anggota   (Aktif | Diundang | Ditangguhkan) › [anggota] › Profil | Akses | Tim
 ├── Tim       › [tim] › Anggota | Akses aplikasi
 ├── Akses     (PRD-04)
 ├── Aplikasi  (PRD-04)
 └── Audit     (PRD-11)
```

Personal settings (PRD-12) do not host People or Teams.

## 7. Events (PRD-00b catalog)

| Event | `audit` | Notes |
|---|:-:|---|
| `membership.invitation.created` / `.resent` / `.revoked` / `.expired` | ✓ | Invitee email stored as a hash in `data`; the raw email is only in the invitation record |
| `membership.member.activated` | ✓ | |
| `membership.member.suspended` / `.reactivated` | ✓ | |
| `membership.member.removed` / `.left` | ✓ | `data.reassigned_to` = map of app → user_id |
| `membership.work.reassigned` | — | One per target: `{from_user_id, counts: {space: 12, …}, bulk_operation_id}` |
| `team.team.created` / `.renamed` / `.deleted` | ✓ | |
| `team.member.added` / `.removed` | ✓ | |

Invitation emails are sent synchronously through the email adapter (PRD-01 §6.1), not derived from events. This keeps delivery independent of queue availability.

## 8. UX

Agere DS components: `DataTable` (members), `Tabs`, `FilterBar`, `Dialog` (invite, remove), `Stepper` (reassignment wizard), `Badge` (role, status with text), `Avatar`, `EmptyState` with the `InviteAndEmpty` block.

### 8.1 Remove-member wizard

```text
┌ Hapus Budi Santoso dari organisasi ───────────── ✕ ┐
│ Budi tidak bisa lagi mengakses agere/org. Akun    │
│ agere miliknya tetap ada.                          │
│                                                    │
│ Alihkan pekerjaan yang masih terbuka               │
│ Project · 12 tugas            [ Anda (Yacobus)   ▾ ]  │
│ Lead  · 4 deal, 7 next action [ Rina A.       ▾ ]  │
│ Akses · 1 project terbatas [ Anda (Yacobus)   ▾ ]  │
│                                                    │
│                  [Batal]  [Hapus anggota]          │
└────────────────────────────────────────────────────┘
```

The destructive button repeats the verb from the title (Agere DS content rule). It uses the error variant, and it is the dialog's only filled button.

### 8.2 Five UX states

| State | Behavior and microcopy |
|---|---|
| Ideal | Member table with role and status badges and last-active time (`body-sm`, `fg-subtle`) |
| Empty | Only the owner exists: `EmptyState` titled "Undang tim Anda", description "Anggota yang diundang bisa langsung bekerja di Project dan aplikasi lain.", action "Undang anggota" |
| Loading | 8 skeleton rows of 40 px |
| Error | Invite failed: "Undangan belum terkirim. Server email tidak merespons. Coba kirim lagi." Remove failed: "Anggota belum dihapus. Tidak ada perubahan yang disimpan. Coba lagi." |
| Partial / edge | Expired invitation row: `Badge` "Kedaluwarsa" plus a "Kirim ulang" action. Removal blocked for the last Owner: "Alihkan kepemilikan dulu sebelum keluar." Team assignment with members lacking access: the §6.4 warning. |

### 8.3 Accessibility

- Status badges always carry text (never color alone).
- Row actions sit in a labelled `DropdownMenu` ("Tindakan untuk Budi Santoso").
- The wizard's per-app selects are labelled per app.
- Focus returns to the table row after a dialog closes.

## 9. User stories & acceptance criteria

**US-1 — Invite a member.**

```gherkin
Given I am an Admin
When I invite dewi@maju.co.id as Member
Then a pending invitation valid for 7 days is created, an activation email is sent,
And membership.invitation.created is recorded in the audit trail

Given dewi@maju.co.id already has a pending invitation
When I invite her again
Then no duplicate is created and I am offered "Kirim ulang undangan"

Given I am a Member
When I call the invite API directly
Then it returns 403
```

**US-2 — Accept an invitation.**

```gherkin
Given a pending invitation for dewi@maju.co.id
When Dewi signs up or in with that verified email and opens the link
Then her membership becomes active with the invited role

Given the invitation expired or was revoked
Then no membership is created and she sees "Undangan sudah tidak berlaku. Minta admin mengirim ulang."

Given she signs in with a different email
Then the invitation is not accepted and the mismatch message is shown
```

**US-3 — Remove with reassignment (resolves C-04).**

```gherkin
Given Budi owns 4 open deals and is assignee of 12 open tasks
When an Admin removes Budi and keeps the default targets
Then within one transaction Budi's membership is removed, his direct grants and team memberships are deleted,
And the open deals and tasks are reassigned to the chosen targets
And membership.member.removed records the reassignment map

Given reassignment of Lead items fails
Then Budi remains an active member and nothing is reassigned

Given the removal has completed
When Budi calls any organization-scoped endpoint
Then access is denied within the PRD-04 revocation target (p95 ≤ 10 s)
And his global identity still works for his other organizations
```

**US-4 — Suspend and reactivate.**

```gherkin
Given Sari is suspended
Then she cannot access the organization and her grants and team memberships are kept
When an Admin reactivates her
Then her previous access is restored without re-inviting
```

**US-5 — Team as principal, not visibility (resolves C-01).**

```gherkin
Given Tim Sales has Edit on project "Q4 Launch"
When Rina joins Tim Sales
Then she can open the project within the PRD-04 propagation target

Given a task in a Restricted project is assigned to Tim Ops, and Tim Ops has no grant on that project
Then Tim Ops members cannot see the task
And the assigner saw the access warning before saving
```

**US-6 — Delete a team.**

```gherkin
Given Tim Ops has 3 grants and 5 open items assigned to it
When an Admin deletes the team after reviewing the counts
Then the grants are removed, the items become unassigned, and each affected container still has a manager
```

## 10. Edge cases

| Case | Behavior |
|---|---|
| Admin tries to remove an Owner or another Admin | Blocked by PRD-04 G1 (403) |
| A removed person is re-invited | A new membership with no previous grants; history keeps the old attributions |
| An invited person already belongs to other organizations | Normal flow; the organization switcher (PRD-02) gains the new organization |
| Reassignment target loses app access mid-wizard | Server re-validates at submit and asks for a new target |
| Very large reassignment (thousands of items) | Still one transaction [H: validate at ≤ 5,000 items]; Notifications sends one summary |
| Member removed while holding the page open | The next request returns NOT_MEMBER; UI: "Anda tidak lagi menjadi anggota organisasi ini." |

## 11. Non-functional requirements

- Member list: p95 ≤ 300 ms for organizations of up to 500 members [H]; server-side search and pagination.
- Remove with reassignment: p95 ≤ 3 s for ≤ 500 items [H].
- WCAG 2.1 AA; `DataTable` keyboard navigation.
- Privacy: emails are masked in error hints; event payloads carry an email hash, never the raw email.

## 12. Dependencies

| PRD | Relationship |
|---|---|
| PRD-01 | Activation via sign-up/sign-in with a verified email; invitation email via the email adapter |
| PRD-02 | Last-Owner rule; ownership transfer; active organization after acceptance |
| PRD-04 | Role × action matrix; team principals; rule I3; the "Akses" tab |
| PRD-05 / 06 | Implement the Work Ownership interface (§6.3) |
| PRD-10 | Bulk rule: one summary per target |
| PRD-00b | `membership.*` and `team.*` events |

## 13. Open questions

| # | Question | Proposed default | Decide by |
|---|---|---|---|
| Q1 | Invitation expiry | 7 days | Pilot |
| Q2 | Do suspended members count as seats? | Not applicable in release 1 (free pilot); decide in the Billing PRD before paid launch | Billing PRD |
| Q3 | Should self-leave let the leaver choose the target? | No — earliest-joined Owner | Usability test |
