import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/features', label: 'Features' },
    { to: '/nutritionists', label: 'Nutritionists' },
    { to: '/hub', label: 'Educational Hub' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  return (
    <nav className="bg-forest text-cream py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="text-2xl font-heading">
          NutriFlex
        </Link>
        <ul className="flex space-x-4 text-body">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  isActive ? 'text-gold underline' : 'hover:text-sage'
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
