# 배포 가이드

## 개발 환경 실행

### 사전 요구사항
- Java 17 이상
- Maven 3.6 이상
- Node.js 18 이상
- npm 또는 yarn

### 빠른 시작

#### 방법 1: 자동 스크립트 사용
```bash
cd DY_INFOSEC
chmod +x start.sh
./start.sh
```

#### 방법 2: 수동 실행

**Backend 실행**
```bash
cd DY_INFOSEC
mvn clean install
mvn spring-boot:run
```

**Frontend 실행** (새 터미널)
```bash
cd DY_INFOSEC/frontend
npm install
npm run dev
```

### 접속 정보
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/api/h2-console
  - JDBC URL: `jdbc:h2:mem:infosec`
  - Username: `sa`
  - Password: (비워두기)

---

## 프로덕션 배포

### 1. 환경 변수 설정

`.env` 파일 생성:
```env
# JWT 설정
JWT_SECRET=your-production-secret-key-minimum-256-bits-required

# 데이터베이스 설정
DB_URL=jdbc:mysql://localhost:3306/infosec
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# 이메일 설정
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# 파일 업로드 경로
UPLOAD_DIR=/var/www/dy-infosec/uploads
```

### 2. Backend 빌드 및 배포

```bash
# JAR 파일 생성
mvn clean package -DskipTests

# JAR 파일 실행
java -jar target/infosec-1.0.0.jar
```

**또는 systemd 서비스로 등록:**

`/etc/systemd/system/dy-infosec.service`:
```ini
[Unit]
Description=DY InfoSec Platform
After=syslog.target network.target

[Service]
User=www-data
ExecStart=/usr/bin/java -jar /var/www/dy-infosec/infosec-1.0.0.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

서비스 시작:
```bash
sudo systemctl daemon-reload
sudo systemctl enable dy-infosec
sudo systemctl start dy-infosec
```

### 3. Frontend 빌드 및 배포

```bash
cd frontend
npm run build
```

**Nginx 설정 예시:**

`/etc/nginx/sites-available/dy-infosec`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/dy-infosec/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nginx 활성화:
```bash
sudo ln -s /etc/nginx/sites-available/dy-infosec /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL 인증서 설정 (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Docker 배포

### Dockerfile (Backend)

`Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/infosec-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Dockerfile (Frontend)

`frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: infosec
      MYSQL_USER: infosec_user
      MYSQL_PASSWORD: infosec_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/infosec
      SPRING_DATASOURCE_USERNAME: infosec_user
      SPRING_DATASOURCE_PASSWORD: infosec_password
      JWT_SECRET: your-production-secret-key
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

실행:
```bash
docker-compose up -d
```

---

## 데이터베이스 마이그레이션

### MySQL 설정

1. MySQL 설치 및 데이터베이스 생성:
```sql
CREATE DATABASE infosec CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'infosec_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON infosec.* TO 'infosec_user'@'localhost';
FLUSH PRIVILEGES;
```

2. `application.yml` 수정:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/infosec
    username: infosec_user
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # 프로덕션에서는 validate 사용
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

---

## 모니터링 및 로깅

### 로그 설정

`application.yml`:
```yaml
logging:
  level:
    kr.hs.dukyoung.infosec: INFO
    org.springframework.security: DEBUG
  file:
    name: /var/log/dy-infosec/application.log
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

### 헬스 체크

Spring Boot Actuator 추가:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

엔드포인트: `http://localhost:8080/api/actuator/health`

---

## 백업 전략

### 데이터베이스 백업

자동 백업 스크립트:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/dy-infosec"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u infosec_user -p infosec > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Cron 설정 (매일 새벽 2시):
```bash
0 2 * * * /path/to/backup-script.sh
```

### 파일 백업

업로드된 파일 백업:
```bash
rsync -avz /var/www/dy-infosec/uploads/ /backup/uploads/
```

---

## 성능 최적화

### Backend 최적화

1. **JVM 옵션**:
```bash
java -Xms512m -Xmx2g -XX:+UseG1GC -jar app.jar
```

2. **커넥션 풀 설정**:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
```

### Frontend 최적화

1. **빌드 최적화**:
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
```

2. **이미지 최적화**: WebP 포맷 사용

---

## 보안 체크리스트

- [ ] JWT Secret 변경 (최소 256비트)
- [ ] HTTPS 적용
- [ ] CORS 설정 확인
- [ ] SQL Injection 방지 (Prepared Statements)
- [ ] XSS 방지 (입력 검증)
- [ ] CSRF 토큰 활성화
- [ ] 파일 업로드 검증
- [ ] Rate Limiting 설정
- [ ] 로그 민감정보 마스킹
- [ ] 정기적인 보안 업데이트

---

## 트러블슈팅

### 일반적인 문제

**1. CORS 에러**
- `application.yml`에서 CORS 설정 확인
- Frontend URL이 allowed-origins에 포함되어 있는지 확인

**2. JWT 토큰 만료**
- Refresh Token 사용
- 토큰 만료 시간 조정

**3. 데이터베이스 연결 실패**
- 데이터베이스 서버 상태 확인
- 연결 정보 (URL, 사용자명, 비밀번호) 확인

**4. 파일 업로드 실패**
- 업로드 디렉토리 권한 확인
- 파일 크기 제한 확인

---

## 지원

문제가 발생하면:
1. 로그 파일 확인
2. GitHub Issues 등록
3. 이메일: info@dyinfosec.kr
