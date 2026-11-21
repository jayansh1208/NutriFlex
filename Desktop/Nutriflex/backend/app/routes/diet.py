from datetime import date, timedelta
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import User, DietPlan, DietPlanMeal
from ..utils.responses import success, error

diet_bp=Blueprint('diet',__name__)
OPTIONS={
 'Breakfast':[
  ('Oats, banana & seeds','Warm oats topped with sliced banana and seeds.',340,12,{'vegan','jain'}),
  ('Poha with peas','Flattened rice with peas, lemon and roasted peanuts.',320,9,{'vegetarian'}),
  ('Idli with coconut chutney','Steamed idli with a side of coconut chutney.',300,8,{'vegan','jain'}),
  ('Paneer toast','Whole grain toast topped with lightly spiced paneer.',390,22,{'vegetarian'}),
  ('Egg bhurji & roti','Soft scrambled eggs with a whole wheat roti.',410,25,{'non-vegetarian'}),
 ],
 'Lunch':[
  ('Dal, rice & cucumber','A bowl of dal, rice and fresh cucumber.',520,20,{'vegan','jain'}),
  ('Chickpea grain bowl','Chickpeas, brown rice and seasonal greens.',490,19,{'vegan'}),
  ('Paneer, roti & greens','Paneer with whole wheat roti and sautéed greens.',560,28,{'vegetarian'}),
  ('Chicken, rice & greens','Grilled chicken with rice and seasonal greens.',550,38,{'non-vegetarian'}),
 ],
 'Snack':[
  ('Apple & almonds','Fresh apple with a small handful of almonds.',190,5,{'vegan','jain'}),
  ('Curd with fruit','Plain curd with fresh fruit.',180,10,{'vegetarian'}),
  ('Roasted chana','A crunchy portion of roasted chickpeas.',160,8,{'vegan','jain'}),
 ],
 'Dinner':[
  ('Moong dal khichdi','Comforting rice and lentil khichdi with vegetables.',440,18,{'vegan','jain'}),
  ('Tofu stir-fry & rice','Tofu with seasonal vegetables and rice.',470,24,{'vegan'}),
  ('Paneer & vegetable bowl','Paneer with roasted vegetables and millet.',510,27,{'vegetarian'}),
  ('Fish, roti & vegetables','Fish with whole wheat roti and vegetables.',490,34,{'non-vegetarian'}),
 ]
}
PREF={'vegetarian':'vegetarian','vegan':'vegan','jain':'jain','non-vegetarian':'non-vegetarian'}
ALLERGEN_TERMS={'milk':['milk','dairy','lactose','paneer','curd','yogurt'],'dairy':['milk','dairy','lactose','paneer','curd','yogurt'],'peanut':['peanut'],'nut':['almond','nuts','peanut'],'almond':['almond'],'gluten':['wheat','roti','toast','bread'],'wheat':['wheat','roti','toast','bread'],'egg':['egg'],'soy':['tofu','soy']}

def _uid(): return int(get_jwt_identity())

@diet_bp.get('/plan')
@jwt_required()
def current_plan():
    uid=_uid();user=User.query.get(uid)
    if not user or not user.profile:return error('Complete your wellness profile to build your meal plan.',409)
    today=date.today();start=today-timedelta(days=today.weekday())
    plan=DietPlan.query.filter_by(user_id=uid,week_start=start).first()
    if not plan:
        plan=DietPlan(user_id=uid,week_start=start);db.session.add(plan);db.session.flush()
        pref=PREF.get((user.profile.dietary_preference or '').lower(),'vegetarian')
        exclusions=[x.strip().lower() for x in (user.profile.allergies or '').split(',') if x.strip()]
        excluded_terms={term for allergy in exclusions for key,terms in ALLERGEN_TERMS.items() if key in allergy or allergy in key for term in terms}
        excluded_terms.update(exclusions)
        for day in range(7):
            for meal_index,meal_type in enumerate(('Breakfast','Lunch','Snack','Dinner')):
                choices=OPTIONS[meal_type]
                suitable=[x for x in choices if pref in x[4] or (pref=='vegetarian' and 'vegan' in x[4]) or (pref=='jain' and 'jain' in x[4])]
                if not suitable:suitable=[x for x in choices if 'vegetarian' in x[4] or 'vegan' in x[4]]
                allergy_safe=[x for x in suitable if not any(a in (x[0]+' '+x[1]).lower() for a in excluded_terms)]
                if not allergy_safe:
                    db.session.rollback()
                    return error('We could not build a safe plan from these allergy restrictions. Update your profile or ask a nutritionist for help.',409)
                suitable=allergy_safe
                pick=suitable[(day+meal_index)%len(suitable)]
                db.session.add(DietPlanMeal(plan_id=plan.id,weekday=day,meal_type=meal_type,title=pick[0],description=pick[1],calories=pick[2],protein=pick[3]))
        db.session.commit()
    meals=[{'id':m.id,'weekday':m.weekday,'meal_type':m.meal_type,'title':m.title,'description':m.description,'calories':m.calories,'protein':m.protein,'completed':m.completed} for m in plan.meals]
    return success({'id':plan.id,'week_start':start.isoformat(),'dietary_preference':user.profile.dietary_preference,'goal':user.profile.goals,'meals':meals})

@diet_bp.patch('/meals/<int:meal_id>')
@jwt_required()
def update_meal(meal_id):
    row=DietPlanMeal.query.join(DietPlan).filter(DietPlanMeal.id==meal_id,DietPlan.user_id==_uid()).first()
    if not row:return error('Plan meal not found',404)
    row.completed=bool((request.get_json(silent=True) or {}).get('completed',not row.completed));db.session.commit()
    return success({'id':row.id,'completed':row.completed})
