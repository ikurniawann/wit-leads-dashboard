# WIT Leads Dashboard

**PT Wahana Informasi dan Teknologi - Leads & Pipeline Management System**

![Version](https://img.shields.io/badge/version-1.0.0-red)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)

---

## 🚀 Quick Start

### **Live Dashboard**
🔗 **URL:** https://wit-leads-dashboard.vercel.app

### **Access**
- **No login required** (public dashboard)
- **Direct access** to all features

---

## 📋 Features

### **Dashboard (Phase 1)**
- 📊 **Real-time Stats Cards** (Revenue, Win Rate, Leads, Clients)
- 📈 **Pipeline Chart** (Revenue & Leads per month)
- 🎯 **Win Rate Chart** (Pie chart + conversion stats)
- 📑 **Leads Table** with CRUD operations
- ➕ **Add/Edit/Delete** leads with modal forms
- 🔍 **Search & Filter** by status, date, keyword

### **Clients Management (Phase 2)**
- 👥 **Client Database** with company info
- 🏢 **Contact Person** details
- 📧 **Email, Phone, Website** tracking
- 🏷️ **Tags & Notes** support
- ✅ **Active/Inactive** status

### **Employees Management (Phase 2)**
- 👔 **Employee Directory**
- 📊 **Position & Department** tracking
- 📅 **Join Date** management
- ✅ **Active/Inactive/Probation** status
- 🔍 **Search** by name, email, position

### **Analytics (Phase 3)**
- 💰 **Revenue by PIC** (Bar chart)
- 📈 **Monthly Trend** (Area chart with Revenue, Leads, Won)
- 🎯 **Performance Insights** (Top performer, Best conversion, Pipeline health)
- 📊 **6 Key Metrics** cards

### **Reports (Phase 3)**
- 📤 **Export to Excel** (.xlsx format)
- 📄 **Export to PDF** (with WIT branding)
- 📋 **Pre-built Reports** (Leads, Clients, Employees)
- 🔄 **Bulk Export** functionality

### **Settings (Phase 4)**
- 👤 **Profile Settings** (Avatar upload, personal info)
- 🎨 **App Settings** (Theme, color, notifications)
- 🌍 **Regional** (Language, timezone, date/currency format)
- 💾 **Database** (Supabase connection, tables, API keys)
- 🔧 **Data Management** (Backup, restore, export)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Charts** | Recharts |
| **Export** | xlsx, jspdf, jspdf-autotable |
| **Icons** | Lucide React |
| **Hosting** | Vercel |

---

## 📦 Installation (Local Development)

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account

### **Steps**

1. **Clone Repository**
```bash
git clone https://github.com/ikurniawann/wit-leads-dashboard.git
cd wit-leads-dashboard
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://nmcegwmrzewwgqxgbspi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Open Browser**
```
http://localhost:3000
```

---

## 🗄️ Database Schema

### **Tables**

| Table | Description | Rows |
|-------|-------------|------|
| `quotations` | Leads & quotations | 14 |
| `clients` | Client database | 4 |
| `employees` | Employee directory | 0 (seed pending) |
| `followup_logs` | Follow-up history | 0 |
| `lead_status` | Status master data | 5 |

### **Seed Data**

To populate employees table:

1. **Open Supabase SQL Editor**
   ```
   https://nmcegwmrzewwgqxgbspi.supabase.co/sql
   ```

2. **Run Seed Script**
   ```bash
   # Copy contents from wit/seed-employees.sql
   # Paste and run in SQL Editor
   ```

3. **Verify**
   ```sql
   SELECT COUNT(*) FROM employees;
   -- Should return ~35 rows
   ```

---

## 📁 Project Structure

```
wit-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Dashboard (Home)
│   │   ├── leads/             # Leads page
│   │   ├── clients/           # Clients page
│   │   ├── employees/         # Employees page
│   │   ├── analytics/         # Analytics page
│   │   ├── reports/           # Reports page
│   │   └── settings/          # Settings pages
│   │       ├── page.tsx       # Main settings
│   │       ├── profile/       # Profile settings
│   │       ├── app/           # App settings
│   │       └── database/      # Database settings
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── LeadsTable.tsx
│   │   ├── dashboard/         # Dashboard charts
│   │   ├── analytics/         # Analytics charts
│   │   ├── leads/             # Lead modals
│   │   ├── clients/           # Client modals
│   │   ├── employees/         # Employee modals
│   │   └── shared/            # Shared modals
│   ├── lib/                   # Utilities & API
│   │   ├── api/               # API functions
│   │   │   ├── leads.ts
│   │   │   ├── clients.ts
│   │   │   └── employees.ts
│   │   ├── utils/             # Export utilities
│   │   │   ├── export-excel.ts
│   │   │   └── export-pdf.ts
│   │   └── supabase.ts        # Supabase client
│   └── styles/                # Global styles
│       └── globals.css
├── wit/                       # WIT documentation
│   ├── seed-employees.sql     # Employee seed data
│   └── [other WIT files]
├── .env.local.example         # Environment template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🎨 Design System

### **Colors**
```css
--wit-red: #c00000      /* Primary brand color */
--wit-dark: #0a0a0a     /* Dark background */
--wit-darker: #050505   /* Darker background */
--wit-card: #111111     /* Card background */
--wit-border: #222222   /* Border color */
--wit-text: #ffffff     /* Text color */
--wit-muted: #888888    /* Muted text */
```

### **Components**
- **Glass cards** with backdrop blur
- **Red accent** (#c00000) for branding
- **Dark theme** optimized
- **Responsive** design (mobile-friendly)

---

## 🚀 Deployment

### **Production (Vercel)**

1. **Push to GitHub**
```bash
git add .
git commit -m "Your message"
git push origin main
```

2. **Auto-deploy**
- Vercel automatically deploys on push to `main`
- Check: https://vercel.com/ikurniawanns-projects/wit-leads-dashboard

3. **Environment Variables**
Ensure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Build Commands**
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## 📊 Usage Guide

### **Adding a Lead**
1. Go to **Dashboard**
2. Click **"Add Lead"** button
3. Fill in:
   - Company name
   - Project name
   - Client name
   - PIC (Person In Charge)
   - Status (NEW, APPROVED, IN_PROGRESS, DONE, CANCELLED)
   - Value (IDR)
   - Probability (%)
4. Click **"Create Lead"**

### **Exporting Data**
1. Go to **Reports** page
2. Choose data type (Leads, Clients, Employees)
3. Click **"Export Excel"** or **"Export PDF"**
4. File downloads automatically

### **Managing Employees**
1. Go to **Employees** page
2. Click **"Add Employee"**
3. Fill in:
   - Full name
   - Email, phone
   - Position, department
   - Join date
   - Status
4. Click **"Create Employee"**

---

## 🔧 Maintenance

### **Common Tasks**

**1. Add New Employee**
```sql
INSERT INTO employees (employee_name, email, position, department, status)
VALUES ('Name', 'email@wit.com', 'Position', 'Department', 'active');
```

**2. Update Lead Status**
```sql
UPDATE quotations
SET status_id = 'DONE', value = 500000000
WHERE quotation_id = 'LEAD-202603-001';
```

**3. Backup Data**
- Use **Settings → Database → Download Backup**
- Or export via **Reports** page

### **Troubleshooting**

**Build Error: Module not found**
```bash
# Clear cache
rm -rf .next
npm run build
```

**Runtime Error: toLowerCase undefined**
- Check for null/undefined values in search filters
- Add optional chaining: `?.toLowerCase()`

**Supabase Connection Failed**
- Verify environment variables
- Check Supabase project status
- Ensure API key is valid

---

## 📝 Changelog

### **v1.0.0** (March 27, 2026)
- ✅ **Phase 1:** Dashboard, Leads CRUD, Stats, Charts
- ✅ **Phase 2:** Clients CRUD, Employees CRUD
- ✅ **Phase 3:** Analytics, Reports, Export (Excel/PDF)
- ✅ **Phase 4:** Settings (Profile, App, Database)
- ✅ **Total:** 11 pages, 4,000+ lines of code

---

## 👥 Team

**Developed for:** PT Wahana Informasi dan Teknologi (WIT)  
**Developer:** OpenClaw AI Assistant  
**Project Lead:** Ilham Kurniawan (Managing Director)

---

## 📞 Support

**Issues:** Create GitHub issue  
**Docs:** https://docs.openclaw.ai  
**Community:** https://discord.com/invite/clawd

---

## 📄 License

**Proprietary** - PT Wahana Informasi dan Teknologi

**Confidential** - Internal use only

---

**Last Updated:** March 27, 2026  
**Version:** 1.0.0
