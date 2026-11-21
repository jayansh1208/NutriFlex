import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="nf-site flex flex-col min-h-screen bg-cream">
      <Navbar />
      <main className="nf-main flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
