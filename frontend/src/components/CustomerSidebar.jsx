import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  CalendarClock, 
  Heart, 
  History, 
  PlusCircle, 
  Package,
  User, 
  HelpCircle, 
  LogOut, 
  Gavel 
} from 'lucide-react';
import { formatImageUrl } from '../services/api';
import '../styles/components/sidebar.css';

export default function CustomerSidebar({ activePage, onNavigate, user, onLogout }) {
  const menuItems = [
    { id: 'customer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-auctions', label: 'Live Auctions', icon: Flame, badge: 'Live' },
    { id: 'upcoming-auctions', label: 'Upcoming', icon: CalendarClock },
    { id: 'watchlist', label: 'My Watchlist', icon: Heart },
    { id: 'my-bids', label: 'My Bids', icon: History },
    { id: 'my-listings', label: 'My Listings', icon: Package },
    { id: 'sell-now', label: 'Sell Item', icon: PlusCircle },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help-center', label: 'Help Center', icon: HelpCircle },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <a href="#dashboard" className="sidebar-brand" onClick={(e) => { e.preventDefault(); onNavigate('customer-dashboard'); }}>
        <div className="brand-icon-wrapper" style={{ width: '36px', height: '36px' }}>
          <Gavel size={18} />
        </div>
        <span className="brand-name" style={{ fontSize: '1.25rem' }}>
          Bid<span>Earn</span>
        </span>
      </a>

      {/* Navigation Menu */}
      <ul className="sidebar-menu">
        <li className="sidebar-menu-heading">Customer Portal</li>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <li key={item.id}>
              <button
                id={`sidebar-${item.id}`}
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

      {/* User Snippet Footer */}
      <div className="sidebar-footer">
        <div className="user-snippet" onClick={() => onNavigate('profile')}>
          {user?.profilePhoto ? (
            <img src={formatImageUrl(user.profilePhoto)} alt={user.fullName} className="user-avatar-sm" />
          ) : (
            <div className="user-avatar-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          )}
          <div className="user-meta-sm">
            <span className="user-name-sm">{user?.fullName || 'Customer'}</span>
            <span className="user-role-badge">Customer Account</span>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
