#!/bin/bash
# ========================================================
# Sales Intelligence - Contabo VPS Avtomatik Deploy Skripti
# ========================================================

echo "🚀 Sales Intelligence loyihasini Contabo serverida ishga tushirish..."

# 1. Docker va Docker Compose o'rnatilganligini tekshirish
if ! command -v docker &> /dev/null
then
    echo "⚠️ Docker topilmadi. Docker o'rnatilmoqda..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# 2. .env fayli mavjudligini tekshirish
if [ ! -f .env ]; then
    echo "📄 .env fayli topilmadi, .env.example dan nusxalanmoqda..."
    cp .env.example .env
    echo "⚠️ Iltimos, .env faylidagi parollarni tekshiring!"
fi

# 3. Eski konteynerlarni to'xtatish va yangilarini build qilish
echo "🔨 Konteynerlar yig'ilmoqda va ishga tushirilmoqda..."
docker compose down
docker compose up -d --build

echo "✅ Muvaffaqiyatli ishga tushdi!"
echo "📊 Holatni ko'rish: docker compose ps"
echo "📜 Loglarni ko'rish: docker compose logs -f"
