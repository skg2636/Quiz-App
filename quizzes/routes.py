from flask import Blueprint, jsonify, request, current_app
from middleware.auth_middleware import auth_required, get_current_user
from utils.genai_service import generate_questions
from quizzes.utils import store_quiz_to_db, generate_random_quiz_for_user, generate_score_for_quizz, fetch_past_attempts
import threading
import os
from datetime import datetime, timedelta
import time

quiz_blueprint = Blueprint("quiz", __name__, url_prefix='/api/quizzes')
AUTO_GENERATION = False

@quiz_blueprint.route("/protected", methods=["GET"])
@auth_required
def protected_quiz_route():
    """Example protected route to verify authentication."""
    user_id = get_current_user()
    return jsonify({"message": "Welcome to the protected route!", "user_id": user_id}), 200

@quiz_blueprint.route("/create", methods=["POST"])
@auth_required
def create_quiz():
    """Admin initiates quiz creation by providing topic and difficulty."""
    
    current_user_role = getattr(request, "user_role", None)
    if current_user_role != "admin":
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    topic = data.get("topic")
    difficulty = data.get("difficulty")
    custom_prompt = data.get("customPrompt","")

    if not topic or not difficulty:
        return jsonify({"error": "Topic and difficulty are required"}), 400
    
    questions = generate_questions(topic, difficulty,custom_prompt)

    if not questions or len(questions) != 10:
        return jsonify({"error": "Failed to generate quiz questions"}), 500

    return jsonify({"message": "Quiz created successfully", "questions": questions})

@quiz_blueprint.route("/confirm", methods=["POST"])
@auth_required
def get_all_quizzes():
    """Admin confirms the quiz questions and stores the quiz."""
    
    current_user_role = getattr(request, "user_role", None)
    if current_user_role != "admin":
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    questions = data.get("questions")
    positive_mark = data.get("positive_mark")
    negative_mark = data.get("negative_mark")
    topic = data.get("topic")
    difficulty = data.get("difficulty")

    if not questions or not positive_mark or negative_mark == None:
        return jsonify({"error": "Questions, positive_mark, and negative_mark are required"}), 400
    
    user_id = get_current_user()

    result = store_quiz_to_db(user_id, questions, positive_mark, negative_mark, topic, difficulty)

    if result:
        return jsonify({"message": "Quiz stored successfully"}), 201
    else:
        return jsonify({"error": "Failed to store quiz"}), 500
    

@quiz_blueprint.route("/attempt", methods=["GET"])
@auth_required
def get_random_quiz():
    """ Fetch a random quiz for a user based on topic & dificulty"""

    user_id = get_current_user()
    topic = request.args.get("topic")
    difficulty = request.args.get("difficulty")

    if not topic or not difficulty:
        return jsonify({"error": "Topic and difficulty are required"}), 400
    

    questions,quiz_id = generate_random_quiz_for_user(user_id, topic, difficulty)

    return jsonify({
        "quiz_id" : quiz_id,
        "topic" : topic,
        "difficulty" : difficulty,
        "questions" : questions
    }),200

@quiz_blueprint.route("/attempt", methods=["POST"])
@auth_required
def submit_quiz():
    """ Submit a quiz attempt and caculate score"""

    user_id = get_current_user()
    data = request.get_json()

    quiz_id = data.get("quiz_id")
    answers = data.get("answers")
    time_taken = data.get("time_taken")

    if not quiz_id or not answers or not time_taken:
        return jsonify({"error": "Quiz ID, answers, and time taken are required"}), 400
    
    response = generate_score_for_quizz(quiz_id, user_id, answers, time_taken)
    if response[0] == False:
        return jsonify({"error": response[1]}), 500
    return jsonify({"message": "Quiz submitted successfully", "score": response[1]}), 200

@quiz_blueprint.route("/attempts", methods=["GET"])
@auth_required
def get_past_attempts():
    """ Fetch past attempts for a user"""
    user_id = get_current_user()
    quiz_id = request.args.get("quiz_id",type=int) #optional filter
        
    past_attempts = fetch_past_attempts(user_id, quiz_id)
    return jsonify({"past_attempts": past_attempts}), 200
    

@quiz_blueprint.route("/auto_generate", methods=["POST"])
@auth_required
def auto_generate_quizz():
    """Admin initiates auto quiz creation"""
    
    current_user_role = getattr(request, "user_role", None)
    if current_user_role != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    user_id = get_current_user()

    if os.environ.get('QUIZ_AUTO_GENERATION') == "True":
        return jsonify({"error": "Quiz generation already in progress"}), 400
    
    def process_quiz_generation(user_id,app_context):
        with app_context:
            try:
                os.environ['QUIZ_AUTO_GENERATION'] = "True"
                quiz_categories = [
                "general-knowledge",
                "science-technology",
                "history",
                "geography",
                "mathematics",
                "movies-tv",
                "sports",
                "music",
                "literature",
                "brain-teasers"
                 ]
                quiz_difficulty = ["easy","medium","difficult"]
                # Generate for each pair of category and difficulty
                for category in quiz_categories:
                    for difficulty in quiz_difficulty:
                        questions = generate_questions(difficulty, category)
                        
                        positive_mark,negative_mark = 1,0
                        if difficulty == "easy":
                            positive_mark = 1
                            negative_mark = -0.33
                        elif difficulty == "medium":
                            positive_mark = 1
                            negative_mark = -0.25
                        else:
                            positive_mark = 1
                            negative_mark = -0.15
                        response = store_quiz_to_db(user_id,questions,positive_mark,negative_mark,category,difficulty,True)
                        if response:
                            print(f"Quiz stored successfully {category} {difficulty}")
                        else:
                            print(f"Failed to store quiz {category} {difficulty}")
                        print("Will Atempt Next Quiz")

            except Exception as e:
                print(f"Error in quiz generation: {str(e)}")
            finally:
                os.environ['QUIZ_AUTO_GENERATION'] = "False"
    
    app_context = current_app.app_context()
    t = threading.Thread(target=process_quiz_generation,args=(user_id, app_context))
    t.start()

    return jsonify({"success" : "Quiz Generation started"})
