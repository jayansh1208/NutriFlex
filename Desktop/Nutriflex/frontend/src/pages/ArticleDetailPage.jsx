import { ArrowLeft, Clock3 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const articles = {
  'importance-of-hydration': {
    title: 'Importance of Hydration', category: 'WELLNESS', readTime: '3 min read',
    description: 'Why water drives energy, digestion and appetite — and how to actually drink enough through an Indian day.',
    image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=1500&q=85',
    imageAlt: 'Clear water being poured into a glass',
    paragraphs: ['Water is the medium your body runs in: it transports nutrients, cushions joints, and regulates temperature. Even mild dehydration can affect focus and leave you feeling tired or thirsty. A practical daily target depends on your body, activity, health and climate; needs often rise in Indian summers or on workout days. Follow your thirst and any guidance from your healthcare professional.', 'Make hydration easier by attaching it to habits you already have: a glass after waking, one with each meal, and another during a tea break. Water-rich foods, buttermilk and unsweetened drinks can contribute too. Keep a bottle nearby and use the NutriFlex water tracker to notice your patterns without treating one number as a rule.'],
  },
  'macronutrients': {
    title: 'Understanding Macronutrients', category: 'FUNDAMENTALS', readTime: '5 min read',
    description: 'Protein, carbohydrates and fats explained — what each does for your body and how to build a balanced day.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1500&q=85', imageAlt: 'A nourishing meal with vegetables and grains',
    paragraphs: ['Macronutrients are the nutrients your body needs in larger amounts: carbohydrates, protein and fat. They all play useful roles, and foods often contain a mix of them.', 'Carbohydrates provide energy and are found in foods such as rice, roti, fruit and pulses. Protein supports the maintenance and repair of body tissues; dal, beans, paneer, eggs and fish are familiar sources. Dietary fats help your body absorb some vitamins and can be found in nuts, seeds and cooking oils.', 'Rather than trying to remove a whole group, build meals around a variety of foods that suit your needs. Your portions and nutrition requirements can vary with health, activity and personal goals.'],
  },
  'balanced-meals': {
    title: 'How to Build Balanced Meals', category: 'HEALTHY HABITS', readTime: '4 min read',
    description: 'A practical plate-building method you can use with any cuisine, including everyday Indian meals.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1500&q=85', imageAlt: 'A colorful balanced meal',
    paragraphs: ['A balanced meal does not need complicated rules. A simple starting point is to include vegetables or fruit, a source of protein, and grains or other energy-giving foods. Add a little fat from ingredients such as nuts, seeds or cooking oil.', 'For an Indian meal, that could mean rice or roti with dal, sabzi and curd. You can adjust ingredients and portions to suit your appetite, preferences and health needs. Frozen and seasonal produce can both make a meal more varied.', 'Aim for a pattern that feels satisfying and practical to repeat. Variety across the week matters more than making every plate look exactly the same.'],
  },
  'indian-choices': {
    title: 'Healthy Indian Food Choices', category: 'INDIAN DIET', readTime: '6 min read',
    description: 'Simple, satisfying swaps that make familiar Indian meals more nourishing without losing their joy.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1500&q=85', imageAlt: 'A traditional Indian meal served with vegetables',
    paragraphs: ['Healthy eating can keep the dishes and flavors you love. Small adjustments to ingredients, cooking methods and variety can make everyday meals work better for you.', 'Try adding a seasonal vegetable or a bowl of dal to a meal, choosing whole grains when you enjoy them, or including fruit and roasted chana as snacks. Curd, beans, lentils, eggs and paneer can all contribute protein depending on your preferences.', 'There is no single perfect Indian diet. Build a flexible pattern that fits your culture, budget, schedule and health needs, and ask a qualified professional for advice tailored to you.'],
  },
};

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const article = articles[slug];
  if (!article) return <div className="nf-article-not-found"><h1>Article not found</h1><p>We couldn't locate that article.</p><Link to="/hub">Back to Educational Hub</Link></div>;

  return <article className="nf-article-page">
    <Link to="/hub" className="nf-article-back"><ArrowLeft size={14}/> All articles</Link>
    <img className="nf-article-hero-image" src={article.image} alt={article.imageAlt}/>
    <div className="nf-article-meta"><span>{article.category}</span><small><Clock3 size={12}/>{article.readTime}</small></div>
    <h1>{article.title}</h1><p className="nf-article-deck">{article.description}</p>
    <div className="nf-article-body">{article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    <aside className="nf-article-disclaimer">This article is for education only and is not medical advice. Nutrition needs vary — consult a qualified healthcare professional for clinical concerns.</aside>
  </article>;
}
