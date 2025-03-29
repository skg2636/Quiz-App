from flask import Flask
from flask_cors import CORS
from config import Config
from database import db
from auth.routes import auth_blueprint
from quizzes.routes import quiz_blueprint
from leaderboard.routes import leaderboard_blueprint
from auth.utils import init_jwt
import os
import logging

# Configure logging
# Create logs directory if it doesn't exist
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

app = Flask(__name__)
app.config.from_object(Config)

# Initialize database
db.init_app(app)
init_jwt(app)

# Enable CORS
allowed_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = allowed_origins.split(",")
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# Register blueprints
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
app.register_blueprint(quiz_blueprint, url_prefix='/api/quizzes')
app.register_blueprint(leaderboard_blueprint, url_prefix='/api/leaderboard')

if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG', False))
