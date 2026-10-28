import React from 'react';
import { Heart, Clock, Gavel, ArrowRight, Flame, CalendarClock } from 'lucide-react';
import { formatImageUrl, formatDateTimeIST } from '../services/api';
import '../styles/components/auction-card.css';

export default function AuctionCard({
  auction,
  isWatchlisted,
  onToggleWatchlist,
  onOpenBidModal,
  onViewDetails,
}) {
  const item = auction.item || {};
  const currentPrice = auction.currentPrice || auction.startingPrice || 0;

  const now = new Date();
  const startTime = auction.startTime ? new Date(auction.startTime) : null;
  const endTime = auction.endTime ? new Date(auction.endTime) : null;

  const isLive = auction.status === 'ACTIVE' && (!startTime || startTime <= now) && (!endTime || endTime >= now);
  const isUpcoming = (auction.status === 'ACTIVE' || auction.status === 'PENDING') && startTime && startTime > now;

  return (
    <div className="auction-card">
      {/* Image Box */}
      <div className="auction-image-box">
        <img
          src={formatImageUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={item.name || 'Auction Item'}
          className="auction-image"
        />

        {/* Category Badge */}
        <span className="auction-badge-category">
          {item.category || 'Collectibles'}
        </span>

        {/* Watchlist Bookmark Button */}
        {onToggleWatchlist && (
          <button
            className={`auction-watchlist-btn ${isWatchlisted ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(auction);
            }}
            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Heart size={18} fill={isWatchlisted ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* Status / Timer Ribbon */}
        <div className="auction-timer-ribbon">
          {isLive ? (
            <>
              <Flame size={14} color="#34D399" />
              <span>Ends: {formatDateTimeIST(auction.endTime)}</span>
            </>
          ) : isUpcoming ? (
            <>
              <Clock size={14} color="#F59E0B" />
              <span>Starts: {formatDateTimeIST(auction.startTime)}</span>
            </>
          ) : (
            <>
              <Clock size={14} color="#94A3B8" />
              <span>{auction.status}</span>
            </>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="auction-body">
        <h3 className="auction-title" title={item.name}>
          {item.name || 'Unnamed Product'}
        </h3>
        <p className="auction-desc">
          {item.description || 'No description provided for this listing.'}
        </p>

        {/* Price Information */}
        <div className="auction-price-row">
          <div className="price-box">
            <span className="price-label">Starting Bid</span>
            <span className="price-amount" style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
              ${Number(auction.startingPrice || 0).toLocaleString()}
            </span>
          </div>
          <div className="price-box" style={{ textAlign: 'right' }}>
            <span className="price-label">Current Bid</span>
            <span className="price-amount highlight">
              ${Number(currentPrice).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="auction-card-actions">
          <button
            className="btn btn-outline"
            onClick={() => onViewDetails(auction.auctionId)}
          >
            <span>Details</span>
          </button>
          {isLive && onOpenBidModal && (
            <button
              className="btn btn-primary btn-glow"
              onClick={() => onOpenBidModal(auction)}
            >
              <Gavel size={15} />
              <span>Bid Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
