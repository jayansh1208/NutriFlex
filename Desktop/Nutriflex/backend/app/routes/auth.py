from flask import Blueprint, request, jsonify
from ..utils.responses import success, error
from .. import db
from ..models.user import User, UserProfile
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return error('Invalid JSON', 400)
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    if not all([email, password, full_name]):
        return error('Missing fields', 400)
    if User.query.filter_by(email=email).first():
        return error('Email already registered', 409)
    user = User(full_name=full_name, email=email, role='user')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return success(message='User registered'), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return error('Invalid JSON', 400)
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return error('Invalid credentials', 401)
    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    return success({'access_token': access_token, 'user': {'id': user.id, 'email': user.email, 'full_name': user.full_name, 'role': user.role}}), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Stateless JWT – frontend just discards token
    return success(message='Logged out'), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    if not user:
        return error('User not found', 404)
    return success({'id': user.id, 'email': user.email, 'full_name': user.full_name, 'role': user.role}), 200

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    if not all([email, password, full_name]):
        return jsonify({'error': 'Missing fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409
    user = User(full_name=full_name, email=email, role='user')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    return jsonify({'access_token': access_token, 'user': {'id': user.id, 'email': user.email, 'full_name': user.full_name, 'role': user.role}}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'id': user.id, 'email': user.email, 'full_name': user.full_name, 'role': user.role}), 200
