// Provider definitions for the App Center. The catalog rows (name, category, icon, copy) live in
// integration_apps; this file holds what the engine needs to talk to each provider.
// Credentials come from env: <APP>_CLIENT_ID / <APP>_CLIENT_SECRET, with a shared fallback for
// Google (GOOGLE_*) and Microsoft (MICROSOFT_*) apps.

export type OAuthProvider = {
  kind: "oauth2";
  envPrefix: string;
  envFallback?: string;
  authorizeUrl: string;
  tokenUrl: string;
  /** Some providers refresh on a different endpoint (Figma). */
  refreshUrl?: string;
  scopes: string[];
  scopeSeparator?: string;
  /** Send client credentials as HTTP Basic instead of form fields. */
  clientAuth?: "body" | "basic";
  pkce?: boolean;
  extraAuthParams?: Record<string, string>;
  /** Provider returns 200 with {ok:false} on failure (Slack). */
  okField?: boolean;
  /** Members connect their own account on top of the workspace connection (user_integrations). */
  personalAccounts?: boolean;
  account?: (accessToken: string) => Promise<{ id?: string; name?: string } | null>;
};

export type ApiKeyField = { name: string; label: { en: string; id: string }; secret?: boolean; pattern?: RegExp };
export type ApiKeyProvider = {
  kind: "api_key";
  fields: ApiKeyField[];
  /** The field that is stored encrypted as the access token; the others go to settings. */
  secretField: string;
  verify: (values: Record<string, string>) => Promise<{ id?: string; name?: string }>;
};

export type Provider = OAuthProvider | ApiKeyProvider;

async function getJson(url: string, init: RequestInit = {}) {
  const res = await fetch(url, { ...init, headers: { accept: "application/json", ...(init.headers ?? {}) }, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${new URL(url).host} responded ${res.status}`);
  return res.json() as Promise<any>;
}
const bearer = (t: string) => ({ authorization: `Bearer ${t}` });
const basic = (user: string, pass: string) => ({ authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}` });

const MS_AUTH = "https://login.microsoftonline.com/common/oauth2/v2.0";
const msAccount = async (t: string) => {
  const me = await getJson("https://graph.microsoft.com/v1.0/me", { headers: bearer(t) });
  return { id: me.id, name: me.userPrincipalName ?? me.displayName };
};
const GOOGLE = {
  authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  pkce: true,
  // offline + consent so Google returns a refresh token on every connect
  extraAuthParams: { access_type: "offline", prompt: "consent", include_granted_scopes: "true" },
  account: async (t: string) => {
    const me = await getJson("https://openidconnect.googleapis.com/v1/userinfo", { headers: bearer(t) });
    return { id: me.sub, name: me.email };
  },
};

export const PROVIDERS: Record<string, Provider> = {
  github: {
    kind: "oauth2",
    envPrefix: "GITHUB",
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    // repo: read PRs and commits; admin:repo_hook: install the task webhook on a repository
    scopes: ["repo", "admin:repo_hook", "read:user"],
    account: async (t) => {
      const me = await getJson("https://api.github.com/user", { headers: { ...bearer(t), "x-github-api-version": "2022-11-28" } });
      return { id: String(me.id), name: me.login };
    },
  },
  gitlab: {
    kind: "oauth2",
    envPrefix: "GITLAB",
    authorizeUrl: "https://gitlab.com/oauth/authorize",
    tokenUrl: "https://gitlab.com/oauth/token",
    scopes: ["api", "read_user"],
    pkce: true,
    account: async (t) => {
      const me = await getJson("https://gitlab.com/api/v4/user", { headers: bearer(t) });
      return { id: String(me.id), name: me.username };
    },
  },
  bitbucket: {
    kind: "oauth2",
    envPrefix: "BITBUCKET",
    authorizeUrl: "https://bitbucket.org/site/oauth2/authorize",
    tokenUrl: "https://bitbucket.org/site/oauth2/access_token",
    scopes: [], // Bitbucket takes scopes from the OAuth consumer settings
    clientAuth: "basic",
    account: async (t) => {
      const me = await getJson("https://api.bitbucket.org/2.0/user", { headers: bearer(t) });
      return { id: me.uuid, name: me.display_name };
    },
  },
  slack: {
    kind: "oauth2",
    envPrefix: "SLACK",
    authorizeUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    scopes: ["chat:write", "channels:read", "commands"],
    scopeSeparator: ",",
    okField: true,
  },
  discord: {
    kind: "oauth2",
    envPrefix: "DISCORD",
    authorizeUrl: "https://discord.com/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    scopes: ["identify", "guilds", "webhook.incoming"],
    account: async (t) => {
      const me = await getJson("https://discord.com/api/users/@me", { headers: bearer(t) });
      return { id: me.id, name: me.username };
    },
  },
  "microsoft-teams": {
    kind: "oauth2",
    envPrefix: "MICROSOFT_TEAMS",
    envFallback: "MICROSOFT",
    authorizeUrl: `${MS_AUTH}/authorize`,
    tokenUrl: `${MS_AUTH}/token`,
    scopes: ["offline_access", "User.Read", "Team.ReadBasic.All", "Channel.ReadBasic.All", "ChannelMessage.Send"],
    pkce: true,
    account: msAccount,
  },
  "google-drive": {
    kind: "oauth2",
    envPrefix: "GOOGLE_DRIVE",
    envFallback: "GOOGLE",
    ...GOOGLE,
    personalAccounts: true,
    // drive.file: only files the user picks in the Drive picker, not the whole Drive
    scopes: ["openid", "email", "https://www.googleapis.com/auth/drive.file"],
  },
  dropbox: {
    kind: "oauth2",
    envPrefix: "DROPBOX",
    authorizeUrl: "https://www.dropbox.com/oauth2/authorize",
    tokenUrl: "https://api.dropboxapi.com/oauth2/token",
    scopes: ["account_info.read", "files.metadata.read", "sharing.read"],
    pkce: true,
    extraAuthParams: { token_access_type: "offline" },
    account: async (t) => {
      const me = await getJson("https://api.dropboxapi.com/2/users/get_current_account", { method: "POST", headers: bearer(t) });
      return { id: me.account_id, name: me.email };
    },
  },
  onedrive: {
    kind: "oauth2",
    envPrefix: "ONEDRIVE",
    envFallback: "MICROSOFT",
    authorizeUrl: `${MS_AUTH}/authorize`,
    tokenUrl: `${MS_AUTH}/token`,
    scopes: ["offline_access", "User.Read", "Files.Read.All"],
    pkce: true,
    account: msAccount,
  },
  "google-calendar": {
    kind: "oauth2",
    envPrefix: "GOOGLE_CALENDAR",
    envFallback: "GOOGLE",
    ...GOOGLE,
    scopes: ["openid", "email", "https://www.googleapis.com/auth/calendar.events"],
  },
  "outlook-calendar": {
    kind: "oauth2",
    envPrefix: "OUTLOOK_CALENDAR",
    envFallback: "MICROSOFT",
    authorizeUrl: `${MS_AUTH}/authorize`,
    tokenUrl: `${MS_AUTH}/token`,
    scopes: ["offline_access", "User.Read", "Calendars.ReadWrite"],
    pkce: true,
    account: msAccount,
  },
  "toggl-track": {
    kind: "api_key",
    fields: [{ name: "api_token", label: { en: "API token", id: "Token API" }, secret: true, pattern: /^[A-Za-z0-9]{16,64}$/ }],
    secretField: "api_token",
    verify: async ({ api_token }) => {
      const me = await getJson("https://api.track.toggl.com/api/v9/me", { headers: basic(api_token, "api_token") });
      return { id: String(me.id), name: me.email ?? me.fullname };
    },
  },
  clockify: {
    kind: "api_key",
    fields: [{ name: "api_key", label: { en: "API key", id: "Kunci API" }, secret: true, pattern: /^[A-Za-z0-9+/=_-]{16,128}$/ }],
    secretField: "api_key",
    verify: async ({ api_key }) => {
      const me = await getJson("https://api.clockify.me/api/v1/user", { headers: { "x-api-key": api_key } });
      return { id: me.id, name: me.email ?? me.name };
    },
  },
  figma: {
    kind: "oauth2",
    envPrefix: "FIGMA",
    authorizeUrl: "https://www.figma.com/oauth",
    tokenUrl: "https://api.figma.com/v1/oauth/token",
    refreshUrl: "https://api.figma.com/v1/oauth/refresh",
    scopes: ["current_user:read", "file_content:read"],
    clientAuth: "basic",
    account: async (t) => {
      const me = await getJson("https://api.figma.com/v1/me", { headers: bearer(t) });
      return { id: me.id, name: me.email ?? me.handle };
    },
  },
  miro: {
    kind: "oauth2",
    envPrefix: "MIRO",
    authorizeUrl: "https://miro.com/oauth/authorize",
    tokenUrl: "https://api.miro.com/v1/oauth/token",
    scopes: ["boards:read", "boards:write"],
    account: async (t) => {
      const me = await getJson("https://api.miro.com/v1/oauth-token", { headers: bearer(t) });
      return { id: me.team?.id, name: me.team?.name ?? me.user?.name };
    },
  },
  hubspot: {
    kind: "oauth2",
    envPrefix: "HUBSPOT",
    authorizeUrl: "https://app.hubspot.com/oauth/authorize",
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    scopes: ["oauth", "crm.objects.deals.read", "tickets"],
    account: async (t) => {
      const me = await getJson(`https://api.hubapi.com/oauth/v1/access-tokens/${encodeURIComponent(t)}`);
      return { id: String(me.hub_id), name: me.hub_domain };
    },
  },
  zendesk: {
    kind: "api_key",
    fields: [
      // subdomain is interpolated into the verify URL, so it is strictly validated (no SSRF)
      { name: "subdomain", label: { en: "Zendesk subdomain", id: "Subdomain Zendesk" }, pattern: /^[a-z0-9][a-z0-9-]{0,62}$/ },
      { name: "email", label: { en: "Agent email", id: "Email agen" }, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { name: "api_token", label: { en: "API token", id: "Token API" }, secret: true, pattern: /^[A-Za-z0-9]{20,64}$/ },
    ],
    secretField: "api_token",
    verify: async ({ subdomain, email, api_token }) => {
      const me = await getJson(`https://${subdomain}.zendesk.com/api/v2/users/me.json`, { headers: basic(`${email}/token`, api_token) });
      if (!me.user?.id) throw new Error("Zendesk rejected the credentials");
      return { id: String(me.user.id), name: `${subdomain}.zendesk.com` };
    },
  },
};

export function getProvider(appId: string): Provider | undefined {
  return Object.prototype.hasOwnProperty.call(PROVIDERS, appId) ? PROVIDERS[appId] : undefined;
}

export function oauthCredentials(p: OAuthProvider): { clientId: string; clientSecret: string } | null {
  const pick = (k: string) => process.env[`${p.envPrefix}_${k}`] || (p.envFallback ? process.env[`${p.envFallback}_${k}`] : undefined);
  const clientId = pick("CLIENT_ID");
  const clientSecret = pick("CLIENT_SECRET");
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

/** An app is usable when its OAuth credentials are configured (API-key apps always are). */
export const isConfigured = (p: Provider) => p.kind === "api_key" || oauthCredentials(p) !== null;
