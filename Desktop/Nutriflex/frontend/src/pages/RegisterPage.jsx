import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth(); // just to know if already logged in

  useEffect(() => { if (token) navigate('/dashboard', { replace: true }); }, [token, navigate]);

  if (token) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/auth/register', { full_name: fullName, email, password });
      setSuccess('Registration successful! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.error || (e.request ? 'Could not reach the server. Please try again.' : 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream font-body">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#245C45' }}>NutriFlex Register</h2>
        {error && <div className="mb-4 text-sm text-red-600" role="alert">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-600" role="alert">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest focus:ring-forest"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest focus:ring-forest"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-md border-gray-300 pr-11 shadow-sm focus:border-forest focus:ring-forest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-gray-500 hover:text-forest focus:outline-none focus:ring-2 focus:ring-forest">
                {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative mt-1">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-md border-gray-300 pr-11 shadow-sm focus:border-forest focus:ring-forest"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} aria-pressed={showConfirmPassword} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-gray-500 hover:text-forest focus:outline-none focus:ring-2 focus:ring-forest">
                {showConfirmPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-forest hover:bg-forest-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest"
          >
            {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-forest hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
