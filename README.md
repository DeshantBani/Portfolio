# JARVIS Agent OS — AI-Native Portfolio

An AI-native portfolio that IS an agent operating system. Features a cinematic boot
sequence, live knowledge graph wallpaper, floating draggable windows, JARVIS AI chatbot,
and one-click contact — all in emerald green on dark.

## Quick Start

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt

# Optional: set your OpenAI API key for real AI chat
export OPENAI_API_KEY=sk-...

# Optional: set admin secret (default: change-me-in-production)
export ADMIN_SECRET=your-secret-here

uvicorn app.main:app --reload --port 8000
```

### Connecting frontend to backend

Set the API URL in the frontend:

```bash
# In frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Without this, the frontend uses static JSON data and the chat falls back to
a mock response mode. The visual experience (boot, graph, OS, windows) works
fully without the backend.

## Architecture

```
frontend/          Next.js 15 + Tailwind + Framer Motion
  src/
    app/           Page and layout
    components/    Desktop, BootSequence, KnowledgeGraph, FloatingWindow, Dock
      windows/     JarvisWindow, ExperienceWindow, ProjectsWindow, etc.
    hooks/         useTokenStream
    lib/           types, content fetching
  data/            Static content + graph JSON

backend/           FastAPI (Python)
  app/
    main.py        App entry point
    auth.py        Admin auth (Bearer token)
    routers/
      content.py   GET /api/content (public, read-only)
      chat.py      POST /api/chat (streaming AI chat)
      admin.py     PUT /api/admin/content (protected)
  data/
    content.json   Portfolio content (single source of truth)
    graph.json     Knowledge graph nodes and edges
  admin_dist/      Admin SPA (served at /admin)
```

## Features

- **Cinematic boot sequence** — terminal text streams token-by-token while
  the knowledge graph ignites in the background
- **Knowledge graph wallpaper** — live animated force-directed graph (47 nodes,
  60+ edges) showing skills, companies, projects as glowing emerald nodes
- **Floating OS windows** — draggable windows for each section (experience,
  projects, skills, achievements, contact)
- **JARVIS AI chatbot** — conversational AI that knows everything about you,
  streams responses token-by-token, and can open relevant windows
- **One-click contact** — WhatsApp (wa.me), mailto, LinkedIn, GitHub — zero friction
- **Mobile responsive** — full-screen panels with bottom dock on phones
- **Admin screen** — edit content at /admin without touching code
- **Dark theme** with emerald green (#10b981) accent, swappable via CSS variable

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build    # generates static export in `out/`
# Deploy via Vercel CLI or connect GitHub repo
```

### Backend → Railway / Render / Fly.io

```bash
# Example with Railway
cd backend
railway init
railway up

# Set env vars in Railway dashboard:
# ADMIN_SECRET=your-secret
# OPENAI_API_KEY=sk-...  (optional)
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Backend URL for frontend (e.g. `https://your-api.railway.app`) |
| `ADMIN_SECRET` | No | Admin auth token (default: `change-me-in-production`) |
| `OPENAI_API_KEY` | No | OpenAI API key for real AI chat (falls back to mock) |
| `OPENAI_MODEL` | No | Model to use (default: `gpt-4o-mini`) |

## Editing Content

See [CONTENT.md](CONTENT.md) for the full guide on adding projects,
experience, certifications, and graph nodes.
