# PRD-00b — Agere Event Contract

| Field | Value |
|---|---|
| Version | 1.2.1 (supersedes 1.2) |
| Status | Draft — ready for engineering review |
| Owner | [TBD — Backend Engineer (implementation) + Product Owner agere/org] |
| Last updated | 26 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel (Pro plan for per-minute cron), Postgres; team of 1 FE + 1 BE |
| Producers | PRD-01, 02, 03, 04, 05, 06, 07, 08 (and future Agere products) |
| Consumers (release 1) | PRD-10 Notifications (async), PRD-11 Audit (same transaction) |
| Resolves review items | Blocker P0-2; C-06 (time semantics); C-08 (notification policy hook); the PRD-11 audit fail-open/fail-closed gap |

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> **Amendment 26 Sep 2026 (v1.2.1):**
> - `space.task.created` gains the optional field `data.source = {module: "chat" | "doc", type, id}` (PRD-14 §8, PRD-08 D2). Optional field → no `version` bump (D7).
> - `space.project.updated` carries project status changes (`before/after.status`, PRD-06 §6.8).
> - Catalog entries registered for later releases (inactive until their module ships): `chat.channel.created/updated/archived/restored` (standalone channels only), `chat.channel.deleted` (audited), `chat.dm.created`, `chat.message.created/updated/deleted`, `chat.message.moderated` (audited) — `data` carries ids only, never the message body (PRD-14 §8); `lead.pipeline.created/updated/archived` and `lead.pipeline.stage_deleted` (audited, PRD-05 A6).

### Change log v1.1 → v1.2

- Catalog completed for release 1: organization lifecycle (PRD-02 v1.1), Project (projects/comments) (PRD-06 v1.1), `membership.work.reassigned` (PRD-03), `identity.account.*` (PRD-13).
- Added the optional envelope field `bulk_operation_id` (PRD-10 bulk rule).
- "Request context" organization = the organization resolved from the URL slug (PRD-02 §6.2).

### Change log v1.0 → v1.1

- **Delivery redesigned for Vercel and a 2-person team.** Postgres is both outbox and delivery ledger; consumers run in-process right after commit, and a per-minute cron sweeper retries.
- **Vercel Queues** (public beta at the time of writing) is the documented upgrade path, not a release 1 dependency.
- **Audit is written in the same transaction** as the mutation, not by an async consumer.
- Added the `scope` field: `organization` or `user`. User-scoped identity events carry no `organization_id`.
- Added `seq` for ordering. The transport gives no ordering guarantee.
- Replay now reads from the outbox table (30-day retention) instead of a bus.
- Calendar release 1 uses the in-process Schedulable interface (§8.2) instead of consuming events.
- Catalog aligned with PRD-01 v1.1, PRD-03 v1.1 and PRD-04 v1.2.

---

## 1. Problem

Notifications and Audit (and, later, Calendar, search and other Agere products) react to state changes they do not own. v1.0 of PRD-09/10/11 referenced an "event contract" and a "notification policy" that did not exist.

Without one contract:

- Each producer invents a payload.
- Events get lost or duplicated.
- The Audit invariant ("no misleading successful mutation event") cannot be guaranteed.

## 2. Goal

Define **one envelope, one delivery mechanism and one versioning rule** for every cross-module state change. The implementation must be small enough for one backend engineer to build in about one sprint [H] and operate on Vercel without extra infrastructure.

## 3. Personas & jobs to be done

| Persona | Job to be done |
|---|---|
| Backend engineer (producer) | "When my feature changes state, I call one function inside the transaction and I'm done." |
| Backend engineer (consumer) | "I want a stable payload and a guarantee I'll process every event at least once, without duplicates hurting users." |
| Frontend engineer | "I want notification and activity data to be consistent with what the user just did." |
| Organization admin (indirect) | "The audit trail and notifications must be complete and correct." |

## 4. Success metrics

[H] = hypothesis target; baselines are captured during the first 30 days.

| Metric | Target | Window | Type |
|---|---|---|---|
| Committed mutations without their event, or events without their mutation | **0** | Continuous (daily reconciliation, D12) | Guardrail |
| Audit-required mutations without an audit row | **0** | Continuous (guaranteed by D2) | Guardrail |
| Duplicate side effects (for example, two notifications for one event) | **0** | Continuous | Guardrail |
| Cross-organization delivery incidents | **0** | Continuous | Guardrail |
| Commit → consumer processed, fast path (p95) | ≤ 5 s [H] | Weekly | Primary |
| Commit → consumer processed, including retries (p99) | ≤ 3 min [H] | Weekly | Primary |
| Deliveries ending in `dead` | < 0.1% [H] | Weekly | Guardrail |

## 5. Scope

**Must:**

- Envelope and naming.
- `publish()` SDK inside the DB transaction; same-transaction audit writer.
- Postgres outbox plus delivery ledger; in-process fast-path dispatch; cron sweeper with retries and dead-lettering.
- Idempotent consumers; `seq` ordering guard.
- Tenancy enforcement; PII tagging.
- Release 1 catalog (§8.1); basic observability (§11).

**Should:**

- Admin-only replay command for a consumer and time range (read-model consumers only).
- JSON Schema per event type validated in CI.

**Could (release 2):** Vercel Queues relay for fan-out to other Agere products (§10, Option B).

**Won't (release 1):**

- Exactly-once delivery.
- Event sourcing as the system of record.
- Cross-organization events.
- Customer-facing webhooks.
- A separate message broker.

## 6. The envelope

```json
{
  "event_id": "018f6b1e-7c2a-7c11-9a5e-3f9d2b7c4e10",
  "seq": 48213,
  "type": "space.task.assigned",
  "version": 1,
  "scope": "organization",
  "organization_id": "org_…",
  "occurred_at": "2026-09-25T08:14:03.120Z",
  "recorded_at": "2026-09-25T08:14:03.188Z",
  "producer": { "module": "space", "release": "<vercel deployment id>" },
  "actor": { "type": "user", "user_id": "usr_…" },
  "subject": { "module": "space", "type": "task", "id": "tsk_…", "container": { "type": "project", "id": "prj_…" } },
  "data": { },
  "audit": true,
  "pii": ["data.assignee_user_id"],
  "request_id": "req_…",
  "causation_id": null,
  "bulk_operation_id": null
}
```

| Field | Rule |
|---|---|
| `event_id` | UUIDv7. The idempotency key everywhere. |
| `seq` | Postgres `bigserial` from the outbox. Updates to one subject are serialized by row locks, so `seq` increases per subject. Used for ordering (D6). |
| `type` | `<module>.<entity>.<past-tense verb>`, lower_snake per segment. |
| `version` | Integer schema version of `data` for this `type` (§7.4). |
| `scope` | `organization` (default) or `user`. |
| `organization_id` | **Required when `scope = organization`**; must equal the request-context organization (resolved from the URL slug, PRD-02 §6.2). **Must be null when `scope = user`** (identity and security events of a person, PRD-01 §7). User-scoped events are never delivered to organization-scoped consumers or audit trails. |
| `occurred_at` / `recorded_at` | UTC, RFC 3339, millisecond precision. `recorded_at` comes from the database clock. |
| `actor.type` | `user`, `system` or `platform_admin`. `platform_admin` actions inside an organization are always `audit: true` and visible to that organization's Owners. |
| `subject.container` | The ACL container (PRD-04 §6.4), used for read-time authorization. |
| `data` | The minimum needed. **No secrets, tokens or passwords.** IDs over names; emails only as hashes (PRD-03 §7). |
| `audit` | Taken from the catalog (§8.1), never from the caller. |
| `pii` | JSON paths in `data` holding personal data. Audit redacts them per PRD-11; retention follows PRD-13. |
| `bulk_operation_id` | Optional. Set on every per-item event produced by one bulk operation (for example the PRD-03 reassignment). Notifications ignores these and relies on the operation's summary event (PRD-10 §5). |

### 6.1 Time semantics for schedulable items (resolves C-06)

Every due or scheduled time, in events and in the Schedulable interface (§8.2), uses exactly one shape:

| Shape | Meaning | Rendering |
|---|---|---|
| `{ "kind": "date", "date": "2026-10-01" }` | All-day date, no timezone | All-day row on that date for every viewer |
| `{ "kind": "instant", "at": "2026-10-01T03:00:00Z" }` | Exact moment | Viewer's timezone (PRD-12 preference, else organization default, else Asia/Jakarta) |

Overdue rules:

- A `date` is overdue after 23.59.59 on that date in the **assignee's** timezone.
- An `instant` is overdue after `at`.

## 7. Delivery

### 7.1 Transactional outbox and same-transaction audit

```text
BEGIN
  UPDATE tasks SET assignee_id = …
  events.publish(tx, "space.task.assigned", data, {subject, actor})
     ├─ INSERT outbox row
     ├─ INSERT one event_deliveries row per subscribed consumer (status = pending)
     └─ if catalog.audit: INSERT audit_log row (redacted per `pii`)
COMMIT                      ← all of it commits, or none of it does
after commit: waitUntil(dispatch(event_id))    ← fast path, same function invocation
every minute: cron sweeper → dispatch(due pending/failed deliveries)   ← retry path
```

- **D1.** If any insert fails, the whole transaction rolls back and the user sees the normal save error. A committed mutation without its event is impossible, and so is an event without its mutation.
- **D2. Audit is not a consumer.** Audit rows are written in the same transaction (PRD-11). An audit-required mutation therefore either has its audit row or did not happen. This satisfies PRD-11 AC-3 and removes any audit lag.
- **D3. Fast path.** After commit, the request schedules `dispatch(event_id)` with Vercel's `waitUntil`, so it runs after the response is sent. It is best-effort: if the function instance ends early, the sweeper delivers later.
- **D4. Sweeper.** A Vercel Cron job runs **every minute** (requires the Vercel **Pro** plan).
  - It claims due deliveries with `SELECT … FOR UPDATE SKIP LOCKED` (batch of 100 [H]) and runs them within the function's time limit.
  - Rows are claimed with a lease (`locked_until = now() + 2 min` [H]), so an overlapping run cannot process the same row twice.

### 7.2 At-least-once and idempotency

- **D5.** Delivery is at-least-once: a crash after a side effect but before the row is marked `done` causes a redelivery. Every consumer makes side effects idempotent on `(event_id, consumer)`. Example: notifications have a unique constraint on `(event_id, recipient_user_id)`.

### 7.3 Ordering

- **D6.** No delivery order is guaranteed. Consumers that keep state per subject store the highest `seq` applied and ignore events with a lower `seq` for that subject.

### 7.4 Versioning

- **D7.** Adding optional fields: same `version`; consumers ignore unknown fields.
- **D8.** A breaking change requires `version + 1`. Because the outbox keeps 30 days of events (D11), consumers must handle **every version present in the retention window**. Within the monolith, producer and consumer ship in the same deployment.
- **D9.** Once external consumers exist (release 2), the producer **dual-publishes** v(n) and v(n+1) for 90 days [H] or until every registered consumer migrates, whichever is later.
- **D10.** A consumer that meets an unknown version marks the delivery `dead` and alerts. It never guesses.

### 7.5 Retries, dead letters and replay

- **D11. Retries.** Exponential backoff: 1, 2, 4, 8, 16, 30, 60 minutes [H]. After **8 failed attempts** the delivery becomes `dead`, an alert fires, and the row keeps `last_error`.
  - Outbox rows are retained for **30 days** [H]; delivery rows are retained until the outbox row is purged.
- **D12. Reconciliation.** A daily cron checks that each outbox row has a delivery row per subscribed consumer, and reports `pending` rows older than 10 minutes and all `dead` rows.
- **D13. Replay.** An admin-only command resets deliveries for **read-model consumers** to `pending` for a time range. **Notification sends are never replayed:** their consumer is flagged `replayable: false`.

### 7.6 Tenancy and authorization

- **D14.** `publish()` rejects:
  - `scope = organization` without an `organization_id` equal to the request context.
  - `scope = user` with an `organization_id`.
- **D15. An event does not grant access.** Consumers that display data authorize at read time with the `authz` module's `checkBatch` (PRD-04 §6.8), using `subject` and `subject.container`.
- **D16.** On subject deletion, the producer publishes `<module>.<entity>.deleted`. Consumers tombstone derived items; the UI never links to a missing record.

## 8. Catalog and interfaces

### 8.1 Release 1 event catalog

**Naming note:** module keys are stable internal ids, not display names. `space` is the internal id of the app shown to users as **Project**. Event types keep the `space.` prefix permanently; audit rows written with it stay valid.

"Audit (tx)" = written in the same transaction (D2). "Notify" = PRD-10 async consumer.

| Type | Scope | Producer | Consumers | Audit (tx) |
|---|---|---|---|:-:|
| `security.session.revoked` | user | Identity (01) | Notify (user-scoped security notice) | — |
| `security.login.failed_threshold` | user | Identity (01) | Notify | — |
| `security.password.changed` | user | Identity (01) | Notify | — |
| `security.account.linked` / `.unlinked` | user | Identity (01) | Notify | — |
| `security.mfa.changed` | user | Identity (01) | Notify | — |
| `identity.account.deletion_requested` | user | Identity (13) | Notify (email) | — |
| `identity.account.deleted` | user | Identity (13) | — | — |
| `org.organization.created` / `.updated` | org | Org (02) | — | ✓ |
| `org.ownership.transferred` | org | Org (02) | Notify | ✓ |
| `org.organization.deletion_scheduled` / `.deletion_cancelled` | org | Org (02) | Notify | ✓ |
| `org.organization.suspended` / `.reactivated` | org | Org (02, platform admin) | Notify (email) | ✓ |
| `membership.invitation.created` / `.resent` / `.revoked` / `.expired` | org | People (03) | — (the email is sent synchronously, PRD-03 §7) | ✓ |
| `membership.member.activated` | org | People (03) | Notify (Owners/Admins, digestible) | ✓ |
| `membership.member.suspended` / `.reactivated` | org | People (03) | Notify (affected user, email) | ✓ |
| `membership.member.removed` | org | People (03) | Notify (affected user, email) | ✓ |
| `membership.member.left` | org | People (03) | — | ✓ |
| `membership.work.reassigned` | org | People (03) | Notify (one summary per target) | — |
| `team.team.created` / `.renamed` / `.deleted` | org | People (03) | — | ✓ |
| `team.member.added` / `.removed` | org | People (03) | — | ✓ |
| `access.role.changed` | org | Access (04) | Notify | ✓ |
| `access.app.enabled` / `.disabled` | org | Access (04) | — | ✓ |
| `access.app_grant.created` / `.revoked` | org | Access (04) | Notify | ✓ |
| `access.acl.changed` | org | Access (04) | — | ✓ |
| `access.override_used` | org | Access (04) | — | ✓ |
| `space.project.created` / `.updated` / `.archived` / `.restored` | org | Project (06) | — | — |
| `space.project.deleted` | org | Project (06) | — | ✓ |
| `space.task.created` / `.updated` / `.deleted` | org | Project (06) | — | — |
| `space.comment.created` (Should) | org | Project (06) | Notify (mentions) | — |
| `space.task.assigned` | org | Project (06) | Notify | — |
| `lead.deal.stage_changed` | org | Lead (05) | — | ✓ |
| `lead.deal.assigned` | org | Lead (05) | Notify | — |
| `lead.next_action.created` / `.updated` / `.completed` / `.deleted` | org | Lead (05) | Notify (on assignment change only) | — |
| `file.file.uploaded` / `.deleted` | org | File (07) | — | delete ✓ |
| `doc.page.trashed` / `.restored` / `.purged` | org | Doc (08) | — | ✓ |

Events with no release 1 consumer are still published. They feed the audit trail where marked, replay, and later consumers.

**Notification policy (C-08):** PRD-10 owns the rule table (`type` → recipients, channel, default, can be disabled, batching). `security.*` notices cannot be disabled. The reassignment wave from PRD-03 R5 is collapsed into one summary per recipient.

**Reminders** ("jatuh tempo 1 jam lagi") are not events. The Notifications cron (per minute) queries due items through the Schedulable interface (§8.2).

### 8.2 Schedulable interface (in-process; proposed PRD-09 release 1 architecture)

Calendar and reminders read schedulable items **at query time** from each module. Nothing is copied into a read model, so data is always fresh and needs no event consumer:

```ts
listSchedulable(orgId, userId, range): Array<{
  module: "space" | "lead", type: string, id: string,
  title: string, due: Due /* §6.1 */, status: string,
  container: { type: string, id: string }, url: string
}>
```

Each module filters by authorization inside the call (PRD-04 E2). Events for Calendar become necessary only when an external Agere product contributes items (release 2).

## 9. User stories & acceptance criteria

**US-1 — Atomic publish with audit.**

```gherkin
Given an Admin changes Rina's role
When the transaction commits
Then the role, one access.role.changed outbox row, its delivery rows, and one audit_log row all exist

Given the audit_log insert fails
Then the role change is rolled back and the Admin sees "Perubahan belum tersimpan. Coba lagi."
```

**US-2 — Fast path and retry.**

```gherkin
Given a task is assigned
Then the assignee's notification exists within 5 s (p95) via the fast path

Given the fast-path dispatch did not run (instance ended)
Then the sweeper delivers it within the next cron run
```

**US-3 — Duplicates are harmless.**

```gherkin
Given the Notifications consumer created a notification for event E but crashed before marking the delivery done
When the sweeper redelivers E
Then the unique constraint prevents a second notification and the delivery is marked done
```

**US-4 — Out-of-order safety.**

```gherkin
Given a consumer applied seq 120 for task T
When an event for T with seq 118 is delivered late
Then it is ignored for T's state
```

**US-5 — Tenancy.**

```gherkin
Given a producer publishes scope=organization without organization_id
Then publish() throws, the transaction rolls back, and the error is logged

Given a scope=user security event
Then it never appears in any organization's audit trail or organization-scoped notification list
```

**US-6 — Read-time authorization.**

```gherkin
Given a notification about deal D exists for Rina
And Rina loses access to D
When she opens her inbox
Then that notification is hidden (PRD-04 checkBatch)
```

**US-7 — Poisoned event.**

```gherkin
Given a delivery fails 8 times
Then its status becomes dead, an alert fires, other deliveries keep flowing,
And the daily reconciliation lists it until an engineer resolves or replays it
```

## 10. Options & trade-offs

| Criterion | Option A — Postgres outbox + in-process dispatch + cron sweeper (**recommended, release 1**) | Option B — Postgres outbox + Vercel Queues push consumers |
|---|---|---|
| New infrastructure | None (Postgres + Vercel Cron) | Vercel Queues (public beta at the time of writing) |
| Fast-path latency | Seconds (`waitUntil`) | Seconds |
| Retry-path latency | ≤ about 1 minute per attempt (cron granularity) | Configurable per trigger |
| Fan-out to other Agere products | Manual | Native (consumer groups) |
| Ordering | None — `seq` guard (D6) | None — approximate order only; same guard |
| Replay window | 30 days, from the outbox | Queue TTL up to 7 days; the outbox is still the source for longer replay |
| Operational load for 1 BE | Lowest — everything is inspectable with SQL | Low, plus beta risk. Push consumers are pinned to the publishing deployment, so a failing old deployment keeps retrying until its messages expire or `maxDeliveries` is reached. |

**Recommendation:** Option A for release 1. The `dispatch()` adapter is the only component to replace when moving to Option B. Revisit when a second Agere product needs events, or when sweeper runs regularly exceed 50% of the function time limit.

## 11. Non-functional requirements & observability

- **Performance:** `publish()` adds ≤ 5 ms p95 to the transaction (2–3 inserts) [H].
- **Scale assumption:** ≤ 50,000 events/day in the pilot [H]. At 100 per run × 1 run/min, the sweeper retry capacity is 144,000 per day before the fast path is counted.
- **Observability:** one internal page and SQL views showing pending by consumer, oldest pending age, dead count and per-type publish rate. Alerts go to the BE engineer when oldest pending is > 10 minutes or dead > 0.
- **Security:** payloads carry no secrets; PII is tagged; consumers run server-side only.
- **Compliance:** 30-day outbox retention bounds PII in events. Longer retention needs follow PRD-13 (UU PDP No. 27/2022).

## 12. Dependencies & required amendments

| PRD | Status |
|---|---|
| PRD-01 v1.1 | Aligned: user-scoped `security.*` events |
| PRD-03 v1.1 | Aligned: `membership.*`, `team.*`; synchronous invitation email; reassignment batching |
| PRD-04 v1.2 | Aligned: `access.*`; no cache consumer; `checkBatch` for read-time authorization |
| PRD-06 v1.1 | Aligned: events, `due`, Schedulable, Work Ownership |
| PRD-05 | Deferred to release 3; its addendum binds it to this contract |
| PRD-09 | Deferred to release 2; its addendum adopts query-time aggregation (§8.2) |
| PRD-10 v1.1 | Aligned: rule table, bulk rule, digest cron |
| PRD-11 v1.1 | Aligned: same-transaction writer, redaction |
| PRD-12 v1.1 | Aligned: timezone rule, security activity (30 days) |
| PRD-13 v1.0 | Aligned: retention of outbox, notifications and security activity |

## 13. Open questions

| # | Question | Proposed default | Decide by |
|---|---|---|---|
| Q1 | Vercel plan | Pro (per-minute cron is required by D4) | Budget owner |
| Q2 | Outbox retention | 30 days | PRD-13 legal review |
| Q3 | Should `space.task.updated` carry changed fields only? | Changed fields + `status` + `due` | BE engineer |
| Q4 | Trigger to adopt Vercel Queues | Second Agere product needs events, or Queues reaches GA and sweeper load > 50% | Quarterly review |
