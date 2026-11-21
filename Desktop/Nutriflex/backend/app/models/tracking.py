from datetime import datetime
from .. import db


class MealLog(db.Model):
    __tablename__ = 'meal_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    food_item_id = db.Column(db.Integer, db.ForeignKey('food_items.id'), nullable=True)
    food_name = db.Column(db.String(120), nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)
    serving_size = db.Column(db.String(50), nullable=False)
    servings = db.Column(db.Float, nullable=False, default=1)
    calories = db.Column(db.Float, nullable=False, default=0)
    protein = db.Column(db.Float, nullable=False, default=0)
    carbs = db.Column(db.Float, nullable=False, default=0)
    fat = db.Column(db.Float, nullable=False, default=0)
    logged_on = db.Column(db.Date, nullable=False, default=db.func.current_date(), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class WaterLog(db.Model):
    __tablename__ = 'water_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    amount_ml = db.Column(db.Integer, nullable=False)
    logged_on = db.Column(db.Date, nullable=False, default=db.func.current_date(), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class WeightLog(db.Model):
    __tablename__ = 'weight_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    weight_kg = db.Column(db.Float, nullable=False)
    logged_on = db.Column(db.Date, nullable=False, default=db.func.current_date(), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class DietPlan(db.Model):
    __tablename__ = 'diet_plans'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    week_start = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    meals = db.relationship('DietPlanMeal', back_populates='plan', cascade='all, delete-orphan')
    __table_args__ = (db.UniqueConstraint('user_id','week_start',name='uq_plan_user_week'),)


class DietPlanMeal(db.Model):
    __tablename__ = 'diet_plan_meals'
    id = db.Column(db.Integer, primary_key=True)
    plan_id = db.Column(db.Integer, db.ForeignKey('diet_plans.id'), nullable=False, index=True)
    weekday = db.Column(db.Integer, nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.String(400), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Float, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    plan = db.relationship('DietPlan', back_populates='meals')
