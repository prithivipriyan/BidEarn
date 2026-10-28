import React from 'react';
import {
  HelpCircle,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import '../styles/pages/sell.css';
import '../styles/pages/auth.css';

export default function HelpCenterPage() {
  const faqs = [
    {
      q: 'How does live bidding work on BidEarn?',
      a: 'When an auction is ACTIVE, any verified user can place a bid that is higher than the current leading price. The price updates immediately in real time for all participants.',
    },
    {
      q: 'Can I sell items on the same customer account?',
      a: 'Yes! BidEarn offers unified dual-capability accounts. You do not need a separate seller account. Simply click "Sell Item" from your navigation menu.',
    },
    {
      q: 'What happens when an auction ends?',
      a: 'When the timer expires, the highest bidder wins the item at the final closing price. Both the buyer and seller receive confirmation details.',
    },
    {
      q: 'How do I add or remove products from my Watchlist?',
      a: 'Click the heart icon on any auction card or product detail view. You can view all saved items on your "My Watchlist" page at any time.',
    },
    {
      q: 'When do upcoming auctions become available for bidding?',
      a: 'Upcoming auctions are scheduled for a specific start time. Once approved by our moderation team, they appear under "Upcoming Auctions" and go live automatically when the start time arrives.',
    },
    {
      q: 'How are disputes and item authenticity verified?',
      a: 'All auctions are moderated by BidEarn administrators prior to activation. If you have any inquiries regarding an item, please contact our support desk via email or phone.',
    },
  ];

  return (
    <div className="help-center-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)', marginBottom: '0.5rem' }}>
            <HelpCircle size={14} />
            <span>24/7 Support</span>
          </div>
          <h1>Help & Support Center</h1>
          <p>Get in touch with our customer service team or find quick answers to common questions.</p>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="help-grid">
        {/* Email Support Card */}
        <div className="help-contact-card">
          <div className="stat-icon-box" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A' }}>
            <Mail size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Email Support</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
              Send us an email anytime. Our team responds within 2 business hours.
            </p>
            <a href="mailto:support@bidearn.com" style={{ color: '#4A2C1A', fontWeight: 600, fontSize: '1.05rem' }}>
              support@bidearn.com
            </a>
          </div>
        </div>

        {/* Phone Support Card */}
        <div className="help-contact-card">
          <div className="stat-icon-box" style={{ background: 'rgba(46, 107, 69, 0.1)', color: '#2E6B45' }}>
            <Phone size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Phone Assistance</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
              Call our dedicated toll-free support line for urgent assistance.
            </p>
            <a href="tel:+918122819825" style={{ color: '#2E6B45', fontWeight: 600, fontSize: '1.05rem' }}>
              +91 8122819825
            </a>
          </div>
        </div>

        {/* Security & Moderation */}
        <div className="help-contact-card">
          <div className="stat-icon-box" style={{ background: 'rgba(196, 154, 74, 0.15)', color: '#7A4B2A' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Dispute Resolution</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
              Our platform administrators moderate all disputes and verify item legitimacy.
            </p>
            <span style={{ color: '#7A4B2A', fontWeight: 600, fontSize: '0.95rem' }}>
              Admin Moderated 24/7
            </span>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HelpCircle size={22} color="#2E6B45" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
          {faqs.map((f, i) => (
            <div key={i} className="faq-card" style={{ height: '100%' }}>
              <div className="faq-question">{f.q}</div>
              <div className="faq-answer">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
