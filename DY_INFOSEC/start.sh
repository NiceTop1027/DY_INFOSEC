#!/bin/bash

echo "========================================="
echo "두경정보보안학교 플랫폼 시작"
echo "========================================="

# Backend 시작
echo ""
echo "1. Backend 서버 시작 중..."
cd "$(dirname "$0")"
mvn spring-boot:run &
BACKEND_PID=$!

# 백엔드 서버가 시작될 때까지 대기
echo "Backend 서버 시작 대기 중..."
sleep 10

# Frontend 시작
echo ""
echo "2. Frontend 서버 시작 중..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================="
echo "서버 시작 완료!"
echo "========================================="
echo "Backend:  http://localhost:8080/api"
echo "Frontend: http://localhost:3000"
echo "H2 Console: http://localhost:8080/api/h2-console"
echo ""
echo "종료하려면 Ctrl+C를 누르세요"
echo "========================================="

# 종료 시그널 처리
trap "echo '서버 종료 중...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# 프로세스가 종료될 때까지 대기
wait
