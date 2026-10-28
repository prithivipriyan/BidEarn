const API_BASE = '/api';

/**
 * Format date & time to Indian Standard Time (IST)
 */
export function formatDateTimeIST(dateStr, options = {}) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: options.month || 'short',
    day: options.day || 'numeric',
    year: options.year,
    hour: options.hour || '2-digit',
    minute: options.minute || '2-digit',
    hour12: options.hour12 !== undefined ? options.hour12 : true,
    ...options,
  });
}

/**
 * Format image URLs: converts local disk paths (e.g. E:\Luffy.jpg)
 * to streamable backend endpoints (/api/upload/local?path=...)
 */
export function formatImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('/uploads') || url.startsWith('/api')) {
    return url;
  }
  if (/^[A-Za-z]:[\\/]/.test(url)) {
    return `/api/upload/local?path=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Generic fetch wrapper with error handling and JSON parsing
 */
async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Request failed with status ${response.status}` };
      }
      throw new Error(errorData.message || 'Something went wrong');
    }
    // For 204 No Content
    if (response.status === 204) return null;
    return await response.json();
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Authentication & User Management
  auth: {
    login: (email, password) =>
      request('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (userData) =>
      request('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    forgotPassword: (email, newPassword) =>
      request('/users/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword }),
      }),

    changePassword: (userId, currentPassword, newPassword) =>
      request(`/users/${userId}/password`, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),

    updateProfile: (userId, updates) =>
      request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    updatePhoto: (userId, photoUrl) =>
      request(`/users/${userId}/photo`, {
        method: 'PUT',
        body: JSON.stringify({ photoUrl }),
      }),

    getUserById: (userId) => request(`/users/${userId}`),

    getAllUsers: () => request('/users'),

    getCustomers: () => request('/users/customers'),

    updateUserStatus: (userId, status) =>
      request(`/users/${userId}/status?status=${status}`, {
        method: 'PUT',
      }),

    deleteUser: (userId) =>
      request(`/users/${userId}`, {
        method: 'DELETE',
      }),
  },

  // Item Management
  items: {
    create: (itemData) =>
      request('/items', {
        method: 'POST',
        body: JSON.stringify(itemData),
      }),

    getById: (itemId) => request(`/items/${itemId}`),

    getAll: () => request('/items'),
  },

  // Auction Management
  auctions: {
    create: (auctionData) =>
      request('/auctions', {
        method: 'POST',
        body: JSON.stringify(auctionData),
      }),

    getById: (auctionId) => request(`/auctions/${auctionId}`),

    getAll: () => request('/auctions'),

    getActive: () => request('/auctions/active'),

    getLive: () => request('/auctions/live'),

    getUpcoming: () => request('/auctions/upcoming'),

    getPending: () => request('/auctions/pending'),

    getBySeller: (sellerId) => request(`/auctions/seller/${sellerId}`),

    approve: (auctionId) =>
      request(`/auctions/${auctionId}/approve`, {
        method: 'PUT',
      }),

    terminate: (auctionId) =>
      request(`/auctions/${auctionId}/terminate`, {
        method: 'PUT',
      }),

    close: (auctionId) =>
      request(`/auctions/${auctionId}/close`, {
        method: 'PUT',
      }),
  },

  // Bidding System
  bids: {
    placeBid: (auctionId, userId, amount) =>
      request('/bids', {
        method: 'POST',
        body: JSON.stringify({ auctionId, userId, amount }),
      }),

    getForAuction: (auctionId) => request(`/bids/auction/${auctionId}`),

    getForUser: (userId) => request(`/bids/user/${userId}`),
  },

  // Watchlist Management
  watchlist: {
    add: (userId, auctionId) =>
      request(`/watchlist?userId=${userId}&auctionId=${auctionId}`, {
        method: 'POST',
      }),

    remove: (watchlistId) =>
      request(`/watchlist/${watchlistId}`, {
        method: 'DELETE',
      }),

    getForUser: (userId) => request(`/watchlist/user/${userId}`),
  },

  // File Upload
  upload: {
    uploadImage: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('File upload failed');
      const data = await response.json();
      return data.url;
    },
  },
};
