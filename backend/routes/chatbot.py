from fastapi import APIRouter
from pydantic import BaseModel
import anthropic, os  # OR use openai

router = APIRouter()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", "dummy_key"))

SYSTEM_PROMPT = """You are AMRITKRISHI AI, an expert agricultural assistant for Indian farmers.
You help farmers with:
- Crop selection and farming advice
- Plant disease diagnosis and treatment
- Weather-based farming decisions
- Government schemes and subsidies
- Market prices and selling strategies

Always respond in the same language the farmer uses (Tamil, Hindi, or English).
Keep responses simple, practical, and actionable. Use bullet points.
When responding in Tamil, use clear modern Tamil.
Always end with an encouraging message for the farmer."""

class ChatMessage(BaseModel):
    message: str
    language: str = "en"
    history: list = []

@router.post("/chatbot")
def chat(data: ChatMessage):
    messages = data.history + [{"role": "user", "content": data.message}]
    
    # Check for empty mock auth
    if os.getenv("ANTHROPIC_API_KEY") is None:
        return {
            "reply": "This is a mock response because no Anthropic API key was found.",
            "usage": 0
        }

    try:
        response = client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        return {
            "reply": response.content[0].text,
            "usage": response.usage.output_tokens
        }
    except Exception as e:
        return {"error": str(e)}
