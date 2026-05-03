# 🌾 Krishi Mitra — Smart Farming Assistant

**Krishi Mitra** is a full-stack smart farming assistant built for Indian farmers. It provides real-time-style weather advisories, mandi (market) prices, government scheme information, AI-powered crop disease detection, and an intelligent Hindi chatbot — all in one place.

---

## 🔗 Live Demo

👉 **[https://krishi-mitra-sigma-nine.vercel.app](https://krishi-mitra-sigma-nine.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Personalized greeting, live weather snapshot, top market prices, quick actions |
| 🌤️ **Weather Advisory** | City-based weather with 5-day forecast, farming tips & alerts |
| 📈 **Market Prices (Mandi)** | Prices for 15+ crops across Indian states with trend indicators |
| 🏛️ **Government Schemes** | 8 major schemes — PM-KISAN, PMFBY, KCC, PM Kusum & more with full details |
| 🔬 **Crop Disease Detection** | Upload a photo, get AI-powered disease diagnosis with treatment steps |
| 🤖 **AI Chatbot** | Hindi-language assistant for crop, weather, fertilizer & scheme queries |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (React Query)
- Wouter (routing)

**Backend**
- Express 5 + Node.js
- PostgreSQL + Drizzle ORM
- Pino (logging)
- OpenAPI + Zod (validation)

**Infrastructure**
- pnpm Workspaces (monorepo)
- Vercel (frontend deployment)
- esbuild (backend bundler)

---

## 📁 Project Structure

```
krishi-mitra/
├── artifacts/
│   ├── agri-app/               # React + Vite frontend
│   │   └── src/
│   │       ├── pages/          # Dashboard, Weather, Market, Schemes, Chatbot, Disease
│   │       ├── components/     # Layout, sidebar, UI components
│   │       └── lib/            # Utilities, API helpers
│   └── api-server/             # Express 5 REST API
│       └── src/
│           ├── routes/         # API route handlers
│           └── lib/            # Logger, DB connection
├── lib/
│   ├── db/                     # Drizzle schema & migrations
│   ├── api-spec/               # OpenAPI specification
│   ├── api-zod/                # Generated Zod schemas
│   └── api-client-react/       # Generated React Query hooks
├── scripts/                    # Shared utility scripts
├── pnpm-workspace.yaml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/ak6862219-cloud/krishi-mitra.git
cd krishi-mitra
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/krishimitra
SESSION_SECRET=your-random-secret-string
```

### 4. Set Up the Database

```bash
pnpm --filter @workspace/db run push
```

### 5. Start the Development Servers

```bash
# Terminal 1 — Frontend
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/agri-app run dev

# Terminal 2 — Backend API
PORT=8080 pnpm --filter @workspace/api-server run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Server | http://localhost:8080/api |

---

## ☁️ Deployment Guide

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and import the GitHub repository
2. Set **Root Directory** to `artifacts/agri-app`
3. Set **Build Command** to:
   ```
   npm install -g pnpm && pnpm install --no-frozen-lockfile && pnpm run build
   ```
4. Set **Output Directory** to `dist/public`
5. Add environment variable: `VITE_API_BASE_URL` = your backend URL

### Backend → Render / Railway

1. Connect your GitHub repository
2. Set **Build Command**:
   ```
   npm install -g pnpm && pnpm install && pnpm --filter @workspace/api-server run build
   ```
3. Set **Start Command**:
   ```
   node --enable-source-maps ./artifacts/api-server/dist/index.mjs
   ```
4. Add environment variables:
   ```
   DATABASE_URL=your_postgres_url
   SESSION_SECRET=your_secret
   NODE_ENV=production
   ```

### Database → Supabase (Free)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → URI**
3. Copy the connection string — use it as your `DATABASE_URL`

---

## 📱 Pages Overview

### Dashboard
- Time-based greeting (Good Morning / Afternoon / Evening)
- Current weather card for Delhi
- Today's top mandi prices with trend badges
- Quick action shortcuts to all features
- Daily farming tip

### Weather Advisory
- Search any city (Delhi, Mumbai, Lucknow, Pune, Bengaluru, Kolkata)
- Temperature, humidity, and wind speed
- Active weather alerts
- Farming tips tailored to the weather
- 5-day forecast with conditions

### Market Prices (Mandi Bhav)
- Prices for 15 crops across major Indian markets
- Top gainers and losers overview
- Filter by crop name or state
- Min, max, and modal price per quintal

### Government Schemes
- 8 major agricultural schemes with full details
- PM-KISAN, PMFBY, KCC, PM Kusum, PKVY, E-NAM, Soil Health Card, RKVY
- Eligibility criteria, benefits, application steps
- Official portal links and helpline numbers

### Crop Disease Detection
- Drag & drop or click to upload a crop photo
- Optionally enter crop name for better accuracy
- AI returns disease name, confidence score, severity
- Numbered treatment steps, symptoms, and prevention tips

### AI Chatbot (Krishi Mitra AI)
- Hindi-language conversational assistant
- Covers: wheat, rice, pests, fertilizers, schemes, weather
- Streaming SSE responses for real-time feel
- Conversation history with multiple sessions

---

## 🌾 Supported Weather Cities

Delhi · Mumbai · Lucknow · Pune · Bengaluru · Kolkata

> For any other city, the app will display Delhi's weather data as a fallback.

---

## 📞 Government Helpline Numbers

| Scheme | Helpline |
|---|---|
| PM-KISAN | 155261 |
| Pradhan Mantri Fasal Bima | 14447 |
| Kisan Credit Card | 1800-180-1111 |
| PM Kusum Solar | 1800-180-3333 |
| Krishi Vibhag | 1551 |
| E-NAM Portal | 1800-270-0224 |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">
  <strong>Krishi Mitra — Every farmer's digital companion 🌱</strong>
</div>
