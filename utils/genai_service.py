
from utils.gemini import gemini_call

def generate_questions(difficulty,topic):
    try:
        prompt = f"""
        Generate ten trivia questions with 4 options and one correct answere.
        The topic of the trivia will be {topic}.
        Make sure there are only 4 options out of which only one is correct.
        The difficulty level will be {difficulty}.
        The response should be in string which can parsed to JSON format with the following keys:
        - question: The question text
        - options: A list of four possible answers
        - correct_answer: The correct answer
        """

        questions = gemini_call.get_gemini_response(prompt)
        return questions
    except Exception as e:
        print(f"Error generating questions: {e}")
