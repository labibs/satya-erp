# Satya ERP Prototype

Prototipe dashboard ERP terpadu dengan modul:

- People & HR
- IT Operations / Project Management
- Accounting & Finance
- CRM & Marketing

## Menjalankan aplikasi

Pastikan Node.js 20+ tersedia, kemudian jalankan:

```bash
npm install
npm run dev
```

Untuk membuat build produksi:

```bash
npm run build
```

## Interaksi prototipe

- Halaman login menyediakan role Executive, HR Manager, Project Manager, Finance, dan CRM & Marketing.
- Pilih role yang diinginkan lalu gunakan password demo `demo123`.
- Menu sidebar dibatasi sesuai hak akses role yang digunakan.
- Seluruh 38 submenu memiliki halaman demo tersendiri dengan tampilan tabel, kanban, pipeline, timeline, laporan, kartu, atau struktur organisasi sesuai konteksnya.
- Setiap proses operasional memiliki form kontekstual, penyimpanan draft, detail record, status workflow, activity log, dan simulasi approval.
- Gunakan sidebar untuk berpindah antar modul.
- Klik filter proyek untuk melihat proyek berstatus `At risk`.
- Klik pilihan periode untuk mengganti bulan, kuartal, dan tahun.
- Kolom pencarian dan tombol aksi memberikan feedback UI.
- Sidebar berubah menjadi drawer pada layar tablet dan ponsel.
# satya-erp
