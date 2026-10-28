import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gavel, 
  Flame, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import '../styles/pages/dashboard.css';
import '../styles/pages/auction-detail.css';

export default function AdminDashboard({ user, onNavigate }) {
  const [usersCount, setUsersCount] = useState(0);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [pendingAuctions, setPendingAuctions] = useState([]);
  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const usersList = await api.auth.getAllUsers();
      setUsersCount(usersList?.length || 0);

      // 2. Fetch Auctions
      const allList = await api.auctions.getAll();
      setAllAuctions(allList || []);

      const pending = await api.auctions.getPending();
      setPendingAuctions(pending || []);

      const active = (allList || []).filter((a) => a.status === 'ACTIVE');
      setActiveAuctions(active);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (auctionId) => {
    try {
      await api.auctions.approve(auctionId);
      loadAdminStats();
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  return (
    <div className="admin-dashboard-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)', marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} />
            <span>Administrator Control Center</span>
          </div>
          <h1>System Overview & Moderation</h1>
          <p>Real-time platform metrics, pending approvals, and system audit tools.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button className="btn btn-outline" onClick={() => onNavigate('admin-users')}>
            <Users size={16} />
            <span>Manage Users</span>
          </button>
          <button className="btn btn-primary btn-glow" onClick={() => onNavigate('admin-auctions')}>
            <Gavel size={16} />
            <span>Moderate Auctions</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Registered Users</span>
            <span className="stat-number">{usersCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(46, 107, 69, 0.1)', color: '#2E6B45' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Live Auctions</span>
            <span className="stat-number">{activeAuctions.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(196, 154, 74, 0.15)', color: '#7A4B2A' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Review</span>
            <span className="stat-number" style={{ color: pendingAuctions.length > 0 ? '#7A4B2A' : '#2B211B' }}>
              {pendingAuctions.length}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(122, 75, 42, 0.12)', color: '#7A4B2A' }}>
            <Gavel size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Listings</span>
            <span className="stat-number">{allAuctions.length}</span>
          </div>
        </div>
      </div>

      {/* Pending Review Section */}
      <div className="bid-history-table-wrapper" style={{ marginBottom: '2.5rem' }}>
        <div className="table-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={19} color="#FBBF24" />
            <span>Listings Awaiting Approval ({pendingAuctions.length})</span>
          </div>
          <button className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }} onClick={() => onNavigate('admin-auctions')}>
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {pendingAuctions.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto 0.5rem auto' }} />
            <p>All submitted listings have been reviewed and approved!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Seller</th>
                <th>Starting Price</th>
                <th>Scheduled Start</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAuctions.map((auc) => (
                <tr key={auc.auctionId}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={auc.item?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={auc.item?.name}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{auc.item?.name}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{auc.item?.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>{auc.seller?.fullName || 'Seller'}</td>
                  <td style={{ fontWeight: 700, color: '#34D399' }}>
                    ${Number(auc.startingPrice).toLocaleString()}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(auc.startTime).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                      onClick={() => handleApprove(auc.auctionId)}
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
