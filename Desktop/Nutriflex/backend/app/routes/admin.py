from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from .. import db
from ..models import User, Nutritionist, Appointment, AppointmentStatus, Payment
from ..utils.responses import success, error

admin_bp=Blueprint('admin',__name__)

def _allowed():
    return get_jwt().get('role')=='admin'

@admin_bp.before_request
@jwt_required()
def admin_guard():
    if not _allowed(): return error('Administrator access required',403)

@admin_bp.get('/overview')
def overview():
    paid=Payment.query.filter_by(status='paid',mode='razorpay').all()
    return success({'users':User.query.filter_by(role='user').count(),'nutritionists':Nutritionist.query.count(),'appointments':Appointment.query.count(),'confirmed_appointments':Appointment.query.filter_by(status=AppointmentStatus.CONFIRMED).count(),'successful_payments':len(paid),'revenue':sum(p.amount_paise for p in paid)/100})

@admin_bp.get('/users')
def users():
    return success([{'id':u.id,'full_name':u.full_name,'email':u.email,'role':u.role,'created_at':u.created_at.isoformat()} for u in User.query.order_by(User.created_at.desc()).all()])

@admin_bp.route('/nutritionists',methods=['GET','POST'])
def nutritionists():
    if request.method=='GET':
        return success([{'id':n.id,'name':n.name,'qualification':n.qualification,'specialization':n.specialization,'experience_years':n.experience_years,'consultation_fee':n.consultation_fee,'biography':n.biography,'availability':n.availability,'image_url':n.image_url} for n in Nutritionist.query.order_by(Nutritionist.name).all()])
    data=request.get_json(silent=True) or {}; name=str(data.get('name','')).strip()
    if len(name)<2: return error('Nutritionist name is required.',400)
    allowed=['qualification','specialization','experience_years','consultation_fee','biography','availability','image_url']
    fields={k:data.get(k) for k in allowed if k in data}
    row=Nutritionist(name=name,**fields); db.session.add(row); db.session.commit()
    return success({'id':row.id,'name':row.name},'Nutritionist added'),201

@admin_bp.route('/nutritionists/<int:item_id>',methods=['PUT','DELETE'])
def edit_nutritionist(item_id):
    row=Nutritionist.query.get(item_id)
    if not row:return error('Nutritionist not found',404)
    if request.method=='DELETE':
        if row.appointments:return error('This profile has appointment history and cannot be removed.',409)
        db.session.delete(row);db.session.commit();return success(message='Nutritionist removed')
    data=request.get_json(silent=True) or {}
    for field in ['name','qualification','specialization','experience_years','consultation_fee','biography','availability','image_url']:
        if field in data:setattr(row,field,data[field])
    db.session.commit();return success({'id':row.id,'name':row.name},'Nutritionist updated')

@admin_bp.get('/appointments')
def appointments():
    return success([{'id':a.id,'user':a.user.full_name,'nutritionist':a.nutritionist.name,'date':a.date.isoformat(),'time':a.time.strftime('%H:%M'),'status':a.status.value} for a in Appointment.query.order_by(Appointment.date.desc()).all()])

@admin_bp.patch('/appointments/<int:item_id>')
def update_appointment(item_id):
    row=Appointment.query.get(item_id)
    if not row:return error('Appointment not found',404)
    value=(request.get_json(silent=True) or {}).get('status','').upper()
    statuses={s.value.upper():s for s in AppointmentStatus}
    if value not in statuses:return error('Invalid appointment status.',400)
    row.status=statuses[value];db.session.commit();return success({'id':row.id,'status':row.status.value})
