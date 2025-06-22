import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      email: null,
      role: null,
      token: null,
      loading: false,
      error: null,

      // Login action
      login: async (email, password) => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          // Store authentication data
          set({
            isAuthenticated: true,
            user: data.user,
            email: data.user.email,
            role: data.role,
            token: data.session?.access_token,
            loading: false,
            error: null,
          });

          return data.role;
        } catch (error) {
          set({
            loading: false,
            error: error.message,
            isAuthenticated: false,
            user: null,
            email: null,
            role: null,
            token: null,
          });
          throw error;
        }
      },

      // Signup action
      signup: async (email, password, role = 'user') => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
          }

          // Store authentication data if user was created and confirmed
          if (data.user && data.session) {
            set({
              isAuthenticated: true,
              user: data.user,
              email: data.user.email,
              role: data.role,
              token: data.session.access_token,
              loading: false,
              error: null,
            });
          } else {
            // User created but needs email confirmation
            set({
              loading: false,
              error: null,
            });
          }

          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.message,
            isAuthenticated: false,
            user: null,
            email: null,
            role: null,
            token: null,
          });
          throw error;
        }
      },

      // Resend confirmation email
      resendConfirmation: async (email) => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/resend-confirmation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to resend confirmation email');
          }

          set({ loading: false, error: null });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        const { token } = get();
        
        try {
          if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state regardless of API call success
          set({
            isAuthenticated: false,
            user: null,
            email: null,
            role: null,
            token: null,
            loading: false,
            error: null,
          });
        }
      },

      // Get current user profile
      getProfile: async () => {
        const { token } = get();
        
        if (!token) {
          throw new Error('No authentication token');
        }

        set({ loading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch profile');
          }

          // Update user data
          set({
            user: data.user,
            email: data.user.email,
            role: data.profile.role,
            loading: false,
            error: null,
          });

          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Check if user has specific role
      hasRole: (requiredRole) => {
        const { role } = get();
        return role === requiredRole;
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const { role } = get();
        return roles.includes(role);
      },
    }),
    {
      name: "makao-auth",
      // Only persist essential data, not loading states or errors
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        email: state.email,
        role: state.role,
        token: state.token,
      }),
    }
  )
);