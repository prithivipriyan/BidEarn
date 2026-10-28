import React, { useState, useEffect } from 'react';
import { Flame, PlusCircle, Search, Filter } from 'lucide-react';
import { api } from '../services/api';
import AuctionCard from '../components/AuctionCard';
import BidModal from '../components/BidModal';
import '../styles/pages/dashboard.css';
import '../styles/pages/auctions.css';

export default function LiveAuctionsPage({ user, onNavigate, onSelectAuction }) {
  const [auctions, setAuctions] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [bidModalAuction, setBidModalAuction] = useState(null);

  const categories = ['All', 'Luxury Watches', 'Electronics', 'Photography', 'Vehicles & Collectibles', 'Art & Antiques'];

  useEffect(() => {
    loadLiveAuctions();
  }, [user]);

  const loadLiveAuctions = async () => {
    setLoading(true);
    try {
      const liveList = await api.auctions.getLive();
      setAuctions(liveList || []);

      if (user?.userId) {
        const watchlist = await api.watchlist.getForUser(user.userId);
        const ids = new Set((watchlist || []).map((w) => w.auction?.auctionId));
        setWatchlistIds(ids);
      }
    } catch (err) {
      console.error('Failed to fetch live auctions:', err);
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
      console.error('Watchlist toggle failed:', err);
    }
  };

  const handlePlaceBid = async (auctionId, amount) => {
    await api.bids.placeBid(auctionId, user.userId, amount);
    loadLiveAuctions();
  };

  const filtered = auctions.filter((auc) => {
    const item = auc.item || {};
    const matchesSearch = (item.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="live-auctions-page">
      {/* Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge badge-live" style={{ marginBottom: '0.5rem' }}>
            <span className="badge-pulse-dot"></span>
            <span>Real-Time Catalog</span>
          </div>
          <h1>Live Auctions</h1>
          <p>Browse active auctions, place competitive bids, or list your item as a seller.</p>
        </div>

        <button className="btn btn-primary btn-glow" onClick={() => onNavigate('sell-now')}>
          <PlusCircle size={16} />
          <span>Add Product as Seller</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="section-toolbar">
        <div className="category-filter-bar" style={{ marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search live items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="empty-state">
          <p>Loading live auctions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Flame size={32} />
          </div>
          <h3>No Live Auctions Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            There are no live auctions currently matching your filter.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('sell-now')}>
            Sell an Item
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
              onOpenBidModal={(auc) => setBidModalAuction(auc)}
              onViewDetails={(id) => onSelectAuction(id)}
            />
          ))}
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
