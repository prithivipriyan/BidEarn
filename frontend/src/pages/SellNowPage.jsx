import React, { useState } from 'react';
import { 
  PlusCircle, 
  Upload, 
  DollarSign, 
  Calendar, 
  Image as ImageIcon, 
  Tag, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { api } from '../services/api';
import '../styles/pages/sell.css';
import '../styles/pages/auth.css';

const getLocalIsoString = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function SellNowPage({ user, onNavigate }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Luxury Watches');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [startTime, setStartTime] = useState(() => 
    getLocalIsoString(new Date(Date.now() + 5 * 60 * 1000))
  );
  const [endTime, setEndTime] = useState(() => 
    getLocalIsoString(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
  );

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Luxury Watches',
    'Electronics',
    'Photography',
    'Vehicles & Collectibles',
    'Art & Antiques',
    'Jewelry & Gemstones',
    'Fashion & Apparel',
    'Sports & Memorabilia',
  ];

  const [createdProduct, setCreatedProduct] = useState(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImageUrl('');
    setStartingPrice('');
    setStartTime(getLocalIsoString(new Date(Date.now() + 5 * 60 * 1000)));
    setEndTime(getLocalIsoString(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)));
    setSuccess(false);
    setCreatedProduct(null);
    setError(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await api.upload.uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setError('Image upload failed. You can also paste an image URL directly.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError('Please provide an image for the product (upload or paste image URL)');
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setError('Auction end date must be after the start date');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Item record
      const item = await api.items.create({
        name: name.trim(),
        category,
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      });

      // 2. Create Auction record linked to item & seller (preserving local time without UTC offset shift)
      const formatLocalIso = (dtStr) => (dtStr.length === 16 ? `${dtStr}:00` : dtStr);

      const newAuction = await api.auctions.create({
        item: { itemId: item.itemId },
        seller: { userId: user.userId },
        startingPrice: Number(startingPrice),
        startTime: formatLocalIso(startTime),
        endTime: formatLocalIso(endTime),
      });

      setCreatedProduct({
        ...newAuction,
        item,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to list product for auction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sell-now-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge badge-live" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={14} />
            <span>Seller Portal</span>
          </div>
          <h1>List a Product for Auction</h1>
          <p>Provide item details, upload photos, set your starting bid, and publish your auction listing.</p>
        </div>
      </div>

      <div className="form-card">
        {/* Error Alert */}
        {error && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Rich Success State */}
        {success ? (
          <div style={{ padding: '1rem 0', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>
              Product Published Successfully! 🎉
            </h2>

            <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              Your item <strong>"{createdProduct?.item?.name || name}"</strong> has been saved and submitted to the marketplace.
            </p>

            {/* Product Summary Box */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', maxWidth: '500px', margin: '0 auto 1.75rem auto', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img
                src={createdProduct?.item?.imageUrl || imageUrl}
                alt="Product"
                style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                  {createdProduct?.item?.name || name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Category: <span style={{ color: '#CBD5E1' }}>{category}</span> • Starting Bid: <span style={{ color: '#34D399', fontWeight: 600 }}>${Number(startingPrice).toLocaleString()}</span>
                </div>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.75rem' }}>
                  Status: Pending Admin Approval
                </span>
              </div>
            </div>

            {/* Explanatory Tip */}
            <div className="auth-alert" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#C7D2FE', maxWidth: '500px', margin: '0 auto 1.75rem auto', textAlign: 'left', fontSize: '0.85rem' }}>
              <strong>Where can I see my item?</strong>
              <p style={{ marginTop: '0.35rem', color: '#E0E7FF' }}>
                You can track and manage this item anytime under <strong>"My Listings"</strong>. Once approved by an admin, it will immediately appear in <strong>Live / Upcoming Auctions</strong> for bidders!
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary btn-glow"
                onClick={() => onNavigate('my-listings')}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <span>View in My Listings</span>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <span>List Another Product</span>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onNavigate('customer-dashboard')}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Product Name */}
          <div className="form-group">
            <label className="form-label">Product Name / Title</label>
            <div className="input-wrapper">
              <Tag size={18} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Vintage 1968 Rolex Submariner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Starting Price */}
            <div className="form-group">
              <label className="form-label">Starting Bid Price (USD)</label>
              <div className="input-wrapper">
                <DollarSign size={18} className="input-icon" />
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 500"
                  min="1"
                  step="0.01"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              className="form-input"
              style={{ minHeight: '110px', padding: '0.85rem 1rem' }}
              placeholder="Describe condition, specifications, provenance, and included accessories..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Image Upload / Image URL */}
          <div className="form-group">
            <label className="form-label">Product Image</label>
            {imageUrl ? (
              <div className="uploaded-preview-box">
                <img src={imageUrl} alt="Preview" className="uploaded-preview-img" />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => setImageUrl('')}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label className="upload-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <Upload size={28} color="#4A2C1A" />
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {uploading ? 'Uploading to server...' : 'Click to Upload Product Image'}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Supports PNG, JPG, WEBP up to 10MB
                  </span>
                </label>

                {/* Direct Image URL input */}
                <div className="input-wrapper">
                  <ImageIcon size={18} className="input-icon" />
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Or paste an image URL directly..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Auction Dates */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Auction Start Time</label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input
                  type="datetime-local"
                  className="form-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Auction End Time</label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input
                  type="datetime-local"
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary auth-submit-btn btn-glow"
            disabled={submitting || uploading || success}
            style={{ marginTop: '1rem' }}
          >
            <PlusCircle size={18} />
            <span>{submitting ? 'Publishing Auction...' : 'Publish Auction Listing'}</span>
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
