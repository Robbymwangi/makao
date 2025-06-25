import { create } from "zustand";
import { persist } from "zustand/middleware";

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Broadcast session started after successful login (call this in your login logic)
const broadcastSessionStarted = () => {
  try {
    const channel = new BroadcastChannel("makao-session");
    channel.postMessage("session-started");
    channel.close();
  } catch (e) {
    // Fallback: do nothing
  }
};

export const useAuthStore = create(persist((set, get) => ({
  isAuthenticated: false,
  user: null,
  role: null,
  token: null,
  loading: false,
  error: null,

  // --- LOGIN ---
  login: async (email, password) => {
    set({ loading: true, error: null });
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error);
      err.code = data.code;
      set({ loading: false });
      throw err;
    }
    set({
      isAuthenticated: true,
      user: data.user,
      role: data.role,
      token: data.session.access_token,
      loading: false
    });
    broadcastSessionStarted(); // Broadcast session after successful login
    return data.role;
  },

  // --- SIGNUP ---
  signup: async (email, password, role = 'user') => {
    set({ loading: true, error: null });
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error);
      err.code = data.code;
      set({ loading: false });
      throw err;
    }
    // no session until confirmed
    set({ loading: false });
    return data;
  },

  // --- RESEND CONFIRMATION ---
  resendConfirmation: async (email) => {
    set({ loading: true, error: null });
    const res = await fetch(`${API}/auth/resend-confirmation`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error);
      err.code = data.code;
      set({ loading: false });
      throw err;
    }
    set({ loading: false });
    return data;
  },

  // --- LOGOUT ---
  logout: async () => {
    try { await fetch(`${API}/auth/logout`, { method:'POST' }); } catch {}
    set({ isAuthenticated: false, user: null, role: null, token: null });
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
  },

  clearError: () => set({ error: null }),

}), {
  name: "makao-auth",
  partialize: state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    role: state.role,
    token: state.token
  })
}));
