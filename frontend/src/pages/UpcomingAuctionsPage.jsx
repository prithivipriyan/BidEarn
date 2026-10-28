import React, { useState, useEffect } from 'react';
import { CalendarClock, Search, Clock, PlusCircle } from 'lucide-react';
import { api } from '../services/api';
import AuctionCard from '../components/AuctionCard';
import '../styles/pages/dashboard.css';
import '../styles/pages/auctions.css';

export default function UpcomingAuctionsPage({ user, onNavigate, onSelectAuction }) {
  const [auctions, setAuctions] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcoming();
  }, [user]);

  const loadUpcoming = async () => {
    setLoading(true);
    try {
      const upcomingList = await api.auctions.getUpcoming();
      setAuctions(upcomingList || []);

      if (user?.userId) {
        const watchlist = await api.watchlist.getForUser(user.userId);
        const ids = new Set((watchlist || []).map((w) => w.auction?.auctionId));
        setWatchlistIds(ids);
      }
    } catch (err) {
      console.error('Failed to load upcoming auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWatchlist = async (auction) => {
    if (!user?.userId) return;
    const auctionId = auction.auctionId;
    try {
      if (watchlistIds.has(auctionId)) {
        const userWatchlist = await api.watchlist.getForUser(user.userId);
        const entry = userWatchlist.find((w) => w.auction?.auctionId === auctionId);
        if (entry) await api.watchlist.remove(entry.watchlistId);
        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.delete(auctionId);
          return next;
        });
      } else {
        await api.watchlist.add(user.userId, auctionId);
        setWatchlistIds((prev) => new Set(prev).add(auctionId));
      }
    } catch (err) {
      console.error('Watchlist toggle error:', err);
    }
  };

  const filtered = auctions.filter((auc) => {
    const item = auc.item || {};
    return (item.name || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="upcoming-auctions-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '0.5rem' }}>
            <CalendarClock size={14} />
            <span>Scheduled Auctions</span>
          </div>
          <h1>Upcoming Auctions</h1>
          <p>Preview scheduled auctions, view starting prices, and save them to your watchlist.</p>
        </div>

        <button className="btn btn-primary btn-glow" onClick={() => onNavigate('sell-now')}>
          <PlusCircle size={16} />
          <span>Schedule an Auction</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="section-toolbar">
        <h3>
          <Clock size={19} color="#FBBF24" />
          <span>Starting Soon ({filtered.length})</span>
        </h3>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search upcoming auctions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="empty-state">
          <p>Loading upcoming auctions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CalendarClock size={32} />
          </div>
          <h3>No Upcoming Auctions Scheduled</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            All active auctions are currently live. Check out the live catalog or list your own product!
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('live-auctions')}>
            Browse Live Auctions
          </button>
        </div>
      ) : (
        <div className="auction-grid">
          {filtered.map((auction) => (
            <AuctionCard
              key={auction.auctionId}
              auction={auction}
              isWatchlisted={watchlistIds.has(auction.auctionId)}
              onToggleWatchlist={handleToggleWatchlist}
              onViewDetails={(id) => onSelectAuction(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
