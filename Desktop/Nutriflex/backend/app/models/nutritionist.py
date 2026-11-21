from datetime import datetime
from .. import db

class Nutritionist(db.Model):
    __tablename__ = 'nutritionists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    image_url = db.Column(db.String(255))
    qualification = db.Column(db.String(255))
    specialization = db.Column(db.String(255))
    experience_years = db.Column(db.Integer)
    consultation_fee = db.Column(db.Float)
    biography = db.Column(db.Text)
    availability = db.Column(db.Text)  # JSON string or simple text for demo
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    appointments = db.relationship('Appointment', back_populates='nutritionist', cascade='all, delete-orphan')
