-- App Center / Integration Engine (forward-only).
-- Tenant tables carry organization_id as the first column of every index (TECH-01 §4).
-- "Workspace" in the App Center API is the organization (PRD-02).

CREATE TABLE integration_apps (
  id             text PRIMARY KEY,                       -- 'github', 'google-drive', …
  name           text NOT NULL,
  category       text NOT NULL CHECK (category IN ('development','communication','storage','calendar','design','crm')),
  icon_url       text NOT NULL,
  auth_type      text NOT NULL CHECK (auth_type IN ('oauth2','api_key')),
  description_en text NOT NULL,
  description_id text NOT NULL,
  position       int  NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE workspace_integrations (
  organization_id          uuid NOT NULL,
  app_id                   text NOT NULL REFERENCES integration_apps(id),
  status                   text NOT NULL CHECK (status IN ('connected','error','disconnected')),
  encrypted_access_token   text,
  encrypted_refresh_token  text,
  token_expires_at         timestamptz,
  scopes                   text,
  external_account_id      text,
  external_account_name    text,
  settings                 jsonb NOT NULL DEFAULT '{}'::jsonb,
  encrypted_webhook_secret text,
  connected_by             uuid,
  connected_at             timestamptz,
  last_refreshed_at        timestamptz,
  refresh_failures         int NOT NULL DEFAULT 0,
  last_error               text,
  version                  int NOT NULL DEFAULT 1,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, app_id),
  -- a connected row always has a token; a disconnected row never keeps one
  CHECK (status <> 'connected' OR encrypted_access_token IS NOT NULL),
  CHECK (status <> 'disconnected' OR (encrypted_access_token IS NULL AND encrypted_refresh_token IS NULL))
);
-- Cross-tenant sweep for the token refresh job. The one index without organization_id first:
-- the job runs outside any request context and reads only rows about to expire.
CREATE INDEX workspace_integrations_refresh_due
  ON workspace_integrations (token_expires_at)
  WHERE status = 'connected' AND encrypted_refresh_token IS NOT NULL;

-- Personal connections for apps where each member must use their own account (Google Drive:
-- the Drive picker browses the account behind the token, so a shared admin token would expose
-- the admin's Drive to every member). Requires the workspace integration to be connected.
CREATE TABLE user_integrations (
  organization_id          uuid NOT NULL,
  user_id                  uuid NOT NULL,
  app_id                   text NOT NULL REFERENCES integration_apps(id),
  status                   text NOT NULL CHECK (status IN ('connected','error')),
  encrypted_access_token   text NOT NULL,
  encrypted_refresh_token  text,
  token_expires_at         timestamptz,
  scopes                   text,
  external_account_id      text,
  external_account_name    text,
  last_refreshed_at        timestamptz,
  refresh_failures         int NOT NULL DEFAULT 0,
  last_error               text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id, app_id)
);
CREATE INDEX user_integrations_refresh_due
  ON user_integrations (token_expires_at)
  WHERE status = 'connected' AND encrypted_refresh_token IS NOT NULL;

CREATE TABLE integration_oauth_states (
  state_hash      text PRIMARY KEY,                      -- sha256 of the state sent to the provider
  organization_id uuid NOT NULL,
  user_id         uuid NOT NULL,
  app_id          text NOT NULL REFERENCES integration_apps(id),
  code_verifier   text,                                  -- PKCE, encrypted
  personal        boolean NOT NULL DEFAULT false,        -- true: store in user_integrations
  redirect_to     text,
  expires_at      timestamptz NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX integration_oauth_states_org ON integration_oauth_states (organization_id, expires_at);

CREATE TABLE integration_webhook_events (
  organization_id uuid NOT NULL,
  id              uuid NOT NULL,
  app_id          text NOT NULL REFERENCES integration_apps(id),
  delivery_id     text NOT NULL,
  event_type      text NOT NULL,
  payload         jsonb NOT NULL,
  status          text NOT NULL CHECK (status IN ('received','processed','ignored','failed')),
  error           text,
  received_at     timestamptz NOT NULL DEFAULT now(),
  processed_at    timestamptz,
  PRIMARY KEY (organization_id, id),
  UNIQUE (organization_id, app_id, delivery_id)          -- providers redeliver; process once
);

CREATE TABLE integration_task_links (
  organization_id uuid NOT NULL,
  id              uuid NOT NULL,
  task_id         uuid NOT NULL,
  app_id          text NOT NULL REFERENCES integration_apps(id),
  kind            text NOT NULL CHECK (kind IN ('github_pull_request','github_commit','google_drive_file')),
  external_id     text NOT NULL,
  url             text NOT NULL,
  title           text NOT NULL,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by      uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, id),
  UNIQUE (organization_id, task_id, app_id, kind, external_id)
);

-- Placeholder until the space module (PRD-06, TECH-01 `tasks`) lands: only the columns the
-- integrations need. The space migration replaces this table; TaskGateway is the only reader.
CREATE TABLE tasks (
  organization_id uuid NOT NULL,
  id              uuid NOT NULL,
  ref             text NOT NULL,                         -- human key used in commits and PRs, e.g. AGR-12
  title           text NOT NULL,
  status          text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','in_review','done')),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, id),
  UNIQUE (organization_id, ref)
);

INSERT INTO integration_apps (id, name, category, icon_url, auth_type, description_en, description_id, position) VALUES
('github',           'GitHub',           'development',   '/integrations/github.svg',           'oauth2',  'Link commits and pull requests to tasks and move tasks when PRs merge.', 'Tautkan commit dan pull request ke tugas, dan pindahkan tugas saat PR di-merge.', 1),
('gitlab',           'GitLab',           'development',   '/integrations/gitlab.svg',           'oauth2',  'Connect GitLab projects to track merge requests on tasks.',             'Hubungkan proyek GitLab untuk melacak merge request di tugas.', 2),
('bitbucket',        'Bitbucket',        'development',   '/integrations/bitbucket.svg',        'oauth2',  'Connect Bitbucket repositories to follow pull requests.',              'Hubungkan repositori Bitbucket untuk mengikuti pull request.', 3),
('slack',            'Slack',            'communication', '/integrations/slack.svg',            'oauth2',  'Send task and project updates to Slack channels.',                     'Kirim kabar tugas dan proyek ke channel Slack.', 4),
('discord',          'Discord',          'communication', '/integrations/discord.svg',          'oauth2',  'Post project updates to a Discord server.',                            'Kirim kabar proyek ke server Discord.', 5),
('microsoft-teams',  'Microsoft Teams',  'communication', '/integrations/microsoft-teams.svg',  'oauth2',  'Share task updates in Microsoft Teams channels.',                      'Bagikan kabar tugas di channel Microsoft Teams.', 6),
('google-drive',     'Google Drive',     'storage',       '/integrations/google-drive.svg',     'oauth2',  'Attach Google Drive files to tasks with the Drive picker.',            'Lampirkan file Google Drive ke tugas lewat pemilih Drive.', 7),
('dropbox',          'Dropbox',          'storage',       '/integrations/dropbox.svg',          'oauth2',  'Attach Dropbox files to tasks.',                                       'Lampirkan file Dropbox ke tugas.', 8),
('onedrive',         'OneDrive',         'storage',       '/integrations/onedrive.svg',         'oauth2',  'Attach OneDrive and SharePoint files to tasks.',                       'Lampirkan file OneDrive dan SharePoint ke tugas.', 9),
('google-calendar',  'Google Calendar',  'calendar',      '/integrations/google-calendar.svg',  'oauth2',  'Show task due dates in Google Calendar.',                              'Tampilkan tenggat tugas di Google Calendar.', 10),
('outlook-calendar', 'Outlook Calendar', 'calendar',      '/integrations/outlook-calendar.svg', 'oauth2',  'Show task due dates in Outlook Calendar.',                             'Tampilkan tenggat tugas di Outlook Calendar.', 11),
('toggl-track',      'Toggl Track',      'calendar',      '/integrations/toggl-track.svg',      'api_key', 'Log time on tasks with Toggl Track.',                                  'Catat waktu kerja tugas dengan Toggl Track.', 12),
('clockify',         'Clockify',         'calendar',      '/integrations/clockify.svg',         'api_key', 'Log time on tasks with Clockify.',                                     'Catat waktu kerja tugas dengan Clockify.', 13),
('figma',            'Figma',            'design',        '/integrations/figma.svg',            'oauth2',  'Preview Figma files linked in tasks.',                                 'Pratinjau file Figma yang ditautkan di tugas.', 14),
('miro',             'Miro',             'design',        '/integrations/miro.svg',             'oauth2',  'Link Miro boards to projects and tasks.',                              'Tautkan board Miro ke proyek dan tugas.', 15),
('hubspot',          'HubSpot',          'crm',           '/integrations/hubspot.svg',          'oauth2',  'Create tasks from HubSpot deals and tickets.',                         'Buat tugas dari deal dan tiket HubSpot.', 16),
('zendesk',          'Zendesk',          'crm',           '/integrations/zendesk.svg',          'api_key', 'Turn Zendesk tickets into tasks.',                                     'Ubah tiket Zendesk menjadi tugas.', 17);
