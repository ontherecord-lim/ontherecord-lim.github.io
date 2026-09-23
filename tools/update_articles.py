#!/usr/bin/env python3
"""Refresh the On the Record / 기록선 Korea Herald article feed.

- Discovers recent article links from Lim Ye-jin's reporter page.
- Verifies the article belongs to Lim Ye-jin.
- Pulls title, publication date and lead image metadata.
- Preserves manually localized Korean titles already stored in data/articles.json.
- Keeps the newest 18 verified stories.
"""
from __future__ import annotations

import html
import json
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "articles.json"
REPORTER_URL = "https://www.koreaherald.com/reporter/yejinlim"
MAX_ARTICLES = 18
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; OnTheRecordPortfolio/2.0; +https://ontherecord-lim.github.io/)"
}
KST = timezone(timedelta(hours=9))


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value or "")).strip()


def article_id(url: str) -> str:
    match = re.search(r"/article/(\d+)", url)
    return match.group(1) if match else ""


def meta(soup: BeautifulSoup, *keys: str) -> str:
    for key in keys:
        tag = soup.find("meta", attrs={"property": key}) or soup.find("meta", attrs={"name": key})
        if tag and tag.get("content"):
            return clean(tag["content"])
    return ""


def load_existing() -> dict[str, dict]:
    if not DATA_FILE.exists():
        return {}
    try:
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {}
    return {str(item.get("id")): item for item in data.get("articles", []) if item.get("id")}


def discover_links(session: requests.Session) -> list[str]:
    response = session.get(REPORTER_URL, headers=HEADERS, timeout=25)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    found: dict[str, str] = {}

    for anchor in soup.find_all("a", href=True):
        href = anchor.get("href", "")
        aid = article_id(href)
        if not aid:
            continue
        if href.startswith("/"):
            href = "https://www.koreaherald.com" + href
        if href.startswith("https://www.koreaherald.com/article/"):
            found[aid] = href

    return [found[aid] for aid in sorted(found, key=int, reverse=True)]


MONTH_LABELS = {1: "Jan.", 2: "Feb.", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "Aug.", 9: "Sept.", 10: "Oct.", 11: "Nov.", 12: "Dec."}

def parse_published(soup: BeautifulSoup) -> tuple[str, str, str]:
    raw = meta(soup, "article:published_time", "date", "pubdate")
    dt = None
    if raw:
        normalized = raw.replace("Z", "+00:00")
        try:
            dt = datetime.fromisoformat(normalized)
        except ValueError:
            dt = None

    if dt is None:
        text = soup.get_text(" ", strip=True)
        match = re.search(
            r"Published\s*:\s*([A-Z][a-z]{2,8}\.?\s+\d{1,2},\s+\d{4})\s*-\s*(\d{1,2}:\d{2}:\d{2})",
            text,
        )
        if match:
            for fmt in ("%b. %d, %Y %H:%M:%S", "%b %d, %Y %H:%M:%S", "%B %d, %Y %H:%M:%S"):
                try:
                    dt = datetime.strptime(f"{match.group(1)} {match.group(2)}", fmt).replace(tzinfo=KST)
                    break
                except ValueError:
                    continue

    if dt is None:
        return "Latest", "최신", ""

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=KST)
    local = dt.astimezone(KST)
    month = MONTH_LABELS[local.month]
    english = f"{month} {local.day}, {local.year}"
    korean = f"{local.year}. {local.month}. {local.day}."
    return english, korean, local.date().isoformat()


def fetch_article(session: requests.Session, url: str, existing: dict[str, dict]) -> dict | None:
    aid = article_id(url)
    if not aid:
        return None

    try:
        response = session.get(url, headers=HEADERS, timeout=25)
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"Skip {aid}: {exc}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    page_text = soup.get_text(" ", strip=True)
    author_meta = meta(soup, "author", "article:author")
    if author_meta:
        if "Lim Ye-jin" not in author_meta:
            return None
    else:
        exact_author = soup.find(string=re.compile(r"^\s*Lim Ye-jin\s*$"))
        if not exact_author:
            return None

    title = meta(soup, "og:title", "twitter:title")
    if not title:
        h1 = soup.find("h1")
        title = clean(h1.get_text(" ", strip=True)) if h1 else ""
    title = re.sub(r"\s*[-–—|]\s*The Korea Herald\s*$", "", title, flags=re.I).strip()
    if not title:
        return None

    image = meta(soup, "og:image", "twitter:image")
    date, date_ko, iso_date = parse_published(soup)

    item = {
        "id": aid,
        "title": title,
        "url": url,
        "date": date,
        "dateKo": date_ko,
        "isoDate": iso_date,
        "image": image,
    }

    old = existing.get(aid, {})
    if old.get("titleKo"):
        item["titleKo"] = old["titleKo"]
    return item


def main() -> None:
    existing = load_existing()
    session = requests.Session()
    try:
        links = discover_links(session)
    except requests.RequestException as exc:
        print(f"Reporter page unavailable; keeping existing feed: {exc}")
        return
    articles: list[dict] = []

    for url in links[:60]:
        article = fetch_article(session, url, existing)
        if article:
            articles.append(article)
        if len(articles) >= MAX_ARTICLES:
            break

    if not articles:
        raise SystemExit("No verified Lim Ye-jin articles found; existing feed left untouched.")

    articles.sort(key=lambda item: int(item["id"]), reverse=True)
    payload = {
        "generatedAt": datetime.now(KST).isoformat(timespec="seconds"),
        "articles": articles[:MAX_ARTICLES],
    }
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {DATA_FILE} with {len(payload['articles'])} articles")


if __name__ == "__main__":
    main()
