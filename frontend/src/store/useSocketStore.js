import { create } from 'zustand';
import { io } from 'socket.io-client';

const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  // 初始化 WebSocket 連線
  connectSocket: (token) => {
    const currentSocket = get().socket;
    // 如果已經有連線且正在連接中，避免重複連線
    if (currentSocket?.connected) return;

    // 建立新的連線實例
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      auth: {
        token: token,
      },
    });

    socket.on('connect', () => {
      console.log('🔌 WebSocket 已連線');
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket 已斷線');
      set({ isConnected: false });
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket 連線錯誤:', err.message);
    });

    set({ socket });
  },

  // 中斷連線 (例如登出時)
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));

export default useSocketStore;
