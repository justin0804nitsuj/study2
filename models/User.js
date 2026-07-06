const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    // 如果使用 Google 登入，密碼可能非必填
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // 允許欄位不存在或為 null，但如果存在則必須唯一
  },
  avatar: {
    type: String,
    default: '',
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['online', 'offline', 'focusing'],
    default: 'offline',
  },
}, {
  timestamps: true, // 自動加入 createdAt 與 updatedAt 欄位
});

const User = mongoose.model('User', userSchema);
module.exports = User;
