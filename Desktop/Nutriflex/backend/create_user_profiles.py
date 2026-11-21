import sqlite3, os

db_path = os.path.join(os.path.dirname(__file__), 'nutriflex.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()
# Create user_profiles table if not exists with required columns
cur.execute('''
CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    age INTEGER,
    gender VARCHAR(20),
    height_cm FLOAT,
    weight_kg FLOAT,
    dietary_preference VARCHAR(30),
    activity_level VARCHAR(30),
    goals VARCHAR(30),
    allergies VARCHAR(200),
    food_restrictions VARCHAR(200),
    disliked_foods VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
''')
conn.commit()
print('Ensured user_profiles table exists with required columns.')
conn.close()
