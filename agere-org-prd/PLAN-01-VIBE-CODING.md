# PLAN-01 — Rencana pengembangan agere/org dengan vibe coding

| Field | Value |
|---|---|
| Versi | 1.0 (28 Sep 2026) |
| Pemilik | Product Owner agere/org (rencana) · engineer FE dan BE (eksekusi) |
| Berlaku untuk | Rilis 1 (Must), lalu rilis 2 dan 3 sesuai gerbang di PRD-00 |
| Dasar | PRD-00 v1.2.9 §4.2 langkah 9 dan §4.3 (**Opsi A, 29 minggu**, direkomendasikan), TECH-01 v1.4, UI-01 v2.6, Agere DS 6.4, prototipe v18, dan panduan vibe coding PRD-14 §14 yang kini diangkat menjadi aturan untuk semua modul |
| Alat | Google Antigravity (agent-first IDE), GitHub (PR, CI, CODEOWNERS), Vercel Pro (preview per PR + database branch) |

> **Prinsip utama: spesifikasi adalah prompt.** Agent coding tidak menebak maksud produk. Setiap slice dimulai dari satu user story dengan AC Given-When-Then, satu layar prototipe, dan komponen Agere DS yang sudah ada. Kode yang tidak bisa ditelusuri ke AC tidak di-merge.

## 1. Tujuan dan metrik rencana

| Tujuan | Metrik | Target |
|---|---|---|
| Rilis 1 tepat waktu | M3 go/no-go | akhir **W29** (Opsi A) |
| Mutu tidak turun karena kode buatan AI | Gate G1–G7 PRD-00 §6 | 100 % lulus di M3 |
| Kecepatan terukur, bukan diasumsikan | *v* per peran (§9) | diukur di W8 dan M1; jadwal dipangkas hanya bila *v* terbukti |
| Konsistensi desain | Lint DS/CTA/tata letak (§6) | 0 pelanggaran di `main` |
| Dua bahasa sejak awal | Lint i18n + paritas kunci `en`/`id` | 0 string UI tertulis langsung; 100 % kunci ada di kedua katalog |

## 2. Urutan sumber kebenaran

```text
PRD (perilaku, cakupan, AC)  →  TECH-01 (kontrak data & alur)  →  UI-01 (layout & aturan UI)
  →  Agere DS 6.4 / 6.5 (token & komponen)  →  Prototipe v18 (acuan perilaku & tampilan)  →  kode
```

- **Bila bertentangan, yang lebih kiri menang** (Index C-29). Agent diwajibkan menyebut konflik di Implementation Plan, bukan memilih sendiri.
- Paket PRD disalin utuh ke `docs/` di repo, sehingga agent dan manusia membaca sumber yang sama. Setiap perubahan PRD masuk lewat PR ke `docs/` dengan nomor keputusan (D-xx).

## 3. Setup repo untuk agent (W0)

```text
agere-org/
├── AGENTS.md                 persona @be · @fe · @qa · @copy + batasan yang mengikat
├── .agents/
│   ├── rules/                aturan yang dibaca setiap agent (lihat tabel)
│   └── skills/               pekerjaan berulang (lihat tabel)
├── docs/                     paket PRD v2.2 + prototipe v18 + DS 6.4 CHANGELOG
├── src/
│   ├── app/                  Next.js App Router (route per UI-01)
│   ├── modules/<modul>/      domain · repo · actions · loaders · events · tests   (TECH-01 P1)
│   ├── i18n/                 en.json (sumber) · id.json · format.ts
│   └── ui/                   impor Agere DS saja; tidak ada komponen visual baru tanpa DS
├── db/migrations/            forward-only
└── tests/                    ac/ (dari Gherkin) · tenancy/ · a11y/ · lint/ · visual/
```

| `.agents/rules/` | Isi yang mengikat |
|---|---|
| `architecture.md` | `ctx` selalu argumen pertama repository; modul tidak membaca tabel modul lain; action mengembalikan `ActionResult`; tidak ada SQL mentah di luar repository (TECH-01 §10) |
| `ui.md` | Hanya komponen dan token Agere DS; satu tombol default per layar; hierarki CTA & aksi header (UI-01 v2.5 "Aksi & CTA"); lima state wajib; tidak ada placeholder di bidang tulis (D33) |
| `i18n.md` | Semua teks sistem lewat `t()`; kunci baru ditambah ke `en.json` **dan** `id.json`; konten pengguna tidak pernah diterjemahkan; format lewat `format.ts` (D45) |
| `security.md` | Otorisasi selalu di server; agent AI (PRD-17) hanya menulis lewat tool; rahasia hanya di env Vercel |
| `lanes.md` | Daftar jalur terkunci (§5); agent tidak boleh mengubah test jalur terkunci |

| `.agents/skills/` | Fungsi |
|---|---|
| `gherkin-to-test` | AC → test Vitest/Playwright di `tests/ac/` |
| `new-server-action` | kontrak Zod + fake + action + test |
| `new-event` | entri katalog PRD-00b + `publish` + flag audit |
| `ds-screen` | layar dari prototipe v18 dengan komponen DS, lima state, dan kunci i18n |
| `i18n-key` | tambah/ubah kunci di kedua katalog + cek panjang teks (+35 %) |
| `a11y-check` | axe + pemeriksaan fokus dan nama aksesibel pada layar yang disentuh |
| `migration` | migrasi forward-only dengan `organization_id` di kolom pertama setiap indeks |

## 4. Alur per slice (≤ 1 hari ideal)

1. **Pilih slice** dari kolom *Siap* (Definition of Ready: AC Gherkin, jalur ditandai, fake tersedia, layar prototipe dirujuk, kunci i18n didaftar).
2. **Implementation Plan artifact** oleh agent: file yang disentuh, komponen DS, event, kunci i18n, konflik spesifikasi. Engineer menyetujui atau mengoreksi.
3. **Test dulu:** agent menulis test dari AC. Jalur terkunci: engineer me-review test sebelum implementasi.
4. **Implementasi** sampai test hijau, lalu **walkthrough artifact** (tangkapan layar terang/gelap, 1440/390 px, EN/ID).
5. **PR** ke GitHub dengan walkthrough; CI menjalankan gate §6.
6. **Preview Vercel** dengan database branch; engineer mengecek di browser memakai skrip demo slice.
7. **Merge** ke `main` → produksi di balik flag bila modulnya belum rilis.

**Template prompt layar (dipakai skill `ds-screen`):**

```text
Bangun layar {rute} sesuai PRD-{xx} US-{n} dan prototipe v18 ({rute prototipe}).
Komponen: hanya Agere DS 6.4 ({daftar komponen}). Aksi header: PageHeaderActions (1 default, ≤ 2 outline, ⋯).
Lima state: Ideal · Empty · Loading · Error · Partial (copy dari PRD, kunci i18n en+id).
Jangan menambah placeholder di bidang tulis. Jangan menulis string UI langsung.
Selesai bila: test AC hijau, lint UI/i18n/tata letak hijau, axe 0 critical/serious.
```

## 5. Dua jalur kode (diperluas dari PRD-14 §14 ke semua modul)

| Jalur | Cakupan | Aturan |
|---|---|---|
| **Bebas** | Layar dari DS, lima state, microcopy, styling, fake, seed data, halaman baca | Agent boleh berjalan tanpa persetujuan per langkah; review lewat preview dan walkthrough |
| **Terkunci** | `authz` dan matriks akses · repository dan migrasi · `events.publish` + audit · purge dan penghapusan (PRD-13) · Work Ownership (PRD-03) · penyimpanan urutan dan pemindahan tugas · resolusi locale dan render email · runtime Agen: kebijakan izin, tool tulis, metering (PRD-17) | Test ditulis dan disetujui manusia **sebelum** implementasi; file test dilindungi CODEOWNERS; penulis PR harus bisa menjelaskan setiap baris |

## 6. Gate CI (branch protection `main`, semua memblokir merge)

| Check | Isi | Asal |
|---|---|---|
| Typecheck + lint | termasuk larangan SQL mentah di luar repository | TECH-01 §10 |
| Unit + contract | fake dan adapter nyata di file test yang sama | TECH-01 §11 |
| AC | Gherkin dari story yang disentuh PR | G1 |
| Tenancy | lintas org 404, suspended, removed, app nonaktif | G2 |
| **Lint UI** | ≤ 1 default dan ≤ 2 outline di header; ⋯ terakhir; tidak ada merah solid di halaman; tidak ada aksi ganda tombol/⋯; tombol ikon berlabel; placeholder hanya di pencarian | QA-02 (lint CTA) |
| **Lint tata letak** | hanya area konten yang bergulir; permukaan global (launcher agent, toast) tidak menutupi aksi | QA-02 B-08, PRD-17 §10.2 |
| **Lint i18n** | tidak ada string UI tertulis langsung; paritas kunci `en`/`id`; snapshot pseudo-lokalisasi +35 % tanpa terpotong | D45, UI-01 v2.5 |
| Aksesibilitas | axe 0 critical/serious pada layar yang disentuh | G6 (otomatis) |
| **Visual** | tangkapan layar layar kunci dibandingkan baseline yang disetujui (terang/gelap, 1440/390) | UI-01, DS 6.4 |
| Keamanan | secret scan, audit dependensi tanpa high/critical | G3 |
| Migrasi | forward-only; `organization_id` pertama di setiap indeks | TECH-01 |

## 7. Linimasa rilis 1 (Opsi A, 29 minggu; 1 FE + 1 BE)

Minggu relatif: **W0** persiapan, **W1** kick-off (tanggal menunggu D7). Kapasitas 3,5 hari ideal per orang per minggu, kontingensi 1,2 (PRD-00 §4.1).

| Fase | Minggu | BE | FE | Keluar / milestone |
|---|---|---|---|---|
| 0 · Persiapan | W0 | Keputusan Opsi A/B, D34–D38, D43, D7; repo, CI dengan semua gate §6 | Papan Kanban, backlog fase 1 dengan AC; UX writer mulai katalog `en` (C-31) | Keputusan tercatat, CI hijau |
| 1 · Fondasi | W1–W7 | Spike auth (W1); identitas (W3–W4); organisasi, onboarding 3 langkah + *Titik mulai* (W5–W6); outbox + audit + sweeper (W6–W7) | **Fondasi i18n + model locale (W1–W2)**; shell navigasi ganda, primitif DS, aturan UI global (W2–W4); layar auth, onboarding, pengaturan (W5–W7) | Login, buat org, undang, dalam EN/ID |
| 2 · Akses & orang | W8–W11 | Authz space → proyek, ACL, matriks peran (W8–W9); undangan, anggota, tim, cabut akses (W10–W11) | Aplikasi, Akses, Bagikan + Akses lanjutan, state ditolak; Anggota, undangan, Tim | **M1 — dogfood internal (akhir W11)** |
| 3 · Space + Desk | W12–W19 | Work Ownership, space, proyek, papan, kolom (W12–W14); tugas, urutan + seret di Daftar (Opsi A), Tugas saya, event (W15–W17); notifikasi + email per bahasa penerima, Panduan (W18–W19) | Semua proyek, halaman space, Daftar/Papan/Ringkasan, detail tugas v2 (W12–W17); Desk, Kotak masuk, Panduan EN/ID (W18–W19) | **M2 — pilot tertutup (akhir W19)** |
| 4 · Siklus data & pengerasan | W20–W26 | Sampah/purge, hapus akun & organisasi, alih kepemilikan (W20–W22); keamanan, performa, rekonsiliasi (W23–W26) | Sampah, Pengaturan, zona berbahaya (W20–W22); audit viewer (atau rilis 1.1, D6); **uji pseudo-lokalisasi + copy final EN/ID**; pass aksesibilitas (W23–W26) | Semua gate otomatis hijau |
| 5 · Go/no-go | W27–W29 | Perbaikan pilot, uji restore, runbook | Perbaikan pilot, review copy dan Panduan dua bahasa | **M3 — go/no-go (akhir W29)**; gate G-Chat dievaluasi |

- **Slack 1,01 minggu** (PRD-00 langkah 9) dipakai hanya untuk risiko nyata; bukan untuk menambah cakupan.
- **Opsi B (28 minggu):** seret-lepas di Daftar dan reorder lewat menu baris pindah ke rilis 1.1; fase 3 selesai W19 dengan beban FE lebih ringan, fase 5 menjadi W26–W28.
- **Pemotongan pertama bila throughput W8 di bawah rencana:** D6 (audit viewer → rilis 1.1).

## 8. Ritme mingguan (Kanban)

| Hari | Kegiatan | Keluaran |
|---|---|---|
| Senin | Tarik slice ke *Siap* (maks. 6); cek Definition of Ready | Papan terisi |
| Setiap hari | WIP maks. 2 per orang (satu jalur terkunci + satu jalur bebas) | PR kecil (≤ 1 hari ideal) |
| Rabu | Demo preview Vercel ke PO (15 menit) | Keputusan/umpan balik tercatat di PR |
| Jumat | Metrik: hari ideal selesai, lead time, *v*, jumlah revert, pelanggaran lint | Log metrik mingguan |

## 9. Kecepatan: ukur, jangan asumsikan

- *v* per peran = hari ideal selesai × 1,2 ÷ (3,5 × orang-minggu terpakai). Diukur di **W8** dan **M1**.
- Rencana hanya dipercepat bila *v* ≥ 1,3 selama dua pengukuran berturut-turut, dan hanya untuk jalur bebas (jalur terkunci tetap dihitung *v* = 1,0). [Hypothesis: Needs Validation]
- Revert karena kode agent salah dihitung sebagai hari yang **tidak** selesai.

## 10. Yang tetap dikerjakan manusia

- Menyetujui test dan migrasi jalur terkunci; review keamanan setiap PR jalur terkunci.
- Keputusan produk (PO) dan copy final dua bahasa (UX writer).
- Uji manual: keyboard dan screen reader (bagian manual G6), uji privasi, uji dua bahasa di perangkat nyata.
- Membuka flag per kohort pilot.

## 11. Risiko vibe coding

| Risiko | Mitigasi |
|---|---|
| Agent melonggarkan test agar hijau | Test jalur terkunci dilindungi CODEOWNERS |
| Kode tampak benar tetapi melewatkan filter tenant | Matriks tenancy G2 wajib di CI; `ctx` argumen pertama |
| Desain melenceng dari DS | Lint UI + visual baseline; hanya komponen DS |
| String Indonesia/English tertulis langsung | Lint i18n + paritas kunci |
| PR terlalu besar untuk di-review | Slice ≤ 1 hari ideal; PR > 400 baris diff ditolak kecuali migrasi/generated |
| Agent memakai spesifikasi usang | `docs/` versi paket di-pin; Implementation Plan wajib menyebut versi dokumen yang dibaca |
| Rahasia bocor lewat prompt | Rahasia hanya di env Vercel; secret scan di CI |

## 12. Setelah rilis 1

| Rilis | Isi (urutan WSJF, PRD-00 §9) | Prasyarat | Perkiraan |
|---|---|---|---|
| 1.1 | D6 audit viewer; Opsi B: seret-lepas di Daftar | M3 lulus | 2–3 minggu [H] |
| 2 | Chat (bila G-Chat lolos) W30–W41; Kalender/Timeline, subtugas (D38), checklist, tampilan tersimpan | G-Chat, WSJF | per PRD |
| 3 | Doc (PRD-08 v1.1), **Agen (PRD-17 v1.0, 9 minggu)**, Permintaan bila D8 belum menarik lebih awal | Kontrak event stabil di produksi; subprocessor AI disetujui (PRD-13, Legal L4); harga kredit (D43/Q2) | per PRD |

## 13. Definition of Done (setiap slice)

- AC Gherkin story menjadi test otomatis dan hijau; gate §6 hijau.
- Lima state ada dan diuji; teks tersedia di `en` dan `id`.
- Walkthrough terlampir (terang/gelap, 1440/390, EN/ID); preview dicek PO atau engineer lain.
- Event dan audit sesuai katalog PRD-00b bila ada mutasi.
