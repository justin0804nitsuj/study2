const mongoose = require('mongoose');

const sharedRoomSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['waiting', 'focusing', 'resting'],
    default: 'waiting',
  },
  remainingTime: {
    type: Number,
    // 以秒為單位，在 socket 同步時可以用來記錄中斷時的剩餘時間
  },
  targetDuration: {
    type: Number,
    required: true,
    // 預設目標時長（分鐘）
    default: 25,
  },
}, {
  timestamps: true,
});

const SharedRoom = mongoose.model('SharedRoom', sharedRoomSchema);
module.exports = SharedRoom;
