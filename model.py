from database import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=False, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # 'user' or 'admin'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Quiz(db.Model):
    __tablename__ = "quizzes"
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, nullable=False)  # Admin who created the quiz
    topic = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    positive_mark = db.Column(db.Float, nullable=False)
    negative_mark = db.Column(db.Float, nullable=False)
    auto_generated = db.Column(db.Boolean, nullable=False, default=False)

    questions = db.relationship("Question", backref="quiz", cascade="all, delete-orphan")

class Question(db.Model):
    __tablename__ = "questions"
    
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    option1 = db.Column(db.String(255), nullable=False)
    option2 = db.Column(db.String(255), nullable=False)
    option3 = db.Column(db.String(255), nullable=False)
    option4 = db.Column(db.String(255), nullable=False)
    correct_answer = db.Column(db.String(255), nullable=False)  # Store correct option as text


class UserAttempt(db.Model):
    __tablename__ = "user_attempts"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    score_percentage = db.Column(db.Float, nullable=True)  # Will be updated after submission
    time_taken = db.Column(db.Float, nullable=True)  # Time in seconds
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # Time when quiz was submitted

class GlobalLeaderboard(db.Model):
    __tablename__ = "global_leaderboard"

    id = db.Column(db.Integer, primary_key=True)
    leaderboard_data = db.Column(db.JSON, nullable=False)  # Store computed leaderboard
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)