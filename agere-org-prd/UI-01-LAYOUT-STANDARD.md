# UI-01 — Standar layout default agere (v2.11, 30 Sep 2026)

Keputusan: semua aplikasi agere memakai **navigasi ganda** (rail + panel kontekstual, bagian "Navigasi ganda") dengan blok konten inset dan komponen Agere DS 6.4; brand hitam dan logo resmi agere. Light mode (Terang) adalah tema default (PRD-12 v1.2). Dark mode tersedia dan bisa dipilih pengguna.

> **v2.11 (30 Sep):** (1) **Keadaan kosong tidak mengulang aksi header** — bila header sudah memuat aksinya (mis. Semua Doc: Impor · Doc baru), keadaan kosong hanya menjelaskan dan menunjuk ke sana; satu tombol default per layar tetap berlaku. (2) Lint baru: **aksi tingkat halaman** (Undang, Bagikan, Tugas baru, Proyek baru, Space baru, Doc baru, Impor, Undang anggota, Formulir baru, Pemicu baru, Channel baru, Tim baru) tampil paling banyak **sekali** per layar; tumpukan avatar akses di header proyek adalah indikator, bukan tombol kedua. (3) Chat: Undang hanya di header channel (PRD-14 v1.5.1).
> **v2.10 (29 Sep):** **Chat** — lampiran, reaksi, edit di tempat, undang, DM dari nama (D48; spesifikasi di "Chat (v2.10)"). Dua aturan tata letak umum dari QA: **log yang menempel ke bawah memakai kolom flex + `margin-top:auto`**, bukan grid `align-content:end` (isi yang meluap tidak bisa dijangkau); **bilah aksi melayang tetap di dalam batas barisnya** (tidak terpotong oleh wadah yang bisa digulir).
> **v2.9 (29 Sep):** pratinjau Doc proyek menjadi **slide-out modal** (menggantikan panel samping v2.8). Aturan global baru: **fokus terkunci di dalam modal** (semua dialog, detail tugas, ⌘K, lembar geser); QA v18.3 menemukan dialog lama yang bocor.
> **v2.8 (29 Sep):** tab **Doc** proyek: daftar bersih tanpa tabel + **panel pratinjau** (Edit · Bagikan · tutup), D47 — spesifikasi di "Doc di proyek (v2.8)".
> **v2.7 (29 Sep):** **Tanpa "Semua proyek"** (D46): rail › Space membuka space terakhir yang dibuka; panel Space = cari · Favorit · Semua space; breadcrumb mulai dari space. **Kartu proyek minimal**: ubin 48 px, nama, deskripsi 2 baris, chip pengecualian saja (spesifikasi di bawah "Space & proyek").
> **v2.6 (29 Sep):** keputusan desain Agen **DD-1…DD-6** oleh UI/UX Designer, diterapkan di prototipe v18, dan spesifikasi token lima komponen usulan Agere DS 6.5 (bagian "Agen (v2.6)"). Prototipe v18 kini dua bahasa (English default).
> **v2.5 (28 Sep):** **Bahasa & format** (D45: English default + Bahasa Indonesia; aturan copy, panjang teks, format tanggal/angka per bahasa; tata bahasa tanggal impor menerima nama bulan English dan Indonesia). **Agen (PRD-17 v1.0, D44):** batasan desain untuk permukaan agent; penempatan dan visual ditentukan UI/UX Designer (DD-1…DD-6).
> **v2.4 (28 Sep):** diselaraskan dengan prototipe v17.1 dan **Agere DS 6.4**. Baru: **Aksi & CTA** (D32: hierarki varian, ukuran per konteks, aksi header, satu aksi satu tempat), **Tanpa placeholder** (D33), **Toast & simpan** (SaveBar, SaveStatus, toast kiri bawah), **Daftar bertingkat** (subtugas + seret, D28a), **Editor Doc** (D39), **Agen › Pemicu** (D31; Kelola › Otomatisasi dihapus), **Tata bahasa tanggal impor** (D40), **Pintasan & halaman umum** (Ctrl /, hasil pencarian, 404), **Aturan gulir shell** (QA-02 B-08), teks status `*-on-surface` (D37). Angka standar diperbarui ke nilai terukur di prototipe (tabel "Angka standar v2.4"); judul halaman 24/32 (D35). Modal detail tugas v2 (D41).
> **v2.3 (27 Sep):** dokumen diselaraskan dengan set PRD 27 Sep (Index v1.9, PRD-00 v1.2.6, PRD-06 v2.0, PRD-10 v1.3, PRD-18). Urutan rail = **Desk · Space · Chat · Doc · Agen** (File ditahan, D22); panel Space tanpa Ringkasan; baris tautan publik di Bagikan disembunyikan sampai D27; warna brand di aturan Desk dan hirarki = hitam. Bagian lama yang tidak berlaku lagi diberi tanda ⛔ di judulnya; bagian bertanda ⛔ hanya arsip.
> **v2.2 (27 Sep):** Brand kembali **hitam** (`brand-default` #171717; gelap #E5E5E5) — oranye v2.1 dibatalkan. Logo resmi **agere** (app icon: simbol putih di tile #111111, sudut = tile ÷ φ³; favicon sama) di puncak rail, geometri dari `Logo` Agere DS. Menu **File ditahan** (keluar dari rail dan Panduan; rute tetap ada untuk rilis berikutnya). Panel Space tanpa **Ringkasan**; beranda Space = **Semua proyek**: tab filter per space + kartu dengan penanda space pemilik (chip ikon + nama, klik membuka space). Edit space: **unggah ikon sendiri** (PNG/SVG/JPG/WebP, persegi, maks. 1 MB) atau pilih ikon bawaan.
> **v2.1 (27 Sep, warna oranye dibatalkan v2.2):** Brand **oranye** (`brand-default` #EA580C / HSL 20.5 90% 48%; gelap #F97316) untuk aksi utama, tab aktif, fokus, dan titik belum dibaca. State terpilih di navigasi = **abu-abu** (`bg-emphasis`). **Daftar gaya ClickUp** jadi pola tunggal untuk Daftar proyek, Permintaan, dan Tugas saya. **Desk jadi menu pertama** di rail dan halaman awal setelah masuk (dipakai tiap hari). Space bisa diedit; Doc punya folder. Kotak masuk, Permintaan (tanpa metrik), dan Tugas saya disederhanakan. Tab & filter halaman = Tabs varian garis bawah + angka. Dropdown = Select DS (bukan dropdown bawaan browser).
> **v2.0 (27 Sep):** **Navigasi ganda** menggantikan sidebar satu kolom: *rail* 68 px (Space, Desk, Chat, Doc, File, Agen · Panduan, Kelola, akun) + *panel kontekstual* 256 px yang isinya berganti per bagian. Tambahan: **Panduan** (cara pakai per menu + alur kerja per peran), **Agen** (skill agen yang bisa disesuaikan, usulan PRD-17), dialog **Bagikan** gaya ClickUp, komponen memakai kelas **Agere DS 6.3** (`components/bundle.css`), scrollbar kembali ke pola **ScrollArea DS**. Prototipe acuan: "Prototipe agere/org v13" (versi 14 artefak).
> **v1.9 (27 Sep, sidebar digantikan v2.0):** **Space menjadi wadah proyek** (PRD-00 D18, Index C-18; menggantikan v1.8). Sidebar: grup **Space** (daftar space, proyek tampil saat space dibuka), **Desk** (Kotak masuk, Permintaan, Tugas saya), **Chat**, **Doc**, **File**, **Kelola** (Organisasi ›, Pengaturan ›). Halaman Space = judul + deskripsi + pencarian + chip filter + grid kartu proyek. Tab proyek: Daftar · Papan · Kalender · Timeline · Doc · Channel · + Tampilan. Prototipe acuan: "Prototipe agere/org v12" versi 3.
> **v1.8 (26 Sep, digantikan v1.9):** nama tampilan aplikasi **Project → Space** (PRD-00 D17, Index C-17). Id internal `space`, event `space.*`, dan tabel tidak berubah; satuan isinya tetap "proyek", "papan", "tugas". URL pindah dari `/{slug}/projects/…` ke `/{slug}/space/…`.
> **v1.7 (26 Sep):** **Lead dihapus** (PRD-00 D16, Index C-16): item NavMain Lead, stepper Tindak lanjut, kartu deal, dan papan Menang/Kalah dihapus. Dua aturan dari Lead dipertahankan sebagai aturan generik: input uang IDR (§Form, §Angka) dan menu keyboard "Pindahkan ke…" (§Papan).
> **v1.6 (26 Sep):** daftar kerja berurutan (Tugas saya, Notifikasi) memakai pola **Stepper vertikal dengan tombol aksi** (Agere DS `Stepper`, `orientation="vertical"`); tabel entitas tetap tabel.
> **v1.5 (26 Sep):** ruang proyek ala ClickUp (header + tab), pohon sidebar **Proyek** dan **Favorit**, item **Chat** (rilis 2), aturan halaman Ringkasan tanpa aksi header, dan aturan global hasil QA v10: state menang atas angka, guard form, validasi sekaligus, fokus kembali, tabel menjadi kartu di HP, judul tab, skip link, format angka (QA-01).
> **v1.4.1 (26 Sep):** warna chart mengikuti Agere DS 6.3 (palet chart diperbaiki di DS).
> **v1.4:** semua halaman memenuhi lebar area konten (tanpa batas lebar), dan detail tugas menjadi modal besar dua panel.
> **v1.3:** Space diganti nama menjadi **Project** (id internal `space` tetap, PRD-06 §6.5). Grup sidebar "Pengaturan" diganti **Kelola** agar sesuai aturan PRD bahwa "Pengaturan" khusus pribadi. Scrollbar kini berupa overlay (sebelumnya CSS). Ada aturan baru untuk checkbox/radio, fokus awal dialog, dan kartu proyek.
> **v1.2:** komponen Select custom, bingkai halaman, Pengaturan akun di dalam shell yang sama.

## ⛔ Komposisi (v1.x — digantikan "Navigasi ganda" dan "Hirarki & konsistensi"; komponen target kini `rail-nav`, `context-panel`, `guide-panel`, `cu-list`, TECH-01 v1.2 §8)
| File | Isi | Aturan |
|---|---|---|
| `components/app-sidebar.tsx` | **SidebarHeader**: org switcher. **SidebarContent**: *Aplikasi* (NavMain), *Favorit* (bila ada), *Proyek* (NavProjects bertingkat, tombol +), *Kelola* (Organisasi, Pengaturan), NavSecondary (Bantuan, Kirim masukan). **SidebarFooter**: NavUser. | Variant `inset`, `collapsible="icon"` (Ctrl/Cmd+B). Di HP menjadi sheet. Grup yang berisi halaman aktif terbuka otomatis. |
| `components/site-header.tsx` | SidebarTrigger · pemisah · judul halaman · pencarian ⌘K · tombol tema · notifikasi (titik merah) | Tinggi 60px (52px di HP). |
| **dashboard block** | `SectionCards` → baris chart `ChartAreaInteractive` (2/3) + `ChartPieDonut` (1/3) → `DataTable` | Beranda setiap aplikasi (halaman **Ringkasan**). **Header halaman Ringkasan tidak punya tombol aksi primer**: pembuatan item dilakukan di tempat item itu hidup (proyek, papan, dsb.); tombol ajakan hanya muncul di empty state. `h1` menyebut aplikasinya: "Ringkasan Space". **Space › Ringkasan rilis 1 tanpa area chart** (butuh data historis, rilis 2, PRD-06 §6.6): donut ditampilkan penuh di baris chart. |
| **ruang proyek** (`project-space`) | Header proyek (badge huruf, nama, ☆, badge akses, chip status, avatar, Bagikan, + Tugas baru, ⋯) → `Tabs` (Channel [rilis 2] · Ringkasan · Doc tersemat [rilis 3] · Papan · Daftar · Tenggat [rilis 2] · + Tampilan [rilis 2]) → panel tab | Pola ClickUp, visual Agere DS (PRD-06 §6.7). Tab Channel mengisi tinggi viewport (log bergulir, composer menempel di bawah). Tab mengikuti pola ARIA tabs (←/→, Home/End). |

## Daftar gaya ClickUp (v2.1, pola tunggal)
- **Grup** per status (Daftar proyek, Permintaan) atau per tenggat (Tugas saya: Terlambat · Hari ini · 7 hari ke depan · Nanti · Tanpa tenggat · Selesai). Kepala grup: segitiga buka-tutup + **pil status** (v2.4: latar tint `task-*-bg`, teks `task-*-fg`, **sentence case**, ikon; bukan warna solid huruf kapital) + jumlah + tombol + (muncul saat hover). Grup tenggat di Tugas saya berupa **teks netral**, hanya *Terlambat* merah (`error-on-surface` + ikon) dan *Selesai* memakai pil (QA-02 A-06). Grup Selesai tertutup secara default.
- **Kepala kolom** diulang per grup: Nama · Penanggung jawab · Tenggat/SLA · Prioritas (Permintaan: Pemohon · Penanggung jawab · SLA · Prioritas; Tugas saya: Proyek · Tenggat/SLA · Prioritas).
- **Baris 44 px:** pegangan seret + checkbox (muncul saat hover/terpilih) · ikon status (klik = ganti status) · nama · aksi hover (**+ Tambah subtugas** bila D38 aktif, **Ganti nama**; *Label* menunggu D28b) · kolom · ⋯ (v2.4; rincian di "Daftar bertingkat"). Kolom kosong menampilkan ikon abu-abu (orang, kalender+, bendera) yang bisa diklik untuk mengisi.
- **Pilih banyak:** bar aksi hitam mengambang di bawah (Tandai selesai, Tugaskan, Batal).
- Baris akhir grup: "+ Tambah tugas". HP: hanya nama + satu kolom.

## Halaman Desk (v2.1)
- **Kotak masuk:** kolom baca 880 px (pengecualian dari lebar maks. 1240 px karena berupa daftar baca). Tab Semua · Belum dibaca · Untuk saya. Dikelompokkan Hari ini · Kemarin · Sebelumnya. Baris: titik `brand-default` (hitam) belum dibaca · avatar pelaku (atau ikon sistem) · kalimat · jenis + waktu. Aksi hover: Tandai dibaca, Arsipkan. Kosong = "Semua beres".
- **Permintaan:** tanpa kartu metrik. Judul + satu kalimat, aksi: Kelola formulir (Admin, **outline**, v2.4) + **Kirim permintaan** (utama). Tab Masuk ke tim saya · Permintaan saya → daftar ClickUp per status dengan SLA.
- **Tugas saya:** judul + ringkasan "n terbuka · n terlambat" + Tugas baru → daftar ClickUp per tenggat.

## Space & Doc (v2.1)
- **Edit space:** tombol Edit di header halaman space dan menu ⋯ di baris space pada panel (Edit, Proyek baru, Hapus). Dialog: nama, ikon (10 pilihan), deskripsi, akses. Space yang masih berisi proyek tidak bisa dihapus.
- **Folder Doc:** panel Doc = Semua Doc + pohon folder (buka-tutup, jumlah, ⋯: Doc baru di folder, Ganti nama, Hapus → isi pindah ke "Tanpa folder"). Doc dipindah lewat ⋯ › Pindahkan ke folder, atau diseret ke folder. Halaman **Semua Doc** = daftar gaya ClickUp per folder (Nama · Pemilik · Diperbarui). Halaman Doc diawali breadcrumb Doc › Folder › Doc.

## Hirarki & konsistensi (v2.1)
- Satu pola header: judul **24/32** (`type-heading-xl`, v2.4, D35) + satu kalimat abu-abu; kanan: maksimal dua aksi kedua (**outline**, v2.4) lalu **satu** aksi utama (`default`, hitam), lalu ⋯ — rincian di "Aksi & CTA (v2.4)".
- Satu aksi utama per layar. Tombol di kartu memakai hitam netral agar tidak bersaing dengan aksi utama halaman.
- Avatar di daftar netral (abu-abu); warna dipakai hanya untuk status, prioritas, dan brand.

## Navigasi ganda (v2.0)
**Kenapa dua lapis:** rail memberi peta aplikasi yang selalu terlihat (maks. 7 tujuan, bisa dihafal posisinya), panel memberi kedalaman bagian yang sedang dikerjakan. Saat panel ditutup (Ctrl+B) rail tetap ada, jadi navigasi tidak pernah hilang; ini perbaikan dibanding v1.9 yang menyembunyikan seluruh sidebar.
- **Rail (68 px):** logo agere (klik = pengalih organisasi) · **Desk · Space · Chat · Doc · Agen** · — · Panduan · Kelola · avatar akun (urutan menurut frekuensi pakai, D20; File ditahan, D22; Chat, Doc, Agen hanya tampil bila app-nya sudah rilis). Ikon 19 px + label 11 px di bawahnya (label disembunyikan bila tinggi layar < 760 px). Aktif = kapsul `bg-default` + bayangan elevasi 1. Badge merah hanya untuk Desk (notifikasi belum dibaca + permintaan lewat SLA) dan Chat (pesan belum dibaca). Pintasan **Alt+1…7** sesuai urutan.
- **Panel kontekstual (256 px):** judul bagian + aksi (+) + tombol **?** (buka Panduan bagian itu) → kotak saring → isi:
  - **Space:** ~~Semua proyek~~ (dihapus v2.7, D46), *Favorit*, *Semua space* (pohon space › proyek; proyek aktif menampilkan pintasan tampilan Daftar/Papan/Ringkasan/Kalender/Timeline/Doc/Channel).
  - **Desk:** Kotak masuk, Permintaan, Tugas saya, **Fokus hari ini** (tugas saya jatuh tempo hari ini/besok, maks. 4), **SLA perlu perhatian** (maks. 3).
  - **Chat:** Channel, Pesan langsung. **Doc:** per folder (+ buat dari .md). **Agen:** Semua skill, Bawaan agere, Kustom, **Pemicu** (v2.4, D31), lalu *Skill aktif*. **Kelola:** Organisasi — Umum*, Anggota, Tim, Akses*, Aplikasi*, Formulir*, Kalender kerja*, Audit*, Sampah (*khusus Owner/Admin, disembunyikan untuk Member); **tanpa Otomatisasi** (v2.4, digabung ke Agen › Pemicu, C-25); *Langganan* hanya ada di prototipe (D43) — dan Pengaturan pribadi — tetap satu pintu (C-07).
- **Panel ditutup:** arahkan kursor ke ikon rail → panel muncul mengambang (*peek*, jeda 180 ms), hilang saat kursor keluar. Klik ikon tetap berpindah halaman.
- **Monokrom:** ikon dan badge huruf proyek di navigasi tanpa warna; aktif = invers (`fg-emphasis` di atas `bg-default`).
- **HP (< 768 px):** rail + panel menjadi satu laci dari kiri lewat tombol menu.

## Panduan (v2.0)
- Panel kanan 372 px yang **mendorong** konten (tidak menutupi), agar pengguna bisa mengikuti langkah sambil bekerja. Buka dari rail, tombol **?** di panel, atau tombol `?` di keyboard; Esc menutup.
- Tab **Cara pakai:** chip per menu (Desk, Space, Proyek, Chat, Doc, Agen, Kelola; hanya menu yang aktif untuk pengguna, PRD-18), otomatis memilih menu yang sedang dibuka; tiap cara pakai berisi langkah bernomor + tombol **Tunjukkan di layar**.
- Tab **Alur kerja:** playbook per peran (Member, Penanggung jawab, Lead proyek, Admin) dengan alasan, durasi, langkah yang bisa dicentang, dan cincin progres.
- **Tunjukkan:** membuka layar tujuan lalu menyorot elemen (garis `brand-accent` + denyut 2×, 2,6 detik). Bila elemen tidak ada, sorot judul halaman.

## Agen & skill (v2.0, usulan PRD-17)
- Halaman **Skill agen**: kartu per skill (nama, `/perintah`, Bawaan/Kustom, sakelar aktif, pemicu, jumlah tindakan yang perlu konfirmasi, pemakaian) + template.
- Editor 6 bagian: Identitas · Pemicu (Manual / Otomatis dari event PRD-00B / Terjadwal hari kerja) · Instruksi (Markdown) · Data yang boleh dibaca · Tindakan yang boleh diusulkan · Berlaku di space. Kolom kanan: Pratinjau (Uji coba) + Riwayat versi.
- Prinsip terkunci: tindakan yang mengubah data selalu jadi usulan dengan **Terima/Tolak** dan tercatat di Audit; agen hanya melihat data yang bisa dilihat orang yang menjalankannya.

## Bagikan (v2.0, gaya ClickUp sederhana)
- Judul "Bagikan tampilan ini" + "Dibagikan sebagai satu tampilan · {proyek} · {tampilan}".
- Baris: **Tautan privat** + Salin tautan · (baris **Bagikan tautan ke siapa saja** disembunyikan sampai keputusan D27; PRD-04 v1.5 §8.1) · **Bagikan dengan**: baris organisasi (logo, nama, badge "Anggota organisasi", tumpukan avatar +N, sakelar; klik untuk melihat daftar anggota).
- Pengaturan per orang/tim pindah ke **Akses lanjutan** (dialog lama).

## ⛔ Isi sidebar (v1.9, digantikan "Navigasi ganda")
- **Header:** pengalih organisasi (organisasi lain + Buat organisasi saja; tidak memuat menu administrasi, satu pintu per C-07).
- **Space** (+ buat space): setiap space = ikon berwarna + nama + gembok bila Terbatas. Space yang sedang dibuka menampilkan proyeknya (badge huruf + nama).
- **Desk:** **Kotak masuk** (notifikasi saja; angka = belum dibaca), **Permintaan** (tab Masuk ke tim saya · Permintaan saya; angka = permintaan perlu ditangani; tombol Kelola formulir untuk Owner/Admin), dan **Tugas saya**. Rute: `/{slug}/desk/kotak-masuk`, `/{slug}/desk/permintaan`, `/{slug}/desk/tugas-saya`.
- **Chat** (rilis 2, + channel baru): subjudul "Channel" (channel per space dan channel mandiri) dan "Pesan langsung" (avatar bertumpuk untuk grup).
- **Doc** (rilis 3, + buat dari file .md): maks. 4 halaman terbaru.
- **File** (rilis 2, + unggah): "Semua file".
- **Kelola:** **Organisasi ›** (buka-tutup: Profil*, Anggota, Tim, Akses*, Aplikasi*, Formulir*, Otomatisasi*, Kalender kerja*, Audit*, Sampah; *khusus Owner/Admin) dan **Pengaturan ›** (Profil, Keamanan, Notifikasi, Preferensi, Akun & data; pribadi). Ikon gedung dan slider; chevron berputar 90° saat terbuka (`aria-expanded`). Grup terbuka otomatis bila halaman aktif ada di dalamnya.
- **Footer:** profil pengguna (menu: Pengaturan, tema) + tombol Keluar.
- Rute: `/{slug}/s/{space}` (halaman space), `/{slug}/s/{space}/{proyek}/{tampilan}`, `/{slug}/desk/kotak-masuk`, `/{slug}/desk/tugas-saya`, `/{slug}/chat/…`, `/{slug}/doc/{id}`, `/{slug}/file`.
- Badge angka selalu punya nama aksesibel dengan konteks ("Kotak masuk, 8 perlu perhatian").

## ⛔ Halaman Space (v1.9, digantikan "Space & Doc (v2.1)" dan PRD-06 v2.0 §6.6)
- Kepala halaman: label "Space" (`fg-subtle`), judul display 36/44 bold, deskripsi 16/26 maks. 68 karakter per baris, baris meta (akses · jumlah proyek · jumlah formulir), aksi Bagikan + Proyek baru. Garis pemisah di bawahnya.
- Pencarian proyek (tinggi 40 px, maks. 560 px) lalu chip filter (tinggi 40 px, `radius-full`, angka `fg-subtle`; chip aktif = `brand-default`/`brand-fg`, `aria-pressed`): Semua · Favorit · Sesuai rencana · Berisiko · Selesai.
- Grid kartu proyek `repeat(auto-fill, minmax(300px, 1fr))`, gap 20 px. Kartu: ikon 44 px di kiri atas, badge akses + status di kanan atas, judul `heading-md`, subjudul (pemimpin · terbuka · terlambat), deskripsi maks. 3 baris, tautan "Detail →" di bawah.
- Di bawah grid: tabel formulir yang masuk ke space ini.

## Doc berbasis Markdown (v1.9, rilis 3)
- File `.md`/`.markdown` (maks. 1 MB) yang dipilih lewat "Impor .md" atau diseret ke halaman Doc (dibaca di browser; tidak disimpan sebagai record File, PRD-07 ditahan) otomatis menjadi Doc hanya-baca dengan badge "Dibaca otomatis dari {file}". Mengunggah ulang file dengan nama yang sama memperbarui Doc yang sama.
- Menu **Ekspor**: PDF, Word (.docx), HTML, Markdown (.md), lewat alur unduhan yang meminta konfirmasi pengguna.

## Timeline dari file .md (v1.9, rilis 2)
- Tab Timeline punya **Impor dari .md** (klik atau seret file, maks. 512 KB), **Unduh contoh format**, dan contoh minggu relatif.
- Format yang dibaca: tabel pertama di file (kolom dikenali dari judul: Tugas/Fase, Mulai, Selesai/Tenggat, Minggu, PJ, Status; kolom lain masuk deskripsi) atau daftar `Judul (2026-10-05 → 2026-10-09) @nama`. Tanggal: `2026-10-05`, `05/10/2026`, `5 Okt 2026`. Minggu relatif `W1–W6` butuh tanggal kick-off (W1 = Senin kick-off, setiap minggu Senin–Jumat).
- Selalu lewat **pratinjau**: baris valid, peringatan (PJ tidak dikenal atau lebih dari satu kecocokan → dibuat tanpa PJ; status tidak dikenal → Baru), dan baris yang dilewati beserta alasannya (tanggal tidak dikenali, selesai sebelum mulai). Tidak ada tugas dibuat sebelum pengguna menekan "Buat N tugas".
- Impor ulang file dengan nama yang sama **menggantikan** tugas hasil impor sebelumnya dari file itu saja ("Ganti dengan N tugas"); tugas lain di proyek tidak berubah. File sumber tersimpan di File dengan aksi "Buka timeline".
- Rentang timeline menyesuaikan isi (min. 28 hari, maks. 26 minggu), dimulai Senin.

## Bingkai halaman (wajib, semua layar)
- **Auto layout penuh:** semua halaman memenuhi lebar area konten sampai tepi kanan (tanpa `max-width`), dengan tepi kiri yang sama. Lebar isi mengikuti "Ritme ruang" (maks. 1240 px, form 1080 px, daftar baca 880 px); ketiganya rata kiri terhadap tepi yang sama bila layar lebih sempit.
- Skala jarak: 4 · 8 · 12 · 16 · 24 · 32. Jarak antarblok halaman 24px. Isi kartu `card-pad` 24px dengan jarak antarelemen 16px.
- **Header seksi kartu** (`.sec-head`): judul `h-md` di kiri, aksi di kanan, satu baris, tinggi minimal 32px.
- **Baris daftar di dalam kartu** (`.li`): kiri kontrol opsional (checkbox), tengah judul 14/500 + subjudul 12, kanan chip atau aksi (`flex:none`). Pemisah berupa garis atas, tanpa garis sebelum baris pertama.
- **Kartu kanban (tugas)**: judul (maks. 2 baris), subjudul, prioritas, footer (avatar dan tanggal) dengan garis pemisah.
- **Kartu proyek (v2.7, D46)**: padding 24, gap 8, tinggi min. 196 px; baris 1 = ubin proyek 48 px `radius-xl` (huruf 16 px) + bintang Favorit di kanan (muncul saat hover/fokus atau bila sudah favorit; selalu tampil di layar sentuh); nama 16/24 600 `fg-emphasis` (tombol yang membuka seluruh kartu); deskripsi 14/20 `fg-subtle`, maks. 2 baris (`Belum ada deskripsi.` bila kosong); **chip pengecualian saja**: tinggi 24, padding 0 10, `radius-full`, `bg-subtle` / `fg-subtle`, 12/16 500, jarak 8 — *Berisiko* (titik `attention-solid`), *Keluar jalur* (titik `error-solid`), *Selesai* (ikon centang), *Terbatas* (ikon gembok + tooltip akses). Proyek sehat dan terbuka tanpa chip. Tidak ada progres, jumlah tugas, lead, target, atau badge akses di kartu. *(Spesifikasi kartu v2.0–v2.6 tidak berlaku.)*
- Chip, badge, tanggal jatuh tempo, dan tombol tidak pernah terbungkus ke baris baru atau terjepit (`white-space:nowrap; flex-shrink:0`).
- Tombol berbentuk tautan dan tombol di dalam tabel selalu rata kiri.

## State data menang atas angka (QA C3)
- Setiap layar punya lima state (ideal, kosong, memuat, error, sebagian). **Header, subjudul angka, counter tab, dan panel samping ikut state yang sama dengan konten.** Kosong → angka 0 atau disembunyikan; Memuat → skeleton, angka disembunyikan; Error → satu pola saja: *sebagian* (banner + data yang berhasil) **atau** *total* (halaman error), tidak keduanya.
- Skeleton mengikuti layout akhir (kartu KPI, chart, tabel), bukan bar selebar layar.
- Anggota tidak punya empty state (Owner selalu ada): bila hanya ada satu anggota, tampilkan ajakan "Undang anggota".

## Form di dialog (QA C4, C10, AX1)
- **Guard perubahan global:** dialog berisi form yang diubah lalu ditutup (Esc, ✕, klik luar) menampilkan bar "Perubahan belum disimpan. Buang perubahan ini?" dengan **Lanjut edit** / **Buang perubahan**. Isian tidak pernah hilang karena render ulang.
- **Validasi sekaligus:** submit menampilkan semua error field bersamaan dan memfokuskan field pertama yang salah.
- **Fokus kembali ke pemicu** setelah dialog ditutup; bila pemicunya item menu yang sudah hilang, ke tombol pembuka menunya.
- Placeholder generik dengan awalan "Contoh:", tidak pernah menyerupai data asli.
- **Input uang (generik, dipindah dari PRD-05):** nilai disimpan dalam IDR (mata uang organisasi); titik ribuan otomatis saat mengetik, pratinjau ringkas di help ("Rp85 jt"); tampilan penuh lewat `Intl.NumberFormat("id-ID")` ("Rp150.000"). Berlaku untuk setiap field mata uang, termasuk field kustom kelak.

## Angka (QA V2, V3)
- Ringkas (jt/M) di kartu, chart, dan ringkasan header; penuh di detail, tabel, dan input.
- Perubahan 0% memakai ikon netral (—) tanpa tanda +; naik/turun selalu disertai kata ("membaik"/"memburuk") untuk pembaca layar.

## ⛔ Daftar kerja berurutan: Stepper vertikal (v1.6 — Tugas saya dan Kotak masuk kini memakai daftar gaya ClickUp dan desain Kotak masuk v2.1; Stepper tetap boleh untuk wizard/langkah linear)

Halaman yang isinya **antrean kerja berurutan waktu** tampil sebagai satu Stepper vertikal (Agere DS `Stepper`, `orientation="vertical"`) di dalam satu kartu. Setiap item adalah satu langkah dengan satu tombol aksi di kanan.

| Halaman | Urutan | Status titik | Tombol aksi |
|---|---|---|---|
| Space › Tugas saya | Terlambat → Hari ini → 7 hari ke depan → Nanti → Tanpa tenggat; di dalam grup menurut tenggat | Terlambat = titik error dengan ikon peringatan; langkah berikutnya = cincin brand (`aria-current="step"`); lainnya = nomor netral | **Selesai** (outline, sm). Nonaktif bila hanya bisa lihat. Undo lewat toast. |
| Notifikasi (halaman penuh) | Terbaru di atas | Belum dibaca = cincin brand + ikon aplikasi; sudah dibaca = titik redup | **Buka** (outline bila belum dibaca, ghost bila sudah) |

Spesifikasi (token Agere DS):
- Titik 28 × 28 px, `radius-full`, border 1 px, angka 12/16 medium tabular. Jarak titik ke teks 12 px; padding langkah 12 px vertikal.
- Garis penghubung 1 px di sumbu titik (x = 13,5 px), `border-default`.
- Label grup (overline) berada **di atas garis yang sama**, sejajar kolom teks (inset 40 px), sehingga satu halaman = satu stepper yang utuh; penomoran berlanjut lintas grup. Grup kosong disembunyikan.
- Baris langkah: judul (medium) + subjudul caption (proyek, "via Tim"), meta (prioritas, tenggat), tombol aksi. Di < 640 px meta dan tombol turun ke baris kedua; tidak ada scroll horizontal.
- Aksesibilitas: `ol` per grup di bawah `h2` grup; status langkah dalam teks sr-only ("terlambat", "berikutnya", "belum dimulai", "belum dibaca"); hanya satu `aria-current="step"` per halaman; nama aksesibel tombol memuat teks yang terlihat ("Tandai Riset harga selesai").
- State: memuat/galat/kosong mengikuti aturan state global (state menang atas angka).

**Tidak** dipakai untuk tabel entitas (Anggota, Tim, File, Doc, Proyek, Audit, Sampah) dan untuk papan: isinya tidak linear, dan panduan DS `Stepper` melarang Stepper untuk konten non-linear. Wizard multi-langkah (onboarding, buat organisasi) tetap memakai Stepper horizontal dengan tombol Kembali/Lanjut.

## Papan (QA C6, A7)
- Kolom mengisi lebar konten (grid, min 200 px per kolom) sehingga terbaca tanpa scroll horizontal di 1280 px ke atas. [Open: perilaku bila jumlah kolom tidak muat, diputuskan di PRD-06.]
- Setiap kartu yang bisa dipindah punya tombol "Pindahkan ke…" (keyboard) selain drag.
- *(v1.7: aturan zona jatuh tetap Menang/Kalah dihapus bersama Lead.)*

## HP (< 768 px) (QA C7, C8)
- Tidak ada scroll horizontal dokumen di 390 px. Tabel data menjadi **kartu** (label kolom di atas nilai). KPI satu kolom di ≤ 480 px. Aksi header membungkus ke baris baru.
- Aksi per baris pesan/kartu yang biasanya muncul saat hover selalu tersedia lewat tombol ⋯.

## Shell & aksesibilitas (QA AX2–AX5, A6)
- Tautan "Lewati ke konten" di awal halaman; `#content` bisa menerima fokus.
- `document.title` = "{halaman} · {organisasi} · agere/org"; perpindahan halaman diumumkan lewat region live.
- Layar auth dibungkus landmark `main`.
- Toast tanpa aksi ditutup saat pindah halaman; toast dengan "Urungkan" bertahan sampai waktunya (8 detik).
- Tooltip chart hanya visual (`aria-hidden`); datanya tersedia lewat "Lihat sebagai tabel".
- Teks kecil (≤ 12 px) selalu ≥ 4,5:1: label prioritas "Rendah" memakai `fg-subtle`, bukan `priority-low` sebagai warna teks (QA A2).
- Area sentuh checkbox dan kontrol kecil ≥ 24 × 24 px, 44 × 44 px di HP lewat label/padding (QA A8).

## Chat (rilis 2, PRD-14)
- Halaman Chat memakai pola dua panel blok Inbox DS (daftar 272 px + percakapan); satu panel dengan "Kembali" di < 768 px.
- Composer menempel di bawah; log `role="log"`; banner "Ikuti" di atas composer untuk channel yang belum diikuti.

## ⛔ Modal detail item (v1.4–v2.3, digantikan "Modal detail tugas v2 (v2.4)")
- Dipakai untuk detail tugas (PRD-06 §8.1) dan menjadi pola untuk detail item lain di rilis berikutnya.
- Ukuran maks. 1440 × 900 px, margin 24px; layar penuh di HP.
- Bar atas 56px: navigasi sebelumnya/berikutnya · breadcrumb · meta (Dibuat …) · Bagikan · menu ⋯ · tutup.
- Panel kiri: chip status, judul besar yang bisa diedit langsung, properti 2 kolom (label ikon 160px + kontrol tanpa bingkai yang muncul saat hover), deskripsi (bagian Lampiran tidak tampil selama File ditahan, C-20), tombol simpan menempel di bawah.
- Panel kanan 400px (`--bg-subtle`): judul "Aktivitas", feed (terbaru di bawah), composer komentar menempel di bawah.

## Kontrol form
- **Select**: pola shadcn/Radix Select. Listbox di portal body (`position:fixed`), membuka ke atas bila ruang kurang, optgroup dengan label, centang pada pilihan aktif. Keyboard: ↑/↓, Home/End, PageUp/PageDown, Enter/Spasi, Esc (hanya menutup listbox), Tab, ketik huruf. Fokus tetap di trigger (`aria-activedescendant`). Next.js: `@/components/ui/select`.
- **Checkbox**: 16px, sudut 4px, tercentang = `--brand-default` dengan ikon centang; mendukung status sebagian (`indeterminate`). Next.js: `@/components/ui/checkbox`.
- **Radio**: 16px bulat, titik 8px `--brand-default`. **Radio card** terpilih: garis `--brand-default` 1px + latar `--bg-subtle` (bukan bingkai hitam tebal). Next.js: `@/components/ui/radio-group`.
- **Dialog**: fokus awal = `[autofocus]` → input/textarea pertama di body → Select pertama → tombol primer. Tidak pernah ke tombol ✕. Tombol ✕ = ikon polos (ghost), tanpa bingkai.
- Legend fieldset sejajar dengan label field lain (tanpa padding bawaan browser).

## Scrollbar (ScrollArea DS 6.3, v2.0)
- Area gulir utama (konten, panel kontekstual, Panduan) memakai pola **ScrollArea** Agere DS: scrollbar overlay 10 px (`w-2.5`, `p-px`), thumb `rounded-full bg-border`, muncul saat menggulir atau kursor di atas area, memudar setelah 0,9 detik; thumb bisa diseret.
- Scrollbar native disembunyikan hanya di area itu (`scrollbar-width:none`); gulir tetap native (wheel, touch, keyboard).
- Area lain (tabel lebar, papan horizontal, dialog) tetap scrollbar tipis native tanpa tombol panah sebagai cadangan.
- Menggantikan aturan CSS-only v1.9, yang di Chromium Windows masih bisa menampilkan tombol panah (catatan DS 6.3).

## Komponen Agere DS 6.4 (v2.4; v2.0 menyebut 6.3)
- Tombol, badge, input/select/textarea, kartu, dialog, menu, tab segmen/garis bawah, sakelar, dan tabel memakai resep kelas dari `components/bundle.js` v6.3.0 (mis. tombol outline `border border-border bg-background shadow-xs hover:bg-accent`). Di Next.js dipakai langsung sebagai komponen `Button`, `Badge`, `Input`, `Card`, `Dialog`, `DropdownMenu`, `Tabs`, `Switch`, `Table`, `ScrollArea`.
- Kartu memakai resep visual Card (`rounded-xl border bg-card shadow-sm`, interaktif: `hover:border-border-strong hover:shadow-md`); tata letak isi kartu tetap milik layar.

## Ritme ruang (v2.0, "bersih dan lapang")
- Konten: padding **32/40/56 px** (atas/samping/bawah), lebar maks. **1320 px** (form **1160 px**, halaman baca **960 px**), jarak antarblok **24 px** (v2.4; nilai v2.0 32/44/56 · 1240 · 1080 · 32 tidak berlaku).
- Sel tabel **10 × 16 px** (baris 40 px, sesuai tabel DS; v2.4), header tabel tanpa latar. Judul halaman **24/32 px** (v2.4). Lihat "Angka standar v2.4".
- Satu garis pemisah per bagian; gunakan ruang kosong sebelum menambah garis atau kotak.

## Tema & chart
- Default `data-theme="light"`, diset sebelum first paint. Pilihan pengguna: Terang (default), Gelap, Ikuti sistem. Tombol di header untuk ganti Terang ↔ Gelap.
- **Warna chart = Agere DS 6.3** `chart-series-1…5` (hex sama di terang dan gelap, sudah divalidasi): area chart memakai slot 1–2; donut maks. 4 slot (1–4); slot 5 hanya dengan label langsung. Tidak ada lagi override warna chart di level produk.

## Aturan anti-overlap (audit otomatis: 28 halaman × 4 ukuran layar)
- Header kartu KPI memakai grid `1fr auto`. Toast dan tombol prototipe ada di pojok kanan bawah.
- Teks di dalam baris dipotong dengan ellipsis (`min-width:0`), jadi tidak menabrak chip di sebelahnya.
- Handle blok Doc membutuhkan ruang 58px di kiri. Bar dokumen yang menempel saat di-scroll memang disengaja.

## Angka standar v2.4 (terukur di prototipe v17.1, 1440 × 900)

| Bagian | Nilai | Token / catatan | Sebelumnya |
|---|---|---|---|
| Rail · panel · topbar · Panduan | 68 · 256 · 56 · 372 px | tetap | — |
| Padding konten | 32 / 40 / 56 px | `spacing-8 / 10 / 14` | 32 / 44 / 56 |
| Lebar maks. konten | 1320 px; form 1160 px; baca 960 px | halaman baca: Kotak masuk, Umum, Akun | 1240; form 1080; Kotak masuk 880 (PRD-10) |
| Jarak antarblok halaman | 24 px | `spacing-6` | 32 |
| Judul halaman (H1) | 24/32, 600 | `type-heading-xl` | 26/34 (tidak ada di token DS) |
| Sel tabel | 10 × 16 px → baris 40 px | tabel DS | 14 × 16 |
| Ubin di header halaman | 48 px, radius 14 px | `PageHeaderLeading`, `radius-xl` | 48 px radius 12 (prototipe v14–v16; UI-01 belum mengatur) |
| Modal detail tugas | maks. 1200 × 820 px, margin 24 px; panel aktivitas 400 px; label properti 160 px | — | 1440 × 900 |

## Aksi & CTA (v2.4, D32)

| Varian | Dipakai untuk | Batas | Contoh |
|---|---|---|---|
| `default` (hitam) | Aksi maju layar: buat, simpan, kirim | **1 per layar** | Tugas baru · Simpan perubahan |
| `outline` | Aksi kedua di samping aksi utama | maks. **2** di header | Bagikan · Impor · Kelola formulir |
| `ghost` | Batal, utilitas toolbar, tombol ikon | — | Batal · Tandai semua dibaca |
| `destructive` | Hanya tombol konfirmasi akhir di dialog | 1, di dialog | Hapus organisasi |
| `destructive-outline` | Pintu masuk ke alur hapus (zona berbahaya, kiri footer dialog, Hapus permanen di tabel) | — | Hapus space |
| `link` | Hanya di dalam kalimat | — | — |
| `secondary` | Hanya status terpilih pada toggle | — | Ikon terpilih |

- **Ukuran per konteks:** `md` (36) di header, dialog, form · `lg` (40) hanya auth & onboarding · `sm` (32) toolbar, kartu, kepala bagian · `xs` (24) aksi di baris tabel/daftar.
- **Header halaman** memakai `PageHeaderActions` (DS 6.4): *leading* (tumpukan avatar akses, opsional) · maks. 2 outline berlabel · 1 default berlabel · ⋯ (IconButton ghost, **selalu terakhir**).
- **Satu aksi, satu tempat:** aksi yang tampil sebagai tombol **tidak** diulang di ⋯ pada ukuran layar yang sama (Bagikan tidak ada di ⋯ proyek/space; *Proyek baru di sini* tidak ada di ⋯ header space). Menu ⋯ space di panel kiri tetap memuat keduanya karena di sana tidak ada tombolnya.
- **< 768 px:** outline pindah ke ⋯ sebagai item pertama (lalu pemisah); default tetap berlabel dan boleh melebar.
- **Empty state memegang aksi utama:** saat daftar kosong, tombol default di header disembunyikan; empty state yang menampilkan tombol hitamnya.
- **Label:** kata kerja + objek, sentence case. Aksi yang formatnya bisa bertambah memakai kata umum: **Impor**, **Ekspor** (format dijelaskan di dialog/menu, D40).
- **Ikon saja** hanya untuk ⋯, tutup, tema, panel, navigasi naik/turun, aksi di baris dan toolbar editor; wajib `aria-label` + tooltip. Aksi utama dan kedua **tidak** dijadikan ikon saja.
- **Footer dialog:** [destructive-outline di kiri] … [Batal ghost] [aksi akhir default/destructive] — aksi akhir selalu paling kanan.
- **Badge di header proyek:** status → akses → Akses admin.

## Tanpa placeholder (v2.4, D33)

- Bidang untuk **menulis konten** (judul, deskripsi, komentar, pesan chat, nama tugas/subtugas, isi Doc, kolom formulir) **tidak memakai placeholder**. Label terlihat (atau label tersembunyi bila konteksnya jelas, mis. composer) + *helper text* untuk format dan contoh ("Pisahkan dengan koma atau baris baru, maksimal 20 email.").
- Satu-satunya pengecualian: **kolom pencarian** ("Cari…"), karena petunjuknya adalah satu-satunya label visual; tetap punya `aria-label`.
- Baris "Tambah item/subtugas" di detail tugas muncul sebagai tombol ghost; input baru tampil setelah diklik (tidak ada input kosong tak terlihat).

## Toast & simpan (v2.4)

- **Toast:** kiri bawah (`Toaster position="bottom-left"`, DS 6.4), di atas dock/SaveBar, maks. 3 terlihat; aksi **Urungkan** 8 detik untuk tindakan yang bisa dibalik. Toast tidak pernah menutupi tombol Simpan atau footer dialog (QA-02 B-12).
- **SaveBar** (DS 6.4) untuk editor panjang dengan simpan eksplisit (editor skill): status *Semua perubahan tersimpan* / *Perubahan belum disimpan* (`attention-on-surface`); **Batal** dan **Simpan** nonaktif sampai ada perubahan; menempel di bawah area konten.
- **SaveStatus** (DS 6.4) untuk halaman autosave (Doc): *Tersimpan* · *Menyimpan…* (ikon berputar, berhenti bila gerak dikurangi) · *Gagal menyimpan* + *Coba lagi*; tanpa tombol Simpan.
- Form pengaturan pendek tetap memakai footer kartu **Batal** (ghost) + **Simpan perubahan** (default).

## Daftar bertingkat: subtugas & seret (v2.4, D28a — PRD-06 v2.1 §6.12)

- Urutan elemen baris: pegangan ⋮⋮ (16 px, tampil saat hover) · checkbox · caret (IconButton xs **24 px**, `aria-expanded`) atau spasi 24 px · status (24 px) · nama · kolom · ⋯. **Tidak ada elemen di depan nama yang boleh mengecil** (QA-02 B-10); label kolom "Nama" rata dengan **teks** nama, bukan dengan ikon (B-11).
- Indent 28 px per level + garis penghubung 1 px `border-emphasis`; tinggi baris 44 px (induk) / 40 px (subtugas).
- Zona jatuh (helper DS 6.4 `getDropZone`): atas 30 % sebelum · tengah 40 % jadi subtugas · bawah 30 % sesudah · header grup = ubah status. Indikator: garis 2 px (sebelum/sesudah) · outline 1,5 px + `bg-subtle` (subtugas) · **outline putus-putus** (grup; bukan `box-shadow`, QA-02 B-09).
- Setiap seret punya padanan menu ⋯ baris: Naikkan · Turunkan · Jadikan subtugas dari… · Lepas dari induk (WCAG 2.5.7); setiap perpindahan diumumkan + toast Urungkan.
- Angka di tab, header grup, dan kolom papan = **tugas utama di papan yang sedang dibuka** (PRD-06 §6.13).

## Editor Doc (v2.4, D39 — PRD-08 v1.1)

- Selalu bisa diedit, autosave, **tanpa mode Edit dan tanpa placeholder**; Doc baru terbuka kosong dengan kursor di judul. Judul `type-display-lg` 36/44 600; isi `type-body-lg` 16/24; Judul 1 24/32; Judul 2 20/28; kode 13/20.
- Menu `/`, pintasan Markdown, pegangan blok (+ / ⋮⋮) di gutter kiri, toolbar seleksi (B · I · S · Kode · Jadikan tugas), `SaveStatus` di toolbar Doc yang menempel di atas area konten.

## Agen › Pemicu (v2.4, D31 — PRD-17 v0.2)

- Halaman **Pemicu**: tab Semua · Saat ada kejadian · Terjadwal; daftar pemicu sebagai **kalimat** ("Saat … di …, jika …, jalankan /… lalu kirim usulan ke …") + sakelar + ⋯; bagian **Riwayat 7 hari** (tabel usulan dengan Terima/Tolak).
- Dialog **Pemicu baru** = `RuleBuilder` DS 6.4: pratinjau kalimat di atas (ikon 32 px, `bg-muted`, radius lg, p-4), baris Kapan · Di mana · Jika (opsional) · Lalu dengan label kolom 96 px. Menu ⋯ proyek punya **Pemicu otomatis** (angka = pemicu di cakupan proyek/space).

## Tata bahasa tanggal impor (v2.4, D40 — satu aturan untuk semua impor)

- Diterima: `2026-10-05` · `05/10/2026` (**selalu DD/MM/YYYY**, di kedua bahasa; tidak pernah MM/DD) · `5 Okt 2026` atau `5 Oct 2026` (singkatan bulan Indonesia **atau English**, huruf besar/kecil bebas; v2.5, D45) · minggu relatif `W1`–`W26` (W1 = minggu impor; Mulai = Senin, Selesai = Jumat). Pratinjau selalu menampilkan tanggal hasil tafsiran dalam bahasa pengguna, sehingga salah tafsir DD/MM terlihat sebelum impor.
- Tanggal kalender mustahil (31/02, `2026-02-31`) dan W di luar 1–26 = **Tanggal tidak valid**; Selesai sebelum Mulai juga ditolak. Pratinjau menampilkan **tulisan asli** pengguna pada baris yang error (QA-02 B-24).
- Batas file: timeline 512 KB (`.md` tabel atau `.csv`); Doc 1 MB (`.md`, `.markdown`, `.txt`). Label tombol **Impor**; format yang didukung tertulis di dialog.

## Pintasan & halaman umum (v2.4)

- **Ctrl /** (⌘ / di Mac) membuka dialog *Pintasan keyboard* (Umum · Daftar & Papan · Doc); juga dari menu akun. `?` membuka Panduan. Keduanya tidak aktif saat fokus di kolom teks atau editor Doc; **N** (tugas baru) dan **Alt 1–5** juga tidak.
- **Hasil pencarian** (dari ⌘K › "Lihat semua hasil untuk …"): tab Semua · Tugas · Proyek · Doc · Orang, kata kunci ditandai `<mark>`. Status cakupan: D43 (usulan Should).
- **Halaman tidak ditemukan (404):** empty state *no-results* + **Cari** (outline) + **Kembali ke Desk** (default).

## Aturan gulir shell (v2.4, QA-02 B-08)

- Hanya **area konten** yang bergulir. Rail, panel kontekstual, topbar, dan Panduan tetap di tempat; baris grid shell dibatasi (`grid-template-rows: minmax(0,1fr)`, `min-height: 0` pada kolom). Bar yang menempel (toolbar Doc, SaveBar) menempel di dalam area konten.
- Uji otomatis: di setiap rute berkerangka shell, `#app.scrollHeight ≤ #app.clientHeight` (dijalankan di semua persona × state × 1440/390 px).

## Warna teks status (v2.4, D37)

- Teks status di permukaan netral (latar halaman, kartu, `bg-muted`) memakai `*-on-surface` DS 6.4 (terang: langkah 800; gelap: langkah 300, error red 400), kontras 6,21–11,00 : 1. `*-fg` hanya untuk teks di atas latar status (`*-bg`), mis. badge.

## Modal detail tugas v2 (v2.4, D41 — PRD-06 v2.1 §8.1)

- Bar atas 56 px: sebelumnya/berikutnya (ButtonGroup outline sm) · breadcrumb proyek › papan › (induk ›) ID · badge *Akses admin* bila ada · Bagikan (outline sm) · ⋯ · tutup. Tidak ada meta "Dibuat" di bar atas.
- Kiri: **tanpa chip status ganda**; judul tanpa bingkai 24/32 (latar `bg-muted` saat hover/fokus); properti 2 kolom di satu blok bergaris atas-bawah (label 160 px: Status · Penanggung jawab · Tenggat (+ badge Terlambat) · Prioritas · Proyek · **Dibuat** {tanggal} oleh {nama}); **Deskripsi** yang langsung bisa diketik (tanpa kotak dan tanpa placeholder); **Subtugas** (tugas utama saja) dan **Checklist** dengan tombol tambah yang memunculkan input.
- Footer: kiri *Perubahan belum disimpan* (`attention-on-surface`, tampil bila ada perubahan) · kanan Batal (ghost) + **Simpan perubahan** (default).
- Kanan 400 px: Aktivitas; composer dengan label terlihat **Komentar**, kotak dengan tombol kirim di dalamnya, caption "Enter untuk kirim, Shift+Enter untuk baris baru".

## Bahasa & format (v2.5, D45)

- **Bahasa:** English (default) dan Bahasa Indonesia. Urutan: preferensi pengguna → default organisasi → English. Halaman sebelum masuk mulai dalam English dengan pengalih bahasa di footer; formulir publik memakai default organisasi.
- **Semua teks sistem berasal dari katalog** (`en` = sumber, `id` = terjemahan; microcopy Indonesia di PRD menjadi katalog `id`). Tidak ada string UI yang ditulis langsung di komponen (lint). Konten pengguna tidak pernah diterjemahkan.
- **Aturan copy yang sama di kedua bahasa:** kata kerja + objek, sentence case ("New task" / "Tugas baru", bukan "New Task"); label umum untuk aksi multi-format ("Import" / "Impor", "Export" / "Ekspor"); label bahasa selalu dalam bahasanya sendiri ("English", "Bahasa Indonesia").
- **Panjang teks:** tata letak harus menampung teks **+35 %** dari versi terpendek tanpa terpotong atau bertumpuk (uji pseudo-lokalisasi). Tombol boleh melebar; label kolom tabel dan tab boleh ellipsis dengan tooltip; judul halaman membungkus ke baris kedua.
- **Format:**

  | | English (`en`) | Bahasa Indonesia (`id`) |
  |---|---|---|
  | Tanggal pendek / panjang | 28 Sep · Mon, 28 Sep 2026 | 28 Sep · Sen, 28 Sep 2026 |
  | Jam | 09:00 (24 jam) | 09.00 |
  | Angka | 1,234.5 | 1.234,5 |
  | Uang (IDR) | IDR 49,000 | Rp49.000 |
  | Relatif | Today · Tomorrow · Overdue since 25 Sep | Hari ini · Besok · Terlambat sejak 25 Sep |

  Urutan hari-bulan dipakai di kedua bahasa agar tanggal tidak ambigu. Ekspor dan API memakai ISO 8601.
- `<html lang>` mengikuti bahasa aktif; nama aksesibel (`aria-label`) ikut diterjemahkan.
- Prototipe v17.1 baru berbahasa Indonesia; katalog English disusun UX writer sebelum pembaruan prototipe (Index C-31).

## Agen (v2.6, PRD-17 v1.0.1 — keputusan UI/UX Designer, prototipe v18)

| # | Keputusan | Spesifikasi (token Agere DS 6.4) |
|---|---|---|
| DD-1 | **Launcher mengambang** di kanan bawah, label "Agent"/"Agen" di ≥ 1024 px, ikon saja di bawahnya (pengecualian D32 yang tercatat: tetap `aria-label` + tooltip "Agents · Ctrl J"). Tampil di semua rute berkerangka shell **kecuali** saat dialog/modal/⌘K terbuka, di rute Chat, di halaman mana pun yang memuat composer Chat (tab Channel proyek), pada rute auth dan publik, saat navigasi HP terbuka, dan di < 768 px saat bar aksi massal tampil. Naik setinggi SaveBar; bergeser ke kiri selebar Panduan (372 + 8 px). Halaman mendapat padding bawah **128 px** selama launcher tampil agar baris terakhir bisa digulir ke atasnya. Ctrl J membuka/menutup (tidak aktif di kolom teks) | tinggi 48, `radius-full`, `brand-default` / `brand-fg`, 14/20 600, gap 8, padding 0 20 0 16; `shadow-elevation-4` → `-5` + `brand-emphasis` saat hover; kanan/bawah 24 (HP 16) |
| DD-2 | **Panel non-modal** di atas launcher (`role="dialog" aria-modal="false"`): pengguna tetap bisa bekerja; panel tetap terbuka saat berpindah halaman sampai ditutup. HP: bottom sheet lebar penuh, maks. 85vh. Esc menutup dan fokus kembali ke launcher | lebar 400 (maks. 100vw − 32), maks. tinggi min(640, 100vh − bawah − 84); `bg-surface`, border, `radius-xl`, `shadow-elevation-5`; header 52 (padding 0 8 0 16), badan padding 16 gap 12, composer padding 12 16 16 |
| DD-3 | **Blueprint dua kolom**: kiri *1. Jelaskan* (label terlihat "What should this agent do?", tanpa placeholder, helper berisi contoh) + template; kanan *2. Tinjau blueprint* (Nama + @handle, Tujuan, Konteks sebagai chip space, Skill sebagai chip, tabel *Yang boleh dilakukan* dengan pilihan level ≤ maks., Batasan, Kecerdasan sebagai kartu radio). Catatan pemangkasan izin sebagai alert `attention`. Aksi header: **Test run** (outline) + **Activate agent** (default) | grid 1fr/1.3fr gap 24 (satu kolom < 1024); bagian gap 8; label bagian 13/20 500 `fg-subtle` |
| DD-4 | **Kartu usulan**: kepala (ikon perisai + "Proposed action" + status), ringkasan tindakan 14/20 600, isi (teks komentar di `bg-muted` atau daftar judul), "Based on {rujukan}", footer: masa berlaku + **Reject** (ghost sm) + **Approve** (default sm di panel; **outline sm di daftar** agar satu layar tetap punya satu tombol default). **Blok bukti**: grup Fact · Inference · Recommendation · Unknown, masing-masing label teks + ikon (✓ · ? · → · ⚠) + garis kiri, rujukan sebagai chip ID yang bisa diklik; warna ikon hanya penguat | kartu padding 12 16, gap 8, `radius-lg`, border; grup bukti padding-left 12 + border-left 2 `border-default`; label 12/16 600; butir 13/20; chip rujukan tinggi 20 `radius-sm` |
| DD-5 | **Penanda "Assisted"** di samping judul (baris daftar, kartu papan) dan baris "Assisted by {agent} · The assignee does not change." di detail tugas, di atas properti. Tidak pernah di kolom penanggung jawab | chip tinggi 20, padding 0 6, `radius-sm`, `bg-subtle` / `fg-subtle`, 11/16 500, ikon 12 |
| DD-6 | **Identitas agent**: ubin **persegi** berikon (orang tetap avatar bulat), nama + badge "Agent", dan baris "Approved by {nama}" pada komentar/pesan agent | ubin 20/28/36/48 px, `radius-sm`/`md`/`md`/`xl`, `brand-default` / `brand-fg` |

- **Garis waktu jalan:** titik 8 px bergaris 2 px `currentColor` per langkah (Request received · Context found (n records) · Plan ready · Waiting for approval / Answer ready); langkah terakhir `fg-emphasis` 500; muncul berurutan 220 ms (tanpa animasi bila gerak dikurangi).
- **Panel Agen (rail):** All agents · Activity (angka = usulan yang menunggu Anda) · Triggers · AI usage (Owner/Admin) · daftar agent aktif · catatan "Agents only propose. Nothing changes until someone approves."
- **Komponen usulan Agere DS 6.5:** `AgentLauncher` (DD-1/DD-2), `AgentBlueprint` (DD-3), `ApprovalCard` + `EvidenceBlock` (DD-4), `RunTimeline`; dua pengecualian angka yang tercatat: lebar panel 400 px dan lebar minimum kartu usulan 320 px.
- Halaman **Agen › Pemicu** (v2.4) tetap berlaku; kalimat pemicu kini menyebut `@handle` agent.

## Doc di proyek (v2.9, D47 — PRD-08 v1.1.3)

| Bagian | Spesifikasi |
|---|---|
| Header tab | "Doc terkait" `h2` + angka · Tautkan Doc (ghost sm) · Doc baru (outline sm) |
| Baris | tombol (`aria-haspopup="dialog"`), min. 64 px, padding 12, gap 12, `radius-md`; ubin ikon 32 px `bg-muted`; judul 14/20 600 satu baris; cuplikan 13/20 `fg-subtle` satu baris; meta 13/20 (avatar xs, nama depan, tanggal); pemisah 1 px `border-default`; hover `bg-muted`; tanpa header kolom |
| Lembar geser (slide-out) | di atas scrim dialog, rata kanan dengan jarak 8; lebar min(720, 100vw − 16), tinggi penuh; `bg-surface`, border, `radius-xl`, `shadow-elevation-5`; masuk geser 24 px + pudar `dur-mod` `ease-emph` (tanpa animasi bila gerak dikurangi); ≤ 767 px layar penuh tanpa radius |
| Header lembar | tinggi 56, padding 0 12: pasangan ikon Doc sebelumnya/berikutnya (outline sm) · ruang · Edit (outline sm) · Bagikan (outline sm) · tutup (ghost ikon) |
| Badan lembar | padding 32 40 64 (HP 24 20 48); ubin 32 + judul 24/32 + keterangan "Doc" dan "Diperbarui …" dipisah jarak 8; chip proyek; garis pemisah; prosa maks. 640 px 16/24 |
| Nama kelas | `dtl-` (daftar) dan `dsheet`/`ds-` (lembar); `.dl` sudah dipakai daftar definisi |

## Modal: fokus (v2.9, berlaku global)

- Semua modal di lapisan dialog (`role="dialog"`, `aria-modal="true"`): **Tab dan Shift+Tab berputar di dalam modal**, termasuk bila fokus sedang di wadah yang bisa difokus (badan lembar). Menu dan listbox di atas modal mengatur tombolnya sendiri.
- Saat ditutup (Esc, tombol tutup, scrim), fokus kembali ke pemicu terakhir yang relevan (untuk lembar Doc: baris Doc yang terakhir tampil).
- Dialog yang dibuka dari dalam modal lain (mis. Bagikan dari lembar Doc) mengembalikan pengguna ke modal asal saat ditutup.

## Chat (v2.10, D48 — PRD-14 v1.5)

| Bagian | Spesifikasi |
|---|---|
| Bilah aksi pesan | di dalam pesan: kanan 8, atas 4; `bg-surface`, border, `radius-md`, `shadow-elevation-2`, padding 2; tombol ghost xs ikon 14 (reaksi · balas di utas · jadikan tugas · ⋯); tampil saat hover dan fokus |
| Nama & avatar pengirim | tombol; nama 600 `fg-emphasis`, garis bawah saat hover; avatar tidak masuk urutan Tab (nama sudah); avatar sejajar atas dengan nama |
| Lampiran | kolom maks. 480; gambar: 1 = maks. 360 × 240 (`object-fit: cover`, `radius-lg`), 2/4 = grid 2 kolom, 3 = 2fr 1fr 1fr, gap 4, "+n" di atas scrim 50 %; video maks. 360 × 240 dengan caption nama + ukuran; kartu file/tautan maks. 360, padding 8 12 8 8, border, `radius-lg`, hover `bg-muted`; ikon file 40 `radius-md` dengan ekstensi 8/10 700; thumbnail tautan 72 × 56 `radius-md` (tanpa gambar: huruf domain 20 600) |
| Reaksi | pill tinggi 24, padding 0 8, `radius-full`, border `border-default`, 12/16; milik saya: border `fg-emphasis`, `bg-subtle`, 600; tombol + muncul saat hover/fokus (selalu di layar sentuh) |
| Edit di tempat | textarea min. 64, border `border-emphasis`, `radius-md`; baris bantuan "Enter untuk simpan, Esc untuk batal" + Batal (ghost xs) + Simpan (outline xs; composer sudah memegang tombol default); latar pesan `bg-subtle` |
| Chip lampiran (composer) | tinggi 48, maks. 240, border, `radius-md`; thumbnail/ikon 40 `radius-sm`; nama + ukuran (tautan: domain + judul); tombol hapus ghost xs |
| Penampil gambar | dialog lebar min(1040, 100vw − 32), header 52 (nama · ukuran · tutup), badan `bg-muted`, gambar `contain` |
| Dialog undang | daftar kotak centang (avatar, nama, jabatan/email), maks. tinggi 320 bergulir; tombol utama "Undang" nonaktif sampai ada pilihan, lalu "Undang {n}" |
| Pesan sistem | ikon 14 + teks 13/20 `fg-subtle`, inden 52 (sejajar isi pesan) |
| Header channel < 768 px | tombol Undang / Buka proyek menjadi ikon 32 (label tetap sebagai `aria-label`); subjudul disembunyikan; petunjuk Enter di composer disembunyikan |

## Referensi
Prototipe acuan: artifact "Prototipe agere/org v13" (versi artifact 26, 27 Sep 2026); tanpa layar Lead. PRD terkait: Index v1.9, PRD-06 v2.0, PRD-10 v1.3, PRD-18 v1.0, PRD-17 v0.1. Design system: Agere DS 6.3.0. Data flow: TECH-01. Triase QA: QA-01.
