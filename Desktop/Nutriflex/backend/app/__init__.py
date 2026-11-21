from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import Config

# Initialize extensions

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.appointments import appointments_bp
    from .routes.nutritionists import nutritionists_bp
    from .routes.profile import profile_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(appointments_bp, url_prefix="/api/appointments")
    app.register_blueprint(nutritionists_bp, url_prefix="/api/nutritionists")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")

    @app.route('/')
    def health_check():
        return {"status": "ok"}

    return app
