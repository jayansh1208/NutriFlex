from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import Config

# Initialize extensions

db = SQLAlchemy()
jwt = JWTManager()


def create_app(config_overrides=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if config_overrides:
        app.config.update(config_overrides)

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

    # Register blueprints
    from . import models  # noqa: F401 - register SQLAlchemy models before create_all
    from .routes.auth import auth_bp
    from .routes.appointments import appointments_bp
    from .routes.nutritionists import nutritionists_bp
    from .routes.profile import profile_bp
    from .routes.tracking import tracking_bp
    from .routes.contact import contact_bp
    from .routes.admin import admin_bp
    from .routes.diet import diet_bp
    from .routes.payments import payments_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(appointments_bp, url_prefix="/api/appointments")
    app.register_blueprint(nutritionists_bp, url_prefix="/api/nutritionists")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(tracking_bp, url_prefix="/api/tracking")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(diet_bp, url_prefix="/api/diet")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")

    @app.route('/api', methods=['GET'])
    @app.route('/api/', methods=['GET'])
    def api_index():
        return {
            'status': 'ok',
            'service': 'NutriFlex Flask REST API',
            'message': 'API is running. Use a route below or the frontend application.',
            'routes': [
                '/api/auth', '/api/profile', '/api/tracking', '/api/diet',
                '/api/nutritionists', '/api/appointments', '/api/payments',
                '/api/admin', '/api/contact',
            ],
        }

    @app.route('/')
    def health_check():
        return {"status": "ok"}

    return app
