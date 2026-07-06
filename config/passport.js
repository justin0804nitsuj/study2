const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 尋找是否已經有此 Google ID 的使用者
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // 使用者已存在，直接登入
        return done(null, user);
      } else {
        // 如果 Google ID 不存在，檢查 Email 是否已被一般註冊使用
        const email = profile.emails[0].value;
        const existingEmailUser = await User.findOne({ email });

        if (existingEmailUser) {
          // 如果 Email 存在，您可以選擇將 Google ID 綁定到該帳號，或者回傳錯誤
          existingEmailUser.googleId = profile.id;
          if (!existingEmailUser.avatar) {
              existingEmailUser.avatar = profile.photos[0].value;
          }
          await existingEmailUser.save();
          return done(null, existingEmailUser);
        }

        // 建立新使用者
        const newUser = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          // 密碼留空，因為是 Google 登入
        });

        return done(null, newUser);
      }
    } catch (error) {
      console.error('Google OAuth 錯誤:', error);
      return done(error, null);
    }
  }
));

// 這些主要是針對使用 Session 時的序列化與反序列化
// 若您的架構為純 JWT API (Stateless)，可以在路由層級直接處理 token 核發，不一定需要這兩個方法
// 但若搭配 express-session，則必須提供：
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
