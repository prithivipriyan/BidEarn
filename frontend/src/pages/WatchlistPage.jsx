import React, { useState, useEffect } from 'react';
import { Heart, Flame, ArrowRight, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import AuctionCard from '../components/AuctionCard';
import BidModal from '../components/BidModal';
import '../styles/pages/dashboard.css';

export default function WatchlistPage({ user, onNavigate, onSelectAuction }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidModalAuction, setBidModalAuction] = useState(null);

  useEffect(() => {
    loadWatchlist();
  }, [user]);

  const loadWatchlist = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const items = await api.watchlist.getForUser(user.userId);
      setWatchlist(items || []);
    } catch (err) {
      console.error('Failed to load watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (auction) => {
    const entry = watchlist.find((w) => w.auction?.auctionId === auction.auctionId);
    if (!entry) return;
    try {
      await api.watchlist.remove(entry.watchlistId);
      setWatchlist((prev) => prev.filter((w) => w.watchlistId !== entry.watchlistId));
    } catch (err) {
      console.error('Failed to remove watchlist item:', err);
    }
  };

  const handlePlaceBid = async (auctionId, amount) => {
    await api.bids.placeBid(auctionId, user.userId, amount);
    loadWatchlist();
  };

  return (
    <div className="watchlist-page">
      {/* Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#FB7185', border: '1px solid rgba(244, 63, 94, 0.3)', marginBottom: '0.5rem' }}>
            <Heart size={14} fill="#FB7185" />
            <span>Saved Bookmarks</span>
          </div>
          <h1>My Watchlist</h1>
          <p>Track your favorited products, monitor current bids, and jump into live auctions.</p>
        </div>

        <button className="btn btn-outline" onClick={() => onNavigate('live-auctions')}>
          <Flame size={16} color="#10B981" />
          <span>Explore Live Catalog</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="empty-state">
          <p>Loading your saved watchlist...</p>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: '#FB7185' }}>
            <Heart size={32} />
          </div>
          <h3>Your Watchlist is Empty</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            You haven't saved any items yet. Click the heart icon on any live or upcoming auction to track it here!
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('live-auctions')}>
            Find Items to Watch
          </button>
        </div>
      ) : (
        <div className="auction-grid">
          {watchlist.map((entry) => {
            const auction = entry.auction || {};
            return (
              <AuctionCard
                key={entry.watchlistId}
                auction={auction}
                isWatchlisted={true}
                onToggleWatchlist={handleRemoveFromWatchlist}
                onOpenBidModal={(auc) => setBidModalAuction(auc)}
                onViewDetails={(id) => onSelectAuction(id)}
              />
            );
          })}
        </div>
      )}

      {/* Bid Modal */}
      <BidModal
        isOpen={!!bidModalAuction}
        auction={bidModalAuction}
        onClose={() => setBidModalAuction(null)}
        onPlaceBid={handlePlaceBid}
      />
    </div>
  );
}
