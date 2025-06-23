import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      role: null,
      email: null,

      //Login stores the full user object and role
      login: ({ id, email, name, role }) =>
        set({
          isAuthenticated: true,
          user: { id, email, name },
          role,
          email, // Store email for potential use in OTP or other features
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          role: null,
          email: null, 
        }),
        //For manually setting email (used in OTP resend)
      setEmail: (email) => set({ email }),
    }),
    {
      name: "makao-auth", // Key in localStorage
    }
  )
); 
      // Optionally, whitelist/blacklist state keys or use sessionStorage
 