import google.generativeai as genai
import os
import json
import re


# Get API key from environment variable
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

# Configure the Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

MODEL_NAME = "gemini-1.5-flash"  # Try using "gemini-1.5-flash"

# Initialize the model
model = genai.GenerativeModel(MODEL_NAME)

def clean_json_response(response_text):
    """
    Cleans the response text by removing markdown-like formatting.
    """
    # Remove leading/trailing whitespace
    cleaned_text = response_text.strip()

    # Remove markdown-style JSON block (```json ... ```)
    cleaned_text = re.sub(r"```json\s*([\s\S]*?)\s*```", r"\1", cleaned_text)

    return cleaned_text


def get_gemini_response(prompt):
    """
    Get response from Gemini model, attempt to parse JSON if present.
    Args:
        prompt (str): Input prompt for the model
    Returns:
        Union[str, dict]: Model response as string or parsed JSON as dict.
    """
    try:
        response = model.generate_content(prompt)
        response_text = clean_json_response(response.text)
        # response_text = """
        # [\n  {\n    "question": "What is the chemical symbol for water?",\n    "options": ["CO2", "H2O", "NaCl", "O2"],\n    "correct_answer": "H2O"\n  },\n  {\n    "question": "Which planet is known as the \'Red Planet\'?",\n    "options": ["Jupiter", "Mars", "Venus", "Saturn"],\n    "correct_answer": "Mars"\n  },\n  {\n    "question": "What is the largest planet in our solar system?",\n    "options": ["Earth", "Mars", "Jupiter", "Saturn"],\n    "correct_answer": "Jupiter"\n  },\n  {\n    "question": "What does DNA stand for?",\n    "options": ["Digital Nucleic Acid", "Deoxyribonucleic Acid", "Dioxide Nitrate Acid", "Double Nucleic Acid"],\n    "correct_answer": "Deoxyribonucleic Acid"\n  },\n  {\n    "question": "What is the name of Earth\'s natural satellite?",\n    "options": ["Sun", "Mars", "Venus", "Moon"],\n    "correct_answer": "Moon"\n  },\n  {\n    "question": "What is the force that pulls objects towards the center of the Earth?",\n    "options": ["Friction", "Gravity", "Pressure", "Magnetism"],\n    "correct_answer": "Gravity"\n  },\n  {\n    "question": "Which of these is NOT a state of matter?",\n    "options": ["Solid", "Liquid", "Gas", "Plasma", "Energy"],\n    "correct_answer": "Energy"\n  },\n  {\n    "question": "What is the process by which plants convert sunlight into energy?",\n    "options": ["Respiration", "Photosynthesis", "Evaporation", "Condensation"],\n    "correct_answer": "Photosynthesis"\n  },\n  {\n    "question": "What is the basic unit of heredity?",\n    "options": ["Atom", "Cell", "Gene", "Protein"],\n    "correct_answer": "Gene"\n  },\n  {\n    "question": "Which of these is a renewable energy source?",\n    "options": ["Coal", "Oil", "Natural Gas", "Solar Power"],\n    "correct_answer": "Solar Power"\n  }\n]
        # """

        # Attempt to parse JSON
        try:
          parsed_json = json.loads(response_text)
          return parsed_json
        except json.JSONDecodeError:
          # If not valid JSON, return the raw text
          return response_text

    except Exception as e:
        return f"Error getting response from Gemini: {str(e)}"