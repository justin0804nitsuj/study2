// 使用 In-memory Map 管理伺服器上的共用房間狀態
// 結構: Map<roomId (String), RoomState>
// RoomState: { timerId (NodeJS.Timeout), remainingTime (Number), status (String), targetDuration (Number) }
const activeRooms = new Map();

module.exports = (io, socket) => {
  // 1. 加入房間 (join_room)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.user.username} 加入了房間 ${roomId}`);
    
    // 如果房間正在運行，立刻同步目前狀態給剛加入的用戶
    if (activeRooms.has(roomId)) {
      const roomState = activeRooms.get(roomId);
      socket.emit('timer_sync', {
        remainingTime: roomState.remainingTime,
        status: roomState.status,
      });
    }
  });

  // 2. 離開房間 (leave_room)
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`${socket.user.username} 離開了房間 ${roomId}`);
    
    // 可選邏輯：如果房間內沒有人了，可以清除定時器避免浪費伺服器資源
    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    if (!clientsInRoom || clientsInRoom.size === 0) {
      const roomState = activeRooms.get(roomId);
      if (roomState && roomState.timerId) {
        clearInterval(roomState.timerId);
      }
      activeRooms.delete(roomId);
      console.log(`房間 ${roomId} 已清空並自動銷毀`);
    }
  });

  // 3. 房主開始計時 (timer_start)
  socket.on('timer_start', (data) => {
    const { roomId, targetDuration } = data; // targetDuration 建議傳入秒數

    // 初始化房間狀態（若不存在）
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, {
        timerId: null,
        remainingTime: targetDuration,
        status: 'focusing',
        targetDuration,
      });
    }

    const roomState = activeRooms.get(roomId);
    
    // 防止重複觸發導致的多次 setInterval
    if (roomState.timerId) {
      clearInterval(roomState.timerId);
    }

    roomState.status = 'focusing';
    // 立即同步一次狀態給房間內所有人
    io.to(roomId).emit('timer_sync', {
      remainingTime: roomState.remainingTime,
      status: roomState.status,
    });

    // 啟動伺服器端定時器，每 1 秒鐘 Tick 一次
    roomState.timerId = setInterval(() => {
      roomState.remainingTime -= 1;
      
      // 每秒廣播剩餘時間
      io.to(roomId).emit('timer_sync', {
        remainingTime: roomState.remainingTime,
        status: roomState.status,
      });

      // 倒數結束
      if (roomState.remainingTime <= 0) {
        clearInterval(roomState.timerId);
        roomState.timerId = null;
        roomState.status = 'completed';
        
        io.to(roomId).emit('timer_sync', {
          remainingTime: 0,
          status: 'completed',
        });
      }
    }, 1000);
  });

  // 4. 房主暫停計時 (timer_pause)
  socket.on('timer_pause', (roomId) => {
    if (activeRooms.has(roomId)) {
      const roomState = activeRooms.get(roomId);
      
      // 清除定時器以暫停計時
      if (roomState.timerId) {
        clearInterval(roomState.timerId);
        roomState.timerId = null;
      }
      
      roomState.status = 'paused';
      
      // 廣播暫停狀態
      io.to(roomId).emit('timer_sync', {
        remainingTime: roomState.remainingTime,
        status: roomState.status,
      });
    }
  });
};
