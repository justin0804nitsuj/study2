const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(protect);

// 取得特定好友的聊天紀錄
router.get('/:friendId', getChatHistory);

// 發送訊息 (支援上傳單張名為 'image' 的圖片)
router.post('/', upload.single('image'), sendMessage);

module.exports = router;
