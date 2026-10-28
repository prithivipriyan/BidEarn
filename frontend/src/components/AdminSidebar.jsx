import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Gavel, 
  ShieldCheck, 
  User, 
  LogOut 
} from 'lucide-react';
import { formatImageUrl } from '../services/api';
import '../styles/components/sidebar.css';

export default function AdminSidebar({ activePage, onNavigate, user, onLogout }) {
  const menuItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'admin-auctions', label: 'Auction Approvals', icon: Gavel },
    { id: 'profile', label: 'Admin Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <a href="#admin" className="sidebar-brand" onClick={(e) => { e.preventDefault(); onNavigate('admin-dashboard'); }}>
        <div className="brand-icon-wrapper" style={{ width: '36px', height: '36px' }}>
          <Gavel size={18} />
        </div>
        <span className="brand-name" style={{ fontSize: '1.25rem' }}>
          Bid<span>Earn</span>
        </span>
      </a>

      {/* Navigation Menu */}
      <ul className="sidebar-menu">
        <li className="sidebar-menu-heading">Admin Management</li>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <li key={item.id}>
              <button
                id={`admin-sidebar-${item.id}`}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                style={{ width: '100%', background: 'none' }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Admin Snippet Footer */}
      <div className="sidebar-footer">
        <div className="user-snippet" onClick={() => onNavigate('profile')}>
          {user?.profilePhoto ? (
            <img src={formatImageUrl(user.profilePhoto)} alt={user.fullName} className="user-avatar-sm" />
          ) : (
            <div className="user-avatar-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
          )}
          <div className="user-meta-sm">
            <span className="user-name-sm">{user?.fullName || 'Administrator'}</span>
            <span className="user-role-badge">Super Admin</span>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
