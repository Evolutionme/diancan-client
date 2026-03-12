import React, { useState, useEffect } from 'react';
import { ref, onValue, push, remove } from "firebase/database";
import { db } from './firebase';

const CATEGORIES = [
  { id: 'meat', name: '🥩 荤菜', color: 'bg-red-500' },
  { id: 'veg', name: '🥗 素菜', color: 'bg-green-500' },
  { id: 'rice', name: '🍚 主食', color: 'bg-yellow-500' },
  { id: 'drinks', name: '🥤 饮料', color: 'bg-blue-500' }
];

const DEFAULT_MENU = [
  { id: 'd1', name: '宫保鸡丁', price: 38, category: 'meat' },
  { id: 'd2', name: '水煮牛肉', price: 58, category: 'meat' },
  { id: 'd3', name: '清炒时蔬', price: 18, category: 'veg' },
  { id: 'd4', name: '麻婆豆腐', price: 22, category: 'veg' },
  { id: 'd5', name: '米饭', price: 3, category: 'rice' },
  { id: 'd6', name: '扬州炒饭', price: 15, category: 'rice' },
  { id: 'd7', name: '可口可乐', price: 5, category: 'drinks' },
  { id: 'd8', name: '鲜榨西瓜汁', price: 15, category: 'drinks' }
];

function App() {
  const [roomId, setRoomId] = useState('12345');
  const [cart, setCart] = useState([]);
  const [customMenu, setCustomMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState('meat');
  
  const [cartOpen, setCartOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: '', category: 'meat' });

  useEffect(() => {
    const cartRef = ref(db, `rooms/${roomId}/cart`);
    const unsubCart = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCart(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    const menuRef = ref(db, `rooms/${roomId}/customMenu`);
    const unsubMenu = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      setCustomMenu(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    return () => {
      unsubCart();
      unsubMenu();
    };
  }, [roomId]);

  const allMenu = [...DEFAULT_MENU, ...customMenu];
  const currentDishes = allMenu.filter(dish => dish.category === activeCategory);
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const addDishToCart = (dish) => {
    push(ref(db, `rooms/${roomId}/cart`), { name: dish.name, price: Number(dish.price) });
  };

  const removeDishFromCart = (cartItemId) => {
    remove(ref(db, `rooms/${roomId}/cart/${cartItemId}`));
  };

  const handleCreateDish = (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;
    push(ref(db, `rooms/${roomId}/customMenu`), { 
      name: newDish.name, 
      price: Number(newDish.price), 
      category: newDish.category 
    });
    setNewDish({ name: '', price: '', category: 'meat' });
    setShowForm(false);
    setActiveCategory(newDish.category);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-32 w-full max-w-md mx-auto relative shadow-2xl">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center rounded-b-xl">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">异地同步点餐</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md active:scale-95 transition-transform"
        >
          {showForm ? '取消' : '➕ 新增菜品'}
        </button>
      </div>

      {showForm && (
        <div className="p-5 m-4 bg-white rounded-2xl shadow-lg border border-indigo-50 animate-fade-in">
          <h2 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">创造新菜品 (两端同步显示)</h2>
          <form onSubmit={handleCreateDish} className="flex flex-col gap-4">
            <input 
              type="text" placeholder="菜品名称" required
              className="border border-gray-200 p-3 rounded-xl w-full outline-indigo-500 bg-gray-50 focus:bg-white transition-colors"
              value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})}
            />
            <div className="flex gap-3">
              <input 
                type="number" placeholder="价格(元)" required min="0" step="0.1"
                className="border border-gray-200 p-3 rounded-xl flex-1 outline-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})}
              />
              <select 
                className="border border-gray-200 p-3 rounded-xl flex-1 outline-indigo-500 bg-gray-50 focus:bg-white transition-colors cursor-pointer"
                value={newDish.category} onChange={e => setNewDish({...newDish, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl mt-2 shadow-md flex justify-center items-center gap-2 active:scale-95 transition-all">
              保存并同步上架
            </button>
          </form>
        </div>
      )}

      <div className="flex overflow-x-auto px-4 py-5 gap-3 no-scrollbar pb-2">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              activeCategory === category.id 
                ? `${category.color} text-white shadow-lg scale-105` 
                : 'bg-white text-gray-600 border border-transparent shadow-sm hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="px-4 grid grid-cols-2 gap-4 pb-8">
        {currentDishes.map((dish) => (
          <div key={dish.id} onClick={() => addDishToCart(dish)} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 active:scale-95 transition-all active:bg-indigo-50 cursor-pointer flex flex-col justify-between aspect-square group">
            <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{dish.name}</h3>
            <div className="mt-auto flex justify-between items-end">
              <span className="text-red-500 font-bold text-xl">￥{dish.price}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold pb-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors">+</div>
            </div>
          </div>
        ))}
        {currentDishes.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="text-4xl mb-3">🍳</div>
            <p>这个分类下还没有菜哦</p>
            <p className="text-sm mt-1">点击右上角添加您的拿手好菜</p>
          </div>
        )}
      </div>

      {/* 左下角悬浮购物车 */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
        {/* 展开的购物车面板 */}
        {cartOpen && (
          <div className="bg-white shadow-2xl rounded-2xl mb-4 w-[85vw] max-w-sm max-h-[60vh] flex flex-col border border-gray-100 animate-slide-up origin-bottom-left">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="font-bold text-gray-800">已点菜品 ({cart.length})</h2>
              <div className="flex items-center gap-4">
                <span className="font-bold text-red-500">￥{total.toFixed(2)}</span>
                <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">✕</button>
              </div>
            </div>
            <div className="overflow-y-auto p-2 flex-1 scroll-smooth">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-6">购物车是空的</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl group transition-colors">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-600">￥{item.price}</span>
                        <button 
                          onClick={() => removeDishFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                        >✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 悬浮按钮图标 */}
        <button 
          onClick={() => setCartOpen(!cartOpen)}
          className="relative bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-indigo-700 active:scale-90 transition-all z-50 group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
