# ⚾️ 온라인 숫자 야구 플랫폼

우아한테크코스 8기 프리코스 과정 오픈미션 프로젝트

**배포 링크**: https://number-baseball.com/

## 💻 프로젝트 소개

### 개요

**온라인 숫자 야구 플랫폼**은 1대1로 숫자 야구 게임을 진행합니다. 게임을 시작하면 각자 중복되지 않은 4개의 숫자를 지정하고, 순서를 돌아가며 상대방의 숫자를 예측합니다. 예측한 숫자를 제출하면 숫자 야구 게임 규칙에 따라, 예측 결과를 알려주고, 먼저 상대방의 번호를 맞추는 플레이어가 승리합니다.

### 숫자 야구 게임 규칙

- **Ball**: 제시한 숫자가 값은 일치하지만, 위치는 일치하지 않는 경우
  - **예시**: `4 5 2`를 제출했을 때 숨겨진 숫자가 `3 2 4`라면 `2 Ball`을 반환
- **Strike**: 제시한 숫자가 값과 위치 모두 일치하는 경우
  - **예시**: `4 5 2`를 제출했을 때 숨겨진 숫자가 `4 1 2`라면 `2 Strike`을 반환
- **Out**: 제시한 세 숫자가 숨겨진 숫자에 전혀 포함되지 않는 경우
  - **예시**: `4 5 2`를 제출했을 때 숨겨진 숫자가 `7 8 9`라면 `3 Out`을 반환
 
### 시스템 구조도

<img width="746" height="231" alt="image" src="https://github.com/user-attachments/assets/7425f745-6cf5-4437-9284-39648f418ad6" />

---

## 📄 주요 기능

### 회원 인증

<img width="960" height="449" alt="image" src="https://github.com/user-attachments/assets/2de0dfe7-a309-42ed-b971-3fb6a4c2d6d5" />

- Github Oauth와 JWT를 사용한 회원 인증

### 게임방 관리

<img width="960" height="449" alt="image" src="https://github.com/user-attachments/assets/9335d889-a93b-4b6f-8e50-886f1b7642c7" />

<img width="960" height="438" alt="image" src="https://github.com/user-attachments/assets/ec860687-d2a7-417e-a347-6f593d0ab19b" />

<img width="960" height="438" alt="image" src="https://github.com/user-attachments/assets/dd081eec-aa96-4ab1-9cbd-db1e7bf4b821" />

- **방 생성**: 방 만들기 버튼을 통해 방 제목을 입력한 후 생성
- **방 조회**: 생성된 방 목록을 페이지네이션 방식으로 조회
- **방 입장**: 생성된 방에 입장하면 게임방 페이지로 이동하고 유저 정보를 즉시 업데이트
- **방 퇴장**: 퇴장 시 메인 페이지로 이동하고 유저 정보를 즉시 업데이트
- **방 삭제**: 게임방 내 모든 인원이 퇴장할 경우, 자동으로 방 삭제

<img width="321" height="385" alt="image" src="https://github.com/user-attachments/assets/8dab5fb2-d3c3-4b1b-83ce-c3bc4544132a" />

- **전체 채팅**: '/home' 페이지에 접속 중인 사용자들과 전체 채팅을 할 수 있음

### 게임 진행

<img width="960" height="437" alt="image" src="https://github.com/user-attachments/assets/db371e11-d989-4846-9596-918e62b64ade" />

<img width="1919" height="875" alt="image" src="https://github.com/user-attachments/assets/2c2b9e91-72cd-4bb6-98c8-ebb072aca6ee" />

<img width="576" height="148" alt="image" src="https://github.com/user-attachments/assets/0f5bf816-a99c-418a-9d04-ea9c076a6ce1" />

<img width="580" height="151" alt="image" src="https://github.com/user-attachments/assets/b9e0967a-2392-4a93-9e1d-63ef14fc9e10" />

- **숫자 지정**: 게임 시작 시 각자 중복되지 않은 4개의 숫자를 지정
- **숫자 예측**: 순서를 돌아가며, 상대방의 숫자를 예측하여 제출
- **예측 결과**: 숫자 야구 게임 규칙에 따라 예측 결과를 알려주고, 먼저 상대방의 번호를 맞추는 플레이어가 승리
- **게임 종료**: 게임이 종료되면 게임 결과를 저장

---

## 📚 기술 스택

### Frontend

- **언어**: TypeScript
- **프레임워크**: Next.js v16
- **스타일링**: Tailwind css v4
- **패키지 매니저**: pnpm

### Backend

- **언어**: TypeScript
- **프레임워크**: Nest.js v11
- **ORM**: TypeORM
- **데이터베이스**: PostgreSQL
- **패키지 매니저**: pnpm

---

## 📁 폴더 구조

```
number-baseball
├── apps
│   ├── backend
│   │   └── src
|   |        ├── common
|   |        ├── config
|   |        ├── constants
|   |        ├── migrations
|   |        ├── modules
|   |        |    ├── auth
|   |        |    ├── chat
|   |        |    ├── entities
|   |        |    ├── room
|   |        |    └── users
|   |        ├── app.module.ts
|   |        └── main.ts
│   └── frontend
│       ├── app
│       ├── lib
│       ├── public
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       └── tsconfig.json
├── packages
|   ├── ui
│   └── utils
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```
