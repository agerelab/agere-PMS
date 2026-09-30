# Deploying the App Center to Vercel

The repo already has one Vercel project (`agerepms`) that serves the static prototype from the repo root. The app goes into a **second** project that builds `apps/web`. The two projects don't affect each other.

## 1. Database

Create a Postgres database. Any provider works, and Neon and Supabase have free tiers.

- **Neon:** use the **pooled** connection string (host contains `-pooler`) with `?sslmode=require`.
- **Supabase:** use the **transaction pooler** string (port `6543`).

The app disables prepared statements, so transaction-mode poolers work. Migrations run automatically on every **production** build (`npm run vercel-build`), so you don't run anything by hand. Each migration file is applied once, tracked in `schema_migrations`.

## 2. Vercel project

1. Go to <https://vercel.com/new>, pick `agerelab/agere-PMS` again and choose **Import**.
2. Set the project fields:

   | Field | Value |
   |---|---|
   | Project Name | e.g. `agere-app` |
   | Root Directory | `apps/web` |
   | Framework | Next.js (detected; `vercel.json` also pins it) |
   | Build Command | leave default; `vercel.json` sets `npm run vercel-build` |

3. Add the environment variables below, then **Deploy**.

## 3. Environment variables

| Variable | Needed | Value |
|---|---|---|
| `DATABASE_URL` | yes | Pooled connection string from step 1 |
| `INTEGRATION_ENCRYPTION_KEY_ID` | yes | `k1` |
| `INTEGRATION_ENCRYPTION_KEYS` | yes | `k1:` + output of `openssl rand -base64 32`. **Keep a copy:** losing it makes every stored token unreadable |
| `CRON_SECRET` | yes | Any long random string (`openssl rand -hex 32`); Vercel Cron sends it automatically |
| `CRON_REFRESH_WINDOW_MINUTES` | Hobby: yes | `1500` on Hobby (cron runs once a day); `10` on Pro with a 5-minute schedule |
| `APP_URL` | optional | Defaults to the project's production domain; set it once you add a custom domain |
| `STAGING_PASSWORD` | until login exists | Password for the whole app (HTTP Basic; any user name) |
| `DEV_ORGANIZATION_ID`, `DEV_USER_ID`, `DEV_ROLE` | with `STAGING_PASSWORD` | The fixed user staging runs as, e.g. `00000000-0000-7000-8000-000000000001`, `00000000-0000-7000-8000-000000000002`, `owner` |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | for GitHub | From the GitHub OAuth App (step 4) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | for Google | From Google Cloud (step 4) |
| `GOOGLE_PICKER_API_KEY`, `GOOGLE_CLOUD_PROJECT_NUMBER` | for Drive attach | Same Google Cloud project |
| Other `*_CLIENT_ID` / `*_CLIENT_SECRET` | per app | See `.env.example`; apps without them show "Not configured" |

**Why the staging password:** the identity module (PRD-01) does not exist yet. Without `STAGING_PASSWORD`, every page and API answers 401 in production, which is the intended fail-closed behavior. With it, anyone who knows the password acts as the one staging owner, so only share it with the team. Webhooks, cron and `/api/health` stay outside the gate, because they authenticate themselves.

**Vercel Hobby:** cron jobs can run at most once a day, so `vercel.json` schedules the refresh daily at 03:17 UTC. Access tokens are also refreshed on demand whenever the app uses them. On Pro, change the schedule to `*/5 * * * *` and set `CRON_REFRESH_WINDOW_MINUTES=10`.

## 4. OAuth apps

Every OAuth app uses the redirect URI `https://<your-domain>/api/v1/integrations/<appId>/callback`.

- **GitHub:** <https://github.com/settings/applications/new> (or the organization's Developer settings)
  - Homepage: `https://<your-domain>`
  - Callback: `https://<your-domain>/api/v1/integrations/github/callback`
- **Google (Drive + Calendar):** <https://console.cloud.google.com/>
  1. Enable the *Google Drive API* and *Google Picker API*.
  2. On the OAuth consent screen, add scopes `openid`, `email` and `.../auth/drive.file`. `drive.file` is non-sensitive, so no Google verification is needed.
  3. Under Credentials, create an *OAuth client ID* of type Web application, with redirect `…/google-drive/callback` (and `…/google-calendar/callback`).
  4. Also under Credentials, create an *API key* restricted to the Picker API and to your domain. That is `GOOGLE_PICKER_API_KEY`.
  5. The project number is on the Cloud dashboard. That is `GOOGLE_CLOUD_PROJECT_NUMBER`.
  6. While the consent screen is in *Testing*, add your team as test users.

OAuth only works on the production domain, because that is where providers redirect. Preview deployments show the UI but can't finish a connect.

## 5. Check it

- **Health check:** open `https://<your-domain>/api/health`. It should answer `"ok": true` and list the apps whose credentials are set. It never shows secret values.
  - `database: false` → the migrations didn't run or `DATABASE_URL` is wrong.
  - `encryption: false` → the key variables are wrong.
- **App Center:** open `https://<your-domain>/app-center`, enter the staging password, and connect GitHub.
- **GitHub webhook:** in App Center › GitHub › **Manage**, install the webhook on a repository. Then open a PR whose title contains a task key.
- **Test task:** there is no task UI yet, so create one first in the SQL console:
  `insert into tasks (organization_id, id, ref, title) values ('<DEV_ORGANIZATION_ID>', gen_random_uuid(), 'AGR-1', 'Test task');`

## Preview deployments

Preview builds skip migrations, so they never change the production schema. To give previews their own database (for example a Neon branch), set `DATABASE_URL` for the Preview environment and set `MIGRATE_ON_BUILD=1` there.
