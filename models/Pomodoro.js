const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskName: {
    type: String,
    default: '未命名任務',
  },
  duration: {
    type: Number,
    required: true,
    // 以分鐘為單位
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'interrupted'],
    default: 'ongoing',
  },
}, {
  timestamps: true,
});

const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);
module.exports = Pomodoro;
