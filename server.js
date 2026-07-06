require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// 建立 Express 應用程式
const app = express();
const server = http.createServer(app);

// 設定 Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // 這裡在正式環境應設定為前端的 URL
    methods: ['GET', 'POST']
  }
});

// Socket.io 中介軟體：驗證 JWT Token
const jwt = require('jsonwebtoken');
const User = require('./models/User');

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) {
      return next(new Error('未提供授權 Token'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('授權失敗，找不到使用者'));
    }

    socket.user = user; // 將使用者資料綁定到 socket 實例
    next();
  } catch (error) {
    return next(new Error('Token 無效'));
  }
});

// 中介軟體 (Middleware)
app.use(cors());
app.use(express.json()); // 解析 JSON 格式的請求內容

// 路由設定
const authRoutes = require('./routes/authRoutes');
const pomodoroRoutes = require('./routes/pomodoroRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);

// 資料庫連線設定
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pomodoro_app';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ 成功連接到 MongoDB'))
  .catch((err) => console.error('❌ MongoDB 連線失敗:', err));

// 引入 Socket Handlers
const chatHandler = require('./socket/chatHandler');
const pomodoroHandler = require('./socket/pomodoroHandler');

// Socket.io 事件處理
io.on('connection', (socket) => {
  console.log(`⚡ 使用者已連線: ${socket.user.username} (${socket.id})`);

  // 掛載各模組的 Socket 事件
  chatHandler(io, socket);
  pomodoroHandler(io, socket);
});

// 基本的測試路由
app.get('/', (req, res) => {
  res.send('Pomodoro App API is running...');
});

// 啟動伺服器
server.listen(PORT, () => {
  console.log(`🚀 伺服器正在執行，Port: ${PORT}`);
});
