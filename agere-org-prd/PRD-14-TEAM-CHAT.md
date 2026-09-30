# PRD-14 — Team Chat

> ## Amandemen v1.5.1 — hasil QA v18.5 (30 Sep 2026)
>
> 1. **Undang hanya di header channel** (D32 satu aksi satu tempat). C1 di bawah menyebut juga panel anggota; tombol di panel anggota **dihapus**. Header selalu terlihat, juga saat panel anggota tertutup; tooltip menjelaskan akibatnya ("Orang yang Anda undang mendapat akses ke proyek" / "Tambahkan orang ke channel ini").
> 2. **Channel proyek:** dialog Undang berjudul **"Bagikan proyek"** dengan keterangan "Anggota channel ini adalah orang yang bisa membuka {proyek}." (sebelumnya memakai judul dialog header proyek "Bagikan tampilan ini").
> 3. **Ukuran file** di bawah 1 KB ditulis dalam byte ("64 B"), bukan "0 KB".
> 4. **Jam pesan** mengikuti bahasa: "09.52" (Indonesia) · "09:52" (English), sesuai UI-01 v2.5; berlaku untuk log, utas, dan daftar lain.
>
> ```gherkin
> Given I am a member of #tim-ops with the members panel open
> Then I see exactly one Undang button, in the channel header
> Given I am in the Studio Desain project channel
> When I choose Undang
> Then the dialog "Bagikan proyek" opens with "Anggota channel ini adalah orang yang bisa membuka Studio Desain."
> Given I attach a 64-byte file
> Then the attachment shows "64 B"
> ```

> ## Amandemen v1.5 — kolaborasi pesan (29 Sep 2026, D48)
>
> Permintaan PO. Prototipe v18.5 menampilkan semuanya (Chat, tab Channel proyek, utas). **Status per fitur terhadap §5:** edit, hapus, reaksi, moderasi, dan DM dari daftar anggota **sudah Must** di v1.4.1 (amandemen ini menambahkan detail perilakunya); **lampiran pindah dari Won't ke Must** (mengangkat sebagian penundaan PRD-07, lihat PRD-07 v1.0.4); **undang ke channel**, **salin**, dan **DM dari nama/menu pesan** baru.
>
> | # | Fitur | Aturan |
> |---|---|---|
> | C1 | **Undang ke channel** | Tombol **Undang** di header channel *(v1.5.1: hanya di header; tombol di panel anggota dihapus, D32)*. Channel *Terbatas*: dialog pilih anggota aktif organisasi yang belum ada di channel (kotak centang, tombol "Undang {n}" nonaktif sampai ada pilihan); yang diundang masuk ke daftar akses channel, bisa membaca seluruh riwayat, dan mendapat notifikasi "{nama} menambahkan Anda ke #{channel}" yang membuka channel itu; di log tampil pesan sistem "{nama} menambahkan {nama}". Yang boleh mengundang: anggota channel, Owner, Admin. **Channel proyek:** Undang membuka dialog **Bagikan proyek** (akses channel = akses proyek; tidak ada model akses kedua). **#umum:** tanpa Undang (semua anggota sudah ada). **DM:** tanpa Undang; untuk orang lain mulai DM baru |
> | C2 | **Lampiran** | Tombol klip di composer → *Gambar atau video* · *File* · *Tautan*. Maks. **10 lampiran per pesan** dan **25 MB per file** (PRD-07 aturan 3, [H]); yang terlalu besar ditolak dengan pesan berisi nama file. Lampiran tampil sebagai chip di atas kolom tulis sebelum dikirim, masing-masing bisa dihapus; draf teks tidak hilang. Pesan boleh berisi lampiran saja. **Di pesan:** gambar sebagai thumbnail (1: maks. 360 × 240; 2–4: grid; > 4: "+n") yang membuka penampil; video dengan pemutar bawaan (`preload=metadata`); file sebagai kartu ikon + nama + jenis + ukuran + Unduh; **tautan** sebagai kartu dengan **thumbnail** (gambar Open Graph), domain, judul, deskripsi; tanpa gambar → ubin huruf domain. URL yang diketik di teks otomatis menjadi kartu (maks. 3 per pesan). Status unggah: *mengunggah → memindai → siap*; file yang gagal atau belum siap hanya terlihat oleh pengunggah dengan "Coba lagi" (PRD-07 F1). Lampiran ikut akses dan umur pesannya: pesan dihapus → file dihapus (PRD-07 aturan 2). **Utas:** balasan belum bisa melampirkan (iterasi berikutnya) |
> | C3 | **Reaksi** | 6 emoji tetap: 👍 ❤️ 😂 🎉 👀 ✅ (menu dari tombol senyum di bilah aksi atau tombol + di baris reaksi). Pill = emoji + jumlah; pill milik saya `aria-pressed=true`; klik pill menambah/menghapus reaksi saya; tooltip dan label aksesibel berisi nama yang bereaksi. Berlaku di pesan dan balasan utas |
> | C4 | **Salin** | Menu ⋯ → **Salin teks** (teks polos; `{T-311}` menjadi "T-311 {judul}" hanya bila pembaca punya akses) dan **Salin tautan pesan** (`/{slug}/c/{channel}#m{id}`). Toast "Pesan disalin." / "Tautan disalin." |
> | C5 | **DM dari channel** | Klik nama atau avatar pengirim → menu (nama, jabatan) · **Kirim pesan** · **Sebut di percakapan ini**; menu ⋯ pesan orang lain → "Kirim pesan ke {nama}"; panel anggota → ikon pesan per baris. Membuka DM 1:1 yang sudah ada, atau membuat yang baru; fokus ke kolom tulis. Tidak tampil untuk diri sendiri, dan tidak di dalam DM dengan orang itu |
> | C6 | **Edit & hapus** | **Edit:** hanya pesan sendiri; di tempat (Enter simpan, Shift+Enter baris baru, Esc batal, fokus kembali ke nama pengirim); label "(diedit)"; teks kosong tanpa lampiran ditolak ("Pesan tidak boleh kosong. Hapus pesan bila tidak diperlukan lagi."). **Hapus:** pesan sendiri, atau pesan siapa pun oleh pengelola channel / Owner / Admin (moderasi); dialog konfirmasi (untuk moderasi menyebut nama penulis dan Audit); pesan yang punya balasan meninggalkan "Pesan ini dihapus." agar utas tetap utuh, selain itu hilang dari log; reaksi dan lampirannya ikut terhapus. Moderasi tercatat di Audit: "Menghapus pesan {penulis} di {percakapan}" (kategori Chat) |
>
> **Bilah aksi pesan** (hover/fokus, di dalam batas pesan): reaksi · balas di utas · jadikan tugas · ⋯ (Salin teks · Salin tautan pesan · Kirim pesan ke … · Edit pesan · Hapus pesan). Balasan utas: reaksi · ⋯.
>
> **Perbaikan QA yang ditemukan saat membangun v1.5 (berlaku juga untuk v1.4.1):** (1) log memakai grid `align-content:end` sehingga pesan terlama **tidak bisa dijangkau** saat log penuh → kolom flex dengan `margin-top:auto`; (2) bilah aksi di `top:-12px` terpotong dan tertutup header untuk pesan di tepi atas → di dalam pesan; (3) membuka percakapan kini selalu di pesan terbaru dan aksi (reaksi, edit) tidak melompatkan posisi baca; (4) avatar sejajar dengan nama pada pesan tinggi.
>
> **Data (TECH-01 v1.5):** `message_attachments` (organization_id, message_id, file_id, position, kind image/video/file) dengan `files` sebagai sumber (PRD-07); `link_previews` (organization_id, url_hash, url, title, description, image_file_id, fetched_at, status) — diambil server dengan pelindung **SSRF**; `conversation_participants.added_by` untuk undangan; `messages.edited_at / deleted_at / deleted_by` sudah ada.
>
> **Estimasi tambahan** [H — estimasi ulang bersama tim]: lampiran (unggah, pemindaian, penampil, kartu) BE 5 + FE 5; pratinjau tautan dengan pelindung SSRF BE 3 + FE 1; video BE 0,5 + FE 1; undang BE 1 + FE 1; salin + DM dari nama/menu FE 1. **Total ≈ BE 9,5 + FE 9 = 18,5 hari**, di atas 68,5 hari v1.4.1 yang buffer FE-nya 0. **Keputusan jadwal terbuka (D48a):**
>
> | Opsi | Isi rilis 2 | Dampak |
> |---|---|---|
> | A — semua | C1–C6 lengkap | rilis 2 ≈ +2 minggu [H] (dogfood W41 → W43) |
> | **B — bertahap (disarankan)** | C1, C3–C6, lampiran gambar + file; **video dan pratinjau tautan server-side di rilis 2.1** (sementara URL tetap jadi tautan biasa) | ≈ +1 minggu [H]; risiko SSRF dan biaya penyimpanan video ditunda sampai pemakaian lampiran terukur |
>
> **Pertanyaan terbuka:** Q7 batas video (25 MB seperti file lain, atau lebih tinggi dengan kuota) · Q8 apakah Member boleh mengundang ke channel *Terbatas* atau hanya pengelola/Admin [H: boleh, sesuai kebiasaan tim kecil].
>
> ```gherkin
> Given saya anggota #tim-ops (Terbatas) dan Yoga belum
> When saya memilih Undang, mencentang Yoga, lalu memilih "Undang 1"
> Then Yoga masuk daftar anggota, log menampilkan "Rina menambahkan Yoga", dan Yoga mendapat notifikasi yang membuka #tim-ops
> Given saya di channel proyek Studio Desain
> When saya memilih Undang
> Then dialog Bagikan proyek terbuka
> When saya melampirkan gambar dan PDF, mengetik teks, lalu menekan Enter
> Then pesan terkirim dengan thumbnail gambar dan kartu file, dan chip lampiran kosong lagi
> When saya mengetik "https://www.figma.com/file/q4-banner" dan mengirim
> Then pesan menampilkan kartu tautan dengan thumbnail, domain, dan judul
> Given sebuah file 30 MB
> When saya melampirkannya
> Then file ditolak dengan pesan "… lebih besar dari 25 MB."
> When saya memilih 🎉 pada pesan Sari, lalu memilih pill 🎉 lagi
> Then reaksi saya bertambah lalu terhapus, dan jumlahnya ikut berubah
> When saya memilih ⋯ › Salin teks
> Then teks pesan ada di clipboard dan toast "Pesan disalin." tampil
> When saya memilih nama Dimas di sebuah pesan › Kirim pesan
> Then DM dengan Dimas terbuka (tidak dibuat dua kali) dan fokus di kolom tulis
> Given pesan saya sendiri
> When saya memilih Edit pesan, mengubah teks, lalu Enter
> Then pesan berubah dan menampilkan "(diedit)"
> Given saya Member dan pesan milik Sarah
> Then menu ⋯ tidak menampilkan Edit maupun Hapus
> Given saya Admin
> When saya menghapus pesan Sarah
> Then dialog menyebut tindakan admin, pesan hilang, dan Audit mencatat "Menghapus pesan Sarah Wijaya di Studio Desain"
> ```

## 1. Ringkasan eksekutif

**Rekomendasi: Chat dibangun sebagai app `chat` di rilis 2, bukan rilis 1, dan hanya jika gate bukti dari pilot lolos.** Rilis 1 sudah penuh (kini **29 minggu** pada Opsi A, PRD-00 v1.2.8; semula 26 minggu di v1.2.6). Chat butuh 12 minggu tim 1 FE + 1 BE (Kanban, W27–W38). Memaksanya masuk rilis 1 menggeser M3 dari akhir W26 ke akhir W38 (+12 minggu; hitungan di Bagian 5).

| Field | Value |
| --- | --- |
| Version | **1.5.1** — QA v18.5: Undang hanya di header, judul dialog Bagikan proyek, ukuran < 1 KB, jam per bahasa (30 Sep 2026); **1.5** — undang ke channel, lampiran (gambar, video, file, tautan dengan thumbnail), reaksi, salin, DM dari channel, edit & hapus (D48, 29 Sep 2026); v1.4.1: agent di Chat, dua bahasa |
| Status | Proposed — untuk review PO dan engineering; posisi rilis diputuskan di PRD-00 |
| Owner | \[TBD — Product Owner agere/org\] |
| Last updated | 28 Sep 2026 |
| Release | Kandidat rilis 2 (setelah M3), dengan gate bukti dari closed pilot |
| Delivery context | Next.js modular monolith di Vercel (Pro), Postgres, Agere DS 6.4; tim 1 FE + 1 BE (PRD-00); vibe coding di Antigravity IDE dengan GitHub (Bagian 14) |
| App id / nama tampilan | `chat` / **Chat** |
| Depends on | PRD-00b, 02, 03, 04, 06, 10, 11, 12, 13; TECH-01; UI-01 |

**Catatan metode (26 Sep 2026):** tim bekerja dengan **Kanban**, bukan sprint. Kapasitas 3,5 ideal day per orang per minggu; jadwal dalam minggu relatif W27–W38 tanpa tanggal kalender sampai tanggal kick-off ditetapkan (PRD-00 D7) (timeline "Timeline agere/org", PRD-00 §4.3).

**Change log v1.4 → v1.4.1 (28 Sep 2026):**

- **Agent di Chat (Should PRD-17 v1.0, hanya bila Chat sudah rilis):** `@handle` agent di pesan atau utas memulai jalan dengan channel/utas sebagai konteks. **Draf balasan hanya terlihat oleh pemanggil**; setelah disetujui, pesan terbit dengan identitas agent dan baris "Disetujui {nama}" (PRD-17 §9.3). Pintu masuk agent di composer mengikuti keputusan desain DD-1/DD-6 (UI/UX Designer). Template *Asisten Chat*. Estimasi tambahan +1 BE, +1 FE [H] (PRD-17 §13).
- Pesan agent tidak pernah menyebut data yang tidak bisa dibuka oleh **semua** anggota channel: konteks jalan di channel = irisan akses anggota channel ∩ pemanggil [Hypothesis: Needs Validation — mahal untuk channel besar; alternatif: jawaban hanya ke pemanggil].
- **Jadwal (PRD-00 v1.2.8 §4.2 langkah 9):** rilis 1 = 29 minggu (Opsi A) atau 28 minggu (Opsi B). **Semua nomor minggu di dokumen ini bergeser +3 (Opsi A) atau +2 (Opsi B)**: Chat **W30–W41** (A) / W29–W40 (B), gate G-Chat di rapat M3 akhir **W29** (A) / W28 (B). Urutan per minggu di §12 tetap berlaku dengan pergeseran itu.
- **Dua bahasa (D45):** teks sistem Chat (label, status, pesan sistem seperti "Rina bergabung") mengikuti bahasa penonton; isi pesan tidak diterjemahkan.

**Change log v1.3 → v1.4 (28 Sep 2026):**

- **Dialog Channel baru** (header panel Chat, tombol ikon +): *Nama channel* dengan addon `#`, otomatis huruf kecil dan tanda hubung, cek duplikat langsung ("Nama #{nama} sudah dipakai."); *Topik* (opsional); *Siapa yang bisa bergabung* (`Select`: Semua anggota · Terbatas untuk Tim {nama}). Tombol **Buat channel**. Channel proyek tetap dibuat dari tab Channel proyek.
- **Utas (balasan thread):** tombol ikon "Balas di utas" pada hover pesan; pesan dengan balasan menampilkan tautan "{n} balasan" dengan tumpukan avatar; utas terbuka di panel kanan (340 px) menggantikan panel Anggota, dengan composer sendiri (Enter kirim). **Prioritas tetap Could** (WSJF 3,33, §8); prototipe menampilkannya untuk memvalidasi desain, bukan mengubah cakupan [Hypothesis: Needs Validation — ukur di pilot apakah percakapan panjang memecah channel].
- **Pemilih di composer:** tombol **@** membuka daftar anggota yang bisa membuka channel (menyisipkan "@Nama "); tombol **Tautkan tugas** membuka daftar tugas terbuka yang bisa Anda buka (menyisipkan `{T-xxx}`, dirender sebagai chip). **Should** (FE 0,5), karena mengetik @ dan `{T-xxx}` tetap berfungsi tanpa pemilih.
- **Tanpa placeholder (D33):** composer punya label tersembunyi "Tulis pesan ke {channel}" dan caption terlihat "Enter untuk kirim, Shift+Enter untuk baris baru".
- Teks status (galat kirim, tautan utas) memakai token `*-on-surface` Agere DS 6.4 (D37); toast di kiri bawah (UI-01 v2.4).

```gherkin
Given saya membuka dialog Channel baru dan mengetik "Tim Ops Gudang"
Then kolom nama menampilkan "tim-ops-gudang"
When saya mengetik "umum"
Then helper berbunyi "Nama #umum sudah dipakai." dan Buat channel tidak membuat apa pun
Given pesan Sari di #studio-desain punya 2 balasan
When saya memilih "2 balasan"
Then panel Utas terbuka menggantikan panel Anggota dan fokus berada di composer utas
```

**Change log v1.2.2 → v1.3 (27 Sep 2026, prototipe v13):**

- **Panel Anggota di kanan percakapan (Must):** menampilkan siapa saja yang punya akses ke percakapan — channel space: anggota space; channel proyek: anggota proyek; channel mandiri: anggota channel; DM: peserta. Dikelompokkan **Online** / **Offline**, dengan peran, tim, dan "terakhir aktif"; kotak cari nama atau tim; catatan kaki "Daftar ini mengikuti akses {space/proyek/channel}. Ubah lewat Bagikan." Dibuka/ditutup lewat tumpukan avatar + jumlah di header percakapan.
- **DM dari daftar anggota:** tombol **Pesan** di setiap baris (muncul saat hover/fokus) membuka DM yang sudah ada atau membuat DM 1:1 baru, lalu fokus ke composer. Tombol **+** di grup "Pesan langsung" pada panel Chat membuka panel anggota dengan fokus di kotak cari.
- **Kehadiran (Should):** "Online" = ada `chat/sync` dalam 5 menit terakhir (kolom `memberships.last_seen_at`, diperbarui paling sering sekali per 60 detik dari request sync yang sudah ada — tanpa infrastruktur baru). Tanpa Should ini, panel menampilkan "terakhir aktif" dari `last_active_at`.
- **Navigasi (UI-01 v2.2):** daftar channel hanya di panel kontekstual Chat; daftar di dalam halaman Chat hanya tampil saat panel ditutup (Ctrl+B). Channel proyek memakai badge huruf proyek dan label "proyek" agar tidak tertukar dengan channel space bernama sama.
- **Jadwal:** rilis 1 kini 26 minggu (PRD-00 v1.2.6), sehingga Chat bergeser ke **W27–W38**, dogfood akhir W37–W38, gate G-Chat di M3 akhir **W26**.
- **Estimasi:** panel anggota + DM dari daftar: BE 0,5 + FE 1 (Must); kehadiran: BE 0,5 + FE 0,5 (Should). Total menjadi BE 33,5 + FE 35 = **68,5 hari**; FE 35 × 1,2 ÷ 3,5 = **12,0 minggu** — buffer FE habis, sehingga kartu `#tugas` dan reaksi tetap menjadi potongan pertama bila tergelincir (Bagian 12).

**Change log v1.1 → v1.2 (channel per proyek, prototype v11):**

- **Setiap proyek punya channel** yang aksesnya mengikuti ACL proyek, tampil sebagai tab **Channel** di ruang proyek (PRD-06 §6.7), di pohon sidebar proyek, dan di halaman Chat. Channel mandiri (Umum, Terbatas) dan DM tetap ada untuk topik di luar proyek.
- Channel proyek dibuat saat pertama dibuka (idempoten), mengikuti arsip/Sampah/purge proyeknya, dan **tidak** bisa diganti nama, dibagikan, atau dihapus sendiri.
- **Mengikuti (follow):** pembuat proyek otomatis mengikuti; siapa pun yang mengirim pesan otomatis mengikuti; yang lain lewat banner "Ikuti" atau Jelajahi channel. Channel proyek jadi tab awal hanya bila diikuti **dan** berisi pesan (QA ON1).
- **"Jadikan tugas"** dari channel proyek default ke proyek itu sendiri, tanpa peringatan privasi (isi tidak berpindah ke audiens yang lebih luas).
- Estimasi naik 4 hari (BE 2 + FE 2): **67 hari**, tetap 12 minggu dengan buffer FE ~0,34 minggu.
- Microcopy DM diperjelas (QA CH2). Amandemen di Bagian 13 diterapkan ke dokumen terkait di paket 26 Sep 2026 (berlaku bila G-Chat lolos).

**Change log v1.0 → v1.1 (audit):**

- Estimasi dikoreksi dari 57 ke 63 ideal dev-day (5 → 6 sprint); empat item sebelumnya belum terestimasi.
- Ditambahkan keanggotaan channel (gabung/keluar) agar sidebar dan hitungan belum dibaca tidak memuat semua channel publik.
- Aturan belum dibaca diperbaiki: pesan sendiri dan riwayat sebelum bergabung tidak dihitung.
- Metodologi retensi diganti menjadi retensi pasca-paparan dengan holdout, disertai hitungan ukuran sampel.
- Gate G-Chat (a) diganti sinyal perilaku; metrik konversi dipisah dari referensi tugas.
- Ditambahkan aturan privasi "Jadikan tugas" dari DM/channel Terbatas, AC pengecualian DM, pembuatan channel Umum secara lazy, dan trigger realtime yang realistis.

**Apa yang dibangun:** channel per proyek (akses mengikuti proyek), channel mandiri (untuk semua anggota atau terbatas ke orang/tim), DM, @mention, kartu tugas lewat `#`, dan **"Jadikan tugas"** dari pesan. Diferensiasinya bukan chat yang lebih baik dari WhatsApp, melainkan percakapan yang langsung menjadi pekerjaan di Project.

**Kenapa penting:** Chat hanya menaikkan North Star (WACO) jika percakapan berubah menjadi aksi Project. Karena itu "Jadikan tugas" adalah Must, dan kanibalisasi Project menjadi guardrail.

**Bagaimana dikirim:** polling adaptif lewat satu endpoint sync, tanpa infrastruktur baru (selaras TECH-01: tanpa WebSocket di rilis 1). Jalur upgrade yang terdokumentasi: sinyal realtime tanpa isi pesan dari provider terkelola.

**Validasi di rilis 1 dengan biaya hampir nol:** Comments + @mention di tugas (Should #1 PRD-00), pertanyaan wawancara pilot mingguan, dan satu event telemetri "Salin tautan tugas" (< 0,5 hari FE) menjadi probe permintaan.

**Keputusan yang diminta:**

1. Setujui Chat sebagai kandidat rilis 2 dengan gate di Bagian 2.
2. Setujui arsitektur polling-first (Bagian 7).
3. Setujui pengecualian DM dari governance override Admin (Q1, sudah diputuskan di Bagian 6 dan 13).

## 2. Masalah, akar masalah & bukti

**Akar masalahnya bukan "tidak ada chat", melainkan percakapan kerja terputus dari objek kerjanya.** PRD-06 §1 sudah mencatat bahwa tim kecil Indonesia menjalankan pekerjaan di grup WhatsApp dan spreadsheet. Project menyelesaikan sisi eksekusi; diskusi yang memicu eksekusi masih terjadi di luar agere/org.

**Job to be done:** *Ketika tim saya perlu menyepakati sesuatu tentang pekerjaan, saya ingin berdiskusi cepat dan hasilnya langsung menjadi tugas yang jelas, agar tidak ada yang bertanya ulang atau salah eksekusi.*

### Rantai sebab (5 whys)

1. Tugas salah eksekusi atau terlambat, karena klarifikasi terjadi di luar agere/org.
2. Klarifikasi terjadi di luar, karena agere/org tidak punya tempat percakapan cepat; komentar tugas (rilis 1, Should) terikat satu tugas.
3. Itu merugikan, karena keputusan tersebar di grup WhatsApp dan tidak tertaut ke tugas.
4. Tidak tertaut, karena tidak ada jembatan dari pesan ke tugas.
5. Dampak bisnis: anggota membuka agere/org hanya untuk update status, bukan untuk bekerja sehari-hari. Frekuensi kunjungan rendah membuat switching cost rendah dan menekan retensi minggu ke-4 (PRD-00 §2).

### Status bukti

Semua klaim di atas adalah **hipotesis**. Belum ada data pilot karena closed pilot baru dibuka di M2 (akhir W18).

| Hipotesis | Cara validasi | Kapan | Biaya engineering |
| --- | --- | --- | --- |
| H1: koordinasi tugas terjadi di WhatsApp minimal mingguan | 3 pertanyaan tambahan di wawancara pilot mingguan (PRD-00 §9) | M2–M3 | 0 |
| H2: tim mau berdiskusi di dalam agere/org | Pemakaian Comments + @mention di tugas (Should #1 PRD-00) per org WACO | M2–M3 | 0 (sudah di scope rilis 1 bila kapasitas cukup) |
| H3: chat adalah penghalang pindah penuh | Pertanyaan "Apa yang masih membuat tim Anda kembali ke WhatsApp?" | M2–M3 | 0 |
| H4: "Jadikan tugas" dipakai bila tersedia | Pemakaian fitur setelah rilis (Bagian 4) | Minggu 1–8 pasca rilis | Bagian dari MVP |

### Gate G-Chat (dievaluasi di rapat go/no-go M3, akhir W26)

Chat masuk perencanaan rilis 2 hanya jika **minimal 2 dari 3** terpenuhi:

- **(a)** Median ≥ 3 "Salin tautan tugas" (PRD-06 §8.1) per org WACO per minggu, sebagai bukti perilaku bahwa tugas dibahas di luar agere/org. Laporan wawancara saja tidak dipakai karena hampir semua tim memakai WhatsApp, sehingga kriteria itu pasti lolos. \[H\]
- **(b)** ≥ 40% org WACO memakai komentar tugas minimal sekali seminggu \[H\]. Jika komentar tugas tidak masuk rilis 1, kriteria ini diganti wawancara.
- **(c)** ≥ 3 org pilot menyebut chat sebagai salah satu dari tiga alasan teratas masih memakai alat lain.

**Jika gate gagal:** investasi dialihkan ke penguatan komentar tugas (notifikasi, tautan antar tugas) yang lebih murah, dan PRD ini diarsipkan.

## 3. Persona & jobs to be done

**Persona utama adalah Team lead**, karena dialah yang memutuskan di mana tim berdiskusi; jika dia pindah, tim ikut pindah. Persona mengikuti PRD-06 §3 agar tidak ada dua versi.

| Persona | Job to be done | Fitur MVP paling relevan | Bukti |
| --- | --- | --- | --- |
| Team lead (Member) | "Saat tim saya berdiskusi, saya ingin keputusan langsung menjadi tugas yang ditugaskan, tanpa mengetik ulang dari WhatsApp." | Channel tim, "Jadikan tugas", @mention | \[Hypothesis: wawancara pilot\] |
| Member | "Saya ingin bertanya soal tugas dan tahu kapan saya dibutuhkan, tanpa memantau tiga aplikasi." | DM, kartu `#tugas`, indikator belum dibaca | \[Hypothesis\] |
| Owner | "Saya ingin diskusi kerja milik organisasi, bukan tersebar di ponsel pribadi karyawan yang bisa keluar kapan saja." | Channel terbatas, penghapusan akses saat anggota dikeluarkan | \[Hypothesis\] |
| Admin | "Saya ingin bisa menghapus pesan yang melanggar kebijakan dan tahu siapa melakukannya." | Moderasi + audit (PRD-11) | \[Hypothesis\] |

**Segmen:** sama dengan pilot rilis 1 — tim kecil multi-tim atau agensi yang butuh lapisan organisasi dan akses (PRD-00 §7). Organisasi yang sudah memakai Slack atau Teams secara penuh bukan target MVP.

## 4. Metrik & business case

**North Star tetap WACO (PRD-00 §2); Chat tidak mendapat North Star sendiri.** Metrik fitur mengukur apakah percakapan berubah menjadi aksi Project, karena hanya itu yang menggerakkan WACO. \[H\] = target hipotesis; baseline diambil 4 minggu pertama setelah rilis.

### Metrik

| Metrik | Definisi | Baseline | Target | Window | Tipe |
| --- | --- | --- | --- | --- | --- |
| Weekly Chatting Orgs (WCO) | % org dengan Chat aktif yang punya ≥ 2 anggota aktif (selaras WACO), masing-masing mengirim ≥ 1 pesan dalam minggu ISO | N/A (baru) | ≥ 40% \[H\] | Minggu ke-8 pasca rilis | Primer |
| Konversi chat → tugas | Jumlah "Jadikan tugas" per org WCO per minggu | N/A | ≥ 2 \[H\] | Mingguan | Primer (diferensiasi) |
| Referensi tugas di chat | Kartu `#tugas` yang dikirim per org WCO per minggu | N/A | Baseline dulu | Mingguan | Sekunder |
| Retensi 4 minggu pasca-paparan | % org yang WACO pada minggu ke-4 setelah Chat aktif, dibanding org tanpa Chat di minggu kalender yang sama (holdout 20% org baru + gelombang org lama) | Nilai kohort pembanding | +10 pp \[H\]; direksional sampai n ≥ 373 org per kelompok | 8–12 minggu | Outcome |
| WACO | Definisi PRD-00 | Nilai saat rilis 2 | Tidak turun; diharapkan naik | Mingguan | North Star |
| Kanibalisasi Project | Pengguna aktif mingguan Project ÷ anggota aktif (PRD-06 §4) di org dengan Chat | Nilai pra-rilis per org | Tidak turun > 5 pp \[H\] | Mingguan | Guardrail |
| Kebisingan notifikasi | Read rate notifikasi dalam 72 jam (PRD-10 §3) | Nilai pra-rilis | Tetap ≥ 60% | Mingguan | Guardrail |
| Pesan hilang | Pesan yang sudah di-ack server tetapi tidak ada di database | — | **0** | Kontinu | Guardrail |
| Pesan ganda | Dua baris untuk satu `client_msg_id` | — | **0** | Kontinu | Guardrail |
| Kebocoran lintas org / akses tanpa izin | Insiden terkonfirmasi (PRD-04 §4) | — | **0** | Kontinu | Guardrail |
| Latensi kirim → terlihat | Dari ack server sampai pesan tampil di klien lain yang sedang membuka percakapan, p95 | — | ≤ 5 detik \[H\] | Mingguan | Sekunder |

**Ukuran sampel retensi:** mendeteksi 35% → 45% (α 0,05, power 80%) butuh n ≈ (1,96 + 0,84)² × (0,35 × 0,65 + 0,45 × 0,55) ÷ 0,10² = 7,84 × 0,475 ÷ 0,01 ≈ 373 org per kelompok. Di bawah itu hasil retensi hanya direksional, sehingga keputusan minggu ke-8 bertumpu pada WCO dan konversi. Retensi minggu ke-4 versi PRD-00 tidak dipakai karena untuk org lama nilainya sudah terkunci sebelum Chat dirilis.

Instrumentasi metrik ini termasuk scope MVP, mengikuti pola gate G9 PRD-00: WCO, konversi dan retensi kohort dihitung dari data produksi lewat saved query.

### Biaya (satu-satunya angka yang sudah bisa dihitung)

1. Estimasi (rincian di Bagian 12): BE 33 + FE 34 = **67 hari** (v1.1: 63; +4 untuk channel proyek). v1.0 menulis 57 hari dan melewatkan instrumentasi, layout satu panel di HP, gabung/keluar channel, serta pengecualian DM di authz.
2. Contingency 20% (metode PRD-00 §4.1): 67 × 1,2 = **80,4 hari**.
3. Per peran, focus factor 3,5 hari per orang per minggu: FE 34 × 1,2 ÷ 3,5 = 11,66 minggu; BE 33 × 1,2 ÷ 3,5 = 11,31 minggu.
4. Dibulatkan: **12 minggu untuk seluruh tim = 24 person-week.** Estimasi v1.0 menempatkan FE di 9,9 dari 10 minggu (buffer sekitar 0,2 hari), sehingga tidak realistis.

**Biaya peluang:** 12 minggu yang sama tidak dipakai untuk kandidat rilis 2 lain (lampiran tugas PRD-07, Calendar PRD-09, grafik tren Ringkasan, UI bahasa Inggris, preferensi dan push PRD-10). Estimasi kandidat lain belum ada, sehingga urutan rilis 2 diputuskan dengan WSJF saat perencanaan setelah M3.

### Nilai bisnis: kenapa ROI Rupiah belum bisa dihitung

Rilis 1 dan pilot **gratis** dan seat tidak dihitung (PRD-00 §3.3); harga menunggu Billing PRD. Mengisi ROI dengan harga karangan akan melanggar prinsip keputusan berbasis fakta. Yang bisa dilakukan sekarang adalah menetapkan **syarat balik modal**, yang tinggal diisi saat Billing PRD selesai.

Misalkan C = biaya chat (24 × biaya loaded per person-week), LTV = nilai seumur hidup satu org, N·a = jumlah org berbayar yang memakai Chat, dan T = bulan efek berlaku. Org yang harus dipertahankan dan penurunan churn bulanan minimum adalah:

```latex
s_{BE} = \frac{C}{LTV} \qquad \Delta c_{min} = \frac{C}{LTV \times N a \times T}
```

Sensitivitas dengan T = 12 bulan (tanpa asumsi harga; C dinyatakan dalam kelipatan LTV):

| C ÷ LTV | Δc minimum bila N·a = 100 org | Δc minimum bila N·a = 500 org |
| --- | --- | --- |
| 10 | 10 ÷ 1.200 = 0,83 pp/bulan | 10 ÷ 6.000 = 0,17 pp/bulan |
| 25 | 25 ÷ 1.200 = 2,08 pp/bulan | 25 ÷ 6.000 = 0,42 pp/bulan |
| 50 | 50 ÷ 1.200 = 4,17 pp/bulan | 50 ÷ 6.000 = 0,83 pp/bulan |

**Implikasi:** dengan basis kecil, Chat harus menurunkan churn 0,8–4,2 pp per bulan untuk balik modal; itu sulit. Pada 500 org pengguna, cukup 0,17–0,83 pp. Chat baru ekonomis pada skala, sehingga pilot 5–10 org hanya bernilai sebagai pembelajaran. Ini alasan kedua (setelah kapasitas) untuk tidak memasukkannya ke rilis 1.

## 5. Scope

**MVP = fondasi (34 hari) + kapabilitas Must (33 hari) = 67 ideal dev-day (v1.2).** Lampiran file tidak masuk karena PRD-07 membatasi rilis 2 pada lampiran tugas; mengizinkannya di chat butuh amandemen PRD-07 lebih dulu.

### MoSCoW

**Must (MVP):**

- App `chat` terdaftar di app registry, bisa diaktifkan/nonaktifkan per organisasi, dengan app access per user/tim (PRD-04 §6.5).
- **Channel proyek:** satu per proyek, akses = ACL proyek, tab Channel di ruang proyek, baris "# Channel" dan jumlah belum dibaca di pohon sidebar proyek (Bagian 6 dan 9).
- Channel mandiri: buat, ubah nama dan deskripsi, arsipkan, hapus ke Sampah; akses lewat Share dialog (Semua anggota / Terbatas). Channel **Umum** dibuat saat Chat pertama kali dibuka (idempoten) dan diikuti semua anggota. Sidebar hanya berisi channel yang diikuti; channel lain ditemukan lewat "Jelajahi channel" (gabung/keluar).
- DM 1:1 dan grup (≤ 8 orang).
- Pesan teks (plain text + markdown dasar, sama dengan deskripsi tugas PRD-06), edit, hapus, pengelompokan pesan beruntun, status belum dibaca, pill "Pesan baru".
- @mention anggota, dengan notifikasi in-app (PRD-10).
- Kartu `#tugas` dan **"Jadikan tugas"** dari pesan.
- Reaksi (6 emoji tetap).
- Moderasi oleh pengelola channel atau Admin, tercatat di audit.
- Pengiriman dengan polling adaptif (Bagian 7) dan instrumentasi metrik (Bagian 4).

**Should:** pencarian pesan (full-text Postgres); titik belum dibaca di org switcher; pin pesan; bisukan channel.

**Could:** sinyal realtime terkelola (jalur upgrade, Bagian 7); balasan thread; indikator sedang mengetik.

**Won't (rilis 2):** lampiran file (butuh amandemen PRD-07); voice/video; tamu eksternal (PRD-04 Won't); jembatan WhatsApp/Slack; end-to-end encryption; bot dan integrasi; push aplikasi native (non-goal global: tidak ada aplikasi native di MVP); ringkasan AI.

**Non-goals:** menggantikan Slack/Teams sebagai alat komunikasi seluruh perusahaan; komunikasi dengan pelanggan atau pihak luar.

### RICE (untuk memotong scope)

Reach = % anggota aktif yang diperkirakan memakai per kuartal \[H\]; Impact 3/2/1/0,5; Effort = ideal dev-day BE + FE sebelum contingency. RICE = Reach × Impact × Confidence ÷ Effort. Fondasi (skema, pesan, sync, shell UI, hardening, retensi, instrumentasi, layout HP = 34 hari) tidak diberi skor karena prasyarat.

| Kapabilitas | Reach | Impact | Confidence | Effort | RICE | Keputusan |
| --- | --- | --- | --- | --- | --- | --- |
| @mention + notifikasi | 80 | 2 | 80% | 4 | 32,0 | Must |
| Channel proyek (v1.2) | 90 | 2 | 70% | 4 | 31,5 | Must |
| Channel + Share dialog | 90 | 2 | 80% | 8 | 18,0 | Must |
| DM | 80 | 1 | 80% | 4 | 16,0 | Must |
| Reaksi | 70 | 0,5 | 90% | 2 | 15,75 | Must |
| Kartu `#tugas` + "Jadikan tugas" | 60 | 3 | 50% | 6 | 15,0 | Must (override strategis) |
| Moderasi + audit | 10 | 2 | 90% | 2 | 9,0 | Must (tata kelola) |
| Pencarian pesan | 40 | 1 | 70% | 5 | 5,6 | Should |
| Sinyal realtime | 100 | 0,5 | 50% | 5 | 5,0 | Could |
| Lampiran file | 50 | 1 | 70% | 7 | 5,0 | Won't (PRD-07) |
| Balasan thread | 40 | 1 | 50% | 6 | 3,33 | Could |
| Voice/video | 30 | 1 | 30% | 20 | 0,45 | Won't |

Contoh baris pertama: 80 × 2 × 0,8 ÷ 4 = 32,0. **Tambahan audit v1.1:** gabung/keluar channel (Reach 90, Impact 1, Confidence 90%, Effort 2 → 90 × 1 × 0,9 ÷ 2 = 40,5; Must) dan pengecualian DM di authz (1 hari, Must karena keputusan Q1). Total Must: 8 + 2 + 4 + 4 + 6 + 2 + 2 + 1 = 29 hari; ditambah channel proyek 4 (v1.2: 90 × 2 × 0,7 ÷ 4 = 31,5) = 33 hari; ditambah fondasi 34 (termasuk instrumentasi dan layout HP) = 67 hari.

**Dua override yang disengaja:** "Jadikan tugas" skornya di bawah reaksi karena confidence 50%, tetapi ia satu-satunya kapabilitas yang langsung menghasilkan aksi Project (WACO) — sekaligus hipotesis H4 yang harus diuji. Moderasi masuk Must karena kewajiban tata kelola (PRD-04, PRD-11), bukan karena reach.

### Kenapa bukan rilis 1 (jawaban "tidak" dengan data)

1. Kapasitas rilis 1 setelah rebalancing (PRD-00 v1.2.6 §4.2 langkah 7): BE 74,25, FE 74,25 ideal dev-day.
2. Ditambah Chat (v1.3): BE 74,25 + 33,5 = 107,75; FE 74,25 + 35 = 109,25.
3. Dengan contingency: BE 107,75 × 1,2 ÷ 3,5 = 36,94 minggu; FE 109,25 × 1,2 ÷ 3,5 = 37,46 minggu → **38 minggu**, bukan 26.
4. Selisih 12 minggu: M3 bergeser dari akhir W26 ke sekitar **akhir W38**.

Selain itu, tesis rilis 1 adalah membuktikan kerja harian di Project (PRD-00 §1). Chat di rilis 1 akan mengaburkan sinyal WACO dan, menurut Bagian 4, tidak bisa balik modal pada skala pilot. **Alternatif untuk stakeholder yang meminta chat sekarang:** Comments + @mention di tugas (Should #1) dan tautan tugas yang bisa ditempel di grup WhatsApp yang sudah ada.

## 6. Model domain, akses & data

**Channel mandiri adalah ACL container baru di PRD-04 §6.4; channel proyek bukan container — aksesnya diambil dari proyeknya. Pesan mewarisi akses percakapannya.** Chat tidak membuat model izin sendiri: semua keputusan lewat `authz.check` / `checkBatch` / `filter`.

### Model

```text
Organization
 └── Conversation { kind: project | channel | dm, last_seq }
      ├── Project channel (1 per proyek; akses = ACL proyek; siklus hidup = proyek)
      ├── Channel  (ACL container, preset Semua anggota | Terbatas)
      ├── DM       (peserta tetap 2–8 orang; bukan container yang bisa dibagikan)
      └── Message  (mewarisi akses conversation) { seq, body ≤ 4.000 karakter,
                     mentions[], task_links[], reactions[], edited_at, deleted_at }
```

### Akses

| Level channel (PRD-04 §6.3) | Yang diizinkan |
| --- | --- |
| view | Membaca, menerima notifikasi mention |
| edit | view + mengirim pesan, reaksi, edit/hapus pesan sendiri, "Jadikan tugas" (juga butuh edit di proyek tujuan) |
| manage | edit + ubah nama/deskripsi, ubah akses, arsipkan/hapus channel, hapus pesan orang lain |

- **Channel proyek (v1.2):** level akses = level user di proyek (PRD-06 §6.1): view proyek → view channel, edit → edit, manage → manage (moderasi). Proyek diarsipkan → channel hanya bisa dibaca. Proyek ke Sampah → channel tersembunyi dan ikut dipulihkan; proyek dipurge → pesan ikut dipurge. Tidak ada Share dialog, ganti nama, atau hapus terpisah; nama tampil = nama proyek. Override Admin untuk proyek Terbatas/Pribadi tercatat satu kali sebagai `access.override_used` proyek.
- **Mengikuti (v1.2):** pembuat proyek otomatis mengikuti channel proyeknya; mengirim pesan otomatis mengikuti; bergabung lewat banner "Ikuti" atau Jelajahi channel. Channel yang tidak diikuti tidak masuk sidebar dan tidak menambah badge (aturan belum dibaca di bawah).
- **Preset:** channel mandiri baru default **Semua anggota** (`org:<id>` → edit, pembuat → manage), sama seperti proyek. **Terbatas** memakai principal user/tim; "channel tim" cukup berupa Terbatas dengan `team:<id>` → edit, tanpa konsep baru.
- **DM:** setiap peserta punya akses edit; tidak ada manage, tidak bisa dibagikan, peserta tidak bisa ditambah. Menambah orang berarti membuat DM baru (menjaga konteks privat tetap privat).
- **Governance override (PRD-04 §6.6):** Owner/Admin bisa membuka channel Terbatas, tercatat sebagai `access.override_used`. DM dikecualikan dari override (keputusan Q1): Owner/Admin tidak bisa membuka DM di aplikasi, dan DM tidak muncul di daftar atau pencarian mereka. Alasannya: jika anggota khawatir DM dibaca Admin, percakapan pribadi kembali ke WhatsApp, persis yang ingin dihentikan PRD ini. DM tetap data organisasi: dipurge bersama organisasi, dan untuk investigasi hanya bisa diambil lewat ekspor data organisasi (PRD-13, rilis 2+) oleh Owner, dengan re-autentikasi, alasan tertulis, dan audit.
- **Anggota dikeluarkan atau ditangguhkan:** gagal di L1, akses hilang pada request berikutnya (p95 ≤ 10 detik, PRD-04 E4). Pesan yang sudah ditulis tetap sebagai milik organisasi, tampil sebagai "Budi S. (mantan anggota)" (PRD-03).
- **Work Ownership (PRD-03 §6.3):** Chat tidak punya pekerjaan yang bisa ditugaskan, jadi `countOpenWork` mengembalikan 0. Channel Terbatas yang kehilangan pemegang manage terakhir mengikuti aturan I3 PRD-04 yang sudah ada.
- **App dinonaktifkan:** data tetap, semua akses ditolak `APP_DISABLED`, notifikasi Chat berhenti (PRD-04 US-5).

### Data model (modul `chat`, TECH-01 §4)

Semua tabel memakai `organization_id` sebagai kolom pertama setiap indeks, UUIDv7, dan prefix URL `chn_`, `dm_`, `msg_` \[H\].

| Tabel | Kolom penting |
| --- | --- |
| `conversations` | `organization_id, id, kind (project \| channel \| dm), project_id (hanya kind project; unik `(organization_id, project_id)`), name, description, preset, last_seq, archived_at, deleted_at, created_by, version` — channel proyek dibuat lazy dengan `INSERT … ON CONFLICT (organization_id, project_id) DO NOTHING` |
| `conversation_participants` | `organization_id, conversation_id, user_id` — peserta DM dan anggota channel yang bergabung (kolom joined\_at; muted\_at untuk Should) |
| `conversation_reads` | `organization_id, conversation_id, user_id, last_read_seq, updated_at` — unik `(organization_id, conversation_id, user_id)`; dibuat saat bergabung ke channel atau saat DM dibuat, dengan last\_read\_seq = last\_seq saat itu |
| `messages` | `organization_id, id, conversation_id, seq, author_id, client_msg_id, body, edited_at, deleted_at, deleted_by, created_at, version` — unik `(organization_id, conversation_id, seq)` dan `(organization_id, author_id, client_msg_id)` |
| `message_reactions` | `organization_id, message_id, user_id, emoji` — unik (organization\_id, message\_id, user\_id, emoji); semua indeks diawali organization\_id sesuai TECH-01 §4 |
| `message_mentions` | `organization_id, message_id, user_id` |
| `message_task_links` | `organization_id, message_id, task_id, kind (link / created_from)` |

- **Urutan:** `seq` dibuat di transaksi yang sama lewat `UPDATE conversations SET last_seq = last_seq + 1 … RETURNING last_seq`. Row lock membuat urutan per percakapan monoton. Belum dibaca = `last_seq − last_read_seq`, tanpa menghitung baris.
- **PII (TECH-01 P6):** mention dan tautan disimpan sebagai token `<@usr_…>` dan `<#tsk_…>`; nama dan judul tugas dirender saat dibaca dari tabel pemiliknya. Isi pesan adalah konten workspace (kelas data yang sama dengan deskripsi tugas, PRD-13 §5).
- **Kartu `#tugas`:** judul dan status di-resolve saat dibaca dengan `authz.checkBatch`. Pembaca tanpa akses ke proyek hanya melihat "Tugas terbatas", tidak pernah judulnya.
- Indeks: `messages (organization_id, conversation_id, seq desc)`, `conversation_reads (organization_id, user_id)`, `message_mentions (organization_id, user_id)`.

**Aturan tambahan (audit v1.1):**

- **Belum dibaca:** `sendMessage` memajukan `last_read_seq` pengirim ke `seq` pesannya, sehingga pesan sendiri tidak dihitung. Saat bergabung ke channel, `last_read_seq` diisi `last_seq` saat itu, sehingga riwayat lama tidak muncul sebagai ratusan pesan belum dibaca. Channel yang tidak diikuti tidak dihitung.
- **Konkurensi:** menaikkan `last_seq` tidak menaikkan `version`; `version` hanya berubah saat nama, deskripsi, atau status channel berubah. Tanpa aturan ini, setiap pesan baru memicu `VERSION_CONFLICT` palsu saat channel diubah namanya.
- **Pengecualian DM di authz (amandemen PRD-04 §6.1):** short-circuit "Owner/Admin → ALLOW" tidak berlaku untuk container `chat.dm`; Owner/Admin yang bukan peserta mendapat `NOT_FOUND` (404).

## 7. Pengiriman pesan di Vercel

**Rekomendasi: mulai dengan polling adaptif lewat satu endpoint sync; pindah ke sinyal realtime terkelola hanya saat trigger terukur tercapai.** Fungsi Vercel tidak menahan koneksi WebSocket, dan TECH-01 memilih tanpa WebSocket di rilis 1. Polling memakai ulang pola yang sudah ada (badge 60 detik, papan 30 detik), sehingga tidak ada infrastruktur atau subprocessor baru.

```text
Jalur tulis : Klien pengirim --1 kirim--> sendMessage (Server Action + authz) --2 simpan--> Postgres (pesan, seq, outbox)
Jalur async : Postgres --3 commit--> dispatch (waitUntil + sweeper) --4 mention--> Notifications (PRD-10) --5 inbox--> Inbox (badge poll 60 dtk)
Jalur baca  : Klien penerima --a poll tiap 4 dtk--> GET chat/sync --b baca + checkBatch--> Postgres
```

Langkah 1–2 adalah jalur tulis TECH-01 §5.2: validasi Zod, `authz.check(edit)`, lalu satu transaksi berisi pesan, `seq`, dan `events.publish`. Klien menganggap pesan terkirim setelah langkah 2. Langkah 3–5 asinkron dan idempoten; kegagalannya tidak pernah menghilangkan pesan. Langkah a–b adalah jalur baca: klien penerima mengirim cursor dan mendapat percakapan yang berubah serta pesan baru untuk percakapan yang terbuka.

### Opsi

| Kriteria | A — Polling adaptif (**direkomendasikan untuk MVP**) | B — Sinyal realtime terkelola, tanpa isi pesan (jalur upgrade) | C — Server WebSocket sendiri |
| --- | --- | --- | --- |
| Infrastruktur baru | Tidak ada | Provider realtime (subprocessor baru) | Server di luar Vercel |
| Latensi terima p95 | ≈ 4 detik (interval) + waktu fetch | < 1 detik + waktu fetch | < 1 detik |
| Data yang keluar dari Vercel/Postgres | Tidak ada | Hanya `{channel_key, seq}`; `channel_key` = HMAC dari id percakapan | Semua pesan |
| Otorisasi | `checkBatch` setiap sync | Token langganan ≤ 5 menit per user; isi tetap diambil lewat sync ber-authz | Harus dibangun ulang di server socket |
| Beban operasional 1 BE | Terendah | Rendah + satu vendor | Tinggi |
| Kesesuaian dengan prinsip Index | Penuh | Perlu entri subprocessor PRD-13 dan review legal L4 | Melanggar "satu proyek Vercel" |

**C ditolak.** B dipasang di belakang adapter `realtime.signal()` agar pergantian dari A ke B hanya menyentuh satu komponen, pola yang sama dengan Vercel Queues di PRD-00b §10.

### Aturan polling (opsi A)

- Satu request per klien, bukan per percakapan: `GET /{slug}/api/chat/sync?cursor=…` mengembalikan percakapan dengan `last_seq` baru, jumlah belum dibaca, dan pesan baru untuk percakapan aktif.
- Interval: **4 detik** saat halaman Chat terlihat dan fokus; **30 detik** saat tab terlihat di halaman lain (untuk badge navigasi); **berhenti** saat tab tersembunyi, langsung sync saat fokus kembali. Halaman Chat terlihat tetapi jendela tidak fokus: 10 detik.
- Gagal: backoff 4 → 8 → 16 → 30 detik; tidak pernah menampilkan pesan sebagai terkirim sebelum ack server.
- Respons tanpa perubahan berukuran kecil dan hanya membaca `conversations.last_seq` yang terindeks.

### Volume request dan trigger upgrade

Asumsi \[H\]: 15 anggota per org, 40% membuka Chat selama 8 jam kerja, 22 hari kerja per bulan.

| Skala | Viewer aktif | Request/detik (÷ 4 detik) | Request per hari kerja (× 28.800 detik) | Per bulan |
| --- | --- | --- | --- | --- |
| Pilot 10 org | 10 × 15 × 40% = 60 | 15 | 432.000 | 9,5 juta |
| 200 org | 200 × 15 × 40% = 1.200 | 300 | 8.640.000 | 190 juta |

**Trigger pindah ke B** (salah satu): puncak berkelanjutan > 50 request/detik ke endpoint sync; latensi terima p95 > 5 detik selama 2 minggu; atau biaya fungsi sync melewati batas yang ditetapkan budget owner. BE memverifikasi angka di atas terhadap kuota plan Vercel Pro sebelum sprint pertama Chat, karena harga plan bisa berubah.

**Catatan audit:** trigger 50 request/detik tercapai pada sekitar 50 ÷ (15 × 40% ÷ 4) = **33 org aktif**. Artinya opsi B kemungkinan besar dibutuhkan tak lama setelah rilis publik. Opsi B diestimasi BE 3 + FE 2 hari \[H\] dan dicadangkan sebagai item pertama setelah MVP bila org aktif dengan Chat melewati 30.

## 8. Kontrak dengan modul lain

**Isi pesan tidak pernah masuk event, outbox, audit, atau log; yang bergerak hanya id.** Ini menjaga PRD-00b §6 (data minimum) dan PRD-13 (PII terbatas) tanpa aturan khusus untuk Chat.

### Event baru untuk katalog PRD-00b §8.1

| Type | Scope | Producer | Consumer | Audit (tx) |
| --- | --- | --- | --- | :-: |
| `chat.channel.created` / `.updated` / `.archived` / `.restored` (channel mandiri saja; channel proyek tidak punya event siklus hidup sendiri, mengikuti `space.project.*`) | org | Chat | — | — |
| `chat.channel.deleted` | org | Chat | — | ✓ |
| `chat.dm.created` | org | Chat | — | — |
| `chat.message.created` | org | Chat | Notify (hanya mention) | — |
| `chat.message.updated` / `.deleted` (oleh penulis) | org | Chat | — | — |
| `chat.message.moderated` (dihapus oleh manage/Admin) | org | Chat | — | ✓ |

- `data` berisi id saja: `conversation_id`, `message_id`, `seq`, `mentioned_user_ids` (ditandai di `pii`). Tidak ada `body`.
- Hapus oleh penulis dan oleh moderator adalah dua type berbeda karena flag audit diambil dari katalog, bukan dari pemanggil (PRD-00b §6).
- Perubahan akses channel memakai `access.acl.changed` (PRD-04), sama seperti proyek.
- **"Jadikan tugas"** memanggil `createTask` milik Project, yang menerbitkan `space.task.created` dengan field opsional baru `data.source = {module: "chat", type: "message", id}`. Field opsional tidak menaikkan `version` (PRD-00b D7).

**Privasi "Jadikan tugas" (audit v1.1, v1.2):** isi pesan dari DM, channel Terbatas, atau channel proyek yang tidak berpreset "Semua anggota" bisa pindah ke proyek yang lebih terbuka. Dari channel proyek, proyek tujuan default = proyek itu sendiri dan tidak ada peringatan. Jika sumbernya DM atau channel Terbatas (atau proyek Terbatas/Pribadi dan tujuannya proyek lain), dialog menampilkan peringatan "Isi pesan ini akan terlihat oleh semua yang bisa membuka proyek {nama}." sebelum "Buat tugas". Tautan "Dibuat dari percakapan" di tugas di-resolve saat dibaca; pembaca tanpa akses ke percakapan hanya melihat "Percakapan terbatas".

### Aturan notifikasi baru untuk PRD-10 §5

| Event | Penerima | Kanal | Copy (id-ID) |
| --- | --- | --- | --- |
| `chat.message.created` dengan mention | User yang disebut dan bisa melihat percakapan, kecuali pelaku | In-app | "**Rina** menyebut Anda di **#pemasaran**" |
| `chat.message.created` di DM | Tidak ada item inbox; tercermin di badge belum dibaca pada navigasi Chat | — | — |

Alasan DM tidak masuk inbox: prinsip PRD-10 "notifikasi memunculkan aksi, bukan activity feed", dan satu item per pesan akan membanjiri inbox. Diuji ulang di pilot (Q2). Email untuk Chat tidak ada, mengikuti PRD-10 rilis 1 (email hanya untuk hal kritis akun).

### Audit (PRD-11)

Tercatat: `chat.channel.deleted`, `chat.message.moderated`, `access.acl.changed` pada channel, dan `access.override_used` saat Admin membuka channel Terbatas tanpa grant. Viewer PRD-11 §5.5 mendapat grup aksi baru **Chat**.

### Retensi & privasi (amandemen PRD-13)

| Data | Retensi | Lalu |
| --- | --- | --- |
| Pesan chat (konten workspace; agere = processor) | Selama organisasi ada | Dipurge bersama organisasi |
| Pesan dihapus penulis atau moderator | `body` dikosongkan di transaksi yang sama; baris tetap sebagai "Pesan dihapus" agar `seq` utuh | Tidak ada masa Sampah |
| Channel dihapus | Sampah 30 hari, bisa dipulihkan oleh manage | Dipurge beserta pesannya |
| Pesan dari akun yang dihapus (PRD-13 §6.3) | Tetap sebagai konten organisasi, penulis tampil "Pengguna terhapus" | \[Legal L1/L2\] |

Pesan tidak masuk Sampah karena pengguna memperlakukan "hapus pesan" sebagai hilang, dan menyimpan isinya 30 hari memperpanjang retensi PII tanpa manfaat.

### Server contract (tambahan TECH-01 §7)

| Jenis | Nama |
| --- | --- |
| Server Actions | `createChannel`, `updateChannel`, `archiveChannel`, `deleteChannel`, `restoreChannel`, `openDm`, `sendMessage`, `editMessage`, `deleteMessage`, `moderateMessage`, `toggleReaction`, `markRead`, `convertMessageToTask` |
| RSC loaders | `listConversations`, `getConversation`, `listMessages(before_seq, limit 50)` |
| Route Handler | `GET /{slug}/api/chat/sync?cursor=` |
| Cache tags | `org:{id}:chat`, `chat:{conversation_id}` |

Semua mengembalikan `ActionResult<T>` (TECH-01 §5.3). `sendMessage` wajib membawa `client_msg_id`; edit membawa `version`. Batas laju: 10 pesan per 10 detik per user \[H\] → `RATE_LIMITED`.

## 9. UX

**Chat dirakit dari modul Chat di Agere DS 6.3 (ChannelSidebar, MessageBubble, ChatInputBar) di dalam shell UI-01; tidak ada komponen baru yang digambar dari nol.** Pola panel mengikuti blok Inbox DS: dua panel di desktop, satu panel dengan "Kembali" di bawah 768 px.

### Navigasi & rute

- NavMain (UI-01) mendapat item **Chat** dengan badge belum dibaca (maks. "99+"). Item hanya muncul bila user punya app access `chat`.
- **Channel proyek (v1.2)** tampil di tiga tempat: tab **Channel** di ruang proyek (tab pertama, PRD-06 §6.7), baris "# Channel" di pohon sidebar proyek (dengan jumlah belum dibaca bila diikuti; nama aksesibel "Peluncuran Q4, 3 pesan belum dibaca"), dan daftar Channel di halaman Chat (dengan badge huruf proyek).
- Rute: `/{slug}/chat` (percakapan terakhir, atau Umum), `/{slug}/chat/{channel_id}` (termasuk channel proyek), `/{slug}/chat/dm/{dm_id}`, dan `/{slug}/projects/{project_id}/channel`. Percakapan aktif ada di URL (TECH-01 §8).

```text
┌ Maju Jaya ▾ │ Chat                                          ⌘K  tema  lonceng┐
│ Channel            + │ # pemasaran · 6 anggota         [Bagikan] ⋯ │
│  # umum              │ Rina  09.12                                  │
│  # pemasaran     3 @1│   Harga paket baru final Jumat ya @Dimas     │
│  # tim-ops           │ Dimas 09.15                                  │
│ Pesan langsung     + │   Oke. #Riset harga → [▢ Sedang dikerjakan]  │
│  (R) Rina            │              ── Pesan baru ↓ ──              │
│  (S) Sari, Budi  1   │ [ Tulis pesan ke #pemasaran…   @  #  ] [Kirim]│
└──────────────────────┴─────────────────────────────────────┘
```

### Pemetaan komponen Agere DS

| Kebutuhan | Komponen DS | Catatan |
| --- | --- | --- |
| Daftar channel dan DM | `ChannelSidebar` di `ScrollArea` | Jumlah belum dibaca dan mention ada di nama aksesibel |
| Pesan | `MessageBubble` (terkirim/diterima, reaksi, kartu tugas terhubung, gagal/coba lagi) | Pesan beruntun dari penulis yang sama dikelompokkan |
| Composer | `ChatInputBar` (`@` orang, `#` tugas) | Tombol lampiran disembunyikan (Won't) |
| Orang dan tim | `Avatar` (lingkaran untuk orang, persegi untuk tim) | Selalu dengan `name` |
| Buat channel, "Jadikan tugas" | `Dialog`, `Select`, `Input`, `Combobox` | Fokus awal di input pertama (UI-01) |
| Akses channel | Share dialog PRD-04 §8.1 | Tanpa varian baru |
| Aksi pesan | `DropdownMenu` ⋯ (semua aksi klik kanan juga ada di sini) | Edit, Hapus, Jadikan tugas, Salin tautan |
| Umpan balik | `Toast`, `EmptyState`, `Skeleton`, `Alert` | Satu `Toaster` di root |

- **Satu aksi primer per tampilan:** tombol "Kirim" (`brand-default`). "+ Channel" adalah tombol ghost di sidebar.
- **Kartu `#tugas`:** chip status memakai token `task-*` beserta bentuk indikatornya, judul, proyek, penanggung jawab, tenggat. Tanpa akses: "Tugas terbatas".
- **"Jadikan tugas":** ⋯ → Dialog "Buat tugas dari pesan": Proyek (hanya proyek dengan akses edit), Papan, Judul (terisi 200 karakter pertama), Penanggung jawab, Tenggat; tombol primer "Buat tugas". Setelah berhasil: toast "Tugas dibuat." dengan aksi "Buka tugas", dan pesan asal mendapat chip tugas.

### Spesifikasi token (audit v1.1)

Semua nilai memakai token Agere DS 6.3; lebar yang belum punya token ditandai \[H\] dan diusulkan ke DS, bukan ditulis sebagai angka lepas di kode.

| Elemen | Layout | Spacing | Tipografi | Warna & elevasi |
| --- | --- | --- | --- | --- |
| Panel channel | Flex kolom di `ScrollArea`; lebar 272 px (sama dengan UI-01 v1.5) \[H: usulkan token panel ke DS\] | Padding `space-3`; baris 40 px (density comfortable) | Nama `body-md`; hitungan `label-md` + `tabular-nums` | Latar `bg-muted`; hover `bg-subtle`; aktif `bg-emphasis` + `aria-current` |
| Header percakapan | Flex baris, `justify-between`; tinggi min 56 px (sama dengan bar modal UI-01) | Padding-x `space-6` | Nama `heading-md`; meta `body-sm` `fg-subtle` | Garis bawah `border-default` |
| Log pesan | Flex kolom; lebar teks maks `grid-max-width-prose` | Antar-kelompok `space-4`; antar-pesan dalam kelompok `space-1`; padding `space-6` | Isi `body-md`; nama `label-md`; jam `body-sm` `fg-subtle` | Latar `bg-default`; pesan yang menyebut saya: `bg-subtle` + label teks "Menyebut Anda" |
| Composer | Flex baris, menempel di bawah | Padding `space-3`, gap `space-2`; input ukuran lg 40 px | `body-md` (16 px di HP, tanpa zoom iOS) | Border `border-control`; fokus `focus-ring`; tombol Kirim `brand-default` |
| Badge belum dibaca | Pill | Padding-x `space-1-5` | `label-md` + `tabular-nums` | `brand-default` / `brand-fg`; sebutan ditulis "@1", tidak hanya warna |

**Nama channel:** huruf kecil, angka, dan tanda hubung, 1–40 karakter, unik per organisasi tanpa membedakan huruf besar/kecil. Channel Umum tampil sebagai `#umum`.

**Keyboard per pesan:** daftar pesan memakai roving tabindex; ↑/↓ berpindah antarpesan, Enter membuka menu ⋯, dan Esc kembali ke composer. Log memuat 50 pesan per halaman dan divirtualisasi di atas 200 pesan agar tetap ringan di Android kelas menengah (gate G5).

### Lima state

| State | Perilaku dan microcopy |
| --- | --- |
| Ideal | Pesan terbaru di bawah; pemisah tanggal "Hari ini", "Kemarin", "24 Sep 2026"; jam 14.30 |
| Empty | Channel baru: `EmptyState` "Belum ada pesan di #pemasaran" + "Mulai diskusi atau sebut rekan dengan @." Tidak ada DM: "Belum ada pesan langsung." + aksi "Mulai pesan". Chat nonaktif untuk Admin: "Chat belum aktif di organisasi ini." + "Aktifkan di Organisasi › Aplikasi" |
| Loading | Sidebar 6 baris skeleton; percakapan 5 gelembung skeleton; tidak ada kilatan state kosong |
| Error | Muat gagal: "Pesan belum bisa dimuat. Periksa koneksi Anda, lalu coba lagi." + "Coba lagi". Kirim gagal: gelembung dengan `role="alert"` "Pesan belum terkirim." + "Coba lagi" / "Hapus" |
| Partial | Sync gagal tetapi pesan sudah tampil: banner kecil "Menyambung ulang…" dan backoff (Bagian 7). Hanya bisa melihat: composer diganti "Anda hanya bisa membaca channel ini." Channel diarsipkan: "Channel ini diarsipkan." + "Pulihkan" (manage). Tautan tugas tanpa akses: "Tugas terbatas" |

### Aksesibilitas (WCAG 2.1 AA, gate G6)

- Daftar pesan `role="log"` dengan `aria-live="polite"`; fokus tidak pernah dicuri saat pesan masuk.
- Enter mengirim, Shift+Enter baris baru; `@` / `#` membuka saran; ↑/↓ dan Enter/Tab memilih; Esc menutup.
- Tidak auto-scroll saat user sedang menggulir ke atas; tampilkan "Pesan baru" sebagai tombol.
- Nama aksesibel channel memuat jumlah: "pemasaran, 3 belum dibaca, 1 sebutan". Status tidak pernah hanya dengan warna.
- Target ≥ 24 × 24 px; semua animasi mati di `prefers-reduced-motion`.

### Microcopy utama (id-ID, "Anda", sentence case)

| Konteks | Teks |
| --- | --- |
| Placeholder composer | "Tulis pesan ke #pemasaran…" |
| Tombol | "Kirim", "Buat channel", "Mulai pesan", "Buat tugas" |
| Hapus pesan (konfirmasi) | Judul "Hapus pesan?" · isi "Pesan ini akan hilang untuk semua anggota." · tombol "Hapus pesan" |
| Pesan dihapus | "Pesan dihapus" / "Pesan dihapus oleh admin" |
| Batas laju | "Anda mengirim terlalu cepat. Tunggu beberapa detik, lalu kirim lagi." |
| Pesan terlalu panjang | "Pesan maksimal 4.000 karakter. Pecah menjadi beberapa pesan." |
| Mention tanpa akses | "Budi tidak bisa melihat channel ini, jadi tidak akan diberi tahu." |

**Info privasi di panel detail DM dan kaki daftar Chat** (wajib, karena keputusan Q1; diperjelas QA CH2): "Pesan langsung hanya terlihat oleh peserta. Pesan tetap milik organisasi dan hanya bisa diekspor oleh Owner untuk keperluan hukum. Setiap ekspor tercatat."

## 10. User stories & acceptance criteria

**Sepuluh story, masing-masing dengan jalur gagal; setiap AC menjadi test otomatis sebelum implementasi (gate G1, alur Antigravity).** Definition of Done bersama: AC lulus di CI, matriks tenancy G2 diperluas ke Chat, event dan metrik terkirim, lima state dibangun, lulus axe tanpa temuan critical/serious.

### US-1 — Aktifkan Chat

**Context:** app baru harus mengikuti registry PRD-04, dan org butuh tempat mulai agar tidak kosong. **Story:** Sebagai Admin, saya ingin mengaktifkan Chat untuk organisasi, agar anggota bisa mulai berdiskusi di tempat yang sama dengan pekerjaan.

```gherkin
Given saya Admin di Maju Jaya dan Chat belum aktif
When saya mengaktifkan Chat di Organisasi › Aplikasi
Then access.app.enabled tercatat di audit
And anggota dengan app access melihat item Chat di navigasi pada request berikutnya

Given Chat aktif dan belum ada channel Umum
When anggota pertama membuka /maju-jaya/chat
Then channel "Umum" dibuat satu kali dengan preset "Semua anggota", pembuka mengikutinya dan diarahkan ke sana
And setiap anggota lain otomatis mengikuti Umum saat pertama membuka Chat

Given dua anggota membuka Chat untuk pertama kali secara bersamaan
Then hanya satu channel Umum yang terbentuk

Given Chat dinonaktifkan lalu diaktifkan kembali
Then channel Umum yang lama dipakai lagi dan tidak dibuat yang baru

Given Sari tidak punya app access ke Chat
When Sari membuka /maju-jaya/chat
Then ia melihat halaman "Anda belum punya akses ke Chat" (PRD-04 §8.3)
```

**Metrik:** waktu dari aktivasi ke pesan pertama di org (median).

### US-2 — Channel terbatas untuk tim

**Context:** diskusi sensitif tidak boleh bocor ke seluruh org (persona Owner). **Story:** Sebagai Team lead, saya ingin membuat channel yang hanya bisa diakses tim saya.

```gherkin
Given saya punya app access Chat
When saya membuat channel "tim-ops" dengan akses "Terbatas" dan menambahkan Tim Ops sebagai Edit
Then hanya saya dan anggota aktif Tim Ops yang bisa melihat, mencari, atau membuka channel dan pesannya
And access.acl.changed tercatat di audit

Given Budi bukan anggota Tim Ops dan punya tautan langsung ke channel
When Budi membukanya
Then responsnya 404 dan UI menampilkan "Halaman tidak ditemukan"

Given nama "tim-ops" sudah dipakai di Maju Jaya
Then pembuatan ditolak dengan "Nama channel sudah dipakai. Pilih nama lain."
```

**Metrik:** % channel dengan preset Terbatas (indikasi kebutuhan privasi).

### US-3 — Kirim dan terima pesan

**Context:** fondasi; tanpa keandalan, user kembali ke WhatsApp. **Story:** Sebagai anggota, saya ingin pesan saya sampai ke rekan dalam hitungan detik dan tidak pernah hilang atau ganda.

```gherkin
Given Rina dan Dimas sama-sama membuka #pemasaran
When Rina mengirim "Harga final Jumat"
Then pesan tampil di layar Rina segera dengan status "Mengirim…" lalu terkirim setelah ack server
And pesan tampil di layar Dimas dalam ≤ 5 detik (p95)
And urutan pesan sama di semua klien, mengikuti seq

Given koneksi Rina terputus setelah server menyimpan pesan tetapi sebelum ack diterima
When klien mengirim ulang dengan client_msg_id yang sama
Then server mengembalikan pesan yang sama dan tidak ada baris ganda

Given server menolak pesan (jaringan, 503, atau RATE_LIMITED)
Then gelembung menampilkan "Pesan belum terkirim." dengan "Coba lagi" dan "Hapus", dan pesan tidak pernah tampil sebagai terkirim
```

**Metrik:** pesan hilang = 0; pesan ganda = 0; latensi p95 ≤ 5 detik.

### US-4 — Pesan langsung

**Story:** Sebagai anggota, saya ingin mengirim pesan pribadi ke 1–7 rekan, agar koordinasi kecil tidak mengganggu channel.

```gherkin
Given saya memilih Sari dan Budi
When saya mengirim pesan pertama
Then satu DM dibuat dan hanya kami bertiga yang bisa membukanya

Given sudah ada DM antara saya, Sari, dan Budi
When saya memulai DM dengan orang yang sama
Then saya diarahkan ke DM yang sudah ada

Given saya memilih 8 orang selain saya
Then tombol mulai nonaktif dengan "Maksimal 8 orang dalam satu pesan langsung."

Given Yacobus adalah Owner dan bukan peserta DM antara Sari dan Budi
When Yacobus membuka URL DM itu atau memanggil API-nya
Then responsnya 404, DM tidak muncul di daftar atau pencarian Yacobus, dan tidak ada access.override_used yang tercatat
```

**Metrik:** rasio pesan DM : channel (DM > 70% menandakan diskusi kembali tertutup).

### US-5 — @mention

**Story:** Sebagai anggota, saya ingin diberi tahu hanya saat saya disebut, agar responsif tanpa kelelahan notifikasi.

```gherkin
Given Dimas bisa melihat #pemasaran
When Rina mengirim "@Dimas tolong cek harga"
Then tepat satu notifikasi in-app untuk Dimas ada dalam ≤ 60 detik, bertautan ke pesan tersebut

Given Rina menyebut dirinya sendiri
Then tidak ada notifikasi

Given Budi tidak bisa melihat #pemasaran
When Rina mengetik @Budi
Then composer memperingatkan "Budi tidak bisa melihat channel ini, jadi tidak akan diberi tahu." dan Budi tidak mendapat notifikasi

Given delivery chat.message.created diulang setelah crash
Then Dimas tetap hanya punya satu notifikasi untuk event itu (PRD-00b D5)
```

**Metrik:** median waktu respons setelah mention (jam kerja); read rate PRD-10 tetap ≥ 60%.

### US-6 — Kartu tugas dan "Jadikan tugas"

**Context:** jembatan ke WACO dan hipotesis H4. **Story:** Sebagai Team lead, saya ingin mengubah pesan menjadi tugas dalam satu langkah, agar keputusan langsung dieksekusi.

```gherkin
Given ada pesan "Sari, update halaman harga sebelum Jumat" di #pemasaran
And saya punya edit di proyek "Q4 Launch"
When saya memilih "Jadikan tugas", memilih Q4 Launch, penanggung jawab Sari, tenggat Jumat, lalu "Buat tugas"
Then tugas dibuat di papan default kolom todo pertama, space.task.created terbit dengan data.source menunjuk pesan itu
And Sari mendapat notifikasi penugasan (PRD-10), pesan asal menampilkan chip tugas, dan toast "Tugas dibuat." muncul dengan "Buka tugas"

Given saya tidak punya edit di proyek mana pun
Then opsi "Jadikan tugas" tidak tampil

Given pesan sumber ada di DM atau channel Terbatas dan proyek tujuan berpreset "Semua anggota"
When saya membuka dialog "Jadikan tugas"
Then dialog menampilkan "Isi pesan ini akan terlihat oleh semua yang bisa membuka proyek Q4 Launch." sebelum tombol "Buat tugas"

Given Budi bisa melihat tugas tetapi bukan peserta percakapan sumbernya
Then tautan "Dibuat dari percakapan" tampil sebagai "Percakapan terbatas" tanpa isi pesan

Given Dimas mengirim "#Riset harga" dan Budi tidak bisa melihat proyeknya
Then Budi melihat kartu "Tugas terbatas" tanpa judul, status, atau nama proyek

Given pembuatan tugas gagal
Then dialog tetap terbuka dengan isian utuh dan pesan "Tugas belum dibuat. Coba lagi."
```

**Metrik:** konversi chat → tugas ≥ 2 per org WCO per minggu \[H\].

### US-7 — Edit, hapus, moderasi

**Story:** Sebagai Admin, saya ingin menghapus pesan yang melanggar kebijakan dan jejaknya tercatat.

```gherkin
Given Rina mengirim pesan 5 menit lalu
When Rina mengeditnya
Then pesan diperbarui dengan label "(diedit)" di semua klien pada sync berikutnya

Given Rina mengedit pesan yang sama dari tab lain dengan versi lama
Then editnya ditolak dengan VERSION_CONFLICT dan "Pesan ini baru saja diubah. Muat ulang untuk melihat versi terbaru."

Given saya Admin
When saya menghapus pesan Budi
Then body dikosongkan di transaksi yang sama, semua klien menampilkan "Pesan dihapus oleh admin"
And chat.message.moderated tercatat di audit dengan pelaku, waktu, dan id pesan
```

**Metrik:** 100% moderasi tercatat di audit.

### US-8 — Akses dicabut

```gherkin
Given Budi sedang membuka #tim-ops
When Budi dikeluarkan dari Tim Ops dan tidak punya grant lain
Then sync berikutnya tidak lagi mengembalikan #tim-ops, dan membuka ulang channel menghasilkan 404

Given Budi dikeluarkan dari Maju Jaya (PRD-03)
Then request berikutnya ditolak NOT_MEMBER (p95 ≤ 10 detik) dan pesan lamanya tampil sebagai "Budi S. (mantan anggota)"

Given Budi punya notifikasi mention di #tim-ops
Then notifikasi itu disembunyikan dari inbox Budi dan tidak dihitung (PRD-10 US-4)
```

### US-9 — Isolasi organisasi dan app nonaktif

```gherkin
Given sebuah pesan milik organisasi A
When user organisasi B memintanya lewat id, URL, atau cursor sync
Then responsnya 404

Given Chat dinonaktifkan untuk Maju Jaya
Then semua halaman dan endpoint Chat mengembalikan APP_DISABLED, notifikasi Chat berhenti, dan data tetap utuh saat diaktifkan kembali
```

### US-10 — Belum dibaca

```gherkin
Given ada 3 pesan baru dari orang lain di #pemasaran sejak saya terakhir membaca
Then navigasi Chat dan baris #pemasaran menampilkan 3, dengan nama aksesibel "pemasaran, 3 belum dibaca"
When saya membuka #pemasaran dan menggulir sampai pesan terakhir
Then last_read_seq diperbarui dan hitungan menjadi 0 di semua tab saya pada sync berikutnya

Given saya mengirim pesan di #pemasaran
Then hitungan belum dibaca saya untuk #pemasaran tidak bertambah

Given #arsip-2025 punya 2.000 pesan dan saya baru bergabung
Then hitungan belum dibaca #arsip-2025 adalah 0

Given ada 5 pesan baru di channel publik yang tidak saya ikuti
Then channel itu tidak muncul di sidebar dan tidak menambah badge Chat

Given saya sedang menggulir ke atas saat pesan baru masuk
Then posisi gulir tidak berubah dan tombol "Pesan baru" muncul
```

### US-11 — Channel proyek (v1.2)

**Context:** diskusi pekerjaan terjadi di tempat pekerjaannya, bukan di channel terpisah yang harus dicari. **Story:** Sebagai Team lead, saya ingin setiap proyek punya channel sendiri yang aksesnya sama dengan proyeknya, agar tidak perlu mengatur akses dua kali.

```gherkin
Given proyek "Kampanye Ramadan" Terbatas untuk Tim Sales
When Rina (Tim Sales) membuka tab Channel pertama kali
Then satu channel proyek dibuat (idempoten) dan Rina bisa membaca dan menulis
And Dewi (bukan Tim Sales) mendapat 404 untuk /projects/{id}/channel maupun /chat/{channel_id}

Given Budi hanya punya view di proyek
Then composer diganti "Anda hanya bisa membaca channel ini."

Given proyek diarsipkan
Then channel menjadi read-only; saat proyek dipulihkan, channel kembali bisa ditulis

Given proyek dipindahkan ke Sampah lalu dipurge
Then pesan channel proyek ikut dipurge dan tidak ada chat.channel.deleted yang terbit

Given saya membuat proyek baru
Then saya otomatis mengikuti channel proyeknya
And kunjungan pertama ke proyek membuka tab Papan (urutan landing: tab terakhir → Channel bila diikuti dan berisi pesan → Papan; PRD-06 §6.7)

Given saya memilih "Jadikan tugas" pada pesan di channel proyek "Q4 Launch"
Then proyek tujuan terisi "Q4 Launch" dan tidak ada peringatan privasi
```


### US-12 — Lihat anggota dan kirim DM (v1.3)

**Context:** pengguna perlu tahu siapa yang ada di sebuah space atau proyek sebelum bertanya, dan langsung menghubunginya tanpa mencari di tempat lain. **Story:** Sebagai anggota, saya ingin melihat siapa saja yang punya akses ke percakapan ini dan langsung mengirim pesan pribadi.

```gherkin
Given channel space "Marketing" bisa dibuka 8 anggota aktif
When saya membuka channel itu
Then panel Anggota menampilkan "Anggota space 8" dengan kelompok Online dan Offline, peran dan tim tiap orang
And orang tanpa akses ke space tidak pernah tampil

Given DM antara saya dan Sari belum ada
When saya memilih "Pesan" pada baris Sari
Then satu DM 1:1 dibuat (chat.dm.created), percakapan terbuka, dan kursor berada di composer
Given DM antara saya dan Sari sudah ada
Then DM yang sama dibuka dan tidak ada DM baru

When saya mengetik "des" di kotak cari panel
Then hanya anggota yang nama atau timnya memuat "des" yang tampil

Given baris saya sendiri
Then tidak ada tombol "Pesan" dan nama saya diberi label "(Anda)"
```

## 11. Edge cases & non-functional requirements

**Batas dan target di bawah adalah hipotesis \[H\] yang divalidasi dengan load test sebelum pilot Chat, dengan pola gate G5 PRD-00.**

### Edge cases

| Kasus | Perilaku |
| --- | --- |
| Dua pesan dikirim bersamaan ke percakapan yang sama | Row lock pada `conversations` menyerialkan `seq`; keduanya tersimpan dengan urutan pasti |
| Pesan asal "Jadikan tugas" diedit | Tugas tidak berubah; chip tugas tetap di pesan |
| Pesan asal dihapus | Tugas tetap; tautan "Dibuat dari percakapan" menampilkan "Pesan dihapus" |
| Tugas yang ditautkan dihapus ke Sampah | Kartu menampilkan "Tugas ini sudah dihapus atau Anda tidak punya akses" (pola PRD-10) |
| Hapus pesan yang punya reaksi | Reaksi ikut dihapus bersama body |
| Channel diarsipkan saat user mengetik | Kirim ditolak dengan "Channel ini diarsipkan."; draf tetap di composer |
| Channel terakhir dengan manage kehilangan pengelola | Aturan I3 PRD-04 memindahkan manage ke target reassignment |
| Peserta DM dikeluarkan dari org | DM tetap untuk peserta lain; peserta itu tampil "(mantan anggota)" |
| Semua peserta DM lain keluar | DM tetap bisa dibaca, composer diganti "Tidak ada peserta aktif lain." |
| Mention ke tim (`@Tim Ops`) | Won't di MVP; hanya user yang bisa disebut. Mencegah notifikasi massal |
| Organisasi `pending_deletion` | Chat menjadi read-only; data dipurge bersama org (PRD-02, PRD-13) |
| Tab dibuka di dua perangkat | `markRead` idempoten; hitungan menyatu pada sync berikutnya |

### Performa

| Kebutuhan | Target |
| --- | --- |
| `sendMessage` sampai ack (server) | p95 ≤ 300 ms, selaras move persist PRD-06 |
| Kirim → terlihat di klien lain yang aktif | p95 ≤ 5 detik (interval 4 detik + fetch) |
| `GET chat/sync` termasuk `checkBatch` untuk ≤ 50 percakapan | p95 ≤ 150 ms |
| Muat 50 pesan terakhir | p95 ≤ 300 ms |
| Load test | Org 500 anggota, 200 channel, 1 juta pesan, 60 viewer aktif |

### Batas

Pesan ≤ 4.000 karakter; ≤ 500 channel aktif per org; DM ≤ 8 peserta; 10 pesan per 10 detik per user; 6 emoji reaksi tetap.

### Keamanan & privasi

- Setiap loader, action, dan sync melewati L1–L4 PRD-04; fail-closed dengan `UNAVAILABLE` (E5).
- Aturan pengungkapan E6: 404 untuk percakapan milik org lain atau tanpa akses; 403 untuk view tanpa edit.
- Cursor sync ditandatangani dan terikat ke `user_id` + `organization_id`; cursor dari org lain ditolak.
- Isi pesan tidak ditulis ke event, audit, maupun log (TECH-01 §10 butir 4).
- Markdown dirender dengan allowlist (tanpa HTML mentah); tautan eksternal memakai `rel="noopener noreferrer"`.

### Aksesibilitas & bahasa

WCAG 2.1 AA ditambah aturan target dan fokus WCAG 2.2 dari Agere DS; semua copy Bahasa Indonesia dengan "Anda" (gate G10).

## 12. Rollout, kapasitas & jadwal

**Paling cepat Chat dibangun di W27–W38 (12 minggu setelah M3), dan hanya jika G-Chat lolos di M3 serta Chat menempati urutan pertama WSJF rilis 2.** Sebelum itu biaya engineering hanya < 0,5 hari FE untuk telemetri gate (a); discovery lainnya berjalan di dalam pilot yang sudah dijadwalkan.

### Estimasi (ideal dev-day, metode PRD-00 §4.1) \[H — estimasi ulang bersama tim saat perencanaan\]

| Kapabilitas | BE | FE |
| --- | --: | --: |
| Skema, contract Zod, fakes, entri app registry | 3 | 1 |
| Pesan: kirim, edit, hapus, `seq`, idempotensi | 4 | 3 |
| Endpoint sync + aturan belum dibaca | 3 | 3 |
| Shell UI: ChannelSidebar, log, composer, lima state, layout satu panel di HP | 0 | 8 |
| Retensi, purge, lifecycle (PRD-13) | 2 | 0 |
| Hardening: matriks tenancy, load test, aksesibilitas | 3 | 3 |
| Instrumentasi metrik (saved query, pola G9) | 1 | 0 |
| **Subtotal fondasi** | **16** | **18** |
| Channel + Share dialog + channel Umum | 4 | 4 |
| Gabung/keluar channel, Jelajahi channel | 1 | 1 |
| DM | 2 | 2 |
| @mention + aturan notifikasi | 2 | 2 |
| Kartu `#tugas` + "Jadikan tugas" + peringatan privasi | 3 | 3 |
| Reaksi | 1 | 1 |
| Moderasi + audit | 1 | 1 |
| Pengecualian DM di authz (PRD-04 §6.1) | 1 | 0 |
| Panel anggota + DM dari daftar anggota (v1.3) | 0,5 | 1 |
| Channel proyek: lazy create, akses via proyek, siklus hidup, tab + pohon sidebar (v1.2) | 2 | 2 |
| **Subtotal Must** | **17,5** | **17** |
| **Total** | **33,5** | **35** |
| Kehadiran Online/Offline (Should, v1.3) | 0,5 | 0,5 |

Dengan contingency 20% dan 3,5 hari per orang per minggu (v1.3): FE 35 × 1,2 ÷ 3,5 = **12,00** dan BE 33,5 × 1,2 ÷ 3,5 = 11,49 minggu → **12 minggu tanpa buffer FE** (v1.2: buffer 0,34 minggu). Kehadiran (Should) hanya masuk bila kecepatan terukur v > 1,0 (Bagian 14). Antigravity diperlakukan sebagai upside, bukan asumsi (PRD-00).

### Urutan per minggu (Kanban; bila Chat dijadwalkan pertama di rilis 2)

| Minggu | BE | FE |
| --- | --- | --- |
| W27–W28 | Skema, contract, fakes, registry, channel + ACL, channel proyek (lazy, akses via proyek), gabung/keluar | Shell, ChannelSidebar, Jelajahi channel di atas fakes |
| W29–W30 | Pesan, `seq`, idempotensi, endpoint sync, aturan belum dibaca | Log pesan, composer, polling, belum dibaca, tab Channel di ruang proyek + pohon sidebar |
| W31–W32 | DM + pengecualian authz, event dan aturan mention | Pemilih DM, saran `@`, layout satu panel di HP |
| W33–W34 | "Jadikan tugas" + peringatan privasi, moderasi + audit, retensi | Dialog "Jadikan tugas", moderasi |
| W35–W36 | Kartu `#tugas`, reaksi, instrumentasi | Kartu `#tugas`, reaksi, lima state |
| W37–W38 | Matriks tenancy, load test, runbook | Pass aksesibilitas; dogfood internal |

Kartu `#tugas` dan reaksi sengaja ditaruh di W35–W36: bila jadwal tergelincir, keduanya dipotong lebih dulu tanpa mengganggu inti (pesan, DM, mention, "Jadikan tugas").

Hari libur tidak dikurangi, sama seperti PRD-00 §4.3. Setelah tanggal kick-off ditetapkan (PRD-00 D7), cek hari libur nasional dan cuti bersama (termasuk Idulfitri) yang jatuh di W27–W38 \[H: cek SKB cuti bersama\]; tambahkan sekitar 1 minggu penyangga.

### Rollout bertahap (juga desain pengukuran)

1. **Dogfood** tim agere, 1 minggu di akhir W37–W38.
2. **Kohort A:** 3 org pilot lewat flag per org, minggu 1–2.
3. **Kohort B:** sisa org pilot, minggu 3–4.
4. **Publik:** 80% org baru mendapat Chat sejak awal dan 20% menjadi holdout selama 8 minggu; org lama menyusul bergelombang tiap 2 minggu. Holdout dan gelombang ini memberi kelompok pembanding untuk retensi pasca-paparan (Bagian 4).

### Keputusan di minggu ke-8 pasca rilis publik

| Hasil | Tindakan |
| --- | --- |
| WCO ≥ 40%, konversi ≥ 2, semua guardrail aman | **Scale:** rencanakan item Should (pencarian, bisukan channel, titik di org switcher) |
| WCO 20–40% atau konversi < 2 | **Iterate:** perbaiki onboarding dan "Jadikan tugas"; tanpa scope baru |
| WCO < 20% dan konversi < 1 | **Freeze:** mode maintenance; Should/Could dibatalkan |
| Project WAU turun > 5 pp di org dengan Chat | **Alarm kanibalisasi:** tahan gelombang rollout berikutnya dan investigasi sebelum lanjut |

## 13. Risiko, pertanyaan terbuka & amandemen

**Risiko terbesar bukan teknis, melainkan Chat menjadi WhatsApp kedua yang tidak menghasilkan kerja.** Karena itu "Jadikan tugas" adalah Must dan kanibalisasi Project adalah guardrail yang bisa menghentikan rollout.

### Risiko

| Risiko | Kemungkinan | Dampak | Mitigasi |
| --- | --- | --- | --- |
| Tim tetap di WhatsApp; Chat sepi | Tinggi | Tinggi | Gate G-Chat sebelum build; channel Umum otomatis; kill criteria minggu ke-8 |
| Chat menggantikan tugas (kanibalisasi) | Sedang | Tinggi | Guardrail Project WAU; "Jadikan tugas" di setiap pesan; rollout bergelombang yang bisa ditahan |
| Polling mahal atau lambat pada skala | Sedang | Sedang | Trigger terukur ke opsi B; adapter `realtime.signal()` sejak awal |
| Bus factor 1 BE bertambah dengan modul baru | Tinggi | Tinggi | ADR, review silang FE, runbook Chat di W37–W38 (pola PRD-00 §7) |
| Kebocoran judul tugas lewat kartu `#tugas` | Rendah | Tinggi | Resolve saat dibaca dengan `checkBatch`; test lintas akses di matriks G2 |
| Keberatan privasi atas akses Admin ke DM | Sedang | Sedang | DM dikecualikan dari override (Q1); ekspor investigasi hanya oleh Owner; pemberitahuan di UI; audit `access.override_used` |
| Hot row `conversations.last_seq` di channel sangat ramai | Rendah | Sedang | Batas laju per user; ukur di load test; alternatif sequence per percakapan bila perlu |
| Estimasi meleset lagi (FE jalur kritis) | Sedang | Tinggi | Buffer FE 0 (v1.3; v1.2: \~0,34 minggu); kartu #tugas dan reaksi di W35–W36 dipotong lebih dulu, lalu Jelajahi channel (channel mandiri Terbatas menjadi Should) |
| Isi DM/channel Terbatas pindah ke proyek terbuka lewat "Jadikan tugas" | Sedang | Tinggi | Peringatan di dialog; tautan sumber di-resolve dengan authz (US-6) |

### Pertanyaan terbuka

| # | Pertanyaan | Usulan default | Diputuskan oleh |
| --- | --- | --- | --- |
| Q1 | Apakah governance override Admin (PRD-04 §6.6) berlaku untuk DM? | Diputuskan: tidak. DM dikecualikan dari override; investigasi hanya lewat ekspor data organisasi oleh Owner (PRD-13, rilis 2+) dengan re-autentikasi, alasan tertulis, dan audit. Channel Terbatas tetap mengikuti override, sama seperti proyek | Diputuskan 26 Sep 2026; legal (L1) mengonfirmasi sebelum W27–W28 |
| Q2 | Apakah DM perlu item inbox? | Tidak di MVP; badge navigasi cukup. Uji di kohort A | Data pilot |
| Q3 | Interval polling 4 detik terlalu cepat atau lambat? | 4 detik; turunkan ke 6 detik bila volume melewati kuota plan | BE, W27–W28 |
| Q4 | Apakah channel Umum selalu dibuat otomatis? | Ya, bisa diarsipkan oleh Admin | Usability test kohort A |
| Q5 | Retensi pesan dari akun terhapus dan periode retensi pesan secara umum | Selama organisasi ada, penulis dianonimkan | Legal (L1, L2) |
| Q6 | Apakah komentar tugas (PRD-06) dan Chat kelak disatukan dalam satu model pesan? | Tidak di rilis 2; ditinjau bila Could "balasan thread" dibangun | PO, perencanaan rilis 3 |
| Q7 | Batas ukuran video di Chat: 25 MB seperti file lain, atau lebih tinggi dengan kuota? | 25 MB (PRD-07 aturan 3) sampai kuota diputuskan bersama PRD Billing | PO, sebelum build C2 |
| Q8 | Siapa yang boleh mengundang ke channel Terbatas: semua anggota channel, atau hanya pengelola/Admin? | Semua anggota channel [H], sesuai kebiasaan tim kecil; tercatat lewat `added_by` | Usability test kohort A |

### Amandemen (diterapkan di paket 26 Sep 2026; berlaku bila G-Chat lolos)

| Dokumen | Perubahan |
| --- | --- |
| 00 PRD Index | Baris PRD-14 Team Chat, rilis 2 (kandidat) |
| PRD-00 | Chat masuk daftar kandidat rilis 2; G-Chat ditambahkan ke agenda M3; 3 pertanyaan wawancara pilot |
| PRD-00b | Event `chat.*` di katalog §8.1; field opsional `data.source` di `space.task.created` |
| PRD-04 | App `chat` di registry; Channel sebagai container di §6.4; aturan DM; pengecualian DM dari governance override §6.6 (Q1) |
| PRD-06 | `createTask` menerima `source`; tautan "Dibuat dari percakapan" di aktivitas tugas; tab Channel dan aturan landing di ruang proyek (§6.7) — diterapkan di v1.3 |
| PRD-10 | Dua baris baru di rule table §5 |
| PRD-11 | Grup aksi Chat di viewer; coverage event audit Chat |
| PRD-13 | Kelas data "Pesan chat" di §5 dan retensinya di §6.1 |
| TECH-01 | Modul `chat` di peta modul §3 (diterapkan di v1.1); tabel §4, contract §7, route sync, dan cache tags dipindahkan dari Bagian 6–8 PRD ini ke TECH-01 saat G-Chat lolos |
| UI-01 | Item Chat di NavMain; baris "# Channel" di pohon sidebar proyek; pola dua panel Chat — diterapkan di v1.5 |
| PRD-07 | Hanya bila lampiran chat kelak diinginkan: pesan sebagai source entity |
| TECH-01 §11 (semua modul) | Jalur kode bebas vs terkunci, gate CI, CODEOWNERS, setup .agents/ untuk Antigravity (Bagian 14) |
| PRD-04 §6.5 | Flag platform per org untuk app yang dirilis bertahap, di atas enable/disable oleh Admin |

## 14. Cara membangun: vibe coding dengan Antigravity, GitHub & Vercel

**Vibe coding dipakai lewat dua jalur: bebas untuk UI dan boilerplate, terkunci-spesifikasi untuk kode yang bisa membocorkan atau menghilangkan data.** Risiko utama vibe coding di produk multi-tenant adalah kode yang terlihat benar tetapi melewatkan satu filter `organization_id` atau satu `authz.check`. Estimasi tetap 12 minggu sampai kecepatan nyata terukur di rilis 1, karena PRD-00 memperlakukan Antigravity sebagai upside, bukan asumsi.

### Dua jalur kode

| Jalur | Cakupan di Chat | Aturan |
| --- | --- | --- |
| **Bebas** | Komponen UI dari Agere DS, lima state, microcopy, styling, fakes, seed data, halaman Jelajahi channel | Agent boleh berjalan tanpa persetujuan per langkah; review cukup lewat preview Vercel dan screenshot/walkthrough artifact |
| **Terkunci** | Pengecualian DM di `authz`, repository Chat, migrasi skema, `sendMessage` + `seq` + idempotensi, endpoint sync + cursor, event dan audit, purge | Test dari Gherkin ditulis dan disetujui manusia **sebelum** implementasi; agent tidak boleh mengubah test yang gagal agar lulus; PR wajib di-review engineer lain lewat CODEOWNERS |

Pembagian ini berlaku untuk semua modul, bukan hanya Chat. Sudah diterapkan di paket repo (`AGENTS.md`, `.agents/rules`, CODEOWNERS); pengangkatan resmi ke TECH-01 §11 dilakukan bersama modul `chat` saat G-Chat lolos.

### Setup repo untuk agent

- **`AGENTS.md`** berisi persona `@be`, `@fe`, `@qa` beserta batasan yang mengikat: `ctx` selalu argumen pertama repository; tidak membaca tabel modul lain; semua action mengembalikan `ActionResult`; copy Bahasa Indonesia dengan "Anda"; hanya komponen dan token Agere DS; tidak ada dependensi baru tanpa ADR.
- **`.agents/skills/`** berisi pekerjaan yang berulang: `gherkin-to-test` (AC → test Vitest/Playwright), `new-server-action` (contract Zod + fake + action + test), `new-event` (entri katalog PRD-00b + `publish` + flag audit), `ds-screen` (layar dengan lima state dari Agere DS), `tenancy-case` (menambah kasus lintas org ke matriks G2).
- **Pakai Skills, bukan Workflows.** Dokumentasi Antigravity menyatakan Workflows digantikan Agent Skills per 1 Nov 2026; ini tanggal vendor, bukan jadwal proyek.
- **Spesifikasi di dalam repo:** PRD-14, TECH-01, dan kutipan PRD-04 disalin ke `docs/`, agar agent dan manusia membaca sumber yang sama.
- **Pengaturan keamanan Antigravity:** perintah terminal `db:migrate`, deploy, dan `git push` selalu meminta persetujuan; mode tanpa persetujuan hanya untuk jalur bebas.

### Alur per slice

1. Ambil satu slice (≤ 1 ideal day) dari tabel estimasi Bagian 12.
2. Agent membuat Implementation Plan artifact; engineer menyetujui atau mengoreksi.
3. Agent menulis test dari Gherkin. Untuk jalur terkunci, engineer me-review test sebelum lanjut.
4. Agent mengimplementasi sampai test hijau, lalu membuat walkthrough artifact.
5. PR ke GitHub dengan walkthrough terlampir; CI menjalankan gate di bawah.
6. Vercel membuat preview deployment dengan database branch; engineer memeriksa di browser.
7. Merge ke `main` → produksi, dengan Chat tetap tersembunyi di balik flag platform sampai gelombang rollout org tersebut.

### Gate CI di GitHub (branch protection `main`)

| Check | Isi | Memblokir merge |
| --- | --- | :-: |
| Typecheck + lint | Termasuk larangan SQL mentah di luar repository (TECH-01 §10) | ✓ |
| Unit + contract test | Fake dan real adapter di file test yang sama (TECH-01 §11) | ✓ |
| AC test | Gherkin dari story yang disentuh PR | ✓ |
| Matriks tenancy G2 | Lintas org 404, suspended, removed, app nonaktif, Owner → DM 404 | ✓ |
| Aksesibilitas | axe via Playwright pada layar Chat: 0 critical/serious | ✓ |
| Keamanan | Secret scan dan audit dependensi: tanpa temuan high/critical | ✓ |
| Migrasi | Forward-only; `organization_id` kolom pertama setiap indeks | ✓ |

**CODEOWNERS:** `src/modules/authz/**`, `src/modules/chat/repo/**`, `src/modules/events/**`, `db/migrations/**`, dan file test jalur terkunci wajib disetujui engineer yang bukan penulis PR.

### Vercel

- Preview per PR memakai database branch (kriteria PRD-00 D2).
- **Flag platform per org** menentukan apakah Chat muncul di Organisasi › Aplikasi. Flag ini diperlukan karena app registry dikendalikan Admin org; tanpa flag, Admin bisa mengaktifkan Chat sebelum gelombangnya dan merusak holdout (Bagian 12).
- Tidak ada cron baru; job purge harian yang sudah ada diperluas untuk Chat.
- Kuota fungsi untuk polling sync dicek terhadap plan Pro sebelum W27–W28 (Bagian 7).

### Estimasi: ukur, jangan asumsikan

Percepatan vibe coding tidak dimasukkan ke rencana sebelum terbukti. Di M3, ukur kecepatan per peran dari rilis 1: **v = ideal day yang selesai × 1,2 ÷ (3,5 × person-week yang terpakai)** (faktor 1,2 = contingency yang sudah ada di rencana, sehingga tim yang tepat sesuai rencana bernilai v = 1,0) untuk W1–W24. Hardening (3 hari per peran) tidak dipercepat, karena load test, review keamanan, dan pengujian screen reader tetap dikerjakan manusia.

FE adalah jalur kritis (34 hari, termasuk 3 hari hardening):

| v terukur (FE) | Hitungan | Minggu |
| --- | --- | --- |
| 1,0 | 34 × 1,2 ÷ 3,5 = 11,66 | 12 |
| 1,3 | (3 + 31 ÷ 1,3) × 1,2 ÷ 3,5 = 9,20 | 10 |
| 1,6 | (3 + 31 ÷ 1,6) × 1,2 ÷ 3,5 = 7,67 | 8 |
| 2,0 | (3 + 31 ÷ 2,0) × 1,2 ÷ 3,5 = 6,34 | 7 |

BE dengan rumus yang sama (33 hari) selalu ≤ FE: 8,94 minggu pada v = 1,3 dan 6,17 pada v = 2,0. Jadwal dipangkas hanya berdasarkan v terukur per peran, bukan klaim umum tentang produktivitas AI.

### Yang tetap dikerjakan manusia

- Menyetujui test dan migrasi jalur terkunci.
- Review keamanan setiap PR jalur terkunci; penulis harus bisa menjelaskan setiap baris yang dihasilkan agent.
- Keputusan produk: copy final dan trade-off.
- Pengujian manual: keyboard dan screen reader (bagian manual gate G6), serta uji privasi DM.
- Membuka flag per kohort saat rollout.

### Risiko khusus vibe coding

| Risiko | Mitigasi |
| --- | --- |
| Agent melonggarkan test agar hijau | File test jalur terkunci dilindungi CODEOWNERS |
| Pola kode tidak konsisten antar sesi agent | `AGENTS.md` + skills; ADR; slot refactor di W37–W38 |
| Engineer tidak memahami kode yang dihasilkan, sehingga bus factor naik | Walkthrough artifact di setiap PR; review silang FE ↔ BE |
| Dependensi baru masuk tanpa kontrol | Batasan di `AGENTS.md` + audit dependensi di CI |
| Rahasia bocor lewat prompt atau repo | Environment variable hanya di Vercel; secret scan di CI |

Sumber: [Workflows — Google Antigravity Docs](https://antigravity.google/docs/ide/workflows/) · [Build Autonomous Developer Pipelines using agents.md and skills.md in Antigravity — Google Codelabs](https://codelabs.developers.google.com/autonomous-ai-developer-pipelines-antigravity) · [Getting Started with Google Antigravity — Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
