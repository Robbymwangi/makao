import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      role: null,

      //Login stores the full user object and role
      login: ({ id, email, name, role }) =>
        set({
          isAuthenticated: true,
          user: { id, email, name },
          role,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          role: null,
        }),
    }),
    {
      name: "makao-auth", // Key in localStorage
    }
  )
); 
      // Optionally, whitelist/blacklist state keys or use sessionStorage
 