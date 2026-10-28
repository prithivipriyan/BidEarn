import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Flame, 
  Clock, 
  Gavel, 
  DollarSign, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Tag,
  CalendarClock
} from 'lucide-react';
import { api, formatImageUrl, formatDateTimeIST } from '../services/api';
import '../styles/pages/auctions.css';
import '../styles/pages/auction-detail.css';

export default function AuctionDetailPage({ auctionId, user, onBack }) {
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistEntryId, setWatchlistEntryId] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadAuctionDetails();
  }, [auctionId]);

  const loadAuctionDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch Auction
      const data = await api.auctions.getById(auctionId);
      setAuction(data);

      const current = Number(data.currentPrice || data.startingPrice || 0);
      setBidAmount(current + 25);

      // 2. Fetch Bids for this Auction
      const bidList = await api.bids.getForAuction(auctionId);
      setBids(bidList || []);

      // 3. Check Watchlist
      if (user?.userId) {
        const watchlist = await api.watchlist.getForUser(user.userId);
        const match = (watchlist || []).find((w) => w.auction?.auctionId === Number(auctionId));
        if (match) {
          setIsWatchlisted(true);
          setWatchlistEntryId(match.watchlistId);
        } else {
          setIsWatchlisted(false);
          setWatchlistEntryId(null);
        }
      }
    } catch (err) {
      console.error('Failed to load auction detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!user?.userId) return;
    try {
      if (isWatchlisted && watchlistEntryId) {
        await api.watchlist.remove(watchlistEntryId);
        setIsWatchlisted(false);
        setWatchlistEntryId(null);
      } else {
        const entry = await api.watchlist.add(user.userId, auctionId);
        setIsWatchlisted(true);
        setWatchlistEntryId(entry.watchlistId);
      }
    } catch (err) {
      console.error('Watchlist toggle error:', err);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setError(null);
    const numAmount = Number(bidAmount);
    const currentPrice = Number(auction?.currentPrice || auction?.startingPrice || 0);

    if (numAmount <= currentPrice) {
      setError(`Your bid must be greater than current bid of $${currentPrice}`);
      return;
    }

    setSubmitting(true);
    try {
      await api.bids.placeBid(auctionId, user.userId, numAmount);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadAuctionDetails(); // Refresh
    } catch (err) {
      setError(err.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading auction details...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="empty-state">
        <h3>Auction Not Found</h3>
        <button className="btn btn-primary" onClick={onBack}>
          Back to Live Auctions
        </button>
      </div>
    );
  }

  const item = auction.item || {};
  const seller = auction.seller || {};
  const currentPrice = Number(auction.currentPrice || auction.startingPrice || 0);

  const now = new Date();
  const startTime = auction.startTime ? new Date(auction.startTime) : null;
  const endTime = auction.endTime ? new Date(auction.endTime) : null;

  const isLive = auction.status === 'ACTIVE' && (!startTime || startTime <= now) && (!endTime || endTime >= now);
  const isUpcoming = (auction.status === 'ACTIVE' || auction.status === 'PENDING') && startTime && startTime > now;

  return (
    <div className="auction-detail-page">
      {/* Back Button */}
      <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '1.75rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Catalog</span>
      </button>

      {/* Main Grid Layout */}
      <div className="auction-detail-layout">
        {/* Left Column: Image & Details */}
        <div className="detail-gallery-card">
          <img
            src={formatImageUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
            alt={item.name}
            className="detail-main-image"
          />
          <div style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
              {isLive ? (
                <span className="badge badge-live">
                  <Flame size={13} />
                  <span>Live Bidding</span>
                </span>
              ) : isUpcoming ? (
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <CalendarClock size={13} />
                  <span>Scheduled (Upcoming)</span>
                </span>
              ) : (
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}>
                  <span>{auction.status}</span>
                </span>
              )}
              <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                <Tag size={13} />
                <span>{item.category || 'General'}</span>
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '1rem' }}>{item.name}</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.98rem' }}>
              {item.description || 'No detailed description provided for this item.'}
            </p>
          </div>
        </div>

        {/* Right Column: Bidding & Seller Card */}
        <div className="detail-info-card">
          {/* Header Row with Watchlist Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                Listed by
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <User size={16} color="#4A2C1A" />
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{seller.fullName || 'Verified Seller'}</span>
              </div>
            </div>
            <button
              className={`btn btn-outline ${isWatchlisted ? 'active' : ''}`}
              onClick={handleToggleWatchlist}
              style={{ color: isWatchlisted ? 'var(--accent-rose)' : 'inherit' }}
            >
              <Heart size={16} fill={isWatchlisted ? 'currentColor' : 'none'} />
              <span>{isWatchlisted ? 'Saved' : 'Add to Watchlist'}</span>
            </button>
          </div>

          {/* Pricing Highlight Box */}
          <div className="detail-price-highlight">
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isUpcoming ? 'Starting Price' : 'Current Leading Bid'}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2E6B45', fontFamily: 'var(--font-display)' }}>
                ${(isUpcoming ? Number(auction.startingPrice || 0) : currentPrice).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Starting Price
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                ${Number(auction.startingPrice || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Timing Notice (IST) */}
          {isUpcoming ? (
            <div className="detail-timer-box" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
              <CalendarClock size={18} color="#FBBF24" />
              <span style={{ color: '#FBBF24' }}>Auction Starts: {formatDateTimeIST(auction.startTime)} (IST)</span>
            </div>
          ) : (
            <div className="detail-timer-box">
              <Clock size={18} color="#C49A4A" />
              <span>Auction Ends: {formatDateTimeIST(auction.endTime)} (IST)</span>
            </div>
          )}

          {/* Bid Submission Form / Upcoming Status */}
          {isLive ? (
            <form onSubmit={handlePlaceBid} className="auth-form" style={{ marginTop: '0.5rem' }}>
              {error && (
                <div className="auth-alert auth-alert-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="auth-alert auth-alert-success">
                  <CheckCircle2 size={16} />
                  <span>Congratulations! Your bid was placed successfully.</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <span>Enter Your Bid Amount (USD)</span>
                  <span style={{ color: 'var(--text-muted)' }}>Min. Bid: ${currentPrice + 1}</span>
                </label>
                <div className="input-wrapper">
                  <DollarSign size={18} className="input-icon" />
                  <input
                    type="number"
                    className="form-input"
                    min={currentPrice + 1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-glow auth-submit-btn"
                disabled={submitting}
              >
                <Gavel size={18} />
                <span>{submitting ? 'Placing Bid...' : 'Place Bid Now'}</span>
              </button>
            </form>
          ) : isUpcoming ? (
            <div className="auth-alert" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#FDE68A' }}>
              <strong>Scheduled Auction</strong>
              <p style={{ marginTop: '0.35rem' }}>
                Bidding will open on <strong>{formatDateTimeIST(auction.startTime)} (IST)</strong>. Add this item to your watchlist to be ready when live bidding begins!
              </p>
            </div>
          ) : (
            <div className="auth-alert" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
              This auction is currently {auction.status.toLowerCase()}. Bidding is closed.
            </div>
          )}

          {/* Security Notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
            <ShieldCheck size={16} color="#2E6B45" />
            <span>All bids are binding and protected under BidEarn guarantee.</span>
          </div>
        </div>
      </div>

      {/* Bid History Table Section */}
      <div className="bid-history-table-wrapper">
        <div className="table-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Gavel size={20} color="#4A2C1A" />
            <span>Live Bid History ({bids.length} Bids)</span>
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Highest to Lowest</span>
        </div>

        {bids.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bids placed yet. Be the first to bid on this item!
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bidder</th>
                <th>Bid Amount</th>
                <th>Time Placed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b, index) => (
                <tr key={b.bidId || index}>
                  <td>
                    <div className="bidder-tag">
                      <User size={15} color="#4A2C1A" />
                      <span>{b.user?.fullName || 'Anonymous Bidder'}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: index === 0 ? '#2E6B45' : 'var(--text-main)' }}>
                    ${Number(b.amount).toLocaleString()}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {formatDateTimeIST(b.bidTime)}
                  </td>
                  <td>
                    {index === 0 ? (
                      <span className="badge badge-live">Leading Bid</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}>
                        Outbid
                      </span>
                    )}
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
