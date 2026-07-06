const Message = require('../models/Message');

// @desc    發送聊天訊息 (含圖片上傳)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: '請提供接收者 ID' });
    }

    // 確保接收者是自己的好友 (可選：依您的需求決定是否只能發給好友)
    if (!req.user.friends.includes(receiverId)) {
      return res.status(403).json({ success: false, message: '只能發送訊息給好友' });
    }

    let imageUrl = null;
    // 如果有附帶圖片，multer-storage-cloudinary 會將其上傳並在 req.file.path 中回傳 URL
    if (req.file) {
      imageUrl = req.file.path;
    }

    // 文字或圖片至少要有一項
    if (!content && !imageUrl) {
      return res.status(400).json({ success: false, message: '訊息內容與圖片不能同時為空' });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error('發送訊息錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

// @desc    取得與特定好友的聊天紀錄
// @route   GET /api/messages/:friendId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user._id;

    // 尋找與該好友之間的對話，並依時間由舊到新排序
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: friendId },
        { sender: friendId, receiver: currentUserId }
      ]
    })
    .sort({ timestamp: 1 }) // 1 代表升冪排序 (舊 -> 新)
    .populate('sender', 'username avatar') // 可選：附加上發送者基本資料方便前端渲染
    .populate('receiver', 'username avatar');

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('取得聊天紀錄錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
};
