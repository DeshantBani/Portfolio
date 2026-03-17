"""
Public read-only content API. No auth required.
"""
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
CONTENT_FILE = DATA_DIR / "content.json"

GRAPH_FILE = DATA_DIR / "graph.json"
VALID_SECTIONS = {"about", "experience", "projects", "achievements", "technologies", "contact"}


def _load_content() -> dict:
    if not CONTENT_FILE.exists():
        raise HTTPException(status_code=500, detail="Content store not found")
    with open(CONTENT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/content")
def get_all_content():
    """Return full content JSON for the portfolio."""
    return _load_content()


@router.get("/content/graph")
def get_graph():
    """Return knowledge graph node/edge data."""
    if not GRAPH_FILE.exists():
        raise HTTPException(status_code=500, detail="Graph data not found")
    with open(GRAPH_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/content/{section}")
def get_section(section: str):
    """Return a single section (about, experience, projects, achievements, technologies, contact)."""
    if section not in VALID_SECTIONS:
        raise HTTPException(status_code=404, detail=f"Unknown section: {section}")
    data = _load_content()
    if section not in data:
        raise HTTPException(status_code=404, detail=f"Section {section} not in content")
    return data[section]
