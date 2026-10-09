#!/usr/bin/env bash
set -e

echo "=================================================="
echo "   HuntMe: Автоматический запуск бэкенда и БД     "
echo "=================================================="

# 1. Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не найден на машине."
    echo ""
    echo "Для установки выполните в терминале команду:"
    echo "  sudo apt update && sudo apt install -y docker.io docker-compose-v2"
    echo "  sudo usermod -aG docker \$USER"
    echo "  sudo systemctl start docker"
    echo ""
    echo "После этого запустите скрипт повторно: ./start-services.sh"
    exit 1
fi

# 2. Определение команды (с sudo или без)
if docker info &> /dev/null; then
    COMPOSE="docker compose"
else
    echo "⚠️  Выполняем через sudo (так как текущий пользователь не в группе docker)..."
    COMPOSE="sudo docker compose"
fi

# 3. Запуск инфраструктуры бэкенда
echo "🚀 Поднимаем сервисы (Postgres, Keycloak с realm 'huntme', миграции и Go-бэк)..."
$COMPOSE up -d database keycloak-db keycloak migrations backend

echo ""
echo "=================================================="
echo "🎉 Бэкенд и сервисы успешно запущены!"
echo "=================================================="
echo "  • Go Backend:       http://localhost:8081"
echo "  • Keycloak:         http://localhost:8080"
echo "  • Realm HuntMe:     http://localhost:8080/realms/huntme"
echo "  • Почта (Mailpit):  http://localhost:8025"
echo ""
echo "Команды для мониторинга:"
echo "  Логи бэкенда:       $COMPOSE logs -f backend"
echo "  Статус контейнеров: $COMPOSE ps"
echo "  Остановка:          $COMPOSE down"
