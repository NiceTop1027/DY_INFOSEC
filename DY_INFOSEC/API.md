# API 문서

Base URL: `http://localhost:8080/api`

## 인증

모든 보호된 엔드포인트는 JWT 토큰이 필요합니다.

**헤더 형식:**
```
Authorization: Bearer {access_token}
```

---

## 🔐 인증 (Authentication)

### 회원가입
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "birthDate": "1990-01-01",
  "gender": "M"
}
```

**응답:**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "roles": ["ROLE_USER"]
  }
}
```

### 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

### 토큰 갱신
```http
POST /auth/refresh?refreshToken={refresh_token}
```

### 아이디 중복 확인
```http
GET /auth/check-username?username=testuser
```

**응답:**
```json
{
  "success": true,
  "data": true  // true: 사용 가능, false: 이미 사용 중
}
```

### 이메일 중복 확인
```http
GET /auth/check-email?email=test@example.com
```

---

## 📚 교육과정 (Courses)

### 교육과정 목록 조회
```http
GET /courses
```

**쿼리 파라미터:**
- `status`: DRAFT, OPEN, CLOSED, COMPLETED
- `category`: BASIC, ADVANCED, PROJECT, SPECIAL
- `level`: BEGINNER, INTERMEDIATE, ADVANCED

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "웹 해킹 기초",
      "description": "웹 애플리케이션의 취약점을 이해하고 모의해킹 실습을 진행합니다.",
      "category": "BASIC",
      "level": "BEGINNER",
      "duration": 40,
      "enrolledCount": 25,
      "capacity": 30,
      "instructor": "김보안",
      "status": "OPEN",
      "isOnline": true,
      "isOffline": false
    }
  ]
}
```

### 교육과정 상세 조회
```http
GET /courses/{id}
```

### 강의 목록 조회
```http
GET /courses/{courseId}/lectures
```

---

## 📝 수강 신청 (Enrollments)

### 수강 신청
```http
POST /enrollments
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": 1
}
```

### 내 수강 목록
```http
GET /enrollments/my
Authorization: Bearer {token}
```

### 수강 상세 정보
```http
GET /enrollments/{id}
Authorization: Bearer {token}
```

---

## 📋 지원 신청 (Applications)

### 지원 신청
```http
POST /applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": 1,
  "motivation": "정보보안 전문가가 되고 싶습니다...",
  "studyPlan": "매일 2시간씩 학습하겠습니다...",
  "careerGoal": "화이트해커로 활동하고 싶습니다...",
  "technicalSkills": "Python, Java, Linux",
  "certifications": "정보처리기사",
  "projects": "웹 취약점 분석 프로젝트"
}
```

### 내 지원 목록
```http
GET /applications/my
Authorization: Bearer {token}
```

### 지원 상세 조회
```http
GET /applications/{id}
Authorization: Bearer {token}
```

### 지원 상태
- `SUBMITTED`: 서류 심사 중
- `DOCUMENT_PASS`: 서류 합격
- `DOCUMENT_FAIL`: 서류 불합격
- `INTERVIEW_SCHEDULED`: 면접 예정
- `FINAL_PASS`: 최종 합격
- `FINAL_FAIL`: 최종 불합격

---

## 📖 과제 (Assignments)

### 과제 목록 조회
```http
GET /courses/{courseId}/assignments
Authorization: Bearer {token}
```

### 과제 상세 조회
```http
GET /assignments/{id}
Authorization: Bearer {token}
```

### 과제 제출
```http
POST /assignments/{assignmentId}/submissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "과제 내용...",
  "githubUrl": "https://github.com/user/repo"
}
```

### 내 제출 목록
```http
GET /submissions/my
Authorization: Bearer {token}
```

---

## 👥 프로젝트 (Projects)

### 프로젝트 생성
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": 1,
  "title": "보안 취약점 분석 도구",
  "description": "웹 애플리케이션 보안 취약점을 자동으로 분석하는 도구",
  "teamName": "화이트해커즈",
  "techStack": "Python, Flask, SQLAlchemy"
}
```

### 프로젝트 목록
```http
GET /courses/{courseId}/projects
Authorization: Bearer {token}
```

### 팀원 추가
```http
POST /projects/{projectId}/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 2
}
```

---

## 📢 공지사항 (Notices)

### 공지사항 목록
```http
GET /notices
```

**쿼리 파라미터:**
- `category`: GENERAL, COURSE, APPLICATION, EVENT, SYSTEM
- `page`: 페이지 번호 (0부터 시작)
- `size`: 페이지 크기

### 공지사항 상세
```http
GET /notices/{id}
```

---

## ❓ FAQ

### FAQ 목록
```http
GET /faqs
```

**쿼리 파라미터:**
- `category`: GENERAL, APPLICATION, COURSE, TECHNICAL, PAYMENT

### FAQ 상세
```http
GET /faqs/{id}
```

---

## 💬 문의 (Inquiries)

### 문의 등록
```http
POST /inquiries
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "GENERAL",
  "title": "교육 과정 문의",
  "content": "웹 해킹 기초 과정에 대해 궁금합니다..."
}
```

### 내 문의 목록
```http
GET /inquiries/my
Authorization: Bearer {token}
```

### 문의 상세
```http
GET /inquiries/{id}
Authorization: Bearer {token}
```

---

## 👤 사용자 (Users)

### 내 프로필 조회
```http
GET /users/me
Authorization: Bearer {token}
```

### 프로필 수정
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "address": "서울특별시 강남구",
  "school": "두경대학교",
  "major": "컴퓨터공학"
}
```

### 비밀번호 변경
```http
PUT /users/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## 🔒 관리자 API (Admin)

### 교육과정 생성
```http
POST /admin/courses
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "웹 해킹 기초",
  "description": "웹 애플리케이션의 취약점을 이해하고 모의해킹 실습을 진행합니다.",
  "category": "BASIC",
  "level": "BEGINNER",
  "duration": 40,
  "capacity": 30,
  "instructor": "김보안",
  "applicationStartDate": "2024-01-01",
  "applicationEndDate": "2024-01-31",
  "courseStartDate": "2024-02-01",
  "courseEndDate": "2024-05-31"
}
```

### 지원서 심사
```http
PUT /admin/applications/{id}/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "DOCUMENT_PASS",
  "documentScore": 85,
  "reviewComment": "우수한 지원서입니다."
}
```

### 과제 채점
```http
PUT /admin/submissions/{id}/grade
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "score": 95,
  "feedback": "잘 작성된 과제입니다. 다만 보안 측면에서..."
}
```

---

## 📊 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "작업이 성공적으로 완료되었습니다.",
  "data": { ... }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "data": null
}
```

### HTTP 상태 코드
- `200 OK`: 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 에러

---

## 🔍 페이징

페이징이 지원되는 엔드포인트:

**요청:**
```http
GET /notices?page=0&size=10&sort=createdAt,desc
```

**응답:**
```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 100,
    "totalPages": 10,
    "last": false,
    "first": true
  }
}
```

---

## 🔐 권한

### 역할 (Roles)
- `ROLE_USER`: 일반 사용자
- `ROLE_INSTRUCTOR`: 강사
- `ROLE_ADMIN`: 관리자

### 권한 체크
특정 엔드포인트는 특정 역할이 필요합니다:
- `/admin/**`: ROLE_ADMIN
- `/instructor/**`: ROLE_INSTRUCTOR 또는 ROLE_ADMIN
- 기타 보호된 엔드포인트: ROLE_USER 이상

---

## 📝 예제 코드

### JavaScript (Axios)
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 로그인
const login = async (usernameOrEmail, password) => {
  const response = await api.post('/auth/login', {
    usernameOrEmail,
    password,
  })
  return response.data
}

// 교육과정 목록
const getCourses = async () => {
  const response = await api.get('/courses')
  return response.data
}

// 인증이 필요한 요청
const getMyEnrollments = async (token) => {
  const response = await api.get('/enrollments/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
```

### cURL
```bash
# 로그인
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"testuser","password":"password123"}'

# 교육과정 목록
curl http://localhost:8080/api/courses

# 인증이 필요한 요청
curl http://localhost:8080/api/enrollments/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 테스트

Postman Collection 또는 Swagger UI를 사용하여 API를 테스트할 수 있습니다.

**Swagger UI**: http://localhost:8080/api/swagger-ui.html (추가 설정 필요)
