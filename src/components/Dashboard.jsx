import React from 'react';
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react';

export default function Dashboard({ categories }) {
  const totalItems = categories.reduce((sum, cat) => sum + cat.balance, 0);
  const totalOps = categories.reduce((sum, cat) => sum + cat.operations.length, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border-r-4 border-orange-500">
        <div className="flex items-center gap-2 text-orange-600 mb-1">
          <Activity size={18} />
          <span className="text-sm font-bold">حالة النظام</span>
        </div>
        <p className="text-2xl font-black text-gray-800">مستقر</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600 p-4 rounded-2xl text-white">
          <p className="text-xs opacity-80">إجمالي الوحدات</p>
          <p className="text-xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-indigo-600 p-4 rounded-2xl text-white">
          <p className="text-xs opacity-80">عمليات اليوم</p>
          <p className="text-xl font-bold">{totalOps}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" /> تنبيهات النقص
        </h3>
        {categories.filter(c => c.balance < 10).map(c => (
          <div key={c.id} className="text-sm text-red-600 bg-red-50 p-2 rounded-lg mb-2">
             الرصيد منخفض جداً في <strong>{c.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
