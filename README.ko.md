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
- **🤖 객관적인 AI 포트폴리오 분석:** **Gemini 2.0 Flash**를 활용하여 프로젝트를 분석하고 사실 기반의 전문적인 요약을 생성합니다.
- **🛡️ Multi-LLM Fallback:** Gemini API 할당량 초과 시 자동으로 **Groq (Llama 3.3 70B)** 모델로 전환하여 중단 없는 분석을 보장합니다.
- **📡 Research Radar (관심사 분석):** 사용자가 Fork한 리포지토리를 분석하여 현재의 기술적 관심사와 연구 트렌드를 시각화하고 상세 툴팁을 제공합니다.
- **🔒 안정성 및 로깅:** 모든 API 호출 실패 시 기존 데이터를 유지하며, AI 분석 원본 데이터를 아카이빙하여 히스토리 추적을 지원합니다.
- **🚀 강력한 캐싱 무력화 및 자동 배포:** Vercel Deploy Hook과 타임스탬프 기반 캐시 무력화 기법을 적용하여 즉각적인 UI 갱신을 보장합니다.
- **🌐 다국어 지원:** 한국어와 영어 UI를 자유롭게 전환할 수 있습니다.
- **🎨 프리미엄 UI/UX:** 인터랙티브한 효과, 근거 기반 툴팁, 글로우 그라데이션이 적용된 세련된 디자인.
- **⚙️ 완전 자동화 파이프라인:** GitHub Actions가 매일 또는 푸시 발생 시 자동으로 데이터와 AI 인사이트를 갱신하고 배포합니다.

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
