import { cookies } from "next/headers";
import { resolveLang } from "@/lib/i18n";
import { AppCenter } from "./AppCenter";

export const metadata = { title: "App Center · agere/org" };

export default async function AppCenterPage() {
  const lang = resolveLang((await cookies()).get("agere-lang")?.value);
  return <AppCenter lang={lang} />;
}
