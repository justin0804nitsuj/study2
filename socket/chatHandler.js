// 使用 In-memory Map 來管理線上使用者的 Socket IDs (支援多裝置登入)
// 結構: Map<userId (String), Set<socketId>>
const onlineUsers = new Map();

module.exports = (io, socket) => {
  const userId = socket.user._id.toString();

  // 1. 用戶上線邏輯
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socket.id);

  // 廣播給所有其他連線者：該用戶已上線
  socket.broadcast.emit('user_status_change', { userId, status: 'online' });

  // 2. 即時傳送對話 (send_message -> receive_message)
  socket.on('send_message', (data) => {
    /* 
       預期 data 格式: 
       { receiverId, content, imageUrl, messageId, timestamp } 
    */
    const { receiverId } = data;
    const receiverSockets = onlineUsers.get(receiverId);

    // 如果接收者在線，則發送訊息給該接收者的所有連線裝置
    if (receiverSockets && receiverSockets.size > 0) {
      receiverSockets.forEach((receiverSocketId) => {
        io.to(receiverSocketId).emit('receive_message', {
          ...data,
          senderId: userId,
        });
      });
    }
  });

  // 3. 用戶下線邏輯
  socket.on('disconnect', () => {
    console.log(`❌ 聊天系統處理斷線: ${socket.user.username}`);
    const userSockets = onlineUsers.get(userId);
    
    if (userSockets) {
      userSockets.delete(socket.id); // 移除當前裝置的 socketId
      
      // 如果該用戶的所有裝置都斷線了
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
        // 廣播給所有其他人：該用戶已下線
        socket.broadcast.emit('user_status_change', { userId, status: 'offline' });
      }
    }
  });
};
