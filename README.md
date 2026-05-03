# 🌾 Krishi Mitra — Smart Farming Assistant

**Krishi Mitra** ek smart farming assistant hai jo Indian farmers ke liye banaya gaya hai. Yeh app mausam, mandi bhav, sarkari yojanaein, fasal rog pahchaan aur AI chatbot jaise features provide karta hai — Hindi mein.

---

## 🔗 Live Demo

👉 **https://krishi-mitra-sigma-nine.vercel.app**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Time-based greeting, mausam, mandi bhav, jaldi karyaein |
| 🌤️ **Mausam Jaankari** | 6 sheher ka mausam, 5-din forecast, farming tips |
| 📈 **Mandi Bhav** | 15 fasalon ke live-jaise bhav, gainers/losers, state filter |
| 🏛️ **Sarkari Yojanaein** | 8 yojanaein — PM-KISAN, PMFBY, KCC, Kusum aur aur bhi |
| 🔬 **Fasal Rog Pahchaan** | Photo upload karo, AI se bimari ki jaankari pao |
| 🤖 **AI Chatbot** | Hindi mein sawaal poochho — gehun, dhan, keet, khaad, yojana |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Express 5 + Node.js
- **Database:** PostgreSQL + Drizzle ORM
- **Monorepo:** pnpm Workspaces
- **Deploy:** Vercel (frontend) — backend Replit pe

---

## 📁 Project Structure

```
krishi-mitra/
├── artifacts/
│   ├── agri-app/          # React + Vite Frontend
│   │   └── src/
│   │       ├── pages/     # Dashboard, Weather, Market, Schemes, Chatbot, Disease
│   │       ├── components/ # Layout, UI components
│   │       └── lib/       # Utilities
│   └── api-server/        # Express 5 Backend
│       └── src/
│           ├── routes/    # API routes
│           └── lib/       # Logger, DB
├── lib/
│   ├── db/                # Drizzle schema + migrations
│   ├── api-spec/          # OpenAPI spec
│   └── api-zod/           # Zod schemas
└── pnpm-workspace.yaml
```

---

## 🚀 Local Setup

### 1. Clone karo

```bash
git clone https://github.com/ak6862219-cloud/krishi-mitra.git
cd krishi-mitra
```

### 2. Dependencies install karo

```bash
npm install -g pnpm
pnpm install
```

### 3. Environment variables set karo

Root mein `.env` file banao:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/krishimitra
SESSION_SECRET=apna-koi-bhi-secret-string
```

### 4. Database setup karo

```bash
pnpm --filter @workspace/db run push
```

### 5. App chalao

```bash
# Frontend (Terminal 1)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/agri-app run dev

# Backend (Terminal 2)
PORT=8080 pnpm --filter @workspace/api-server run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:8080

---

## ☁️ Deployment

### Frontend — Vercel

1. vercel.com pe login karein → GitHub repo import karein
2. Root Directory: `artifacts/agri-app`
3. Build Command: `npm install -g pnpm && pnpm install --no-frozen-lockfile && pnpm run build`
4. Output Directory: `dist/public`
5. Environment Variable: `VITE_API_BASE_URL` = aapka backend URL

### Backend — Render / Railway

1. Repo connect karein
2. Root Directory: workspace root
3. Build: `npm install -g pnpm && pnpm install && pnpm --filter @workspace/api-server run build`
4. Start: `node --enable-source-maps ./artifacts/api-server/dist/index.mjs`
5. Env vars: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`

### Database — Supabase (Free)

1. supabase.com pe project banao
2. Settings → Database → URI copy karo
3. Yahi aapka `DATABASE_URL` hai

---

## 📱 Pages

### Dashboard
- Time-based greeting (Suprabhat / Namaskar / Shubh Saayin)
- Live mausam card (Delhi)
- Aaj ke top mandi bhav
- Jaldi karyaein shortcuts
- Aaj ka farming tip

### Mausam Jaankari
- Sheher khojo (Delhi, Mumbai, Lucknow, Pune, Bangalore, Kolkata)
- Temperature, humidity, wind speed
- Mausam chetavniyaan
- Kheti suzhav
- 5-din ka forecast

### Mandi Bhav
- 15 fasalon ke bhav (Gehun, Dhan, Tamatar, Pyaaz, Aalu aur aur)
- Top gainers & losers
- Crop aur state se filter
- Modal, min, max bhav

### Sarkari Yojanaein
- PM-KISAN, PMFBY, KCC, PM Kusum, PKVY, E-NAM, Soil Health Card, RKVY
- Puri jaankari, eligibility, application process
- Helpline number aur sarkari portal link

### Fasal Rog Pahchaan
- Photo upload (drag & drop)
- Fasal ka naam daalo
- AI se bimari ki pahchaan
- Treatment steps, symptoms, prevention

### AI Chatbot (Krishi Mitra AI)
- Hindi mein sawaal poochho
- Gehun, dhan, keet, khaad, yojana, mausam — kuch bhi
- SSE streaming replies
- Conversation history

---

## 🌾 Supported Cities (Weather)

Delhi · Mumbai · Lucknow · Pune · Bengaluru · Kolkata

---

## 📞 Helpline Numbers

| Yojana | Helpline |
|---|---|
| PM-KISAN | 155261 |
| Fasal Bima | 14447 |
| Kisan Credit Card | 1800-180-1111 |
| PM Kusum | 1800-180-3333 |
| Krishi Vibhag | 1551 |

---

## 🤝 Contributing

1. Fork karein
2. Feature branch banao: `git checkout -b feature/naya-feature`
3. Changes commit karein
4. PR submit karein

---

## 📄 License

MIT License — Freely use, modify aur distribute karein.

---

**Krishi Mitra — Har kisan ka digital saathi** 🌱
