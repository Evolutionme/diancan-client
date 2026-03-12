import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from "firebase/database";
import { db } from './firebase'; // 引入刚才创建的 Firebase 实例

function App() {
  const [roomId, setRoomId] = useState('12345'); // 假设房间号是12345
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // 监听 Firebase 数据库中对应房间的菜品节点
    const cartRef = ref(db, `rooms/${roomId}/cart`);
    
    // onValue 会在初始连接和每次数据变动时自动触发
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase 存的是对象形式的列表 { id1: item1, id2: item2 }，转换为数组
        const itemsArray = Object.values(data);
        setCart(itemsArray);
      } else {
        setCart([]); // 房间为空
      }
    });

    // 卸载组件时取消监听
    return () => unsubscribe();
  }, [roomId]);

  const addDish = (name, price) => {
    const newItem = { name, price };
    // 向 Firebase 对应房间的 cart 节点 push 新数据
    // 我们不需要再自己维护本地 state，Firebase 会瞬间同步回来并触发上面的 onValue
    const cartRef = ref(db, `rooms/${roomId}/cart`);
    push(cartRef, newItem);
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
