"""
Chat API endpoint. Streams LLM responses with visual commands.
Requires OPENAI_API_KEY env var for real responses; falls back to mock otherwise.
"""
import json
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
CONTENT_FILE = DATA_DIR / "content.json"


class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None


def _load_content() -> dict:
    with open(CONTENT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _build_system_prompt(content: dict) -> str:
    return f"""You are JARVIS — Deshant Singh Bani's personal AI agent embedded in his portfolio website.
You know everything about Deshant. You are confident, articulate, and slightly witty.
Speak in first person about Deshant as "Deshant" or "he" — you are his agent, not him.

When relevant, include a JSON command on a NEW LINE at the end of your response to trigger UI actions:
- To show experience: {{"action": "open_window", "window": "experience.log"}}
- To show projects: {{"action": "open_window", "window": "projects.exe"}}
- To show skills: {{"action": "open_window", "window": "skills.sys"}}
- To show achievements: {{"action": "open_window", "window": "achievements.dat"}}
- To show contact: {{"action": "open_window", "window": "comms.link"}}
- To highlight a graph node: {{"action": "highlight_node", "nodeId": "infogain"}}

Only include ONE action per response if relevant. Not every response needs an action.

Here is everything you know about Deshant:

NAME: {content['about']['name']}
HEADLINE: {content['about']['headline']}
BIO: {content['about']['bio']}
EDUCATION: {content['about']['education']['degree']} at {content['about']['education']['institution']} ({content['about']['education']['startDate']} - {content['about']['education']['endDate']})
QUOTE: {content['about']['quote']}

EXPERIENCE:
{json.dumps(content['experience'], indent=2)}

PROJECTS:
{json.dumps(content['projects'], indent=2)}

SKILLS/TECHNOLOGIES:
{json.dumps(content['technologies'], indent=2)}

ACHIEVEMENTS:
{json.dumps(content['achievements'], indent=2)}

CONTACT:
Email: {content['contact']['email']}
Phone: {content['contact']['phone']}
GitHub: {content['contact']['github']}
LinkedIn: {content['contact']['linkedin']}
WhatsApp: https://wa.me/91{content['contact']['phone']}

Keep responses concise (2-4 sentences) unless asked for detail. Be impressive but not boastful."""


async def _stream_openai(message: str, history: list[dict] | None, content: dict):
    """Stream from OpenAI API."""
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

        messages = [{"role": "system", "content": _build_system_prompt(content)}]
        if history:
            messages.extend(history[-10:])
        messages.append({"role": "user", "content": message})

        stream = await client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=messages,
            stream=True,
            max_tokens=500,
            temperature=0.7,
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {json.dumps({'token': chunk.choices[0].delta.content})}\n\n"

        yield "data: {\"done\": true}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'token': f'[Error: {str(e)}]'})}\n\n"
        yield "data: {\"done\": true}\n\n"


async def _stream_mock(message: str, content: dict):
    """Mock streaming for when no API key is set."""
    import asyncio
    msg_lower = message.lower()

    if any(w in msg_lower for w in ["experience", "work", "job", "intern", "company"]):
        response = (
            f"Deshant has worked at 4 companies — most recently at Infogain as an AI/ML Intern "
            f"in their Data & AI Studio, where he presented AI POCs to enterprise clients including "
            f"Microsoft and Hyundai North America. Before that, he was at CaRPM, Jio Platforms, "
            f"and C&S Electric — all building production AI systems.\n"
            f'{{"action": "open_window", "window": "experience.log"}}'
        )
    elif any(w in msg_lower for w in ["project", "built", "build", "portfolio"]):
        response = (
            f"His standout project is a Phishing URL Detection System — a high-throughput model "
            f"processing 100k+ URLs per batch at 1k predictions/min with ~40% inference time "
            f"reduction, deployed via CI/CD with Docker, AWS, Airflow, and Terraform.\n"
            f'{{"action": "open_window", "window": "projects.exe"}}'
        )
    elif any(w in msg_lower for w in ["skill", "tech", "stack", "tool", "know"]):
        response = (
            f"Deshant's core stack revolves around Gen AI and agentic systems — LangGraph, "
            f"LangChain, OpenAI, FastMCP, AutoGen. On the infra side: FastAPI, Docker, AWS, "
            f"GitHub Actions. And for data: PyTorch, ChromaDB, PostgreSQL, Neo4j.\n"
            f'{{"action": "open_window", "window": "skills.sys"}}'
        )
    elif any(w in msg_lower for w in ["contact", "hire", "reach", "email", "whatsapp", "connect"]):
        response = (
            f"Absolutely — Deshant is open to opportunities. You can reach him directly:\n"
            f"WhatsApp (one click), email at deshantbani@gmail.com, or LinkedIn. "
            f"All links are in the comms panel.\n"
            f'{{"action": "open_window", "window": "comms.link"}}'
        )
    elif any(w in msg_lower for w in ["tour", "show", "everything", "about"]):
        response = (
            f"Welcome! Deshant is an AI/ML Engineer specializing in agentic AI systems "
            f"and LLM-powered products. He's delivered AI POCs to Fortune 500 clients, "
            f"built multi-agent recruitment systems, SOC2 audit platforms, and more. "
            f"Feel free to explore the windows in the dock below, or ask me anything specific."
        )
    elif any(w in msg_lower for w in ["hello", "hi", "hey", "sup"]):
        response = (
            f"Hey there! I'm JARVIS — Deshant's AI agent. I know everything about his work, "
            f"skills, and projects. Ask me anything, or say 'give me the tour.' "
            f"You can also explore the dock icons below."
        )
    elif any(w in msg_lower for w in ["cert", "achiev", "award"]):
        response = (
            f"Deshant holds NVIDIA certifications in Accelerated Computing with CUDA Python "
            f"and Transformer-Based NLP Applications. He was also an AIML Core Team Member "
            f"at Google Developers Group OnCampus IIITN.\n"
            f'{{"action": "open_window", "window": "achievements.dat"}}'
        )
    else:
        response = (
            f"Deshant is an AI/ML Engineer who builds production-ready agentic AI systems. "
            f"He's worked with Fortune 500 clients, built multi-agent frameworks, RAG pipelines, "
            f"and compliance automation tools. What specifically would you like to know about?"
        )

    for char in response:
        yield f"data: {json.dumps({'token': char})}\n\n"
        await asyncio.sleep(0.01)

    yield "data: {\"done\": true}\n\n"


@router.post("/chat")
async def chat(req: ChatRequest):
    content = _load_content()

    if os.environ.get("OPENAI_API_KEY"):
        return StreamingResponse(
            _stream_openai(req.message, req.history, content),
            media_type="text/event-stream",
        )
    else:
        return StreamingResponse(
            _stream_mock(req.message, content),
            media_type="text/event-stream",
        )
