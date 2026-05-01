import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import PurchasesManager from './components/PurchasesManager'; // استدعاء المكون الجديد
import { LayoutDashboard, Box, FileText, ShoppingCart } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('dashboard');
  
  // حالة المخزن (Categories)
  const [categories, setCategories] = useState([
    { id: 1, name: "قسم البولي إيثيلين", balance: 150, operations: [] },
    { id: 2, name: "قسم الأصباغ الخام", balance: 45, operations: [] },
    { id: 3, name: "قسم الإضافات الكيميائية", balance: 12, operations: [] }
  ]);

  // ✅ الدالة المسؤولة عن التواصل (تحديث المخزن فور الشراء)
  const handleNewPurchase = (data) => {
    setCategories(prevCategories => prevCategories.map(item => {
      // الربط يتم عن طريق مطابقة اسم الفئة القادمة من المشتريات مع اسم القسم في المخزن
      if (item.name === data.name) {
        const newBalance = item.balance + data.amount;
        return { 
          ...item, 
          balance: newBalance,
          operations: [
            ...item.operations, 
            { 
              date: new Date().toLocaleDateString(), 
              type: 'IN (شراء)', 
              amount: data.amount, 
              finalBalance: newBalance 
            }
          ]
        };
      }
      return item;
    }));
  };

  // دالة التحديث اليدوي من صفحة المخزن (توريد/سحب)
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

      {/* عرض الصفحات بناءً على الحالة */}
      {page === 'dashboard' && <Dashboard categories={categories} />}
      
      {/* ✅ تمرير المصفوفة التي تتحدث عند الشراء لمكون المخزن */}
      {page === 'inventory' && <Inventory categories={categories} onUpdate={handleUpdate} />}
      
      {page === 'reports' && <Reports categories={categories} />}
      
      {/* ربط مكون المشتريات بدالة التحديث */}
      {page === 'purchases' && <PurchasesManager onPurchaseComplete={handleNewPurchase} />}

      {/* المنيو السفلي */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-2xl z-50">
        <button onClick={() => setPage('dashboard')} className={page === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}>
          <LayoutDashboard size={24} />
          <span className="block text-xs">الرئيسية</span>
        </button>
        
        <button onClick={() => setPage('purchases')} className={page === 'purchases' ? 'text-purple-600' : 'text-gray-400'}>
          <ShoppingCart size={24} />
          <span className="block text-xs">المشتريات</span>
        </button>

        <button onClick={() => setPage('inventory')} className={page === 'inventory' ? 'text-blue-600' : 'text-gray-400'}>
          <Box size={24} />
          <span className="block text-xs">المخزن</span>
        </button>

        <button onClick={() => setPage('reports')} className={page === 'reports' ? 'text-blue-600' : 'text-gray-400'}>
          <FileText size={24} />
          <span className="block text-xs">التقارير</span>
        </button>
      </div>
    </div>
  );
}
