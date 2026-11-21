from app import create_app, db
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.nutritionist import Nutritionist
from app.models.food_item import FoodItem
from app.models.appointment import Appointment
from datetime import datetime
import os

app = create_app()

def seed():
    with app.app_context():
        # Drop and create all tables for clean seed
        db.drop_all()
        db.create_all()

        # Admin user
        admin = User(full_name='Admin User', email='admin@example.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)

        # Sample nutritionists
        nutritionists_data = [
            {
                'name': 'Dr. Anjali Iyer',
                'image_url': '',
                'qualification': 'MSc Nutrition',
                'specialization': 'Weight Management',
                'experience_years': 5,
                'consultation_fee': 0.0,
                'biography': 'Experienced nutritionist focusing on holistic health.',
                'availability': 'Mon-Fri 09:00-17:00',
            },
            {
                'name': 'Dr. Priya Sharma',
                'image_url': '',
                'qualification': 'PhD Dietetics',
                'specialization': 'Diabetes Care',
                'experience_years': 8,
                'consultation_fee': 0.0,
                'biography': 'Specialist in diabetic nutrition plans.',
                'availability': 'Tue-Thu 10:00-16:00',
            },
            {
                'name': 'Kavya Nair',
                'image_url': '',
                'qualification': 'BSc Clinical Dietitian',
                'specialization': 'Sports Nutrition',
                'experience_years': 4,
                'consultation_fee': 0.0,
                'biography': 'Helps athletes optimize performance.',
                'availability': 'Mon, Wed, Fri 08:00-12:00',
            },
            {
                'name': 'Dr. Rohan Mehta',
                'image_url': '',
                'qualification': 'MSc Clinical Nutrition',
                'specialization': 'Gut Health',
                'experience_years': 6,
                'consultation_fee': 0.0,
                'biography': 'Focus on digestive health and IBS.',
                'availability': 'Tue, Thu 14:00-18:00',
            },
        ]
        nutritionists = []
        for nd in nutritionists_data:
            n = Nutritionist(**nd)
            nutritionists.append(n)
        db.session.add_all(nutritionists)

        # Food items (15 Indian staples)
        foods = [
            {'name': 'Rice', 'serving_size': '1 cup', 'calories': 130, 'protein': 2.7, 'carbs': 28, 'fat': 0.3},
            {'name': 'Roti', 'serving_size': '1 piece', 'calories': 71, 'protein': 2.3, 'carbs': 15, 'fat': 0.5},
            {'name': 'Dal', 'serving_size': '1 cup', 'calories': 198, 'protein': 12, 'carbs': 30, 'fat': 2},
            {'name': 'Paneer', 'serving_size': '100g', 'calories': 265, 'protein': 18, 'carbs': 6, 'fat': 20},
            {'name': 'Milk', 'serving_size': '1 cup', 'calories': 122, 'protein': 8, 'carbs': 12, 'fat': 5},
            {'name': 'Curd', 'serving_size': '1 cup', 'calories': 110, 'protein': 9, 'carbs': 12, 'fat': 4},
            {'name': 'Oats', 'serving_size': '1 cup', 'calories': 307, 'protein': 11, 'carbs': 55, 'fat': 5},
            {'name': 'Banana', 'serving_size': '1 medium', 'calories': 105, 'protein': 1.3, 'carbs': 27, 'fat': 0.4},
            {'name': 'Apple', 'serving_size': '1 medium', 'calories': 95, 'protein': 0.5, 'carbs': 25, 'fat': 0.3},
            {'name': 'Idli', 'serving_size': '2 pieces', 'calories': 140, 'protein': 4, 'carbs': 28, 'fat': 0.5},
            {'name': 'Dosa', 'serving_size': '1 piece', 'calories': 133, 'protein': 3, 'carbs': 22, 'fat': 4},
            {'name': 'Rajma', 'serving_size': '1 cup', 'calories': 225, 'protein': 15, 'carbs': 40, 'fat': 0.8},
            {'name': 'Chole', 'serving_size': '1 cup', 'calories': 269, 'protein': 13, 'carbs': 45, 'fat': 4},
            {'name': 'Sprouts', 'serving_size': '1 cup', 'calories': 100, 'protein': 7, 'carbs': 15, 'fat': 0.5},
            {'name': 'Almonds', 'serving_size': '10 pieces', 'calories': 70, 'protein': 2.6, 'carbs': 2.5, 'fat': 6},
        ]
        food_objs = [FoodItem(**f) for f in foods]
        db.session.add_all(food_objs)

        db.session.commit()
        print('Database seeded successfully.')

if __name__ == '__main__':
    seed()
