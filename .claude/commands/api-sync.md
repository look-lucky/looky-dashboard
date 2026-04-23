최신 Swagger 문서를 다운로드하고 API 클라이언트 코드를 재생성합니다.

## 1. 사전 준비
- `git stash` 또는 커밋으로 현재 변경사항을 안전하게 보관
- 기존 서비스 파일 목록을 기록: `ls src/shared/api/services/`

## 2. Swagger JSON 다운로드
- `curl -s -o looky-api.json https://api.looky.kr/v3/api-docs` 실행
- 다운로드 성공 여부 확인 (파일 크기 > 0)

## 3. API 클라이언트 재생성
- `npx openapi-typescript-codegen -i looky-api.json -o src/shared/api -c axios` 실행
- `src/shared/api/setupInterceptors.ts`가 보존되었는지 확인 (이 파일은 수동 작성 파일)

## 4. 타입 검증
- `npx tsc -b --noEmit`으로 타입 체크
- **에러 발생 시**: 서비스명이나 모델명이 변경된 경우가 많음
  - 이전/이후 서비스 파일 목록을 비교하여 어떤 서비스가 이름이 바뀌었는지 파악
  - 영향받는 import 문을 일괄 수정
  - 수정 후 다시 타입 체크
- **에러가 너무 많으면**: `git checkout -- src/shared/api/ looky-api.json`으로 복원하고 사용자에게 보고

## 5. 변경사항 요약
- 새로 추가/제거된 API 엔드포인트가 있으면 사용자에게 알려주세요
- 기존 코드에서 사용 중인 API가 변경되었으면 영향받는 파일 목록을 제시하세요
