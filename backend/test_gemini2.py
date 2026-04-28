from google import genai
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# We must use the variable NAME "GEMINI_API_KEY", not the value itself.
api_key = os.getenv("GEMINI_API_KEY")
print("KEY LOADED FROM .ENV:", api_key)

client = genai.Client(api_key=api_key)

try:
    print("\nSending request to Gemini...")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Hello"
    )
    print("\nSUCCESS! Response:")
    print(response.text)
except Exception as e:
    print("\nFAILED! Error from Google:")
    print(e)
