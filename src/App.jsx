import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import PurchasesManager from './components/PurchasesManager';
import { LayoutDashboard, Box, FileText, ShoppingCart } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('dashboard');
  
  // المخزن يبدأ فارغاً أو بالأقسام الافتراضية
  const [categories, setCategories] = useState([
    { id: 1, name: "قسم البولي إيثيلين", balance: 150, operations: [] },
    { id: 2, name: "قسم الأصباغ الخام", balance: 45, operations: [] },
    { id: 3, name: "قسم الإضافات الكيميائية", balance: 12, operations: [] }
  ]);

  // ✅ الدالة السحرية: تضيف صنف جديد للمخزن إذا لم يكن موجوداً
  const handleNewPurchase = (data) => {
    setCategories(prevCategories => {
      // 1. البحث هل الصنف (مثل خشب زان) موجود فعلاً؟
      const exists = prevCategories.find(item => item.name === data.name);

      if (exists) {
        // 2. إذا كان موجوداً، نحدث الكمية فقط
        return prevCategories.map(item => 
          item.name === data.name 
            ? { ...item, balance: item.balance + data.amount } 
            : item
        );
      } else {
        // 3. إذا كان صنفاً جديداً (كما في صورتك)، ننشئ له قسماً جديداً فوراً
        const newCategory = {
          id: Date.now(), // معرف فريد
          name: data.name, // سيأخذ اسم "خشب زان" من المشتريات
          balance: data.amount,
          operations: [{
            date: new Date().toLocaleDateString(),
            type: 'إضافة أولية (شراء)',
            amount: data.amount,
            finalBalance: data.amount
          }]
        };
        return [...prevCategories, newCategory];
      }
    });
    
    // توجيه تلقائي للمخزن لرؤية الإضافة
    setPage('inventory');
  };

  const handleUpdate = (id, type) => {
    const val = parseFloat(prompt(type === 'IN' ? "كمية التوريد؟" : "كمية السحب؟"));
    if (!val || val <= 0) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const newBalance = type === 'IN' ? cat.balance + val : cat.balance - val;
        if (newBalance < 0) return alert("المخزن لا يكفي!");
        return {
          ...cat,
          balance: newBalance,
          operations: [...cat.operations, { date: new Date().toLocaleDateString(), type, amount: val, finalBalance: newBalance }]
        };
      }
      return cat;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      <nav className="bg-white p-4 shadow-sm text-center font-bold text-blue-600 text-lg sticky top-0 z-50">
        نظام إدارة المشتريات والمخزن
      </nav>

      {page === 'dashboard' && <Dashboard categories={categories} />}
      {page === 'inventory' && <Inventory categories={categories} onUpdate={handleUpdate} />}
      {page === 'reports' && <Reports categories={categories} />}
      {page === 'purchases' && <PurchasesManager onPurchaseComplete={handleNewPurchase} />}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-2xl z-50">
        <button onClick={() => setPage('dashboard')} className={page === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setPage('purchases')} className={page === 'purchases' ? 'text-purple-600' : 'text-gray-400'}>
          <ShoppingCart size={24} />
        </button>
        <button onClick={() => setPage('inventory')} className={page === 'inventory' ? 'text-blue-600' : 'text-gray-400'}>
          <Box size={24} />
        </button>
        <button onClick={() => setPage('reports')} className={page === 'reports' ? 'text-blue-600' : 'text-gray-400'}>
          <FileText size={24} />
        </button>
      </div>
    </div>
  );
}
