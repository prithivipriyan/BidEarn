import React, { useState, useEffect } from 'react';
import { History, Flame, ArrowRight, Gavel, CheckCircle2, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import '../styles/pages/dashboard.css';
import '../styles/pages/auction-detail.css';

export default function MyBidsPage({ user, onNavigate, onSelectAuction }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserBids();
  }, [user]);

  const loadUserBids = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const userBids = await api.bids.getForUser(user.userId);
      setBids(userBids || []);
    } catch (err) {
      console.error('Failed to load user bids:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-bids-page">
      {/* Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)', marginBottom: '0.5rem' }}>
            <History size={14} />
            <span>Activity History</span>
          </div>
          <h1>My Bids History</h1>
          <p>Review all live and past bids you have placed across BidEarn auctions.</p>
        </div>

        <button className="btn btn-primary btn-glow" onClick={() => onNavigate('live-auctions')}>
          <Flame size={16} />
          <span>Explore Live Auctions</span>
        </button>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="empty-state">
          <p>Loading your bidding history...</p>
        </div>
      ) : bids.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Gavel size={32} />
          </div>
          <h3>No Bids Placed Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            You haven't participated in any auctions yet. Find a product you like and place your first bid!
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('live-auctions')}>
            Browse Live Auctions
          </button>
        </div>
      ) : (
        <div className="bid-history-table-wrapper" style={{ marginTop: 0 }}>
          <div className="table-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <History size={18} color="#4A2C1A" />
              <span>Total Bids ({bids.length})</span>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Auction Item</th>
                <th>My Bid</th>
                <th>Current Leading Bid</th>
                <th>Bid Placed On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b) => {
                const auction = b.auction || {};
                const item = auction.item || {};
                const isLeading = Number(b.amount) >= Number(auction.currentPrice || 0);

                return (
                  <tr key={b.bidId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={item.name}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name || 'Auction Item'}</div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            {item.category || 'General'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#34D399' }}>
                      ${Number(b.amount).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600, color: '#FFFFFF' }}>
                      ${Number(auction.currentPrice || auction.startingPrice || 0).toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(b.bidTime).toLocaleString()}
                    </td>
                    <td>
                      {isLeading ? (
                        <span className="badge badge-live">Winning</span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(244,63,94,0.12)', color: '#FDA4AF', border: '1px solid rgba(244,63,94,0.3)' }}>
                          Outbid
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                        onClick={() => onSelectAuction(auction.auctionId)}
                      >
                        <span>View</span>
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
