import React from 'react';
import {
  Gavel,
  Flame,
  DollarSign,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/welcome.css';

/* --------------------------------------------------------------------------
   CUSTOMIZABLE BACKGROUND IMAGE SETTING:
   You can change the image path in src/styles/pages/welcome.css under --welcome-bg-image,
   or pass a custom inline style below if desired.
   -------------------------------------------------------------------------- */

export default function WelcomePage({ onOpenAuthModal }) {
  return (
    <div className="welcome-page" id="welcome">
      {/* Top Navigation Bar with Brand Logo and Login/Register Buttons */}
      <Navbar onOpenAuthModal={onOpenAuthModal} />

      {/* Hero Section with Dynamic Background & Introduction */}
      <header className="hero-section">
        <div className="hero-content">
          {/* Live Status Badge */}
          <div className="hero-badge-wrapper">
            <div className="badge badge-live">
              <span className="badge-pulse-dot"></span>
              <span>Live Bidding Platform</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            Discover, Bid & Earn with <br />
            <span className="hero-title-gradient">BidEarn Marketplace</span>
          </h1>

          {/* Introduction Paragraph as requested */}
          <p className="hero-intro-paragraph">
            <strong>BidEarn</strong> is a next-generation real-time auction platform engineered to empower everyone.
            Whether you are looking to bid on rare collectibles, electronics, and luxury goods at unbeatable starting prices,
            or seeking to turn your own items into maximum value as a verified seller, BidEarn provides an all-in-one seamless,
            secure, and transparent bidding experience on a single unified account.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="hero-actions">
            <button
              id="hero-explore-btn"
              className="btn btn-primary hero-btn-primary btn-glow"
              onClick={() => onOpenAuthModal('register')}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>
            <button
              id="hero-login-btn"
              className="btn btn-outline hero-btn-secondary"
              onClick={() => onOpenAuthModal('login')}
            >
              <span>Explore Live Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Uses: Dual Capabilities Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <p className="section-subtitle">Core Capabilities</p>
          <h2 className="section-title">Everything You Need in One Unified Hub</h2>
          <p className="section-description">
            Explore the core capabilities that make BidEarn the most versatile and rewarding auction destination.
          </p>
        </div>

        {/* Dual Capability Feature Grid */}
        <div className="box-of-three-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          {/* Box 1: Live Real-Time Bidding */}
          <div className="feature-box box-bidding">
            <div className="feature-icon-wrapper">
              <Flame size={28} />
            </div>
            <h3 className="feature-box-title">1. Live Real-Time Bidding</h3>
            <p className="feature-box-description">
              Participate in dynamic, high-stakes auctions with live countdown timers, instant price updates, and transparent bid histories. Never miss a winning opportunity.
            </p>
            <ul className="feature-box-list">
              <li className="feature-list-item">
                <CheckCircle2 size={16} className="feature-list-item-icon" />
                <span>Sub-second live bid tracking</span>
              </li>
              <li className="feature-list-item">
                <CheckCircle2 size={16} className="feature-list-item-icon" />
                <span>Instant outbid alerts & notifications</span>
              </li>
              <li className="feature-list-item">
                <CheckCircle2 size={16} className="feature-list-item-icon" />
                <span>Personalized Watchlist bookmarks</span>
              </li>
            </ul>
          </div>

          {/* Box 2: Dual Seller Capability */}
          <div className="feature-box box-selling">
            <div className="feature-icon-wrapper">
              <DollarSign size={28} />
            </div>
            <h3 className="feature-box-title">2. Sell & Earn Money</h3>
            <p className="feature-box-description">
              No need for separate seller accounts. Any customer can instantly list products, upload gallery images, set starting reserve prices, and watch eager buyers compete.
            </p>
            <ul className="feature-box-list">
              <li className="feature-list-item">
                <CheckCircle2 size={16} className="feature-list-item-icon" />
                <span>Single account for both buying & selling</span>
              </li>
              <li className="feature-list-item">
                <CheckCircle2 size={16} className="feature-list-item-icon" />
                <span>Quick product upload & scheduling</span>
              </li>
              <li className="feature-list-item">
                <CheckCircle2 size={16} className="feature-list-item-icon" />
                <span>Automated auction closing & payouts</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Live Platform Stats Strip */}
      <section className="stats-strip" id="stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Live Auction Action</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">Verified Listings</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">$0</span>
            <span className="stat-label">Listing Registration Fee</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Instant</span>
            <span className="stat-label">Bid Synchronization</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Gavel size={18} color="#4A2C1A" />
            <span>&copy; {new Date().getFullYear()} BidEarn Inc. All rights reserved.</span>
          </div>
          <ul className="footer-links">
            <li>Email Support - support@bidearn.com</li>
            <li>Phone Assistance - +91 8122819825</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
