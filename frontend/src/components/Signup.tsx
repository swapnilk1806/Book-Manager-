import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SignupProps {
  onSwitch: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fadeInUp">
        <div style={{ fontSize: '3rem', textAlign: 'center' }}>📚</div>
        <h2>Create Account</h2>
        <p>Start your reading journey today</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? '...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account? <button onClick={onSwitch}>Sign In</button>
        </div>
      </div>
    </div>
  );
};