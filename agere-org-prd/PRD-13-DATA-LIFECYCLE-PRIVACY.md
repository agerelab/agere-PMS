# PRD-13 — Data Lifecycle & Privacy

| Field | Value |
|---|---|
| Version | 1.0.2 |
| Status | Draft — release 1; **legal review required** (see §9) |
| Owner | [TBD — Product Owner agere/org + legal counsel] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; Postgres; team of 1 FE + 1 BE (PRD-00) |
| Depends on | PRD-00b, 01, 02, 03, 06, 10, 11, 12 |
| Resolves review items | Blocker P0-5; C-09 (four retention rules) |

**Change log v1.0.1 → v1.0.2 (28 Sep 2026):** AI agents (PRD-17 v1.0, release 3) — prompts and raw model responses in `AgentRun` are kept **30 days** (class "derived workspace content"), `AgentAction` records follow the audit retention; identity PII (email, phone) is never sent to a model; the AI provider is listed as a subprocessor before release 3 (Legal L4). Language preference (D45) is ordinary profile data (exported with the account, deleted with it).

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> **Amendment 26 Sep 2026 (v1.0.1):**
> - **Chat (release 2 candidate, PRD-14 §8):** new data class *chat messages* (workspace content; agere = processor), retained while the organization exists; deleted messages are blanked in the same transaction and never go to Sampah; standalone channels go to Sampah for 30 days; **project channels follow their project** (Sampah and purge together). [Legal L1/L2]
> - **Restore feedback (QA AD10):** restoring from Sampah names the item ("“Draf kontrak vendor” dipulihkan ke tempat semula").
> - **Before organization deletion (QA AD7, release 2):** the dialog links to "Ekspor data organisasi" and "Ekspor audit" once organization export exists.

> This PRD defines product behavior. It is not legal advice. Items marked **[Legal]** must be confirmed by Indonesian counsel against UU No. 27 Tahun 2022 (Pelindungan Data Pribadi) and its implementing regulations before the closed pilot (PRD-00 gate G7).

---

## 1. Problem

v1.0 had four separate retention ideas (File, Doc trash, immutable audit, organization lifecycle) and no rule for deleting a person, answering a data request, or keeping personal data only as long as needed.

For a B2B product that holds personal data (member names, emails, IP addresses, and later CRM contacts), this is a legal and trust risk. It also blocks pilot contracts.

## 2. Goal

One lifecycle policy for every data class, implemented by a small set of automated jobs, plus the product flows people need to exercise their rights.

## 3. Success metrics

| Metric | Target | Type |
|---|---|---|
| Purge jobs completed on schedule | 100% daily | Guardrail |
| Data-subject requests answered within the statutory deadline | 100% [Legal] | Guardrail |
| Personal data found outside the §5 inventory (quarterly review) | 0 | Guardrail |

## 4. Scope

**Must (release 1):**

- Retention schedule and daily purge jobs.
- Trash (Project) with 30-day restore.
- Organization deletion purge (PRD-02).
- Account deletion (PRD-12).
- Consent record at sign-up.
- Rights-request runbook.
- Breach-response runbook.
- Subprocessor list.
- No PII in application logs.

**Should:** self-serve "Unduh data saya" (JSON: profile, memberships, security activity).

**Release 2+:** organization data export (CSV/JSON); a data processing agreement (DPA) self-serve click-through; legal hold tooling.

## 5. Data inventory & roles

| Data class | Examples | Personal data | Role of agere [Legal] |
|---|---|---|---|
| Account | Name, email, avatar, password hash, Google link | Yes | Controller |
| Security | Sessions, IP, user agent, failed-login counters, security events | Yes | Controller |
| Organization membership | Role, teams, invitations (email) | Yes | Processor for the customer organization |
| Workspace content | Projects, tasks, descriptions (may contain personal data typed by users) | Possibly | Processor |
| Audit | Actor ID, IP, user agent, hashed PII | Yes | Processor (organization-facing); controller for platform-admin actions |
| Notifications | Recipient, titles | Yes | Processor |
| Events (outbox) | IDs, hashed emails | Yes (pseudonymous) | Processor |

**Design rule (enforced in code review):** readable PII (name, email, avatar) lives **only** in identity tables. Every other table references `user_id`, and emails outside identity or invitations are stored hashed. Deleting a person therefore means scrubbing one place.

## 6. Policies

### 6.1 Retention schedule

| Data | Retention | Then |
|---|---|---|
| Account PII | While the account exists | Scrubbed within 30 days of the deletion request [H/Legal] |
| Sessions | Until expiry or revocation | Deleted immediately on revocation |
| Failed-login / rate-limit counters | 24 hours | Deleted |
| Invitations | 90 days after reaching a terminal state | Deleted |
| Project items in trash | 30 days | Purged |
| Archived projects | While the organization exists | — |
| Organization in `pending_deletion` | 30 days | All organization data purged within 7 days after [H] |
| Audit log | 1 year rolling [H/Legal] | Purged daily; purged immediately with the organization |
| Outbox events and deliveries | 30 days (PRD-00b) | Purged |
| Notifications | 90 days (PRD-10) | Purged |
| Security activity (user-scoped events) | 30 days (from the outbox) | Purged |
| Database backups / point-in-time restore | Provider window, e.g. 7 days [H] | Deleted data disappears when the window rolls past |
| Application logs (Vercel) | Plan retention | Must contain no PII: IDs only, emails masked |

### 6.2 Jobs

- One daily Vercel Cron job runs purges in batches, logs counts per class, and alerts on failure.
- It uses a dedicated database role, the only one allowed to delete from `audit_log` (PRD-11 §5.3).

### 6.3 Account deletion (PRD-12)

1. **Preconditions:** no active or suspended memberships (leave or be removed first; PRD-03 handles reassignment). The user must not be the last Owner anywhere (PRD-02).
2. On confirmation:
   - Sessions are revoked.
   - Login is disabled immediately.
   - The account status becomes `deleted_pending`.
   - `identity.account.deletion_requested` (user scope) is published.
3. **Within 30 days:** name, email, avatar, credentials and Google link are scrubbed. `user_id` remains as a tombstone so history shows **"Pengguna terhapus"**, and the email is released for re-registration.
4. Audit rows keep `actor_user_id`, which resolves to "Pengguna terhapus". IP and user agent follow audit retention.

### 6.4 Organization deletion

PRD-02 §6.4: 30-day grace, then purge of every organization-scoped row and object-storage file. The slug stays reserved for 90 days.

### 6.5 Consent & notices

- **Sign-up** requires a checkbox: "Saya menyetujui **Ketentuan Layanan** dan **Kebijakan Privasi** agere." The system stores the document versions and the acceptance timestamp.
- A material change to either document requires re-acceptance at next sign-in.
- The Privacy Policy lists:
  - data classes (§5);
  - purposes;
  - retention (§6.1);
  - subprocessors: Vercel (hosting, and the AI Gateway when PRD-17 ships), the Postgres provider, the email provider, Google (sign-in), and the AI model provider(s) chosen in PRD-17 Q1 (release 3; no-retention option required);
  - processing location: Singapore region **[Legal: cross-border transfer basis]**;
  - how to exercise rights.
- No marketing email in release 1, so no marketing consent is needed.

### 6.6 Rights requests (runbook, release 1)

- **Channel:** `privasi@[domain]` plus the self-serve options (profile edit, data export Should, account deletion).
- **Handling:**
  1. Verify identity (the request must come from the account email, or the user re-authenticates).
  2. Log the request.
  3. Fulfil it within the statutory deadline **[Legal: confirm the deadline for each right]**.
- Requests about workspace content go to the customer organization, which controls that data. agere assists as processor.

### 6.7 Breach response (runbook)

Detect → contain → assess → notify affected users and the relevant authority in writing within the UU PDP deadline **[Legal: confirm; commonly cited as 3 × 24 hours]** → post-incident review.

The BE engineer is the incident lead; the PO handles communications.

## 7. User stories & acceptance criteria

**US-1 — Trash restore window.**

```gherkin
Given a task was deleted 29 days ago
Then it can be restored
Given 31 days have passed
Then it no longer exists in the database
```

**US-2 — Account deletion.**

```gherkin
Given I have left all organizations
When I delete my account after re-authentication
Then I am signed out everywhere and cannot sign in
And within 30 days my name, email and avatar no longer exist in any table or object storage
And tasks I created show "Pengguna terhapus"
```

**US-3 — Consent recorded.**

```gherkin
Given I sign up
Then the account is created only after I accept, and the accepted document versions and timestamp are stored
```

**US-4 — Purge job safety.**

```gherkin
Given the purge job fails midway
Then already-purged batches stay purged, the rest are retried the next day, and an alert is sent
```

**US-5 — No PII in logs.**

```gherkin
Given any request fails with an error
Then the application log line contains IDs and a request_id, and no email, name or password
```

## 8. Events

| Event | Scope | Audit | Consumers |
|---|---|:-:|---|
| `identity.account.deletion_requested` | user | — | Notify (confirmation email) |
| `identity.account.deleted` | user | — | — (emitted by the scrub job) |

## 9. Legal checklist (gate G7)

| # | Item | Status |
|---|---|---|
| L1 | Controller vs processor roles in §5 | [Legal] |
| L2 | Retention periods (audit 1 year, account scrub 30 days) | [Legal] |
| L3 | Statutory deadlines for rights requests and breach notification | [Legal] |
| L4 | Cross-border transfer basis for Singapore hosting | [Legal] |
| L5 | Terms of Service, Privacy Policy, pilot agreement (with processing terms) | [Legal] |

## 10. Dependencies

PRD-00b (retention, user-scoped events), PRD-01 (sign-up consent, re-authentication, login disable), PRD-02 (organization purge), PRD-03 (reassignment before leave), PRD-06 (trash), PRD-10 (notification retention, confirmation email), PRD-11 (audit retention, purge role), PRD-12 (deletion UI).
