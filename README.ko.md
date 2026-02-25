# Dev Insights Dashboard

<p align="center">
  <a href="https://woojinahn-dev.vercel.app">
    <img src="https://img.shields.io/badge/라이브-woojinahn--dev.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="./README.md"><b>English</b></a> | <b>한국어</b>
</p>

<p align="center">
  <img src="docs/preview.png" alt="대시보드 미리보기" width="720" />
</p>

[WoojinAhn](https://github.com/WoojinAhn)의 GitHub 활동을 시각화하는 AI 기반 포트폴리오 대시보드. GitHub Actions를 통해 매일 데이터를 갱신하고 LLM(Gemini 2.0 Flash, GPT-4o-mini 폴백)으로 분석합니다.

## 아키텍처

```
GitHub API ──→ refresh-data.sh ──→ public/data/*.json
                                        │
                                        ├──→ analyze-portfolio.py ──→ analysis.json
                                        │         (Gemini / GPT-4o-mini)
                                        │
                                        ├──→ detect-ai-tools.py ──→ ai-signals.json
                                        │         (GitHub API, 규칙 기반)
                                        │
                                        └──→ Next.js 클라이언트 페이지 (정적 JSON fetch)
```

**3단계 파이프라인:**

1. **데이터 수집** (`refresh-data.sh`): `gh` CLI로 사용자 프로필, 레포, 핀 레포, 포크를 가져와 `public/data/`에 JSON으로 저장.
2. **AI 분석** (`analyze-portfolio.py`): 레포 데이터를 Gemini 2.0 Flash(폴백: GitHub Models GPT-4o-mini)에 전송, 한영 이중 언어 분석(강점, AI 역량, 연구 관심사) 생성.
3. **AI 도구 탐지** (`detect-ai-tools.py`): 각 레포의 indicator 파일(`CLAUDE.md`, `.cursor/`, 의존성 파일 등)을 GitHub API로 스캔 — 규칙 기반, AI 토큰 추가 없음.

프론트엔드는 단일 `'use client'` 페이지로, 런타임에 정적 JSON 파일을 fetch합니다.

## 주요 기능

- **AI 생성 포트폴리오 분석** — Multi-LLM 폴백 (Gemini → GPT-4o-mini)
- **AI 도구 탐지** — 레포 파일 흔적 기반으로 프로젝트 카드에 아이콘 표시 (Claude Code, Cursor, Gemini, Copilot 등)
- **한영 전환 UI**
- **Research Radar** — 포크한 레포 기반 기술 관심사 시각화
- **일일 자동 갱신** — GitHub Actions + Vercel deploy hook

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide React, simple-icons |
| 데이터 파이프라인 | Python 3 (google-generativeai SDK), Bash (gh CLI) |
| AI | Gemini 2.0 Flash, GitHub Models GPT-4o-mini (폴백) |
| 배포 | Vercel, GitHub Actions |

## 시작하기

```bash
git clone https://github.com/WoojinAhn/dev-insights-dashboard.git
cd dev-insights-dashboard
npm install
npm run dev
```

로컬에서 데이터 갱신:

```bash
# 필요: gh CLI 인증, GEMINI_API_KEY 또는 GH_TOKEN 환경변수
./refresh-data.sh
```

## Built With

초기 스캐폴딩 **Gemini CLI**, 리팩토링 및 유지보수 **Claude Code**.
