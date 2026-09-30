# PRD-15 — Permintaan (formulir antardivisi, SLA hari kerja)

| Field | Value |
|---|---|
| Version | 0.1.1 — dua bahasa (D45); v0.1 draf pertama |
| Status | **Proposed** — posisi rilis mengikuti keputusan **D8** (pivot opsi B) di PRD-00 §8; tanpa D8 = kandidat rilis 2 |
| Owner | [TBD — Product Owner agere/org] |
| Last updated | 28 Sep 2026 |
| App id / nama tampilan | Bagian dari app `space` (bukan app id baru). Tampil di **Desk › Permintaan** dan **Kelola › Organisasi › Formulir** / **Kalender kerja** |
| Delivery context | Next.js modular monolith di Vercel (Pro), Postgres, Agere DS 6.4; tim 1 FE + 1 BE (PRD-00) |
| Depends on | PRD-00b (event, `due`), PRD-02 (zona waktu organisasi), PRD-03 (tim, Work Ownership), PRD-04 (authz, ACL proyek), PRD-06 (tugas, kolom), PRD-10 (Kotak masuk), PRD-11 (audit), PRD-13 (retensi), PRD-17 (pemicu `req_new`, `sla_soon`, rilis 3), UI-01 v2.4 |
| Prototipe acuan | "Prototipe agere/org v17.1": Desk › Permintaan, Kelola › Formulir, Kelola › Kalender kerja, halaman publik Formulir dan Lacak permintaan |


**Change log v0.1 → v0.1.1 (28 Sep 2026):** halaman publik **Formulir** dan **Lacak permintaan** tampil dalam **bahasa default organisasi** (D45) dengan pengalih bahasa; email ke pemohon luar memakai bahasa yang dipakai saat mengirim formulir. Label kolom formulir adalah konten organisasi (tidak diterjemahkan); teks sistem (SLA, status, galat validasi) mengikuti bahasa halaman. Copy SLA dua bahasa: "Sisa {n} hari kerja" / "{n} working days left", "Lewat SLA {n} hari kerja" / "{n} working days past SLA", "SLA dijeda" / "SLA paused".

## 1. Ringkasan eksekutif

**Rekomendasi: bangun Permintaan sebagai lapisan tipis di atas tugas PRD-06, bukan objek kerja kedua.** Setiap kiriman formulir menjadi **satu tugas** di proyek tujuan dan satu record `Request` yang menyimpan pemohon, formulir, dan jam SLA. Tim tujuan mengerjakannya di Daftar/Papan seperti tugas lain; pemohon melihat statusnya di Desk atau lewat tautan lacak. Diferensiasinya terhadap alat tugas umum adalah **SLA dalam hari kerja** (Senin–Jumat, libur organisasi, jam kerja) yang terlihat di satu tempat oleh kedua pihak.

> **Opportunity cost:** tanpa Permintaan, permintaan lintas divisi tetap lewat chat pribadi (WhatsApp) tanpa pemilik, tenggat, atau jejak. Itu alasan utama pilot kembali ke alat lain [Hypothesis: Needs Validation — pertanyaan wawancara pilot M2].

## 2. Masalah & akar masalah

| Lapisan | Temuan |
|---|---|
| Gejala | Divisi Desain menerima permintaan dari 4 divisi lewat chat; separuh tidak jelas tenggatnya; pemohon bertanya ulang "sudah sampai mana?". |
| Akar masalah | Tidak ada pintu masuk tunggal per divisi dengan isian wajib dan janji waktu yang disepakati. |
| Mengapa bukan "tugas biasa" | Pemohon sering bukan anggota proyek tujuan (tidak boleh melihat papan tim lain), dan tenggat harus dihitung dari jam kerja, bukan tanggal kalender. |

**Job to be done:** *Saat saya butuh bantuan divisi lain, saya ingin mengirim permintaan yang pasti sampai ke orang yang tepat dengan janji waktu yang jelas, agar saya tidak perlu menagih.*

## 3. Persona

| Persona | Job | Bukti |
|---|---|---|
| Pemohon (anggota divisi lain) | "Saya perlu banner, cukup isi formulir dan tahu kapan jadi." | [H] |
| Pemohon eksternal (klien) | "Saya melaporkan bug tanpa punya akun." | Prototipe: formulir publik Laporan Bug Klien [H] |
| Penanggung jawab tim tujuan | "Saya ingin antrean yang terurut SLA dan tidak bocor ke chat." | [H] |
| Admin / Owner | "Saya ingin mengatur formulir, SLA, dan hari kerja organisasi di satu tempat." | [H] |

## 4. Metrik

| Metrik | Baseline | Target | Jendela | Tipe |
|---|---|---|---|---|
| Permintaan selesai dalam SLA ÷ permintaan selesai | Diukur 2 minggu pertama pilot | ≥ 80% [H] | Per 4 minggu | Primer |
| Median waktu tanggap pertama (Baru → Dikerjakan), jam kerja | Diukur | ≤ 4 jam kerja [H] | Per 4 minggu | Sekunder |
| Org WACO dengan ≥ 1 formulir aktif dan ≥ 5 kiriman/minggu | — | ≥ 40% [H] | M3 | Adopsi |
| Permintaan tanpa penanggung jawab > 1 hari kerja | — | ≤ 10% | Mingguan | Guardrail |
| Data pemohon eksternal terlihat oleh anggota tanpa akses proyek | — | **0** | Selalu | Guardrail |

## 5. Scope (MoSCoW)

**Must:**
- **Formulir** per organisasi (Kelola › Formulir, Owner/Admin): nama, proyek tujuan, SLA (1 · 2 · 3 · 5 hari kerja), siapa yang bisa mengisi (*Anggota organisasi* atau *Siapa saja dengan tautan*), kolom isian (Teks singkat · Teks panjang · Tanggal · Pilihan · Email · Tautan; wajib/opsional; urutan), sakelar aktif. Judul dan Detail selalu ada dan wajib.
- **Kirim permintaan** dari Desk (dialog) dan dari halaman publik formulir. Kiriman membuat **satu tugas** di kolom `todo` pertama proyek tujuan + satu `Request` dengan nomor `PRM-0001` berurutan per organisasi.
- **Status permintaan** yang diturunkan dari kolom tugas: *Baru* (`todo`) · *Dikerjakan* (`doing`/`review`) · *Menunggu pemohon* (status khusus, **menjeda SLA**) · *Selesai* (`done`).
- **SLA hari kerja**: tenggat = waktu kirim + N hari kerja pada jam kerja organisasi (default 09.00–17.00, zona waktu organisasi, PRD-02 §6.1); kiriman setelah 17.00 mulai dihitung hari kerja berikutnya; libur dilewati.
- **Kalender kerja** (Kelola, Owner/Admin): hari kerja (default Senin–Jumat), jam kerja, libur nasional (impor dari daftar tahunan) dan libur perusahaan (tambah/hapus). Perubahan menghitung ulang SLA yang masih berjalan.
- **Desk › Permintaan**: tab *Masuk ke tim saya* · *Permintaan saya*, daftar gaya ClickUp (PRD-06 §6.10) per status; kolom Pemohon · Penanggung jawab · SLA · Prioritas; grup Selesai tertutup.
- **Lacak permintaan**: tautan unik tanpa login untuk pemohon eksternal (status + riwayat publik saja, tanpa komentar internal).
- **Notifikasi** (PRD-10): permintaan baru → ketua tim tujuan; permintaan ditugaskan → penanggung jawab; SLA tinggal 1 hari kerja → penanggung jawab; lewat SLA → penanggung jawab + ketua tim.

**Should:** panel Desk "SLA perlu perhatian" (maks. 3); badge rail Desk menjumlahkan notifikasi belum dibaca + permintaan lewat SLA (bila D36 diterima); Pemohon bisa menambah info saat *Menunggu pemohon* (satu kolom balasan, melanjutkan SLA).

**Could:** formulir bercabang (kolom bergantung jawaban); CSAT satu klik setelah Selesai.

**Won't (versi ini):** persetujuan berjenjang (approval); SLA per prioritas; lampiran file (PRD-07 ditahan, D22); captcha kustom (pakai rate limit, §8).

## 6. Model & aturan

```text
Organization
 ├── WorkCalendar { workdays: [1..5], work_start: "09:00", work_end: "17:00", timezone }
 │     └── Holiday { date, name, kind: national | company }
 └── Form { id, name, target_project_id, sla_workdays ∈ {1,2,3,5}, audience: members | link,
            fields: [{ key, label, type, required, order }], enabled, public_token? }
       └── Request { id, number (PRM-####, per org), form_id, task_id (1:1),
                     requester_user_id? | requester_email?, submitted_at, due_at,
                     paused_ms, state: new | in_progress | waiting | done, tracking_token }
```

| # | Aturan | Konsekuensi |
|---|---|---|
| R1 | **Satu kiriman = satu tugas.** `Request.task_id` unik. | Tidak ada daftar kerja kedua; Daftar, Papan, Tugas saya tetap sumber kerja. |
| R2 | **Akses pemohon ≠ akses proyek.** Pemohon selalu bisa melihat *Request*-nya (judul, status, SLA, riwayat publik) tanpa diberi akses ke proyek tujuan. | `authz` punya aturan khusus `request.view` untuk pemohon (PRD-04 §6.4 tambahan). |
| R3 | **SLA dihitung server-side** dari `submitted_at`, kalender kerja, dan `paused_ms`. | Tampilan klien hanya membaca `due_at` dan `sla_state` (`ok` · `soon` · `late` · `paused` · `done`). |
| R4 | **Menunggu pemohon menjeda SLA.** Durasi jeda ditambahkan ke `due_at` saat dilanjutkan. | Tidak ada "SLA palsu" yang lewat karena menunggu pemohon. |
| R5 | **Formulir nonaktif** menolak kiriman baru dengan pesan jelas; kiriman lama tetap. | Tautan publik tidak memunculkan 404. |
| R6 | **Proyek tujuan dihapus/diarsipkan** → formulir otomatis nonaktif dan Admin diberi tahu. | Tidak ada kiriman yang hilang tanpa tujuan. |

## 7. UX (Agere DS 6.4; UI-01 v2.4)

```text
Permintaan                                       [Kelola formulir] [▶ Kirim permintaan]
Permintaan antardivisi lewat formulir. SLA dihitung dalam hari kerja.
Masuk ke tim saya 6   Permintaan saya 3
▾ ◌ Baru 2
   Nama                           Pemohon   Penanggung jawab  SLA                     Prioritas
   ◌ Perbaikan tombol bayar …  PRM-0148   Budi (klien)  Belum ada   ⏱ Sisa 1 hari kerja     ⚑ Mendesak
▾ ◑ Dikerjakan 3 …   ▾ Ⅱ Menunggu pemohon 1 …   ▸ ✓ Selesai 1
```

| Bagian | Spesifikasi (token) |
|---|---|
| Header | `PageHeader`: judul `type-heading-xl` (24/32), satu kalimat `text-sm text-muted-foreground`; `PageHeaderActions` secondary **Kelola formulir** (outline, Owner/Admin saja), primary **Kirim permintaan** (default) — D32 |
| Kolom SLA | Ikon 14 px + teks 13/20; `late` → `error-on-surface`, `soon` → `attention-on-surface`, `paused` → `text-muted-foreground` dengan ikon jeda; `nowrap` |
| Dialog Kirim permintaan | `Dialog` 512 px: Formulir (`Select`, hint "SLA n hari kerja"), help "Masuk ke {proyek}. Selesai paling lambat n hari kerja.", lalu kolom formulir. Tanpa placeholder (D33); format di help text |
| Form builder | `Dialog` 640 px: nama, proyek tujuan, SLA, audiens (2 `Select`), daftar kolom (label · jenis · Wajib · naik · hapus), **+ Tambah kolom** (ghost sm). Footer: *Lihat sebagai pemohon* (ghost, kiri) · Batal · **Buat formulir** |
| Kalender kerja | Chip hari kerja (`aria-pressed`), help jam kerja, tabel libur (Tanggal · Nama · Jenis · hapus); header: *Impor libur nasional* (outline) + **Tambah libur** |

| State | Perilaku dan microcopy |
|---|---|
| Ideal | Daftar per status; grup Selesai tertutup |
| Empty | Ilustrasi `empty` + "Belum ada permintaan" · "Permintaan dari divisi lain masuk ke sini lewat formulir, lengkap dengan SLA." · **Kirim permintaan** (empty state memegang aksi utama; tombol header disembunyikan) |
| Loading | Skeleton 3 grup; angka tab disembunyikan (UI-01 "state menang atas angka") |
| Error | "Permintaan belum bisa dimuat. Periksa koneksi Anda, lalu coba lagi." + **Coba lagi** |
| Partial | Formulir nonaktif: "Formulir {nama} sedang tidak menerima permintaan." Proyek tujuan hilang: badge "Perlu ditinjau" di Kelola › Formulir |

**Microcopy kunci:** toast kirim "PRM-0151 terkirim ke Studio Desain. Target selesai Rabu, 30 Sep." · validasi "Judul permintaan wajib diisi." / "Ceritakan kebutuhan Anda agar tim bisa langsung mulai." · lacak "Permintaan Anda sedang dikerjakan. Target selesai Rabu, 30 Sep, 17.00 WIB."

## 8. User stories & acceptance criteria

**US-1 — Mengirim permintaan dengan SLA hari kerja.**
```gherkin
Given formulir "Permintaan Desain" aktif ke proyek Studio Desain dengan SLA 2 hari kerja
And hari ini Jumat 25 Sep 2026 pukul 15.00 WIB dan Senin 28 Sep bukan libur
When Sari mengirim "Poster acara A3" dengan Detail terisi
Then satu tugas dibuat di kolom todo pertama Studio Desain dan PRM-0151 dibuat dengan task_id tugas itu
And due_at = Selasa 29 Sep 2026 15.00 WIB
And ketua Tim Desain menerima notifikasi "Permintaan baru" di Kotak masuk
Given Sari mengirim pukul 17.30
Then due_at = Rabu 30 Sep 2026 09.00 WIB (dihitung dari hari kerja berikutnya)
Given Judul kosong
Then kiriman ditolak, semua error tampil sekaligus, dan fokus pindah ke Judul
```

**US-2 — Menunggu pemohon menjeda SLA.**
```gherkin
Given PRM-0145 sisa 1 hari kerja
When penanggung jawab mengubah status menjadi "Menunggu pemohon" selama 3 jam kerja
Then kolom SLA menampilkan "SLA dijeda" dan notifikasi SLA tidak dikirim
When status kembali ke "Dikerjakan"
Then due_at mundur 3 jam kerja dan sla_state dihitung ulang
```

**US-3 — Akses pemohon tanpa akses proyek.**
```gherkin
Given Andi tidak punya akses ke proyek Studio Desain
When Andi membuka Desk › Permintaan › Permintaan saya
Then Andi melihat PRM-0145 (judul, status, SLA, riwayat publik)
And Andi tidak melihat komentar internal, tugas lain, atau nama papan
And membuka tautan tugas mengembalikan "Item ini sudah dihapus atau Anda tidak punya akses"
```

**US-4 — Formulir publik dan lacak.**
```gherkin
Given formulir "Laporan Bug Klien" beraudiens "Siapa saja dengan tautan"
When pengunjung tanpa akun mengirim dengan email valid
Then PRM dibuat dengan requester_email dan halaman "Laporan terkirim" menampilkan tautan lacak
And email konfirmasi memuat tautan lacak yang sama
Given pengunjung mengirim > 5 kali dalam 10 menit dari IP yang sama
Then kiriman ke-6 ditolak dengan "Terlalu banyak kiriman. Coba lagi dalam beberapa menit."
Given formulir dinonaktifkan
Then halaman publik menampilkan "Formulir ini sedang tidak menerima permintaan." tanpa kolom isian
```

**US-5 — Kalender kerja menghitung ulang SLA.**
```gherkin
Given PRM-0149 due_at Selasa 29 Sep 17.00
When Admin menambah libur perusahaan Selasa 29 Sep
Then due_at PRM-0149 menjadi Rabu 30 Sep 17.00 dan perubahan tercatat di audit
Given Admin menambah libur pada tanggal yang sudah libur
Then ditolak dengan "Tanggal ini sudah libur."
```

**US-6 — Formulir dengan proyek tujuan yang diarsipkan.**
```gherkin
Given formulir "Pengadaan Barang" menuju proyek Pengadaan
When proyek Pengadaan diarsipkan
Then formulir otomatis nonaktif, Admin menerima notifikasi, dan badge "Perlu ditinjau" tampil di Kelola › Formulir
```

## 9. NFR, keamanan, aksesibilitas

- **Keamanan:** tautan publik dan lacak memakai token acak ≥ 128 bit; rate limit 5 kiriman / 10 menit / IP + 50 / jam / formulir [H]; isi kiriman publik disanitasi; email pemohon eksternal adalah PII (PRD-13, retensi mengikuti tugas).
- **Kinerja:** perhitungan `due_at` O(hari) dengan cache libur per organisasi; daftar paginasi 50 baris per grup (PRD-06 §6.10).
- **Aksesibilitas:** nama aksesibel kolom SLA memuat teks lengkap ("Lewat SLA 1 hari kerja"); status tidak hanya dengan warna (ikon + kata); formulir publik lolos axe tanpa pelanggaran critical/serious (gate G6).

## 10. Dependensi, event, estimasi, pertanyaan terbuka

**Event (tambahan katalog PRD-00b):**

| Type | Audit | Notify |
|---|:-:|---|
| `request.form.created` / `.updated` / `.enabled` / `.disabled` | ✓ | — |
| `request.submitted` | — | ketua tim tujuan |
| `request.state.changed` (incl. `waiting` ↔ `in_progress`) | — | pemohon (Selesai, Menunggu pemohon) |
| `request.sla.soon` / `request.sla.breached` | — / ✓ | penanggung jawab (+ ketua tim saat breached) |
| `workcalendar.updated` | ✓ | — |

`request.submitted` dan `request.sla.soon` adalah event pemicu Agen (PRD-17 v0.2, `req_new` dan `sla_soon`).

**Estimasi [Hypothesis — ulang di W0]:** sesuai selisih pivot B di PRD-00 §4.2 langkah 6 (**BE +16, FE +16**).

| Kapabilitas | BE | FE |
|---|--:|--:|
| Model Form/Request/WorkCalendar, nomor PRM, authz `request.view` | 3 | 0 |
| Mesin SLA hari kerja (jam kerja, libur, jeda, hitung ulang) + tes properti | 4 | 0 |
| Kirim permintaan (dialog) + halaman publik + lacak + rate limit | 3 | 4 |
| Desk › Permintaan (daftar ClickUp, kolom SLA, tab) | 1 | 4 |
| Form builder + Kelola › Formulir | 2 | 4 |
| Kalender kerja + impor libur nasional | 1,5 | 2 |
| Notifikasi & event + panel "SLA perlu perhatian" | 1,5 | 2 |
| **Total** | **16** | **16** |

**Keputusan & pertanyaan:**

| # | Pertanyaan | Opsi A (Pragmatic) | Opsi B (Strategic) | Rekomendasi |
|---|---|---|---|---|
| D8 | Posisi rilis | Rilis 1 (pivot B): +16/+16 → 31 minggu (PRD-00 §4.2 langkah 7.6), perlu potongan "leaner" | Rilis 2 setelah M3, dengan data pilot tentang permintaan lintas divisi | **B**, kecuali ≥ 3 design partner menyebut permintaan lintas divisi sebagai alasan utama memakai agere/org |
| Q1 | Data libur nasional | Daftar statis tahunan di repo, diperbarui manual | Sumber resmi terjadwal (SKB 3 Menteri) | A untuk pilot [H] |
| Q2 | Pemohon eksternal membalas saat *Menunggu pemohon* | Balas lewat email ke alamat unik | Kolom balasan di halaman lacak | B (tanpa parsing email) |
| Q3 | SLA per prioritas | Won't sekarang | Tabel SLA per prioritas per formulir | A; tinjau setelah 8 minggu data |
