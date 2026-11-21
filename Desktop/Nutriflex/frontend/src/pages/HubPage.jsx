import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const articles = [
  { category: 'FUNDAMENTALS', title: 'Understanding Macronutrients', description: 'Protein, carbohydrates and fats explained — what each does for your body and how to build a balanced day.', slug: 'macronutrients', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=85' },
  { category: 'HEALTHY HABITS', title: 'How to Build Balanced Meals', description: 'A practical plate-building method you can use with any cuisine, including everyday Indian meals.', slug: 'balanced-meals', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85' },
  { category: 'INDIAN DIET', title: 'Healthy Indian Food Choices', description: 'Simple, satisfying swaps that make familiar Indian meals more nourishing without losing their joy.', slug: 'indian-choices', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1400&q=85' },
];

export default function HubPage() {
  return <div className="nf-page nf-hub-page">
    <header className="nf-page-hero"><div className="nf-kicker"><BookOpen size={14}/> LEARN AS YOU GO</div><h1>Educational Hub</h1><p>Good nutrition starts with clear, useful information. Explore approachable guides to balanced meals, everyday Indian food and the nutrients your body needs.</p></header>
    <section className="nf-hub-featured"><div className="nf-hub-heading"><div><div className="nf-kicker">EXPLORE THE LIBRARY</div><h2>Nutrition, made easier to understand</h2></div><span>3 practical guides</span></div>
      <div className="nf-article-grid">{articles.map(article => <Link key={article.slug} to={`/hub/${article.slug}`} className="nf-article-card"><img src={article.image} alt="" loading="lazy"/><div><span>{article.category}</span><h3>{article.title}</h3><p>{article.description}</p><small><Clock3 size={13}/>{article.readTime}<b>Read article <ArrowRight size={14}/></b></small></div></Link>)}</div>
    </section>
    <aside className="nf-hub-note"><BookOpen size={19}/><p>Articles are designed for general education and everyday wellness. For personal medical or nutrition advice, speak with a qualified professional.</p></aside>
  </div>;
}
