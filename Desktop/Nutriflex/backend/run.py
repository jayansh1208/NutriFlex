#!/usr/bin/env python
import os
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    # Ensure the instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
