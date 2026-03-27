# WIT Leads Dashboard 🚀

Dashboard monitoring dan manajemen leads untuk **PT Wahana Informasi dan Teknologi (WIT)**

![Dashboard Preview](./preview.png)

---

## ✨ Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Total leads, leads aktif, won, lost
- **Pipeline Value**: Total nilai pipeline dalam Rupiah
- **Quick Actions**: Akses cepat ke Leads, Clients, Employees
- **Recent Leads**: 10 leads terbaru dengan status update

### 🎯 Leads Management
- **List Views**: Tabel leads dengan search & filter
- **Status Filters**: NEW, APPROVED, IN_PROGRESS, DONE, CANCELLED
- **Search**: Cari berdasarkan company, project, client, atau PIC
- **CRUD Operations**: Create, Read, Update, Delete leads
- **Actions**: View details, Edit, Delete

### 👥 Client Management
- **Client Database**: Daftar semua clients
- **Client Details**: Informasi kontak, industry, notes
- **Project History**: Semua project per client

### 📋 Employee Management
- **Employee Directory**: Data kepegawaian WIT
- **PIC Assignment**: Assign PIC ke leads
- **Department & Position**: Organizational structure

### 🎨 Design Features
- **Dark Theme**: Modern dark mode dengan WIT branding (Merah-Hitam)
- **Responsive**: Desktop, tablet, dan mobile friendly
- **Glass Morphism**: Glass effect cards dan panels
- **Smooth Animations**: Fade-in, hover effects, transitions
- **Custom Scrollbar**: Styled scrollbar matching theme

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 📦 Installation

### 1. Clone Repository

```bash
cd /home/ubuntu/.openclaw/workspace/wit-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan Supabase credentials kamu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nmcegwmrzewwgqxgbspi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ PENTING:** Ganti `your-anon-key-here` dengan anon key dari Supabase project kamu!

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Option 2: Deploy via GitHub

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/wit-dashboard.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Buka [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import dari GitHub repository
   - Set environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Production Deploy:**
   ```bash
   vercel --prod
   ```

---

## 📊 Database Schema

Dashboard ini menggunakan Supabase database dengan tables berikut:

### quotations (Leads)
```sql
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(client_id),
  company_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  project_description TEXT,
  client_name TEXT,
  pic_employee_id TEXT,
  pic_excel_name TEXT,
  status_id TEXT NOT NULL,
  currency TEXT DEFAULT 'IDR',
  unit_value DECIMAL,
  grand_total DECIMAL,
  tags TEXT[],
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### clients
```sql
CREATE TABLE clients (
  client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  industry TEXT,
  client_name TEXT,
  email TEXT,
  phone TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### employees
```sql
CREATE TABLE employees (
  employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  department TEXT,
  join_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 Customization

### Change Branding Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  wit: {
    red: '#c00000',        // Ganti dengan warna brand kamu
    dark: '#0a0a0a',
    darker: '#050505',
    card: '#111111',
    border: '#222222',
    text: '#ffffff',
    muted: '#888888',
  }
}
```

### Add New Pages

1. Buat file baru di `src/app/[page-name]/page.tsx`
2. Import komponen yang dibutuhkan
3. Add navigation di `src/components/Header.tsx`

### Add New Features

1. **Modal Forms**: Gunakan library seperti `@headlessui/react`
2. **Charts**: Install `recharts` atau `chart.js`
3. **Export**: Tambahkan library `xlsx` untuk Excel export
4. **PDF**: Gunakan `@react-pdf/renderer` untuk PDF generation

---

## 🔧 Development

### Project Structure

```
wit-dashboard/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Dashboard homepage
│   │   ├── leads/          # Leads management page
│   │   ├── clients/        # Clients management page
│   │   ├── employees/      # Employees management page
│   │   └── settings/       # Settings page
│   ├── components/         # Reusable React components
│   │   ├── Header.tsx      # Top navigation
│   │   ├── StatsCards.tsx  # Statistics cards
│   │   ├── LeadsTable.tsx  # Leads data table
│   │   └── ...
│   ├── lib/                # Utilities and API clients
│   │   └── supabase.ts     # Supabase client & API
│   └── styles/             # Global styles
│       └── globals.css     # Tailwind + custom CSS
├── public/                 # Static assets
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

---

## 📱 Screenshots

### Dashboard Overview
![Dashboard](./screenshots/dashboard.png)

### Leads Management
![Leads](./screenshots/leads.png)

### Dark Theme with WIT Branding
![Theme](./screenshots/theme.png)

---

## 🔐 Security

### Row Level Security (RLS)

Pastikan RLS enabled di Supabase tables:

```sql
-- Enable RLS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all
CREATE POLICY "Allow authenticated read"
  ON quotations FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert
CREATE POLICY "Allow authenticated insert"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update
CREATE POLICY "Allow authenticated update"
  ON quotations FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete
CREATE POLICY "Allow authenticated delete"
  ON quotations FOR DELETE
  TO authenticated
  USING (true);
```

### Environment Variables

**JANGAN commit `.env.local` ke Git!**

File `.env.local` sudah ada di `.gitignore`. Gunakan `.env.local.example` sebagai template.

---

## 🐛 Troubleshooting

### Error: Missing Supabase environment variables

**Solusi:** Pastikan `.env.local` sudah dibuat dan berisi:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Error: Table "quotations" does not exist

**Solusi:** Pastikan tables sudah dibuat di Supabase. Jalankan migration SQL di Supabase SQL Editor.

### Build fails on Vercel

**Solusi:** 
1. Check environment variables di Vercel dashboard
2. Pastikan semua variables ada di "Settings > Environment Variables"
3. Redeploy setelah add variables

---

## 📝 License

This project is proprietary software for PT Wahana Informasi dan Teknologi.

---

## 👨‍ Developer

**Built for WIT by AI Assistant**

- **Design Reference**: Pinx VueJS Admin Template
- **Adaptation**: Dark theme with WIT branding (Merah-Hitam)
- **Integration**: Supabase backend
- **Deployment**: Vercel

---

## 🆘 Support

Untuk pertanyaan atau issue:
1. Check dokumentasi ini
2. Lihat console browser untuk error messages
3. Check Supabase dashboard untuk database issues
4. Contact: Ilham Kurniawan (Admin)

---

**Last Updated:** March 27, 2026
