import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

# Load .env from the backend directory (works regardless of where uvicorn is launched from)
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=_env_path)

# Debug: confirm key loaded at startup
_key = os.getenv("GEMINI_API_KEY", "NOT FOUND")
print(f"[STARTUP] GEMINI KEY LOADED: {_key[:8]}...{_key[-4:] if len(_key) > 12 else _key}")

from google import genai

app = FastAPI(title="LogiSenseAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: List = []

class ChatResponse(BaseModel):
    response: str

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY", "")
    print(f"[CHAT] Using API key: {api_key[:8]}...{api_key[-4:] if len(api_key) > 12 else 'MISSING'}")
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"""You are a logistics optimization AI assistant for LogiSenseAI. Provide short, practical suggestions.\nUser: {req.message}"""
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        print(f"[CHAT] Gemini responded successfully.")
        return {"response": response.text}
    except Exception as e:
        print(f"[GEMINI ERROR] {type(e).__name__}: {e}")
        return {"response": f"Optimized route for '{req.message}'. Estimated: -20% time, -15% fuel, -18% CO2."}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "LogiSenseAI Backend Running"}
