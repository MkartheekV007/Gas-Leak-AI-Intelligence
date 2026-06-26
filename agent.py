import os
import sys

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: The 'google-genai' library is not installed.")
    print("Please install it by running: pip install google-genai")
    sys.exit(1)

# Define the system prompt for the Gas Leak Safety Assistant
SYSTEM_PROMPT = """You are the Gas Leak Safety Assistant.
Your purpose is to help users assess gas leak incidents and provide safety recommendations.
You must use simple language suitable for households and rural communities.

When a user describes a possible gas leak situation, you must:
1. Determine the risk level: Low, Medium, or High.
2. Explain the reason for the risk level.
3. Provide immediate safety actions.
4. Generate an incident summary.

Format your response EXACTLY like the following example:

Risk Level: High

Reason:
Possible active LPG gas leak.

Immediate Actions:
- Turn off gas supply.
- Open windows and doors.
- Avoid electrical switches.
- Do not use flames.

Incident Summary:
Potential gas leak reported in kitchen area requiring immediate attention.
"""

def analyze_situation(description: str) -> str:
    # Initialize the client. It automatically picks up the GEMINI_API_KEY environment variable.
    try:
        client = genai.Client()
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=description,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.2, # Low temperature for more consistent, factual responses
            )
        )
        return response.text
    except Exception as e:
        return f"Error: Could not process the request. Please ensure GEMINI_API_KEY is set in your environment. Details: {e}"

def main():
    print("========================================")
    print("   Gas Leak Safety Assistant (AI Agent) ")
    print("========================================")
    print("Describe the possible gas leak situation.")
    print("For example: 'I smell LPG gas near my kitchen and hear a hissing sound.'")
    print("Type 'quit' or 'exit' to stop.")
    print("========================================\n")
    
    while True:
        try:
            user_input = input("Situation Description: ")
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Stay safe! Exiting...")
                break
            if not user_input.strip():
                continue
                
            print("\n[Analyzing situation...]")
            result = analyze_situation(user_input)
            print("\n--- Assessment & Recommendations ---")
            print(result)
            print("------------------------------------\n")
            
        except KeyboardInterrupt:
            print("\nStay safe! Exiting...")
            break
        except EOFError:
            break

if __name__ == "__main__":
    main()
