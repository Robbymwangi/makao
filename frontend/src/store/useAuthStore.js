import { create } from "zustand";
import { persist } from "zustand/middleware";

const credentials = {
  user: ["user@makao.com"],
  systemAdmin: ["admin@system.com"],
  consultantAdmin: ["admin@consultant.com"],
  agentAdmin: ["admin@agent.com"],
};

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      role: null,
      login: (email) => {
        let role = null;
        if (credentials.systemAdmin.includes(email)) role = "systemAdmin";
        else if (credentials.consultantAdmin.includes(email)) role = "consultantAdmin";
        else if (credentials.agentAdmin.includes(email)) role = "agentAdmin";
        else if (credentials.user.includes(email)) role = "user";
        if (role) {
          set({ isAuthenticated: true, email, role });
          return role;
        }
        return null;
      },
      logout: () => set({ isAuthenticated: false, email: null, role: null }),
    }),
    {
      name: "makao-auth", // Key in localStorage
      // Optionally, whitelist/blacklist state keys or use sessionStorage
    }
  )
);