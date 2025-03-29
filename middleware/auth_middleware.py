from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps

def auth_required(fn):
    """Decorator to protect routes with JWT authentication."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": f"Unauthorized access"}), 401
    return wrapper

def get_current_user():
    """Get the currently authenticated user."""
    user_identity = get_jwt_identity()
    return user_identity

