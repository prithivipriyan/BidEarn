import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  AlertCircle,
  Clock,
  Ban
} from 'lucide-react';
import { api, formatDateTimeIST } from '../services/api';
import '../styles/pages/dashboard.css';
import '../styles/pages/auction-detail.css';

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    setLoading(true);
    try {
      const list = await api.auctions.getAll();
      setAuctions(list || []);
    } catch (err) {
      console.error('Failed to load auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (auctionId) => {
    try {
      await api.auctions.approve(auctionId);
      setMsg('Auction approved and set to ACTIVE!');
      setTimeout(() => setMsg(null), 3000);
      loadAuctions();
    } catch (err) {
      setError(err.message || 'Approve failed');
    }
  };

  const handleTerminate = async (auctionId) => {
    if (!window.confirm('Are you sure you want to terminate this auction?')) return;
    try {
      await api.auctions.terminate(auctionId);
      setMsg('Auction has been terminated.');
      setTimeout(() => setMsg(null), 3000);
      loadAuctions();
    } catch (err) {
      setError(err.message || 'Terminate failed');
    }
  };

  const filtered = auctions.filter((auc) => {
    const item = auc.item || {};
    const matchesSearch = (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (auc.seller?.fullName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || auc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-auctions-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)', marginBottom: '0.5rem' }}>
            <Gavel size={14} />
            <span>Auction Moderation</span>
          </div>
          <h1>Auction Management</h1>
          <p>Review submitted listings, approve pending auctions, or terminate active bidding.</p>
        </div>
      </div>

      {/* Notifications */}
      {msg && (
        <div className="auth-alert auth-alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Status Filter Tabs & Search */}
      <div className="section-toolbar">
        <div className="category-filter-bar" style={{ marginBottom: 0 }}>
          {['ALL', 'PENDING', 'ACTIVE', 'SOLD', 'UNSOLD', 'TERMINATED'].map((st) => (
            <button
              key={st}
              className={`category-chip ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search item or seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="empty-state">
          <p>Loading auctions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No Auctions Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No auctions match your search or filter selection.</p>
        </div>
      ) : (
        <div className="bid-history-table-wrapper" style={{ marginTop: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Auction Item</th>
                <th>Seller</th>
                <th>Starting Bid</th>
                <th>Current Price</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((auc) => {
                const item = auc.item || {};
                const isPending = auc.status === 'PENDING';
                const isActive = auc.status === 'ACTIVE';

                return (
                  <tr key={auc.auctionId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={item.name}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name || 'Item'}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {item.category || 'General'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{auc.seller?.fullName || 'Seller'}</td>

                    <td style={{ color: '#CBD5E1' }}>
                      ${Number(auc.startingPrice || 0).toLocaleString()}
                    </td>

                    <td style={{ fontWeight: 700, color: '#34D399' }}>
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
                      <span className="badge" style={{
                        background: isPending ? 'rgba(245,158,11,0.15)' : isActive ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                        color: isPending ? '#FBBF24' : isActive ? '#34D399' : 'var(--text-dim)',
                        border: `1px solid ${isPending ? 'rgba(245,158,11,0.3)' : isActive ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`
                      }}>
                        {auc.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {/* Approve button for pending */}
                        {isPending && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                            onClick={() => handleApprove(auc.auctionId)}
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Terminate button for active */}
                        {isActive && (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', color: '#F43F5E', borderColor: 'rgba(244,63,94,0.3)' }}
                            onClick={() => handleTerminate(auc.auctionId)}
                          >
                            <Ban size={14} />
                            <span>Terminate</span>
                          </button>
                        )}
                      </div>
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
