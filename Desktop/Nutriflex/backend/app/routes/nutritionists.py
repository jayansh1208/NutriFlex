from flask import Blueprint, jsonify, request
from .. import db
from ..models import Nutritionist
import re

nutritionists_bp = Blueprint('nutritionists', __name__)

@nutritionists_bp.route('/', methods=['GET'])
def list_nutritionists():
    nutritionists = Nutritionist.query.all()
    result = []
    for n in nutritionists:
        result.append({
            'id': n.id,
            'name': n.name,
            'image_url': n.image_url,
            'qualification': n.qualification,
            'specialization': n.specialization,
            'experience_years': n.experience_years,
            'consultation_fee': n.consultation_fee,
            'biography': n.biography,
            'availability': n.availability,
            'slug': re.sub(r'[^a-z0-9]+','-',n.name.lower()).strip('-'),
        })
    return jsonify(result), 200

@nutritionists_bp.route('/lookup/<string:lookup>', methods=['GET'])
def get_nutritionist(lookup):
    if lookup.isdigit():
        nutritionist=Nutritionist.query.get(int(lookup))
    else:
        slug=lookup.lower().strip('-')
        nutritionist=next((n for n in Nutritionist.query.all() if re.sub(r'[^a-z0-9]+','-',n.name.lower()).strip('-')==slug),None)
    if not nutritionist:return jsonify({'message':'Nutritionist not found'}),404
    n=nutritionist
    return jsonify({'id':n.id,'slug':re.sub(r'[^a-z0-9]+','-',n.name.lower()).strip('-'),'name':n.name,'image_url':n.image_url,'qualification':n.qualification,'specialization':n.specialization,'experience_years':n.experience_years,'consultation_fee':n.consultation_fee,'biography':n.biography,'availability':n.availability}),200
