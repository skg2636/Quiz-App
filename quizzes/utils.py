from model import db, Quiz, Question, UserAttempt
import random

def store_quiz_to_db(user_id, questions, positive, negative, topic, difficulty, auto_generated=False):
    """Stores a quiz and its questions into the database."""
    try:
        # Create a new quiz instance
        new_quiz = Quiz(admin_id=user_id, positive_mark=positive, negative_mark=negative, topic=topic, difficulty=difficulty,auto_generated=auto_generated )
        db.session.add(new_quiz)
        db.session.flush()  # Flush to get the quiz ID before committing

        # Insert questions linked to this quiz
        for q in questions:
            new_question = Question(
                quiz_id=new_quiz.id,
                question_text=q["question"],
                option1=q["options"][0],
                option2=q["options"][1],
                option3=q["options"][2],
                option4=q["options"][3],
                correct_answer=q["correct_answer"]
            )
            db.session.add(new_question)

        # Commit changes to the database
        db.session.commit()

        return True

    except Exception as e:
        print("Error storing quiz: ",e)
        db.session.rollback()
        return False
    
def generate_random_quiz_for_user(user_id, topic, difficulty):
    """Fetch random quiz which user has not attempted based on difficulty and topic"""
    try:
    # Get Quizzes that user has NOT attempted
        attemped_quiz_ids = (
            db.session.query(UserAttempt.quiz_id)
            .filter(UserAttempt.user_id == user_id)
            .subquery()
        )

        available_quizzes = (
            Quiz.query.filter(
                Quiz.topic == topic,
                Quiz.difficulty == difficulty,
                ~Quiz.id.in_(db.session.query(attemped_quiz_ids.c.quiz_id))
            ).all()
        )

        if not available_quizzes:
            return None
        
        selected_quiz = random.choice(available_quizzes)

        questions = [
            {
                "id" : q.id,
                "question": q.question_text,
                "options": [q.option1, q.option2, q.option3, q.option4],
            }
            for q in selected_quiz.questions
        ]

        return questions, selected_quiz.id

    except Exception as e:
        print("Error generating quiz: ", e)
        return None


def generate_score_for_quizz(quiz_id,user_id,answers,time_taken):
    """ Generate Score for a quiz"""
    try:
        # check if user alraedy attempted the quiz
        existing_attempt = UserAttempt.query.filter_by(user_id=user_id,quiz_id=quiz_id).first()
        if existing_attempt:
            return False,"You have already attempted this quiz"
        
        #Fetch the quiz detail
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return False,"Quiz not found"
        
        # Fetch all correct answers
        question = Question.query.filter_by(quiz_id=quiz_id).all()
        correct_answers = {q.id : q.correct_answer for q in question}

        # Calculate score
        total_question = len(question)
        correct_answers_count = 0

        for answer in answers:
            question_id = answer['question_id']
            selected_answer = answer['answer']
            if selected_answer == None:
                continue
            if correct_answers.get(int(question_id)) == selected_answer:
                correct_answers_count += quiz.positive_mark
            else:
                correct_answers_count += quiz.negative_mark

        percentage = round((correct_answers_count / (total_question * quiz.positive_mark)) * 100, 2)

        # Store the attempt in database
        new_attempt = UserAttempt(user_id=user_id, quiz_id=quiz_id,score_percentage=percentage,time_taken=time_taken)

        db.session.add(new_attempt)
        db.session.commit()

        return True, percentage

    except Exception as e:
        print("Error generating score: ", e)
        return False, "Error generating score"

def fetch_past_attempts(user_id,quiz_id=None):
    """ Fetch past attempts for a user """
    try:
        query = UserAttempt.query.filter_by(user_id=user_id)

        if quiz_id:
            query = query.filter_by(quiz_id=quiz_id)

        
        attempts = query.order_by(UserAttempt.submitted_at.desc()).all()
        if not attempts:
            return None
        
        past_attempts = [
            {
                "quiz_id": attempt.quiz_id,
                "score_percentage": attempt.score_percentage,
                "time_taken": attempt.time_taken,
                "topic": Quiz.query.get(attempt.quiz_id).topic,
                "difficulty": Quiz.query.get(attempt.quiz_id).difficulty,
                "submitted_at": attempt.submitted_at
            }
            for attempt in attempts
        ]

        return past_attempts

    except Exception as e:
        print("Error fetching past attempts: ", e)
        return None
    
        

