#!/bin/bash
# ========================================================
# Sales Intelligence - Contabo VPS Professional Deployment
# ========================================================
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}[DEPLOY] 🚀 Sales Intelligence tizimini deploy qilish boshlanmoqda...${NC}"

# 1. Docker tekshiruvi
if ! command -v docker &> /dev/null
then
    echo -e "${YELLOW}[DEPLOY] ⚠️ Docker o'rnatilmagan. Docker o'rnatilmoqda...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# 2. .env fayli tekshiruvi
if [ ! -f .env ]; then
    echo -e "${YELLOW}[DEPLOY] 📄 .env fayli mavjud emas, yaratilmoqda...${NC}"
    cp .env.example .env
fi

# 3. Konteynerlarni qayta build qilish va ishga tushirish
echo -e "${BLUE}[DEPLOY] Konteynerlar qayta ishga tushirilmoqda...${NC}"
docker compose down --remove-orphans
docker compose up -d --build

# 4. Servislar holatini tekshirish
echo -e "${BLUE}[DEPLOY] Servislar holati tekshirilmoqda...${NC}"
sleep 4

# Container status checks
DB_STATUS=$(docker inspect --format='{{.State.Health.Status}}' sales_intelligence_db 2>/dev/null || echo "running")
BACKEND_STATUS=$(docker inspect --format='{{.State.Health.Status}}' sales_intelligence_backend 2>/dev/null || echo "running")
FRONTEND_STATUS=$(docker inspect --format='{{.State.Status}}' sales_intelligence_frontend 2>/dev/null || echo "running")

echo -e "${CYAN}[DEPLOY] Ma'lumotlar bazasi holati:${NC} ${GREEN}${DB_STATUS}${NC}"
echo -e "${CYAN}[DEPLOY] Backend holati:${NC} ${GREEN}${BACKEND_STATUS}${NC}"
echo -e "${CYAN}[DEPLOY] Frontend holati:${NC} ${GREEN}${FRONTEND_STATUS}${NC}"

echo ""
docker compose ps
echo ""

# Server tashqi IP manzilini aniqlash
SERVER_IP=$(curl -s -4 ifconfig.me || curl -s -4 icanhazip.com || hostname -I | awk '{print $1}')

echo -e "${GREEN}${BOLD}[DEPLOY] ✅ Deployment muvaffaqiyatli yakunlandi!${NC}"
echo -e "  ${BOLD}Frontend:${NC}        http://${SERVER_IP}"
echo -e "  ${BOLD}API docs (Swagger):${NC} http://${SERVER_IP}/swagger"
echo -e "  ${BOLD}Backend Port:${NC}    http://${SERVER_IP}:5156"
