import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // 登入：儲存 Token 並更新狀態
  login: (userData, token) => {
    localStorage.setItem('token', token);
    set({ user: userData, token, isAuthenticated: true });
  },

  // 登出：清除 Token 與狀態
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // 設定使用者詳細資料 (例如取得 /me 之後)
  setUser: (userData) => set({ user: userData }),
}));

export default useAuthStore;
