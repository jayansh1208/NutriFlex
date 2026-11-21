from datetime import datetime
from .. import db

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Article(db.Model):
    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(160), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(80), nullable=False, default='Nutrition')
    image_url = db.Column(db.String(500))
    summary = db.Column(db.String(500))
    body = db.Column(db.Text, nullable=False)
    published = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Payment(db.Model):
    __tablename__='payments'
    id=db.Column(db.Integer,primary_key=True)
    appointment_id=db.Column(db.Integer,db.ForeignKey('appointments.id'),nullable=False,unique=True)
    order_id=db.Column(db.String(100),nullable=False,unique=True)
    payment_id=db.Column(db.String(100),unique=True)
    amount_paise=db.Column(db.Integer,nullable=False)
    currency=db.Column(db.String(3),nullable=False,default='INR')
    status=db.Column(db.String(24),nullable=False,default='pending')
    mode=db.Column(db.String(16),nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.utcnow,nullable=False)
    paid_at=db.Column(db.DateTime)
    appointment=db.relationship('Appointment')
