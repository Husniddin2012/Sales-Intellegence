#!/bin/bash
# ========================================================
# Sales Intelligence - Contabo VPS Professional Deployment
# ========================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}[DEPLOY] 🚀 Sales Intelligence tizimini deploy qilish boshlanmoqda...${NC}"

# 1. Docker tekshiruvi
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}[DEPLOY] ⚠️ Docker o'rnatilmoqda...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm -f get-docker.sh
fi

# 2. .env fayli tekshiruvi
if [ ! -f .env ]; then
    echo -e "${YELLOW}[DEPLOY] 📄 .env fayli yaratilmoqda...${NC}"
    cp .env.example .env 2>/dev/null || true
fi

# 3. Konteynerlarni qayta build qilish va ishga tushirish
echo -e "${BLUE}[DEPLOY] Konteynerlar qayta ishga tushirilmoqda...${NC}"
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d --build

# 4. Servislar holatini tekshirish
echo -e "${BLUE}[DEPLOY] Servislar holati tekshirilmoqda...${NC}"
sleep 3

echo ""
docker compose ps
echo ""

# 5. Server IP manzilini tez va xatosiz aniqlash
SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(curl -s --max-time 2 ifconfig.me 2>/dev/null || echo "localhost")
fi

# 6. Yakuniy manzillarni chiqarish
echo -e "${GREEN}[DEPLOY] ✅ Deployment muvaffaqiyatli yakunlandi!${NC}"
echo -e "   Frontend: http://${SERVER_IP}"
echo -e "   API docs: http://${SERVER_IP}/swagger"
