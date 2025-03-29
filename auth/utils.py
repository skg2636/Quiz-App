from flask_jwt_extended import JWTManager, get_jwt
from flask import jsonify
from model import User
from database import db
from utils.email_service import check_mx_record
import os

jwt = JWTManager()
revoked_tokens = set()

def init_jwt(app):
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    jwt.init_app(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload["jti"] in revoked_tokens

def logout_user():
    """Revoke the current JWT token."""
    jti = get_jwt()["jti"]
    revoked_tokens.add(jti)
    return jsonify({"message": "Successfully logged out"}), 200

def create_new_user(email,username,password):
    try:
        existing_user = User.query.filter(User.email == email).first()
        if existing_user:
            return False , "User already exists"

        # Check if email has MX record
        if not check_mx_record(email):
            return False, "Invalid email"
        
        # Create new user
        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return True,"User Created Successfully"
    except Exception as e:
        return False, str(e)