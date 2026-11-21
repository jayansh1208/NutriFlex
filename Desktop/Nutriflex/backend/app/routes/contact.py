from flask import Blueprint, request
from .. import db
from ..models.content import ContactMessage
from ..utils.responses import success, error

contact_bp = Blueprint('contact', __name__)

@contact_bp.post('/')
def submit_contact():
    data = request.get_json(silent=True) or {}
    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    message = str(data.get('message', '')).strip()
    if len(name) < 2 or '@' not in email or len(message) < 10 or len(message) > 5000:
        return error('Please enter a name, valid email, and message of at least 10 characters.', 400)
    row = ContactMessage(name=name[:120], email=email[:120], message=message)
    db.session.add(row); db.session.commit()
    return success(message='Thanks for reaching out. Your message has been received.'), 201
