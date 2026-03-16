import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Admin Login</h2>
        <p>Uses /auth/admin-login flow</p>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          required
        />
        {error && <div className="error-msg">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? <span className="btn-inline-loader"><span className="spinner sm" />Signing in...</span> : 'Sign in'}
        </button>
        <span>
          No admin account? <Link to="/signup">Create admin account</Link>
        </span>
      </form>
    </div>
  );
}
