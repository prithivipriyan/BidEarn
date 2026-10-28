import React, { useState } from 'react';
import { X, Gavel, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatImageUrl } from '../services/api';
import '../styles/components/bid-modal.css';

export default function BidModal({ isOpen, auction, onClose, onPlaceBid }) {
  if (!isOpen || !auction) return null;

  const item = auction.item || {};
  const currentPrice = Number(auction.currentPrice || auction.startingPrice || 0);
  const minBid = currentPrice + 10;

  const [amount, setAmount] = useState(minBid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleIncrement = (inc) => {
    setAmount((prev) => Math.max(minBid, Number(prev) + inc));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (Number(amount) <= currentPrice) {
      setError(`Bid must be strictly higher than the current price of $${currentPrice}`);
      return;
    }

    setLoading(true);
    try {
      await onPlaceBid(auction.auctionId, Number(amount));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bid-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bid-modal-header">
          <h3 className="bid-modal-title">
            <Gavel size={20} color="#4A2C1A" />
            <span>Place Your Bid</span>
          </h3>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="bid-modal-body">
            {/* Item Preview */}
            <div className="bid-item-preview">
              <img
                src={formatImageUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                alt={item.name}
                className="bid-item-thumb"
              />
              <div className="bid-item-details">
                <h4>{item.name}</h4>
                <p>Current Bid: <strong style={{ color: '#2E6B45' }}>${currentPrice.toLocaleString()}</strong></p>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {error && (
              <div className="auth-alert auth-alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="auth-alert auth-alert-success">
                <CheckCircle2 size={16} />
                <span>Bid placed successfully!</span>
              </div>
            )}

            {/* Bid Amount Input */}
            <div className="form-group">
              <label className="form-label">
                <span>Enter Bid Amount (USD)</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min: ${minBid}</span>
              </label>
              <div className="input-wrapper">
                <DollarSign size={18} className="input-icon" />
                <input
                  type="number"
                  className="form-input"
                  min={minBid}
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Quick Increment Chips */}
            <div className="bid-quick-increments">
              <button type="button" className="increment-btn" onClick={() => handleIncrement(10)}>
                +$10
              </button>
              <button type="button" className="increment-btn" onClick={() => handleIncrement(50)}>
                +$50
              </button>
              <button type="button" className="increment-btn" onClick={() => handleIncrement(100)}>
                +$100
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bid-modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-glow"
              disabled={loading || success}
            >
              {loading ? 'Submitting...' : `Confirm $${Number(amount || 0).toLocaleString()} Bid`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
