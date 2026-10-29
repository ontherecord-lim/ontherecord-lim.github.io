#!/usr/bin/env python3
"""Rebuild the permanent reporting archive from all saved Git revisions."""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/articles.json"

def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, check=True,
                          capture_output=True, text=True).stdout

def article_id(record):
    raw = str(record.get("id") or "")
    if raw.isdigit():
        return raw
    match = re.search(r"/article/(\d+)", str(record.get("url") or ""))
    return match.group(1) if match else ""

def main():
    if not DATA.exists():
        raise RuntimeError("Archive missing; will not create an empty replacement")
    live = json.loads(DATA.read_text(encoding="utf-8"))
    if not isinstance(live, dict) or not isinstance(live.get("articles"), list):
        raise RuntimeError("Invalid article archive; leaving untouched")
    snapshots = git("log", "--format=%H", "--", "data/articles.json").splitlines()
    recovered = {}
    for revision in reversed(snapshots):
        try:
            record = json.loads(git("show", revision + ":data/articles.json"))
        except (subprocess.CalledProcessError, json.JSONDecodeError):
            continue
        for item in record.get("articles", []):
            if not isinstance(item, dict):
                continue
            aid = article_id(item)
            if not aid or not item.get("title") or not item.get("url"):
                continue
            good = {k: v for k, v in item.items() if v is not None and v != ""}
            recovered[aid] = {**recovered.get(aid, {}), **good, "id": aid}
    for item in live["articles"]:
        if not isinstance(item, dict):
            continue
        aid = article_id(item)
        if aid and item.get("title") and item.get("url"):
            good = {k: v for k, v in item.items() if v is not None and v != ""}
            recovered[aid] = {**recovered.get(aid, {}), **good, "id": aid}
    live["articles"] = sorted(recovered.values(), key=lambda a: int(a["id"]), reverse=True)
    if len(live["articles"]) < 18:
        raise RuntimeError("Unexpected article count: refusing to overwrite archive")
    new_text = json.dumps(live, ensure_ascii=False, indent=2) + "\n"
    if DATA.read_text(encoding="utf-8") != new_text:
        DATA.write_text(new_text, encoding="utf-8")
    print(f"Preserved {len(live['articles'])} unique verified records from {len(snapshots)} snapshots")

if __name__ == "__main__":
    main()
