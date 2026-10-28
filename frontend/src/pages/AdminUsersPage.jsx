import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Trash2,
  ShieldCheck,
  UserX,
  CheckCircle,
  AlertCircle,
  Shield,
  UserCheck,
  Globe
} from 'lucide-react';
import { api, formatImageUrl } from '../services/api';
import '../styles/pages/dashboard.css';
import '../styles/pages/auction-detail.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await api.auth.getAllUsers();
      setUsers(list || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.auth.updateUserStatus(user.userId, nextStatus);
      setSuccessMsg(`User ${user.fullName} has been marked as ${nextStatus}`);
      setTimeout(() => setSuccessMsg(null), 3000);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Status update failed');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}"?`)) {
      return;
    }
    try {
      await api.auth.deleteUser(userId);
      setSuccessMsg(`User ${userName} has been removed`);
      setTimeout(() => setSuccessMsg(null), 3000);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Cannot remove user with active auctions or bids');
      setTimeout(() => setError(null), 4000);
    }
  };

  const filtered = users.filter((u) => {
    return (
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="admin-users-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="page-headline">
          <div className="badge" style={{ background: 'rgba(74, 44, 26, 0.08)', color: '#4A2C1A', border: '1px solid rgba(74, 44, 26, 0.2)', marginBottom: '0.5rem' }}>
            <Users size={14} />
            <span>User Directory</span>
          </div>
          <h1>User Management</h1>
          <p>View registered accounts, toggle active/suspended statuses, and remove user profiles.</p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="auth-alert auth-alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="section-toolbar">
        <h3>
          <Users size={20} color="#4A2C1A" />
          <span>Registered Users ({filtered.length})</span>
        </h3>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="empty-state">
          <p>Loading users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No Users Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No accounts match your search filter.</p>
        </div>
      ) : (
        <div className="bid-history-table-wrapper" style={{ marginTop: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isAdmin = u.role === 'ADMIN';
                const isActive = u.status === 'ACTIVE';

                return (
                  <tr key={u.userId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {u.profilePhoto ? (
                          <img
                            src={formatImageUrl(u.profilePhoto)}
                            alt={u.fullName}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F4EFEA', color: '#4A2C1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #E8DED2' }}>
                            {u.fullName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.fullName}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #{u.userId}</span>
                        </div>
                      </div>
                    </td>

                    <td>{u.email}</td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
                        <Globe size={14} color="var(--text-dim)" />
                        <span>{u.country || 'Not specified'}</span>
                      </div>
                    </td>

                    <td>{u.phoneNumber || '—'}</td>

                    <td>
                      {isAdmin ? (
                        <span className="badge" style={{ background: 'rgba(196,154,74,0.15)', color: '#7A4B2A', border: '1px solid rgba(196,154,74,0.35)' }}>
                          <ShieldCheck size={12} />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(74,44,26,0.08)', color: '#4A2C1A', border: '1px solid rgba(74,44,26,0.2)' }}>
                          Customer
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${isActive ? 'badge-live' : ''}`} style={{
                        background: isActive ? 'rgba(46,107,69,0.1)' : 'rgba(163,58,50,0.1)',
                        color: isActive ? '#2E6B45' : '#A33A32',
                        border: `1px solid ${isActive ? 'rgba(46,107,69,0.25)' : 'rgba(163,58,50,0.25)'}`
                      }}>
                        {u.status}
                      </span>
                    </td>

                    <td>
                      {!isAdmin && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {/* Toggle Status */}
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => handleToggleStatus(u)}
                            title={isActive ? 'Suspend User' : 'Activate User'}
                          >
                            {isActive ? <UserX size={14} color="#FDA4AF" /> : <UserCheck size={14} color="#34D399" />}
                            <span>{isActive ? 'Suspend' : 'Activate'}</span>
                          </button>

                          {/* Delete */}
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.4rem 0.65rem', color: '#F43F5E' }}
                            onClick={() => handleDeleteUser(u.userId, u.fullName)}
                            title="Remove User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
