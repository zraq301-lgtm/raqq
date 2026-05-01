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

  // ✅ دالة الحذف الجديدة: تقوم بإزالة الرف/الصنف بالكامل من المخزن
  const handleDeleteCategory = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الرف بالكامل من المخزن؟")) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  // ✅ الدالة السحرية: تضيف صنف جديد للمخزن إذا لم يكن موجوداً (تلقائياً من المشتريات)
  const handleNewPurchase = (data) => {
    setCategories(prevCategories => {
      const exists = prevCategories.find(item => item.name === data.name);

      if (exists) {
        return prevCategories.map(item => 
          item.name === data.name 
            ? { ...item, balance: item.balance + data.amount } 
            : item
        );
      } else {
        const newCategory = {
          id: Date.now(),
          name: data.name,
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
    
    // التوجه للمخزن لرؤية الرف الجديد
    setPage('inventory');
  };

  // دالة التحديث اليدوية (اختيارية إذا أردت استدعاءها داخلياً)
  const handleUpdate = (id, type) => {
    const val = parseFloat(prompt(type === 'IN' ? "كمية التوريد؟" : "كمية السحب؟"));
    if (!val || val <= 0) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const newBalance = type === 'IN' ? cat.balance + val : cat.balance - val;
        if (newBalance < 0) {
          alert("المخزن لا يكفي!");
          return cat;
        }
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
      {/* الرأس */}
      <nav className="bg-white p-4 shadow-sm text-center font-bold text-blue-600 text-lg sticky top-0 z-50">
        نظام إدارة المشتريات والمخزن
      </nav>

      {/* محتوى الصفحات */}
      <main className="container mx-auto p-2">
        {page === 'dashboard' && <Dashboard categories={categories} />}
        
        {page === 'inventory' && (
          <Inventory 
            categories={categories} 
            onDelete={handleDeleteCategory} // تفعيل الحذف هنا
            onUpdate={handleUpdate} // تفعيل التحديث اليدوي إذا رغبت
          />
        )}
        
        {page === 'reports' && <Reports categories={categories} />}
        
        {page === 'purchases' && (
          <PurchasesManager onPurchaseComplete={handleNewPurchase} />
        )}
      </main>

      {/* القائمة السفلية للتنقل */}
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
