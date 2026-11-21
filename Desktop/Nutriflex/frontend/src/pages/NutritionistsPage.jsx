import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

const nutritionists = [
  {
    name: 'Dr. Anjali Iyer',
    price: '₹1,199',
    experience: '12 years',
    specialization: 'Diabetes & Heart‑healthy Diets',
    qualification: 'Ph.D. Public Health Nutrition',
    slug: 'anjali-iyer',
  },
  {
    name: 'Dr. Priya Sharma',
    price: '₹799',
    experience: '9 years',
    specialization: 'Weight Management & PCOS',
    qualification: 'M.Sc. Clinical Nutrition, RD',
    slug: 'priya-sharma',
  },
  {
    name: 'Kavya Nair',
    price: '₹699',
    experience: '6 years',
    specialization: 'Gut Health & Plant‑based Diets',
    qualification: 'M.Sc. Food & Nutrition, Certified Diabetes Educator',
    slug: 'kavya-nair',
  },
];

export default function NutritionistsPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8 px-4">
      <section className="text-center py-12 bg-sage rounded-lg shadow">
        <h1 className="text-4xl font-heading text-forest mb-4">Find a Nutritionist</h1>
        <p className="text-body text-lg max-w-2xl mx-auto">
          Browse certified nutritionists and schedule a personalized consultation.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nutritionists.map((n) => (
          <div key={n.slug} className="p-6 bg-cream rounded-lg shadow border border-sage flex flex-col items-center text-center">
            <UserCheck className="w-12 h-12 text-forest mb-4" />
            <h3 className="text-xl font-heading text-forest mb-2">{n.name}</h3>
            <p className="text-body mb-1">{n.specialization}</p>
            <p className="text-body mb-1">{n.experience}</p>
            <p className="text-body mb-2">{n.qualification}</p>
            <p className="font-bold text-gold mb-2">Consultation: {n.price}</p>
            <Link to={`/nutritionists/${n.slug}`} className="text-gold underline">
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
