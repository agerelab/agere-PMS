import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = { title: "agere/org" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = (await cookies()).get("agere-lang")?.value === "id" ? "id" : "en";
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
