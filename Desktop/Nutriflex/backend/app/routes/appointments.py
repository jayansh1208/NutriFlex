from flask import Blueprint, request, jsonify
from .. import db
from ..models.appointment import Appointment, AppointmentStatus
from ..models.nutritionist import Nutritionist
from ..utils.responses import success, error
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)

# Create a new appointment (demo booking, no payment)
@appointments_bp.route('/', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    if not data:
        return error('Invalid JSON', 400)
    nutritionist_id = data.get('nutritionist_id')
    date_str = data.get('date')  # Expected format YYYY-MM-DD
    time_str = data.get('time')  # Expected format HH:MM (24h)
    if not all([nutritionist_id, date_str, time_str]):
        return error('Missing fields', 400)
    # Validate nutritionist exists
    nutritionist = Nutritionist.query.get(nutritionist_id)
    if not nutritionist:
        return error('Nutritionist not found', 404)
    # Parse date & time
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        time_obj = datetime.strptime(time_str, '%H:%M').time()
    except ValueError:
        return error('Invalid date or time format', 400)
    # Prevent duplicate slot booking (only confirmed slots block)
    existing = Appointment.query.filter_by(
        nutritionist_id=nutritionist_id,
        date=date_obj,
        time=time_obj,
        status=AppointmentStatus.CONFIRMED,
    ).first()
    if existing:
        return error('Slot already booked', 409)
    # Create pending appointment
    user_id = get_jwt_identity()['id']
    appt = Appointment(
        user_id=user_id,
        nutritionist_id=nutritionist_id,
        date=date_obj,
        time=time_obj,
        status=AppointmentStatus.PENDING,
    )
    db.session.add(appt)
    db.session.commit()
    return success({'appointment_id': appt.id, 'status': appt.status.value}), 201

# List current user's appointments (admin can view all)
@appointments_bp.route('/', methods=['GET'])
@jwt_required()
def list_appointments():
    identity = get_jwt_identity()
    user_id = identity['id']
    role = identity.get('role')
    if role == 'admin':
        appointments = Appointment.query.all()
    else:
        appointments = Appointment.query.filter_by(user_id=user_id).all()
    result = []
    for a in appointments:
        result.append({
            'id': a.id,
            'user_id': a.user_id,
            'nutritionist_id': a.nutritionist_id,
            'date': a.date.isoformat(),
            'time': a.time.strftime('%H:%M'),
            'status': a.status.value,
        })
    return success(result), 200

# Confirm a pending appointment (demo confirmation)
@appointments_bp.route('/<int:appointment_id>/confirm', methods=['POST'])
@jwt_required()
def confirm_appointment(appointment_id):
    user_id = get_jwt_identity()['id']
    appt = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first()
    if not appt:
        return error('Appointment not found', 404)
    if appt.status != AppointmentStatus.PENDING:
        return error('Only pending appointments can be confirmed', 400)
    # Ensure no other confirmed appointment occupies the same slot
    conflict = Appointment.query.filter_by(
        nutritionist_id=appt.nutritionist_id,
        date=appt.date,
        time=appt.time,
        status=AppointmentStatus.CONFIRMED,
    ).first()
    if conflict:
        return error('Slot already occupied by another confirmed booking', 409)
    appt.status = AppointmentStatus.CONFIRMED
    db.session.commit()
    return success({'appointment_id': appt.id, 'status': appt.status.value}), 200

# Cancel an appointment (allowed for pending or confirmed)
@appointments_bp.route('/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def cancel_appointment(appointment_id):
    user_id = get_jwt_identity()['id']
    appt = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first()
    if not appt:
        return error('Appointment not found', 404)
    if appt.status == AppointmentStatus.CANCELLED:
        return error('Appointment already cancelled', 400)
    appt.status = AppointmentStatus.CANCELLED
    db.session.commit()
    return success({'appointment_id': appt.id, 'status': appt.status.value}), 200
