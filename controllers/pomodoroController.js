const Pomodoro = require('../models/Pomodoro');
const mongoose = require('mongoose');

// @desc    開始新的番茄鐘
// @route   POST /api/pomodoro/start
// @access  Private
const startPomodoro = async (req, res) => {
  try {
    const { taskName, duration } = req.body;

    // 檢查必填欄位 (duration 是必填，代表預期專注時長)
    if (!duration) {
      return res.status(400).json({ success: false, message: '請提供預期專注時長 (duration)' });
    }

    const pomodoro = await Pomodoro.create({
      user: req.user._id,
      taskName: taskName || '未命名任務',
      duration,
      startTime: new Date(),
      status: 'ongoing',
    });

    res.status(201).json({
      success: true,
      data: pomodoro,
    });
  } catch (error) {
    console.error('開始番茄鐘錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

// @desc    結束或中斷番茄鐘
// @route   PUT /api/pomodoro/end/:id
// @access  Private
const endPomodoro = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['completed', 'interrupted'].includes(status)) {
      return res.status(400).json({ success: false, message: '狀態必須是 completed 或 interrupted' });
    }

    const pomodoro = await Pomodoro.findById(id);

    if (!pomodoro) {
      return res.status(404).json({ success: false, message: '找不到此番茄鐘紀錄' });
    }

    // 確保只能修改自己的紀錄
    if (pomodoro.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: '無權限修改此紀錄' });
    }

    if (pomodoro.status !== 'ongoing') {
      return res.status(400).json({ success: false, message: '此番茄鐘已結束' });
    }

    const endTime = new Date();
    pomodoro.endTime = endTime;
    pomodoro.status = status;

    // 如果您想將 duration 變更為「實際專注時長」(分鐘)，可以這樣計算：
    // const actualDuration = Math.round((endTime - pomodoro.startTime) / 60000);
    // pomodoro.duration = actualDuration; 
    // 但為了保留原始設定的目標時長，我們仍保留原本的 duration，並透過 startTime/endTime 計算報表

    await pomodoro.save();

    res.json({
      success: true,
      data: pomodoro,
    });
  } catch (error) {
    console.error('結束番茄鐘錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

// @desc    取得學習報表
// @route   GET /api/pomodoro/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const { timeframe } = req.query; // 'daily', 'weekly', 'monthly'
    
    // 計算查詢的時間範圍
    const now = new Date();
    const startDate = new Date();

    if (timeframe === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      // 預設為 daily (過去 24 小時 或 今天的凌晨)
      startDate.setHours(0, 0, 0, 0); 
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);

    // MongoDB 聚合管道 (Aggregation Pipeline)
    const stats = await Pomodoro.aggregate([
      {
        // 第一階段：過濾屬於該使用者、在時間範圍內、且已完成的番茄鐘
        $match: {
          user: userId,
          status: 'completed',
          startTime: { $gte: startDate, $lte: now }
        }
      },
      {
        // 第二階段：計算每個完成紀錄的實際耗時（分鐘），如果需要精準可以用 endTime - startTime
        $addFields: {
          actualFocusTimeMinutes: {
            $divide: [{ $subtract: ["$endTime", "$startTime"] }, 60000]
          }
        }
      },
      {
        // 第三階段：分組統計總數據及各任務分類
        $facet: {
          // 總結數據
          overall: [
            {
              $group: {
                _id: null,
                totalFocusTime: { $sum: "$actualFocusTimeMinutes" },
                totalCompleted: { $sum: 1 }
              }
            }
          ],
          // 任務分類統計
          tasks: [
            {
              $group: {
                _id: "$taskName",
                focusTime: { $sum: "$actualFocusTimeMinutes" },
                count: { $sum: 1 }
              }
            },
            {
              // 按照花費時間降冪排序
              $sort: { focusTime: -1 }
            }
          ]
        }
      }
    ]);

    // 格式化輸出結果
    const overallStats = stats[0].overall[0] || { totalFocusTime: 0, totalCompleted: 0 };
    const taskStats = stats[0].tasks.map(task => ({
      taskName: task._id,
      focusTime: Math.round(task.focusTime),
      count: task.count
    }));

    res.json({
      success: true,
      timeframe: timeframe || 'daily',
      data: {
        totalFocusTime: Math.round(overallStats.totalFocusTime), // 總專注分鐘數
        totalCompleted: overallStats.totalCompleted,
        taskStats
      }
    });

  } catch (error) {
    console.error('取得報表錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

module.exports = {
  startPomodoro,
  endPomodoro,
  getStats
};
