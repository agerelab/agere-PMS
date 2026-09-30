"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { translator, type Key, type Lang } from "@/lib/i18n";
import type { CatalogItem } from "@/modules/integrations/service";
import s from "./app-center.module.css";

const CATEGORIES = ["all", "development", "communication", "storage", "calendar", "design", "crm"] as const;
const STATUSES = ["all", "connected", "not_connected"] as const;
type Category = (typeof CATEGORIES)[number];
type StatusFilter = (typeof STATUSES)[number];
type Load = { state: "loading" } | { state: "error" } | { state: "ready"; items: CatalogItem[]; canManage: boolean };
type Repo = { fullName: string; private: boolean; canInstallHook: boolean; hooked: boolean };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body?.error?.message ?? `HTTP ${res.status}`), { code: body?.error?.code ?? `HTTP_${res.status}` });
  return body as T;
}

export function AppCenter({ lang }: { lang: Lang }) {
  const t = useMemo(() => translator(lang), [lang]);
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [category, setCategory] = useState<Category>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [apiKeyApp, setApiKeyApp] = useState<CatalogItem | null>(null);
  const [disconnectApp, setDisconnectApp] = useState<CatalogItem | null>(null);
  const [githubOpen, setGithubOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const r = await api<{ data: CatalogItem[]; viewer: { canManage: boolean } }>("/api/v1/integrations");
      setLoad({ state: "ready", items: r.data, canManage: r.viewer.canManage });
    } catch {
      setLoad({ state: "error" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Result of the OAuth round trip (?integration=github&result=connected|error&code=…)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const app = q.get("integration");
    if (!app) return;
    const name = app.replace(/(^|-)(\w)/g, (_, a, b) => (a ? " " : "") + b.toUpperCase());
    setToast(q.get("result") === "connected" ? { text: t("toast.connected", name) } : { text: t("toast.error", name, q.get("code") ?? "error"), error: true });
    window.history.replaceState(null, "", window.location.pathname);
  }, [t]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  const items = load.state === "ready" ? load.items : [];
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const i of items) c[i.category] = (c[i.category] ?? 0) + 1;
    return c;
  }, [items]);
  const visible = items.filter(
    (i) =>
      (category === "all" || i.category === category) &&
      (status === "all" || (status === "connected" ? i.status === "connected" : i.status !== "connected")) &&
      (!query.trim() || `${i.name} ${i.description[lang]}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  async function connect(app: CatalogItem, personal = false) {
    if (app.authType === "api_key") return setApiKeyApp(app);
    setBusy(app.id);
    try {
      const q = new URLSearchParams({ return_to: "/app-center", ...(personal ? { personal: "1" } : {}) });
      const r = await api<{ url: string }>(`/api/v1/integrations/${app.id}/connect?${q}`);
      window.location.assign(r.url);
    } catch (e) {
      setToast({ text: t("toast.error", app.name, (e as { code?: string }).code ?? "error"), error: true });
      setBusy(null);
    }
  }

  async function confirmDisconnect(app: CatalogItem) {
    setBusy(app.id);
    try {
      await api(`/api/v1/integrations/${app.id}/disconnect`, { method: "POST" });
      setToast({ text: t("toast.disconnected", app.name) });
      await refresh();
    } catch (e) {
      setToast({ text: (e as Error).message, error: true });
    } finally {
      setBusy(null);
      setDisconnectApp(null);
    }
  }

  const catLabel = (c: string) => t(`category.${c}` as Key);

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div>
          <h1 className={s.title}>{t("appCenter.title")}</h1>
          <p className="muted">{t("appCenter.subtitle")}</p>
        </div>
        <label className={s.search}>
          <span className="sr-only">{t("appCenter.search")}</span>
          <input className="input" type="search" placeholder={t("appCenter.search")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </header>

      <div className={s.layout}>
        <aside className={s.filters} aria-label={t("appCenter.categories")}>
          <h2 className={s.fh}>{t("appCenter.categories")}</h2>
          <ul className={s.flist}>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <button className={s.fitem} aria-current={category === c ? "true" : undefined} onClick={() => setCategory(c)}>
                  <span>{catLabel(c)}</span>
                  <span className={s.count}>{counts[c] ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
          <h2 className={s.fh}>{t("appCenter.status")}</h2>
          <div className={s.seg} role="radiogroup" aria-label={t("appCenter.status")}>
            {STATUSES.map((st) => (
              <button key={st} role="radio" aria-checked={status === st} className={s.segBtn} onClick={() => setStatus(st)}>
                {t(`status.${st}` as Key)}
              </button>
            ))}
          </div>
        </aside>

        <main className={s.main}>
          {load.state === "loading" && (
            <div className={s.grid} aria-busy="true" aria-label={t("state.loading")}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`${s.card} ${s.skel}`} />
              ))}
            </div>
          )}
          {load.state === "error" && (
            <div className={s.state} role="alert">
              <p>{t("state.error")}</p>
              <button className="btn" onClick={() => { setLoad({ state: "loading" }); void refresh(); }}>{t("action.retry")}</button>
            </div>
          )}
          {load.state === "ready" && visible.length === 0 && (
            <div className={s.state}>
              <p>{t("state.empty")}</p>
              <button className="btn" onClick={() => { setCategory("all"); setStatus("all"); setQuery(""); }}>{t("action.clearFilters")}</button>
            </div>
          )}
          {load.state === "ready" && visible.length > 0 && (
            <ul className={s.grid}>
              {visible.map((app) => (
                <li key={app.id} className={s.card}>
                  <div className={s.cardTop}>
                    <img src={app.iconUrl} alt="" width={40} height={40} className={s.logo} />
                    <div className={s.cardName}>
                      <h3>{app.name}</h3>
                      <span className={s.badge}>{catLabel(app.category)}</span>
                    </div>
                  </div>
                  <p className={s.desc}>{app.description[lang]}</p>
                  <CardStatus app={app} t={t} />
                  <div className={s.actions}>
                    <CardActions
                      app={app}
                      t={t}
                      canManage={load.canManage}
                      busy={busy === app.id}
                      onConnect={connect}
                      onDisconnect={setDisconnectApp}
                      onManage={() => setGithubOpen(true)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      {apiKeyApp && (
        <ApiKeyDialog
          app={apiKeyApp}
          lang={lang}
          t={t}
          onClose={() => setApiKeyApp(null)}
          onDone={async () => {
            setToast({ text: t("toast.connected", apiKeyApp.name) });
            setApiKeyApp(null);
            await refresh();
          }}
        />
      )}
      {disconnectApp && (
        <Dialog title={t("disconnect.title", disconnectApp.name)} onClose={() => setDisconnectApp(null)}>
          <p className="muted">{t("disconnect.desc", disconnectApp.name)}</p>
          <div className={s.dlgActions}>
            <button className="btn" onClick={() => setDisconnectApp(null)}>{t("action.cancel")}</button>
            <button className="btn btn-primary" disabled={busy === disconnectApp.id} onClick={() => confirmDisconnect(disconnectApp)}>
              {t("action.disconnect")}
            </button>
          </div>
        </Dialog>
      )}
      {githubOpen && <GithubDialog t={t} onClose={() => setGithubOpen(false)} onError={(text) => setToast({ text, error: true })} />}
      <div className={s.toasts} aria-live="polite">
        {toast && <div className={`${s.toast} ${toast.error ? s.toastErr : ""}`}>{toast.text}</div>}
      </div>
    </div>
  );
}

type T = ReturnType<typeof translator>;

function CardStatus({ app, t }: { app: CatalogItem; t: T }) {
  if (app.status === "error") return <p className={`${s.note} ${s.warn}`}>{t("card.needsReconnect")}</p>;
  if (app.status === "connected") {
    return (
      <p className={s.note}>
        {app.account ? t("card.connectedAs", app.account) : t("status.connected")}
        {app.personalAccounts && <> · {app.personalStatus === "connected" ? t("card.personalConnected") : t("card.personalMissing")}</>}
      </p>
    );
  }
  if (!app.configured) return <p className={s.note}>{t("card.notConfigured")}</p>;
  return null;
}

function CardActions(p: {
  app: CatalogItem;
  t: T;
  canManage: boolean;
  busy: boolean;
  onConnect: (a: CatalogItem, personal?: boolean) => void;
  onDisconnect: (a: CatalogItem) => void;
  onManage: () => void;
}) {
  const { app, t, canManage, busy } = p;
  if (app.status === "connected") {
    return (
      <>
        <span className={s.connected}>
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          {t("action.connected")}
        </span>
        <span className={s.grow} />
        {app.personalAccounts && app.personalStatus !== "connected" && (
          <button className="btn" disabled={busy} onClick={() => p.onConnect(app, true)}>{t("action.connectMine")}</button>
        )}
        {app.id === "github" && canManage && <button className="btn" onClick={p.onManage}>{t("action.manage")}</button>}
        {canManage && (
          <button className="btn btn-ghost btn-danger" disabled={busy} onClick={() => p.onDisconnect(app)}>{t("action.disconnect")}</button>
        )}
      </>
    );
  }
  const label = app.status === "error" ? t("action.reconnect") : t("action.connect");
  const why = !app.configured ? t("card.notConfigured") : !canManage ? t("card.adminOnly") : undefined;
  return (
    <>
      <span className={s.grow} />
      <button className="btn btn-primary" disabled={busy || !!why} title={why} onClick={() => p.onConnect(app)}>
        {label}
      </button>
    </>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    // native <dialog>: focus trap and Escape come with it. No close() in cleanup: under StrictMode
    // the effect re-runs, and closing fires onClose, which would unmount the dialog at once.
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog ref={ref} className={s.dialog} aria-labelledby="dlg-title" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <div className={s.dlgBody}>
        <h2 id="dlg-title" className={s.dlgTitle}>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

function ApiKeyDialog({ app, lang, t, onClose, onDone }: { app: CatalogItem; lang: Lang; t: T; onClose: () => void; onDone: () => Promise<void> }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api(`/api/v1/integrations/${app.id}/connect`, { method: "POST", body: JSON.stringify(values) });
      await onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <Dialog title={t("apiKey.title", app.name)} onClose={onClose}>
      <form onSubmit={submit} className={s.form}>
        <p className="muted">{t("apiKey.desc", app.name)}</p>
        {app.fields.map((f, i) => (
          <label key={f.name} className={s.field}>
            <span>{f.label[lang]}</span>
            <input
              className="input"
              name={f.name}
              type={f.secret ? "password" : "text"}
              autoComplete="off"
              required
              autoFocus={i === 0}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            />
          </label>
        ))}
        {error && <p className={s.formError} role="alert">{error}</p>}
        <div className={s.dlgActions}>
          <button type="button" className="btn" onClick={onClose}>{t("action.cancel")}</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{t("apiKey.submit")}</button>
        </div>
      </form>
    </Dialog>
  );
}

function GithubDialog({ t, onClose, onError }: { t: T; onClose: () => void; onError: (text: string) => void }) {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => {
    api<{ data: Repo[] }>("/api/v1/integrations/github/repositories")
      .then((r) => setRepos(r.data))
      .catch((e) => {
        onError((e as Error).message);
        onClose();
      });
    // load once when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function install(fullName: string) {
    setBusy(fullName);
    try {
      await api("/api/v1/integrations/github/repositories", { method: "POST", body: JSON.stringify({ repository: fullName }) });
      setRepos((rs) => rs?.map((r) => (r.fullName === fullName ? { ...r, hooked: true } : r)) ?? null);
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }
  return (
    <Dialog title={t("github.title")} onClose={onClose}>
      <p className="muted">{t("github.desc")}</p>
      {!repos ? (
        <p className="muted" aria-busy="true">{t("state.loading")}…</p>
      ) : (
        <ul className={s.repoList}>
          {repos.map((r) => (
            <li key={r.fullName} className={s.repo}>
              <span className={s.repoName}>{r.fullName}</span>
              {r.hooked ? (
                <span className={s.connected}>{t("github.installed")}</span>
              ) : (
                <button className="btn" disabled={!r.canInstallHook || busy === r.fullName} title={r.canInstallHook ? undefined : t("github.noAdmin")} onClick={() => install(r.fullName)}>
                  {t("github.install")}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className={s.dlgActions}>
        <button className="btn" onClick={onClose}>{t("action.cancel")}</button>
      </div>
    </Dialog>
  );
}
