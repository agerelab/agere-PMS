# agere/org — web app (App Center / Integration Engine)

First application code for agere/org, built on the stack in TECH-01: a Next.js App Router monolith with one Postgres and Drizzle. The first module is **integrations**: an App Center like ClickUp's. Apps connect directly with each provider's OAuth 2.0 or API key, so there is no iPaaS (Zapier, Make, …) between them and no platform fee.

The static prototype at the repo root (`index.html`) is unaffected. The current Vercel project still serves it from `./`. To deploy this app, follow **[DEPLOY.md](DEPLOY.md)**: a second Vercel project with Root Directory `apps/web`, Postgres, and the environment variables listed there.

## Run it

```bash
cd apps/web
cp .env.example .env.local        # fill DATABASE_URL, INTEGRATION_ENCRYPTION_KEYS, OAuth apps
npm install
npm run db:migrate                # applies db/migrations/*.sql once each
npm run dev                       # http://localhost:3000/app-center
npm test                          # 65 tests on PGlite (in-memory Postgres)
```

Generate the encryption key with `openssl rand -base64 32`. Register each OAuth app with this redirect URI:
`{APP_URL}/api/v1/integrations/{appId}/callback` (for example `…/github/callback` or `…/google-drive/callback`).

**Development login:** the identity module (PRD-01) does not exist yet. With `DEV_AUTH=1`, `next dev` runs every request as `DEV_USER_ID` in `DEV_ORGANIZATION_ID`. It is off whenever `NODE_ENV=production`. When PRD-01 lands, replace `resolveSession` in `src/lib/context.ts`.

## Apps

| Category | Apps | Connect with |
|---|---|---|
| Development | GitHub, GitLab, Bitbucket | OAuth 2.0 |
| Communication | Slack, Discord, Microsoft Teams | OAuth 2.0 |
| Storage & Docs | Google Drive, Dropbox, OneDrive | OAuth 2.0 |
| Calendar & Time | Google Calendar, Outlook Calendar | OAuth 2.0 |
| Calendar & Time | Toggl Track, Clockify | API key |
| Design | Figma, Miro | OAuth 2.0 |
| CRM & Support | HubSpot | OAuth 2.0 |
| CRM & Support | Zendesk | API key (subdomain, email, token) |

All 17 apps can **connect and disconnect**. Tokens are stored, refreshed, and revoked where the provider allows it. The MVP adds **features** for two of them:

- **GitHub:** commits and pull requests that mention a task key (`AGR-12`) in a message, branch or PR title are linked to that task. Tasks only move forward:
  - A mention moves the task to *in progress*.
  - An open PR moves it to *in review*.
  - A merged PR, or `fixes AGR-12` pushed to the default branch, moves it to *done*.
  - Admins install the webhook on a repository from App Center › GitHub › Manage.
  - `settings.statusSync = false` keeps the links but stops the status changes.
- **Google Drive:** attach files to a task with the Google Picker, using the `drive.file` scope, so agere only sees files people pick. Each member uses **their own** Google account (`user_integrations`), because a shared admin token would let every member browse the admin's Drive in the picker.

## API

| Method & path | Who | What |
|---|---|---|
| `GET /api/v1/integrations` | member | Catalog + this workspace's status |
| `GET /api/v1/integrations/:appId/connect` | admin (`?personal=1`: member) | `{ url }` to the consent screen; `?redirect=1` → 302 |
| `POST /api/v1/integrations/:appId/connect` | admin | API-key apps: body with the app's fields |
| `GET /api/v1/integrations/:appId/callback` | provider redirect | Checks state, exchanges code, stores tokens encrypted, 303 back to App Center |
| `POST /api/v1/integrations/:appId/disconnect` | admin (`?personal=1`: member) | Revoke where possible, delete tokens |
| `POST /api/v1/webhooks/:appId/:workspaceId` | provider | Generic listener (GitHub HMAC, GitLab token); deduplicated per delivery |
| `GET/POST /api/v1/integrations/github/repositories` | admin | List repos / install the webhook |
| `GET /api/v1/integrations/google-drive/picker-session` | member | The member's own short-lived token + picker key |
| `GET/POST /api/v1/tasks/:taskId/attachments`, `DELETE …/:linkId` | member | Task links (Drive files, PRs, commits) |
| `GET /api/cron/integrations-refresh` | Vercel Cron (`CRON_SECRET`) | Refresh tokens expiring within `CRON_REFRESH_WINDOW_MINUTES` |
| `GET /api/health` | anyone | Database, encryption and config check (booleans only) |

The token refresh runs through Vercel Cron (`vercel.json`): once a day on Hobby, or every 5 minutes on Pro (see DEPLOY.md). Tokens are also refreshed on demand when used. On other hosts, use `npm run worker:refresh`. Rows are claimed with `FOR UPDATE SKIP LOCKED`, so several workers can run at once.

## Security notes

- **Encryption:** tokens, refresh tokens, webhook secrets and PKCE verifiers are encrypted with AES-256-GCM (`src/lib/crypto/token-cipher.ts`).
  - Each value is bound to its row with additional authenticated data (`org:app:kind`), so a ciphertext copied to another tenant fails to decrypt.
  - Keys carry an id, so they can be rotated.
- **OAuth state:** 32 random bytes, stored only as a SHA-256 hash, and single-use (deleted on read). It expires after 10 minutes and must be finished by the same user who started it.
  - PKCE is used where the provider supports it.
  - `return_to` only accepts same-site paths.
- **Browser POSTs** are checked for a same-origin `Origin` header.
- **Webhooks:** signatures are compared in constant time. Unknown workspace, app and not-connected all answer the same 404.
- **Provider URLs:** the Zendesk subdomain and Drive file ids are validated before they go into a URL.

## Not done yet

- The `tasks` table is a placeholder until the space module (PRD-06). `TaskGateway` (`src/modules/integrations/tasks.ts`) is the only code that touches it.
- Task access control in the attachments API is organization-level only. It needs `authz.can(ctx, 'view', task)` from PRD-04.
- Slack, Teams, Discord, GitLab, Bitbucket, Dropbox, OneDrive, calendars, time trackers, Figma, Miro, HubSpot and Zendesk connect, but have no feature built on the connection yet.
- The icons in `public/integrations/` are brand-colored monograms. Swap in official logos once design approves them.
- Events are not yet written to the outbox or audit log (PRD-00b, PRD-11). `integration.connected` and `integration.disconnected` should be added to the event catalog.
