import { create } from "zustand";
import { getProfile } from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const user = await getProfile();

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;