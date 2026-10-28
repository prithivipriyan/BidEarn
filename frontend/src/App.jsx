import React, { useState, useEffect } from 'react';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoleSelectModal from './components/RoleSelectModal';

// Customer Pages & Components
import CustomerSidebar from './components/CustomerSidebar';
import CustomerDashboard from './pages/CustomerDashboard';
import LiveAuctionsPage from './pages/LiveAuctionsPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import UpcomingAuctionsPage from './pages/UpcomingAuctionsPage';
import WatchlistPage from './pages/WatchlistPage';
import MyBidsPage from './pages/MyBidsPage';
import MyListingsPage from './pages/MyListingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import SellNowPage from './pages/SellNowPage';

// Admin Pages & Components
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAuctionsPage from './pages/AdminAuctionsPage';

// Shared Pages
import ProfilePage from './pages/ProfilePage';

export default function App() {
  // Current logged in user (stored in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bidearn_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Navigation State
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const stored = localStorage.getItem('bidearn_user');
      if (stored) {
        const u = JSON.parse(stored);
        return u.role === 'ADMIN' ? 'admin-dashboard' : 'customer-dashboard';
      }
      return 'welcome';
    } catch {
      return 'welcome';
    }
  });

  const [authRole, setAuthRole] = useState('customer'); // 'customer' | 'admin'
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [previousPage, setPreviousPage] = useState('live-auctions');

  // Role Selection Modal
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login', // 'login' | 'register'
  });

  // Sync user state with localStorage
  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('bidearn_user', JSON.stringify(authenticatedUser));
    if (authenticatedUser.role === 'ADMIN') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('customer-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bidearn_user');
    setCurrentPage('welcome');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('bidearn_user', JSON.stringify(updatedUser));
  };

  const handleOpenAuthModal = (mode = 'login') => {
    if (mode === 'register') {
      setCurrentPage('register');
    } else {
      setAuthModal({
        isOpen: true,
        mode: 'login',
      });
    }
  };

  const handleCloseAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSelectRole = (role, mode) => {
    setAuthRole(role);
    setAuthModal({ isOpen: false, mode });
    setCurrentPage(mode === 'login' ? 'login' : 'register');
  };

  const handleSelectAuction = (auctionId) => {
    setPreviousPage(currentPage);
    setSelectedAuctionId(auctionId);
    setCurrentPage('auction-detail');
  };

  // Render Public / Auth Pages
  if (currentPage === 'welcome') {
    return (
      <div className="app-container">
        <WelcomePage onOpenAuthModal={handleOpenAuthModal} />
        <RoleSelectModal
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={handleCloseAuthModal}
          onSelectRole={handleSelectRole}
        />
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        initialRole={authRole}
        onLoginSuccess={handleLoginSuccess}
        onNavigate={(page) => setCurrentPage(page)}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegisterPage
        onNavigate={(page) => setCurrentPage(page)}
      />
    );
  }

  // Render Logged-In Portals
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="app-layout">
      {/* Dynamic Sidebar based on User Role */}
      {isAdmin ? (
        <AdminSidebar
          activePage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          user={user}
          onLogout={handleLogout}
        />
      ) : (
        <CustomerSidebar
          activePage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <div className="main-wrapper">
        <main className="main-content">
          {/* Customer Portal Pages */}
          {currentPage === 'customer-dashboard' && (
            <CustomerDashboard
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
              onSelectAuction={handleSelectAuction}
            />
          )}

          {currentPage === 'live-auctions' && (
            <LiveAuctionsPage
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
              onSelectAuction={handleSelectAuction}
            />
          )}

          {currentPage === 'auction-detail' && (
            <AuctionDetailPage
              auctionId={selectedAuctionId}
              user={user}
              onBack={() => setCurrentPage(previousPage || (isAdmin ? 'admin-auctions' : 'live-auctions'))}
            />
          )}

          {currentPage === 'upcoming-auctions' && (
            <UpcomingAuctionsPage
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
              onSelectAuction={handleSelectAuction}
            />
          )}

          {currentPage === 'watchlist' && (
            <WatchlistPage
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
              onSelectAuction={handleSelectAuction}
            />
          )}

          {currentPage === 'my-bids' && (
            <MyBidsPage
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
              onSelectAuction={handleSelectAuction}
            />
          )}

          {currentPage === 'my-listings' && (
            <MyListingsPage
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
              onSelectAuction={handleSelectAuction}
            />
          )}

          {currentPage === 'sell-now' && (
            <SellNowPage
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'help-center' && (
            <HelpCenterPage />
          )}

          {/* Admin Portal Pages */}
          {currentPage === 'admin-dashboard' && (
            <AdminDashboard
              user={user}
              onNavigate={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'admin-users' && (
            <AdminUsersPage />
          )}

          {currentPage === 'admin-auctions' && (
            <AdminAuctionsPage />
          )}

          {/* Shared Profile Page */}
          {currentPage === 'profile' && (
            <ProfilePage
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}
