# 🚀 Dev Insights Dashboard (개발자 인사이트 대시보드)

<p align="center">
  <a href="./README.md">🇺🇸 View English Version</a>
</p>

GitHub 활동을 시각화하고 Gemini AI를 통해 전문적인 기술 분석을 제공하는 **완전 자동화된 AI 기반 개발자 포트폴리오 대시보드**입니다.

![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ 핵심 기능

- **📊 실시간 데이터 동기화:** GitHub GraphQL API를 통해 리포지토리 통계(스타, 포크, 언어 분포)를 자동으로 수집합니다.
- **🤖 AI 포트폴리오 분석:** **Gemini 1.5 Flash**를 활용하여 프로젝트를 분석하고, 한글/영문으로 전문적인 요약을 생성합니다.
- **🌐 다국어 지원:** 버튼 클릭 하나로 한국어와 영어 UI를 자유롭게 전환할 수 있습니다.
- **🎨 현대적인 Glassmorphism UI:** 인터랙티브한 효과와 글로우 그라데이션이 적용된 세련된 대시보드 디자인.
- **⚙️ 완전 자동화 파이프라인:** 매일 새벽 0시(KST)에 GitHub Actions가 실행되어 최신 데이터와 AI 분석을 갱신합니다.

## 🛠 기술 스택

- **프론트엔드:** Next.js 15 (App Router), Tailwind CSS 4.0, Lucide React
- **자동화:** GitHub Actions, Python (Google Generative AI SDK)
- **배포:** Vercel
- **데이터 소스:** GitHub GraphQL & REST API

## 🚀 시작하기

### 사전 준비사항
- Node.js 20 이상
- GitHub CLI (`gh`)
- Google Gemini API Key

### 설치 및 실행
1. 저장소를 클론합니다:
   ```bash
   git clone https://github.com/WoojinAhn/dev-insights-dashboard.git
   cd dev-insights-dashboard/insights-dashboard
   ```
2. 종속성을 설치합니다:
   ```bash
   npm install
   ```
3. 로컬 테스트를 위한 환경 변수를 설정합니다:
   ```bash
   export GEMINI_API_KEY=본인의_API_키
   ```
4. 대시보드를 실행합니다:
   ```bash
   npm run dev
   ```

## 🤖 자동화 설정

매일 새벽 AI가 분석하고 배포하게 하려면:
1. GitHub 리포지토리의 **Secrets**에 `GEMINI_API_KEY`를 등록하세요.
2. GitHub Action이 매일 새벽 0시(KST)에 자동으로 실행됩니다 (`cron: '0 15 * * *'`).
3. 스크립트가 `public/data/*.json`을 갱신하고, 커밋 후 Vercel 재배포를 트리거합니다.

---

<p align="center">
  Gemini CLI가 <a href="https://github.com/WoojinAhn">WoojinAhn</a>님을 위해 정성껏 제작했습니다. ❤️
</p>
