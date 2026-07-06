const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 產生 JWT Token 的輔助函式
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// @desc    使用者註冊
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 檢查必填欄位
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: '請填寫所有必填欄位' });
    }

    // 檢查 Email 是否已被註冊
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: '該 Email 已經被註冊過' });
    }

    // 密碼雜湊加密 (Hash password)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 建立新使用者
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: '無效的使用者資料' });
    }
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

// @desc    使用者登入
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 檢查必填欄位
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '請輸入 Email 與密碼' });
    }

    // 尋找使用者
    const user = await User.findOne({ email });

    // 驗證密碼
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Email 或密碼錯誤' });
    }
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

// @desc    取得當前登入使用者的個人資料
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user 已經在 auth middleware (protect) 中被掛載，並且去除了密碼欄位
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ success: false, message: '找不到使用者' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('取得個人資料錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
