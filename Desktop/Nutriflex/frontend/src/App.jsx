import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import NutritionistsPage from './pages/NutritionistsPage';
import NutritionistDetailPage from './pages/NutritionistDetailPage';
import HubPage from './pages/HubPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import DietPlanPage from './pages/DietPlanPage';

function SignedInRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="nf-loading">Loading your account…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/nutritionists" element={<NutritionistsPage />} />
          <Route path="/nutritionists/:id" element={<NutritionistDetailPage />} />
          <Route path="/hub" element={<HubPage />} />
          <Route path="/hub/:slug" element={<ArticleDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<SignedInRoute><OnboardingPage /></SignedInRoute>} />
          <Route path="/dashboard" element={<SignedInRoute><DashboardPage /></SignedInRoute>} />
          <Route path="/admin" element={<SignedInRoute><AdminPage /></SignedInRoute>} />
          <Route path="/diet-plan" element={<SignedInRoute><DietPlanPage /></SignedInRoute>} />
        </Route>
      </Routes>
  );
}

export default App;
