import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const articles = {
  'macronutrients': {
    title: 'Understanding Macronutrients',
    sections: [
      { heading: 'What are Macronutrients?', content: 'Macronutrients are the three main nutrients that provide energy: carbohydrates, proteins and fats. Each plays a distinct role in the body.' },
      { heading: 'Carbohydrates', content: 'Primary source of quick energy. Indian staples like rice, roti, and lentils are carbohydrate‑rich. Choose complex carbs for sustained release.' },
      { heading: 'Proteins', content: 'Essential for tissue repair and muscle maintenance. Sources include dal, paneer, lentils, eggs, and fish.' },
      { heading: 'Fats', content: 'Necessary for hormone production and nutrient absorption. Opt for healthy fats from nuts, seeds, ghee, and olive oil.' },
    ],
    takeaway: 'Balance all three macronutrients in each meal for stable energy and optimal health.',
  },
  'balanced-meals': {
    title: 'How to Build Balanced Meals',
    sections: [
      { heading: 'Plate Method', content: 'Divide your plate: half vegetables, a quarter protein, a quarter complex carbs.' },
      { heading: 'Indian Meal Example', content: '• 1 cup brown rice (carbs)\n• 1 cup mixed vegetable sabzi (veg)\n• 100 g grilled paneer or lentils (protein)\n• A drizzle of olive oil (healthy fat)' },
      { heading: 'Portion Sizes', content: 'Use a handful of grains, a palm‑size of protein, and as much veg as possible.' },
    ],
    takeaway: 'A simple visual guide helps you create nutritionally complete meals without counting calories.',
  },
  'indian-choices': {
    title: 'Healthy Indian Food Choices',
    sections: [
      { heading: 'Whole Grains', content: 'Swap white rice with brown rice, millets (ragi, jowar) or quinoa for higher fiber.' },
      { heading: 'Legumes & Pulses', content: 'Dal, chickpeas, kidney beans provide plant‑based protein and fiber.' },
      { heading: 'Healthy Fats', content: 'Use mustard oil, ghee in moderation, and add nuts/seeds to dishes.' },
      { heading: 'Smart Snacks', content: 'Choose roasted chana, fruit chaat, or sprouted moong over processed namkeens.' },
    ],
    takeaway: 'Small swaps in everyday Indian cooking dramatically improve nutrient density.',
  },
};

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const article = articles[slug];

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-3xl font-heading text-forest mb-4">Article Not Found</h2>
        <p className="text-body mb-6">We couldn't locate the requested article.</p>
        <Link to="/hub" className="text-gold underline">Back to Hub</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <Link to="/hub" className="flex items-center text-gold underline mb-4">
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Hub
      </Link>
      <h1 className="text-4xl font-heading text-forest mb-4">{article.title}</h1>
      {article.sections.map((sec, i) => (
        <section key={i}>
          <h2 className="text-2xl font-heading text-forest mb-2">{sec.heading}</h2>
          <p className="text-body mb-4 whitespace-pre-line">{sec.content}</p>
        </section>
      ))}
      <blockquote className="border-l-4 border-forest pl-4 italic text-body">
        {article.takeaway}
      </blockquote>
      <section className="mt-8">
        <h3 className="text-xl font-heading text-forest mb-2">Related Articles</h3>
        <ul className="list-disc list-inside text-body">
          {Object.entries(articles)
            .filter(([key]) => key !== slug)
            .map(([key, val]) => (
              <li key={key}>
                <Link to={`/hub/${key}`} className="text-gold underline">{val.title}</Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
