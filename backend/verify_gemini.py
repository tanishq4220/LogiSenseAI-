import os
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

print("--- DIAGNOSTIC SCRIPT START ---")

# 1. Load the .env file
load_dotenv()

# 2. Get the KEY
api_key = os.getenv("GEMINI_API_KEY")

print("1. KEY CHECK:")
print(f"Loaded Key: {api_key}")

if not api_key:
    print("[ERROR] .env is NOT loading or GEMINI_API_KEY is missing.")
    exit(1)

if api_key != "AIzaSyD9VgyHC2IEyahGVRr2ZvMC8nzBlQIM0jk":
    print("[ERROR] Stale key detected! It doesn't match the new one.")
else:
    print("[SUCCESS] Key exactly matches the new key you provided.")

print("\n2. SENDING REQUEST (using gemini-1.5-flash)...")
try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Hello, just a test."
    )
    print("[SUCCESS] Response from Google:")
    print(response.text)
except APIError as e:
    print("[API ERROR] REQUEST FAILED with API Error from Google:")
    print(f"Code: {e.code}")
    print(f"Message: {e.message}")
except Exception as e:
    print("[ERROR] REQUEST FAILED with generic Error:")
    print(e)

print("--- DIAGNOSTIC SCRIPT END ---")
