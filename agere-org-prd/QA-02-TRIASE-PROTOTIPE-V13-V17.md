# QA-02 — Triase audit & QA prototipe v13 → v17.1

| Field | Value |
|---|---|
| Versi | 1.0 |
| Tanggal | 28 Sep 2026 |
| Sumber | (A) Audit UI/UX prototipe **v13** (27 Sep 2026, tangkapan layar semua rute). (B) QA otomatis dan manual selama redesign **v14 → v17.1** (27–28 Sep 2026): 3 persona (Owner, Admin, Member) × 4 state data (ideal, kosong, memuat, error) × 1440 px dan 390 px, terang dan gelap |
| Hasil | Prototipe **v17.1** ("Prototipe agere/org v17.1") dan amandemen di Index v2.0, PRD-00 v1.2.7, PRD-02 v1.2, PRD-06 v2.1, PRD-08 v1.1, PRD-10 v1.4, PRD-12 v1.2.2, PRD-14 v1.4, PRD-15 v0.1, PRD-17 v0.2, PRD-18 v1.1, TECH-01 v1.3, UI-01 v2.4; **Agere DS 6.4** |
| Pemilik | Product Owner agere/org |

**Ringkasan.** 12 temuan audit v13 (A) dan 26 temuan QA v14–v17.1 (B). Semua sudah diperbaiki di prototipe v17.1. Temuan yang merupakan keputusan produk dan bukan cacat dikunci di register keputusan (PRD-00 §8), bukan hanya di prototipe; lima di antaranya masih menunggu PO (D34, D35, D36, D38, D43). Tujuh temuan B ditemukan oleh pemeriksa otomatis yang ditambahkan selama proses ini, yaitu lint, uji interaksi, atau pengukuran berbasis skrip (B-01, B-02, B-07, B-10, B-11, B-12, B-17; kolom *Cara ditemukan*); sisanya ditemukan saat meninjau tangkapan layar atau mencocokkan prototipe dengan PRD dan DS.

## Cara verifikasi (berlaku untuk rilis berikutnya)

| Pemeriksa | Apa yang diuji | Cakupan |
|---|---|---|
| Uji asap rute | Tidak ada error JavaScript di setiap rute | 36 rute × 3 persona × 4 state |
| Uji interaksi | 79 langkah: form, guard "Perubahan belum disimpan", pindah kartu dengan keyboard, Urungkan, aksi massal, Bagikan, onboarding, subtugas, seret, pemicu, tampilan tersimpan, checklist, formulir, pencarian, 404, utas | Chromium, 1440 px |
| Lint aturan CTA | ≤ 1 default dan ≤ 2 outline di header; tidak ada ghost berteks di header; ⋯ terakhir; outline tersembunyi dan ⋯ tersedia di < 768 px; tidak ada merah solid di halaman; tidak ada aksi yang sama di tombol dan ⋯; tombol ikon berlabel; tidak ada placeholder selain pencarian; tidak ada teks rilis/"Contoh:" | semua rute × persona × state × 1440/390 |
| Lint dialog | Aksi akhir paling kanan dan hanya satu; Batal = ghost; destructive-outline di kiri; ukuran footer md | 30 dialog × 2 persona |
| Lint tata letak | Di rute berkerangka shell, `#app` tidak bergulir (hanya `#content`) | semua rute × persona × state × 1440/390 |
| Pengukuran | Posisi teks label kolom = posisi teks nama; ukuran ikon status; nilai CSS terhitung vs spesifikasi DS 6.4 | Daftar, Tugas saya, Permintaan, modal, Doc |
| Agere DS 6.4 CI | token · typecheck · 341 tes · build portal · Storybook · contoh Next.js | paket DS |

Temuan lint yang **bukan** pelanggaran dan sengaja dibiarkan: kata "Rilis" di deskripsi proyek Aplikasi Mobile dan kolom templat *Sprint produk*; istilah "Usulan" untuk usulan agen; "Ubah paket" vs "Ubah metode bayar" (kata pertama kebetulan sama). Uji seret di daftar panjang gagal hanya di alat uji (menggulir di tengah gerakan); keempat gerakan diverifikasi di viewport tinggi.

## A — Audit prototipe v13

| ID | Temuan | Tingkat | Keputusan / perbaikan | Rujukan |
|---|---|---|---|---|
| A-01 | Avatar Yacobus, tetapi Tugas saya berisi tugas Sari dan Kotak masuk menulis "…kepada Anda" | Tinggi | Model persona nyata; data mengikuti orang yang masuk | v14 |
| A-02 | Tiga penghitung untuk satu kotak masuk (titik lonceng, badge Desk 4, Kotak masuk 3) | Tinggi | Lonceng topbar dihapus; badge Desk jadi satu sinyal dengan nama aksesibel yang merinci angkanya | D34 (usulan), PRD-10 v1.4 |
| A-03 | Judul topbar menduplikasi H1 | Sedang | Topbar menampilkan breadcrumb | UI-01 v2.4 |
| A-04 | Pengaturan punya navigasi dalam yang menduplikasi panel | Sedang | Dihapus | UI-01 v2.4 |
| A-05 | Kartu proyek berbeda di Semua proyek dan halaman space; tombol hitam "Buka proyek" di setiap kartu bersaing dengan aksi utama | Sedang | Satu komponen kartu; seluruh kartu bisa diklik | UI-01 v2.4, D32 |
| A-06 | Pil grup waktu di Tugas saya berwarna dan huruf kapital (biru "7 hari" bentrok dengan warna *Dikerjakan*) | Sedang | Kepala grup teks netral; hanya *Terlambat* merah, *Selesai* pil | UI-01 v2.4 |
| A-07 | Modal tugas menampilkan Lampiran (melanggar C-20) dan Checklist rilis 2 | Sedang | Lampiran dihapus; Checklist mengikuti rilisnya | C-20, PRD-06 v2.1 |
| A-08 | Label R2/R3 memenuhi tab | Rendah | Label rilis hanya di prototipe, mati secara default | D42 |
| A-09 | Istilah internal bocor ke UI ("Disimpan 1 tahun (PRD-13)", "Usulan · PRD-17", "(D16)", "rilis 2" di deskripsi space) | Sedang | Semua kode dokumen dihapus dari teks UI | UI-01 v2.4 |
| A-10 | "Profil organisasi" vs PRD "Umum"; menu Pengaturan › Notifikasi padahal rilis 2 | Rendah | Mengikuti PRD | PRD-02, PRD-12 v1.2.2 |
| A-11 | Otomatisasi tumpang tindih dengan pemicu Agen | Tinggi | Digabung ke Agen › Pemicu | D31, C-25, PRD-17 v0.2 |
| A-12 | Judul halaman 26/34 tidak ada di skala token DS | Rendah | 24/32 `type-heading-xl` | D35 (usulan), UI-01 v2.4 |

## B — QA prototipe v14 → v17.1

| ID | Temuan | Ditemukan di | Cara ditemukan | Perbaikan | Rujukan |
|---|---|---|---|---|---|
| B-01 | Dua tombol hitam identik saat daftar kosong (header + empty state) di 9 layar | v14 | Lint CTA | Empty state memegang aksi utama; tombol header disembunyikan | D32, UI-01 v2.4 |
| B-02 | Merah solid di pintu masuk penghapusan (Zona berbahaya, Tutup akun) | v14 | Lint CTA | `destructive-outline`; merah solid hanya konfirmasi akhir | D32 |
| B-03 | Placeholder "Contoh: …" di judul, deskripsi, komentar, dan dialog | v15 | Tinjauan PO | Dihapus; format pindah ke helper text | D33 |
| B-04 | Bagikan diulang di ⋯ proyek dan space; *Proyek baru di sini* diulang di ⋯ header space | v15 | Tinjauan PO → lint duplikasi | Satu aksi, satu tempat; di < 768 px outline pindah ke ⋯ | D32 |
| B-05 | "Kelola formulir" ghost, aksi kedua lain outline | v15 | Tinjauan PO | Outline | UI-01 v2.4 |
| B-06 | Urutan badge header proyek: akses sebelum status | v15 | Tinjauan PO | Status → akses → Akses admin | UI-01 v2.4 |
| B-07 | Angka tab Daftar/Papan menghitung subtugas dan papan lain (Papan 5, kartu 3) | v15 | Pengukuran saat QA v16 | Hitung tugas utama di papan aktif; diverifikasi sama dengan kartu di 4 proyek | PRD-06 v2.1 §6.13, TECH-01 v1.3 §4.1 |
| B-08 | Seluruh aplikasi bergulir (rail, panel, topbar ikut naik); SaveBar dan toolbar Doc tidak pernah menempel | v14 → v17 | Tinjauan tangkapan layar | Baris grid shell dibatasi; lint tata letak baru terbukti menangkap v16 dan lolos di v17 | UI-01 v2.4 "Aturan gulir shell" |
| B-09 | Garis putus-putus saat menyeret ke header grup tidak pernah tampil (`box-shadow` tidak bisa putus-putus) | v16 | Penyelarasan dengan DS 6.4 | `outline` 1,5 px dashed | UI-01 v2.4 |
| B-10 | Ikon status mengecil ke 21 px di baris berjudul panjang; posisi nama bergeser antarbaris | v16 | Pengukuran | Elemen di depan nama tidak boleh mengecil | UI-01 v2.4 |
| B-11 | Label kolom "Nama" meleset 15–38 px dari teks nama di tiga jenis daftar | ≤ v16 | Pengukuran | Label diratakan ke teks nama; tetap benar setelah buka-tutup grup dan ubah ukuran jendela | UI-01 v2.4 |
| B-12 | Toast di kanan bawah menutupi tombol Simpan di SaveBar dan footer dialog | v15 | Uji interaksi (klik gagal) | Toast kiri bawah, maks. 3 | UI-01 v2.4, DS 6.4 `Toaster position` |
| B-13 | Teks status merah/oranye/hijau hampir putih di mode gelap (token `-fg` untuk latar status) | v14 | Tinjauan tangkapan layar gelap | `*-on-surface` | D37, DS 6.4 |
| B-14 | Berpindah halaman tidak menutup dialog yang terbuka | v15 | Tinjauan tangkapan layar | Navigasi menutup dialog tanpa perubahan | — |
| B-15 | Toast dibatasi 2, DS menetapkan 3 | v16 | Penyelarasan dengan DS 6.4 | 3 | UI-01 v2.4 |
| B-16 | Lima nilai berbeda dari spesifikasi DS 6.4: tebal judul Doc 700 (600), isi Doc 16/28 (16/24), Judul 2 18/28 (20/28), caret 20 px (24), ubin header radius 12 (14) | v16 | Penyelarasan dengan DS 6.4 | Disamakan | PRD-08 v1.1, UI-01 v2.4 |
| B-17 | Ikon pratinjau pemicu tertekan ke 26 px | v17 | Pengukuran | Tidak boleh mengecil (32 px) | PRD-17 v0.2, UI-01 v2.4 |
| B-18 | Tombol Batal/Simpan di SaveBar aktif walau belum ada perubahan | v16 | Penyelarasan dengan DS 6.4 | Nonaktif sampai ada perubahan; status "Perubahan belum disimpan" | UI-01 v2.4 |
| B-19 | Ctrl / membuka dialog pintasan saat mengetik di editor Doc | v17 | Pencocokan dengan PRD-18 | Pintasan tidak aktif di kolom teks dan editor | PRD-18 v1.1, UI-01 v2.4 |
| B-20 | Badge Desk menghitung permintaan lewat SLA milik pemohon sendiri | v17 | Pencocokan AC PRD-10 | Hanya yang bisa ditindaklanjuti; panel *SLA perlu perhatian* memakai aturan yang sama | D36, PRD-10 v1.4 |
| B-21 | File `.markdown` ditolak padahal label menulis "Markdown (.md, .markdown)" | v17 | Uji kasus tepi | Ekstensi dan `accept` diselaraskan | D40, PRD-08 v1.1 |
| B-22 | "Tutup akun" mengeluarkan pengguna dari semua organisasi; PRD-12 §5.4 dan PRD-13 §6.3 mewajibkan penghapusan diblokir selama masih menjadi anggota | v15 | Pencocokan dengan PRD-12 | *Hapus akun* dinonaktifkan dengan alasan + tombol Keluar per organisasi; Owner tunggal harus alihkan kepemilikan | PRD-12 v1.2.2 |
| B-23 | Panel Panduan: kartu akordeon saling menempel dengan tepi ganda; jarak di luar kelipatan 4 | v14 | Laporan PO (tangkapan layar) | Satu grup bertepi; grid chip 3 kolom; spasi 4-pt | PRD-18 v1.1 |
| B-24 | Impor timeline: `2026-02-31` diterima sebagai 3 Maret; baris error menampilkan tanggal yang sudah diubah, bukan tulisan pengguna | v17 | Uji kasus tepi (US-22 + tambahan) | Validasi tanggal kalender di semua format; pratinjau menampilkan teks asli | D40, UI-01 v2.4, PRD-06 v2.1 §6.11 |
| B-25 | Doc baru menyimpan placeholder ("Doc tanpa judul", "Mulai menulis di sini") sebagai isi, dan butuh mode Edit | v14 | Tinjauan PO | Selalu bisa diedit, autosave, kosong tanpa placeholder | D39, PRD-08 v1.1 |
| B-26 | Label "Impor .md" / "Impor dari .md" mengunci tombol pada satu format | v15 | Tinjauan PO | Label umum **Impor**; format di dialog | D40 |

## Terbuka

| Item | Status | Pemilik |
|---|---|---|
| D34 lonceng, D35 skala judul, D36 isi badge Desk, D38 rilis subtugas, D43 permukaan tanpa PRD | Menunggu keputusan PO (PRD-00 §8) | PO |
| Garis indikator 1,5 px tampil 1 px di layar 1× (pembulatan browser); 1,5 px di layar 2× | Diterima, tidak diperbaiki | Desain |
| Pembacaan pembaca layar (VoiceOver/NVDA) | Belum dijalankan; masuk checklist rilis | QA |
