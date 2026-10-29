#!/usr/bin/env python3
"""Repair legacy article-image paths using publisher Open Graph images.

Only replaces stale local paths that do not exist in this repository. 
Never invents or generates a photograph for an article.
"""
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/articles.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; OnTheRecordImageRepair/1.0)"}
session = requests.Session()


def publisher_image(url: str) -> str | None:
    page = session.get(url, headers=HEADERS, timeout=35)
    page.raise_for_status()
    soup = BeautifulSoup(page.text, "html.parser")
    candidates = []
    for key, value in (("property", "og:image"), ("name", "twitter:image")):
        tag = soup.find("meta", attrs={key: value})
        if tag and tag.get("content"):
            candidates.append(urljoin(url, tag["content"].strip()))
    for tag in soup.find_all("meta", attrs={"property": "og:image:url"}):
        if tag.get("content"):
            candidates.append(urljoin(url, tag["content"].strip()))
    for candidate in dict.fromkeys(candidates):
        parsed = urlparse(candidate)
        if parsed.scheme != "https" or parsed.hostname not in {
            "wimg.heraldcorp.com", "www.koreaherald.com",
            "img.heraldcorp.com", "mimg.heraldcorp.com",
        }:
            continue
        try:
            # Stream enough to confirm it is an actual image, without downloading copies.
            with session.get(candidate, headers={**HEADERS, "Referer": url}, stream=True, timeout=25) as response:
                response.raise_for_status()
                ctype = response.headers.get("Content-Type", "").lower()
                if ctype.startswith("image/"):
                    return candidate
        except requests.RequestException as exc:
            print(f"Image candidate rejected: {candidate} ({exc})")
    return None


def main() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("articles"), list):
        raise RuntimeError("Invalid article archive, aborting")
    found = 0
    failed = []
    for item in data["articles"]:
        image = str(item.get("image") or "")
        if not image.startswith("assets/") or (ROOT / image).is_file():
            continue
        aid = str(item.get("id", "?"))
        url = str(item.get("url") or "")
        if not url.startswith("https://www.koreaherald.com/article/"):
            failed.append((aid, "unexpected URL"))
            continue
        try:
            result = publisher_image(url)
        except requests.RequestException as exc:
            print(f"Publisher error for {aid}: {exc}")
            result = None
        if result:
            item["image"] = result
            found += 1
            print(f"Recovered {aid}: {result}")
        else:
            failed.append((aid, "no verified publisher image"))
    if found:
        SOURCE.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Recovered {found}; unresolved {len(failed)}; total records {len(data['articles'])}")
    for aid, why in failed:
        print(f"UNRESOLVED {aid}: {why}")
    # Errors do not destroy the archive. Existing browser fallback is left in place.


if __name__ == "__main__":
    main()
