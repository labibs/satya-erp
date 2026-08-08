import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness,
  Building2, CalendarDays, Check, ChevronDown, ChevronRight, CircleDollarSign,
  Clock3, Command, ContactRound, Download, Ellipsis, FileBarChart, Filter,
  Eye, EyeOff, FolderKanban, Gauge, HeartPulse, LayoutDashboard, LogIn, LogOut, Menu, MessageSquare,
  MoreHorizontal, Plus, ReceiptText, Search, Settings2, Sparkles, Target,
  TrendingUp, UserRoundPlus, UsersRound, WalletCards, X, Zap, ShieldCheck,
} from 'lucide-react'

const modules = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hr', label: 'People & HR', icon: UsersRound, count: 3 },
  { id: 'projects', label: 'IT Operations', icon: FolderKanban, count: 8 },
  { id: 'finance', label: 'Finance', icon: CircleDollarSign },
  { id: 'crm', label: 'CRM & Marketing', icon: ContactRound, count: 12 },
]

const subMenus = {
  overview: [
    { group: 'Overview', items: ['Executive overview', 'Company analytics', 'My workspace'] },
    { group: 'Reports', items: ['Management report', 'Custom reports'] },
  ],
  hr: [
    { group: 'People', items: ['Employee directory', 'Organization chart', 'Recruitment'] },
    { group: 'Workforce', items: ['Attendance', 'Leave & time off', 'Payroll'] },
    { group: 'Performance', items: ['Goals & review', 'Learning'] },
  ],
  projects: [
    { group: 'Project management', items: ['Project portfolio', 'My tasks', 'Sprint board'] },
    { group: 'Operations', items: ['Resource planning', 'Timesheets', 'Service desk'] },
    { group: 'Insights', items: ['Project health', 'Utilization report'] },
  ],
  finance: [
    { group: 'Accounting', items: ['Chart of accounts', 'Journal entries', 'General ledger'] },
    { group: 'Transactions', items: ['Invoices', 'Expenses', 'Bank & cash'] },
    { group: 'Reports', items: ['Profit & loss', 'Balance sheet', 'Cashflow'] },
  ],
  crm: [
    { group: 'Sales', items: ['Sales pipeline', 'Leads', 'Accounts & contacts'] },
    { group: 'Marketing', items: ['Campaigns', 'Segments', 'Automation'] },
    { group: 'Customer', items: ['Activities', 'Revenue analytics'] },
  ],
}

const activities = [
  { icon: Check, tone: 'green', title: 'Milestone selesai', desc: 'UI audit · Mobile Banking 3.0', time: '8 menit' },
  { icon: UserRoundPlus, tone: 'blue', title: 'Karyawan baru bergabung', desc: 'Naura Putri · Product Designer', time: '1 jam' },
  { icon: CircleDollarSign, tone: 'purple', title: 'Invoice #INV-2048 dibayar', desc: 'Astera Retail · Rp 128.000.000', time: '3 jam' },
  { icon: MessageSquare, tone: 'orange', title: 'Lead baru dari website', desc: 'PT Aruna Digital · Enterprise', time: '5 jam' },
]

const navContent = {
  overview: { eyebrow: 'ORGANIZATION OVERVIEW', title: 'Selamat pagi, Nadia', copy: 'Satu tempat untuk memantau bisnis dan tim kamu.' },
  hr: { eyebrow: 'PEOPLE & CULTURE', title: 'People & HR', copy: 'Kelola talenta, kehadiran, dan performa tim.' },
  projects: { eyebrow: 'IT OPERATIONS', title: 'Project control', copy: 'Pantau delivery, kapasitas, dan kesehatan proyek.' },
  finance: { eyebrow: 'ACCOUNTING & FINANCE', title: 'Financial overview', copy: 'Kontrol arus kas, invoice, dan profitabilitas.' },
  crm: { eyebrow: 'CRM & MARKETING', title: 'Revenue engine', copy: 'Bangun pipeline dan ubah prospek menjadi pelanggan.' },
}

const demoRoles = [
  { id: 'executive', name: 'Executive', user: 'Nadia Santoso', email: 'executive@satya.id', initials: 'NS', icon: LayoutDashboard, home: 'overview', allowed: ['overview', 'hr', 'projects', 'finance', 'crm'], color: '#146ef5', description: 'Akses seluruh insight perusahaan' },
  { id: 'hr', name: 'HR Manager', user: 'Citra Ananda', email: 'hr@satya.id', initials: 'CA', icon: UsersRound, home: 'hr', allowed: ['overview', 'hr'], color: '#765de8', description: 'People, payroll, dan performance' },
  { id: 'projects', name: 'Project Manager', user: 'Rama Aditya', email: 'project@satya.id', initials: 'RA', icon: FolderKanban, home: 'projects', allowed: ['overview', 'projects'], color: '#10a37f', description: 'Proyek IT, sprint, dan resources' },
  { id: 'finance', name: 'Finance', user: 'Dina Maharani', email: 'finance@satya.id', initials: 'DM', icon: CircleDollarSign, home: 'finance', allowed: ['overview', 'finance'], color: '#e98522', description: 'Accounting, invoice, dan cashflow' },
  { id: 'crm', name: 'CRM & Marketing', user: 'Fahri Akbar', email: 'crm@satya.id', initials: 'FA', icon: Target, home: 'crm', allowed: ['overview', 'crm'], color: '#e84d82', description: 'Pipeline, leads, dan campaign' },
]

const globalSearchItems = [
  { title: 'Naura Putri', meta: 'Employee · Product Designer', module: 'hr', page: 'Employee directory' },
  { title: 'Mobile Banking 3.0', meta: 'Project · 78% complete', module: 'projects', page: 'Project portfolio' },
  { title: 'INV-2026-0842', meta: 'Invoice · Rp 284 Jt', module: 'finance', page: 'Invoices' },
  { title: 'Bank Aruna', meta: 'CRM account · Enterprise', module: 'crm', page: 'Accounts & contacts' },
  { title: 'Pengajuan cuti', meta: 'HR workflow · 8 pending', module: 'hr', page: 'Leave & time off' },
  { title: 'Customer Data Hub', meta: 'Project · At risk', module: 'projects', page: 'Project health' },
]

const moduleStatDefaults = {
  overview: [['Active users', '164', '+8.2%'], ['Open actions', '28', '-4'], ['Health score', '92%', '+3.1%']],
  hr: [['Active employees', '186', '+6'], ['Attendance', '94.2%', '+1.8%'], ['Open requests', '12', '-3']],
  projects: [['Active projects', '24', '+4'], ['On-time delivery', '91%', '+3.2%'], ['Utilization', '84%', '+2.1%']],
  finance: [['Cash position', 'Rp 4,8 M', '+8.1%'], ['Receivables', 'Rp 980 Jt', '-4.2%'], ['Net margin', '28.6%', '+1.8%']],
  crm: [['Pipeline', 'Rp 3,2 M', '+14.8%'], ['Conversion', '12.2%', '+1.4%'], ['Active leads', '148', '+22']],
}

const submenuPages = {
  'Company analytics': { kind: 'report', description: 'Analisis performa lintas divisi dan tren perusahaan.', primary: ['Growth index', '118.4', '+12.4%'], action: 'Export insight' },
  'My workspace': { kind: 'board', description: 'Prioritas, approval, dan pekerjaan pribadi hari ini.', primary: ['My completion', '82%', '+6.1%'], action: 'Tambah task' },
  'Management report': { kind: 'report', description: 'Laporan manajemen terpadu untuk pengambilan keputusan.', primary: ['Reports ready', '18', '+3'], action: 'Generate report' },
  'Custom reports': { kind: 'cards', description: 'Susun dan simpan laporan sesuai kebutuhan organisasi.', primary: ['Saved reports', '12', '+2'], action: 'Buat laporan' },
  'Employee directory': { kind: 'table', description: 'Data karyawan, unit kerja, jabatan, dan status kepegawaian.', primary: ['Total employees', '186', '+6'], action: 'Tambah karyawan' },
  'Organization chart': { kind: 'org', description: 'Struktur organisasi dan hubungan pelaporan perusahaan.', primary: ['Departments', '8', '+1'], action: 'Kelola struktur' },
  'Recruitment': { kind: 'pipeline', description: 'Pantau kandidat dari tahap screening hingga onboarding.', primary: ['Open positions', '12', '+3'], action: 'Buat lowongan' },
  'Attendance': { kind: 'calendar', description: 'Monitor kehadiran, keterlambatan, dan jam kerja tim.', primary: ['Present today', '172', '94.2%'], action: 'Koreksi absensi' },
  'Leave & time off': { kind: 'table', description: 'Kelola pengajuan cuti dan saldo waktu istirahat.', primary: ['Pending leave', '8', '-2'], action: 'Ajukan cuti' },
  'Payroll': { kind: 'report', description: 'Proses penggajian, tunjangan, potongan, dan slip gaji.', primary: ['Payroll total', 'Rp 1,24 M', '+3.6%'], action: 'Proses payroll' },
  'Goals & review': { kind: 'board', description: 'Sasaran individu, review performa, dan evaluasi berkala.', primary: ['Goals on track', '84%', '+7.2%'], action: 'Buat goal' },
  'Learning': { kind: 'cards', description: 'Program pengembangan kompetensi dan pelatihan tim.', primary: ['Active courses', '16', '+4'], action: 'Tambah pelatihan' },
  'Project portfolio': { kind: 'table', description: 'Ringkasan seluruh proyek IT, progres, dan kesehatan delivery.', primary: ['Portfolio value', 'Rp 8,7 M', '+9.8%'], action: 'Buat proyek' },
  'My tasks': { kind: 'board', description: 'Daftar tugas pribadi lintas proyek dan prioritas sprint.', primary: ['Tasks due', '14', '-5'], action: 'Tambah task' },
  'Sprint board': { kind: 'board', description: 'Kelola backlog, pekerjaan berjalan, review, dan delivery sprint.', primary: ['Sprint progress', '68%', '+12 pts'], action: 'Tambah issue' },
  'Resource planning': { kind: 'calendar', description: 'Rencanakan kapasitas engineer dan alokasi lintas proyek.', primary: ['Available capacity', '420 jam', '-8%'], action: 'Atur alokasi' },
  'Timesheets': { kind: 'table', description: 'Rekap waktu kerja billable dan non-billable tim proyek.', primary: ['Hours logged', '4.280', '+6.4%'], action: 'Log time' },
  'Service desk': { kind: 'pipeline', description: 'Pantau tiket layanan dari masuk hingga terselesaikan.', primary: ['Open tickets', '38', '-12'], action: 'Buat tiket' },
  'Project health': { kind: 'report', description: 'Analisis risiko, scope, timeline, dan budget proyek.', primary: ['Healthy projects', '19 / 24', '+2'], action: 'Review risiko' },
  'Utilization report': { kind: 'report', description: 'Laporan utilisasi tim berdasarkan peran dan proyek.', primary: ['Billable utilization', '84%', '+2.1%'], action: 'Export report' },
  'Chart of accounts': { kind: 'table', description: 'Struktur akun untuk pencatatan dan pelaporan keuangan.', primary: ['Active accounts', '148', '+8'], action: 'Tambah akun' },
  'Journal entries': { kind: 'table', description: 'Pencatatan jurnal debit dan kredit seluruh transaksi.', primary: ['Entries this month', '284', '+18'], action: 'Buat jurnal' },
  'General ledger': { kind: 'table', description: 'Riwayat transaksi dan saldo berdasarkan akun buku besar.', primary: ['Ledger balance', 'Rp 12,8 M', '+4.6%'], action: 'Post transaksi' },
  'Invoices': { kind: 'pipeline', description: 'Kelola invoice pelanggan dari draft hingga lunas.', primary: ['Outstanding', 'Rp 980 Jt', '-4.2%'], action: 'Buat invoice' },
  'Expenses': { kind: 'table', description: 'Review pengeluaran, reimbursement, dan kebijakan biaya.', primary: ['Expenses MTD', 'Rp 740 Jt', '-3.4%'], action: 'Catat biaya' },
  'Bank & cash': { kind: 'report', description: 'Pantau rekening bank, kas, serta proses rekonsiliasi.', primary: ['Cash on hand', 'Rp 4,8 M', '+8.1%'], action: 'Rekonsiliasi' },
  'Profit & loss': { kind: 'report', description: 'Ringkasan pendapatan, beban, dan laba perusahaan.', primary: ['Net profit', 'Rp 526 Jt', '+11.3%'], action: 'Export P&L' },
  'Balance sheet': { kind: 'report', description: 'Posisi aset, liabilitas, dan ekuitas perusahaan.', primary: ['Total assets', 'Rp 14,2 M', '+6.8%'], action: 'Export neraca' },
  'Cashflow': { kind: 'report', description: 'Pergerakan arus kas operasional, investasi, dan pendanaan.', primary: ['Net cashflow', 'Rp 386 Jt', '+14.2%'], action: 'Lihat proyeksi' },
  'Sales pipeline': { kind: 'pipeline', description: 'Peluang penjualan dari lead hingga closed won.', primary: ['Weighted pipeline', 'Rp 3,2 M', '+14.8%'], action: 'Tambah deal' },
  'Leads': { kind: 'table', description: 'Kelola prospek, sumber lead, scoring, dan tindak lanjut.', primary: ['New leads', '148', '+22'], action: 'Tambah lead' },
  'Accounts & contacts': { kind: 'table', description: 'Database perusahaan pelanggan dan kontak utama.', primary: ['Active accounts', '284', '+16'], action: 'Tambah account' },
  'Campaigns': { kind: 'cards', description: 'Rencanakan dan ukur performa campaign marketing.', primary: ['Active campaigns', '8', '+2'], action: 'Buat campaign' },
  'Segments': { kind: 'cards', description: 'Kelompokkan audiens berdasarkan perilaku dan profil.', primary: ['Live segments', '24', '+4'], action: 'Buat segmen' },
  'Automation': { kind: 'board', description: 'Bangun workflow otomatis untuk nurturing dan follow-up.', primary: ['Active workflows', '18', '+3'], action: 'Buat workflow' },
  'Activities': { kind: 'calendar', description: 'Jadwal meeting, call, email, dan follow-up pelanggan.', primary: ['Activities today', '32', '+8'], action: 'Jadwalkan aktivitas' },
  'Revenue analytics': { kind: 'report', description: 'Analisis revenue berdasarkan produk, channel, dan tim.', primary: ['Revenue MTD', 'Rp 1,65 M', '+12.4%'], action: 'Export analytics' },
}

const moduleRecords = {
  overview: [
    { title: 'Revenue performance', meta: 'Finance · Diperbarui hari ini', value: 'Rp 1,65 M', status: 'On track' },
    { title: 'Workforce utilization', meta: 'People · 186 employees', value: '84%', status: 'Healthy' },
    { title: 'Project delivery', meta: 'Operations · 24 projects', value: '91%', status: 'On track' },
    { title: 'Sales conversion', meta: 'CRM · 148 leads', value: '12.2%', status: 'Review' },
  ],
  hr: [
    { title: 'Naura Putri', meta: 'Product Designer · Product', value: 'Joined 8 Aug', status: 'Active' },
    { title: 'Rama Aditya', meta: 'Engineering Lead · Technology', value: '4.8 / 5', status: 'Active' },
    { title: 'Citra Ananda', meta: 'HR Manager · People', value: '12 reports', status: 'Active' },
    { title: 'Fahri Akbar', meta: 'Account Executive · Sales', value: '92% goal', status: 'Review' },
    { title: 'Dina Maharani', meta: 'Finance Lead · Finance', value: '4.6 / 5', status: 'Active' },
  ],
  projects: [
    { title: 'Mobile Banking 3.0', meta: 'MB-302 · Nusantara Bank', value: '78%', status: 'On track' },
    { title: 'Customer Data Hub', meta: 'CDP-108 · Astera Retail', value: '61%', status: 'At risk' },
    { title: 'ERP Cloud Migration', meta: 'ERP-214 · Internal', value: '43%', status: 'On track' },
    { title: 'Merchant Portal', meta: 'MRC-019 · Bank Aruna', value: '86%', status: 'Review' },
    { title: 'Service Desk Revamp', meta: 'SD-124 · Internal', value: '32%', status: 'On track' },
  ],
  finance: [
    { title: 'INV-2026-0842', meta: 'Nusantara Bank · 8 Aug 2026', value: 'Rp 284 Jt', status: 'Paid' },
    { title: 'INV-2026-0841', meta: 'Astera Retail · 7 Aug 2026', value: 'Rp 128 Jt', status: 'Pending' },
    { title: 'EXP-2026-0418', meta: 'Cloud infrastructure · AWS', value: 'Rp 42 Jt', status: 'Approved' },
    { title: 'INV-2026-0839', meta: 'Bank Aruna · 5 Aug 2026', value: 'Rp 482 Jt', status: 'Overdue' },
    { title: 'EXP-2026-0412', meta: 'Team development · HR', value: 'Rp 18 Jt', status: 'Review' },
  ],
  crm: [
    { title: 'Bank Aruna', meta: 'Enterprise · Proposal', value: 'Rp 482 Jt', status: 'Hot' },
    { title: 'Astera Retail', meta: 'Mid-market · Negotiation', value: 'Rp 320 Jt', status: 'Warm' },
    { title: 'Nusantara Health', meta: 'Enterprise · Qualified', value: 'Rp 275 Jt', status: 'Warm' },
    { title: 'Kreasi Digital', meta: 'SMB · Discovery', value: 'Rp 86 Jt', status: 'New' },
    { title: 'Sagara Logistics', meta: 'Enterprise · Proposal', value: 'Rp 360 Jt', status: 'Hot' },
  ],
}

const workflowGroups = [
  { pages: ['Employee directory'], fields: [['Nama lengkap','text','Contoh: Alya Pratama'],['Email kantor','email','nama@satya.id'],['Department','select','Technology|Product|People|Finance|Sales'],['Jabatan','text','Contoh: Software Engineer'],['Tanggal bergabung','date','']] },
  { pages: ['Organization chart'], fields: [['Nama unit','text','Contoh: Product & Technology'],['Unit induk','select','CEO Office|Technology|Operations|Commercial'],['Pimpinan unit','text','Pilih karyawan'],['Cost center','text','Contoh: CC-102']] },
  { pages: ['Recruitment'], fields: [['Nama posisi','text','Contoh: Frontend Engineer'],['Department','select','Technology|Product|People|Finance|Sales'],['Hiring manager','text','Nama hiring manager'],['Tipe pekerjaan','select','Full-time|Contract|Internship'],['Target bergabung','date','']] },
  { pages: ['Attendance'], fields: [['Karyawan','text','Cari nama atau ID karyawan'],['Tanggal','date',''],['Jam masuk','time',''],['Jam keluar','time',''],['Alasan koreksi','textarea','Jelaskan alasan perubahan']] },
  { pages: ['Leave & time off'], fields: [['Karyawan','text','Nama karyawan'],['Jenis cuti','select','Annual leave|Sick leave|Unpaid leave|Special leave'],['Tanggal mulai','date',''],['Tanggal selesai','date',''],['Catatan','textarea','Tambahkan keterangan']] },
  { pages: ['Payroll'], fields: [['Periode payroll','month',''],['Payroll group','select','All employees|Permanent|Contract'],['Tanggal pembayaran','date',''],['Catatan proses','textarea','Catatan opsional']] },
  { pages: ['Goals & review'], fields: [['Judul goal','text','Contoh: Improve delivery velocity'],['Pemilik','text','Cari karyawan'],['Periode','select','Q3 2026|Q4 2026|Annual 2026'],['Target','text','Masukkan hasil yang diharapkan'],['Tanggal selesai','date','']] },
  { pages: ['Learning'], fields: [['Nama pelatihan','text','Contoh: Engineering Leadership'],['Penyelenggara','text','Internal atau vendor'],['Peserta','text','Pilih peserta atau tim'],['Tanggal pelaksanaan','date',''],['Budget','number','0']] },
  { pages: ['Project portfolio'], fields: [['Nama proyek','text','Contoh: Mobile Banking 4.0'],['Client','text','Nama pelanggan atau Internal'],['Project manager','text','Pilih project manager'],['Tanggal mulai','date',''],['Target selesai','date',''],['Budget','number','0']] },
  { pages: ['My tasks','Sprint board'], fields: [['Judul task','text','Apa yang perlu dikerjakan?'],['Project','select','Mobile Banking 3.0|Customer Data Hub|ERP Cloud Migration'],['Assignee','text','Pilih anggota tim'],['Priority','select','Low|Medium|High|Urgent'],['Due date','date',''],['Deskripsi','textarea','Detail pekerjaan dan acceptance criteria']] },
  { pages: ['Resource planning'], fields: [['Anggota tim','text','Cari anggota tim'],['Project','select','Mobile Banking 3.0|Customer Data Hub|ERP Cloud Migration'],['Mulai alokasi','date',''],['Selesai alokasi','date',''],['Allocation','select','25%|50%|75%|100%']] },
  { pages: ['Timesheets'], fields: [['Project','select','Mobile Banking 3.0|Customer Data Hub|ERP Cloud Migration'],['Task','text','Pilih atau tulis task'],['Tanggal kerja','date',''],['Durasi (jam)','number','8'],['Catatan pekerjaan','textarea','Ringkasan pekerjaan']] },
  { pages: ['Service desk'], fields: [['Judul tiket','text','Jelaskan masalah secara singkat'],['Requester','text','Nama atau email requester'],['Category','select','Incident|Service request|Access|Problem'],['Priority','select','Low|Medium|High|Critical'],['Detail','textarea','Informasi pendukung']] },
  { pages: ['Project health'], fields: [['Project','select','Mobile Banking 3.0|Customer Data Hub|ERP Cloud Migration'],['Jenis risiko','select','Scope|Schedule|Budget|Resource|Quality'],['Impact','select','Low|Medium|High|Critical'],['Mitigation owner','text','Pilih owner'],['Rencana mitigasi','textarea','Tindakan yang akan dilakukan']] },
  { pages: ['Utilization report'], fields: [['Periode','select','Minggu ini|Bulan ini|Kuartal ini'],['Department','select','All departments|Technology|Product|Operations'],['Tipe jam','select','All hours|Billable|Non-billable'],['Format','select','PDF|Excel|CSV']] },
  { pages: ['Chart of accounts'], fields: [['Kode akun','text','Contoh: 110101'],['Nama akun','text','Contoh: Bank Operasional'],['Tipe akun','select','Asset|Liability|Equity|Revenue|Expense'],['Parent account','text','Pilih akun induk'],['Saldo awal','number','0']] },
  { pages: ['Journal entries','General ledger'], fields: [['Tanggal jurnal','date',''],['Reference','text','Nomor dokumen'],['Akun debit','text','Pilih akun'],['Akun kredit','text','Pilih akun'],['Jumlah','number','0'],['Memo','textarea','Keterangan transaksi']] },
  { pages: ['Invoices'], fields: [['Pelanggan','text','Pilih pelanggan'],['Tanggal invoice','date',''],['Jatuh tempo','date',''],['Produk / layanan','text','Deskripsi item'],['Jumlah','number','0'],['Pajak','select','PPN 11%|Non PPN']] },
  { pages: ['Expenses'], fields: [['Merchant / vendor','text','Nama merchant'],['Kategori','select','Travel|Software|Office|Marketing|Training'],['Tanggal transaksi','date',''],['Jumlah','number','0'],['Dibayar oleh','text','Nama karyawan'],['Keterangan','textarea','Tujuan pengeluaran']] },
  { pages: ['Bank & cash'], fields: [['Rekening','select','BCA Operasional|Mandiri Payroll|Petty Cash'],['Periode rekonsiliasi','month',''],['Saldo statement','number','0'],['Saldo sistem','number','0'],['Catatan','textarea','Perbedaan atau adjustment']] },
  { pages: ['Profit & loss','Balance sheet','Cashflow','Management report','Company analytics','Revenue analytics'], fields: [['Periode laporan','select','Bulan ini|Kuartal ini|Tahun ini'],['Entity','select','PT Satya Teknologi|All entities'],['Comparison','select','Previous period|Previous year|Budget'],['Format','select','Dashboard|PDF|Excel']] },
  { pages: ['Custom reports'], fields: [['Nama laporan','text','Contoh: Monthly executive report'],['Sumber data','select','People|Projects|Finance|CRM|Cross-module'],['Periode','select','Bulan ini|Kuartal ini|Tahun ini'],['Bagikan dengan','text','Pilih user atau tim']] },
  { pages: ['My workspace'], fields: [['Judul task','text','Apa yang ingin diselesaikan?'],['Module','select','People|Projects|Finance|CRM'],['Priority','select','Low|Medium|High'],['Due date','date',''],['Catatan','textarea','Detail tambahan']] },
  { pages: ['Sales pipeline'], fields: [['Nama deal','text','Contoh: Core Banking Modernization'],['Account','text','Pilih perusahaan'],['Deal owner','text','Pilih sales owner'],['Value','number','0'],['Stage','select','New lead|Qualified|Proposal|Negotiation'],['Expected close','date','']] },
  { pages: ['Leads'], fields: [['Nama lead','text','Nama lengkap'],['Perusahaan','text','Nama perusahaan'],['Email','email','email@company.com'],['Sumber','select','Website|Referral|LinkedIn|Event|Outbound'],['Owner','text','Pilih sales owner']] },
  { pages: ['Accounts & contacts'], fields: [['Nama perusahaan','text','Nama legal perusahaan'],['Industry','select','Financial Services|Retail|Technology|Healthcare|Logistics'],['Kontak utama','text','Nama kontak'],['Email kontak','email','email@company.com'],['Account owner','text','Pilih owner']] },
  { pages: ['Campaigns'], fields: [['Nama campaign','text','Contoh: Enterprise Q3'],['Channel','select','Email|LinkedIn|Google Ads|Event|Multi-channel'],['Audience','text','Pilih segment'],['Tanggal mulai','date',''],['Tanggal selesai','date',''],['Budget','number','0']] },
  { pages: ['Segments'], fields: [['Nama segmen','text','Contoh: Enterprise high intent'],['Source','select','Contacts|Leads|Accounts'],['Kondisi','textarea','Contoh: Industry = Finance AND Score > 80'],['Refresh','select','Realtime|Daily|Weekly']] },
  { pages: ['Automation'], fields: [['Nama workflow','text','Contoh: New lead nurturing'],['Trigger','select','Lead created|Stage changed|Form submitted|Date reached'],['Action','select','Send email|Create task|Update field|Notify owner'],['Owner','text','Pilih workflow owner']] },
  { pages: ['Activities'], fields: [['Tipe aktivitas','select','Meeting|Call|Email|Follow-up|Demo'],['Account / contact','text','Cari account atau kontak'],['Owner','text','Pilih owner'],['Tanggal','date',''],['Waktu','time',''],['Agenda','textarea','Tujuan dan agenda aktivitas']] },
]

function getWorkflowFields(subActive) {
  return workflowGroups.find(group => group.pages.includes(subActive))?.fields || [['Nama record','text','Masukkan nama'],['Owner','text','Pilih owner'],['Tanggal','date',''],['Catatan','textarea','Tambahkan detail']]
}

function Avatar({ initials, color = '#dceaff', size = 28 }) {
  return <span className="avatar" style={{ width: size, height: size, background: color }}>{initials}</span>
}

function LoginPage({ onLogin }) {
  const [roleId, setRoleId] = useState('executive')
  const selectedRole = demoRoles.find(role => role.id === roleId)
  const [email, setEmail] = useState(selectedRole.email)
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const selectRole = role => {
    setRoleId(role.id)
    setEmail(role.email)
    setPassword('demo123')
    setError('')
  }

  const submit = event => {
    event.preventDefault()
    if (email !== selectedRole.email || password !== 'demo123') {
      setError('Gunakan akun role yang dipilih dan password demo123.')
      return
    }
    onLogin(selectedRole)
  }

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="login-brand"><img src="/assets/satya-erp-mark.png" alt="Satya ERP" /><span>Satya <strong>ERP</strong></span></div>
        <div className="showcase-copy">
          <span className="login-kicker"><Sparkles size={14}/> One platform, every operation</span>
          <h1>Kendalikan bisnis dalam satu ruang kerja.</h1>
          <p>HR, proyek IT, finance, dan CRM terhubung dalam satu sistem yang sederhana dan mudah dipantau.</p>
          <div className="showcase-stats"><div><strong>4</strong><span>Modul terintegrasi</span></div><div><strong>186</strong><span>Anggota tim</span></div><div><strong>99.9%</strong><span>System uptime</span></div></div>
        </div>
        <div className="login-visual" aria-hidden="true">
          <div className="visual-window">
            <div className="visual-bar"><i/><i/><i/></div>
            <div className="visual-content"><aside/><div><span/><span/><span/><section><b/><b/><b/><b/><b/></section></div></div>
          </div>
          <span className="floating-card float-a"><TrendingUp size={17}/><b>+18.4%</b><small>Revenue growth</small></span>
          <span className="floating-card float-b"><UsersRound size={17}/><b>186</b><small>Active employees</small></span>
        </div>
        <small className="login-copyright">© 2026 Satya ERP · Demo environment</small>
      </section>

      <section className="login-panel">
        <div className="login-box">
          <div className="mobile-login-brand"><img src="/assets/satya-erp-mark.png" alt=""/><span>Satya <strong>ERP</strong></span></div>
          <span className="secure-label"><ShieldCheck size={15}/> DEMO ACCESS</span>
          <h2>Selamat datang kembali</h2>
          <p className="login-subtitle">Pilih role untuk mencoba pengalaman dan hak akses yang berbeda.</p>
          <div className="role-selector">
            {demoRoles.map(role => {
              const Icon = role.icon
              return <button type="button" key={role.id} className={roleId === role.id ? 'active' : ''} onClick={() => selectRole(role)}><span style={{ '--role-color': role.color }}><Icon size={16}/></span><div><strong>{role.name}</strong><small>{role.description}</small></div><i/></button>
            })}
          </div>
          <form onSubmit={submit}>
            <label>Email akun demo<input type="email" value={email} onChange={event => { setEmail(event.target.value); setError('') }} /></label>
            <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={event => { setPassword(event.target.value); setError('') }}/><button type="button" aria-label="Tampilkan password" onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
            <div className="demo-hint"><span>Password semua akun demo</span><code>demo123</code></div>
            {error && <p className="login-error">{error}</p>}
            <button className="login-submit" type="submit"><LogIn size={17}/>Masuk sebagai {selectedRole.name}<ArrowRight size={16}/></button>
          </form>
          <p className="demo-notice">Ini adalah prototipe. Tidak ada data atau kredensial asli yang digunakan.</p>
        </div>
      </section>
    </main>
  )
}

function Sidebar({ active, setActive, subActive, setSubActive, open, setOpen, user, onLogout, navCollapsed, setNavCollapsed, onAction }) {
  const [collapsedGroups, setCollapsedGroups] = useState({})
  const changeModule = id => {
    setActive(id)
    setSubActive(subMenus[id][0].items[0])
    if (navCollapsed) setNavCollapsed(false)
  }
  const toggleGroup = group => {
    const key = `${active}:${group}`
    setCollapsedGroups(current => ({ ...current, [key]: !current[key] }))
  }
  return (
    <aside className={`sidebar ${open ? 'open' : ''} ${navCollapsed ? 'nav-collapsed' : ''}`}>
      <div className="icon-rail">
        <span className="rail-logo"><img src="/assets/satya-erp-mark.png" alt="Satya ERP" /></span>
        <button className="panel-show-button" aria-label="Tampilkan menu" title="Tampilkan menu" onClick={() => setNavCollapsed(false)}><ChevronRight size={16}/></button>
        <nav className="rail-nav">
          {modules.filter(module => user.allowed.includes(module.id)).map(({ id, label, icon: Icon, count }) => (
            <button key={id} aria-label={label} title={label} className={active === id ? 'active' : ''} onClick={() => changeModule(id)}>
              <Icon size={19} />{count && <i />}
            </button>
          ))}
        </nav>
        <div className="rail-bottom">
          <button aria-label="Pesan" onClick={() => onAction('Pusat pesan dibuka · 3 pesan belum dibaca')}><MessageSquare size={18} /><i /></button>
          <button aria-label="Pengaturan" onClick={() => onAction('Pengaturan workspace dibuka')}><Settings2 size={19} /></button>
        </div>
      </div>
      <div className="side-panel">
        <div className="brand"><span className="brand-name">Satya <strong>ERP</strong></span><button className="panel-hide-button" aria-label="Sembunyikan menu" title="Sembunyikan menu" onClick={() => setNavCollapsed(true)}><ChevronRight size={16}/></button></div>
        <button className="close-mobile" onClick={() => setOpen(false)}><X /></button>
        <div className="side-utilities"><button onClick={() => onAction(`${subActive} ditambahkan ke favorit`)}><span>☆</span> Favorit</button><button onClick={() => onAction('Daftar halaman terakhir dibuka')}><Clock3 size={14} /> Terakhir dibuka</button></div>
        <nav className="main-nav">
          <div className="module-label"><span>{modules.find(m => m.id === active)?.label}</span><button onClick={() => onAction('Menu kustom baru siap ditambahkan')} title="Tambah menu"><Plus size={14} /></button></div>
          {subMenus[active].map(section => (
            <div className="tree-group" key={section.group}>
              <button className={`tree-heading ${collapsedGroups[`${active}:${section.group}`] ? 'collapsed' : ''}`} aria-expanded={!collapsedGroups[`${active}:${section.group}`]} onClick={() => toggleGroup(section.group)}><ChevronDown size={12} />{section.group}</button>
              <div className={`tree-items ${collapsedGroups[`${active}:${section.group}`] ? 'collapsed' : ''}`}>
                {section.items.map(item => (
                  <button key={item} className={subActive === item ? 'active' : ''} onClick={() => { setSubActive(item); setOpen(false) }}>
                    <span />{item}{item === 'My tasks' && <em>8</em>}{item === 'Invoices' && <em>3</em>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <button className="manage-folders" onClick={() => onAction('Pengelola susunan menu dibuka')}><FolderKanban size={14} />Kelola menu</button>
        <div className="account"><Avatar initials={user.initials} color="#cfe2ff" size={34} /><div><strong>{user.user}</strong><small>{user.name}</small></div><button className="logout-button" onClick={onLogout} title="Keluar"><LogOut size={16} /></button></div>
      </div>
    </aside>
  )
}

function RevenueChart() {
  return (
    <svg className="revenue-chart" viewBox="0 0 660 205" preserveAspectRatio="none" aria-label="Grafik pendapatan bulanan">
      <defs>
        <linearGradient id="areaBlue" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#287cf7" stopOpacity=".25" />
          <stop offset="100%" stopColor="#287cf7" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 75, 120, 165].map(y => <line key={y} x1="0" x2="660" y1={y} y2={y} stroke="#e9eef6" strokeDasharray="4 5" />)}
      <path d="M0,164 C35,150 52,154 82,139 S135,132 163,119 S215,133 248,104 S293,96 329,88 S375,110 412,73 S461,84 496,58 S540,65 576,35 S626,48 660,17 L660,205 L0,205Z" fill="url(#areaBlue)" />
      <path d="M0,164 C35,150 52,154 82,139 S135,132 163,119 S215,133 248,104 S293,96 329,88 S375,110 412,73 S461,84 496,58 S540,65 576,35 S626,48 660,17" fill="none" stroke="#146ef5" strokeWidth="3" strokeLinecap="round" />
      <path d="M0,177 C70,170 107,157 163,157 S250,137 329,142 S408,123 496,126 S575,101 660,104" fill="none" stroke="#a7bddc" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="576" cy="35" r="5" fill="#fff" stroke="#146ef5" strokeWidth="3" />
      <g transform="translate(540 5)"><rect width="74" height="26" rx="8" fill="#12213a"/><text x="37" y="17" textAnchor="middle" fontSize="10" fill="white">Rp 1,8 M</text></g>
    </svg>
  )
}

function Dashboard({ toast }) {
  const [activeRep, setActiveRep] = useState('Dina')
  const [timeframeEnabled, setTimeframeEnabled] = useState(true)
  const [reportPeriod, setReportPeriod] = useState('Agu 1 – Agu 31, 2026')
  const [channelFilter, setChannelFilter] = useState('All')
  const [showRepDetails, setShowRepDetails] = useState(true)
  const [valueMetric, setValueMetric] = useState('Revenue')
  const cycleReportPeriod = () => setReportPeriod(value => value.startsWith('Agu') ? 'Jul 1 – Jul 31, 2026' : value.startsWith('Jul') ? 'Q3 · 2026' : 'Agu 1 – Agu 31, 2026')
  const channels = [
    { name: 'Organic search', icon: 'G', amount: 'Rp 422,4 Jt', share: '43%', color: '#4285f4' },
    { name: 'LinkedIn', icon: 'in', amount: 'Rp 268,8 Jt', share: '27%', color: '#1676b6' },
    { name: 'Instagram', icon: '◎', amount: 'Rp 176,2 Jt', share: '18%', color: '#e84d82' },
    { name: 'Referral', icon: '↗', amount: 'Rp 117,5 Jt', share: '12%', color: '#765de8' },
  ]
  const reps = [
    { name: 'Rama', initials: 'RA', value: 'Rp 612,4 Jt', color: '#dceaff', width: '37%' },
    { name: 'Dina', initials: 'DN', value: 'Rp 528,9 Jt', color: '#dff6ed', width: '32%' },
    { name: 'Nadia', initials: 'NS', value: 'Rp 384,2 Jt', color: '#eee8ff', width: '23%' },
    { name: 'Fahri', initials: 'FA', value: 'Rp 132,5 Jt', color: '#fff0df', width: '8%' },
  ]
  return (
    <div className="report-dashboard">
      <div className="report-title-row">
        <h1>Business report</h1>
        <div className="report-range"><button className={`switch ${timeframeEnabled?'on':''}`} onClick={() => setTimeframeEnabled(value=>!value)} aria-label="Toggle timeframe"><i /></button><small>Timeframe</small><button onClick={cycleReportPeriod}>{reportPeriod} <ChevronDown size={13} /></button></div>
      </div>

      <section className="report-summary">
        <div className="revenue-overview">
          <span>Revenue</span>
          <div><strong>Rp 1.658.000.000</strong><em><ArrowUpRight size={12} /> 12,4%</em><b>+Rp 182 Jt</b></div>
          <small>vs bulan lalu Rp 1.476.000.000 · Agu 1–31, 2026 <ChevronDown size={11} /></small>
        </div>
        <div className="mini-summary-cards">
          <article className="summary-card top-sales"><small>Top sales</small><strong>42</strong><div><Avatar initials="RA" color="#dceaff" size={23} />Rama</div><ChevronRight size={15} /></article>
          <article className="summary-card best-deal"><small>Best deal</small><strong>Rp 482 Jt</strong><div>Bank Aruna</div><button onClick={() => toast('Detail deal dibuka')}><ArrowRight size={13} /></button></article>
          <article className="summary-card"><small>Deals</small><strong>186</strong><span><ArrowUpRight size={11} /> 8</span></article>
          <article className="summary-card outlined"><small>Value</small><strong>1,65 M</strong><span><ArrowUpRight size={11} /> 12,4%</span></article>
          <article className="summary-card"><small>Win rate</small><strong>48%</strong><span><ArrowUpRight size={11} /> 3,2%</span></article>
        </div>
      </section>

      <section className="rep-strip">
        {reps.map(rep => <button key={rep.name} style={{ '--rep-width': rep.width }} onClick={() => setActiveRep(rep.name)} className={activeRep === rep.name ? 'active' : ''}><Avatar initials={rep.initials} color={rep.color} size={23} /><strong>{rep.value}</strong><span>{rep.width}</span></button>)}
        <button className="detail-pill" onClick={() => toast('Detail tim penjualan dibuka')}>Details</button>
      </section>

      <section className="analytics-layout">
        <article className="analytic-card channel-card">
          <div className="compact-card-head"><button onClick={() => toast('Urutan channel diubah berdasarkan revenue')}><Menu size={16} /><ChevronDown size={12} /></button><button onClick={() => setChannelFilter(value => value === 'All' ? 'Top 3' : 'All')}>{channelFilter === 'All' ? 'Filters' : channelFilter} <Filter size={12} /></button></div>
          <div className="channel-list">{channels.slice(0,channelFilter==='Top 3'?3:4).map(channel => <div key={channel.name}><span className="channel-icon" style={{ color: channel.color }}>{channel.icon}</span><span>{channel.name}</span><strong>{channel.amount}</strong><em>{channel.share}</em></div>)}</div>
        </article>

        <article className="analytic-card referrer-card">
          <div className="compact-card-head"><button onClick={() => toast('Mode chart referrer diganti')}><Activity size={16} /><ChevronDown size={12} /></button><button onClick={() => toast('Filter referrer aktif: seluruh channel')}>Filters <Filter size={12} /></button></div>
          <div className="referrer-bars">
            {[{h:62,l:'in',c:'#1676b6'},{h:84,l:'G',c:'#4285f4'},{h:49,l:'◎',c:'#e84d82'},{h:76,l:'↗',c:'#765de8'}].map((bar,i)=><div key={i}><span className={i===0||i===3?'striped':''} style={{height:`${bar.h}%`}}><i style={{color:bar.c}}>{bar.l}</i></span></div>)}
          </div>
          <p>Deals amount<br/><strong>by referrer category</strong> <ChevronDown size={11}/></p>
        </article>

        <article className="analytic-card performance-card">
          <div className="performance-table-head"><span>Sales</span><span>Revenue</span><span>Leads</span><span>KPI</span><span>W/L</span></div>
          <div className="sales-person compact"><div><Avatar initials="RA" color="#dceaff" size={25}/><strong>Rama A.</strong></div><b>Rp 612,4 Jt</b><span>68</span><span>0.91</span><em>42% · 24/18</em></div>
          <div className="person-focus">
            <div className="sales-person"><div><Avatar initials="DN" color="#dff6ed" size={28}/><strong>Dina N.</strong></div><b>Rp 528,9 Jt</b><span>54</span><span>0.89</span><em>39% · 21/33</em><button onClick={() => setShowRepDetails(value=>!value)}><ChevronDown size={14}/></button></div>
            {showRepDetails && <><div className="badges"><span>Top sales 💪</span><span>Sales streak 🔥</span><span>Top review 👍</span></div>
            <h3>Work with channels</h3>
            <div className="channel-share">
              <div className="share-main"><span className="channel-icon" style={{color:'#1676b6'}}>in</span><small>LinkedIn</small><strong>45.3% <em>Rp 239,6 Jt</em></strong></div>
              <div className="share-stack"><div><span>◎ Instagram</span><b>28.1% <em>Rp 148,6 Jt</em></b></div><div><span>G Google</span><b>14.1% <em>Rp 74,5 Jt</em></b></div><div><span>▣ Other</span><b>12.5% <em>Rp 66,2 Jt</em></b></div></div>
            </div>
            <div className="sales-dynamic"><div><strong>Sales dynamic</strong><ArrowUpRight size={14}/></div><svg viewBox="0 0 520 76" preserveAspectRatio="none"><path d="M0 55 C30 67 52 45 75 50 S111 34 140 48 S175 19 202 32 S234 26 263 45 S296 38 322 29 S363 46 391 33 S428 39 455 25 S488 30 520 12" fill="none" stroke="#146ef5" strokeWidth="2.3"/><path d="M0 42 C32 27 58 38 84 30 S127 46 158 29 S203 48 237 35 S284 44 318 30 S362 34 397 22 S447 31 520 21" fill="none" stroke="#b9c6d8" strokeWidth="1.3" strokeDasharray="3 4"/></svg><div className="dynamic-axis"><span>W 1</span><span>W 3</span><span>W 5</span><span>W 7</span><span>W 9</span><span>W 11</span></div></div></>}
          </div>
          <div className="sales-person compact footer-person"><div><Avatar initials="NS" color="#eee8ff" size={25}/><strong>Nadia S.</strong></div><b>Rp 384,2 Jt</b><span>42</span><span>0.84</span><em>33% · 18/24</em></div>
        </article>

        <article className="analytic-card value-card">
          <div className="value-card-head"><div><span className="channel-icon" style={{color:'#146ef5'}}>in</span><small>Platform value</small><strong>LinkedIn <ChevronDown size={11}/></strong></div><div>{['Revenue','Leads','W/L'].map(metric=><button key={metric} className={valueMetric===metric?'active':''} onClick={()=>setValueMetric(metric)}>{metric}</button>)}</div></div>
          <div className="value-chart"><aside><span>Revenue<strong>Rp 328 Jt</strong></span><span>Leads<strong>373</strong></span><span>Win/loss<strong>186 / 91</strong></span></aside><div className="monthly-bars">{[44,66,52,81,69,87,73,96].map((h,i)=><div key={i}><em>{i===1?'Rp 48Jt':i===4?'Rp 63Jt':''}</em><span className={i===3||i===6?'stripe':''} style={{height:`${h}%`}}/><i><Avatar initials={['RA','DN','NS','FA'][i%4]} color={['#dceaff','#dff6ed','#eee8ff','#fff0df'][i%4]} size={16}/></i></div>)}</div></div>
        </article>
      </section>
    </div>
  )
}

function WorkflowDrawer({ subActive, config, record, onClose, onCreated, onUpdated, toast }) {
  const fields = getWorkflowFields(subActive)
  const [formData, setFormData] = useState({})
  const [editing, setEditing] = useState(false)
  const isDetail = Boolean(record) && !editing
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeWithEscape = event => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeWithEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeWithEscape) }
  }, [onClose])
  const submit = event => {
    event.preventDefault()
    const firstValue = formData[fields[0][0]] || `${subActive} baru`
    const nextRecord = { ...(record || {}), title: firstValue, meta: `${record?'Diperbarui':'Dibuat'} melalui ${subActive} · Baru saja`, value: formData.Jumlah || formData.Value || formData.Budget || record?.value || 'Baru', status: record?.status || 'Draft' }
    record ? onUpdated(nextRecord) : onCreated(nextRecord)
  }
  return <div className="workflow-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <aside className="workflow-drawer">
      <header className="workflow-header"><div><span className="eyebrow blue-text">{isDetail ? 'RECORD DETAIL' : record ? 'EDIT WORKFLOW' : 'NEW WORKFLOW'}</span><h2>{isDetail ? record.title : record ? `Edit ${record.title}` : config.action}</h2><p>{isDetail ? record.meta : `Lengkapi informasi untuk ${subActive.toLowerCase()}.`}</p></div><button onClick={onClose}><X size={18}/></button></header>
      {isDetail ? <div className="record-detail-view">
        <div className="detail-status-row"><span className={`record-status ${record.status.toLowerCase().replaceAll(' ','-')}`}>{record.status}</span><small>Last updated just now</small></div>
        <section className="detail-summary-card"><span>Current value</span><strong>{record.value}</strong><div><Avatar initials={record.title.slice(0,2).toUpperCase()} color="#dceaff" size={30}/><p><b>Owner</b><small>Nadia Santoso</small></p></div></section>
        <section className="detail-fields"><h3>Informasi record</h3><div><label>Reference</label><strong>{record.title}</strong></div><div><label>Detail</label><strong>{record.meta}</strong></div><div><label>Module</label><strong>{subActive}</strong></div><div><label>Status</label><strong>{record.status}</strong></div></section>
        <section className="approval-flow"><h3>Workflow & approval</h3>{['Record dibuat','Review oleh owner','Final approval'].map((step,index)=><div key={step} className={index===0?'done':index===1?'active':''}><i>{index===0?<Check size={12}/>:index+1}</i><p><strong>{step}</strong><small>{index===0?'Selesai · hari ini':index===1?'Menunggu tindakan':'Belum dimulai'}</small></p></div>)}</section>
        <section className="detail-activity"><h3>Activity log</h3><div><Avatar initials="NS" color="#dceaff" size={26}/><p><strong>Nadia membuat record ini</strong><small>Baru saja · melalui Satya ERP</small></p></div></section>
        <footer className="drawer-actions"><button className="drawer-secondary" onClick={()=>{setFormData({[fields[0][0]]:record.title});setEditing(true)}}>Edit record</button><button className="drawer-primary" onClick={()=>onUpdated({...record,status:'Approved',meta:`${record.meta} · Approved`})}><Check size={15}/>Approve & continue</button></footer>
      </div> : <form className="workflow-form" onSubmit={submit}>
        <div className="form-context"><span><Sparkles size={16}/></span><p><strong>Workflow aktif</strong><small>Setelah disimpan, record masuk ke tahap Draft dan dapat dikirim untuk approval.</small></p></div>
        <div className="workflow-fields">{fields.map(([label,type,placeholder],index)=><label key={label} className={type==='textarea'?'wide':''}><span>{label}{index<2&&<em>*</em>}</span>{type==='select'?<select required={index<2} value={formData[label]||''} onChange={event=>setFormData({...formData,[label]:event.target.value})}><option value="">Pilih {label.toLowerCase()}</option>{placeholder.split('|').map(option=><option key={option}>{option}</option>)}</select>:type==='textarea'?<textarea value={formData[label]||''} placeholder={placeholder} onChange={event=>setFormData({...formData,[label]:event.target.value})}/>:<input required={index<2} type={type} value={formData[label]||''} placeholder={placeholder} onChange={event=>setFormData({...formData,[label]:event.target.value})}/>}</label>)}</div>
        <div className="approval-note"><ShieldCheck size={16}/><div><strong>Approval policy</strong><p>Record akan mengikuti alur persetujuan workspace sesuai nilai dan department.</p></div></div>
        <footer className="drawer-actions"><button type="button" className="drawer-secondary" onClick={onClose}>Batal</button><button className="drawer-primary" type="submit"><Check size={15}/>{record?'Simpan perubahan':'Simpan sebagai draft'}</button></footer>
      </form>}
    </aside>
  </div>
}

function SubmenuPage({ active, subActive, toast }) {
  const config = submenuPages[subActive] || { kind: 'table', description: 'Kelola data dan aktivitas pada halaman ini.', primary: ['Total records', '128', '+8'], action: 'Tambah data' }
  const stats = [config.primary, ...moduleStatDefaults[active]]
  const [records, setRecords] = useState(moduleRecords[active])
  const [drawer, setDrawer] = useState(null)
  const [pagePeriod, setPagePeriod] = useState('Bulan ini')
  const [searchOpen, setSearchOpen] = useState(false)
  const [recordQuery, setRecordQuery] = useState('')
  const [filterMode, setFilterMode] = useState('Semua status')
  useEffect(() => { setRecords(moduleRecords[active]); setDrawer(null) }, [active, subActive])
  const openRecord = record => setDrawer({ record })
  const createRecord = record => { setRecords(current => [record, ...current]); setDrawer(null); toast(`${config.action} tersimpan sebagai draft`) }
  const updateRecord = record => { setRecords(current => current.map(item => item.title === drawer?.record?.title ? record : item)); setDrawer(null); toast(`Perubahan ${record.title} berhasil disimpan`) }
  const visibleRecords = records.filter(record => `${record.title} ${record.meta}`.toLowerCase().includes(recordQuery.toLowerCase())).filter(record => filterMode === 'Semua status' || ['At risk','Overdue','Pending','Review','Hot'].includes(record.status))
  const cyclePagePeriod = () => setPagePeriod(value => value === 'Bulan ini' ? 'Kuartal ini' : value === 'Kuartal ini' ? 'Tahun ini' : 'Bulan ini')
  const toggleFilter = () => setFilterMode(value => value === 'Semua status' ? 'Perlu perhatian' : 'Semua status')
  const exportRecords = () => {
    const csv = ['Name,Detail,Value,Status', ...visibleRecords.map(record => [record.title,record.meta,record.value,record.status].map(value => `"${String(value).replaceAll('"','""')}"`).join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}))
    const link = document.createElement('a'); link.href = url; link.download = `${subActive.toLowerCase().replaceAll(' ','-')}.csv`; link.click(); URL.revokeObjectURL(url)
    toast('Data berhasil diexport sebagai CSV')
  }
  const stageNames = active === 'crm' ? ['New lead', 'Qualified', 'Proposal', 'Won'] : active === 'hr' ? ['Applied', 'Screening', 'Interview', 'Offer'] : active === 'finance' ? ['Draft', 'Sent', 'Pending', 'Paid'] : ['Backlog', 'In progress', 'Review', 'Done']

  const renderContent = () => {
    if (config.kind === 'board') return <div className="demo-kanban">{['To do', 'In progress', 'Completed'].map((column, columnIndex) => <section key={column}><header><strong>{column}</strong><span>{visibleRecords.filter((_, i) => i % 3 === columnIndex).length}</span></header>{visibleRecords.filter((_, i) => i % 3 === columnIndex).map((record, index) => <article key={record.title} onClick={()=>openRecord(record)}><small>{active.toUpperCase()}-{102 + index}</small><strong>{record.title}</strong><p>{record.meta}</p><footer><Avatar initials={['RA','DN','NS'][columnIndex]} color={['#dceaff','#dff6ed','#eee8ff'][columnIndex]} size={23}/><span className={`record-status ${record.status.toLowerCase().replaceAll(' ','-')}`}>{record.status}</span></footer></article>)}</section>)}</div>

    if (config.kind === 'report') return <div className="submenu-report"><div className="submenu-chart-head"><div><small>PERFORMANCE TREND</small><strong>{config.primary[1]}</strong></div><span className="trend positive"><ArrowUpRight size={13}/>{config.primary[2]}</span></div><div className="submenu-line-chart"><RevenueChart/></div><div className="report-breakdown">{visibleRecords.slice(0,4).map((record,index)=><div key={record.title} onClick={()=>openRecord(record)}><span>{record.title}<em>{[42,27,19,12][index]}%</em></span><div><i style={{width:`${[84,67,48,31][index]}%`}}/></div></div>)}</div></div>

    if (config.kind === 'calendar') return <div className="timeline-demo">{visibleRecords.map((record,index)=><article key={record.title} onClick={()=>openRecord(record)}><time><strong>{String(9 + index).padStart(2,'0')}</strong><span>{index % 2 ? '30' : '00'}</span></time><i className={['blue','green','purple','orange'][index%4]}/><div><strong>{record.title}</strong><p>{record.meta}</p></div><span className={`record-status ${record.status.toLowerCase().replaceAll(' ','-')}`}>{record.status}</span></article>)}</div>

    if (config.kind === 'pipeline') return <div className="pipeline-board">{stageNames.map((stage,stageIndex)=><section key={stage}><header><span><i className={`stage-dot stage-${stageIndex}`}/>{stage}</span><b>{visibleRecords.filter((_,index)=>index%4===stageIndex || (stageIndex===0&&index===4)).length}</b></header>{visibleRecords.filter((_,index)=>index%4===stageIndex || (stageIndex===0&&index===4)).map(record=><article key={record.title} onClick={()=>openRecord(record)}><strong>{record.title}</strong><p>{record.meta}</p><footer><span>{record.value}</span><Avatar initials={['RA','DN','FA','NS'][stageIndex]} color={['#dceaff','#dff6ed','#fff0df','#eee8ff'][stageIndex]} size={22}/></footer></article>)}</section>)}</div>

    if (config.kind === 'cards') return <div className="record-card-grid">{visibleRecords.map((record,index)=><article key={record.title} onClick={()=>openRecord(record)}><header><span className={`record-card-icon tone-${index%4}`}>{[<FileBarChart size={17}/>,<Target size={17}/>,<Sparkles size={17}/>,<Activity size={17}/>][index%4]}</span><button onClick={event=>{event.stopPropagation();toast(`Menu aksi ${record.title} dibuka`)}}><MoreHorizontal size={16}/></button></header><strong>{record.title}</strong><p>{record.meta}</p><footer><b>{record.value}</b><span className={`record-status ${record.status.toLowerCase().replaceAll(' ','-')}`}>{record.status}</span></footer></article>)}</div>

    if (config.kind === 'org') return <div className="org-demo"><article className="org-root" onClick={()=>openRecord(visibleRecords[0]||records[0])}><Avatar initials="NS" color="#dceaff" size={40}/><strong>Nadia Santoso</strong><span>Chief Executive Officer</span></article><div className="org-line"/><div className="org-branches">{visibleRecords.slice(1,5).map((record,index)=><article key={record.title} onClick={()=>openRecord(record)}><Avatar initials={['RA','CA','DM','FA'][index]} color={['#dceaff','#eee8ff','#dff6ed','#fff0df'][index]} size={34}/><strong>{record.title}</strong><span>{record.meta.split('·')[0]}</span><em>{index + 3} reports</em></article>)}</div></div>

    return <div className="data-table-demo"><div className="data-table-head"><span>Name / Reference</span><span>Detail</span><span>Value</span><span>Status</span><span/></div>{visibleRecords.map(record=><div className="data-table-row" key={record.title} onClick={()=>openRecord(record)}><div><Avatar initials={record.title.slice(0,2).toUpperCase()} color="#e5efff" size={28}/><strong>{record.title}</strong></div><span>{record.meta}</span><b>{record.value}</b><span className={`record-status ${record.status.toLowerCase().replaceAll(' ','-')}`}>{record.status}</span><button aria-label={`Buka ${record.title}`} onClick={event=>{event.stopPropagation();openRecord(record)}}><ChevronRight size={16}/></button></div>)}</div>
  }

  return <div className="submenu-page">
    <div className="submenu-page-head"><div><span className="eyebrow blue-text">{navContent[active].eyebrow}</span><h1>{subActive}</h1><p>{config.description}</p></div><div className="page-actions"><button className="select-button" onClick={cyclePagePeriod}><CalendarDays size={15}/>{pagePeriod}<ChevronDown size={13}/></button><button className="select-button" onClick={exportRecords}><Download size={15}/>Export</button><button className="primary-button" onClick={()=>setDrawer({record:null})}><Plus size={16}/>{config.action}</button></div></div>
    <section className="subpage-stats">{stats.map(([label,value,delta],index)=><article key={label} className={index===0?'primary':''}><div><span>{label}</span><button onClick={()=>toast(`Detail metrik ${label} dibuka`)}><MoreHorizontal size={15}/></button></div><strong>{value}</strong><small className={String(delta).startsWith('-')?'down':''}>{String(delta).startsWith('-')?<ArrowDownRight size={12}/>:<ArrowUpRight size={12}/>} {delta} <em>vs last period</em></small></article>)}</section>
    <section className="subpage-layout"><article className="subpage-main-panel"><div className="subpage-panel-head"><div><span className="eyebrow">WORKSPACE</span><h2>{subActive} work queue</h2></div><div><button className={`select-button ${searchOpen?'active-control':''}`} onClick={()=>setSearchOpen(value=>!value)}><Search size={14}/>Search</button><button className={`select-button ${filterMode!=='Semua status'?'active-control':''}`} onClick={toggleFilter}><Filter size={14}/>{filterMode==='Semua status'?'Filter':'Attention'}</button></div></div>{searchOpen&&<div className="inline-search"><Search size={14}/><input autoFocus value={recordQuery} onChange={event=>setRecordQuery(event.target.value)} placeholder={`Cari di ${subActive}...`}/>{recordQuery&&<button onClick={()=>setRecordQuery('')}><X size={13}/></button>}</div>}{visibleRecords.length?renderContent():<div className="empty-state"><Search size={24}/><strong>Data tidak ditemukan</strong><p>Ubah kata pencarian atau nonaktifkan filter.</p></div>}</article><aside className="subpage-aside"><div className="health-widget"><div><span className="eyebrow">HEALTH SCORE</span><strong>92</strong><small>/100</small></div><div className="health-ring"><span>92%</span></div></div><div className="quick-insight"><span><Sparkles size={16}/></span><div><strong>Smart insight</strong><p>Performa meningkat dan berada di atas target periode ini.</p></div></div><div className="side-update-list"><header><strong>Recent updates</strong><button onClick={()=>toast('Seluruh aktivitas terbaru ditampilkan')}><MoreHorizontal size={15}/></button></header>{activities.slice(0,3).map(({icon:Icon,tone,title,time})=><div key={title}><span className={`activity-icon ${tone}`}><Icon size={13}/></span><p><strong>{title}</strong><small>{time} lalu</small></p></div>)}</div><button className="view-report-button" onClick={()=>toast('Laporan lengkap dibuka')}>Lihat laporan lengkap <ArrowRight size={14}/></button></aside></section>
    {drawer && <WorkflowDrawer subActive={subActive} config={config} record={drawer.record} onClose={()=>setDrawer(null)} onCreated={createRecord} onUpdated={updateRecord} toast={toast}/>} 
  </div>
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [active, setActive] = useState('overview')
  const [subActive, setSubActive] = useState('Executive overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [topPopover, setTopPopover] = useState(null)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const searchRef = useRef(null)
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()), [])
  const toast = message => { setNotice(message); setTimeout(() => setNotice(''), 2400) }
  const searchResults = globalSearchItems.filter(item => !search || `${item.title} ${item.meta}`.toLowerCase().includes(search.toLowerCase())).filter(item => currentUser?.allowed.includes(item.module)).slice(0,5)
  useEffect(() => {
    const focusSearch = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus() }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])
  const openSearchResult = item => { setActive(item.module); setSubActive(item.page); setSearch(''); toast(`${item.title} dibuka`) }
  const downloadWorkspace = () => {
    const data = JSON.stringify({ workspace:'Satya ERP', exportedAt:new Date().toISOString(), module:active, page:subActive }, null, 2)
    const url = URL.createObjectURL(new Blob([data], {type:'application/json'})); const link = document.createElement('a'); link.href=url; link.download='satya-erp-workspace.json'; link.click(); URL.revokeObjectURL(url); toast('Snapshot workspace berhasil diunduh')
  }
  const shareWorkspace = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast('Tautan workspace disalin') } catch { toast('Tautan workspace siap dibagikan') }
  }
  const handleLogin = role => {
    setCurrentUser(role)
    setActive(role.home)
    setSubActive(subMenus[role.home][0].items[0])
  }
  const handleLogout = () => {
    setCurrentUser(null)
    setActive('overview')
    setSubActive('Executive overview')
  }

  if (!currentUser) return <LoginPage onLogin={handleLogin} />

  return (
    <div className={`app-shell ${navCollapsed ? 'nav-collapsed' : ''}`}>
      <Sidebar active={active} setActive={setActive} subActive={subActive} setSubActive={setSubActive} open={sidebarOpen} setOpen={setSidebarOpen} user={currentUser} onLogout={handleLogout} navCollapsed={navCollapsed} setNavCollapsed={setNavCollapsed} onAction={toast} />
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="search-wrap"><Search size={18} /><input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari karyawan, proyek, invoice..." />{search && <button onClick={() => setSearch('')}><X size={15} /></button>}<kbd>⌘ K</kbd>{search&&<div className="global-search-results">{searchResults.length?searchResults.map(item=><button key={item.title} onClick={()=>openSearchResult(item)}><Search size={14}/><span><strong>{item.title}</strong><small>{item.meta}</small></span><ArrowRight size={14}/></button>):<p>Tidak ada hasil yang dapat diakses.</p>}</div>}</div>
          <div className="top-actions"><span className="date"><CalendarDays size={16} /> {dateLabel}</span><button className={`icon-button ${topPopover==='notifications'?'active':''}`} onClick={() => setTopPopover(value=>value==='notifications'?null:'notifications')}><Bell size={19} />{!notificationsRead&&<i />}</button><button className={`help-button ${topPopover==='help'?'active':''}`} onClick={() => setTopPopover(value=>value==='help'?null:'help')}>?</button><button className="profile-trigger" onClick={() => setTopPopover(value=>value==='profile'?null:'profile')}><Avatar initials={currentUser.initials} color="#cfe2ff" size={38} /></button>{topPopover&&<div className="top-popover">{topPopover==='notifications'?<><header><strong>Notifikasi</strong><button onClick={()=>{setNotificationsRead(true);setTopPopover(null);toast('Semua notifikasi ditandai dibaca')}}>Tandai dibaca</button></header><div className="popover-item"><span className="activity-icon blue"><Check size={14}/></span><p><strong>Approval menunggu</strong><small>3 request perlu tindakan Anda</small></p></div><div className="popover-item"><span className="activity-icon green"><CircleDollarSign size={14}/></span><p><strong>Invoice dibayar</strong><small>INV-2026-0842 · Rp 284 Jt</small></p></div></>:topPopover==='help'?<><header><strong>Help center</strong></header><button className="popover-link" onClick={()=>toast('Panduan Satya ERP dibuka')}>Buka panduan penggunaan <ArrowRight size={14}/></button><button className="popover-link" onClick={()=>toast('Chat support dimulai')}>Hubungi support <ArrowRight size={14}/></button><small className="shortcut-hint">Tekan ⌘ K untuk pencarian global</small></>:<><header><strong>{currentUser.user}</strong></header><p className="profile-role">{currentUser.name} · {currentUser.email}</p><button className="popover-link" onClick={()=>toast('Profil pengguna dibuka')}>Pengaturan profil <ArrowRight size={14}/></button><button className="popover-link danger" onClick={handleLogout}>Keluar <LogOut size={14}/></button></>}</div>}</div>
        </header>
        <div className="page-content">
          <div className="workspace-tabs"><button className="add-tab" onClick={()=>toast('Undang anggota workspace dibuka')} title="Tambah anggota"><Plus size={16} /></button><button className="member-tab" onClick={()=>toast('Aktivitas Nadia ditampilkan')}><Avatar initials="NS" color="#dbeaff" size={25} /> Nadia S.</button><button className="member-tab" onClick={()=>toast('Aktivitas Rama ditampilkan')}><Avatar initials="RA" color="#eae5ff" size={25} /> Rama A.</button><button className="member-tab" onClick={()=>toast('Aktivitas Dina ditampilkan')}><Avatar initials="DN" color="#dcf6ed" size={25} /> Dina N.</button><button className="tab-logo" onClick={()=>{setActive('overview');setSubActive('Executive overview')}} title="Executive overview"><img src="/assets/satya-erp-mark.png" alt="" /></button><div className="tab-tools"><button onClick={()=>toast('Pengaturan tampilan dibuka')} title="Pengaturan"><Settings2 size={16} /></button><button onClick={downloadWorkspace} title="Download snapshot"><Download size={16} /></button><button onClick={shareWorkspace} title="Bagikan workspace"><ArrowUpRight size={16} /></button></div></div>
          {active === 'overview' && subActive === 'Executive overview' ? <Dashboard toast={toast} /> : <SubmenuPage active={active} subActive={subActive} toast={toast} />}
        </div>
      </main>
      {notice && <div className="toast"><Check size={16} />{notice}</div>}
    </div>
  )
}
