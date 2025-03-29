from model import db, User, UserAttempt, Quiz, GlobalLeaderboard
from sqlalchemy import func

def calculate_glocal_score(user_id):
    """Calcuate the global leaderboard score for a user"""

    user_attempts = db.session.query(
        func.sum(UserAttempt.score_percentage).label("total_score"),
        func.sum(UserAttempt.id).label("quizzes_attempted"),
        func.avg(UserAttempt.time_taken).label("avg_time"),
        func.max(UserAttempt.score_percentage).label("highest_score"),
        func.count(func.nullif(Quiz.difficulty != "Easy", True)).label("easy_quizzes"),
        func.count(func.nullif(Quiz.difficulty != "Medium", True)).label("medium_quizzes"),
        func.count(func.nullif(Quiz.difficulty != "Hard", True)).label("hard_quizzes")
    ).join(Quiz, UserAttempt.quiz_id == Quiz.id).filter(UserAttempt.user_id == user_id).first()

    if not user_attempts or user_attempts.total_score is None:
        return 0
    
    total_score = user_attempts.total_score
    quizzes_attempted = user_attempts.quizzes_attempted
    avg_time = user_attempts.avg_time or 0
    highest_score = user_attempts.highest_score or 0
    easy_quizzes = user_attempts.easy_quizzes or 0
    medium_quizzes = user_attempts.medium_quizzes or 0
    hard_quizzes = user_attempts.hard_quizzes or 0

    global_score = (
        (total_score *0.5) +
        (quizzes_attempted * 10) + 
        (easy_quizzes *5) + 
        (medium_quizzes * 10) +
        (hard_quizzes * 20) +
        ((100-avg_time) * 0.05) +
        (highest_score * 0.1)
    )

    return round(global_score, 2)

def update_global_leaderboard():
    """Update the global leaderboard with the latest scores"""
    users = User.query.all()
    leaderboard = []

    for user in users:
        score = calculate_glocal_score(user.id)
        leaderboard.append({
            "user_id" : user.id,
            "username": user.username,
            "score": score
        })
    

    leaderboard.sort(key=lambda x: x["score"], reverse=True)

    # clear previous leaderboard data
    db.session.query(GlobalLeaderboard).delete()

    # store noew leaderboard data
    new_entry = GlobalLeaderboard(leaderboard_data=leaderboard)
    db.session.add(new_entry)
    db.session.commit()
    

    return leaderboard, new_entry.updated_at

def fetch_global_leaderboard():
    """Fetch the global leaderboard from the database"""
    leaderboard_entry = GlobalLeaderboard.query.first()

    if leaderboard_entry:
        return leaderboard_entry.leaderboard_data, leaderboard_entry.updated_at
    else:
        return []