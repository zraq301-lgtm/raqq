import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import PurchasesManager from './components/PurchasesManager';
import ProductionManager from './components/ProductionManager'; // المكون الجديد
import { LayoutDashboard, Box, FileText, ShoppingCart, Factory } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('dashboard');
  
  // تحميل البيانات من ذاكرة المتصفح
  const [categories, setCategories] = useState(() => {
    const localData = localStorage.getItem('warehouse_data');
    return localData ? JSON.parse(localData) : [
      { id: 1, name: "قسم البولي إيثيلين", balance: 150, operations: [] },
      { id: 2, name: "قسم الأصباغ الخام", balance: 45, operations: [] }
    ];
  });

  // مزامنة البيانات مع ذاكرة المتصفح عند أي تغيير
  useEffect(() => {
    localStorage.setItem('warehouse_data', JSON.stringify(categories));
  }, [categories]);

  // --- دوال التحكم في البيانات ---

  // 1. حذف رف (قسم) بالكامل
  const handleDeleteCategory = (id) => {
    if (window.confirm("هل تريد حذف هذا القسم نهائياً من المخزن؟")) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  // 2. معالجة المشتريات (إضافة للمخزن)
  const handleNewPurchase = (data) => {
    setCategories(prevCategories => {
      const exists = prevCategories.find(item => item.name === data.name);
      
      if (exists) {
        return prevCategories.map(item => 
          item.name === data.name 
            ? { 
                ...item, 
                balance: item.balance + data.amount,
                operations: [...item.operations, {
                  date: new Date().toLocaleDateString(),
                  type: 'توريد مشتريات',
                  amount: data.amount,
                  finalBalance: item.balance + data.amount
                }]
              } 
            : item
        );
      } else {
        return [...prevCategories, {
          id: Date.now(),
          name: data.name,
          balance: data.amount,
          operations: [{
            date: new Date().toLocaleDateString(),
            type: 'إضافة صنف جديد',
            amount: data.amount,
            finalBalance: data.amount
          }]
        }];
      }
    });
    setPage('inventory');
  };

  // 3. معالجة الإنتاج (سحب من المخزن)
  const handleProductionSync = (data) => {
    setCategories(prevCategories => {
      const targetCategory = prevCategories.find(cat => cat.name === data.categoryName);

      if (!targetCategory) {
        alert("القسم غير موجود!");
        return prevCategories;
      }

      if (targetCategory.balance < data.amount) {
        alert(`عفواً! الكمية لا تكفي. المتوفر: ${targetCategory.balance}`);
        return prevCategories;
      }

      return prevCategories.map(item => 
        item.name === data.categoryName 
          ? { 
              ...item, 
              balance: item.balance - data.amount,
              operations: [...item.operations, {
                date: new Date().toLocaleDateString(),
                type: `سحب للإنتاج (${data.productionLine})`,
                amount: data.amount,
                finalBalance: item.balance - data.amount
              }]
            } 
          : item
      );
    });
    setPage('inventory');
  };

  // 4. التعديل اليدوي السريع
  const handleUpdate = (id, type) => {
    const val = parseFloat(prompt(type === 'IN' ? "كمية التوريد؟" : "كمية السحب؟"));
    if (!val || val <= 0) return;

    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const newBalance = type === 'IN' ? cat.balance + val : cat.balance - val;
        if (newBalance < 0) { alert("المخزن لا يكفي!"); return cat; }
        return {
          ...cat,
          balance: newBalance,
          operations: [...cat.operations, {
            date: new Date().toLocaleDateString(),
            type: type === 'IN' ? 'تعديل (إضافة)' : 'تعديل (سحب)',
            amount: val,
            finalBalance: newBalance
          }]
        };
      }
      return cat;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      {/* الهيدر العلوي */}
      <nav className="bg-white p-4 shadow-md text-center font-bold text-blue-700 text-xl sticky top-0 z-50">
        المخزن الذكي | إدارة المشتريات والإنتاج
      </nav>

      {/* عرض الصفحات */}
      <main className="container mx-auto p-4 max-w-4xl">
        {page === 'dashboard' && <Dashboard categories={categories} />}
        
        {page === 'inventory' && (
          <Inventory 
            categories={categories} 
            onDelete={handleDeleteCategory} 
            onUpdate={handleUpdate} 
          />
        )}

        {page === 'purchases' && (
          <PurchasesManager onPurchaseComplete={handleNewPurchase} />
        )}

        {page === 'production' && (
          <ProductionManager 
            categories={categories} 
            onProductionComplete={handleProductionSync} 
          />
        )}

        {page === 'reports' && <Reports categories={categories} />}
      </main>

      {/* القائمة السفلية (Navigation) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4 shadow-2xl z-50 rounded-t-2xl">
        <NavItem active={page === 'dashboard'} onClick={() => setPage('dashboard')} icon={<LayoutDashboard size={26} />} />
        <NavItem active={page === 'purchases'} onClick={() => setPage('purchases')} icon={<ShoppingCart size={26} />} color="text-purple-600" />
        <NavItem active={page === 'production'} onClick={() => setPage('production')} icon={<Factory size={26} />} color="text-orange-600" />
        <NavItem active={page === 'inventory'} onClick={() => setPage('inventory')} icon={<Box size={26} />} color="text-blue-600" />
        <NavItem active={page === 'reports'} onClick={() => setPage('reports')} icon={<FileText size={26} />} color="text-emerald-600" />
      </div>
    </div>
  );
}

// مكون فرعي لأزرار التنقل لضمان نظافة الكود
const NavItem = ({ active, onClick, icon, color = "text-blue-600" }) => (
  <button 
    onClick={onClick} 
    className={`transition-all transform ${active ? `${color} scale-125` : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
  </button>
);
