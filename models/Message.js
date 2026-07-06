const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: function() {
      // 內容或圖片必須至少有一個存在
      return !this.imageUrl;
    },
  },
  imageUrl: {
    type: String,
    required: function() {
      return !this.content;
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  // 不使用 timestamps: true 是因為這裡只主要關注發送時間 (timestamp)，
  // 若有需要也可開啟
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
