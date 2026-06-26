import os
from dotenv import load_dotenv
from schema import AssessmentOutput
from prompt import SYSTEM_PROMPT

# Attempt to load ADK or generic AI dependencies
# For this scaffold, we'll implement a robust wrapper using google-genai
# If the google-adk package is strictly required by the environment, 
# this workflow file can be swapped to use adk specific imports.

from google import genai
from google.genai import types

load_dotenv()

class GasLeakAgent:
    def __init__(self):
        # Initialize the GenAI client. It will automatically pick up GEMINI_API_KEY from environment.
        self.client = genai.Client()
        self.model_name = "gemini-2.5-pro" # Highly capable model for strict schema adherence

    def process_incident(self, user_description: str, language: str = "English", model_override: str = None, temperature_override: float = None) -> AssessmentOutput:
        """
        Process the user's gas leak incident description and return a structured assessment.
        """
        # Configure the request to strictly output the Pydantic schema
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=AssessmentOutput,
            temperature=temperature_override if temperature_override is not None else 0.1, 
        )

        try:
            prompt = f"User Request: {user_description}\nTranslate the response into: {language}"
            response = self.client.models.generate_content(
                model=model_override if model_override else self.model_name,
                contents=prompt,
                config=config
            )
            
            # The response text will be a JSON string that matches the AssessmentOutput schema
            # We parse it directly using Pydantic's model_validate_json
            assessment = AssessmentOutput.model_validate_json(response.text)
            return assessment

        except Exception as e:
            # Fallback for critical errors ensuring safety advice is always provided if API fails
            print(f"Error during agent invocation: {e}")
            return AssessmentOutput(
                risk_level="CRITICAL",
                reason="System failed to process the request, but assuming highest risk out of an abundance of caution.",
                immediate_actions=[
                    "Evacuate the area immediately if you suspect a gas leak.",
                    "Do not use electrical switches or devices.",
                    "Call emergency services or your gas provider from outside."
                ],
                incident_summary=f"Unprocessed description due to system error: {user_description[:50]}..."
            )
