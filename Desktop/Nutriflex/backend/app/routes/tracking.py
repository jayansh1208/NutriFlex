from datetime import date, timedelta
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import User, FoodItem, MealLog, WaterLog, WeightLog, Appointment
from ..utils.responses import success, error

tracking_bp = Blueprint('tracking', __name__)

def _uid():
    identity = get_jwt_identity()
    return identity['id'] if isinstance(identity, dict) else int(identity)

def _meal_dict(m):
    return {'id': m.id, 'food_name': m.food_name, 'meal_type': m.meal_type,
            'serving_size': m.serving_size, 'servings': m.servings, 'calories': m.calories,
            'protein': m.protein, 'carbs': m.carbs, 'fat': m.fat, 'logged_on': m.logged_on.isoformat()}

@tracking_bp.get('/foods')
@jwt_required()
def foods():
    q = request.args.get('q', '').strip()
    items = FoodItem.query.filter(FoodItem.name.ilike(f'%{q}%')).order_by(FoodItem.name).limit(30).all()
    return success([{'id': f.id, 'name': f.name, 'serving_size': f.serving_size, 'calories': f.calories,
                     'protein': f.protein, 'carbs': f.carbs, 'fat': f.fat} for f in items])

@tracking_bp.route('/meals', methods=['GET', 'POST'])
@jwt_required()
def meals():
    uid = _uid()
    if request.method == 'GET':
        day = date.fromisoformat(request.args.get('date', date.today().isoformat()))
        rows = MealLog.query.filter_by(user_id=uid, logged_on=day).order_by(MealLog.created_at.desc()).all()
        return success([_meal_dict(m) for m in rows])
    data = request.get_json() or {}
    item = FoodItem.query.get(data.get('food_item_id')) if data.get('food_item_id') else None
    name = data.get('food_name') or (item.name if item else '')
    try:
        servings = float(data.get('servings', 1))
        if not name.strip() or data.get('meal_type') not in {'Breakfast', 'Lunch', 'Dinner', 'Snack'} or servings <= 0:
            raise ValueError()
        def nutrient(key):
            return getattr(item, key, None) if item else data.get(key)
        row = MealLog(user_id=uid, food_item_id=item.id if item else None, food_name=name.strip(),
          meal_type=data['meal_type'], serving_size=data.get('serving_size') or (item.serving_size if item else '1 serving'), servings=servings,
          calories=float(nutrient('calories') or 0)*servings, protein=float(nutrient('protein') or 0)*servings,
          carbs=float(nutrient('carbs') or 0)*servings, fat=float(nutrient('fat') or 0)*servings)
    except (ValueError, TypeError, KeyError):
        return error('Enter a food, valid meal type, and a positive serving amount.', 400)
    db.session.add(row); db.session.commit()
    return success(_meal_dict(row), 'Food logged'), 201

@tracking_bp.route('/meals/<int:row_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def meal(row_id):
    row = MealLog.query.filter_by(id=row_id, user_id=_uid()).first()
    if not row: return error('Meal not found', 404)
    if request.method == 'DELETE':
        db.session.delete(row); db.session.commit(); return success(message='Meal removed')
    data = request.get_json() or {}
    if 'meal_type' in data and data['meal_type'] in {'Breakfast','Lunch','Dinner','Snack'}: row.meal_type = data['meal_type']
    if 'servings' in data:
        try: old_servings=row.servings; new_servings=max(0.1, float(data['servings']))
        except (ValueError, TypeError): return error('Invalid servings', 400)
        item = FoodItem.query.get(row.food_item_id) if row.food_item_id else None
        for field in ('calories','protein','carbs','fat'):
            base=float(getattr(item, field) if item else getattr(row,field)/old_servings if old_servings else 0)
            row.__setattr__(field, base*new_servings)
        row.servings=new_servings
    db.session.commit(); return success(_meal_dict(row), 'Meal updated')

@tracking_bp.route('/water', methods=['GET', 'POST'])
@jwt_required()
def water():
    uid = _uid()
    if request.method == 'GET':
        day = date.fromisoformat(request.args.get('date', date.today().isoformat()))
        rows = WaterLog.query.filter_by(user_id=uid, logged_on=day).order_by(WaterLog.created_at).all()
        total = sum(x.amount_ml for x in rows)
        return success({'logs': [{'id': x.id, 'amount_ml': x.amount_ml, 'created_at': x.created_at.isoformat()} for x in rows], 'total_ml': total})
    try:
        amount = int((request.get_json() or {}).get('amount_ml', 0))
        if amount < 1 or amount > 3000: raise ValueError()
    except (ValueError, TypeError): return error('Water amount must be between 1 and 3000 ml.', 400)
    row=WaterLog(user_id=uid, amount_ml=amount); db.session.add(row); db.session.commit()
    return success({'id': row.id, 'amount_ml': amount}, 'Water added'), 201

@tracking_bp.route('/weight', methods=['GET', 'POST'])
@jwt_required()
def weight():
    uid=_uid()
    if request.method=='GET':
        rows=WeightLog.query.filter_by(user_id=uid).order_by(WeightLog.logged_on.desc()).limit(30).all()
        return success([{'id':r.id,'weight_kg':r.weight_kg,'date':r.logged_on.isoformat()} for r in reversed(rows)])
    try:
        value=float((request.get_json(silent=True) or {}).get('weight_kg'))
        if value<20 or value>400: raise ValueError()
    except (ValueError,TypeError): return error('Weight must be between 20 and 400 kg.',400)
    row=WeightLog(user_id=uid,weight_kg=value);db.session.add(row);db.session.commit()
    return success({'id':row.id,'weight_kg':value,'date':row.logged_on.isoformat()},'Weight saved'),201

@tracking_bp.get('/dashboard')
@jwt_required()
def dashboard():
    uid = _uid(); user = User.query.get(uid)
    if not user: return error('User not found',404)
    today = date.today()
    logs = MealLog.query.filter_by(user_id=uid, logged_on=today).all()
    water_ml = db.session.query(db.func.coalesce(db.func.sum(WaterLog.amount_ml),0)).filter_by(user_id=uid, logged_on=today).scalar()
    profile = user.profile
    goal, protein_goal, water_goal = 2000, 90, 2500
    if profile and profile.weight_kg:
        weight=float(profile.weight_kg); height=float(profile.height_cm or 165); age=int(profile.age or 30)
        gender=(profile.gender or '').lower()
        bmr=10*weight+6.25*height-5*age+ (5 if gender in ('man','male') else -161 if gender in ('woman','female') else -78)
        activity={'sedentary':1.2,'lightly active':1.375,'moderately active':1.55,'very active':1.725}.get((profile.activity_level or '').lower(),1.375)
        adjustment={'weight loss':-300,'weight gain':300}.get((profile.goals or '').lower(),0)
        goal=int(max(1200,min(3500,bmr*activity+adjustment)))
        protein_goal=int(max(45,min(180,weight*1.2)));water_goal=int(max(1500,min(4000,weight*35)))
    appts = Appointment.query.filter_by(user_id=uid).filter(Appointment.date >= today).order_by(Appointment.date,Appointment.time).limit(3).all()
    week = []
    for offset in range(6,-1,-1):
        day=today-timedelta(days=offset)
        total=db.session.query(db.func.coalesce(db.func.sum(MealLog.calories),0)).filter_by(user_id=uid,logged_on=day).scalar()
        water_total=db.session.query(db.func.coalesce(db.func.sum(WaterLog.amount_ml),0)).filter_by(user_id=uid,logged_on=day).scalar()
        week.append({'day':day.strftime('%a'), 'date':day.isoformat(), 'calories':round(total), 'water_ml':int(water_total)})
    weight_rows=WeightLog.query.filter_by(user_id=uid).order_by(WeightLog.logged_on.desc()).limit(30).all()
    return success({'name':user.full_name.split()[0], 'date':today.isoformat(), 'targets':{'calories':goal,'protein':protein_goal,'water_ml':water_goal},
      'totals':{'calories':round(sum(m.calories for m in logs)),'protein':round(sum(m.protein for m in logs),1),'carbs':round(sum(m.carbs for m in logs),1),'fat':round(sum(m.fat for m in logs),1),'water_ml':int(water_ml)},
      'meals':[_meal_dict(m) for m in logs], 'week':week, 'weight_history':[{'date':w.logged_on.isoformat(),'weight_kg':w.weight_kg} for w in reversed(weight_rows)], 'appointments':[{'id':a.id,'date':a.date.isoformat(),'time':a.time.strftime('%H:%M'),'status':a.status.value,'nutritionist':a.nutritionist.name} for a in appts],
      'has_profile':bool(profile)})
