#!/usr/bin/env python3
"""Сбор лидов из тендеров ЕИС (zakupki.gov.ru) через открытый RSS поиска.

Зачем это нужно рядом со справочником: 2GIS отвечает на вопрос «кому наша
техника подходит по профилю», а тендеры — на вопрос «кто за неё уже платил».
Организация, которая полгода назад проводила закупку на аренду экскаватора,
это не гипотеза, а подтверждённый деньгами спрос.

ВАЖНО ПРО ДОСТУП (состояние на август 2026):
  * FTP-архивы ЕИС закрыты с 01.01.2025;
  * массовая выгрузка (getDocsLE2 / getDocsIP) требует ЕСИА и токена;
  * RSS расширенного поиска остаётся открытым и работает без регистрации —
    именно на нём построен этот сборщик.

ВАЖНО ПРО TLS:
  с 04.07.2026 zakupki.gov.ru использует сертификат УЦ Минцифры России,
  которого нет в стандартных хранилищах. Если видишь SSL-ошибку — поставь
  корневые сертификаты Минцифры и укажи путь через --ca-bundle или
  переменную REQUESTS_CA_BUNDLE. Проверить связность: --self-check.

Примеры:
    python3 leadgen_zakupki.py --self-check
    python3 leadgen_zakupki.py --region Татарстан --dry-run
    python3 leadgen_zakupki.py --region Татарстан --out tenders.xlsx
    python3 leadgen_zakupki.py --equipment "Мини-экскаваторы" --days 180
"""

from __future__ import annotations

import argparse
import os
import re
import sys
import time
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta
from urllib.parse import urlencode

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from leadgen_2gis import normalize_phone, write_csv as _write_csv_generic  # noqa: E402

RSS_URL = "https://zakupki.gov.ru/epz/order/extendedsearch/rss.html"
USER_AGENT = "Mozilla/5.0 (compatible; SkladLeadResearch/1.0)"
THROTTLE_SEC = 1.0

# Поисковые группы под номенклатуру. Тендеры формулируются по-разному
# («поставка погрузчика», «аренда фронтального погрузчика»), поэтому под каждую
# позицию идёт несколько формулировок.
EQUIPMENT_QUERIES = {
    "Вилочные погрузчики": [
        "вилочный погрузчик",
        "автопогрузчик",
        "поставка погрузчика",
    ],
    "Электропогрузчики": [
        "электропогрузчик",
        "погрузчик электрический",
    ],
    "Штабелеры": [
        "штабелер",
        "штабелёр самоходный",
    ],
    "Тележки": [
        "тележка гидравлическая",
        "рохля тележка",
    ],
    "Мини-погрузчики": [
        "мини-погрузчик",
        "погрузчик фронтальный мини",
        "погрузчик с бортовым поворотом",
    ],
    "Мини-экскаваторы": [
        "мини-экскаватор",
        "экскаватор гусеничный малый",
        "аренда экскаватора",
    ],
}

# Косвенные закупки: техники в предмете нет, но выполнить работы без неё нельзя.
# Победитель такого контракта — покупатель техники.
INDIRECT_QUERIES = {
    "Земляные работы (исполнителю нужна техника)": [
        "земляные работы",
        "разработка грунта",
        "прокладка сетей водоснабжения",
    ],
    "Благоустройство и содержание территорий": [
        "содержание территории уборка снега",
        "благоустройство территории",
    ],
}


@dataclass
class Tender:
    company: str = ""          # заказчик
    phones: list[str] = field(default_factory=list)
    email: str = ""
    subject: str = ""          # предмет закупки
    equipment: str = ""        # что ему продавать
    price: str = ""
    published: str = ""
    region: str = ""
    purchase_number: str = ""
    url: str = ""
    kind: str = "прямая"       # прямая | косвенная
    score: int = 0

    def as_row(self) -> dict:
        row = asdict(self)
        row["phones"] = ", ".join(self.phones)
        return row


def build_rss_url(query: str, region: str, days: int) -> str:
    """Собирает ссылку RSS расширенного поиска.

    Параметры повторяют форму расширенного поиска на сайте: если понадобится
    более тонкий отбор (ОКПД2, способ закупки, диапазон НМЦК), проще настроить
    фильтры руками на сайте, скопировать готовую RSS-ссылку и передать её
    через --raw-url.
    """
    date_from = (datetime.now() - timedelta(days=days)).strftime("%d.%m.%Y")
    date_to = datetime.now().strftime("%d.%m.%Y")
    params = {
        "searchString": query,
        "morphology": "on",
        "pageNumber": 1,
        "sortDirection": "false",
        "recordsPerPage": "_50",
        "showLotsInfoHidden": "false",
        "sortBy": "UPDATE_DATE",
        "fz44": "on",
        "fz223": "on",
        "publishDateFrom": date_from,
        "publishDateTo": date_to,
        "currencyIdGeneral": -1,
    }
    if region:
        params["regionDeleted"] = "false"
        params["searchString"] = f"{query} {region}"
    return f"{RSS_URL}?{urlencode(params, encoding='utf-8')}"


def fetch_rss(url: str, ca_bundle: str | None, timeout: int = 40) -> str | None:
    """Забирает RSS. Отдельно ловит TLS-ошибку сертификата Минцифры."""
    verify: str | bool = ca_bundle if ca_bundle else True
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=timeout, verify=verify)
    except requests.exceptions.SSLError as exc:
        print("  ! SSL: сертификат сайта не прошёл проверку.", file=sys.stderr)
        print("    С 04.07.2026 zakupki.gov.ru работает на сертификате УЦ Минцифры.", file=sys.stderr)
        print("    Поставь корневые сертификаты Минцифры и передай --ca-bundle <путь>.", file=sys.stderr)
        print(f"    Исходная ошибка: {exc}", file=sys.stderr)
        return None
    except requests.RequestException as exc:
        print(f"  ! сеть: {exc}", file=sys.stderr)
        return None

    if resp.status_code != 200:
        print(f"  ! HTTP {resp.status_code}", file=sys.stderr)
        return None
    return resp.text


PRICE_RE = re.compile(r"(\d[\d\s  ]{3,})\s*(?:руб|₽)", re.IGNORECASE)
NUMBER_RE = re.compile(r"№\s*(\d{11,})")
# В ссылке на карточку номер лежит как regNumber=… — это надёжнее, чем «№» в тексте,
# который в заголовок попадает не всегда.
REGNUM_RE = re.compile(r"regNumber=(\d{11,})")


def parse_rss(xml_text: str) -> list[dict]:
    """Разбирает RSS 2.0 в список элементов.

    Формат ЕИС кладёт в описание разнородный текст, поэтому вытаскиваем то,
    что стабильно присутствует, а остальное оставляем в subject как есть.
    """
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        print(f"  ! не удалось разобрать RSS: {exc}", file=sys.stderr)
        return []

    items = []
    for node in root.iter("item"):
        def text(tag: str) -> str:
            el = node.find(tag)
            return (el.text or "").strip() if el is not None and el.text else ""

        items.append(
            {
                "title": text("title"),
                "link": text("link"),
                "description": text("description"),
                "pubDate": text("pubDate"),
            }
        )
    return items


def item_to_tender(item: dict, equipment: str, kind: str, region: str) -> Tender:
    blob = f"{item['title']} {item['description']}"
    price_match = PRICE_RE.search(blob)
    number = ""
    link_match = REGNUM_RE.search(item["link"])
    text_match = NUMBER_RE.search(blob)
    if link_match:
        number = link_match.group(1)
    elif text_match:
        number = text_match.group(1)

    # Заказчик в RSS ЕИС обычно идёт в описании после метки «Заказчик».
    customer = ""
    m = re.search(r"Заказчик[:\s]+([^\n<;]{4,160})", item["description"])
    if m:
        customer = m.group(1).strip()

    return Tender(
        company=customer,
        subject=item["title"][:400],
        equipment=equipment,
        price=price_match.group(1).strip() if price_match else "",
        published=item["pubDate"],
        region=region,
        purchase_number=number,
        url=item["link"],
        kind=kind,
    )


def score_tender(t: Tender) -> int:
    """Приоритет: прямая закупка техники горячее косвенной, свежая горячее старой."""
    score = 60 if t.kind == "прямая" else 35
    if t.phones:
        score += 20
    if t.company:
        score += 10
    # свежесть
    try:
        pub = datetime.strptime(t.published[:16].strip(), "%a, %d %b %Y")
        age_days = (datetime.now() - pub).days
        if age_days <= 30:
            score += 10
        elif age_days <= 90:
            score += 5
    except (ValueError, TypeError):
        pass
    return min(score, 100)


def collect(groups: dict[str, list[str]], kind: str, region: str, days: int,
            ca_bundle: str | None, verbose: bool) -> list[Tender]:
    seen: dict[str, Tender] = {}
    for equipment, queries in groups.items():
        print(f"[{equipment}] запросов: {len(queries)}")
        for query in queries:
            url = build_rss_url(query, region, days)
            xml_text = fetch_rss(url, ca_bundle)
            if not xml_text:
                continue
            items = parse_rss(xml_text)
            if verbose:
                print(f"    «{query}»: {len(items)} записей")
            for item in items:
                tender = item_to_tender(item, equipment, kind, region)
                key = tender.purchase_number or tender.url or tender.subject
                if not key or key in seen:
                    continue
                tender.score = score_tender(tender)
                seen[key] = tender
            time.sleep(THROTTLE_SEC)
    return list(seen.values())


COLUMNS = [
    ("company", "Заказчик", 44),
    ("phones", "Телефон", 24),
    ("email", "E-mail", 24),
    ("subject", "Предмет закупки", 60),
    ("equipment", "Что предлагать", 26),
    ("kind", "Тип", 12),
    ("price", "НМЦК", 16),
    ("published", "Опубликовано", 22),
    ("purchase_number", "№ закупки", 20),
    ("score", "Приоритет", 11),
    ("url", "Ссылка", 46),
]


def write_xlsx(rows: list[Tender], path: str) -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter

    wb = Workbook()
    ws = wb.active
    ws.title = "Тендеры"

    header_fill = PatternFill("solid", fgColor="1F4E79")
    header_font = Font(color="FFFFFF", bold=True, size=11)
    for col, (_, title, width) in enumerate(COLUMNS, start=1):
        cell = ws.cell(row=1, column=col, value=title)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(vertical="center", horizontal="center", wrap_text=True)
        ws.column_dimensions[get_column_letter(col)].width = width
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = "A2"

    hot = PatternFill("solid", fgColor="C6EFCE")
    for row_idx, tender in enumerate(sorted(rows, key=lambda t: -t.score), start=2):
        data = tender.as_row()
        for col, (name, _, _) in enumerate(COLUMNS, start=1):
            cell = ws.cell(row=row_idx, column=col, value=data.get(name, ""))
            cell.alignment = Alignment(vertical="top", wrap_text=name in ("subject",))
        if tender.score >= 80:
            ws.cell(row=row_idx, column=10).fill = hot

    ws.auto_filter.ref = f"A1:{get_column_letter(len(COLUMNS))}{len(rows) + 1}"
    wb.save(path)


def write_csv(rows: list[Tender], path: str) -> None:
    import csv

    with open(path, "w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=[c[0] for c in COLUMNS], extrasaction="ignore")
        writer.writerow({c[0]: c[1] for c in COLUMNS})
        for row in sorted(rows, key=lambda t: -t.score):
            writer.writerow(row.as_row())


def self_check(ca_bundle: str | None) -> int:
    """Проверяет доступность RSS и корректность TLS до запуска полного сбора."""
    print("Проверка доступа к zakupki.gov.ru\n")
    url = build_rss_url("мини-экскаватор", "", 30)
    print(f"  URL: {url[:110]}...\n")
    xml_text = fetch_rss(url, ca_bundle, timeout=25)
    if xml_text is None:
        print("\nРезультат: недоступно. Причина выше.")
        print("Если это SSL — поставь корневые сертификаты Минцифры (https://www.gosuslugi.ru/crt)")
        print("и повтори: --ca-bundle /путь/к/russian_trusted_root_ca.pem")
        return 1
    items = parse_rss(xml_text)
    print(f"Результат: доступно, получено записей: {len(items)}")
    if items:
        print(f"  пример: {items[0]['title'][:90]}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Лиды из тендеров ЕИС (RSS расширенного поиска)")
    parser.add_argument("--region", default="", help="Регион/город в строке поиска, например: Татарстан")
    parser.add_argument("--equipment", help="Только под конкретную технику")
    parser.add_argument("--days", type=int, default=365, help="Глубина по дате публикации (дней)")
    parser.add_argument("--out", default="tenders.xlsx", help="Файл результата (.xlsx или .csv)")
    parser.add_argument("--indirect", action="store_true", help="Добавить косвенные закупки (земляные работы и т.п.)")
    parser.add_argument("--raw-url", help="Готовая RSS-ссылка, скопированная с сайта (обходит сборку параметров)")
    parser.add_argument("--ca-bundle", default=os.environ.get("REQUESTS_CA_BUNDLE"), help="Путь к корневым сертификатам Минцифры")
    parser.add_argument("--min-score", type=int, default=0)
    parser.add_argument("--self-check", action="store_true", help="Проверить доступность и TLS, ничего не собирая")
    parser.add_argument("--dry-run", action="store_true", help="Показать план запросов")
    parser.add_argument("--list-queries", action="store_true", help="Показать поисковые формулировки")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    if args.list_queries:
        print("Прямые закупки техники:")
        for eq, qs in EQUIPMENT_QUERIES.items():
            print(f"  {eq}: {', '.join(qs)}")
        print("\nКосвенные (техника нужна исполнителю):")
        for eq, qs in INDIRECT_QUERIES.items():
            print(f"  {eq}: {', '.join(qs)}")
        return 0

    if args.self_check:
        return self_check(args.ca_bundle)

    if args.raw_url:
        xml_text = fetch_rss(args.raw_url, args.ca_bundle)
        if not xml_text:
            return 1
        items = parse_rss(xml_text)
        tenders = []
        for item in items:
            t = item_to_tender(item, args.equipment or "по ссылке", "прямая", args.region)
            t.score = score_tender(t)
            tenders.append(t)
        print(f"Получено записей: {len(tenders)}")
    else:
        if args.equipment:
            groups = {k: v for k, v in EQUIPMENT_QUERIES.items() if args.equipment.lower() in k.lower()}
            if not groups:
                print(f"Нет группы «{args.equipment}». Список: --list-queries", file=sys.stderr)
                return 1
        else:
            groups = dict(EQUIPMENT_QUERIES)

        total = sum(len(v) for v in groups.values())
        if args.indirect:
            total += sum(len(v) for v in INDIRECT_QUERIES.values())
        print(f"Регион: {args.region or 'вся Россия'}, глубина: {args.days} дн., запросов: {total}\n")

        if args.dry_run:
            for eq, qs in groups.items():
                print(f"[{eq}]")
                for q in qs:
                    print(f"    «{q}»")
            if args.indirect:
                for eq, qs in INDIRECT_QUERIES.items():
                    print(f"[{eq}] (косвенные)")
                    for q in qs:
                        print(f"    «{q}»")
            print(f"\nПример URL:\n  {build_rss_url(list(groups.values())[0][0], args.region, args.days)}")
            return 0

        tenders = collect(groups, "прямая", args.region, args.days, args.ca_bundle, args.verbose)
        if args.indirect:
            tenders += collect(INDIRECT_QUERIES, "косвенная", args.region, args.days, args.ca_bundle, args.verbose)

    if args.min_score:
        tenders = [t for t in tenders if t.score >= args.min_score]

    if not tenders:
        print("\nНичего не найдено. Проверь доступность: --self-check")
        return 0

    if args.out.endswith(".csv"):
        write_csv(tenders, args.out)
    else:
        write_xlsx(tenders, args.out)

    direct = sum(1 for t in tenders if t.kind == "прямая")
    print(f"\nНайдено тендеров: {len(tenders)}  (прямых: {direct}, косвенных: {len(tenders) - direct})")
    print(f"  файл: {args.out}")
    print("\nКонтактов в RSS нет — телефон заказчика смотри на странице закупки")
    print("в разделе «Контактная информация» (колонка «Ссылка»).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
