const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 設定 Cloudinary 認證資訊
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 設定 Multer Storage 引擎使用 Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pomodoro_chat_images', // 存放於 Cloudinary 的資料夾名稱
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'], // 允許的圖片格式
    // 若需要調整圖片尺寸或品質，可以加上 transformation，例如:
    // transformation: [{ width: 800, crop: "limit" }]
  },
});

// 建立上傳 Middleware
const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
