const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

// @desc    發送好友邀請
// @route   POST /api/friends/request
// @access  Private
const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ success: false, message: '無法發送邀請給自己' });
    }

    // 檢查對方是否存在
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: '找不到目標使用者' });
    }

    // 檢查是否已經是好友
    if (req.user.friends.includes(receiverId)) {
      return res.status(400).json({ success: false, message: '你們已經是好友了' });
    }

    // 檢查是否已有待處理的邀請
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: 'pending' },
        { sender: receiverId, receiver: senderId, status: 'pending' }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: '已經有待處理的好友邀請' });
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({
      success: true,
      message: '已發送好友邀請',
      data: request,
    });
  } catch (error) {
    console.error('發送好友邀請錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

// @desc    接受好友邀請
// @route   PUT /api/friends/accept/:id
// @access  Private
const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const currentUserId = req.user._id;

    // 尋找邀請
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: '找不到此好友邀請' });
    }

    // 只有接收者可以接受邀請
    if (request.receiver.toString() !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: '無權限操作此邀請' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: '此邀請已被處理過' });
    }

    // 更新邀請狀態
    request.status = 'accepted';
    await request.save();

    // 雙方互加好友
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });

    res.json({
      success: true,
      message: '已接受好友邀請',
    });
  } catch (error) {
    console.error('接受好友邀請錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

// @desc    取得好友列表
// @route   GET /api/friends
// @access  Private
const getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username email avatar status');

    if (!user) {
      return res.status(404).json({ success: false, message: '找不到使用者' });
    }

    res.json({
      success: true,
      data: user.friends,
    });
  } catch (error) {
    console.error('取得好友列表錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsList,
};
