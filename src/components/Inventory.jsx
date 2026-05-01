import React from 'react';
import { Plus, Minus, Package } from 'lucide-react';

export default function Inventory({ categories, onUpdate }) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4 border-r-4 border-blue-600 pr-2">أقسام المواد الخام</h2>
      {categories.map((cat) => (
        <div key={cat.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700">{cat.name}</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
               {cat.balance} وحدة
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdate(cat.id, 'IN')}
              className="flex-1 bg-green-500 text-white py-3 rounded-xl flex justify-center items-center gap-1 active:scale-95 transition"
            >
              <Plus size={18}/> توريد
            </button>
            <button 
              onClick={() => onUpdate(cat.id, 'OUT')}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl flex justify-center items-center gap-1 active:scale-95 transition"
            >
              <Minus size={18}/> سحب
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
