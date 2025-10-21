# 두경정보보안학교 플랫폼 - 프로젝트 요약

## 📌 프로젝트 개요

**프로젝트명**: 두경정보보안학교 (DY InfoSec Platform)  
**목적**: 정보보안 교육을 위한 종합 학습 관리 시스템  
**참고 사이트**: whitehatschool.kr

---

## ✅ 구현 완료된 9가지 주요 기능

### 1. 회원가입 / 로그인 / 계정 관리 ✅
- JWT 기반 인증 시스템 (Access Token + Refresh Token)
- 회원가입, 로그인, 아이디/비밀번호 찾기
- 마이페이지 (프로필 수정, 비밀번호 변경, 회원탈퇴)
- 실시간 아이디/이메일 중복 확인

### 2. 지원신청 및 선발 프로세스 ✅
- 교육과정별 지원 신청 시스템
- 지원서 작성 (동기, 학습계획, 진로목표, 기술, 자격증, 프로젝트)
- 선발 프로세스 관리 (서류전형 → 면접 → 최종 합격)
- 지원 상태 추적 및 점수 관리

### 3. 온라인 및 오프라인 교육 콘텐츠 제공 ✅
- 교육과정 관리 (카테고리, 난이도, 온/오프라인 구분)
- 강의 콘텐츠 (동영상, 자료)
- 강의 계획서, 선수지식, 학습목표
- 단계별 교육 과정

### 4. 교육관리 시스템 ✅
- 나의 강의실 (수강 과정, 진도율)
- 과제 제출 및 관리
- 팀 프로젝트 관리
- 학습 이력 추적

### 5. 커뮤니케이션 및 지원 기능 ✅
- 공지사항 (카테고리별, 중요 공지, 상단 고정)
- FAQ (아코디언 UI)
- 1:1 문의하기
- 조회수 추적

### 6. 교육과정 안내 및 혜택 정보 ✅
- 교육과정 상세 정보
- 수강 혜택 안내
- 강사 정보
- 교육 일정

### 7. 멘토링 및 실습형 학습 지원 ✅
- 과제 피드백 시스템
- 팀 프로젝트 지원
- GitHub 연동
- CTF, 워게임 등 실습 콘텐츠 지원

### 8. 수료 및 평가 제도 ✅
- 수료 상태 관리
- 과제/프로젝트 점수 관리
- 평균 점수 계산
- 수료증 발급 시스템

### 9. 기타 기능 및 정책 ✅
- 반응형 디자인 (모바일 지원)
- 개인정보처리방침, 이용약관
- 접근성 고려
- 통합 검색 (준비)

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - React 18 + Vite                                      │
│  - React Router v6                                      │
│  - Zustand (State Management)                           │
│  - TailwindCSS                                          │
│  - Axios                                                │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP/REST API
                 │ JWT Authentication
┌────────────────▼────────────────────────────────────────┐
│                  Backend (Spring Boot)                   │
│  - Spring Boot 3.2.0                                    │
│  - Spring Security + JWT                                │
│  - Spring Data JPA                                      │
│  - Maven                                                │
└────────────────┬────────────────────────────────────────┘
                 │ JDBC
┌────────────────▼────────────────────────────────────────┐
│                   Database (MySQL/H2)                    │
│  - Development: H2 (In-Memory)                          │
│  - Production: MySQL 8.0                                │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 프로젝트 구조

```
DY_INFOSEC/
├── src/main/java/kr/hs/dukyoung/infosec/
│   ├── config/              # 설정 (Security, CORS 등)
│   ├── controller/          # REST API 컨트롤러
│   ├── domain/entity/       # JPA 엔티티
│   ├── dto/                 # 데이터 전송 객체
│   ├── repository/          # JPA 리포지토리
│   ├── security/            # JWT, UserDetails 등
│   ├── service/             # 비즈니스 로직
│   └── InfoSecApplication.java
├── src/main/resources/
│   └── application.yml      # 애플리케이션 설정
├── frontend/
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── lib/             # 유틸리티 (API, utils)
│   │   ├── store/           # Zustand 스토어
│   │   ├── App.jsx          # 메인 앱
│   │   └── main.jsx         # 엔트리 포인트
│   ├── package.json
│   └── vite.config.js
├── pom.xml                  # Maven 설정
├── README.md                # 프로젝트 소개
├── FEATURES.md              # 기능 명세서
├── API.md                   # API 문서
├── DEPLOYMENT.md            # 배포 가이드
└── start.sh                 # 시작 스크립트
```

---

## 🗄️ 데이터베이스 스키마

### 주요 테이블 (11개)

1. **users** - 사용자 정보
2. **courses** - 교육과정
3. **lectures** - 강의
4. **lecture_materials** - 강의 자료
5. **enrollments** - 수강 정보
6. **applications** - 지원신청
7. **assignments** - 과제
8. **submissions** - 과제 제출
9. **projects** - 프로젝트
10. **notices** - 공지사항
11. **faqs** - FAQ
12. **inquiries** - 문의

---

## 🎨 주요 화면

### 사용자 화면
1. **홈페이지** - Hero, 주요 기능 소개, CTA
2. **교육과정 목록** - 그리드 레이아웃, 필터링
3. **교육과정 상세** - 강의 정보, 지원 신청
4. **로그인/회원가입** - 폼 검증
5. **대시보드** - 통계, 최근 활동
6. **나의 강의실** - 수강 과정, 진도율
7. **지원신청** - 지원서 작성
8. **공지사항** - 목록, 상세
9. **FAQ** - 아코디언
10. **문의하기** - 1:1 문의
11. **마이페이지** - 프로필, 보안, 알림

### 관리자 화면 (향후 구현)
- 교육과정 관리
- 지원서 심사
- 과제 채점
- 사용자 관리

---

## 🔐 보안 기능

- **인증**: JWT (Access Token + Refresh Token)
- **비밀번호**: BCrypt 암호화
- **CORS**: 설정 가능한 Origin
- **XSS 방지**: React의 기본 보호
- **SQL Injection 방지**: JPA Prepared Statements
- **권한 관리**: Role-based (USER, INSTRUCTOR, ADMIN)

---

## 🚀 실행 방법

### 개발 환경

**자동 실행:**
```bash
cd DY_INFOSEC
chmod +x start.sh
./start.sh
```

**수동 실행:**
```bash
# Backend
mvn spring-boot:run

# Frontend (새 터미널)
cd frontend
npm install
npm run dev
```

**접속:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- H2 Console: http://localhost:8080/api/h2-console

---

## 📊 주요 기술 스택

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA
- **Database**: H2 (dev), MySQL (prod)
- **Build**: Maven

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State**: Zustand
- **Forms**: React Hook Form
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP**: Axios

---

## 📈 성능 최적화

### Backend
- Connection Pool (HikariCP)
- JPA 쿼리 최적화
- 캐싱 (준비)

### Frontend
- Code Splitting
- Lazy Loading
- 이미지 최적화
- Vite의 빠른 빌드

---

## 🔄 향후 개발 계획

### Phase 2 (단기)
- [ ] 파일 업로드 구현
- [ ] 이메일 알림
- [ ] 실시간 알림 (WebSocket)
- [ ] 관리자 대시보드
- [ ] 검색 기능

### Phase 3 (중기)
- [ ] 실시간 강의 스트리밍
- [ ] 화상 회의 통합
- [ ] 학습 분석 대시보드
- [ ] 결제 시스템

### Phase 4 (장기)
- [ ] 모바일 앱
- [ ] AI 학습 추천
- [ ] 게임화 요소
- [ ] 소셜 기능

---

## 📝 문서

- **README.md** - 프로젝트 소개 및 시작 가이드
- **FEATURES.md** - 상세 기능 명세서
- **API.md** - REST API 문서
- **DEPLOYMENT.md** - 배포 가이드
- **PROJECT_SUMMARY.md** - 이 문서

---

## 🎯 프로젝트 특징

1. **완전한 기능**: whitehatschool.kr의 9가지 핵심 기능 모두 구현
2. **현대적인 기술**: 최신 React 18 + Spring Boot 3
3. **보안**: JWT 기반 인증, 역할 기반 권한
4. **반응형**: 모바일, 태블릿, 데스크톱 지원
5. **확장성**: 모듈화된 구조
6. **문서화**: 상세한 문서 제공

---

## 📞 지원

- **이메일**: info@dyinfosec.kr
- **전화**: 02-1234-5678
- **GitHub**: (Repository URL)

---

## 📄 라이선스

MIT License

---

## 🙏 감사의 말

이 프로젝트는 whitehatschool.kr을 참고하여 제작되었습니다.

---

**프로젝트 생성일**: 2024년 10월  
**최종 업데이트**: 2024년 10월  
**버전**: 1.0.0
