#!/usr/bin/env bash
# Единая точка входа для сбора баз клиентов ООО «СКЛАД».
#
# Запускать НА СВОЕЙ МАШИНЕ: облачные сессии Claude Code режут доступ
# к 2GIS и zakupki.gov.ru политикой egress-прокси.
#
#   ./sklad.sh setup              — поставить зависимости, проверить готовность
#   ./sklad.sh check              — проверить доступ к источникам
#   ./sklad.sh base Казань        — собрать базу по городу (2GIS)
#   ./sklad.sh tenders Татарстан  — собрать тендеры (ЕИС)
#   ./sklad.sh all Казань Татарстан — и то, и другое

set -uo pipefail
cd "$(dirname "$0")"

BOLD=$'\033[1m'; GREEN=$'\033[32m'; RED=$'\033[31m'; YELLOW=$'\033[33m'; OFF=$'\033[0m'
OUTDIR="${SKLAD_OUT:-$HOME/sklad-leads}"
STAMP=$(date +%Y-%m-%d)

say()  { printf '%s\n' "$*"; }
ok()   { printf '%s✓%s %s\n' "$GREEN" "$OFF" "$*"; }
warn() { printf '%s!%s %s\n' "$YELLOW" "$OFF" "$*"; }
err()  { printf '%s✗%s %s\n' "$RED" "$OFF" "$*"; }

need_python() {
  if ! command -v python3 >/dev/null 2>&1; then
    err "Python 3 не найден. Поставь его: https://www.python.org/downloads/"
    exit 1
  fi
}

cmd_setup() {
  say "${BOLD}Установка${OFF}"
  need_python
  ok "Python $(python3 -V 2>&1 | cut -d' ' -f2)"

  say "  ставлю зависимости..."
  if python3 -m pip install --quiet --upgrade requests openpyxl 2>/dev/null; then
    ok "requests, openpyxl"
  else
    err "не удалось поставить зависимости. Попробуй вручную:"
    say "    python3 -m pip install requests openpyxl"
    exit 1
  fi

  mkdir -p "$OUTDIR" && ok "папка для выгрузок: $OUTDIR"

  say ""
  if [ -n "${DGIS_API_KEY:-}" ]; then
    ok "ключ 2GIS найден в DGIS_API_KEY"
  else
    warn "ключ 2GIS не задан — сбор по справочнику работать не будет"
    say "    1. Зарегистрируйся: https://platform.2gis.ru/"
    say "    2. Создай демо-ключ (бесплатно, 1000 запросов, месяц)"
    say "    3. Добавь в ~/.zshrc или ~/.bashrc:"
    say "         export DGIS_API_KEY=\"твой-ключ\""
    say "    4. Перезапусти терминал"
    say ""
    say "    Тендеры (./sklad.sh tenders) ключа не требуют — их можно собирать уже сейчас."
  fi
  say ""
  say "Готово. Дальше: ${BOLD}./sklad.sh check${OFF}"
}

cmd_check() {
  say "${BOLD}Проверка доступа к источникам${OFF}"
  need_python
  local fails=0

  say ""
  say "1. Справочник 2GIS"
  if [ -z "${DGIS_API_KEY:-}" ]; then
    warn "   ключ не задан (DGIS_API_KEY) — пропускаю"
    fails=$((fails + 1))
  elif python3 - <<'PY'
import os, sys, requests
try:
    r = requests.get("https://catalog.api.2gis.com/3.0/items",
                     params={"q": "склад Казань", "key": os.environ["DGIS_API_KEY"],
                             "fields": "items.contact_groups", "page_size": 1},
                     timeout=20)
    if r.status_code == 200 and (r.json().get("result") or {}).get("items"):
        sys.exit(0)
    print(f"   ответ {r.status_code}: {r.text[:160]}")
except Exception as exc:
    print(f"   {exc}")
sys.exit(1)
PY
  then
    ok "   доступен, ключ рабочий"
  else
    err "   недоступен"
    fails=$((fails + 1))
  fi

  say ""
  say "2. Тендеры ЕИС"
  if python3 leadgen_zakupki.py --self-check >/dev/null 2>&1; then
    ok "   доступен"
  else
    err "   недоступен — подробности:"
    python3 leadgen_zakupki.py --self-check 2>&1 | sed 's/^/     /' | tail -6
    fails=$((fails + 1))
  fi

  say ""
  [ "$fails" -eq 0 ] && ok "Оба источника готовы" || warn "Недоступных источников: $fails"
}

cmd_base() {
  local city="${1:-}"
  [ -z "$city" ] && { err "укажи город: ./sklad.sh base Казань"; exit 1; }
  need_python
  if [ -z "${DGIS_API_KEY:-}" ]; then
    err "нет ключа 2GIS. Запусти ./sklad.sh setup — там инструкция."
    exit 1
  fi
  mkdir -p "$OUTDIR"
  local out="$OUTDIR/база_${city}_${STAMP}.xlsx"

  say "${BOLD}Сбор базы по городу: $city${OFF}"
  python3 leadgen_2gis.py --city "$city" --out "$out" --with-phone-only -v || exit 1
  say ""
  ok "файл: $out"
}

cmd_tenders() {
  local region="${1:-}"
  need_python
  mkdir -p "$OUTDIR"
  local out="$OUTDIR/тендеры_${region:-РФ}_${STAMP}.xlsx"

  say "${BOLD}Сбор тендеров: ${region:-вся Россия}${OFF}"
  python3 leadgen_zakupki.py --region "$region" --days 365 --indirect --out "$out" -v || exit 1
  say ""
  ok "файл: $out"
}

cmd_all() {
  cmd_base "${1:-}"
  say ""
  cmd_tenders "${2:-}"
  say ""
  ok "Обе выгрузки в $OUTDIR"
  say ""
  say "Дальше: открой базу, звони сверху вниз по колонке «Приоритет»."
  say "Заинтересовался — проси Claude: «сделай КП на [модель] для [компания]»."
}

usage() {
  cat <<EOF
${BOLD}Сбор баз клиентов ООО «СКЛАД»${OFF}

  ./sklad.sh setup                  поставить зависимости и проверить готовность
  ./sklad.sh check                  проверить доступ к источникам
  ./sklad.sh base <город>           база по справочнику 2GIS (нужен ключ)
  ./sklad.sh tenders [регион]       тендеры ЕИС (ключ не нужен)
  ./sklad.sh all <город> [регион]   и то, и другое

Выгрузки складываются в $OUTDIR (меняется через SKLAD_OUT).

Примеры:
  ./sklad.sh setup
  ./sklad.sh base Казань
  ./sklad.sh tenders Татарстан
  ./sklad.sh all Казань Татарстан
EOF
}

case "${1:-}" in
  setup)   cmd_setup ;;
  check)   cmd_check ;;
  base)    shift; cmd_base "${1:-}" ;;
  tenders) shift; cmd_tenders "${1:-}" ;;
  all)     shift; cmd_all "${1:-}" "${2:-}" ;;
  *)       usage ;;
esac
