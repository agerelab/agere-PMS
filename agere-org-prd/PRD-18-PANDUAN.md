# PRD-18 — Panduan dalam aplikasi (Cara pakai & Alur kerja)

| Field | Value |
|---|---|
| Version | 1.1.3 (29 Sep 2026) |
| Status | Draft — **rilis 1** (keputusan D24, PRD-00 v1.2.6) |
| Owner | [TBD — Product Owner agere/org]; pemilik konten: [TBD — satu orang, lihat §9] |
| Last updated | 28 Sep 2026 |
| Delivery context | Next.js modular monolith di Vercel; tim 1 FE + 1 BE (PRD-00) |
| Depends on | UI-01 v2.4 (rail, panel kontekstual, pintasan), PRD-12 (preferensi pengguna), PRD-06, PRD-08, PRD-10, PRD-17 |
| Prototipe acuan | "Prototipe agere/org v17.1": rail › Panduan, tombol **?** di setiap panel, tombol keyboard `?` |

**Change log v1.1.2 → v1.1.3 (29 Sep 2026):** langkah *Membuat proyek* tidak lagi menyebut "Space › Semua proyek" (D46): "Buka space tujuan di panel Space."; *Tunjukkan di layar* membuka space terakhir.

**Change log v1.1.1 → v1.1.2 (29 Sep 2026):** *Cara pakai › Agen* ditulis ulang untuk model agent (PRD-17 v1.0.1): *Meminta bantuan agent* (tombol Agent / Ctrl J), *Menyetujui usulan agent*, *Membuat agent baru* (kalimat biasa → blueprint → aktifkan), *Membuat pemicu otomatis*. Langkah v0.2 ("nyalakan sakelar di kartu skill", "ubah instruksi di bagian 3") dihapus. Setiap item tetap punya *Tunjukkan di layar* ke layar v18.

**Change log v1.1 → v1.1.1 (28 Sep 2026):** isi Panduan (*Cara pakai* dan *Alur kerja*) tersedia dalam **English dan Bahasa Indonesia** dan mengikuti bahasa pengguna (D45). Konten disimpan sebagai katalog berkunci yang sama dengan UI, sehingga tautan *Tunjukkan di layar* tidak bergantung pada bahasa. Kartu Selamat datang juga dua bahasa.

**Change log v1.0 → v1.1 (28 Sep 2026):**

- **Konten Cara pakai bertambah** mengikuti fitur baru: Doc (*Menulis tanpa mode edit*, *Memilih jenis blok*, *Menjadikan teks sebagai tugas*, D39), Agen (*Membuat pemicu otomatis*, D31) dan Space (*Membuat dan memindah subtugas*, D28a). Setiap item tetap punya **Tunjukkan di layar**.
- **Tata letak panel (spasi kelipatan 4 dari Agere DS 6.4):** chip menu dalam grid 3 kolom (tidak ada chip yatim di baris kedua); akordeon menjadi **satu grup bertepi** dengan pemisah 1 px (sebelumnya kartu saling menempel dengan tepi ganda, QA-02 B-23); judul item 14/20, chevron 16 px, jarak 8; isi langkah rata dengan judul (inset 40 px); nomor langkah 20 px, jarak antarlangkah 12.
- **Alur kerja:** durasi ("3 menit") di kanan judul alur, bukan dipisah titik tengah; tautan **Tunjukkan** 12 px `fg-subtle` agar tidak lebih menonjol dari teks langkah; kotak centang sejajar baris pertama.
- **Pintasan:** `?` tetap membuka Panduan; **Ctrl /** membuka dialog *Pintasan keyboard* (UI-01 v2.4). Keduanya tidak aktif saat fokus di kolom teks atau editor Doc.
- Kartu **Selamat datang** (lima langkah opsional, tanpa tur paksa) tetap di Desk › Kotak masuk setelah onboarding (PRD-02 v1.2, D30).

## 1. Masalah

Tim kecil yang pindah dari WhatsApp dan spreadsheet tidak membaca dokumentasi terpisah. Tanpa bimbingan di tempat kerja, anggota baru memakai sebagian kecil fitur dan kembali ke kebiasaan lama. Ini menekan aktivasi organisasi (≥ 2 anggota aktif dan ≥ 5 tugas dalam 7 hari, PRD-00 §2).

**Akar masalah:** pengguna tahu *apa* yang harus dikerjakan (tugasnya), tetapi tidak tahu *bagaimana* melakukannya di agere/org dan *urutan* kerja yang diharapkan timnya.

## 2. Tujuan

Setiap menu punya panduan "Cara pakai" singkat, dan setiap peran punya **alur kerja** yang bisa dicentang, keduanya bisa dibuka tanpa meninggalkan layar kerja.

## 3. Persona & JTBD

| Persona | Job to be done |
|---|---|
| Anggota baru | "Hari pertama saya ingin tahu apa yang harus saya buka setiap pagi." |
| Penanggung jawab permintaan | "Saya ingin tahu urutan menangani permintaan agar SLA tidak lewat." |
| Lead proyek | "Saya ingin menyiapkan proyek mingguan tanpa bertanya ke Admin." |
| Admin | "Saya ingin menyiapkan organisasi di minggu pertama dengan urutan yang benar." |

## 4. Metrik

| Metrik | Target | Tipe |
|---|---|---|
| Organisasi aktif (PRD-00 §2) pada org yang anggotanya membuka Panduan vs yang tidak | +10 pp [H] | Outcome |
| Anggota baru yang menyelesaikan ≥ 3 langkah alur kerja dalam 7 hari | ≥ 40% [H] | Primer |
| Klik "Tunjukkan di layar" yang berhasil menyorot elemen | ≥ 95% | Kualitas |
| Waktu ke tugas pertama (median) | ≤ 10 menit (PRD-00) | Guardrail |

## 5. Scope

**Must (rilis 1):**

- Panel **Panduan** di kanan (372 px) yang **mendorong** konten, bukan menutupinya; dibuka dari rail, tombol **?** di header panel kontekstual (langsung ke menu itu), atau tombol `?` (bila tidak sedang mengetik); Esc menutup.
- Tab **Cara pakai**: chip per menu (Desk, Space, Proyek, Chat, Doc, Agen, Kelola — hanya menu yang aktif untuk pengguna), otomatis memilih menu yang sedang dibuka; setiap cara pakai = judul + 2–4 langkah bernomor + tombol **Tunjukkan di layar**.
- Tab **Alur kerja**: playbook per peran (Member, Penanggung jawab, Lead proyek, Admin) berisi alasan, perkiraan durasi, langkah bercentang, cincin progres, dan tautan **Tunjukkan** per langkah.
- **Tunjukkan:** membuka layar tujuan lalu menyorot elemen (garis tepi + denyut 2×, 2,6 detik, `prefers-reduced-motion` = garis tepi saja). Bila elemen tidak ada, sorot judul halaman.
- Progres alur kerja disimpan per pengguna per organisasi di server (bukan hanya browser).
- Konten statis berbahasa Indonesia yang di-deploy bersama aplikasi (file konten versi, bukan CMS).

**Should:** titik penanda di ikon Panduan sampai pertama dibuka; pesan selamat saat satu alur selesai.

**Won't (rilis 1):** tur paksa (modal berurutan) di login pertama; video; konten yang ditulis organisasi sendiri (kandidat rilis 2).

## 6. Model

```text
guide_content (file, versi rilis)
  sections[]: { key: desk | space | proyek | chat | doc | agen | kelola, intro, items[]: { title, steps[], target: {route, params, selector} } }
  playbooks[]: { id, role, title, duration, why, steps[]: { title, desc, target } }

guide_progress (tabel, modul identity)
  organization_id, user_id, playbook_id, step_index, done_at
  unik (organization_id, user_id, playbook_id, step_index)
```

- `target.selector` hanya boleh menunjuk atribut stabil `data-guide="…"` (bukan kelas CSS), agar refactor UI tidak merusak sorotan. Test CI memeriksa setiap selector ada di layar tujuannya.
- Langkah yang menunjuk fitur di luar hak pengguna (mis. Kelola › Formulir untuk Member) disembunyikan, bukan dinonaktifkan.

## 7. UX

| State | Perilaku dan microcopy |
|---|---|
| Ideal | Tab Cara pakai terbuka pada menu saat ini, cara pakai pertama terbentang |
| Empty | Tidak berlaku (konten statis) |
| Loading | Tidak ada (konten dibundel); progres dimuat terpisah dan tampil 0/n sampai siap |
| Error | Progres gagal disimpan: centang dikembalikan + toast "Progres belum tersimpan. Coba lagi." |
| Partial | Elemen tujuan tidak ditemukan: sorot judul halaman |

**Aksesibilitas:** panel `aside` dengan `aria-label="Panduan"`; tab mengikuti pola ARIA tabs; centang langkah memakai `role="checkbox"` dengan nama "Tandai langkah 2 selesai"; fokus kembali ke pemicu saat panel ditutup.

## 8. User stories & acceptance criteria

**US-1 — Cara pakai sesuai menu.**

```gherkin
Given saya sedang di halaman Doc
When saya menekan tombol ? di header panel Doc
Then Panduan terbuka di tab "Cara pakai" dengan chip "Doc" terpilih
And konten halaman Doc tetap terlihat dan bisa dipakai di samping panel
```

**US-2 — Tunjukkan di layar.**

```gherkin
Given saya membuka cara pakai "Menambah kolom status"
When saya memilih "Tunjukkan di layar"
Then aplikasi membuka Papan proyek contoh dan menyorot tombol "Tambah kolom" selama 2,6 detik
Given elemen tujuan tidak ada di layar
Then judul halaman yang disorot
```

**US-3 — Progres alur kerja tersimpan.**

```gherkin
Given saya mencentang 3 dari 5 langkah "Rutinitas harian anggota tim" di laptop
When saya membuka Panduan dari perangkat lain di organisasi yang sama
Then cincin progres menunjukkan 3/5
When saya mencentang langkah terakhir
Then toast "Alur 'Rutinitas harian anggota tim' selesai." tampil
```

**US-4 — Menghormati akses.**

```gherkin
Given saya Member tanpa akses Admin
When saya membuka alur "Menyiapkan organisasi di minggu pertama"
Then alur itu tidak ditampilkan di daftar peran saya
And langkah yang menunjuk halaman khusus Admin tidak muncul di alur lain
```

## 9. Estimasi & kepemilikan konten

| Kapabilitas | BE | FE |
|---|--:|--:|
| Panel, tab, chip menu, sorotan, pintasan `?` | 0 | 1,5 |
| Konten awal (7 menu, 4 alur) dalam file konten + test selector | 0 | 0,5 |
| Tabel `guide_progress` + action `toggleGuideStep` | 0,5 | 0 |
| **Total** | **0,5** | **2** |

**Kepemilikan konten:** setiap PR yang mengubah alur UI wajib memperbarui file konten Panduan (checklist PR). Satu pemilik konten (PO atau ditunjuk) mereview copy per rilis (gate G10 PRD-00).
