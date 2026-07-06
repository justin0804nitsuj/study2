import React from 'react';
import { useParams } from 'react-router-dom';

const SharedRoomPage = () => {
  const { roomId } = useParams();

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      {/* 房間標題與狀態 */}
      <div className="absolute top-8 text-center w-full">
        <h2 className="text-3xl font-bold tracking-wide">共用番茄鐘房間</h2>
        <p className="text-neutral-400 mt-2">Room ID: {roomId}</p>
      </div>

      {/* 參與者頭像區 */}
      <div className="absolute top-28 flex -space-x-4">
        <div className="w-14 h-14 bg-indigo-500 rounded-full border-4 border-neutral-900 shadow-md"></div>
        <div className="w-14 h-14 bg-emerald-500 rounded-full border-4 border-neutral-900 shadow-md"></div>
        <div className="w-14 h-14 bg-rose-500 rounded-full border-4 border-neutral-900 shadow-md flex items-center justify-center text-xs font-bold">+2</div>
      </div>

      {/* 中央主計時器 */}
      <div className="relative">
        {/* 發光光暈效果 */}
        <div className="absolute inset-0 bg-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="w-80 h-80 rounded-full border-[12px] border-neutral-800 flex items-center justify-center relative z-10 bg-neutral-900 shadow-2xl">
          {/* 進度條 (這裡以 SVG 示意，實際可用 strokeDasharray 實作) */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="160" cy="160" r="146" fill="transparent" stroke="#4f46e5" strokeWidth="12" strokeDasharray="917" strokeDashoffset="200" className="transition-all duration-1000 ease-linear" />
          </svg>
          
          <div className="text-center">
            <span className="text-7xl font-bold tracking-wider tabular-nums">22:45</span>
            <p className="text-indigo-400 font-medium mt-2 tracking-widest">FOCUSING</p>
          </div>
        </div>
      </div>

      {/* 房主控制按鈕 */}
      <div className="mt-12 flex gap-6 z-10">
        <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/30">
          開始 / 恢復
        </button>
        <button className="px-10 py-4 bg-neutral-700 hover:bg-neutral-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg">
          暫停
        </button>
      </div>

    </div>
  );
};

export default SharedRoomPage;
