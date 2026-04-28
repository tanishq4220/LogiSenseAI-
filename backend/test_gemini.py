import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# The environment variable NAME is "GEMINI_API_KEY"
# os.getenv() takes the NAME of the variable, not the value.
api_key = os.getenv("GEMINI_API_KEY")
print("KEY LOADED FROM .ENV:", api_key)

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

try:
    print("\nSending request to Gemini...")
    response = model.generate_content("Hello")
    print("\nSUCCESS! Response:")
    print(response.text)
except Exception as e:
    print("\nFAILED! Error from Google:")
    print(e)
