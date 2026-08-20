# ========================================================
# Sales Intelligence - Windows PowerShell Deploy Skripti
# ========================================================

Write-Host "[DEPLOY] 🚀 Sales Intelligence tizimi Windows muhitida ishga tushirilmoqda..." -ForegroundColor Cyan

# 1. .env fayli mavjudligini tekshirish
if (-not (Test-Path ".env")) {
    Write-Host "[DEPLOY] 📄 .env fayli topilmadi, .env.example dan nusxalanmoqda..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# 2. Docker Desktop tekshiruvi
try {
    docker --version | Out-Null
} catch {
    Write-Host "[DEPLOY] ❌ Docker topilmadi! Iltimos, Docker Desktop o'rnatilganini va ishga tushirilganini tekshiring." -ForegroundColor Red
    Exit 1
}

# 3. Konteynerlarni qayta build qilish va ishga tushirish
Write-Host "[DEPLOY] 🔨 Konteynerlar yig'ilmoqda va ishga tushirilmoqda..." -ForegroundColor Green
docker compose down
docker compose up -d --build

Write-Host ""
Write-Host "[DEPLOY] 📊 Konteynerlar holati:" -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host "[DEPLOY] ✅ Muvaffaqiyatli ishga tushdi!" -ForegroundColor Green
Write-Host "  Frontend:        http://localhost" -ForegroundColor Yellow
Write-Host "  API (Swagger):   http://localhost:5156/swagger" -ForegroundColor Yellow
