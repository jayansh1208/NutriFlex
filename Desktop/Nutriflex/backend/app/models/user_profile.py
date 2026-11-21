from .. import db
from datetime import datetime

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    height_cm = db.Column(db.Float)
    weight_kg = db.Column(db.Float)
    dietary_preference = db.Column(db.String(30))  # vegetarian, vegan, jain, non-vegetarian
    activity_level = db.Column(db.String(30))
    goals = db.Column(db.String(30))
    allergies = db.Column(db.String(200))
    food_restrictions = db.Column(db.String(200), nullable=True)
    disliked_foods = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='profile')
