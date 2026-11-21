from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import func
from ..utils.responses import success, error
from .. import db
from ..models.user import User

auth_bp = Blueprint('auth', __name__)

def serialize_user(user):
    return {'id': user.id, 'email': user.email, 'full_name': user.full_name, 'role': user.role}

@auth_bp.post('/register')
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get('full_name', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    password = data.get('password', '')
    if len(name) < 2 or '@' not in email or not isinstance(password, str) or len(password) < 8:
        return error('Enter your name, a valid email, and a password of at least 8 characters.', 400)
    if User.query.filter(func.lower(User.email) == email).first():
        return error('Email already registered', 409)
    user = User(full_name=name, email=email, role='user')
    user.set_password(password)
    db.session.add(user); db.session.commit()
    return success(serialize_user(user), 'Account created'), 201

@auth_bp.post('/login')
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get('email', '')).strip().lower()
    user = User.query.filter(func.lower(User.email) == email).first()
    if not user or not user.check_password(data.get('password', '')):
        return error('Invalid email or password', 401)
    token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
    return success({'access_token': token, 'user': serialize_user(user)})

@auth_bp.post('/logout')
@jwt_required()
def logout():
    return success(message='Logged out')

@auth_bp.get('/me')
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    if not user: return error('User not found', 404)
    return success(serialize_user(user))
