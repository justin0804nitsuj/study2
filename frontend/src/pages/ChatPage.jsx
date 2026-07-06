import React, { useState } from 'react';

const ChatPage = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-full bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-700/50 shadow-xl">
      {/* 左側：好友列表 */}
      <aside className="w-1/3 max-w-sm border-r border-neutral-700/50 flex flex-col bg-neutral-900/30">
        <div className="p-5 border-b border-neutral-700/50">
          <h2 className="text-xl font-bold text-neutral-200">好友列表</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* 朋友卡片範例 */}
          <div className="flex items-center p-3 hover:bg-neutral-700/50 rounded-2xl cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold shadow-inner">
              J
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-bold text-neutral-200">Justin</h3>
              <p className="text-sm text-neutral-400">Online</p>
            </div>
            {/* 未讀標記 */}
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* 右側：聊天室內容 */}
      <main className="flex-1 flex flex-col relative">
        {/* 聊天室 Header */}
        <header className="px-6 py-4 border-b border-neutral-700/50 flex items-center bg-neutral-900/20 backdrop-blur-sm z-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-full mr-4"></div>
          <h3 className="font-bold text-lg">Justin</h3>
        </header>

        {/* 訊息顯示區 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
          {/* 對方的訊息 */}
          <div className="flex items-end max-w-[70%]">
            <div className="w-8 h-8 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></div>
            <div className="bg-neutral-700 text-neutral-100 p-4 rounded-2xl rounded-bl-sm shadow-sm">
              <p>嘿！今天要一起開共用番茄鐘嗎？</p>
              <span className="text-xs text-neutral-400 block mt-1">10:30 AM</span>
            </div>
          </div>

          {/* 自己的訊息 */}
          <div className="flex items-end max-w-[70%] self-end">
            <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-br-sm shadow-md shadow-indigo-900/20">
              <p>好啊！我剛好也想讀點書，等我五分鐘。</p>
              <span className="text-xs text-indigo-200 block mt-1 text-right">10:32 AM</span>
            </div>
          </div>
        </div>

        {/* 訊息輸入區 */}
        <footer className="p-4 bg-neutral-900/40 border-t border-neutral-700/50">
          <div className="flex items-center gap-2">
            {/* 上傳圖片按鈕 */}
            <button className="p-3 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-full transition-colors focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            {/* 輸入框 */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="輸入訊息..."
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white rounded-full px-5 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            
            {/* 發送按鈕 */}
            <button className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors shadow-lg shadow-indigo-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ChatPage;
