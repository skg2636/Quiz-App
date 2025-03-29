import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_CONNECTION_STRING", "postgresql://user:password@localhost/quiz_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
