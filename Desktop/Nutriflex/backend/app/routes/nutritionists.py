from flask import Blueprint, jsonify, request
from .. import db
from ..models import Nutritionist

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
        })
    return jsonify(result), 200
