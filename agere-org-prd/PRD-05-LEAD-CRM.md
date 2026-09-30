# PRD-05 — Lead CRM

> ## ⛔ DIHAPUS DARI ROADMAP (v1.1.0 — 26 Sep 2026)
>
> **Keputusan PO (26 Sep 2026): Lead CRM dan semua turunannya dikeluarkan dari agere/org.** Dokumen ini disimpan hanya sebagai arsip keputusan. Tidak ada aturan di bawah ini yang mengikat implementasi, dan tidak ada rilis yang merencanakannya.
>
> **Yang ikut dihapus:** Perusahaan, Kontak, Lead, Deal, Pipeline, Tindak lanjut, Aktivitas penjualan, Laporan penjualan, event `lead.*`, app id `lead` di registry, glosarium penjualan (Menang/Kalah, Panas/Hangat/Dingin), serta modul Sales & CRM di Master PRD v2.0 §2.3 dan v3.0 §4.3.
>
> **Alasan:**
> 1. Fokus produk bergeser ke operasi lintas divisi ("Permintaan → Selesai"); CRM adalah kategori terpisah dengan kompetitor khusus.
> 2. Scope terbesar di set PRD dengan reach sempit (RICE 50, rilis 3); tidak memengaruhi kapasitas rilis 1, tetapi membebani rilis 3 dan desain lintas modul.
> 3. Menghapus data pribadi kontak pihak ketiga mengurangi beban UU PDP (PRD-13).
>
> **Yang dipertahankan sebagai aturan generik (dipindah, bukan dihapus):**
> - Format uang IDR (`Intl.NumberFormat("id-ID")`, input dengan titik ribuan otomatis) → UI-01 §Form dan §Angka, untuk field kustom mata uang.
> - Menu keyboard "Pindahkan ke…" di papan → UI-01 §Papan.
>
> **Referensi yang batal:** lihat register amandemen **C-16** di 00-PRD-INDEX. Organisasi yang tetap ingin melacak penjualan dapat memakai Project umum; agere/org tidak menyediakan template penjualan.

---

*Isi di bawah ini adalah arsip v1.0.2 dan tidak berlaku.*

> ## Release status & alignment addendum (v1.0.1 — 25 Sep 2026) — ARSIP
>
> **Release:** deferred to **release 3** (PRD-00 §3.3). It is not part of the MVP, and the app registry does not list Lead until it ships (PRD-04 §6.5).
>
> 1. **Access:** Company and Deal are ACL containers. Contacts inherit from their Company; next actions and activities inherit from their Deal or Company (PRD-04 §6.4).
> 2. **Events:** publish `lead.*` per the PRD-00b catalog. Next-action due dates use the `due` shape (PRD-00b §6.1). Implement Schedulable and Work Ownership.
> 3. **Money:** amounts are stored in IDR by default, displayed as Rp150.000 via `Intl.NumberFormat("id-ID")`.
> 4. **Personal data:** contacts are personal data processed for the customer organization.
> 5. **Recommended scope cut:** Company, Contact, Deal, Next action, pipeline value.

> ## QA v10 amendment (v1.0.2 — 26 Sep 2026) — ARSIP
>
> A1 deal permission matrix (QA C1) · A2 closing a deal (QA C2) · A3 owner is told (QA CH1) · A4 tindak lanjut ownership (QA C5, V11) · A5 pipeline board (QA C6, A5, A7, V1, V10) · A6 pipeline management epic (QA C11) · A7 reports & metrics (QA §7, V4, V5, V13) · A8 glossary (QA V8) · A9 mobile (QA C7, C8). Semua butir ini batal per 26 Sep 2026.

## 1. Problem (arsip)

Sales teams need one operational workspace for companies, contacts, leads, deals, follow-ups, activities, and pipeline visibility.

## 2. Goal (arsip)

Provide a lightweight CRM focused on relationship context and sales execution.

## 3. Core features (arsip)

Companies, Contacts, Leads (Hot/Warm/Cold, qualification, Lead → Deal), Deals (pipeline, stage, value, probability, expected close, owner, lost reason), Activities (LinkedIn, WhatsApp, Email, Phone, Meeting), Next actions, Reporting (funnel, win rate, pipeline value, weighted pipeline, stale deals, CSV import/export).
