// Minimal t() until the shared i18n setup (PLAN-01 src/i18n) exists. English is the default (D45).
import en from "./en.json";
import id from "./id.json";

export type Lang = "en" | "id";
export type Key = keyof typeof en;
const CATALOGS: Record<Lang, Record<Key, string>> = { en, id };

export function translator(lang: Lang) {
  return (key: Key, ...args: (string | number)[]) =>
    (CATALOGS[lang][key] ?? en[key] ?? key).replace(/\{(\d)\}/g, (_, i) => String(args[Number(i)] ?? ""));
}

export const resolveLang = (v: string | undefined | null): Lang => (v === "id" ? "id" : "en");
