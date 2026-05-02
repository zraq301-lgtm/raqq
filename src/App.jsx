import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import PurchasesManager from './components/PurchasesManager';
import { LayoutDashboard, Box, FileText, ShoppingCart } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('dashboard');
  
  // 1. تعديل: قراءة البيانات من ذاكرة المتصفح فور فتح التطبيق
  const [categories, setCategories] = useState(() => {
    const localData = localStorage.getItem('warehouse_data');
    return localData ? JSON.parse(localData) : [
      { id: 1, name: "قسم البولي إيثيلين", balance: 150, operations: [] },
      { id: 2, name: "قسم الأصباغ الخام", balance: 45, operations: [] }
    ];
  });

  // 2. إضافة: حفظ أي تغيير يحدث (إضافة أو حذف) في الذاكرة فوراً
  useEffect(() => {
    localStorage.setItem('warehouse_data', JSON.stringify(categories));
  }, [categories]);

  // دالة الحذف (أصبحت الآن فعالة ونهائية)
  const handleDeleteCategory = (id) => {
    if (window.confirm("هل تريد حذف هذا الرف نهائياً؟")) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  // دالة إضافة المشتريات (أصبحت الآن تحفظ المنتج الجديد للأبد)
  const handleNewPurchase = (data) => {
    setCategories(prevCategories => {
      const exists = prevCategories.find(item => item.name === data.name);
      if (exists) {
        return prevCategories.map(item => 
          item.name === data.name ? { ...item, balance: item.balance + data.amount } : item
        );
      } else {
        const newCategory = {
          id: Date.now(),
          name: data.name,
          balance: data.amount,
          operations: [{
            date: new Date().toLocaleDateString(),
            type: 'شراء جديد',
            amount: data.amount,
            finalBalance: data.amount
          }]
        };
        return [...prevCategories, newCategory];
      }
    });
    setPage('inventory');
  };

  // دالة التحديث (للسحب اليدوي إن وجد)
  const handleUpdate = (id, type) => {
    const val = parseFloat(prompt(type === 'IN' ? "كمية التوريد؟" : "كمية السحب؟"));
    if (!val || val <= 0) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const newBalance = type === 'IN' ? cat.balance + val : cat.balance - val;
        if (newBalance < 0) { alert("المخزن لا يكفي!"); return cat; }
        return {
          ...cat, balance: newBalance,
          operations: [...cat.operations, { date: new Date().toLocaleDateString(), type, amount: val, finalBalance: newBalance }]
        };
      }
      return cat;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      <nav className="bg-white p-4 shadow-sm text-center font-bold text-blue-600 text-lg sticky top-0 z-50">
        نظام إدارة المشتريات والمخزن المطور
      </nav>

      <main className="p-4">
        {page === 'dashboard' && <Dashboard categories={categories} />}
        {page === 'inventory' && (
          <Inventory 
            categories={categories} 
            onDelete={handleDeleteCategory} 
            onUpdate={handleUpdate} 
          />
        )}
        {page === 'reports' && <Reports categories={categories} />}
        {page === 'purchases' && <PurchasesManager onPurchaseComplete={handleNewPurchase} />}
      </main>

      {/* القائمة السفلية */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-2xl z-50">
        <button onClick={() => setPage('dashboard')} className={page === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}>
          <LayoutDashboard size={28} />
        </button>
        <button onClick={() => setPage('purchases')} className={page === 'purchases' ? 'text-purple-600' : 'text-gray-400'}>
          <ShoppingCart size={28} />
        </button>
        <button onClick={() => setPage('inventory')} className={page === 'inventory' ? 'text-blue-600' : 'text-gray-400'}>
          <Box size={28} />
        </button>
        <button onClick={() => setPage('reports')} className={page === 'reports' ? 'text-blue-600' : 'text-gray-400'}>
          <FileText size={28} />
        </button>
      </div>
    </div>
  );
}
