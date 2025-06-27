import { create } from "zustand";
import { persist } from "zustand/middleware";

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Broadcast session started after successful login
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

  // --- LOGIN (User) ---
  login: async (email, password) => {
    set({ loading: true, error: null });
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  // Staff login helper
  loginFromStaff: ({ user, role, token }) => {
    set({
      isAuthenticated: true,
      user,
      role,
      token,
      loading: false
    });
    broadcastSessionStarted();
  },

  // --- SIGNUP ---
  signup: async (email, password, role = 'user') => {
    set({ loading: true, error: null });
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
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

  // --- RESEND CONFIRMATION ---
  resendConfirmation: async (email) => {
    set({ loading: true, error: null });
    const res = await fetch(`${API}/auth/resend-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST' });
    } catch {}

    const currentRole = get().role;

    set({ isAuthenticated: false, user: null, role: null, token: null });
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();

    if (currentRole === 'systemAdmin' || currentRole === 'consultantAdmin' || currentRole === 'agentAdmin') {
      window.location.href = '/staff/login';
    } else {
      window.location.href = '/login';
    }
  },

  // --- CLEAR ERROR ---
  clearError: () => set({ error: null }),

  // --- SET EMAIL STORE ---
  setEmailStore: (email) =>
    set((state) => ({
      user: {
        ...state.user,
        email
      }
    })),

  // --- INITIALIZE SESSION ---
  initializeSession: async () => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      if (!token) return;

      const session = JSON.parse(token);
      const { user, access_token } = session;

      if (user && access_token) {
        set({
          isAuthenticated: true,
          user,
          role: user.user_metadata?.role || null,
          token: access_token,
        });
      }
    } catch (err) {
      console.error("Failed to initialize session:", err);
      set({ isAuthenticated: false, user: null, role: null, token: null });
    }
  }

}), {
  name: "makao-auth",
  partialize: state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    role: state.role,
    token: state.token
  })
}));
