"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { translator, type Key, type Lang } from "@/lib/i18n";
import s from "./task.module.css";

type Link = { id: string; appId: string; kind: string; url: string; title: string; metadata: Record<string, any>; createdAt: string };
type Data = { task: { id: string; ref: string; title: string; status: string }; links: Link[] };
type PickerSession = { accessToken: string; apiKey: string; appId: string };

declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

let pickerReady: Promise<void> | null = null;
/** Loads Google's picker library once (https://developers.google.com/drive/picker). */
function loadPicker(): Promise<void> {
  pickerReady ??= new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = "https://apis.google.com/js/api.js";
    el.async = true;
    el.onload = () => window.gapi.load("picker", { callback: () => resolve(), onerror: () => reject(new Error("picker failed to load")) });
    el.onerror = () => {
      pickerReady = null;
      reject(new Error("Google API script failed to load"));
    };
    document.head.appendChild(el);
  });
  return pickerReady;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body?.error?.message ?? `HTTP ${res.status}`), { code: body?.error?.code });
  return body as T;
}

export function TaskAttachments({ taskId, lang }: { taskId: string; lang: Lang }) {
  const t = useMemo(() => translator(lang), [lang]);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await api<Data>(`/api/v1/tasks/${taskId}/attachments`));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [taskId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function attachFromDrive() {
    setBusy(true);
    setError(null);
    try {
      const session = await api<PickerSession>("/api/v1/integrations/google-drive/picker-session");
      await loadPicker();
      const g = window.google.picker;
      const picker = new g.PickerBuilder()
        .addView(new g.DocsView(g.ViewId.DOCS).setIncludeFolders(true).setSelectFolderEnabled(false))
        .enableFeature(g.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(session.accessToken)
        .setDeveloperKey(session.apiKey)
        .setAppId(session.appId) // grants drive.file access to the picked files
        .setLocale(lang)
        .setCallback(async (res: any) => {
          if (res[g.Response.ACTION] === g.Action.CANCEL) return setBusy(false);
          if (res[g.Response.ACTION] !== g.Action.PICKED) return;
          try {
            for (const doc of res[g.Response.DOCUMENTS] as any[]) {
              await api(`/api/v1/tasks/${taskId}/attachments`, { method: "POST", body: JSON.stringify({ provider: "google-drive", fileId: doc[g.Document.ID] }) });
            }
            await load();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        })
        .build();
      picker.setVisible(true);
    } catch (e) {
      if ((e as { code?: string }).code === "PERSONAL_CONNECTION_REQUIRED") setNeedsAccount(true);
      else setError((e as Error).message);
      setBusy(false);
    }
  }

  async function remove(link: Link) {
    await api(`/api/v1/tasks/${taskId}/attachments/${link.id}`, { method: "DELETE" });
    await load();
  }

  const connectMine = () => {
    const q = new URLSearchParams({ personal: "1", redirect: "1", return_to: `/tasks/${taskId}` });
    window.location.assign(`/api/v1/integrations/google-drive/connect?${q}`);
  };

  if (!data && !error) return <div className={s.page} aria-busy="true" />;
  if (!data) return <div className={s.page}><p role="alert">{error}</p></div>;

  return (
    <div className={s.page}>
      <p className={s.ref}>{data.task.ref}</p>
      <h1 className={s.title}>{data.task.title}</h1>
      <p className={s.meta}>
        {t("task.status")}: <span className={s.status} data-status={data.task.status}>{t(`taskStatus.${data.task.status}` as Key)}</span>
      </p>

      <section className={s.section} aria-labelledby="att-h">
        <div className={s.sectionHead}>
          <h2 id="att-h">{t("task.attachments")}</h2>
          {needsAccount ? (
            <button className="btn btn-primary" onClick={connectMine}>{t("action.connectMine")}</button>
          ) : (
            <button className="btn" disabled={busy} onClick={attachFromDrive}>{t("task.attachDrive")}</button>
          )}
        </div>
        {needsAccount && <p className="muted">{t("card.personalMissing")}</p>}
        {error && <p className={s.err} role="alert">{error}</p>}
        {data.links.length === 0 ? (
          <p className={s.empty}>{t("task.noLinks")}</p>
        ) : (
          <ul className={s.links}>
            {data.links.map((l) => (
              <li key={l.id} className={s.link}>
                <img src={`/integrations/${l.appId}.svg`} alt="" width={28} height={28} />
                <div className={s.linkBody}>
                  <a href={l.url} target="_blank" rel="noreferrer noopener">{l.title}</a>
                  <span className="muted">
                    {l.kind === "google_drive_file" ? t("task.drive") : l.kind === "github_pull_request" ? `${t("task.pr")} · ${l.metadata.repository}#${l.metadata.number} · ${l.metadata.state}` : `${t("task.commit")} · ${l.metadata.repository} · ${String(l.metadata.branch ?? "")}`}
                  </span>
                </div>
                {l.kind === "google_drive_file" && (
                  <button className="btn btn-ghost" onClick={() => remove(l)} aria-label={`${t("task.remove")} ${l.title}`}>{t("task.remove")}</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
