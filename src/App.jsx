import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView'; 
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import PurchasesManager from './components/PurchasesManager';
import ProductionManager from './components/ProductionManager';
import { LayoutDashboard, Box, FileText, ShoppingCart, Factory, Home, Package, Activity } from 'lucide-react';

export default function App() {
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

  // دالة لجلب اسم الصفحة الحالية لعرضه في الهيدر بشكل أنيق
  const getPageTitle = () => {
    switch(page) {
      case 'home': return 'الرئيسية';
      case 'dashboard': return 'لوحة التحكم';
      case 'inventory': return 'إدارة المخزن';
      case 'purchases': return 'المشتريات';
      case 'production': return 'خط الإنتاج';
      case 'reports': return 'التقارير';
      default: return 'المخزن الذكي';
    }
  };

  const totalStock = categories.reduce((acc, cat) => acc + cat.balance, 0);

  // --- دوال التحكم في البيانات (بدون أي تغيير) ---
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
    <div className="min-h-screen bg-[#fff5f7] pb-28" dir="rtl">
      
      {/* الهيدر العلوي المطور مع اسم القسم */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-[#ff4d7d1a] px-4 shadow-sm">
        <div className="flex flex-col items-center py-2">
          {/* اسم القسم الحالي بشكل أنيق */}
          <div className="mb-2 bg-[#ff4d7d] text-white px-6 py-1 rounded-full text-xs font-bold shadow-md">
            {getPageTitle()}
          </div>

          <div className="flex justify-center gap-3 w-full">
            {/* بطاقة إجمالي المخزون */}
            <div className="flex items-center bg-white border border-[#ff4d7d26] rounded-2xl px-3 py-1 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#ff4d7d1a] flex items-center justify-center text-[#ff4d7d] ml-2">
                <Package size={18} />
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-[#ff4d7d] m-0">المخزون</p>
                <p className="text-xs font-black text-gray-700 m-0">{totalStock}</p>
              </div>
            </div>

            {/* بطاقة عدد الأقسام */}
            <div className="flex items-center bg-white border border-[#ff4d7d26] rounded-2xl px-3 py-1 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#ff4d7d1a] flex items-center justify-center text-[#ff4d7d] ml-2">
                <Activity size={18} />
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-[#ff4d7d] m-0">الأقسام</p>
                <p className="text-xs font-black text-gray-700 m-0">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>
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

      {/* المنيو السفلي */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-6px_20px_rgba(255,77,125,0.1)] rounded-t-[30px] h-20 px-4 z-50">
        <div className="flex justify-around items-center h-full">
          <NavItem active={page === 'home'} onClick={() => setPage('home')} icon={<Home size={28} />} label="الرئيسية" />
          <NavItem active={page === 'dashboard'} onClick={() => setPage('dashboard')} icon={<LayoutDashboard size={28} />} label="البيانات" />
          <NavItem active={page === 'purchases'} onClick={() => setPage('purchases')} icon={<ShoppingCart size={28} />} label="مشتريات" />
          
          <div className="relative -top-5">
            <button 
              onClick={() => setPage('production')}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-300 ${page === 'production' ? 'bg-[#ff4d7d] border-white text-white scale-110' : 'bg-white border-[#ff4d7d] text-[#ff4d7d]'}`}
            >
              <Factory size={32} />
            </button>
            <p className="text-[10px] font-bold text-[#ff4d7d] text-center mt-1">الإنتاج</p>
          </div>

          <NavItem active={page === 'inventory'} onClick={() => setPage('inventory')} icon={<Box size={28} />} label="المخزن" />
          <NavItem active={page === 'reports'} onClick={() => setPage('reports')} icon={<FileText size={28} />} label="تقارير" />
        </div>
      </div>
    </div>
  );
}

const NavItem = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center transition-all duration-300 ${active ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
  >
    <div className={`p-1 ${active ? 'text-[#ff4d7d]' : 'text-gray-500'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold mt-1 ${active ? 'text-[#ff4d7d]' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);
