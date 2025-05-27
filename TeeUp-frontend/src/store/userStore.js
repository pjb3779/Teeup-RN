import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null, // 초기에는 로그인 안 되어 있으니까 null
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
