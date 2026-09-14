#!/usr/bin/env python3
"""Optional updater for the portfolio's Korea Herald feed.

The five manually curated stories and their local cover images are preserved exactly.
New reporter-page stories are added only when both article metadata and a cover image
can be fetched successfully, so the public site never publishes an image-less card.
"""
from __future__ import annotations

import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "articles.json"
IMAGE_DIR = ROOT / "assets" / "article-images"
REPORTER_URL = "https://www.koreaherald.com/reporter/yejinlim"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; OnTheRecordPortfolio/1.0; +https://ontherecord-lim.github.io/)"
}
MANUAL_IDS = {"10870604", "10867926", "10867826", "10867554", "10863945"}


def clean_title(value: str) -> str:
    value = html.unescape(value or "")
    value = re.sub(r"\s*[-–—|]\s*The Korea Herald\s*$", "", value, flags=re.I)
    return re.sub(r"\s+", " ", value).strip()


def article_id(url: str) -> str:
    match = re.search(r"/article/(\d+)", url)
    return match.group(1) if match else ""


def meta(soup: BeautifulSoup, *keys: str) -> str:
    for key in keys:
        tag = soup.find("meta", attrs={"property": key}) or soup.find("meta", attrs={"name": key})
        if tag and tag.get("content"):
            return tag["content"].strip()
    return ""


def discover_links(session: requests.Session) -> list[str]:
    try:
        response = session.get(REPORTER_URL, headers=HEADERS, timeout=20)
        response.raise_for_status()
    except requests.RequestException:
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    links: list[str] = []
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        if not re.search(r"/article/\d+", href):
            continue
        if href.startswith("/"):
            href = "https://www.koreaherald.com" + href
        if href.startswith("https://www.koreaherald.com/article/") and href not in links:
            links.append(href)
    return links[:15]


def fetch_new_article(session: requests.Session, url: str) -> dict | None:
    aid = article_id(url)
    if not aid:
        return None
    try:
        response = session.get(url, headers=HEADERS, timeout=20)
        response.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    title = clean_title(meta(soup, "og:title", "twitter:title"))
    description = html.unescape(meta(soup, "og:description", "description")).strip()
    image_url = meta(soup, "og:image", "twitter:image")
    published = meta(soup, "article:published_time")
    if not title or not image_url:
        return None

    try:
        image_response = session.get(image_url, headers=HEADERS, timeout=25)
        image_response.raise_for_status()
    except requests.RequestException:
        return None

    ctype = image_response.headers.get("content-type", "").lower()
    ext = ".jpg"
    if "png" in ctype:
        ext = ".png"
    elif "webp" in ctype:
        ext = ".webp"

    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    target = IMAGE_DIR / f"{aid}{ext}"
    target.write_bytes(image_response.content)

    date_text = "Latest"
    if published:
        try:
            dt = datetime.fromisoformat(published.replace("Z", "+00:00"))
            date_text = dt.strftime("%b. %d, %Y").replace(" 0", " ")
        except ValueError:
            pass

    return {
        "id": aid,
        "title": title,
        "url": url,
        "date": date_text,
        "category": "The Korea Herald · Business",
        "description": description,
        "image": str(target.relative_to(ROOT)).replace("\\", "/"),
    }


def main() -> None:
    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    existing = [article for article in data.get("articles", []) if article.get("id")]
    existing_ids = {article["id"] for article in existing}
    session = requests.Session()

    additions: list[dict] = []
    for url in discover_links(session):
        aid = article_id(url)
        if not aid or aid in existing_ids or aid in MANUAL_IDS:
            continue
        article = fetch_new_article(session, url)
        if article:
            additions.append(article)
            existing_ids.add(aid)
        if len(additions) >= 5:
            break

    if not additions:
        print("No new fully illustrated stories found; leaving curated feed unchanged.")
        return

    data["articles"] = (additions + existing)[:10]
    data["generatedAt"] = datetime.now(timezone.utc).isoformat()
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {len(additions)} new story/stories.")


if __name__ == "__main__":
    main()
