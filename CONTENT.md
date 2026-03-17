# Content Editing Guide

All portfolio content lives in JSON files. You can edit them either via the
**admin screen** (`/admin` on the backend) or directly in the repo.

## Files

| File | What it controls |
|------|-----------------|
| `backend/data/content.json` | All portfolio sections: about, experience, projects, achievements, technologies, contact |
| `backend/data/graph.json` | Knowledge graph wallpaper nodes and edges |
| `frontend/data/content.json` | Static copy for frontend build (copy from backend after edits) |
| `frontend/data/graph.json` | Static copy for frontend build (copy from backend after edits) |

## Adding a new project

In `content.json`, add an object to the `projects` array:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "description": "A short description of what this project does.",
  "metrics": ["95% accuracy", "sub-100ms latency"],
  "stack": ["FastAPI", "LangGraph", "React"],
  "repoUrl": "https://github.com/DeshantBani/my-project",
  "demoUrl": "https://my-project.vercel.app",
  "imageUrl": null,
  "featured": true,
  "date": "Mar 2026"
}
```

## Adding experience

Add an object to the `experience` array:

```json
{
  "id": "company-slug",
  "company": "Company Name",
  "role": "Your Role",
  "location": "City",
  "startDate": "Jan 2026",
  "endDate": "Present",
  "bullets": [
    "Achievement with metric...",
    "Another achievement..."
  ],
  "techTags": ["LangGraph", "FastAPI"]
}
```

## Adding a certification or POR

In `achievements`:

```json
{
  "name": "Certification Name",
  "year": "2026",
  "url": "https://link-to-cert"
}
```

## Adding a graph node

In `graph.json`, add a node and relevant edges:

```json
// Node
{ "id": "new-skill", "label": "New Skill", "group": "skill", "size": 3 }

// Edge (connect to related nodes)
{ "source": "deshant", "target": "new-skill" }
```

**Node groups:** `center`, `company`, `skill`, `project`, `cert`, `education`

## Using the admin screen

1. Start the backend: `cd backend && uvicorn app.main:app --reload`
2. Open `http://localhost:8000/admin`
3. Enter your `ADMIN_SECRET` (default: `change-me-in-production`)
4. Edit any section's JSON and click Save
5. After saving via admin, copy updated files to frontend if using static build:
   ```
   cp backend/data/content.json frontend/data/content.json
   cp backend/data/graph.json frontend/data/graph.json
   ```
