const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 確認 Header 中是否有 Authorization 並且開頭為 Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 取得 token (格式: Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 解碼 token 並驗證
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 將對應的 User 資料掛載到 req 上，排除密碼欄位
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: '找不到此使用者，授權失敗' });
      }

      next(); // 進入下一個 middleware 或是 controller
    } catch (error) {
      console.error('Token 驗證錯誤:', error);
      return res.status(401).json({ success: false, message: 'Token 無效或已過期，授權失敗' });
    }
  }

  // 若沒有提供 token
  if (!token) {
    return res.status(401).json({ success: false, message: '未提供 Token，授權失敗' });
  }
};

module.exports = { protect };
