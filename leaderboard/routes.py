from flask import Blueprint, jsonify, session
from middleware.auth_middleware import auth_required, get_current_user
from leaderboard.utils import update_global_leaderboard, fetch_global_leaderboard

leaderboard_blueprint = Blueprint('leaderboard', __name__, url_prefix='/api/leaderboard')

@leaderboard_blueprint.route("/global/update", methods=["GET"])
@auth_required
def admin_fetch_global_leaderboard():
    """Admin fetches & recalculate the global leader board"""

    current_user_role = session.get("role")
    if current_user_role != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    leaderboard,updated_at = update_global_leaderboard()
    return jsonify({"leaderboard": leaderboard, "message" : "Leaderboard updated successfully !", "updated_at" : updated_at}), 200


@leaderboard_blueprint.route("/global", methods=["GET"])
@auth_required
def get_global_leaderboard():
    """Fetches the global leader board"""

    leaderboard,updated_at = fetch_global_leaderboard()
    if leaderboard == []:
        return jsonify({"error": "No leaderboard data found"}), 404
    return jsonify({"leaderboard": leaderboard, "updated_at": updated_at}), 200