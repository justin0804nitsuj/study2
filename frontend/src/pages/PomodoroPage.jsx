import React from 'react';

const PomodoroPage = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* 左側：番茄鐘計時器區塊 */}
      <section className="flex-1 bg-neutral-800 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center border border-neutral-700/50">
        <h2 className="text-2xl font-bold mb-8 text-neutral-300">個人專注區</h2>
        
        {/* 計時器 UI */}
        <div className="w-64 h-64 rounded-full border-8 border-indigo-500/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(99,102,241,0.1)]">
          <span className="text-6xl font-light text-white tracking-widest">25:00</span>
        </div>
        
        {/* 控制按鈕 */}
        <div className="mt-10 flex gap-4">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/25">
            開始專注
          </button>
          <button className="px-8 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full font-medium transition-all">
            設定
          </button>
        </div>
      </section>

      {/* 右側：學習報表區塊 */}
      <section className="w-full md:w-1/3 bg-neutral-800 rounded-3xl p-6 shadow-xl border border-neutral-700/50 flex flex-col">
        <h3 className="text-xl font-bold mb-4">今日學習報表</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-neutral-900/50 p-4 rounded-2xl">
            <p className="text-sm text-neutral-400">總專注時長</p>
            <p className="text-2xl font-bold text-indigo-400">120 <span className="text-sm font-normal text-neutral-500">分鐘</span></p>
          </div>
          <div className="bg-neutral-900/50 p-4 rounded-2xl">
            <p className="text-sm text-neutral-400">完成番茄鐘</p>
            <p className="text-2xl font-bold text-emerald-400">4 <span className="text-sm font-normal text-neutral-500">個</span></p>
          </div>
        </div>

        {/* 任務分類列表 Placeholder */}
        <div className="flex-1 overflow-y-auto pr-2">
          <p className="text-sm text-neutral-400 mb-2">任務分佈</p>
          <div className="space-y-3">
            {/* 任務卡片範例 */}
            <div className="flex justify-between items-center bg-neutral-700/30 p-3 rounded-xl">
              <span className="font-medium">前端開發</span>
              <span className="text-sm text-neutral-400">75 分鐘</span>
            </div>
            <div className="flex justify-between items-center bg-neutral-700/30 p-3 rounded-xl">
              <span className="font-medium">讀書</span>
              <span className="text-sm text-neutral-400">45 分鐘</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PomodoroPage;
