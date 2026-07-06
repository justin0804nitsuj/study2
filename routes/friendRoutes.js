const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, getFriendsList } = require('../controllers/friendController');
const { protect } = require('../middleware/auth');

router.use(protect);

// 取得好友列表
router.get('/', getFriendsList);

// 發送好友邀請
router.post('/request', sendFriendRequest);

// 接受好友邀請
router.put('/accept/:id', acceptFriendRequest);

module.exports = router;
