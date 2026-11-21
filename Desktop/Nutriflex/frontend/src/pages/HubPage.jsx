import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Book, FileText } from 'lucide-react';

const categories = [
  { name: 'Macronutrients', icon: BookOpen, slug: 'macronutrients' },
  { name: 'Meal Planning', icon: Book, slug: 'balanced-meals' },
  { name: 'Indian Nutrition', icon: FileText, slug: 'indian-choices' },
];

const articles = [
  { title: 'Understanding Macronutrients', slug: 'macronutrients' },
  { title: 'How to Build Balanced Meals', slug: 'balanced-meals' },
  { title: 'Healthy Indian Food Choices', slug: 'indian-choices' },
];

export default function HubPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8 px-4">
      {/* Hero */}
      <section className="text-center py-12 bg-mint rounded-lg shadow">
        <h1 className="text-4xl font-heading text-forest mb-4">Educational Hub</h1>
        <p className="text-body text-lg max-w-2xl mx-auto">
          Discover evidence‑based articles, guides and videos to deepen your nutrition knowledge.
        </p>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-heading text-forest mb-6 text-center">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.slug} to={`/hub/${c.slug}`} className="p-6 bg-cream rounded-lg shadow border border-sage flex flex-col items-center text-center">
                <Icon className="w-12 h-12 text-forest mb-4" />
                <h3 className="text-xl font-heading text-forest">{c.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Articles */}
      <section>
        <h2 className="text-3xl font-heading text-forest mb-6 text-center">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <div key={a.slug} className="p-4 bg-cream rounded-lg shadow border border-sage">
              <h3 className="font-heading text-forest mb-2">{a.title}</h3>
              <Link to={`/hub/${a.slug}`} className="text-gold underline">Read Article</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
