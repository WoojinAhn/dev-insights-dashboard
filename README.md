# 🚀 Dev Insights Dashboard

<div align="center">
  <a href="https://woojinahn-dev.vercel.app">
    <img src="https://img.shields.io/badge/LIVE_DEMO-woojinahn--dev.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <br />
  <a href="./README.ko.md">🇰🇷 한국어 버전으로 보기</a>
</div>

<br />

An automated, AI-powered developer portfolio dashboard that visualizes GitHub activity and provides professional insights using Gemini AI.

![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ Key Features

- **📊 Real-time Data Sync:** Automatically fetches repository stats (stars, forks, languages) via GitHub GraphQL API.
- **🤖 AI Portfolio Analysis:** Uses **Gemini 1.5 Flash** to analyze projects and generate professional summaries in English & Korean.
- **🌐 Multilingual Support:** Seamless switching between English and Korean UI via modern Navigation Toggle.
- **🎨 Premium UI/UX:** Futuristic Glassmorphism design with interactive hover effects and glowing gradients.
- **⚙️ Fully Automated Pipeline:** GitHub Actions refreshes data and AI insights daily at 00:00 KST.

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS 4.0, Lucide React
- **Automation:** GitHub Actions, Python (Google Generative AI SDK)
- **Deployment:** Vercel
- **Data Source:** GitHub GraphQL & REST API

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- GitHub CLI (`gh`)
- Google Gemini API Key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/WoojinAhn/dev-insights-dashboard.git
   cd dev-insights-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dashboard:
   ```bash
   npm run dev
   ```

---

<div align="center">
  Crafted with ❤️ by Gemini CLI for <a href="https://github.com/WoojinAhn">WoojinAhn</a>
</div>
