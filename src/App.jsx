import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView'; // استيراد المكون الجديد
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import PurchasesManager from './components/PurchasesManager';
import ProductionManager from './components/ProductionManager';
import { LayoutDashboard, Box, FileText, ShoppingCart, Factory, Home } from 'lucide-react';

export default function App() {
  // التعديل: جعل التطبيق يفتح على صفحة الـ home
  const [page, setPage] = useState('home');
  
  const [categories, setCategories] = useState(() => {
    const localData = localStorage.getItem('warehouse_data');
    return localData ? JSON.parse(localData) : [
      { id: 1, name: "قسم البولي إيثيلين", balance: 150, operations: [] },
      { id: 2, name: "قسم الأصباغ الخام", balance: 45, operations: [] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('warehouse_data', JSON.stringify(categories));
  }, [categories]);

  // --- دوال التحكم في البيانات ---

  const handleDeleteCategory = (id) => {
    if (window.confirm("هل تريد حذف هذا القسم نهائياً من المخزن؟")) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

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

  const handleProductionSync = (data) => {
    setCategories(prevCategories => {
      const targetCategory = prevCategories.find(cat => cat.name === data.categoryName);
      if (!targetCategory) return prevCategories;

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
    <div className="min-h-screen bg-gray-50 pb-28" dir="rtl">
      {/* الهيدر العلوي */}
      <nav className="bg-white p-4 shadow-md text-center font-bold text-blue-700 text-xl sticky top-0 z-50">
        المخزن الذكي | نظام الإدارة المتكامل
      </nav>

      {/* عرض الصفحات */}
      <main className="container mx-auto p-4 max-w-4xl">
        {page === 'home' && <HomeView categories={categories} />}
        {page === 'dashboard' && <Dashboard categories={categories} />}
        {page === 'inventory' && (
          <Inventory 
            categories={categories} 
            onDelete={handleDeleteCategory} 
            onUpdate={handleUpdate} 
          />
        )}
        {page === 'purchases' && <PurchasesManager onPurchaseComplete={handleNewPurchase} />}
        {page === 'production' && (
          <ProductionManager 
            categories={categories} 
            onProductionComplete={handleProductionSync} 
          />
        )}
        {page === 'reports' && <Reports categories={categories} />}
      </main>

      {/* القائمة السفلية (Navigation) - تم تعديلها لتكون واسعة وبأيقونات كبيرة */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-between items-center px-6 py-4 shadow-[0_-10px_25px_rgba(0,0,0,0.1)] z-50 rounded-t-[30px]">
        <NavItem active={page === 'home'} onClick={() => setPage('home')} icon={<Home size={32} />} color="text-blue-600" />
        <NavItem active={page === 'dashboard'} onClick={() => setPage('dashboard')} icon={<LayoutDashboard size={32} />} color="text-indigo-600" />
        <NavItem active={page === 'purchases'} onClick={() => setPage('purchases')} icon={<ShoppingCart size={32} />} color="text-purple-600" />
        <NavItem active={page === 'production'} onClick={() => setPage('production')} icon={<Factory size={32} />} color="text-orange-600" />
        <NavItem active={page === 'inventory'} onClick={() => setPage('inventory')} icon={<Box size={32} />} color="text-blue-600" />
        <NavItem active={page === 'reports'} onClick={() => setPage('reports')} icon={<FileText size={32} />} color="text-emerald-600" />
      </div>
    </div>
  );
}

// مكون أزرار التنقل مع تأثيرات بصرية عند الضغط
const NavItem = ({ active, onClick, icon, color = "text-blue-600" }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center transition-all duration-300 ${active ? `${color} scale-110 -translate-y-2` : 'text-gray-400 hover:text-gray-500'}`}
  >
    <div className={`${active ? 'bg-gray-100 p-2 rounded-2xl shadow-inner' : ''}`}>
      {icon}
    </div>
  </button>
);
