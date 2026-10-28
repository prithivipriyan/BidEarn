import React from 'react';
import { Gavel, UserCheck, Shield, HelpCircle, Compass, LogIn, UserPlus } from 'lucide-react';
import '../styles/components/navbar.css';

export default function Navbar({ onOpenAuthModal }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#welcome" className="nav-brand">
          <div className="brand-icon-wrapper">
            <Gavel size={22} />
          </div>
          <span className="brand-name">
            Bid<span>Earn</span>
          </span>
        </a>

        {/* Center Nav Links */}
        <ul className="nav-links">
          <li>
            <a href="#features" className="nav-link">
              <Compass size={16} />
              <span>Features</span>
            </a>
          </li>
        </ul>

        {/* Right Action Buttons */}
        <div className="nav-actions">
          <button
            id="nav-login-btn"
            className="btn btn-outline btn-login"
            onClick={() => onOpenAuthModal('login')}
          >
            <LogIn size={16} />
            <span>Login</span>
          </button>
          <button
            id="nav-register-btn"
            className="btn btn-primary btn-register btn-glow"
            onClick={() => onOpenAuthModal('register')}
          >
            <UserPlus size={16} />
            <span>Register</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
