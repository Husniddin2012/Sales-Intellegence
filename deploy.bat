@echo off
REM ========================================================
REM Sales Intelligence - Windows Batch Deploy Skripti
REM ========================================================

echo [DEPLOY] Sales Intelligence tizimi Windows muhitida ishga tushirilmoqda...

if not exist ".env" (
    echo [DEPLOY] .env fayli topilmadi, .env.example dan nusxalanmoqda...
    copy .env.example .env
)

echo [DEPLOY] Konteynerlar yig'ilmoqda va ishga tushirilmoqda...
docker compose down
docker compose up -d --build

echo.
echo [DEPLOY] Konteynerlar holati:
docker compose ps

echo.
echo ========================================================
echo [DEPLOY] Muvaffaqiyatli ishga tushdi!
echo Frontend:      http://localhost
echo API (Swagger): http://localhost:5156/swagger
echo ========================================================
pause
