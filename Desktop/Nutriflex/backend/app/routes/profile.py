from flask import Blueprint, request, jsonify
from ..utils.responses import success, error
from .. import db
from ..models.user_profile import UserProfile
from ..models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

profile_bp = Blueprint('profile', __name__)

# Helper to get current user object
def _get_current_user():
    identity = get_jwt_identity()
    if not identity:
        return None
    return User.query.get(int(identity))

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user = _get_current_user()
    if not user:
        return error('User not found', 404)
    profile = user.profile
    if not profile:
        return error('Profile not found', 404)
    data = {
        "age": profile.age,
        "gender": profile.gender,
        "height_cm": profile.height_cm,
        "weight_kg": profile.weight_kg,
        "dietary_preference": profile.dietary_preference,
        "activity_level": profile.activity_level,
        "goals": profile.goals,
        "allergies": profile.allergies,
        "food_restrictions": profile.food_restrictions,
        "disliked_foods": profile.disliked_foods,
    }
    return success(data), 200

@profile_bp.route('/', methods=['POST'])
@jwt_required()
def create_profile():
    user = _get_current_user()
    if not user:
        return error('User not found', 404)
    if user.profile:
        return error('Profile already exists', 400)
    data = request.get_json() or {}
    # Basic validation – required fields for step 1
    required = ['full_name', 'age', 'gender', 'height_cm', 'weight_kg']
    # full_name is stored on User model, not profile; we allow updating it here for convenience
    missing = [f for f in required if data.get(f) is None]
    if missing:
        return error(f"Missing required fields: {', '.join(missing)}", 400)
    # Update user full name if provided
    user.full_name = data.get('full_name')
    profile = UserProfile(
        user_id=user.id,
        age=data.get('age'),
        gender=data.get('gender'),
        height_cm=data.get('height_cm'),
        weight_kg=data.get('weight_kg'),
        dietary_preference=data.get('dietary_preference'),
        activity_level=data.get('activity_level'),
        goals=data.get('goals'),
        allergies=data.get('allergies'),
        food_restrictions=data.get('food_restrictions'),
        disliked_foods=data.get('disliked_foods'),
    )
    db.session.add(profile)
    db.session.commit()
    return success(message='Profile created'), 201

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    user = _get_current_user()
    if not user:
        return error('User not found', 404)
    profile = user.profile
    if not profile:
        return error('Profile not found', 404)
    data = request.get_json() or {}
    # Update allowed fields only
    for field in ['age', 'gender', 'height_cm', 'weight_kg', 'dietary_preference', 'activity_level', 'goals', 'allergies', 'food_restrictions', 'disliked_foods']:
        if field in data:
            setattr(profile, field, data[field])
    if 'full_name' in data:
        user.full_name = data['full_name']
    db.session.commit()
    return success(message='Profile updated'), 200
