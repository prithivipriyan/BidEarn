import React, { useState, useEffect } from 'react';
import { 
  Package, 
  PlusCircle, 
  Search, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import { api, formatImageUrl, formatDateTimeIST } from '../services/api';
import '../styles/pages/dashboard.css';
import '../styles/pages/auction-detail.css';

export default function MyListingsPage({ user, onNavigate, onSelectAuction }) {
  const [listings, setListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserListings();
  }, [user]);

  const loadUserListings = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const data = await api.auctions.getBySeller(user.userId);
      setListings(data || []);
    } catch (err) {
      console.error('Failed to load user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getListingStatusInfo = (auc) => {
    const now = new Date();
    const start = new Date(auc.startTime);
    const end = new Date(auc.endTime);

    if (auc.status === 'PENDING') {
      return {
        label: 'Pending Admin Review',
        badgeClass: 'badge-pending',
        style: { background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' },
        hint: 'Awaiting moderation by Admin. Once approved, it will be published.',
        tabGroup: 'PENDING'
      };
    }

    if (auc.status === 'ACTIVE') {
      if (start <= now && end >= now) {
        return {
          label: 'Live Now',
          badgeClass: 'badge-live',
          style: { background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' },
          hint: 'Active and currently accepting bids in Live Catalog.',
          tabGroup: 'LIVE'
        };
      } else if (start > now) {
        return {
          label: 'Upcoming / Scheduled',
          badgeClass: 'badge-upcoming',
          style: { background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)' },
          hint: `Starts: ${formatDateTimeIST(auc.startTime)} (IST)`,
          tabGroup: 'UPCOMING'
        };
      } else {
        return {
          label: 'Ended',
          badgeClass: 'badge-ended',
          style: { background: '#F4EFEA', color: 'var(--text-muted)', border: '1px solid #E8DED2' },
          hint: 'Bidding time expired.',
          tabGroup: 'ENDED'
        };
      }
    }

    return {
      label: auc.status,
      badgeClass: 'badge-ended',
      style: { background: 'rgba(163, 58, 50, 0.1)', color: '#A33A32', border: '1px solid rgba(163, 58, 50, 0.3)' },
      hint: `Auction ${auc.status.toLowerCase()}.`,
      tabGroup: 'ENDED'
    };
  };

  const filtered = listings.filter((auc) => {
    const item = auc.item || {};
    const matchesSearch = (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.category || '').toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;

    const statusInfo = getListingStatusInfo(auc);
    return statusInfo.tabGroup === statusFilter || auc.status === statusFilter;
  });

  const pendingCount = listings.filter(a => a.status === 'PENDING').length;
  const liveCount = listings.filter(a => {
    const s = getListingStatusInfo(a);
    return s.tabGroup === 'LIVE';
  }).length;

  return (
    <div className="my-listings-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)', marginBottom: '0.5rem' }}>
            <Package size={14} />
            <span>Seller Dashboard</span>
          </div>
          <h1>My Published Listings</h1>
          <p>Track all products you have listed for auction, view approval status, and monitor live bids.</p>
        </div>

        <button className="btn btn-primary btn-glow" onClick={() => onNavigate('sell-now')}>
          <PlusCircle size={16} />
          <span>List Another Product</span>
        </button>
      </div>

      {/* Workflow Info Alert */}
      {pendingCount > 0 && (
        <div className="auth-alert" style={{ background: 'rgba(196, 154, 74, 0.12)', border: '1px solid rgba(196, 154, 74, 0.3)', color: '#7A4B2A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={20} color="#FBBF24" />
            <span>
              You have <strong>{pendingCount} item{pendingCount > 1 ? 's' : ''}</strong> waiting for administrator approval. Listings move from <em>Pending</em> to <em>Live / Upcoming</em> once approved in the Admin Moderation portal.
            </span>
          </div>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="dashboard-stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Listings</span>
            <span className="stat-number">{listings.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Live On Marketplace</span>
            <span className="stat-number">{liveCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Approval</span>
            <span className="stat-number" style={{ color: pendingCount > 0 ? '#FBBF24' : '#FFFFFF' }}>{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="section-toolbar">
        <div className="category-filter-bar" style={{ marginBottom: 0 }}>
          {[
            { key: 'ALL', label: 'All Items' },
            { key: 'PENDING', label: `Pending (${pendingCount})` },
            { key: 'LIVE', label: `Live Now (${liveCount})` },
            { key: 'UPCOMING', label: 'Upcoming' },
            { key: 'ENDED', label: 'Ended / Closed' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`category-chip ${statusFilter === tab.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search my listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Listings Table / Grid */}
      {loading ? (
        <div className="empty-state">
          <p>Loading your listings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={32} />
          </div>
          <h3>No Listings Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {statusFilter === 'ALL'
              ? "You haven't listed any items for auction yet. Start monetizing your valuable items today!"
              : `No items found under "${statusFilter}" status.`}
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('sell-now')}>
            Sell an Item
          </button>
        </div>
      ) : (
        <div className="bid-history-table-wrapper" style={{ marginTop: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Starting Price</th>
                <th>Current Leading Bid</th>
                <th>Duration / Schedule</th>
                <th>Listing Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((auc) => {
                const item = auc.item || {};
                const statusInfo = getListingStatusInfo(auc);
                const isPending = auc.status === 'PENDING';

                return (
                  <tr key={auc.auctionId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={formatImageUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={item.name}
                          style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.95rem' }}>
                            {item.name || 'Untitled Item'}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            {item.category || 'General'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ color: '#CBD5E1', fontWeight: 500 }}>
                      ${Number(auc.startingPrice || 0).toLocaleString()}
                    </td>

                    <td style={{ fontWeight: 700, color: '#34D399', fontSize: '1rem' }}>
                      ${Number(auc.currentPrice || auc.startingPrice || 0).toLocaleString()}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                        Starts: {formatDateTimeIST(auc.startTime)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                        Ends: {formatDateTimeIST(auc.endTime)}
                      </div>
                    </td>

                    <td>
                      <div>
                        <span className="badge" style={statusInfo.style}>
                          {statusInfo.label}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem', maxWidth: '180px' }}>
                          {statusInfo.hint}
                        </div>
                      </div>
                    </td>

                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                        onClick={() => onSelectAuction(auc.auctionId)}
                      >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
