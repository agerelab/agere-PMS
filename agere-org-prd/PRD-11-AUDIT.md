# PRD-11 — Audit Trail

| Field | Value |
|---|---|
| Version | 1.1.2 (supersedes 1.1.1) |
| Status | Draft — release 1 |
| Owner | [TBD — Product Owner agere/org] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE (PRD-00) |
| Depends on | PRD-00b (same-transaction writer D2, catalog `audit` flag, `pii`), PRD-04 (viewer permission), PRD-13 (retention) |
| Resolves review items | Per-PRD gaps for 11 (PII redaction, write failure, retention, viewers, platform admin) |

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> **Amendment 26 Sep 2026 (v1.1.1):** the viewer lists entries **newest first by timestamp**, always (QA AD3). New action groups appear when their modules ship: **Chat** (`chat.channel.deleted`, `chat.message.moderated`, release 2 candidate, PRD-14) and Lead pipeline changes (`lead.pipeline.*`, release 3, PRD-05 A6). Undoing a deal stage change writes its own `lead.deal.stage_changed` entry (PRD-05 A2).

### Change log v1.1.1 → v1.1.2 (28 Sep 2026)

- **Agent events** (PRD-17 v1.0 §11) join the catalog: `agent.agent.*` (incl. `.permission_changed`), `agent.action.approved/.rejected/.expired`, `agent.trigger.*`, `agent.usage.threshold_reached`. The viewer gets an **Agen** category. An approved action is audited twice by design: once as `agent.action.approved` (who approved what) and once by the owning module's own event with `actor = approver` and `data.source` pointing at the action.
- **Languages (D45):** audit entries store event data, not sentences; the viewer renders action text in the **viewer's** language. CSV export uses the exporting user's language for column headers and ISO 8601 timestamps.

### Change log v1.0 → v1.1

- Audit rows are written **in the same transaction** as the mutation, so a mutation without its audit row is impossible.
- Coverage is defined by the PRD-00b catalog.
- Added redaction, retention (1 year), a viewer for Owner/Admin, visibility of platform-admin actions, and database-level immutability.

---

## 1. Problem

Owners and Admins must be able to answer "who changed what, when, and from where" for security-sensitive and business-critical actions. The answer must be trustworthy: complete, unalterable, and free of data that should not be kept.

## 2. Goal

An immutable, searchable, organization-scoped audit trail with guaranteed coverage of every catalog event marked `audit`.

## 3. Success metrics

| Metric | Target | Type |
|---|---|---|
| Audit-flagged mutations without an audit row | **0** (guaranteed by the transaction) | Guardrail |
| Unauthorized audit reads | **0** | Guardrail |
| Median time to find a specific event (usability test: "who removed Budi?") | ≤ 60 s [H] | Primary |
| Secrets or raw PII fields found in audit rows (quarterly sample review) | **0** | Guardrail |

## 4. Scope

**Must (release 1):**

- Same-transaction writer.
- Redaction.
- Viewer at **Organisasi › Audit** for Owner/Admin: list, filters, detail.
- Platform-admin actions included.
- 1-year retention.
- Immutability.

**Should:** CSV export of a filtered range.

**Won't (release 1):** alerting rules, SIEM streaming, per-user activity reports, member-visible audit.

## 5. Design

### 5.1 Record

| Field | Source |
|---|---|
| `id` | Same as the event's `event_id` |
| `organization_id` | Event (organization scope only; user-scoped events are never audited here) |
| `actor_user_id`, `actor_type` (`user` / `system` / `platform_admin`) | Event `actor` |
| `action` | Event `type` |
| `resource_type`, `resource_id` | Event `subject` |
| `before`, `after` | Event `data`, after redaction (§5.2) |
| `request_id`, `ip`, `user_agent` | Request context |
| `created_at` | Event `recorded_at` |

### 5.2 Redaction

- Fields listed in the event's `pii` are stored as a **keyed hash** (so equality is still searchable), never as plain values.
- Secrets can never be present (PRD-00b §6).
- Names are **not** stored. The viewer resolves `actor_user_id` to the current display name at read time; deleted accounts show "Pengguna terhapus" (PRD-13).
- `ip` and `user_agent` are personal data. They are kept for the retention period and shown only to Owners/Admins.

### 5.3 Immutability

- The application's database role has `INSERT` and `SELECT` only on `audit_log`: no `UPDATE`, no `DELETE`.
- Only the PRD-13 purge job (a separate role) deletes rows older than retention or belonging to purged organizations.
- No product UI edits or deletes audit rows (v1.0 invariant kept).

### 5.4 Coverage (release 1)

Every event in the PRD-00b §8.1 catalog with Audit (tx) = ✓. That covers organization, ownership, lifecycle, invitations, membership, teams, roles, app access, ACL, governance override and project deletion. Lead and Doc events join as those modules ship.

### 5.5 Viewer

- **Who:** Owner and Admin (PRD-04 matrix). Members get 404.
- **Filters:** date range (default last 30 days), actor, action group (Anggota, Tim, Akses, Organisasi, Project), resource. The search box matches a resource ID or an exact email (compared via hash).
- **List columns:** time (24 Sep 2026 14.30 WIB), actor, action in plain language ("mengubah peran Rina dari Anggota menjadi Admin"), resource. Platform-admin rows carry a `Badge` "agere support".
- **Detail:** `Sheet` with before/after as a field-level diff; hashed fields show "Disamarkan"; plus request ID, IP and user agent.

## 6. UX states

| State | Behavior and microcopy |
|---|---|
| Ideal | Table sorted newest first, 50 per page, compact density |
| Empty | "Belum ada aktivitas pada rentang ini. Ubah filter untuk melihat periode lain." |
| Loading | 10 skeleton rows |
| Error | "Riwayat audit belum bisa dimuat. Coba lagi." |
| Partial | Range beyond retention: "Riwayat disimpan 1 tahun. Data sebelum 25 Sep 2025 sudah dihapus sesuai kebijakan retensi." |

## 7. User stories & acceptance criteria

**US-1 — Role change audited (v1.0 AC preserved).**

```gherkin
Given an Admin changes Rina's role to Admin
When the operation succeeds
Then exactly one audit row exists with action access.role.changed, before=member, after=admin, and the Admin as actor
```

**US-2 — No misleading audit (v1.0 AC preserved).**

```gherkin
Given a role change fails before commit
Then no audit row exists for it
Given the audit insert fails
Then the role change is rolled back (PRD-00b D1–D2)
```

**US-3 — Access (v1.0 AC preserved).**

```gherkin
Given Dewi is a Member
When she requests /maju-jaya/organisasi/audit or its API
Then she receives 404
```

**US-4 — Immutability.**

```gherkin
Given any application code path
When it attempts UPDATE or DELETE on audit_log
Then the database rejects it
```

**US-5 — Platform admin visible.**

```gherkin
Given agere support suspends Maju Jaya
Then Maju Jaya's Owners see the row with the "agere support" badge after reactivation
```

## 8. Non-functional requirements

- The audit insert adds ≤ 3 ms p95 to the transaction [H].
- Viewer: p95 ≤ 500 ms for 30 days in a 500-member organization [H]; indexes on `(organization_id, created_at desc)`, `(organization_id, actor_user_id)` and `(organization_id, action)`.
- Retention: **1 year** rolling [H — confirm with counsel], purged daily (PRD-13).

## 9. Dependencies

PRD-00b (writer, catalog, `pii`), PRD-04 (permission), PRD-02 (organization lifecycle), PRD-13 (retention, purge role).
