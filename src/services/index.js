import { CATEGORIES } from '../constants';

const API_URL = process.env.API_URL || null;

const handleFetch = async (path, options = {}) => {
  if (!API_URL) {
    // No backend configured: return empty results for safety
    return { ok: true, data: null };
  }
  try {
    const res = await fetch(API_URL + path, options);
    const json = await res.json();
    return { ok: res.ok, data: json };
  } catch (e) {
    console.warn('api fetch error', e);
    return { ok: false, error: e };
  }
};

export const apiService = {
  getProfessionals: async () => {
    // If no API, return empty array (clean production state)
    if (!API_URL) return [];
    const r = await handleFetch('/professionals');
    return r.ok ? r.data : [];
  },
  getRequests: async () => {
    if (!API_URL) return [];
    const r = await handleFetch('/requests');
    return r.ok ? r.data : [];
  },
  getReservations: async () => {
    if (!API_URL) return [];
    const r = await handleFetch('/reservations');
    return r.ok ? r.data : [];
  },
  getConversations: async () => {
    if (!API_URL) return [];
    const r = await handleFetch('/conversations');
    return r.ok ? r.data : [];
  },
  login: async (email, password) => {
    if (!API_URL) return { ok: true, user: { email } };
    const r = await handleFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    return r;
  },
  register: async (payload) => {
    if (!API_URL) return { ok: true, user: payload };
    const r = await handleFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    return r;
  },
  getCategories: async () => {
    // Categories are safe to ship with app
    return CATEGORIES;
  },
};

export default apiService;
