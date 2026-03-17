"""
Portfolio content API + Admin.
Serves content for the public site and provides protected write endpoints for the admin UI.
"""
import json
import os
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.auth import verify_admin_token
from app.routers import content, admin, chat

# Path to content store (JSON)
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CONTENT_FILE = DATA_DIR / "content.json"

app = FastAPI(
    title="Portfolio API",
    description="Content API and admin for portfolio site",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_content_path() -> Path:
    return CONTENT_FILE


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Mount content API (read), chat (AI), and admin (write) routes
app.include_router(content.router, prefix="/api", tags=["content"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"], dependencies=[Depends(verify_admin_token)])

# Serve admin SPA static files if they exist
admin_dist = Path(__file__).resolve().parent.parent / "admin_dist"
if admin_dist.exists():
    app.mount("/admin", StaticFiles(directory=str(admin_dist), html=True), name="admin")
