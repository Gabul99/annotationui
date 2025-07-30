# Annotation 평가 시스템

annotation 품질을 평가하기 위한 React 기반 웹 애플리케이션입니다.

## 주요 기능

1. **사용자 정보 입력**: 이름과 평가할 데이터셋 선택
2. **Task 소개**: 각 작업에 대한 설명과 평가 기준 제공
3. **Annotation 평가**:
   - 왼쪽: 하이라이트된 annotation이 포함된 텍스트
   - 오른쪽: 각 annotation에 대한 Yes/No 평가 폼
4. **결과 저장**: 로컬 저장소 또는 서버에 결과 저장

## 기술 스택

- React 19
- TypeScript
- Styled Components
- React Router DOM

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 프로젝트 구조

```
src/
├── pages/
│   ├── UserInfoPage.tsx      # 사용자 정보 입력
│   ├── TaskIntroPage.tsx     # Task 소개
│   ├── EvaluationPage.tsx    # Annotation 평가
│   └── CompletionPage.tsx    # 완료 페이지
├── types/
│   └── index.ts              # TypeScript 타입 정의
├── services/
│   └── firebase.ts           # 데이터 저장 서비스
└── App.tsx                   # 메인 앱 컴포넌트
```

## 사용법

1. **시작**: 이름과 데이터셋을 입력하고 시작
2. **Task 소개**: 각 작업의 설명과 기준을 확인
3. **평가**:
   - 왼쪽의 하이라이트된 텍스트 확인
   - 오른쪽에서 각 annotation의 관련성 평가 (Yes/No)
   - 모든 질문에 답한 후 다음으로 진행
4. **완료**: 결과 저장 또는 JSON 다운로드

## 데이터 저장

현재는 로컬 스토리지를 사용하여 결과를 저장합니다. Firebase나 서버 연동을 원하는 경우 `src/services/firebase.ts` 파일을 수정하세요.

## 커스터마이징

- `src/App.tsx`의 `tasks` 배열에서 샘플 데이터를 수정
- `src/types/index.ts`에서 타입 정의 수정
- `src/services/firebase.ts`에서 저장 방식 변경
