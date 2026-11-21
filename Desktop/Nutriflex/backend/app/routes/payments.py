import hashlib, hmac, uuid
from datetime import date, datetime
from flask import Blueprint, current_app, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import Nutritionist, Appointment, AppointmentStatus, Payment
from ..utils.responses import success, error

payments_bp=Blueprint('payments',__name__)

def _owner(payment):
    return payment and payment.appointment.user_id==int(get_jwt_identity())

def _public(p):
    return {'id':p.id,'appointment_id':p.appointment_id,'order_id':p.order_id,'payment_id':p.payment_id,'amount':p.amount_paise/100,'currency':p.currency,'status':p.status,'mode':p.mode,'created_at':p.created_at.isoformat()}

@payments_bp.post('/create-order')
@jwt_required()
def create_order():
    data=request.get_json(silent=True) or {}
    try:
        nutritionist_id=int(data.get('nutritionist_id'));date_obj=datetime.strptime(data.get('date',''),'%Y-%m-%d').date();time_obj=datetime.strptime(data.get('time',''),'%H:%M').time()
    except (TypeError,ValueError):return error('Choose a valid nutritionist, date, and time.',400)
    if date_obj<date.today():return error('Choose a date that is today or later.',400)
    nutritionist=Nutritionist.query.get(nutritionist_id)
    if not nutritionist:return error('Nutritionist not found',404)
    conflict=Appointment.query.filter_by(nutritionist_id=nutritionist_id,date=date_obj,time=time_obj).first()
    if conflict:return error('That appointment time has already been requested.',409)
    amount=int(round(float(nutritionist.consultation_fee or 0)*100))
    if amount<=0:return error('This nutritionist does not have a payable consultation fee configured.',409)
    mode=current_app.config.get('PAYMENT_MODE','mock')
    if mode not in ('mock','razorpay'):return error('Payment mode is not configured correctly.',503)
    appt=Appointment(user_id=int(get_jwt_identity()),nutritionist_id=nutritionist_id,date=date_obj,time=time_obj,status=AppointmentStatus.PENDING)
    db.session.add(appt);db.session.flush()
    if mode=='razorpay':
        key=current_app.config.get('RAZORPAY_KEY_ID');secret=current_app.config.get('RAZORPAY_KEY_SECRET')
        if not key or not secret:db.session.rollback();return error('Razorpay keys are not configured on the backend.',503)
        try:
            import razorpay
            order=razorpay.Client(auth=(key,secret)).order.create({'amount':amount,'currency':'INR','receipt':f'nf-{appt.id}'})
            order_id=order['id']
        except Exception:
            db.session.rollback();return error('Could not create the Razorpay order.',502)
    else:
        key='';order_id=f'demo_{uuid.uuid4().hex}'
    payment=Payment(appointment_id=appt.id,order_id=order_id,amount_paise=amount,mode=mode,status='pending')
    db.session.add(payment);db.session.commit()
    return success({'payment':_public(payment),'key_id':key,'mode':mode,'demo_label':'DEMO CHECKOUT · No money is charged' if mode=='mock' else None},'Payment order created'),201

@payments_bp.post('/verify')
@jwt_required()
def verify():
    data=request.get_json(silent=True) or {};order_id=str(data.get('order_id',''))
    payment=Payment.query.filter_by(order_id=order_id).first()
    if not _owner(payment):return error('Payment order not found',404)
    if payment.status!='pending':return error('This payment has already been verified.',409)
    if payment.mode=='mock':
        if current_app.config.get('PAYMENT_MODE')!='mock':return error('Demo payment confirmation is disabled.',403)
        if data.get('demo_confirm') is not True:return error('Use the clearly labelled demo checkout confirmation.',400)
        payment.status='demo_succeeded'
    else:
        payment_id=str(data.get('razorpay_payment_id',''));signature=str(data.get('razorpay_signature',''))
        secret=current_app.config.get('RAZORPAY_KEY_SECRET','')
        if Payment.query.filter_by(payment_id=payment_id).first():return error('This payment has already been used.',409)
        expected=hmac.new(secret.encode(),f'{order_id}|{payment_id}'.encode(),hashlib.sha256).hexdigest() if secret else ''
        if not payment_id or not hmac.compare_digest(expected,signature):return error('Payment signature verification failed.',400)
        try:
            import razorpay
            remote=razorpay.Client(auth=(current_app.config['RAZORPAY_KEY_ID'],secret)).payment.fetch(payment_id)
            if remote.get('order_id')!=order_id or int(remote.get('amount',-1))!=payment.amount_paise or remote.get('status')!='captured':return error('Payment details do not match the order.',400)
        except Exception:return error('Could not confirm the payment with Razorpay.',502)
        payment.payment_id=payment_id;payment.status='paid'
    payment.paid_at=datetime.utcnow();payment.appointment.status=AppointmentStatus.CONFIRMED;db.session.commit()
    return success({'payment':_public(payment),'appointment_id':payment.appointment_id,'appointment_status':payment.appointment.status.value},'Payment verified'),200

@payments_bp.get('/history')
@jwt_required()
def history():
    from ..models import User
    uid=int(get_jwt_identity()); user=User.query.get(uid)
    rows=Payment.query.join(Appointment).filter(Appointment.user_id==uid).order_by(Payment.created_at.desc()).all()
    if user and user.role=='admin':rows=Payment.query.order_by(Payment.created_at.desc()).all()
    return success([_public(p) for p in rows])

@payments_bp.get('/<int:payment_id>')
@jwt_required()
def get_payment(payment_id):
    payment=Payment.query.get(payment_id)
    if not _owner(payment):return error('Payment not found',404)
    return success(_public(payment))
