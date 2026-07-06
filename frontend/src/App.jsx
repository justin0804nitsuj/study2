import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import useSocketStore from './store/useSocketStore';

// 引入頁面元件
import PomodoroPage from './pages/PomodoroPage';
import ChatPage from './pages/ChatPage';
import SharedRoomPage from './pages/SharedRoomPage';
// import LoginPage from './pages/LoginPage';

const App = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  // 監聽登入狀態以控制 WebSocket 連線
  useEffect(() => {
    if (isAuthenticated && token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
    
    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, token, connectSocket, disconnectSocket]);

  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white font-sans">
        {/* 在此處可加入全域的 Navigation Bar */}
        <main className="container mx-auto p-4 h-screen flex flex-col">
          <Routes>
            {/* 未登入則導向 Login，以下僅做路由展示 */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            
            <Route path="/" element={<Navigate to="/pomodoro" />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/room/:roomId" element={<SharedRoomPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
