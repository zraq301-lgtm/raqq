import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { LayoutGrid, Plus, Minus, FileText, Download, TrendingUp, Package } from 'lucide-react';

// نظام إدارة المخازن الاحترافي
const App = () => {
  // الحالة العامة للأقسام (المخزون)
  const [categories, setCategories] = useState([
    { id: 1, name: "قسم المواد الخام", balance: 0, operations: [] },
    { id: 2, name: "قسم التعبئة والتغليف", balance: 0, operations: [] },
    { id: 3, name: "قسم قطع الغيار", balance: 0, operations: [] }
  ]);

  // دالة لإضافة حركة (شراء أو سحب)
  const handleTransaction = (categoryId, type, amount) => {
    if (amount <= 0 || isNaN(amount)) return alert("أدخل رقم صحيح");
    
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newBalance = type === 'IN' ? cat.balance + amount : cat.balance - amount;
        if (newBalance < 0) {
          alert("عذراً، المخزون لا يكفي!");
          return cat;
        }
        return {
          ...cat,
          balance: newBalance,
          operations: [...cat.operations, {
            date: new Date().toLocaleString(),
            type: type === 'IN' ? 'توريد/شراء' : 'سحب/صرف',
            amount: amount,
            finalBalance: newBalance
          }]
        };
      }
      return cat;
    }));
  };

  // دالة تصدير البيانات إلى Excel
  const exportToExcel = (cat) => {
    const ws = XLSX.utils.json_to_sheet(cat.operations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, cat.name);
    XLSX.writeFile(wb, `${cat.name}_تقرير.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package size={28} /> نظام إدارة المخازن الذكي
        </h1>
        <p className="opacity-80 mt-2">نظام حسابي متقدم - نسخة الأندرويد</p>
      </header>

      {/* لوحة التحكم السريعة */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-green-500">
          <p className="text-gray-500 text-sm">إجمالي العمليات</p>
          <h3 className="text-xl font-bold">{categories.reduce((acc, c) => acc + c.operations.length, 0)}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-blue-500">
          <p className="text-gray-500 text-sm">عدد الأقسام</p>
          <h3 className="text-xl font-bold">{categories.length}</h3>
        </div>
      </div>

      {/* عرض الأقسام */}
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg text-gray-700">{cat.name}</h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                المتوفر: {cat.balance} وحدة
              </span>
            </div>

            <div className="p-4 flex flex-wrap gap-4">
              {/* أزرار الإضافات والسحب */}
              <button 
                onClick={() => {
                  const val = parseFloat(prompt("كمية المواد المشتراة؟"));
                  handleTransaction(cat.id, 'IN', val);
                }}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Plus size={20} /> إضافة مشتريات
              </button>

              <button 
                onClick={() => {
                  const val = parseFloat(prompt("الكمية المراد سحبها؟"));
                  handleTransaction(cat.id, 'OUT', val);
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Minus size={20} /> سحب مواد
              </button>
            </div>

            {/* قسم التقارير الصغير داخل كل قسم */}
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <button 
                onClick={() => exportToExcel(cat)}
                className="text-blue-600 flex items-center gap-1 text-sm font-medium"
              >
                <Download size={16} /> تحميل اكسل
              </button>
              <p className="text-xs text-gray-400">آخر عملية: {cat.operations.slice(-1)[0]?.date || 'لا يوجد'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* فوتر النظام الحسابي */}
      <footer className="mt-10 pb-10 text-center text-gray-400 text-sm">
        <p>نظام التتبع المتطور v1.0</p>
        <p>يعمل بكفاءة على Vercel & Android</p>
      </footer>
    </div>
  );
};

export default App;
