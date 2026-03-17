"""
Protected admin API: update content. Requires valid ADMIN_SECRET (Bearer or X-Admin-Key).
"""
import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Body

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
CONTENT_FILE = DATA_DIR / "content.json"

VALID_SECTIONS = {"about", "experience", "projects", "achievements", "technologies", "contact"}


def _load_content() -> dict:
    if not CONTENT_FILE.exists():
        raise HTTPException(status_code=500, detail="Content store not found")
    with open(CONTENT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_content(data: dict) -> None:
    CONTENT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CONTENT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


@router.get("/content")
def admin_get_content():
    """Return full content (for admin UI to load)."""
    return _load_content()


@router.put("/content")
def admin_update_full_content(body: dict = Body(...)):
    """Replace entire content store. Use with caution."""
    _save_content(body)
    return {"ok": True}


@router.put("/content/{section}")
def admin_update_section(section: str, body: Any = Body(...)):
    """Update a single section (about, experience, projects, achievements, technologies, contact)."""
    if section not in VALID_SECTIONS:
        raise HTTPException(status_code=404, detail=f"Unknown section: {section}")
    data = _load_content()
    data[section] = body
    _save_content(data)
    return {"ok": True}
