from datetime import datetime
from .. import db
from sqlalchemy import Enum
import enum

class AppointmentStatus(enum.Enum):
    PENDING = 'Pending'
    CONFIRMED = 'Confirmed'
    CANCELLED = 'Cancelled'
    COMPLETED = 'Completed'

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nutritionist_id = db.Column(db.Integer, db.ForeignKey('nutritionists.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    status = db.Column(Enum(AppointmentStatus), default=AppointmentStatus.PENDING, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='appointments')
    nutritionist = db.relationship('Nutritionist', back_populates='appointments')

    __table_args__ = (
        db.UniqueConstraint('nutritionist_id', 'date', 'time', name='uq_nutritionist_slot'),
    )
