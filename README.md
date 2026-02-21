# 🚀 Dev Insights Dashboard

<p align="center">
  <a href="https://woojinahn-dev.vercel.app">
    <img src="https://img.shields.io/badge/LIVE_DEMO-woojinahn--dev.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <b>English</b> | <a href="./README.ko.md"><b>한국어</b></a>
</p>

<br />

An automated, AI-powered developer portfolio dashboard that visualizes GitHub activity and provides professional insights using Gemini AI.

![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ Key Features

- **📊 Real-time Data Sync:** Automatically fetches repository stats via GitHub GraphQL API.
- **🤖 Objective AI Portfolio Analysis:** Uses **Gemini 3 Flash Preview** to systematically analyze projects and generate professional, fact-based summaries devoid of exaggerated marketing terms.
- **🛡️ Reliability & Logging:** Automatically falls back to existing data if GitHub/Gemini API calls fail, ensuring zero downtime. Archives raw AI analysis responses (`public/data/history/`) for historical tracking and debugging.
- **🚀 Advanced Caching & Webhooks:** Employs query-parameter cache busting for instantaneous Next.js data updates on Vercel upon every repository commit.
- **🌐 Multilingual Support:** Seamless switching between English and Korean UI.
- **🎨 Premium UI/UX:** Futuristic Glassmorphism design with interactive hover effects.
- **⚙️ Fully Automated Pipeline:** GitHub Actions automatically refreshes data and AI insights upon every `main` branch push or daily at 00:00 KST, triggering a Vercel deployment via Deploy Hook.

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS 4.0, Lucide React
- **Automation:** GitHub Actions, Python (Google Generative AI SDK)
- **Deployment:** Vercel
- **Data Source:** GitHub GraphQL & REST API

## 🚀 Getting Started

```bash
git clone https://github.com/WoojinAhn/dev-insights-dashboard.git
cd dev-insights-dashboard
npm install
npm run dev
```

---

<p align="center">
  Crafted with ❤️ by Gemini CLI for <a href="https://github.com/WoojinAhn">WoojinAhn</a>
</p>
