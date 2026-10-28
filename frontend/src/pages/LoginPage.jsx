import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn, ShieldAlert, UserCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import ChangePasswordModal from '../components/ChangePasswordModal';
import '../styles/pages/auth.css';

export default function LoginPage({ initialRole = 'customer', onLoginSuccess, onNavigate }) {
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await api.auth.login(email.trim(), password);
      // Validate role if logging into admin
      if (role === 'admin' && user.role !== 'ADMIN') {
        throw new Error('This account does not have Administrator privileges');
      }
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Back to Home Button */}
      <div className="auth-back-btn" onClick={() => onNavigate('welcome')}>
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            {role === 'admin' ? <ShieldAlert size={15} /> : <UserCheck size={15} />}
            <span>{role === 'admin' ? 'Admin Portal' : 'Customer Portal'}</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your BidEarn account to continue</p>
        </div>

        {/* Role Toggle */}
        <div className="auth-role-toggle">
          <button
            type="button"
            className={`auth-role-btn ${role === 'customer' ? 'active' : ''}`}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={`auth-role-btn ${role === 'admin' ? 'active admin-active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Administrator
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{role === 'admin' ? 'Username or Email' : 'Email Address'}</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type={role === 'admin' ? 'text' : 'email'}
                className="form-input"
                placeholder={role === 'admin' ? 'admin or admin@bidearn.com' : 'your.email@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-helper-row">
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <span className="forgot-link" onClick={() => setIsChangeModalOpen(true)}>
                Change password?
              </span>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn btn-glow"
            disabled={loading}
          >
            <LogIn size={18} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="auth-footer">
          <span>Don't have an account?</span>
          <span className="auth-link" onClick={() => onNavigate('register')}>
            Create one
          </span>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        initialEmail={email}
      />
    </div>
  );
}
