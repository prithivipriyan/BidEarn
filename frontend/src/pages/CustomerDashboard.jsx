import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  TrendingUp, 
  Heart, 
  PlusCircle, 
  Clock, 
  ArrowRight,
  Sparkles,
  Package
} from 'lucide-react';
import { api } from '../services/api';
import AuctionCard from '../components/AuctionCard';
import BidModal from '../components/BidModal';
import '../styles/pages/dashboard.css';

export default function CustomerDashboard({ user, onNavigate, onSelectAuction }) {
  const [auctions, setAuctions] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [userListings, setUserListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [bidModalAuction, setBidModalAuction] = useState(null);

  const categories = ['All', 'Luxury Watches', 'Electronics', 'Photography', 'Vehicles & Collectibles', 'Art & Antiques'];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch live and active auctions
      const liveList = await api.auctions.getLive();
      setAuctions(liveList || []);

      // 2. Fetch user's watchlist and listings
      if (user?.userId) {
        const [watchlist, listings] = await Promise.all([
          api.watchlist.getForUser(user.userId).catch(() => []),
          api.auctions.getBySeller(user.userId).catch(() => [])
        ]);

        const ids = new Set((watchlist || []).map((w) => w.auction?.auctionId));
        setWatchlistIds(ids);
        setUserListings(listings || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWatchlist = async (auction) => {
    if (!user?.userId) return;
    const auctionId = auction.auctionId;
    try {
      if (watchlistIds.has(auctionId)) {
        // Find watchlist entry id
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

  const handlePlaceBid = async (auctionId, amount) => {
    await api.bids.placeBid(auctionId, user.userId, amount);
    fetchData(); // Refresh current prices
  };

  const filteredAuctions = auctions.filter((auc) => {
    const item = auc.item || {};
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="dashboard-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <h1>Welcome back, {user?.fullName?.split(' ')[0] || 'Bidder'}! 👋</h1>
          <p>Discover available live auctions, track bids, or list your items for sale.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button className="btn btn-outline" onClick={() => onNavigate('live-auctions')}>
            <Flame size={16} color="#10B981" />
            <span>Live Catalog</span>
          </button>
          <button className="btn btn-primary btn-glow" onClick={() => onNavigate('sell-now')}>
            <PlusCircle size={16} />
            <span>Sell An Item</span>
          </button>
        </div>
      </div>

      {/* Hero Quick Banner */}
      <div className="dashboard-hero-banner">
        <div className="banner-content">
          <div className="badge badge-live" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={13} />
            <span>Dual Capability Account</span>
          </div>
          <h2>Bid on Exclusive Items & Earn by Selling</h2>
          <p>
            You can bid in real-time or monetize your own valuable items on the same account with verified protection.
          </p>
        </div>
        <button className="btn btn-primary btn-glow" onClick={() => onNavigate('sell-now')}>
          <span>Start Selling Now</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Live Auctions</span>
            <span className="stat-number">{auctions.length}</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('my-listings')}>
          <div className="stat-icon-box" style={{ background: 'rgba(196, 154, 74, 0.15)', color: '#7A4B2A' }}>
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">My Listings</span>
            <span className="stat-number">{userListings.length}</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('watchlist')}>
          <div className="stat-icon-box" style={{ background: 'rgba(163, 58, 50, 0.1)', color: '#A33A32' }}>
            <Heart size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Saved in Watchlist</span>
            <span className="stat-number">{watchlistIds.size}</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('my-bids')}>
          <div className="stat-icon-box" style={{ background: 'rgba(46, 107, 69, 0.1)', color: '#2E6B45' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Bidding</span>
            <span className="stat-number">Real-time</span>
          </div>
        </div>
      </div>

      {/* Seller Activity Banner if user has created listings */}
      {userListings.length > 0 && (
        <div className="auth-alert" style={{ background: 'rgba(196, 154, 74, 0.12)', border: '1px solid rgba(196, 154, 74, 0.3)', color: '#7A4B2A', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Package size={20} color="#7A4B2A" />
            <span>
              You have <strong>{userListings.length} item{userListings.length > 1 ? 's' : ''} listed</strong> for auction ({userListings.filter(l => l.status === 'PENDING').length} pending approval, {userListings.filter(l => l.status === 'ACTIVE').length} active).
            </span>
          </div>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderColor: '#C49A4A', color: '#4A2C1A' }} onClick={() => onNavigate('my-listings')}>
            <span>Manage My Listings</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Available Auctions Showcase */}
      <div className="section-toolbar">
        <h3>
          <Flame size={20} color="#C49A4A" />
          <span>Available Live Auctions</span>
        </h3>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search auctions by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="category-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Auction Cards Grid */}
      {loading ? (
        <div className="empty-state">
          <p>Loading available auctions...</p>
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Flame size={32} />
          </div>
          <h3>No Live Auctions Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            No auctions matching your search criteria. Check back soon or list an item to start bidding!
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('sell-now')}>
            Create New Listing
          </button>
        </div>
      ) : (
        <div className="auction-grid">
          {filteredAuctions.map((auction) => (
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

      {/* Bidding Modal */}
      <BidModal
        isOpen={!!bidModalAuction}
        auction={bidModalAuction}
        onClose={() => setBidModalAuction(null)}
        onPlaceBid={handlePlaceBid}
      />
    </div>
  );
}
