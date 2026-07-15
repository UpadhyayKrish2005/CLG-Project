import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../AuthContext/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card task-form">
        <div className="form-heading" style={{ justifyContent: 'center', marginBottom: '30px' }}>
          <span className="brand-mark" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>SP</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem' }}>Sign In</h2>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Welcome back to Study Planner.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="auth-footer" style={{ textAlign: 'center', marginTop: '20px', color: '#6a7280', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2d6568', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;