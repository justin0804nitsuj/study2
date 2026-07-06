const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// 註冊路由
router.post('/register', registerUser);

// 登入路由
router.post('/login', loginUser);

// 取得個人資料路由 (需要 JWT 驗證)
router.get('/me', protect, getMe);

module.exports = router;
