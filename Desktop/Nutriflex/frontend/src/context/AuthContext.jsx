import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nutriflex_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // verify token on mount / when token changes
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.status === 'success') {
          setUser(res.data.data || res.data.user || {});
        } else {
          // unexpected shape – treat as invalid
          throw new Error('Invalid response');
        }
      } catch (e) {
        console.error('Token validation failed', e);
        localStorage.removeItem('nutriflex_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.status === 'success') {
      const { access_token, user: loggedUser } = res.data.data;
      localStorage.setItem('nutriflex_token', access_token);
      setToken(access_token);
      setUser(loggedUser);
      return { ok: true };
    }
    return { ok: false, message: res.data?.message || 'Login failed' };
  };

  const logout = () => {
    localStorage.removeItem('nutriflex_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const getAuthHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};
