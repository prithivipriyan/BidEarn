import React, { useEffect } from 'react';
import { X, User, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import '../styles/components/role-modal.css';

export default function RoleSelectModal({ isOpen, mode, onClose, onSelectRole }) {
  // Allow closing via Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLogin = mode === 'login';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          id="modal-close-btn"
          className="modal-close-btn"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="badge badge-live" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} />
            <span>Select Portal</span>
          </div>
          <h2 className="modal-title">
            {isLogin ? 'Login to BidEarn' : 'Join BidEarn'}
          </h2>
          <p className="modal-subtitle">
            {isLogin
              ? 'Choose which portal you would like to access'
              : 'Select your account type to proceed with registration'}
          </p>
        </div>

        {/* Role Options */}
        <div className="role-options">
          {/* Customer Option */}
          <div
            id="role-customer-card"
            className="role-card"
            onClick={() => onSelectRole('customer', mode)}
          >
            <div className="role-icon-box">
              <User size={26} />
            </div>
            <div className="role-info">
              <div className="role-header-row">
                <span className="role-name">Customer Portal</span>
                <span className="role-badge">Bid & Sell</span>
              </div>
              <p className="role-desc">
                Bid on live auctions and list your own products for sale — all on a single unified account.
              </p>
            </div>
            <ArrowRight size={20} className="role-arrow" />
          </div>

          {/* Admin Option */}
          <div
            id="role-admin-card"
            className="role-card role-card-admin"
            onClick={() => onSelectRole('admin', 'login')}
          >
            <div className="role-icon-box">
              <ShieldAlert size={26} />
            </div>
            <div className="role-info">
              <div className="role-header-row">
                <span className="role-name">Admin Portal</span>
                <span className="role-badge">{isLogin ? 'Management' : 'Pre-Configured'}</span>
              </div>
              <p className="role-desc">
                {isLogin
                  ? 'Moderate auctions, manage user statuses, approve item listings, and monitor platform analytics.'
                  : 'Admin accounts are pre-configured by the system. Click here to sign in to the Admin Portal.'}
              </p>
            </div>
            <ArrowRight size={20} className="role-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}
