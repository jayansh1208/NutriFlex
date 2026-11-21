import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  { name: 'Starter', price: '₹0', period: 'forever', intro: 'A simple start for building healthier habits.', features: ['Food and water tracking', 'Personalized weekly diet plan', 'Educational hub access', 'Progress dashboard'], action: 'Get started', to: '/register' },
  { name: 'Pro', price: '₹499', period: '/ month', intro: 'More guidance for your everyday nutrition.', features: ['Everything in Starter', 'Priority nutritionist discovery', 'Deeper weekly insights', 'Personalized goal adjustments'], action: 'Choose Pro', to: '/register', popular: true },
  { name: 'Elite', price: '₹999', period: '/ month', intro: 'Dedicated support to stay on track.', features: ['Everything in Pro', 'Priority consultation booking', 'Enhanced meal planning', 'Ongoing expert guidance'], action: 'Choose Elite', to: '/register' },
];
const faqs = [
  ['Can I change my plan later?', 'Yes. You can change your plan whenever your needs change.'],
  ['Are consultations included?', 'Consultations are booked separately with the nutritionist. Each profile displays its per-session price.'],
  ['Are these live subscription plans?', 'The plans shown are illustrative for this demo. Recurring subscription billing is not enabled.'],
];

export default function PricingPage() {
  return <div className="nf-page nf-pricing">
    <header className="nf-page-hero"><div className="nf-kicker">SIMPLE, FLEXIBLE PLANS</div><h1>Make room for better habits.</h1><p>Start with the essentials and choose the level of guidance that fits your nutrition journey.</p></header>
    <div className="nf-plan-grid">{plans.map(plan => <article key={plan.name} className={`nf-plan-card ${plan.popular ? 'popular' : ''}`}>{plan.popular && <div className="nf-plan-badge">MOST POPULAR</div>}<span>{plan.name.toUpperCase()}</span><h2>{plan.name}</h2><div className="nf-plan-price">{plan.price}<small> {plan.period}</small></div><p>{plan.intro}</p><ul>{plan.features.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul><Link className={`nf-pill-button ${plan.popular ? 'filled' : 'outline'}`} to={plan.to}>{plan.action}</Link></article>)}</div>
    <section className="nf-faq"><div className="nf-kicker">GOOD TO KNOW</div><h2>Frequently asked questions</h2>{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</section>
  </div>;
}
