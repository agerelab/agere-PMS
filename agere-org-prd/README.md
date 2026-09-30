# agere/org — Paket PRD (28 Sep 2026)

Mulai dari **00-PRD-INDEX.md** (v2.7): tabel modul, register amandemen C-01…C-31, dan kontrak platform. Keputusan D1…D48 ada di **PRD-00 §8**. Paket ini diselaraskan dengan **prototipe v18.5** dan **Agere DS 6.4**. Rencana eksekusi vibe coding: **PLAN-01**.

| Kelompok | Dokumen |
|---|---|
| Rencana & kontrak | 00-PRD-INDEX (v2.7), **PLAN-01 Rencana vibe coding (v1.0)**, PRD-00 MVP Release Plan (v1.2.14; rilis 1 = **29 minggu**, Opsi A, dua bahasa), PRD-00B Event Contract, TECH-01 Data Flow (v1.5), UI-01 Layout Standard (v2.11, termasuk keputusan desain Agen DD-1…DD-6 dan kartu proyek minimal) |
| Platform (rilis 1) | PRD-01 Identity, PRD-02 Organization (v1.2.1, onboarding 3 langkah, bahasa organisasi), PRD-03 People & Teams, PRD-04 Roles & Access (v1.5.1), PRD-10 Notifications / Kotak masuk (v1.4.1), PRD-11 Audit (v1.1.2), PRD-12 Settings (v1.2.3), PRD-13 Data Lifecycle (v1.0.2) |
| Aplikasi | PRD-06 Space & Project (v2.1.2, rilis 1, tanpa halaman Semua proyek), PRD-18 Panduan (v1.1.3, rilis 1), PRD-14 Team Chat (v1.5.1, kandidat rilis 2; kolaborasi pesan D48), PRD-09 Calendar (rilis 2), PRD-08 Doc (v1.1.3, rilis 3; tab Doc proyek dengan pratinjau slide-out), **PRD-17 Agen / AI Agent (v1.0.1, usulan rilis 3, D44)**, PRD-15 Permintaan (v0.1.1, usulan, D8) |
| Ditahan / arsip | PRD-07 File (ditahan, D22; lampiran Chat dibuka, D48), PRD-05 Lead CRM (dihapus, arsip) |
| Referensi | `referensi/PRD_AI_Agent_Project_Management_System_v1_0.md` (dokumen masukan untuk PRD-17 v1.0) |
| QA | QA-02 Triase audit & QA prototipe v13 → v17.1 (baru), QA-01 Triase QA v10 |
| Prototipe | **`prototipe/agere-org-prototipe-v19-1.html` (usulan): v19 + layar Kelola › App Center (katalog 17 integrasi, connect OAuth/API key, GitHub webhook, Google Drive per anggota; implementasi di `apps/web`). v19: satu sidebar menggantikan navigasi ganda rail + panel kontekstual (D19); belum diselaraskan ke UI-01, perlu keputusan PO.** Acuan yang berlaku tetap `prototipe/agere-org-prototipe-v18-5.html` (acuan perilaku dan desain untuk semua rilis, D42; English default, Bahasa Indonesia lewat menu akun atau Preferensi; buka langsung di browser). versi v18.3, v18.2, v18.1, v18, v17.1 dan v13 disimpan sebagai riwayat |

**Diputuskan PO pada 28 Sep 2026:** D28a subtugas (desain), D30 onboarding 3 langkah, D31 Otomatisasi → Agen › Pemicu, D32 aksi & CTA, D33 tanpa placeholder, D39 Doc selalu bisa diedit, D40 Impor multi-format, D41 detail tugas v2, **D44 model AI Agent (Opsi B)**, **D45 dua bahasa, English default**, **D46 Space tanpa Semua proyek + kartu proyek minimal**, **D47 tab Doc proyek: daftar bersih + pratinjau slide-out**, **D48 kolaborasi Chat** (jadwal rilis 2 terbuka: D48a). D37 (token `on-surface`) mengikuti rilis Agere DS 6.4.

**Keputusan terbuka:** D6 (viewer audit → rilis 1.1), D27 (tautan publik), D28b (label), D29 (Agen, usulan), **D34** (hapus lonceng topbar; syarat Opsi B), **D35** (judul 24/32), **D36** (isi badge Desk), **D38** (rilis subtugas; rekomendasi rilis 2), **D43** (Langganan, pencarian penuh, dialog pintasan, titik mulai di Proyek baru).

**Keputusan paling mendesak:** pilih **Opsi A (29 minggu, slack 1,01 minggu)** atau **Opsi B (28 minggu, seret-lepas di Daftar ke rilis 1.1, slack 0,36 minggu)** di PRD-00 §4.2 langkah 9. Opsi 26 minggu dari langkah 8 sudah tidak berlaku karena D45.

**Sudah diputuskan desain:** DD-1…DD-6 (UI-01 v2.6, prototipe v18). **Masih terbuka:** review katalog copy English dan Panduan English oleh UX writer (C-31).
