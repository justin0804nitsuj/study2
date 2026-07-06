const express = require('express');
const router = express.Router();
const { startPomodoro, endPomodoro, getStats } = require('../controllers/pomodoroController');
const { protect } = require('../middleware/auth');

// 所有番茄鐘相關的 API 都需要 JWT 驗證
router.use(protect);

// 開始番茄鐘
router.post('/start', startPomodoro);

// 結束或中斷番茄鐘
router.put('/end/:id', endPomodoro);

// 取得學習報表
router.get('/stats', getStats);

module.exports = router;
