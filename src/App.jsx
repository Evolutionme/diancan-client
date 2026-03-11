import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// VITE_BACKEND_URL 将在 Vercel 中配置，如果在本地运行则回退到 localhost
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const socket = io(backendUrl);

function App() {
  const [roomId, setRoomId] = useState('12345'); // 假设房间号是12345
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // 自动加入房间
    socket.emit('join_room', roomId);

    // 监听对方点菜
    socket.on('update_cart', (item) => {
      setCart((prev) => [...prev, item]);
    });

    return () => {
      socket.off('update_cart');
    }
  }, [roomId]);

  const addDish = (name, price) => {
    const newItem = { name, price, roomId };
    setCart([...cart, newItem]);
    // 通知对方
    socket.emit('add_to_cart', newItem);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-sans w-full max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center mb-6">异地同步点餐</h1>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* 模拟菜品卡片 */}
        <button onClick={() => addDish('宫保鸡丁', 38)} className="bg-orange-500 text-white p-4 rounded-lg shadow-md transition-transform active:scale-95">
          点一份 宫保鸡丁 ￥38
        </button>
        <button onClick={() => addDish('水煮牛肉', 58)} className="bg-red-500 text-white p-4 rounded-lg shadow-md transition-transform active:scale-95">
          点一份 水煮牛肉 ￥58
        </button>
        <button onClick={() => addDish('清炒时蔬', 18)} className="bg-green-500 text-white p-4 rounded-lg shadow-md transition-transform active:scale-95">
          点一份 清炒时蔬 ￥18
        </button>
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-4 border-b pb-2">已选菜品（实时更新）：</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">购物车空空如也...</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex justify-between p-2 border-b last:border-0 hover:bg-gray-50">
              <span>{item.name}</span>
              <span className="font-bold text-gray-700">￥{item.price}</span>
            </div>
          ))
        )}
        {cart.length > 0 && (
          <div className="mt-4 pt-4 border-t flex justify-between font-bold text-xl">
            <span>总计:</span>
            <span className="text-red-500">￥{cart.reduce((sum, item) => sum + item.price, 0)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
