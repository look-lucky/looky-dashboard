# CLAUDE.md - Looky Dashboard

## Project Overview

Looky 관리자 대시보드. 한국 대학교 주변 상점/이벤트/광고/제휴를 관리하는 어드민 SPA.

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9 (strict mode)
- **Build**: Vite 7.2
- **Routing**: React Router DOM v7 (`BrowserRouter`, programmatic `<Routes>`)
- **State**: Zustand (auth), React Context (university selection), useState (local)
- **Styling**: Tailwind CSS 3.4 (utility-first, no custom theme)
- **Icons**: Lucide React
- **Toast**: Sonner (`toast.success()`, `toast.error()`)
- **API Client**: OpenAPI-generated (axios 기반, `src/shared/api/` - **자동 생성 코드, 직접 수정 금지**)
- **Auth**: JWT Bearer token, 자동 갱신, cross-tab 동기화
- **Deploy**: Vercel

## Project Structure

```
src/
├── app/App.tsx              # 라우터 & 레이아웃 구성
├── main.tsx                 # 엔트리포인트
├── pages/                   # 페이지 컴포넌트 (thin wrapper)
├── features/                # 도메인별 기능 모듈
│   ├── advertisements/      # 광고 관리
│   ├── commercial-area/     # 상권/상점 관리
│   ├── events/              # 이벤트 관리
│   ├── organizations/       # 학과/동아리 관리
│   ├── partnerships/        # 제휴 관리
│   ├── stores/              # 상점 일괄 등록
│   └── universities/        # 대학 관리
├── shared/
│   ├── api/                 # OpenAPI 자동 생성 클라이언트 (수정 금지)
│   │   ├── core/            # HTTP 클라이언트 코어
│   │   ├── models/          # 타입 정의 (100+ 모델)
│   │   └── services/        # API 서비스 클래스
│   ├── components/          # 공용 UI 컴포넌트
│   ├── contexts/            # React Context (UniversityContext)
│   ├── lib/auth/            # Zustand auth store
│   ├── utils/               # 유틸리티 (이미지 업로드, 페이지네이션 등)
│   └── hooks/               # 커스텀 훅
└── widgets/
    ├── auth/                # AuthGuard, AuthSessionManager
    └── layout/              # DashboardLayout, Sidebar, UniversityLayout
```

## Commands

- `npm run dev` - 개발 서버 (dev 모드)
- `npm run dev:local` - 로컬 서버 (localhost:8080 프록시)
- `npm run dev:op` - prod API 연결 개발
- `npm run build` - 프로덕션 빌드 (`tsc -b && vite build --mode prod`)
- `npm run lint` - ESLint 실행

## Key Conventions

### 파일/네이밍
- 컴포넌트: PascalCase (파일명 = 컴포넌트명)
- feature 폴더 내 도메인별 컴포넌트 분리
- pages는 features를 조합하는 얇은 레이어

### 코드 패턴
- Props 인터페이스는 컴포넌트 파일 내 정의
- 비동기 작업은 try/catch + `toast.error()` (alert 사용 금지)
- localStorage로 상태 영속화 (auth, university 선택)
- `clsx` + `tailwind-merge`로 클래스 조합
- `as any` 사용 금지 — OpenAPI 타입 불일치 시 `as unknown as Type` 사용
- `console.log` 사용 금지 (ESLint warn) — `console.error`/`console.warn`만 허용

### 공용 컴포넌트 & 훅 (shared/)
- **ModalWrapper / ModalFooter** — 모달 레이아웃. 모든 모달에서 사용 필수
- **FormField / FormInput / FormTextarea / FormSelect** — 폼 입력 필드 (일관된 label+input 스타일)
- **SearchInput** — 검색 아이콘 포함 검색바
- **ImageDropZone** — 드래그 앤 드롭 이미지 업로드 영역
- **Pagination** — 서버 사이드 페이지네이션 UI. 모든 리스트에서 사용 필수
- **useDebounce(value, delay?)** — 디바운스 훅 (기본 500ms)
- **usePaginatedQuery({ fetchFn, ... })** — 페이지네이션 데이터 페칭 훅
- **formatDate / formatDateForInput** — `shared/utils/date.ts` 날짜 포맷 유틸

### API
- `src/shared/api/`는 OpenAPI codegen으로 생성 - 직접 수정하지 않음
- API 호출은 서비스 클래스 사용: `AdminStoreService.xxx()`
- 인증: Bearer token, 401 시 자동 리프레시 (setupInterceptors.ts)
- 이미지 업로드: presigned URL → S3 직접 업로드

### 라우팅
- `/login` - 공개
- `/` 하위 - AuthGuard 보호 (ROLE_ADMIN 필수)
- 대학 스코프 라우트: UniversityLayout + UniversityProvider 사용

## Environment Variables

- `VITE_API_BASE_URL` - API 서버 URL
- `VITE_DATA_GO_KR_API_KEY` - 공공데이터 API 키 (선택)
- 환경별 파일: `.env.dev`, `.env.local`, `.env.prod`

### API 타입 우회
- OpenAPI codegen이 `JsonNullable*` 래퍼 타입을 생성하여 Update 요청 타입이 실제 API와 불일치
- 해결: 평문 객체를 만들고 `as unknown as UpdateXxxRequest`로 캐스팅
- `src/shared/api/` 코드는 절대 수정하지 않음

## Notes

- 테스트 미구성 (테스트 프레임워크 없음)
- CI/CD 파이프라인 없음 (Vercel 자동 배포만 사용)
- UI 전체 한국어
- 사용자 유형 3종: Admin(이 대시보드), Student(앱), Owner(가게 주인)