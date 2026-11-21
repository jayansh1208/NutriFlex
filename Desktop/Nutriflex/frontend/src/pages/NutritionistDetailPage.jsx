import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

// Same data as NutritionistsPage (hardcoded for demo)
const nutritionists = [
  {
    slug: 'anjali-iyer',
    name: 'Dr. Anjali Iyer',
    price: '₹1,199',
    experience: '12 years',
    specialization: 'Diabetes & Heart‑healthy Diets',
    qualification: 'Ph.D. Public Health Nutrition',
    about: 'Dr. Iyer focuses on evidence‑based nutrition plans that help manage blood sugar and promote cardiovascular health, especially for Indian dietary patterns.',
    expertise: ['Meal Planning', 'Blood Sugar Management', 'Heart‑Healthy Recipes'],
  },
  {
    slug: 'priya-sharma',
    name: 'Dr. Priya Sharma',
    price: '₹799',
    experience: '9 years',
    specialization: 'Weight Management & PCOS',
    qualification: 'M.Sc. Clinical Nutrition, RD',
    about: 'Dr. Sharma specializes in sustainable weight‑loss programs and hormonal balance for PCOS, tailoring plans to Indian cuisine.',
    expertise: ['Weight Loss', 'PCOS Management', 'Balanced Indian Meals'],
  },
  {
    slug: 'kavya-nair',
    name: 'Kavya Nair',
    price: '₹699',
    experience: '6 years',
    specialization: 'Gut Health & Plant‑based Diets',
    qualification: 'M.Sc. Food & Nutrition, Certified Diabetes Educator',
    about: 'Kavya helps clients improve digestion and transition to plant‑based meals while respecting regional flavors.',
    expertise: ['Gut Health', 'Plant‑Based Recipes', 'Digestive Coaching'],
  },
];

export default function NutritionistDetailPage() {
  const { id } = useParams(); // id corresponds to slug
  const nutri = nutritionists.find((n) => n.slug === id);

  if (!nutri) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-3xl font-heading text-forest mb-4">Nutritionist Not Found</h2>
        <p className="text-body mb-6">We couldn't find the requested nutritionist.</p>
        <Link to="/nutritionists" className="text-gold underline">Back to Nutritionists</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-12 px-4">
      <section className="text-center py-8 bg-cream rounded-lg shadow border border-sage">
        <UserCheck className="w-16 h-16 text-forest mx-auto mb-4" />
        <h1 className="text-4xl font-heading text-forest mb-2">{nutri.name}</h1>
        <p className="text-body mb-2">{nutri.specialization}</p>
        <p className="text-body mb-2">{nutri.experience}</p>
        <p className="text-body mb-2">{nutri.qualification}</p>
        <p className="font-bold text-gold mb-4">Consultation: {nutri.price}</p>
        <Link to="/register" className="px-6 py-2 bg-forest text-cream rounded hover:bg-sage transition">
          Register to Book Consultation (Demo)
        </Link>
      </section>

      <section className="bg-mint p-6 rounded-lg shadow border border-sage">
        <h2 className="text-2xl font-heading text-forest mb-4">About {nutri.name}</h2>
        <p className="text-body mb-4">{nutri.about}</p>
        <h3 className="text-xl font-heading text-forest mb-2">Areas of Expertise</h3>
        <ul className="list-disc list-inside text-body">
          {nutri.expertise.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
