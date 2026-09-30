# PRD-01 — Identity & SSO

| Field | Value |
|---|---|
| Version | 1.2.1 (supersedes 1.2) |
| Status | Draft — ready for engineering review |
| Owner | [TBD — Product Owner, agere/org platform] |
| Last updated | 26 Sep 2026 |
| Delivery context | Next.js modular monolith on Vercel; team of 1 FE + 1 BE (see Index § Engineering context) |
| Depends on | PRD-00b Event Contract, PRD-04 Roles, App Access & Resource ACL |
| Consumed by | Every Agere Org module; PRD-03 (activation), PRD-12 (security settings) |
| Resolves review items | Per-PRD gaps for 01 (reset, verification, MFA, linking, lockout, session policy); C-03 (token staleness, jointly with PRD-04 §6.7) |

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> **Amendment 26 Sep 2026 — QA v10 (QA-01):**
> - **Passwords (ON3, release 1):** strength meter; reject the 10,000 most common passwords and passwords containing the email local part; changing a password always verifies the current one.
> - **Sign-up enumeration (ON4, release 1):** registering an existing email shows the same neutral screen as a new sign-up and sends "Anda sudah punya akun agere" to that address, consistent with sign-in and reset.
> - **Verification screen (ON2):** shows the full email to its owner with "Salah email? Ubah".
> - **Release 1.1 (ON5):** "Daftar dengan Google" on sign-up; "Tampilkan sandi" toggle on every password field.
> - **MFA recovery codes (SE1):** "Salin kode" and "Unduh .txt" next to "Saya sudah menyimpannya".
> - **Platform console (PL1, release 1.1):** suspending an organization requires typing its slug; the organization list gets search and a status filter.

### Change log v1.1 → v1.2

- The session stores `last_organization_id` (landing only). The working organization always comes from the URL (PRD-02 §6.2).
- Added consent capture at sign-up (PRD-13 §6.5).
- The deleted-user edge case now follows PRD-13 §6.3.

### Change log v1.0 → v1.1

- Added email verification, forgot/reset password, account-linking rules, rate limiting and lockout.
- Added an explicit session policy (idle and absolute timeouts, re-authentication for sensitive actions, sign out of all devices).
- Split the two token models: first-party DB-backed sessions for Agere Org, and short-lived tokens for other Agere products.
- Platform admins now require MFA; MFA for owners and admins moved to Should (sized for a 2-person team).
- Added events, UX states, microcopy (id-ID), user stories and edge cases.

---

## 1. Problem

Users should not keep separate credentials for every Agere application. Authentication must be centralized so every Agere app trusts one identity, while authorization stays server-side and org-scoped (PRD-04).

v1.0 missed flows that every password product needs on day one: email verification, password reset, brute-force protection and account-linking rules. Without them, the result is support load, account-takeover risk and duplicate identities.

## 2. Goal

Provide one secure identity and session layer for the Agere ecosystem. It must be simple enough for a single backend engineer to build and operate, and it must not block later SSO for other Agere products.

## 3. Personas & jobs to be done

| Persona | Job to be done | Evidence |
|---|---|---|
| Member | "I want to sign in once, quickly, with Google or email, and not be asked again all day." | [Hypothesis: Needs Validation] |
| Organization owner/admin | "I want departing people to lose access and my own account to be hard to hijack." | [Hypothesis: Needs Validation] |
| Platform admin (agere staff) | "I want a separate, strongly protected console session that can never be confused with a customer session." | Internal |
| Other Agere product (future) | "I want to trust an Agere identity without storing passwords." | Internal |

## 4. Success metrics

Baselines are captured during the first 30 days of the pilot. [H] = hypothesis target.

| Metric | Target | Window | Type |
|---|---|---|---|
| Sign-in success rate (attempts that end in a session, excluding wrong passwords the user corrects) | ≥ 95% [H] | Weekly | Primary |
| Median time from "Masuk" to app visible | ≤ 3 s [H] | Weekly | Primary |
| Password-reset completion (request → new password set) | ≥ 70% [H] | Monthly | Secondary |
| Account-takeover incidents (confirmed) | **0** | Continuous | Guardrail |
| Duplicate identities for one email | **0** | Continuous | Guardrail |
| Session-related support tickets per 100 active orgs | ≤ 2 / month [H] | Monthly | Secondary |

## 5. Scope

### Must (release 1)

- Email + password sign-up and sign-in, with Terms and Privacy Policy acceptance recorded (PRD-13 §6.5).
- Email verification.
- Forgot/reset password.
- Google sign-in, plus linking Google to an existing account.
- Central user ID (`usr_…`) and current-user endpoint.
- DB-backed session with an HttpOnly cookie; logout; "Keluar dari semua perangkat".
- Session expiry and revocation.
- Re-authentication for sensitive actions (§6.3).
- Redirect allowlist.
- Rate limiting and temporary lockout.
- Separate platform-admin identity and session, with **mandatory MFA (TOTP)**.
- `security.*` events (PRD-00b).

### Should

- MFA (TOTP) for Owners and Admins: optional in release 1, enforceable per organization later.
- Session list in personal settings (PRD-12).
- Breached-password check at sign-up and reset.

### Could (release 2 — when a second Agere product integrates)

- OIDC-compatible authorization-code flow with PKCE for other Agere products.
- JWKS endpoint.
- Short-lived access tokens with rotating refresh tokens (§6.4).

### Won't (release 1)

- SAML or enterprise SSO.
- Passkeys.
- Phone/OTP login.
- Social providers other than Google.
- Custom password policies per organization.

## 6. Design

### 6.1 Architecture (Vercel)

- Identity is a **module inside the Agere Org Next.js app**, not a separate service. Users, credentials, sessions and rate-limit counters live in the shared Postgres database.
- **Implementation choice:**
  - *Option A (recommended):* a maintained open-source auth library running on our own Postgres. Identity data, session revocation and org context stay in our database, and the JWKS/OIDC path later remains ours.
  - *Option B:* a managed identity provider. Less code for 1 BE, but adds per-user cost, puts identity data with a vendor, and makes org-aware revocation harder.
  - Decide in a **2-day spike** against the §5 Must list. [Hypothesis: Needs Validation]
- Transactional email (verification, reset, invitations from PRD-03) goes through one email-provider adapter.
- Region: the Vercel function and database region closest to Indonesia (Singapore). [Legal: PRD-13 L4]

### 6.2 Session policy (first-party: Agere Org)

| Rule | Value |
|---|---|
| Session storage | Postgres row; cookie holds an opaque random ID (HttpOnly, Secure, SameSite=Lax) |
| Idle timeout | 7 days [H] |
| Absolute lifetime | 30 days [H] |
| Revocation | Deleting the session row takes effect on the **next request** (every request loads the session) |
| Sign out of all devices | Deletes all of the user's sessions and emits `security.session.revoked` (reason `user_all_devices`) |
| Password change or reset | Deletes all other sessions |
| Org context | The session stores `last_organization_id`, used only to choose the landing page (PRD-02 §6.2). The working organization comes from the URL slug, and membership is checked per request (PRD-04 L1). |

### 6.3 Re-authentication for sensitive actions

These actions require a password (or Google) confirmation when the last authentication is **older than 10 minutes** [H]. They also require the MFA code when MFA is enabled.

- Transfer ownership (PRD-02)
- Delete organization (PRD-02)
- Change password or email
- Enable or disable MFA
- Link or unlink Google

### 6.4 Tokens for other Agere products (Could — release 2)

- Authorization-code flow with PKCE; redirect URIs must match an allowlist registered per client.
- **Access token:** JWT, **TTL ≤ 5 minutes**. Claims: `sub`, `organization_id`, `session_id`, `aud`, `exp`, plus a coarse `apps` claim used only for navigation hints.
- **Refresh token:** rotating and bound to the session. Deleting the session invalidates it.
- Consuming apps must validate signature (JWKS), `exp`, `aud` and `organization_id` context.
- Staleness: consuming apps may trust membership for at most the token TTL, **or** call `POST /v1/authz/check` (PRD-04 §6.8) for protected mutations. Token claims are never authoritative for roles or resource access (PRD-04 E2).
- Platform-admin tokens use a different `aud` and are rejected by every application endpoint.

### 6.5 Account linking

| Situation | Behavior |
|---|---|
| New Google sign-in, email not registered | Create user, with the email marked verified (Google verified it) |
| Google sign-in, email matches an existing **password** account | **No auto-link.** Show: "Email ini sudah terdaftar. Masuk dengan kata sandi, lalu hubungkan Google di Pengaturan › Keamanan." |
| Linked account signs in with either method | Same `usr_…` |
| Unlink Google | Allowed only if a password is set; requires re-authentication (§6.3) |

### 6.6 Abuse protection

- **Per account:** 5 failed sign-ins within 15 minutes → 15-minute lockout; emit `security.login.failed_threshold` [H].
- **Per IP:** 20 failed sign-ins within 15 minutes → 15-minute block [H].
- Counters live in Postgres.
- Password reset and verification emails: at most 3 per email per hour.
- Responses do not reveal whether an email exists: "Jika email terdaftar, kami sudah mengirim tautan reset."
- Reset and verification links are single-use and expire after 60 minutes (reset) or 24 hours (verification) [H].

### 6.7 Redirects

`redirect_to` must be a relative path, or an absolute URL whose origin is on the allowlist. Anything else falls back to `/` and is logged.

## 7. Events

Published via PRD-00b. Identity events are **user-scoped** (`scope: "user"`, PRD-00b §6): they are shown in the user's own security activity (PRD-12), not in organization audit trails.

| Event | When |
|---|---|
| `security.session.revoked` | Logout of all devices, password change or reset, admin session kill (platform) |
| `security.login.failed_threshold` | Lockout triggered |
| `security.password.changed` | Password set, changed or reset |
| `security.account.linked` / `security.account.unlinked` | Google linked or unlinked |
| `security.mfa.changed` | MFA enabled or disabled |

## 8. UX

### 8.1 Flow

```text
Open an Agere Org URL
 → No session → /masuk?redirect_to=<allowed path>
 → Google | email + password → (verified? no → "Cek email Anda")
 → Session created → redirect_to, or the landing organization (PRD-02 §6.2)
```

Screens use the Agere DS **AuthFlow** block: `Card` on `bg-muted`, `Input` with `border-control`, one `brand-default` button per screen, `heading-xl` title.

### 8.2 Five UX states

| State | Behavior and microcopy (id-ID, "Anda") |
|---|---|
| Ideal | A valid session opens the app directly — no sign-in screen shown |
| Empty | No session: the sign-in screen. Title "Masuk ke agere/org". Buttons "Lanjut dengan Google" and "Masuk". |
| Loading | While validating the session, show the app shell skeleton, never a flash of the sign-in screen. The submit button reads "Memproses…" and is disabled. |
| Error | Wrong credentials: "Email atau kata sandi salah. Coba lagi atau reset kata sandi." Locked: "Terlalu banyak percobaan. Coba lagi dalam 15 menit atau reset kata sandi." Session expired: "Sesi Anda berakhir. Masuk lagi untuk melanjutkan." Your draft is kept when possible. |
| Partial | Authenticated but no active membership in the requested organization, or no app access: the PRD-04 §8.3 denied state. Email not verified: "Verifikasi email Anda dulu. Kami mengirim tautan ke r***@maju.co.id." with "Kirim ulang tautan". |

### 8.3 Accessibility

- Every field has a visible label; placeholders are examples ("nama@perusahaan.com").
- Errors are linked with `aria-describedby`, and focus moves to the first invalid field.
- A show/hide password toggle has `aria-label="Tampilkan kata sandi"`.
- Lockout timers are announced as text, not only through a countdown animation.

## 9. User stories & acceptance criteria

**US-1 — Sign in and return.** As a member, I want to sign in once and land where I was going.

```gherkin
Given I have no session and open /projects/prj_1
When I sign in with valid credentials
Then a session is created and I am redirected to /projects/prj_1

Given redirect_to is https://evil.example
Then I am redirected to / after sign-in and the attempt is logged
```

**US-2 — Verify email.**

```gherkin
Given I signed up with email and password
When I have not opened the verification link
Then I cannot enter any organization and I see the verification state

When I open the link within 24 hours
Then my email is verified and I continue to activation or organization selection
```

**US-3 — Reset password.**

```gherkin
Given I request a reset for any email
Then the response is the same whether or not the email exists

When I set a new password via a valid, unused link within 60 minutes
Then my password changes, all my other sessions are revoked
And security.password.changed and security.session.revoked are published

Given the link was already used or expired
Then I see "Tautan sudah tidak berlaku. Minta tautan baru."
```

**US-4 — Brute-force protection.**

```gherkin
Given 5 failed sign-ins for one account within 15 minutes
When a 6th attempt is made, even with the correct password
Then it is rejected with the lockout message
And security.login.failed_threshold is published
```

**US-5 — Safe Google linking.**

```gherkin
Given a password account exists for rina@maju.co.id
When Rina chooses "Lanjut dengan Google" with the same email
Then no session is created and no account is merged
And she is told to sign in with her password and link Google from settings
```

**US-6 — Session revocation is immediate.**

```gherkin
Given I have sessions on two devices
When I choose "Keluar dari semua perangkat"
Then the next request from either device is treated as unauthenticated
```

**US-7 — Platform admin separation.**

```gherkin
Given a platform-admin session or token
When it calls any application endpoint
Then the request is rejected
And platform-admin sign-in always requires a TOTP code
```

**US-8 — Sensitive action re-authentication.**

```gherkin
Given my last authentication was 30 minutes ago
When I start "Alihkan kepemilikan"
Then I must confirm my password (and MFA code if enabled) before the transfer is submitted
```

## 10. Edge cases

| Case | Behavior |
|---|---|
| User changes email | The new email must be verified before the change takes effect; the old email gets a notice |
| Pending invitation for an email that has no account yet | Sign-up from the invitation link pre-fills the invited email (PRD-03 §6.2) |
| Clock skew on token validation (release 2) | Allow ±60 s leeway on `exp` |
| Cookie blocked by the browser | Show "Aktifkan cookie untuk masuk ke agere/org." |
| Deleted user (PRD-13 §6.3) | Sessions revoked and login disabled immediately; PII scrubbed and email released within 30 days |

## 11. Non-functional requirements

- **Security:** OWASP ASVS L2 for authentication [H]. Passwords hashed with a modern adaptive algorithm (the auth library's default). CSRF protection on state-changing forms. No credentials or secrets in PRDs or repositories.
- **Performance:** session lookup p95 ≤ 20 ms [H]. Sign-in page LCP ≤ 2.5 s on a mid-range Android over 4G [H].
- **Accessibility:** WCAG 2.1 AA (Agere DS release gate).
- **Privacy:** identity data stays in our Postgres; identity tables are the only place readable PII lives (PRD-13 §5). Emails are masked in UI hints (r***@maju.co.id).

## 12. Dependencies

| PRD | Relationship |
|---|---|
| PRD-02 | Landing organization from `last_organization_id`; the ownership transfer and organization deletion flows use §6.3 re-authentication |
| PRD-13 | Consent record; account deletion disables login |
| PRD-03 | The invitation activation flow uses sign-up/sign-in plus verified-email matching |
| PRD-04 | Per-request L1 membership check; token claims are never authoritative (E2) |
| PRD-12 | Security settings: password, Google link, MFA, session list, security activity |
| PRD-00b | `security.*` user-scoped events |

## 13. Open questions

| # | Question | Proposed default | Decide by |
|---|---|---|---|
| Q1 | Auth library vs managed provider | Library on our own Postgres (Option A) | 2-day spike |
| Q2 | Idle/absolute session values | 7 / 30 days | Security review |
| Q3 | Should organizations be able to require MFA for all members? | Release 2 | Pilot feedback |
| Q4 | Is a second Agere product integrating in release 1 (which would move §6.4 to Must)? | No | Portfolio roadmap |
