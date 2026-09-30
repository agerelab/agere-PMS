# QA-01 — Triase laporan QA prototype v10

| Field | Value |
|---|---|
| Versi | 1.0 |
| Tanggal | 26 Sep 2026 |
| Sumber | Laporan QA UX/UI agere/org prototype v10 (uji 26 Sep 2026; 36 layar, 4 persona, desktop 1440 px dan HP 390 px) |
| Hasil | Prototype **v11** (artifact "agere/org Lengkap", versi 12) dan amandemen PRD di paket ini |
| Pemilik | Product Owner agere/org |

**Ringkasan keputusan.** Semua temuan Blocker dan Major yang merupakan cacat sudah diperbaiki di prototype v11 dan dikunci sebagai aturan di PRD. Pengecualiannya lima temuan yang sebenarnya **fitur baru** (kelola pipeline, komentar di Doc, timeline/milestone, checklist AC, beban kerja lintas proyek). Kelimanya masuk backlog dengan rilis tujuan yang jelas dan tidak dibangun di prototype, karena rilis 1 hampir tanpa slack (PRD-00 §4.2) dan sebagian besar area itu (Lead, Doc) baru dirilis di rilis 3.

## 1. Cara membaca status

| Status | Arti |
|---|---|
| **Diperbaiki (v11)** | Perilaku sudah benar di prototype v11 dan aturannya ditulis di PRD yang dirujuk |
| **Aturan PRD** | Keputusan dikunci di PRD; prototype menunjukkan contohnya, implementasi mengikuti aturan untuk semua layar |
| **Backlog** | Diterima sebagai kebutuhan, dijadwalkan di rilis yang disebut; tidak dibangun sekarang |
| **Tidak tereproduksi** | Tidak muncul lagi di v11; perilaku yang benar tetap ditulis di PRD agar tidak regresi |

## 2. Blocker & Major

| ID | Temuan singkat | Keputusan | Status | Rujukan |
|---|---|---|---|---|
| C1 | Anggota bisa menutup deal orang lain | Ubah tahap, nilai, pemilik, dan hapus deal hanya oleh **pemilik deal, Admin/Owner, atau pemegang manage**. Anggota lain dengan edit tetap bisa mencatat aktivitas, tindak lanjut, dan file | Diperbaiki (v11) | PRD-05 addendum A1 |
| C2 | Won tanpa konfirmasi | Dialog "Tandai deal menang?" (nilai final, tanggal tutup, catatan) + toast "Urungkan" untuk setiap perubahan tahap | Diperbaiki (v11) | PRD-05 A2 |
| CH1 | Pemilik deal tidak diberi tahu | Notifikasi in-app ke pemilik bila orang lain mengubah tahap, nilai, perkiraan tutup, pemilik, atau menghapus deal | Diperbaiki (v11) | PRD-10 §5 (baris baru), PRD-05 A3 |
| AD1 | "Jadikan Owner" tanpa reauth | Semua perubahan peran lewat dialog konfirmasi; jadikan Owner wajib autentikasi ulang (≤ 10 menit) seperti Alihkan kepemilikan | Diperbaiki (v11) | PRD-04 §6.2 amandemen |
| AD2 | Cabut akses aplikasi tanpa info dampak | Dialog dampak: siapa kehilangan akses dan pekerjaan terbuka mereka, dengan opsi "Alihkan pekerjaan ke" (default Admin/Owner pertama yang punya akses) | Diperbaiki (v11) | PRD-04 §6.5 amandemen, PRD-03 §6.3 |
| C3 | Header/counter tidak ikut state data | Aturan UI-01 "state menang atas angka": di Kosong angka = 0, di Memuat/Error angka disembunyikan; satu pola error per layar; Anggota tidak punya empty state | Diperbaiki (v11) di Pipeline, Daftar lead, Kalender, Doc, File, Anggota | UI-01 §State |
| C4 | Guard perubahan hanya di 3 form | Satu guard global untuk semua form di dialog ("Lanjut edit / Buang perubahan"); isian tidak pernah hilang karena render ulang | Diperbaiki (v11) global | UI-01 §Form |
| C5 | Tindak lanjut deal vs perusahaan tidak sinkron | Tindak lanjut milik tepat satu entitas (deal, perusahaan, kontak, atau lead). Halaman perusahaan menampilkan miliknya + milik semua deal-nya (berlabel deal); kartu deal tanpa tindak lanjut menampilkan "N tindak lanjut di perusahaan" | Diperbaiki (v11) | PRD-05 A4 |
| C6 | Kolom hasil di luar layar | Empat tahap terbuka mengisi lebar (grid); Menang/Kalah menjadi zona jatuh tetap di bawah papan | Diperbaiki (v11) | PRD-05 A5, UI-01 §Papan |
| C7, C8 | Detail deal, Daftar lead, Anggota meluber di HP | KPI satu kolom ≤ 480 px; aksi header membungkus; tabel menjadi kartu di < 768 px | Diperbaiki (v11); lebar dokumen = 390 px di 7 layar | UI-01 §HP (< 768 px), PRD-05 A9 |
| C9 | Tugas ditugaskan ke tim tanpa akses | Pemilih penanggung jawab hanya menawarkan orang dengan akses proyek dan tim yang minimal satu anggotanya punya grant; tim sebagian tetap memunculkan peringatan PRD-03 | Diperbaiki (v11) | PRD-06 §6.1 amandemen |
| C11 | Pipeline & tahap tidak bisa dikelola | Epic "Kelola pipeline" (aturan di PRD-05 A6). Sementara: dropdown "Semua pipeline" disembunyikan | Backlog rilis 3 (interim diperbaiki) | PRD-05 A6 |
| PO1 | To-do Doc tidak terhubung ke tugas | "Jadikan tugas" di menu blok to-do; chip status tugas; centang to-do ⇄ status tugas tersinkron | Diperbaiki (v11); rilis bersama Doc | PRD-08 addendum D2 |
| PO2 | Tidak ada komentar di Doc | Komentar inline per blok + status dokumen (Draft/Review/Disetujui) | Backlog rilis 3 (Should Doc) | PRD-08 D4 |
| PO3 | Tugas belum cukup untuk user story | Checklist (untuk AC) dan label di rilis 2; estimasi dan dependensi rilis 3+ | Backlog | PRD-06 §5 |
| PM1 | Proyek tanpa target, pemilik, status | Field pemilik proyek, target selesai, status manual (Sesuai rencana / Berisiko / Terlambat) + catatan; kartu proyek tidak lagi menulis "Tepat waktu" hasil turunan | Diperbaiki (v11); Should #2 rilis 1 | PRD-06 §6.8, PRD-00 §3.2 |
| PM2 | Tanpa milestone/timeline | Milestone per proyek + timeline sederhana | Backlog rilis 2 | PRD-06 §5 |
| ON1 | Layar pertama onboarding = channel kosong | Kunjungan pertama ke proyek membuka **Papan**; Channel hanya jadi tab awal bila diikuti **dan** sudah berisi pesan; pembuat proyek otomatis mengikuti channel-nya | Diperbaiki (v11) | PRD-06 §6.7, PRD-14 §6 |
| DC1 | Bagikan halaman ternyata membagikan folder | Tombol akses di halaman menulis "Akses: folder {nama}"; pilihan lokasi saat membuat halaman | Label diperbaiki (v11); lokasi = backlog rilis 3 | PRD-08 D3 |
| FL1 | Unggahan gagal milik orang lain terlihat | Unggahan yang belum `ready` hanya terlihat oleh pengunggah | Diperbaiki (v11) | PRD-07 addendum F1 |
| KL1 | Tampilan Hari = Minggu | Tampilan Hari menampilkan satu tanggal (+ blok Terlambat bila hari ini) | Tidak tereproduksi di v11; ditetapkan | PRD-09 addendum K1 |
| AX1 | Fokus tidak kembali ke pemicu | Setiap dialog menyimpan pemicunya; setelah ditutup fokus kembali ke pemicu (atau ke pemicu menu bila item menu sudah hilang) | Diperbaiki (v11) global | UI-01 §Form |

## 3. Minor

| ID | Keputusan | Status | Rujukan |
|---|---|---|---|
| C10, ON8 | Validasi menampilkan semua error sekaligus, fokus ke field pertama yang salah | Aturan PRD; v11: form Deal dan Reset sandi | UI-01 §Form |
| V1 | Satu token per tahap (`chart-series-1…4`, Menang `success-solid`, Kalah `error-solid`) di titik kolom, badge, dan chart | Diperbaiki (v11) | PRD-05 A5 |
| V2 | Angka ringkas (jt/M) di kartu, chart, dan ringkasan header; angka penuh di detail, tabel, dan input | Aturan PRD; v11: header Pipeline | UI-01 §Angka |
| V3 | Perubahan 0% memakai ikon netral "—" tanpa tanda + | Diperbaiki (v11) | UI-01 §Angka |
| V4, V13 | Grafik bernilai punya 3–4 gridline berlabel; nilai tengah donut memakai format ringkas | Backlog rilis 3 (Lead) | PRD-05 A7 |
| V5 | Satu kontrol periode per halaman | Backlog rilis 3 | PRD-05 A7 |
| V6 | Skeleton mengikuti layout akhir (kartu KPI, chart, tabel) | Aturan PRD | UI-01 §State |
| V7 | Judul halaman menyebut aplikasinya ("Ringkasan Project", "Ringkasan Lead"); "Lead › Lead" menjadi "Daftar lead" | Diperbaiki (v11) | UI-01 §NavMain |
| V8 | Glosarium resmi: Menang/Kalah, Tindak lanjut, Panas/Hangat/Dingin. "Pipeline", "Deal", "Lead" tetap sebagai nama produk | Diperbaiki (v11) | PRD-05 A8, Index §Platform contracts (Naming) |
| V9 | Placeholder generik ("Contoh: Nama klien · produk") | Diperbaiki (v11) | UI-01 §Form |
| V10 | Input Rupiah dengan titik ribuan otomatis + pratinjau "Rp85 jt" | Diperbaiki (v11) | PRD-05 A5 |
| V11 | Deal tertutup tidak menampilkan "Belum ada tindak lanjut" | Diperbaiki (v11) di kartu | PRD-05 A4 |
| V12 | Halaman khusus admin menampilkan "Halaman ini khusus Owner dan Admin", bukan 404 | Diperbaiki (v11) | PRD-04 §8.3 |
| V14 | Owner/Admin melihat email penuh di dialog undang | Diperbaiki (v11) | PRD-03 |
| V15 | Toast tanpa aksi ditutup saat berpindah halaman; toast dengan "Urungkan" tetap sampai waktunya | Diperbaiki (v11) | UI-01 §Shell & aksesibilitas |
| A1 | Tooltip chart disembunyikan dari pembaca layar; data tersedia di "Lihat sebagai tabel" | Diperbaiki (v11) | UI-01 §Shell & aksesibilitas |
| A2 | Label prioritas "Rendah" memakai `fg-subtle` (≥ 4,5:1) | Diperbaiki (v11) | UI-01 §Shell & aksesibilitas |
| A3, A4 | Tanggal di luar bulan dan item selesai di Kalender ≥ 4,5:1 di kedua tema | Diperbaiki (v11) | PRD-09 K3 |
| A5 | Kolom pipeline `role="group"`, kartu dalam `role="list"` | Diperbaiki (v11) | — |
| A6 | Layar auth punya landmark `main` | Diperbaiki (v11) | UI-01 |
| A7 | Tombol "Pindahkan ke…" di kartu deal (keyboard) | Diperbaiki (v11) | PRD-05 A5 |
| A8 | Area sentuh checkbox ≥ 24 px (44 px di HP) | Diperbaiki (v11) | UI-01 §Shell & aksesibilitas |
| PO4 | Templat dokumen (PRD, notulen, SOP) | Backlog rilis 3 (Could) | PRD-08 D4 |
| PO5 | Modal tugas tetap simpan eksplisit; header modal menampilkan "Belum disimpan" saat ada perubahan | Backlog rilis 1.1 | PRD-06 §8.1 |
| PM3 | Kategori sistem Review dan Diblokir (token `task-review-*`, `task-blocked-*`) | Backlog rilis 2 | PRD-06 §5 |
| PM4 | Beban kerja lintas proyek per anggota; tugas tim dipisah | Backlog rilis 2 | PRD-06 §5 |
| PM5 | Filter gabungan (penanggung jawab + prioritas + tenggat) dan pencarian di papan | Backlog rilis 2 | PRD-06 §5 |
| PM6 | Badge proyek di sidebar = pesan channel belum dibaca; diberi tooltip dan nama aksesibel | Diperbaiki (v11) | UI-01 §Isi NavMain |
| AD3 | Log audit urut menurun berdasarkan waktu | Diperbaiki (v11) | PRD-11 amandemen |
| AD4 | Kartu tim menghitung anggota aktif dan menandai yang ditangguhkan | Diperbaiki (v11) | PRD-03 |
| AD5, AD6 | Organisasi `pending_deletion`: kontrol nonaktif dengan alasan inline; anggota yang diblokir melihat halaman tanpa navigasi + tanggal penghapusan | Backlog rilis 1.1 | PRD-02 |
| AD7 | Dialog Hapus organisasi menawarkan ekspor data dan audit | Backlog rilis 2 (ekspor organisasi PRD-13) | PRD-13 |
| AD8 | Counter "Diundang" hanya menghitung undangan aktif | Diperbaiki (v11) | PRD-03 |
| AD9 | Kebijakan keamanan organisasi (wajib MFA, domain email, batas sesi) | Backlog rilis 2 | PRD-02 |
| AD10 | Toast pulihkan menyebut nama item | Diperbaiki (v11) | PRD-13 |
| AD11 | Label "(aplikasi nonaktif)" vs "(tanpa akses)" di Kalender | Diperbaiki (v11) | PRD-09 |
| ON2 | Layar verifikasi menampilkan email lengkap + "Salah email? Ubah" | Diperbaiki (v11) | PRD-01 |
| ON3 | Indikator kekuatan sandi + tolak 10.000 sandi paling umum; ganti sandi wajib verifikasi sandi lama | Aturan PRD (rilis 1, diserap hardening) | PRD-01 |
| ON4 | Daftar dengan email terdaftar: pesan netral + email "Anda sudah punya akun" | Aturan PRD (rilis 1) | PRD-01 |
| ON5 | "Daftar dengan Google" dan tombol tampilkan sandi | Backlog rilis 1.1 | PRD-01 |
| ON6 | Error undangan di onboarding inline, bukan toast | Backlog rilis 1.1 | PRD-03 |
| ON7 | Tanggal undangan "30 Sep 2026"; Tolak lewat konfirmasi | Diperbaiki (v11) | PRD-03 |
| SE1 | Tombol "Salin kode" pemulihan MFA (unduh .txt di aplikasi produksi) | Diperbaiki (v11) | PRD-01 |
| SE2 | Label ekspor mengikuti format (JSON/CSV) | Diperbaiki (v11) | PRD-12 |
| SE3 | Preferensi notifikasi kerja (termasuk perubahan deal/tugas saya oleh orang lain) | Backlog rilis 2 | PRD-10 |
| DC2 | "Pindahkan ke…" folder dengan peringatan perubahan akses | Backlog rilis 3 | PRD-08 D4 |
| DC3, DC4 | Tabel: header placeholder, keluar dengan Esc/↓; shortcut markdown "- " dan "[] " | Backlog rilis 3 (kriteria pemilihan editor) | PRD-08 D4 |
| DC5 | Versi awal selalu tersedia sebagai titik pertama riwayat | Diperbaiki (v11) | PRD-08 |
| CH2 | Microcopy DM: "Pesan langsung hanya terlihat oleh peserta…" | Diperbaiki (v11) | PRD-14 §9 |
| FL2 | Pemakaian penyimpanan = tingkat organisasi, sama untuk semua | Diperbaiki (v11) | PRD-07 F2 |
| KL2 | Tautan langsung ke field tenggat di item sumber; drag untuk menjadwal ulang di rilis berikutnya | Backlog rilis 2 | PRD-09 K2 |
| AX2 | `document.title` = "{halaman} · {organisasi} · agere/org" | Diperbaiki (v11) | UI-01 |
| AX3 | Tautan "Lewati ke konten" | Diperbaiki (v11) | UI-01 |
| AX4 | Perpindahan halaman diumumkan lewat region live | Diperbaiki (v11) | UI-01 |
| AX5 | Badge sidebar dibaca dengan konteks ("Tugas saya, 6 tugas terbuka") | Diperbaiki (v11) | UI-01 |
| PL1 | Konsol support: tangguhkan organisasi dengan konfirmasi ketik slug; pencarian dan filter status | Backlog rilis 1.1 | PRD-01 amandemen QA (PL1) |

## 4. Definisi metrik penjualan (PM §7) — dikunci

| Metrik | Definisi resmi |
|---|---|
| Win rate | Ditampilkan dua-duanya dengan label eksplisit: **Win rate (jumlah)** = deal Menang ÷ deal tertutup; **Win rate (nilai)** = nilai Menang ÷ nilai tertutup, dalam periode tanggal tutup yang dipilih |
| Konversi lead | Lead yang dibuat dalam periode dan sudah dikonversi menjadi deal ÷ semua lead yang dibuat dalam periode (bukan "menang") |
| Deal tidak aktif | Subset deal **terbuka** tanpa aktivitas 14+ hari; label "Terbuka · tanpa aktivitas 14+ hari", tidak dijumlah terpisah dari deal terbuka |
| Nilai pipeline | Angka besar = total nilai deal terbuka; caption = "tertimbang Rp…" (nilai × probabilitas tahap) |

## 5. Tindak lanjut

- Laporan QA untuk v11 cukup mengulang test case Bagian 9, B4, dan C9. Hasil otomatis saat penyusunan: axe 0 pelanggaran di 22 tampilan × 2 tema (44 pemeriksaan), lebar dokumen = viewport di 7 layar HP, tanpa error JavaScript.
- Pengujian manual screen reader (NVDA/VoiceOver) tetap dibutuhkan untuk gate G6 (PRD-00).
