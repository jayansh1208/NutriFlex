import React from 'react';

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16 bg-cream">
        <h1 className="text-5xl font-heading text-forest mb-4">About NutriFlex</h1>
        <p className="text-lg text-body max-w-2xl mx-auto">
          NutriFlex is your personal nutrition companion – a premium platform that blends science‑backed diet planning with expert consultations to help you achieve lasting wellness.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-heading text-forest mb-4">Our Mission</h2>
        <p className="text-body text-lg leading-relaxed">
          We empower individuals to make informed food choices through personalized meal plans, real‑time tracking, and direct access to certified nutritionists. Our goal is to make healthy living simple, enjoyable, and sustainable for every lifestyle.
        </p>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className="p-6 bg-mint rounded-lg shadow">
          <h3 className="text-xl font-heading text-forest mb-2">Personalized Plans</h3>
          <p className="text-body">Tailored calorie and macronutrient targets based on your goals, activity level and preferences.</p>
        </div>
        <div className="p-6 bg-mint rounded-lg shadow">
          <h3 className="text-xl font-heading text-forest mb-2">Expert Guidance</h3>
          <p className="text-body">Book one‑on‑one sessions with certified nutritionists who understand Indian dietary habits.</p>
        </div>
        <div className="p-6 bg-mint rounded-lg shadow">
          <h3 className="text-xl font-heading text-forest mb-2">Holistic Tracking</h3>
          <p className="text-body">Track meals, water intake and activity in one place – all backed by data‑driven insights.</p>
        </div>
      </section>
    </div>
  );
}
