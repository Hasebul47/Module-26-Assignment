import { create } from 'zustand';
import { authAPI, userAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('chronicle_token') || null,
  isAuthenticated: !!localStorage.getItem('chronicle_token'),
  isLoading: false,
  error: null,

  // Initialize auth on page load
  initAuth: async () => {
    const token = localStorage.getItem('chronicle_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const res = await authAPI.getMe();
      set({ user: res.data, isAuthenticated: true, isLoading: false, error: null });
    } catch (err) {
      console.warn('Session expired, clearing token.');
      localStorage.removeItem('chronicle_token');
      localStorage.removeItem('chronicle_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Login action
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authAPI.login({ email, password });
      const { token, ...userData } = res.data;

      localStorage.setItem('chronicle_token', token);
      localStorage.setItem('chronicle_user', JSON.stringify(userData));

      set({
        user: userData,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Register action
  register: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authAPI.register(formData);
      const { token, ...userData } = res.data;

      localStorage.setItem('chronicle_token', token);
      localStorage.setItem('chronicle_user', JSON.stringify(userData));

      set({
        user: userData,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const res = await userAPI.updateProfile(data);
      const updatedUser = { ...get().user, ...res.data };
      localStorage.setItem('chronicle_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return { success: true, user: updatedUser };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('chronicle_token');
    localStorage.removeItem('chronicle_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
