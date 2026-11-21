import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const featureCards = [
    { title: 'Smart Food Tracking', desc: 'Log meals with Indian food database, auto‑calc calories.' },
    { title: 'Hydration Tracker', desc: 'Stay hydrated with reminders and water‑intake charts.' },
    { title: 'Personalized Diet Plans', desc: 'Plans custom‑crafted for your goals and preferences.' },
    { title: 'Expert Consultations', desc: 'Book video calls with certified nutritionists.' },
    { title: 'Progress Insights', desc: 'Visual dashboards for weight, macro, and habit trends.' },
    { title: 'Educational Hub', desc: 'Read articles on nutrition, recipes, and wellness.' },
  ];

  const nutritionists = [
    { name: 'Dr. Anjali Iyer', price: '₹1,199', slug: 'anjali-iyer' },
    { name: 'Dr. Priya Sharma', price: '₹799', slug: 'priya-sharma' },
    { name: 'Kavya Nair', price: '₹699', slug: 'kavya-nair' },
  ];

  const articles = [
    { title: 'Understanding Macronutrients', slug: 'macronutrients' },
    { title: 'How to Build Balanced Meals', slug: 'balanced-meals' },
    { title: 'Healthy Indian Food Choices', slug: 'indian-choices' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 bg-mint rounded-lg shadow">
        <h1 className="text-5xl font-heading text-forest mb-4">Your Health Journey, Made Personal.</h1>
        <p className="text-lg text-body mb-6">Eat Better. Live Better. Feel Your Best.</p>
        <div className="flex justify-center space-x-4">
          <Link to="/register" className="px-6 py-2 bg-forest text-cream rounded hover:bg-sage transition">Start Your Journey</Link>
          <Link to="/features" className="px-6 py-2 bg-gold text-charcoal rounded hover:bg-cream transition">Explore Features</Link>
        </div>
      </section>

      {/* Indian Food Preview */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-heading text-forest mb-4 text-center">Popular Indian Foods</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Idli", "Dosa", "Paneer Tikka", "Biryani", "Roti", "Lassi"].map((item) => (
            <div key={item} className="p-4 bg-cream rounded border border-sage text-center">
              <span className="text-body font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Snapshot */}
      <section className="bg-cream py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-mint rounded-lg shadow">
            <h3 className="text-xl font-heading text-forest mb-2">Calories</h3>
            <p className="text-2xl font-bold text-charcoal">2,200 kcal</p>
          </div>
          <div className="p-4 bg-mint rounded-lg shadow">
            <h3 className="text-xl font-heading text-forest mb-2">Water</h3>
            <p className="text-2xl font-bold text-charcoal">1.8 L</p>
          </div>
          <div className="p-4 bg-mint rounded-lg shadow">
            <h3 className="text-xl font-heading text-forest mb-2">Active</h3>
            <p className="text-2xl font-bold text-charcoal">45 min</p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-heading text-forest mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <div key={card.title} className="p-6 bg-cream rounded-lg shadow border border-sage">
              <h3 className="text-xl font-heading text-forest mb-2">{card.title}</h3>
              <p className="text-body">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-forest mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-forest mb-2">1</div>
              <p className="font-heading text-forest">Create your profile & set goals.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-forest mb-2">2</div>
              <p className="font-heading text-forest">Track meals, water & activity.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-forest mb-2">3</div>
              <p className="font-heading text-forest">Get personalized insights & consult experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Nutritionists */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-heading text-forest mb-8 text-center">Our Nutritionists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nutritionists.map((n) => (
            <div key={n.name} className="p-6 bg-cream rounded-lg shadow border border-sage text-center">
              <h3 className="text-xl font-heading text-forest mb-2">{n.name}</h3>
              <p className="text-body mb-2">Consultation: {n.price}</p>
              <Link to={`/nutritionists/${n.slug}`} className="text-gold underline">View Profile</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Articles */}
      <section className="bg-cream py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-forest mb-8 text-center">Learn & Grow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div key={a.title} className="p-4 bg-cream rounded-lg shadow border border-sage">
                <h3 className="font-heading text-forest mb-2">{a.title}</h3>
                <Link to={`/hub/${a.slug}`} className="text-gold underline">Read Article</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 bg-mint rounded-lg shadow">
        <h2 className="text-4xl font-heading text-forest mb-4">Ready to Transform Your Nutrition?</h2>
        <Link to="/register" className="px-8 py-3 bg-forest text-cream rounded hover:bg-sage transition inline-block">Get Started Today</Link>
      </section>
    </div>
  );
}
