from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required
from datetime import timedelta
from database import db
from model import User
from auth.utils import logout_user, create_new_user

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email') 
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        response = create_new_user(email,username,password)
        if response[0] == False:
            return jsonify({"error": response[1]}), 500
        else:
            return jsonify({"message": response[1]}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email_or_username = data.get("email") 
    password = data.get("password")

    if not email_or_username or not password:
        return jsonify({"error": "Missing email/username or password"}), 400

    # Fetch user from DB
    user = User.query.filter(
        (User.email == email_or_username) 
    ).first()

    session["user_id"] = user.id
    session["username"] = user.username
    session["email"] = user.email
    session["role"] = user.role

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT token
    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))

    return jsonify({"message": "Login successful",
        "token": access_token,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }), 200

@auth_blueprint.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return logout_user()