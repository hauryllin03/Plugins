#!/usr/bin/env bash
# Установка сборщиков на VPS с ограниченными правами.
#
# Запускать один раз от root:  sudo ./install-hardened.sh
#
# Что делает:
#   1. Заводит системного пользователя sklad — без sudo, без пароля, без login-шелла.
#   2. Кладёт код в /opt/sklad, доступный этому пользователю ТОЛЬКО НА ЧТЕНИЕ.
#   3. Создаёт venv и папку выгрузок в /var/lib/sklad — единственное место,
#      куда сборщик может писать.
#   4. Ставит systemd-юниты с песочницей: без доступа к /home, /etc, /usr на запись,
#      без повышения привилегий, только исходящий TCP.
#
# Чего НЕ делает: ничего не удаляет за пределами своих каталогов, не трогает
# существующих пользователей, не меняет системные пакеты кроме python3-venv.

set -euo pipefail

SVC_USER="sklad"
CODE_DIR="/opt/sklad"
DATA_DIR="/var/lib/sklad"
VENV_DIR="$DATA_DIR/venv"
OUT_DIR="$DATA_DIR/leads"
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

BOLD=$'\033[1m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; OFF=$'\033[0m'
ok()   { printf '%s✓%s %s\n' "$GREEN" "$OFF" "$*"; }
warn() { printf '%s!%s %s\n' "$YELLOW" "$OFF" "$*"; }
err()  { printf '%s✗%s %s\n' "$RED" "$OFF" "$*"; }

if [ "$(id -u)" -ne 0 ]; then
  err "нужен root: sudo ./install-hardened.sh"
  exit 1
fi

printf '%s\n\n' "${BOLD}Установка сборщиков СКЛАД с ограничением прав${OFF}"

# ---------- 1. Пользователь ----------
if id "$SVC_USER" >/dev/null 2>&1; then
  ok "пользователь $SVC_USER уже есть"
else
  # --system: без места в обычном диапазоне UID; nologin: под ним нельзя войти
  useradd --system --shell /usr/sbin/nologin --home-dir "$DATA_DIR" \
          --no-create-home --comment "SKLAD lead collector" "$SVC_USER"
  ok "создан пользователь $SVC_USER (без sudo, без шелла)"
fi

# ---------- 2. Зависимости системы ----------
if ! python3 -c "import venv" >/dev/null 2>&1; then
  warn "ставлю python3-venv"
  apt-get update -qq && apt-get install -y -qq python3-venv
fi
ok "python3-venv на месте"

# ---------- 3. Код: только чтение ----------
mkdir -p "$CODE_DIR"
install -m 0644 "$SRC_DIR"/leadgen_2gis.py    "$CODE_DIR/"
install -m 0644 "$SRC_DIR"/leadgen_zakupki.py "$CODE_DIR/"
install -m 0644 "$SRC_DIR"/segments.py        "$CODE_DIR/"
install -m 0755 "$SRC_DIR"/sklad.sh           "$CODE_DIR/"

chown -R root:root "$CODE_DIR"
chmod 0755 "$CODE_DIR"
ok "код в $CODE_DIR — владелец root, для $SVC_USER только чтение"

# ---------- 4. Данные: единственное место для записи ----------
mkdir -p "$VENV_DIR" "$OUT_DIR"
chown -R "$SVC_USER:$SVC_USER" "$DATA_DIR"
chmod 0750 "$DATA_DIR" "$OUT_DIR"
ok "данные в $DATA_DIR — владелец $SVC_USER"

# ---------- 5. Окружение ----------
if [ ! -x "$VENV_DIR/bin/python" ]; then
  sudo -u "$SVC_USER" python3 -m venv "$VENV_DIR"
fi
sudo -u "$SVC_USER" "$VENV_DIR/bin/python" -m pip install --quiet --upgrade pip >/dev/null 2>&1 || true
if ! sudo -u "$SVC_USER" "$VENV_DIR/bin/python" -m pip install --quiet requests openpyxl 2>/tmp/sklad-pip.log; then
  err "не удалось поставить зависимости"
  tail -5 /tmp/sklad-pip.log | sed 's/^/    /'
  echo
  echo "  Частые причины:"
  echo "    • нет доступа в интернет с сервера — проверь: curl -I https://pypi.org"
  echo "    • корпоративный прокси с подменой TLS — задай PIP_CERT или REQUESTS_CA_BUNDLE"
  echo "    • не хватает пакета: sudo apt install python3-dev build-essential"
  exit 1
fi
rm -f /tmp/sklad-pip.log
ok "venv готов, пакеты в системе не тронуты"

# ---------- 6. Ключ ----------
ENV_FILE="/etc/sklad.env"
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'EOF'
# Ключ 2GIS. Получить: https://platform.2gis.ru/ (демо-ключ бесплатный)
DGIS_API_KEY=
EOF
  ok "создан $ENV_FILE — впиши туда ключ"
else
  ok "$ENV_FILE уже есть"
fi
# Ключ виден только root и сервисному пользователю
chown "root:$SVC_USER" "$ENV_FILE"
chmod 0640 "$ENV_FILE"

# ---------- 7. systemd с песочницей ----------
cat > /etc/systemd/system/sklad-tenders.service <<EOF
[Unit]
Description=Сбор тендеров ЕИС для ООО «СКЛАД»
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=$SVC_USER
Group=$SVC_USER
EnvironmentFile=$ENV_FILE
Environment=SKLAD_OUT=$OUT_DIR
Environment=SKLAD_VENV=$VENV_DIR
WorkingDirectory=$CODE_DIR
ExecStart=$CODE_DIR/sklad.sh tenders Татарстан

# --- песочница: что сервису запрещено ---
NoNewPrivileges=true
PrivateTmp=true
PrivateDevices=true
ProtectSystem=strict
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
ProtectClock=true
ProtectHostname=true
RestrictSUIDSGID=true
RestrictRealtime=true
RestrictNamespaces=true
LockPersonality=true
MemoryDenyWriteExecute=true
SystemCallArchitectures=native
SystemCallFilter=@system-service
SystemCallFilter=~@privileged @resources @mount @debug @reboot @swap
CapabilityBoundingSet=
AmbientCapabilities=
RestrictAddressFamilies=AF_INET AF_INET6
UMask=0027

# единственный каталог, куда разрешена запись
ReadWritePaths=$OUT_DIR

# ограничение ресурсов, чтобы сборщик не съел сервер
MemoryMax=512M
CPUQuota=50%
TasksMax=64
TimeoutStartSec=30min

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/sklad-tenders.timer <<'EOF'
[Unit]
Description=Еженедельный сбор тендеров СКЛАД

[Timer]
OnCalendar=Mon *-*-* 07:00:00
Persistent=true
RandomizedDelaySec=15min

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
ok "systemd-юниты установлены (таймер пока не включён)"

# ---------- Итог ----------
cat <<EOF

${BOLD}Границы сборщика${OFF}

  работает от        $SVC_USER (нет sudo, нет шелла, вход невозможен)
  читает             $CODE_DIR
  пишет ТОЛЬКО в     $OUT_DIR
  вся остальная ФС   только чтение (ProtectSystem=strict)
  /home              недоступен (ProtectHome=true)
  привилегии         повысить нельзя (NoNewPrivileges, CapabilityBoundingSet пуст)
  сеть               только исходящий IPv4/IPv6
  ресурсы            512 МБ, 50% CPU, 64 процесса

${BOLD}Дальше${OFF}

  1. Впиши ключ:      sudo nano $ENV_FILE
  2. Проверь доступ:  sudo -u $SVC_USER env SKLAD_VENV=$VENV_DIR SKLAD_OUT=$OUT_DIR $CODE_DIR/sklad.sh check
  3. Разовый запуск:  sudo systemctl start sklad-tenders.service
     посмотреть лог:  sudo journalctl -u sklad-tenders -n 50
  4. По расписанию:   sudo systemctl enable --now sklad-tenders.timer

  Выгрузки лягут в $OUT_DIR
  Забрать себе:      sudo cp $OUT_DIR/*.xlsx ~/ && sudo chown \$USER ~/*.xlsx

${BOLD}Удалить всё${OFF}

  sudo systemctl disable --now sklad-tenders.timer
  sudo rm -f /etc/systemd/system/sklad-tenders.{service,timer} $ENV_FILE
  sudo rm -rf $CODE_DIR $DATA_DIR
  sudo userdel $SVC_USER
EOF
