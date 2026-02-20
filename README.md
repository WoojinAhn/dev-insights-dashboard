# 🚀 Dev Insights Dashboard

<p align="center">
  <a href="./README.ko.md">🇰🇷 한국어 버전으로 보기</a>
</p>

An automated, AI-powered developer portfolio dashboard that visualizes GitHub activity and provides professional insights using Gemini AI.

![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ Key Features

- **📊 Real-time Data Sync:** Automatically fetches repository stats (stars, forks, languages) via GitHub GraphQL API.
- **🤖 AI Portfolio Analysis:** Uses **Gemini 1.5 Flash** to analyze projects and generate professional summaries in English & Korean.
- **🌐 Multilingual Support:** Seamless switching between English and Korean UI.
- **🎨 Modern Glassmorphism UI:** A sleek, futuristic dashboard design with interactive hover effects and glowing gradients.
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
   cd dev-insights-dashboard/insights-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables for local testing:
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```
4. Run the dashboard:
   ```bash
   npm run dev
   ```

## 🤖 Automation Setup

To enable daily AI analysis:
1. Add `GEMINI_API_KEY` to your **GitHub Repository Secrets**.
2. The GitHub Action will run daily at 00:00 KST (`cron: '0 15 * * *'`).
3. It will refresh `public/data/*.json`, commit changes, and trigger a Vercel redeploy.

---

<p align="center">
  Crafted with ❤️ by Gemini CLI for <a href="https://github.com/WoojinAhn">WoojinAhn</a>
</p>
