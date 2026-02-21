# 🚀 Dev Insights Dashboard (개발자 인사이트 대시보드)

<p align="center">
  <a href="https://woojinahn-dev.vercel.app">
    <img src="https://img.shields.io/badge/실시간_데모-woojinahn--dev.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="./README.md"><b>English</b></a> | <b>한국어</b>
</p>

<br />

GitHub 활동을 시각화하고 Gemini AI를 통해 전문적인 기술 분석을 제공하는 **완전 자동화된 AI 기반 개발자 포트폴리오 대시보드**입니다.

![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ 핵심 기능

- **📊 실시간 데이터 동기화:** GitHub GraphQL API를 통해 리포지토리 통계를 자동으로 수집합니다.
- **🤖 객관적인 AI 포트폴리오 분석:** **Gemini 3 Flash Preview**를 활용하여 프로젝트를 분석하되, 과장된 마케팅 용어를 배제하고 기술 및 사실 기반의 전문적인 요약을 생성하도록 프롬프트 톤앤매너가 제어되어 있습니다.
- **🛡️ 안정성 및 로깅 (Reliability & Logging):** GitHub/Gemini API 호출 실패 시 기존 데이터를 유지하여 서비스 중단을 방지합니다. 또한 AI 분석 원본 데이터를 `public/data/history/`에 아카이빙하여 히스토리 추적 및 디버깅을 지원합니다.
- **🚀 강력한 캐싱 무력화 및 자동 배포:** Next.js와 Vercel 환경에서 즉각적인 UI 데이터 갱신을 보장하기 위해 타임스탬프 쿼리 기반의 브라우저 캐시 무력화 기법이 적용되어 있습니다.
- **🌐 다국어 지원:** 한국어와 영어 UI를 자유롭게 전환할 수 있습니다.
- **🎨 프리미엄 UI/UX:** 인터랙티브한 효과와 글로우 그라데이션이 적용된 세련된 디자인.
- **⚙️ 완전 자동화 파이프라인:** `main` 브랜치에 코드가 푸시되거나, 매일 새벽 0시(KST)가 되면 GitHub Actions가 즉각적으로 백그라운드에서 실행되어 최신 데이터와 AI 분석 결과를 배포합니다.

## 🛠 기술 스택

- **프론트엔드:** Next.js 15 (App Router), Tailwind CSS 4.0, Lucide React
- **자동화:** GitHub Actions, Python (Google Generative AI SDK)
- **배포:** Vercel
- **데이터 소스:** GitHub GraphQL & REST API

## 🚀 시작하기

```bash
git clone https://github.com/WoojinAhn/dev-insights-dashboard.git
cd dev-insights-dashboard
npm install
npm run dev
```

---

<p align="center">
  Gemini CLI가 <a href="https://github.com/WoojinAhn">WoojinAhn</a>님을 위해 정성껏 제작했습니다. ❤️
</p>
