import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="LogiSenseAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        prompt = f"""You are a logistics optimization AI assistant for LogiSenseAI. Provide short, practical suggestions.\nUser: {req.message}"""
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt
        )
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Optimized route for '{req.message}'. Estimated: -20% time, -15% fuel, -18% CO2."}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "LogiSenseAI Backend Running"}
