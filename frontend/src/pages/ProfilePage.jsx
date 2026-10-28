import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Globe, 
  Phone, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  ShieldCheck,
  Save
} from 'lucide-react';
import { api, formatImageUrl } from '../services/api';
import '../styles/pages/sell.css';
import '../styles/pages/auth.css';

export default function ProfilePage({ user, onUpdateUser }) {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [country, setCountry] = useState(user?.country || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle Photo Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetUserId = user?.userId || user?.id;
    if (!targetUserId) {
      setError('User identifier missing. Please log in again.');
      return;
    }

    setUploadingPhoto(true);
    setError(null);
    try {
      const url = await api.upload.uploadImage(file);
      setProfilePhoto(url);
      await api.auth.updatePhoto(targetUserId, url);
      onUpdateUser({ ...user, profilePhoto: url });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload profile photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const targetUserId = user?.userId || user?.id;
    if (!targetUserId) {
      setError('User identifier missing. Please log in again.');
      return;
    }

    setSavingProfile(true);
    try {
      await api.auth.updateProfile(targetUserId, {
        fullName: fullName.trim(),
        country: country.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      onUpdateUser({ ...user, fullName, country, phoneNumber });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPassSuccess(false);

    const targetUserId = user?.userId || user?.id;
    if (!targetUserId) {
      setError('User identifier missing. Please log in again.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setChangingPass(true);
    try {
      await api.auth.changePassword(targetUserId, currentPassword, newPassword);
      setPassSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Failed to change password. Please verify your current password.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)', marginBottom: '0.5rem' }}>
            <User size={14} />
            <span>Account Settings</span>
          </div>
          <h1>User Profile</h1>
          <p>Manage your account credentials, contact information, and security preferences.</p>
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      {profileSuccess && (
        <div className="auth-alert auth-alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <span>Profile updated successfully!</span>
        </div>
      )}
      {passSuccess && (
        <div className="auth-alert auth-alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <span>Password changed successfully!</span>
        </div>
      )}

      {/* Profile Layout */}
      <div className="profile-grid">
        {/* Left Sidebar: Photo & Summary */}
        <div className="profile-sidebar-card">
          <div style={{ position: 'relative' }}>
            {profilePhoto ? (
              <img src={formatImageUrl(profilePhoto)} alt={user?.fullName} className="profile-avatar-large" />
            ) : (
              <div className="profile-avatar-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: '#F4EFEA', color: '#4A2C1A' }}>
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}

            <label
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                right: '0.25rem',
                background: 'var(--btn-deep-brown)',
                color: '#FFFFFF',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(74, 44, 26, 0.25)',
              }}
              title="Upload new photo"
            >
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              <Camera size={18} />
            </label>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>{user?.fullName}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{user?.email}</p>

          <span className="badge" style={{
            background: user?.role === 'ADMIN' ? 'rgba(196,154,74,0.15)' : 'rgba(74,44,26,0.08)',
            color: user?.role === 'ADMIN' ? '#7A4B2A' : '#4A2C1A',
            border: `1px solid ${user?.role === 'ADMIN' ? 'rgba(196,154,74,0.35)' : 'rgba(74,44,26,0.2)'}`,
            marginBottom: '1.5rem'
          }}>
            {user?.role === 'ADMIN' ? 'Administrator' : 'Customer (Bid & Sell)'}
          </span>

          <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', textAlign: 'left', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Account Status:</span>
              <span style={{ color: '#2E6B45', fontWeight: 600 }}>{user?.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Member Since:</span>
              <span style={{ color: 'var(--text-muted)' }}>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Forms Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* General Information Form */}
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="#4A2C1A" />
              <span>Personal Information</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    value={user?.email || ''}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <div className="input-wrapper">
                    <Globe size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      className="form-input"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-glow"
                disabled={savingProfile}
                style={{ width: 'fit-content', alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                <Save size={16} />
                <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={20} color="#FBBF24" />
              <span>Security & Password</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-outline"
                disabled={changingPass}
                style={{ width: 'fit-content', alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                <KeyRound size={16} />
                <span>{changingPass ? 'Updating...' : 'Change Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
