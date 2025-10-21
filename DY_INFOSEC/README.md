# 두경정보보안학교 (DY InfoSec Platform)

정보보안 교육 플랫폼 - 미래의 화이트해커를 양성하는 종합 교육 시스템

## 주요 기능

### 1. 회원가입 / 로그인 / 계정 관리
- JWT 기반 인증 시스템
- 회원가입, 로그인, 비밀번호 찾기
- 마이페이지를 통한 계정 정보 관리
- 회원정보 수정 및 회원탈퇴

### 2. 지원신청 및 선발 프로세스
- 교육과정 지원신청 시스템
- 지원서 작성 (기본정보, 학력, 기술보유, 자기소개서, 학습계획서)
- 체계적인 선발 프로세스 (서류전형, 필기/면접)
- 합격자 발표 및 교육생 관리

### 3. 온라인 및 오프라인 교육 콘텐츠
- 온라인 동영상 강의 제공
- 자기주도 학습 시스템
- 오프라인 교육 및 특강 운영
- 단계별 교육과정 (기초 → 프로젝트 → 심화)

### 4. 교육관리 시스템
- 나의 강의실 (수강 중인 과정 관리)
- 과제 제출 및 관리
- 팀 프로젝트 관리
- 학습 진도율 추적

### 5. 커뮤니케이션 및 지원
- 공지사항
- FAQ (자주 묻는 질문)
- 문의하기 (1:1 문의)
- 통합검색 기능

### 6. 교육과정 안내
- 교육과정 소개 및 상세 정보
- 강의 계획서 (Syllabus)
- 선수 지식 및 학습 목표
- 수강 혜택 안내

### 7. 멘토링 및 실습형 학습
- 현직 전문가 멘토링
- CTF, 워게임 등 실습 콘텐츠
- 팀 프로젝트 수행

### 8. 수료 및 평가 제도
- 우수 교육생 선발
- 수료증 발급
- 성과 기반 인센티브 (상금, 해외 연수)

### 9. 기타 기능
- 개인정보처리방침
- 이용약관
- 접근성 기능

## 기술 스택

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- MySQL / H2 Database
- Maven

### Frontend
- React 18
- Vite
- React Router v6
- Zustand (상태 관리)
- TailwindCSS
- Lucide React (아이콘)
- Axios

## 시작하기

### Backend 실행

```bash
cd DY_INFOSEC
mvn clean install
mvn spring-boot:run
```

서버는 `http://localhost:8080/api`에서 실행됩니다.

### Frontend 실행

```bash
cd DY_INFOSEC/frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/check-username` - 아이디 중복 확인
- `GET /api/auth/check-email` - 이메일 중복 확인

### 교육과정
- `GET /api/courses` - 교육과정 목록
- `GET /api/courses/{id}` - 교육과정 상세
- `POST /api/enrollments` - 수강 신청

### 지원신청
- `POST /api/applications` - 지원 신청
- `GET /api/applications` - 내 지원 목록
- `GET /api/applications/{id}` - 지원 상세

### 공지사항
- `GET /api/notices` - 공지사항 목록
- `GET /api/notices/{id}` - 공지사항 상세

### FAQ
- `GET /api/faqs` - FAQ 목록

### 문의
- `POST /api/inquiries` - 문의 등록
- `GET /api/inquiries` - 내 문의 목록

## 데이터베이스 스키마

주요 테이블:
- `users` - 사용자 정보
- `courses` - 교육과정
- `lectures` - 강의
- `enrollments` - 수강 정보
- `applications` - 지원신청
- `assignments` - 과제
- `submissions` - 과제 제출
- `projects` - 프로젝트
- `notices` - 공지사항
- `faqs` - FAQ
- `inquiries` - 문의

## 환경 변수

`.env` 파일 또는 환경 변수로 설정:

```
JWT_SECRET=your-secret-key-change-this-in-production
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 개발 로드맵

- [x] 프로젝트 구조 설정
- [x] 인증 시스템 구현
- [x] 교육과정 관리
- [x] 지원신청 시스템
- [x] 나의 강의실
- [x] 공지사항 및 FAQ
- [ ] 과제 제출 시스템
- [ ] 프로젝트 관리
- [ ] 관리자 대시보드
- [ ] 파일 업로드
- [ ] 이메일 알림
- [ ] 결제 시스템

## 라이선스

MIT License

## 문의

- 이메일: info@dyinfosec.kr
- 전화: 02-1234-5678
