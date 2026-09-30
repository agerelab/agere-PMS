# PRD-04 — Roles, Application Access & Resource ACL

| Field | Value |
|---|---|
| Version | 1.5.1 (supersedes 1.5) |
| Status | Draft — ready for engineering review |
| Owner | [TBD — Product Owner, agere/org platform] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE (see Index § Engineering context) |
| Depends on | PRD-00b Event Contract, PRD-01 Identity & SSO v1.1, PRD-02 Organization, PRD-03 People & Teams v1.1 |
| Consumed by | PRD-06 Space & Project, PRD-14 Chat, PRD-17 Agen, PRD-07 File (on hold), PRD-08 Doc, PRD-09 Calendar, PRD-10 Notifications, PRD-11 Audit, PRD-12 Settings |
| Resolves review items | Blocker P0-1; conflicts C-01, C-02, C-03 |

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

### Change log v1.5 → v1.5.1 (28 Sep 2026 — app `agent`, PRD-17 v1.0, D44)

- **Creating and editing agents:** Owner/Admin, or a member with the `agent` app grant **and** edit on every space in the agent's context. **Using** an agent: `agent` app access + view on the context it is invoked in.
- **Raising an agent permission level** (e.g. *Menugaskan orang* from Ditolak to Perlu persetujuan) is Owner/Admin only and emits `agent.agent.permission_changed` (audit + notify Owner). Levels that are Ditolak by design (change due date, delete, remove member) cannot be raised; *Jalankan otomatis* does not exist in release 3.
- **Agents are not principals:** an agent can never be a task assignee, team member, project owner, grant holder or share target; pickers and the Bagikan dialog never list agents.
- **Effective access is an intersection** (PRD-17 P4): read = agent context ∩ invoker; trigger runs = agent context ∩ trigger owner ∩ recipient; writes are re-authorized for the approver at approval time.
- Switching the `agent` app off (§6.5) hides every agent surface, stops all triggers and expires pending actions.

### Change log v1.4 → v1.5 (27 Sep 2026 — Space container, Bagikan gaya ClickUp)

- **Space is an ACL container above Project (D18, Index C-18).** A project inherits its space ACL or narrows it; it is never more visible than its space (rule I1, now enforced in the UI and the API). Container types: `space.space`, `space.project` (§6.4).
- **Registry (release 1):** the app is listed as **Space** (id `space`); Lead is void (C-16).
- **Share dialog (§8.1) redesigned, ClickUp-style and simple:** title "Bagikan tampilan ini" + "Dibagikan sebagai satu tampilan · {proyek} · {tampilan}"; rows: **Tautan privat** + "Salin tautan"; **Bagikan dengan** = organization row (logo, name, badge "Anggota organisasi", avatar stack +N, switch = preset Semua anggota ↔ Terbatas; expands to the member list); **Akses lanjutan** opens the previous per-person/team dialog. The row **"Bagikan tautan ke siapa saja"** (public read-only link) is shown only behind decision **D27** because public links and guests are Won't (§5).
- Lead references in §6.3–§6.5 are removed (C-16).

### Change log v1.3 → v1.4 (26 Sep 2026 — QA v10, PRD-14)

- **Role changes** go through a confirmation dialog; promoting to **Owner** also requires re-authentication, the same protection as "Alihkan kepemilikan" (QA AD1, §6.2).
- **Revoking app access** shows who loses access and the open work they hold, and offers to hand it over in the same transaction (QA AD2, §6.5).
- Admin-only pages show "Halaman ini khusus Owner dan Admin" instead of 404 for members (QA V12, §8.3).
- **Chat (release 2 candidate, PRD-14):** app `chat` in the registry behind a platform rollout flag; standalone channels are ACL containers; **project channels are not containers** and resolve to their project; DMs are excluded from governance override (§6.4, §6.6).
- Lead deals add a *control* layer on top of edit (owner / Owner / Admin / manage) for stage, value, owner, share and delete (PRD-05 addendum A1).

### Change log v1.2 → v1.3

- The request-context organization comes from the URL slug (PRD-02 §6.2); the deep-link edge case is updated.
- In release 1 the application registry contains **Project only** (PRD-00 §3.1).

### Change log v1.1 → v1.2

- Authorization is an **in-process module** of the Agere Org app, not a separate service (team of 2, Vercel functions).
- **No decision cache in release 1**: every check reads Postgres, so there is no cache to invalidate. A cache is added only if the latency target is missed (§6.7 E3).
- Token rules now reference PRD-01 v1.1 §6.2 / §6.4: DB sessions for Agere Org, and tokens of 5 minutes or less for other Agere products (release 2).
- Updated latency/NFR targets and US-3 / US-6 accordingly.

### Change log v1.0 → v1.1

- Added layer 4, **Resource ACL** (principals, levels, visibility, inheritance).
- Teams are now first-class principals (resolves the undefined "team permissions" in PRD-03).
- Added an explicit role × action matrix and admin guardrails.
- Defined enforcement and propagation: short-lived tokens plus server-side checks (resolves JWT staleness).
- Defined app-disable behavior, the 403 vs 404 disclosure rule, events, audit, NFRs, UX states and microcopy.

---

## 1. Problem

Authentication (PRD-01) answers *who* the user is. v1.0 answered *which apps* they can open, but not *which records inside an app* they can see or change. Four PRDs already depend on that missing answer:

- **PRD-03** says team assignments are visible "according to team permissions".
- **PRD-05** says related contacts and deals are visible "only within authorized scope".
- **PRD-06** has "project visibility".
- **PRD-08** requires blocking direct document URLs.

Without one shared model, each app invents its own. That creates inconsistent behavior, audit gaps, and data leaks inside an organization (for example, every member with Project access seeing private HR projects).

## 2. Goal

Provide **one explicit, auditable, server-enforced authorization model** for the whole Agere ecosystem. It answers three questions for every request: *Is this person an active member? Can they use this app? What can they do with this record?*

## 3. Personas & jobs to be done

| Persona | Job to be done | Evidence |
|---|---|---|
| Organization owner | "When I bring my company onto agere, I want to control who sees sensitive work, so I don't leak deals, salaries or strategy." | [Hypothesis: Needs Validation — 5 owner interviews] |
| Organization admin | "When someone joins, moves team or leaves, I want their access to change once and apply everywhere." | [Hypothesis: Needs Validation] |
| Member | "When I create a project or page, I want to decide who can see it without asking IT." | [Hypothesis: Needs Validation] |
| App engineer | "When I build a feature, I want to call one check instead of writing permission logic." | Internal |

## 4. Success metrics

Baselines are N/A before launch; they are captured during the first 30 days of the pilot. Targets marked [H] are hypotheses to validate.

| Metric | Target | Window | Type |
|---|---|---|---|
| Unauthorized-access incidents (confirmed) | **0** | Continuous | Guardrail |
| Cross-organization disclosure incidents | **0** | Continuous | Guardrail |
| Revocation propagation after member removal/suspension (p95) | **≤ 10 s** [H] | Weekly | Primary |
| Permission-change propagation for role, app or ACL changes (p95) | **≤ 60 s** [H] | Weekly | Primary |
| Authorization check latency (p95, in-process, one Postgres round trip in the same region) | **≤ 30 ms** [H] | Weekly | Guardrail |
| Share-dialog task success (set visibility or add a principal) | **≥ 90%** [H] | Usability test, n ≥ 8 | Primary |
| Access-related support tickets per 100 active orgs | **≤ 2 / month** [H] | Monthly | Secondary |
| Modules using the central `authz` module (no local permission logic) | **100%** | Per release | Adoption |

## 5. Scope

### Must (release 1)

- Organization roles: Owner, Admin, Member (fixed; not customizable).
- Application registry; enable/disable an app per organization.
- Grant/revoke app access per user and **per team**.
- Resource ACL: visibility levels, principals (user, team, organization), permission levels, inheritance.
- Share dialog on every top-level resource.
- Central `authz` module (`check`, `checkBatch`, `filter`) used by every Agere Org module; the same operations exposed over HTTP for other Agere products (§6.8).
- Server-side enforcement in every app, permission-aware navigation, access-denied states.
- `access.*` events (PRD-00b) and audit coverage (PRD-11).

### Should

- An "Akses" tab on member detail showing effective access with its source (direct, team, role).
- Default app access per team (for example, the Sales team gets Lead automatically).

### Could

- An access review report (who can see what), exportable to CSV.

### Won't (explicit non-goals for release 1)

- Custom roles or attribute-based access control (ABAC).
- Field-level permissions (for example, hiding deal value).
- Per-task or per-block ACLs. Only top-level containers carry an ACL (see §6.4).
- External guests or public share links. **Open decision D27 (27 Sep 2026):** a read-only public link per view (prototype v13); recommended to stay Won't in release 1 and be re-evaluated for release 2 together with guests.
- Time-bound or expiring grants.

## 6. Authorization model

### 6.1 Four layers, evaluated in order (deny wins at each layer)

```text
L1 Membership   Is the user an ACTIVE member of organization_id?          (PRD-03)
L2 Org role     Owner | Admin | Member — sets the governance ceiling
L3 App access   App enabled for the org  AND  user has app access (direct or via team)
L4 Resource ACL User's effective level on the resource ≥ level the action requires
```

Decision algorithm (pseudocode):

```text
check(user, action, resource):
  if resource.organization_id != ctx.organization_id      -> DENY_NOT_FOUND
  if membership(user, org).status != ACTIVE               -> DENY_NOT_MEMBER
  if not app_enabled(org, resource.app)                   -> DENY_APP_DISABLED
  if not app_access(user, org, resource.app)              -> DENY_NO_APP_ACCESS
  if role(user) in {OWNER, ADMIN}                         -> ALLOW   (governance override, audited when it bypasses the ACL; see §6.6)
  level = effective_level(user, resource)                 # max over direct, team and organization grants, after inheritance
  if level == NONE                                        -> DENY_NOT_FOUND
  if level < required_level(action)                       -> DENY_FORBIDDEN
  return ALLOW
```

### 6.2 Role × action matrix (organization governance)

| Action | Owner | Admin | Member |
|---|:-:|:-:|:-:|
| View members and teams | ✓ | ✓ | ✓ |
| Invite member | ✓ | ✓ | ✗ |
| Suspend/remove Member | ✓ | ✓ | ✗ |
| Suspend/remove Admin | ✓ | ✗ | ✗ |
| Suspend/remove Owner | ✓ (another owner; last-owner rule in PRD-02) | ✗ | ✗ |
| Change role to/from Member ↔ Admin | ✓ | ✓ | ✗ |
| Grant or remove Owner role | ✓ | ✗ | ✗ |
| Transfer ownership | ✓ | ✗ | ✗ |
| Create, rename or delete a team | ✓ | ✓ | ✗ |
| Enable/disable an app for the organization | ✓ | ✓ | ✗ |
| Grant/revoke app access for a user or team | ✓ | ✓ | ✗ |
| View the organization audit trail | ✓ | ✓ | ✗ |
| Edit organization settings, name or logo | ✓ | ✓ | ✗ |
| Delete the organization | ✓ | ✗ | ✗ |
| Create resources in an app they can access | ✓ | ✓ | ✓ |

Guardrails:

- **G1.** An Admin cannot act on an Owner or on another Admin's role.
- **G2.** Nobody can change their own role, except an Owner stepping down while another Owner exists.
- **G3.** The last-Owner invariant (PRD-02) is enforced server-side for demotion, removal and suspension.
- **G4 (v1.4, QA AD1).** Every role change goes through a confirmation dialog that states the consequence ("{nama} akan punya kendali penuh atas {organisasi}…"). Promotion to **Owner** requires re-authentication within the last 10 minutes (PRD-01), exactly like "Alihkan kepemilikan"; there is no faster path that skips it. Role changes publish `access.role.changed` (audited) and notify the member.

### 6.3 Resource ACL

**Principals**

| Principal | Meaning |
|---|---|
| `user:<id>` | A single member |
| `team:<id>` | Every active member of the team, at the time of the check |
| `org:<id>` | Every active member of the organization who has access to the app |

**Levels** (ordered): `none < view < edit < manage`

| Level | Allows |
|---|---|
| view | Read, list, search, download, receive notifications |
| edit | view + create children, update, move, comment, attach files |
| manage | edit + delete, change visibility, add or remove principals |

**Visibility presets** (what the Share dialog shows):

| Preset | ACL written | Default for |
|---|---|---|
| Organization (`Semua anggota`) | `org:<id>` → edit | space, project, Doc folder, standalone channel |
| Restricted (`Terbatas`) | Only the listed users/teams | — |
| Private (`Hanya saya`) | Creator → manage only | Doc personal pages |

In every preset the creator always receives `manage`.

**Effective level** = the maximum level across every grant that matches the user (direct, via each team, via organization).

### 6.4 ACL-bearing containers and inheritance (release 1)

| App | Carries an ACL | Inherits (no own ACL in release 1) |
|---|---|---|
| Space (PRD-06 v2.0, app id `space`) | **Space**; Project (inherits or narrows its space) | Board, task, task comments, task attachments (PRD-07 on hold, D22) |
| Doc (PRD-08) | Folder; top-level page | Nested pages, blocks, embedded files |
| File (PRD-07) | None | The source entity's ACL (a file is visible only if its source is) |
| Calendar (PRD-09), Notifications (PRD-10) | None | Read-time check against the source resource |

Rules:

- **I1.** A child is never more visible than its container. For a project inside a space, the Share dialog disables presets wider than the space ("Proyek tidak bisa lebih terbuka dari space-nya.") and `saveAcl` rejects them with `VALIDATION`. When a space is narrowed, projects whose ACL is now wider are narrowed to the space in the same transaction and one `access.acl.changed` per project is published.
- **I2.** Moving a child to another container applies the new container's ACL immediately.
- **I3.** A Restricted/Private container must always have at least one `manage` holder. When the last holder is removed from the organization, `manage` passes to the reassignment target from PRD-03 (default: the admin who removed them).
- **I4.** When a team is deleted, all `team:<id>` grants are removed. When a member leaves a team, their team-derived grants end at the next check.

**Chat containers (v1.4, release 2 candidate, PRD-14 §6):** a standalone **channel** is an ACL container (presets Semua anggota / Terbatas, like projects); messages inherit. A **project channel** is not a container: every check resolves to its project (view → read, edit → write, manage → moderate). A **DM** has fixed participants (2–8) with edit each, no manage and no sharing.

### 6.5 Application access

- App access is effective when **both** hold: the app is enabled for the organization, AND the user has a direct grant or belongs to a team with a grant.
- Owners and Admins receive app access to every enabled app by default.
- In release 1 the registry contains **Space only** (id `space`). Chat (release 2), Doc (release 3) and Agen (release 3, PRD-17) are registered when they ship; File is on hold (D22).
- **Disabling an app for an organization** keeps all data, denies all access (UI and API), suppresses the app's notifications and hides its calendar items. Re-enabling restores the previous state. Deletion happens only under the organization lifecycle rules (PRD-02 §6.4, PRD-13).
- Revoking a user's app access does not change resource ownership. Records they own remain; reassignment is optional, and the admin is prompted when the user owns open tasks.
- **Revoke with impact (QA AD2, v1.4):** removing a grant (user, team or "Semua anggota") first computes who would lose access — members without another grant for the app who are not Owner/Admin — and their open work via the Work Ownership interface (PRD-03 §6.3: open tasks; open requests when PRD-15 ships). If anyone loses access, the dialog "Cabut akses {prinsipal} ke {aplikasi}?" lists them with their counts and offers **"Alihkan pekerjaan mereka ke"** (default: the first Owner/Admin or member who keeps access; option "Jangan alihkan"). Revoke and handover run in one transaction; the handover publishes `membership.work.reassigned` and notifies the target once. If nobody loses access, the grant is removed directly.
- **Staged apps (v1.4):** an app that is released gradually (Chat) is only listed in Organisasi › Aplikasi when a platform flag is on for that organization, so Admins cannot enable it before its rollout wave (PRD-14 §14).

### 6.6 Governance override (Owner/Admin)

Owners and Admins can open any resource in apps they have access to, including Restricted and Private ones, because the organization owns the data.

- **Decision:** allowed, but every override on a resource where the admin has no ACL grant emits `access.override_used` and writes to the audit trail.
- **Alternative rejected:** strict privacy for admins. It blocks legitimate offboarding and investigations and conflicts with organization data ownership.
- **Open question Q2** records a revisit if pilot owners object.

- **DM exception (v1.4, PRD-14 Q1):** the Owner/Admin short-circuit does not apply to `chat.dm`. A non-participant Owner/Admin gets `NOT_FOUND`, the DM is not listed or searchable for them, and no `access.override_used` is written. Restricted standalone channels and project channels follow the normal override rule (a project channel logs the override once, as the project).

### 6.7 Enforcement & propagation (resolves C-03)

- **E1. Sessions and tokens follow PRD-01 v1.1.** Agere Org modules use the DB-backed session (PRD-01 §6.2). Other Agere products (release 2) use access tokens with a TTL of 5 minutes or less (PRD-01 §6.4). In both cases, only identity and `organization_id` context come from the session or token.
- **E2.** Every protected server action and API route runs L1–L4 through the `authz` module. Session data and token claims are never the source of truth for L1, L2 or L4. UI visibility is never the source of truth.
- **E3. No decision cache in release 1.** Each check reads membership, role, app access and ACL from Postgres (indexed; typically one round trip). Any committed change is therefore effective on the **next request**. If the p95 latency target (§4) is missed, a per-instance cache with a TTL of 30 seconds or less may be added; that still meets the 60 s propagation target. L1 membership is never cached.
- **E4. Revocation.** Removing or suspending a member (PRD-03) takes effect on the member's next request to any Agere Org module; the target is p95 ≤ 10 s. Other Agere products (release 2) may trust membership for at most the token TTL, or must call `POST /v1/authz/check` for protected mutations (PRD-01 §6.4).
- **E5. Fail-closed:** if authorization cannot be evaluated (database error or a query exceeding 1 s [H]), the request is denied with a retryable error. It is never allowed.
- **E6. Disclosure rule:** return **404** when the resource belongs to another organization or the user has `none`, so its existence is not revealed (consistent with PRD-02). Return **403** when the user can view but lacks the level the action needs.

### 6.8 API contract (summary)

Agere Org modules call the in-process `authz` module directly. The HTTP endpoints below expose the same operations for administration screens and for other Agere products (release 2).

| Endpoint | Purpose |
|---|---|
| `POST /v1/authz/check` `{user_id, organization_id, action, resource:{app,type,id}}` → `{allow, reason, level}` | Single decision |
| `POST /v1/authz/check-batch` (≤ 200 items) | Calendar, Notifications, search results |
| `GET /v1/authz/filter?app=&type=` → a predicate or ID set | Server-side list filtering; apps must never filter lists in the client |
| `GET/PUT /v1/acl/{app}/{type}/{id}` | Read or replace a container's ACL (requires `manage`) |
| `PUT /v1/orgs/{id}/apps/{app}` `{enabled}` | Enable/disable an app (Owner/Admin) |
| `PUT /v1/orgs/{id}/app-access` `{principal, app, granted}` | Grant/revoke app access |

`reason` values: `NOT_MEMBER`, `APP_DISABLED`, `NO_APP_ACCESS`, `NOT_FOUND`, `FORBIDDEN`, `UNAVAILABLE`.

## 7. Events & audit

Every mutation publishes through the transactional outbox (PRD-00b), and every one below is audit-required (PRD-11).

| Event type | Emitted when |
|---|---|
| `access.role.changed` | An organization role changes |
| `access.app.enabled` / `access.app.disabled` | An app is toggled for the organization |
| `access.app_grant.created` / `access.app_grant.revoked` | App access changes for a user or team |
| `access.acl.changed` | Visibility or principals on a container change (`before`/`after` carry principal IDs only) |
| `access.override_used` | An admin opens a resource through the §6.6 governance override |

## 8. UX

### 8.1 Surfaces

1. **Organisasi › Anggota › [member] › tab Akses:** role selector, app-access toggles, and effective access with its source ("via tim Sales").
2. **Organisasi › Aplikasi:** app list with an enable switch per app and a count of members with access.
3. **Share dialog ("Bagikan", v1.5)** on every ACL container: simple by default, ClickUp-style.
4. **Access-denied pages** for each denial reason.

Share dialog (Agere DS 6.3: `Dialog` 520 px, `Switch`, `Button`, `Avatar`, `Badge`; UI-01 v2.2):

```text
┌ Bagikan tampilan ini                                          ✕ ┐
│ ≡ Dibagikan sebagai satu tampilan · Studio Desain · Papan       │
│                                                                 │
│ 🔗 Tautan privat                                [Salin tautan]   │
│    Hanya untuk yang sudah punya akses                           │
│ ─────────────────────────────────────────────────────────────── │
│ Bagikan dengan                                                  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ (logo) Maju Jaya  [Anggota organisasi]   (YW)(RK)(SW)+5  ◉ │  │
│ └────────────────────────────────────────────────────────────┘  │
│   klik baris → daftar anggota: "Bisa mengedit" / "Admin" / "Tidak ada akses" │
│ ─────────────────────────────────────────────────────────────── │
│ [≡ Akses lanjutan]                   Perubahan tercatat di audit │
└─────────────────────────────────────────────────────────────────┘
```

- **Organization switch** = preset: on → Semua anggota (`org:<id>` → edit); off → Terbatas (existing user/team grants stay). The creator keeps manage (I3).
- **Tautan privat** copies the canonical URL; opening it still runs `authz.check` (no link-based access).
- **Akses lanjutan** opens the per-principal dialog below (behaviour unchanged from v1.4): preset select, principal picker (user/team) with a level select, list sorted Kelola → Edit → Lihat, "Simpan akses".
- **Public link row** ("Bagikan tautan ke siapa saja", read-only, no sign-in) stays hidden until D27 is decided.

```text
┌ Akses lanjutan — "Q4 Launch" ─────────────────────── ✕ ┐
│ Siapa yang bisa mengakses  [ Terbatas              ▾ ]  │
│ [ Tambah orang atau tim…                          ]    │
│ (Y) Yacobus W. · Anda              Kelola       ▾   │
│ (S) Tim Sales · 6 anggota          Edit         ▾   │
│ ⓘ Tugas dan papan di proyek ini mengikuti akses ini   │
│                          [Batal]  [Simpan akses]     │
└──────────────────────────────────────────────────────┘
```

One primary button per dialog (`brand-default`). Principals are sorted Kelola → Edit → Lihat.

### 8.2 Five UX states

| State | Behavior |
|---|---|
| Ideal | The principal list renders with each level. Changes apply on "Simpan akses", followed by the toast "Akses diperbarui." |
| Empty | Restricted with only the creator. Helper text: "Hanya Anda yang bisa mengakses. Tambahkan orang atau tim." |
| Loading | 3 skeleton rows (`Skeleton`, 40px); no flash of an empty list. |
| Error (save failed) | The dialog stays open and edits are kept. Inline `Alert` (error): "Akses belum tersimpan. Koneksi terputus. Coba simpan lagi." |
| Partial / edge | (a) The user lacks `manage`: the dialog is read-only with "Hanya pengelola yang bisa mengubah akses." (b) Removing the last manager is blocked: "Minimal satu orang harus bisa mengelola." (c) The container moved: "Akses sekarang mengikuti folder 'Legal'." |

### 8.3 Access-denied microcopy (Bahasa Indonesia, "Anda")

| Reason | Title | Body | Action |
|---|---|---|---|
| NOT_FOUND | Halaman tidak ditemukan | Halaman ini tidak ada atau Anda tidak punya akses. | Kembali ke beranda |
| FORBIDDEN | Akses Anda terbatas | Anda bisa melihat item ini, tetapi tidak bisa mengubahnya. Minta akses edit ke pengelola. | Minta akses |
| NO_APP_ACCESS | Anda belum punya akses ke Project | Admin organisasi Anda bisa memberikan akses. | Hubungi admin |
| APP_DISABLED | Project tidak aktif di organisasi ini | Data tetap aman. Admin bisa mengaktifkannya lagi di Organisasi › Aplikasi. | Kembali |
| UNAVAILABLE | Akses belum bisa diperiksa | Layanan sedang bermasalah. Coba lagi dalam beberapa saat. | Coba lagi |
| ADMIN_ONLY (v1.4) | Halaman ini khusus Owner dan Admin | Hubungi Owner atau Admin organisasi bila Anda membutuhkan informasi di halaman ini. | Kembali ke beranda |

ADMIN_ONLY is used for pages that appear in the Kelola area but require Owner/Admin (Akses, Aplikasi, Audit). Resources the user cannot see still return NOT_FOUND (disclosure rule E6).

### 8.4 Accessibility (WCAG 2.1 AA, Agere DS release gate)

- The level select is labelled per row (`aria-label="Level akses untuk Tim Sales"`).
- The principal picker is a combobox with keyboard support.
- Toasts announce through `role="status"`.
- Denied states are never conveyed by color alone.
- Focus returns to the "Bagikan" trigger when the dialog closes.

## 9. User stories & acceptance criteria

**US-1 — Restrict a project.** As a project creator, I want to restrict a project to specific people or teams, so that sensitive work is not visible to the whole organization.

```gherkin
Given I have manage on project "Q4 Launch"
When I set visibility to "Terbatas" and add "Tim Sales" with Edit
Then only I and active members of Tim Sales can list, open or search the project and its tasks
And an access.acl.changed event is recorded in the audit trail

Given a member outside Tim Sales has the project's direct URL
When they request it
Then the API returns 404 and the UI shows "Halaman tidak ditemukan"

Given the save request fails on the network
When I press "Simpan akses"
Then the previous ACL remains in force, my edits stay in the dialog, and an error message is shown
```

**US-2 — Team-based access (resolves C-01).** As an admin, I want to grant access to a team, so that people who join the team inherit it automatically.

```gherkin
Given Tim Sales has Edit on deal "PT Maju"
When Rina is added to Tim Sales
Then Rina can edit "PT Maju" within the permission-propagation target (p95 ≤ 60 s)

When Rina is removed from Tim Sales and has no other grant
Then Rina receives 404 for "PT Maju" within the propagation target

Given Tim Sales is deleted
Then all team:TimSales grants are removed and each affected container still has a manager (rule I3)
```

**US-3 — Immediate revocation (resolves C-03).** As an owner, I want a removed member to lose access immediately, so that a departing employee cannot take data.

```gherkin
Given Budi has an active Agere Org session with this organization active
When an admin removes Budi from the organization (PRD-03)
Then Budi's next request to any organization-scoped page or API is denied with NOT_MEMBER (p95 ≤ 10 s after commit)
And Budi's session and global identity (PRD-01) remain valid for his other organizations
```

**US-4 — Role change enforced server-side.** As an admin, I want role changes to apply without the user reloading.

```gherkin
Given Sari is an Admin with the admin console open
When the owner changes Sari to Member
Then Sari's next protected admin action returns 403 FORBIDDEN, even if her UI still shows the control
And her navigation updates on the next permission refresh

Given an Admin attempts to demote an Owner via the API
Then the request is rejected with 403 and no event is emitted
```

**US-5 — Disable an app.** As an admin, I want to disable an app without losing data.

```gherkin
Given Project is disabled for the organization
When any member opens Project or calls a Project API
Then access is denied with APP_DISABLED
And Project items are hidden from Tugas saya (and Calendar in release 2) and no Project notifications are sent
When Project is re-enabled
Then all previous data and ACLs are available unchanged
```

**US-6 — Fail closed.** As a security owner, I want the system to deny access when authorization cannot be evaluated.

```gherkin
Given the authorization query fails or exceeds 1 s [H]
When a module evaluates a protected request
Then the request is denied with UNAVAILABLE (retryable) and never served from an unauthorized path
```

**US-7 — Governance override is audited.** As an owner, I want to know when an admin opens a private resource.

```gherkin
Given Adi is an Admin with no ACL grant on private page "Gaji 2027"
When Adi opens it
Then access is allowed
And an access.override_used audit event records actor, resource, time, IP and request_id
```

**US-8 — Simple share (v1.5).** As a project manager, I want to share a view with the whole organization in one switch.

```gherkin
Given project "Studio Desain" is Terbatas and I have manage
When I open "Bagikan" and turn on the "Maju Jaya · Anggota organisasi" switch
Then the preset becomes Semua anggota, access.acl.changed is published with before/after
And the toast "Semua anggota Maju Jaya bisa membuka tampilan ini." is shown
Given the project's space is Terbatas to Tim Desain
Then the switch is disabled with "Proyek tidak bisa lebih terbuka dari space-nya."
When I choose "Salin tautan"
Then the canonical URL is copied, and a member without access who opens it gets 404
```

## 10. Edge cases

| Case | Expected behavior |
|---|---|
| A user belongs to two organizations and opens a link to the other one | The URL slug sets the context (PRD-02 §6.2): the request is evaluated in that organization. A link whose slug and resource belong to different organizations → 404. |
| A user is in several teams with different levels | The maximum level applies |
| Suspended member | Treated as not-member at L1; their grants are kept so reactivation restores access |
| An invited member who has not activated | No access at any layer (PRD-03) |
| A child is moved across containers | Takes the new container's ACL immediately (I2); open sessions re-check on the next request |
| Stale UI after a downgrade | The server rejects the action; the UI shows the FORBIDDEN toast and refreshes permissions |
| Search results and counts | Filtered server-side before counting; counts never reveal hidden records |
| Notification or calendar item for a resource the user lost access to | Hidden at read time via `checkBatch` (PRD-09, PRD-10) |
| Concurrent ACL edits | Last write wins with an optimistic version check. The second saver sees: "Akses baru saja diubah orang lain. Muat ulang untuk melihat versi terbaru." |

## 11. Non-functional requirements

- **Performance:** `check` p95 ≤ 30 ms; `checkBatch` of 200 items p95 ≤ 150 ms (one set-based query) [H].
- **Availability:** authorization runs in-process, so it shares the Agere Org availability target (Index § Engineering context). A database outage denies access (E5) rather than opening it.
- **Security:** fail-closed; every decision logged with `request_id` for sampled tracing; no permission logic in clients; ACL changes require `manage` and are rate-limited.
- **Privacy:** ACL and audit payloads carry principal IDs, never names or emails.
- **Accessibility:** WCAG 2.1 AA per Agere DS; 24×24 minimum targets.

## 12. Dependencies & required amendments

| PRD | Required change |
|---|---|
| PRD-01 | Aligned in v1.1: DB sessions (§6.2); tokens of 5 minutes or less for other products (§6.4) |
| PRD-03 | Aligned in v1.1: team principals (§6.4); "Alihkan pekerjaan" implements rule I3 (§6.3) |
| PRD-05 / 06 / 08 | Adopt the containers in §6.4; replace the phrases "authorized scope", "project visibility" and "team permissions" with references to this PRD |
| PRD-09 / 10 | Filter at read time via `checkBatch` |
| PRD-11 | Audit-required events in §7, including `access.override_used` |
| PRD-12 | Organization-level access screens live under Organisasi, not personal Settings (conflict C-07) |
| PRD-00b | `access.*`, `membership.*` and `team.*` event schemas (aligned in v1.1) |

## 13. Open questions

| # | Question | Proposed default | Decide by |
|---|---|---|---|
| Q1 | Should CRM deals default to Organization or owner + team visibility? | Organization (matches the collaboration-first positioning) | Pilot sales interviews |
| Q2 | Is the admin governance override acceptable to pilot owners? | Yes, with audit | Pilot onboarding |
| Q3 | Does a `comment` level between view and edit need to exist in release 1? | No — revisit with Doc | Doc PRD v1.1 |
| Q4 | Is a decision cache needed at all? | No, unless p95 exceeds 30 ms in the pilot | Pilot telemetry |
