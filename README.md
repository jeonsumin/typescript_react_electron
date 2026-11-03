# React + TypeScript + Vite + Electron

React 19 화면을 Electron 키오스크 앱으로 띄우는 템플릿입니다.

## 필수 설치 프로그램

1. [Node.js](https://nodejs.org/) `^20.19.0` 또는 `>=22.12.0` (Vite 8 요구 사항)
2. [pnpm](https://pnpm.io/installation)
3. [Git](https://git-scm.com/downloads)

## 기술 스택

| 영역      | 라이브러리                                 |
| --------- | ------------------------------------------ |
| UI        | React 19, React Router 7                   |
| 상태 관리 | Redux Toolkit, React Redux                 |
| HTTP      | axios                                      |
| 빌드      | Vite 8, TypeScript 7                       |
| 데스크톱  | Electron 45, electron-builder, auto-launch |
| 포맷팅    | Prettier                                   |

## 설치

```console
pnpm install
```

Electron 바이너리는 설치 중에 내려받습니다. `pnpm-workspace.yaml`의
`allowBuilds`가 이 다운로드를 허용합니다. 실행 시
`Electron failed to install correctly` 에러가 나면 아래 명령으로 다시 받으세요.

```console
pnpm rebuild electron
```

## dotenv 설정

Root 폴더의 `.env.sample`을 `.env`로 복사해서 사용합니다.

**_주의: .env.sample 파일을 삭제하거나, .env 파일을 Push하지 마시오!_**

| Env                | Description                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| `VITE_APP_API_URL` | API Url. Context Path 마지막의 `슬래시(/)`는 빼 주세요. 예: `http://localhost:8080` |
| `VITE_APP_CDN_URL` | 이미지 등 리소스 Url 작성 시 사용하는 CDN Url. 예: `http://localhost:3000`          |

## 실행

| 명령                | 설명                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm dev`          | Vite 개발 서버만 실행. [http://localhost:3000](http://localhost:3000) |
| `pnpm electron:dev` | Vite 개발 서버와 Electron 앱을 함께 실행                              |
| `pnpm electron`     | 이미 떠 있는 개발 서버에 Electron 앱만 연결                           |
| `pnpm format`       | Prettier로 전체 포맷팅                                                |

## 빌드

| 명령                  | 설명                                              |
| --------------------- | ------------------------------------------------- |
| `pnpm build`          | 타입 체크 후 웹 빌드 (`dist/`)                    |
| `pnpm build:electron` | 웹 빌드 후 electron-builder로 설치 파일 생성      |
| `pnpm electron:pack`  | 설치 파일 없이 패키징된 폴더만 생성 (동작 확인용) |

## 프로젝트 구조

```
electron/
  electron.js    Electron 메인 프로세스 (창 생성, 단축키, IPC 핸들러)
  preload.js     렌더러에 window.baseAPI 노출
src/
  main.tsx       React 진입점
  screen/        화면과 라우터 (HashRouter)
  shared/        공용 스타일 등
```

`tsconfig.json`의 `paths`로 `components/*`, `shared/*` 경로 별칭을 씁니다.
Vite는 `resolve.tsconfigPaths`로 같은 별칭을 읽습니다.

## Electron 동작

`IS_DEV=true`이면 개발 모드, 아니면 프로덕션 모드입니다.

| 항목      | 개발 모드                      | 프로덕션 모드              |
| --------- | ------------------------------ | -------------------------- |
| 로드 대상 | `http://localhost:3000`        | `dist/index.html`          |
| 창        | 일반 창, 개발자 도구 자동 열림 | 전체화면 키오스크, 항상 위 |
| 자동 시작 | 설정 안 함                     | 윈도우 로그인 시 자동 실행 |

### 렌더러에서 쓸 수 있는 API (`window.baseAPI`)

| 함수                        | 설명                                                                    |
| --------------------------- | ----------------------------------------------------------------------- |
| `closeWindow(action)`       | 앱 종료 (macOS 제외)                                                    |
| `getVideoPath(fileName)`    | `C:\philakorea\<fileName>`이 있으면 `file:///` 경로 반환, 없으면 `null` |
| `checkFileExists(filePath)` | 파일 존재 여부 반환                                                     |

### 단축키

| 키                  | 동작                                    |
| ------------------- | --------------------------------------- |
| `Escape`            | 앱 종료                                 |
| `Ctrl+Shift+Q`      | 렌더러에 `show-admin-panel` 이벤트 전송 |
| `Alt+F4`, `Alt+Tab` | 차단                                    |

## 알려진 이슈

`electron.js`의 `globalShortcut.register('Super')`가
`conversion failure from Super` 에러를 냅니다. 그래서 그 뒤에 등록하는
`Ctrl+Alt+Delete`, `Escape`, `Ctrl+Shift+Q` 단축키가 현재 동작하지 않습니다.
