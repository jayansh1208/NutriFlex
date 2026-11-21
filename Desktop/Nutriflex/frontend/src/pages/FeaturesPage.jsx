
import { ClipboardList, Droplet, Calendar, Users, BarChart2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Smart Food Tracking',
    desc: 'Log meals with an Indian food database, auto‑calculate calories and macros.',
    icon: ClipboardList,
    cta: '/features',
    ctaLabel: 'Learn More',
  },
  {
    title: 'Hydration Tracker',
    desc: 'Stay hydrated with reminders and water‑intake charts.',
    icon: Droplet,
    cta: '/features',
    ctaLabel: 'Learn More',
  },
  {
    title: 'Personalized Diet Plans',
    desc: 'Tailor‑made meal plans based on goals, activity and dietary preferences.',
    icon: Calendar,
    cta: '/features',
    ctaLabel: 'Learn More',
  },
  {
    title: 'Expert Nutritionist Consultations',
    desc: 'Book video calls with certified Indian nutritionists.',
    icon: Users,
    cta: '/nutritionists',
    ctaLabel: 'Find a Nutritionist',
  },
  {
    title: 'Progress Insights',
    desc: 'Visual dashboards for weight, macro, water and activity trends.',
    icon: BarChart2,
    cta: '/features',
    ctaLabel: 'See Insights',
  },
  {
    title: 'Educational Hub',
    desc: 'Access articles, guides and videos on nutrition and wellness.',
    icon: BookOpen,
    cta: '/hub',
    ctaLabel: 'Explore Hub',
  },
];

export default function FeaturesPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8 px-4">
      <section className="text-center py-12 bg-mint rounded-lg shadow">
        <h1 className="text-4xl font-heading text-forest mb-4">Our Premium Features</h1>
        <p className="text-body text-lg max-w-2xl mx-auto">
          NutriFlex brings together science‑backed nutrition tools and expert guidance to help you live your healthiest life.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="p-6 bg-cream rounded-lg shadow border border-sage flex flex-col items-center text-center">
              <Icon className="w-12 h-12 text-forest mb-4" />
              <h3 className="text-xl font-heading text-forest mb-2">{f.title}</h3>
              <p className="text-body mb-4">{f.desc}</p>
              <Link to={f.cta} className="text-gold underline">{f.ctaLabel}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

