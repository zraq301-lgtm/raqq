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

  const totalStock = categories.reduce((acc, cat) => acc + cat.balance, 0);

  // --- دوال التحكم في البيانات (بقيت كما هي تماماً) ---
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
            ? { ...item, balance: item.balance + data.amount, operations: [...item.operations, { date: new Date().toLocaleDateString(), type: 'توريد مشتريات', amount: data.amount, finalBalance: item.balance + data.amount }] } 
            : item
        );
      } else {
        return [...prevCategories, { id: Date.now(), name: data.name, balance: data.amount, operations: [{ date: new Date().toLocaleDateString(), type: 'إضافة صنف جديد', amount: data.amount, finalBalance: data.amount }] }];
      }
    });
    setPage('inventory');
  };

  const handleProductionSync = (data) => {
    setCategories(prevCategories => {
      const targetCategory = prevCategories.find(cat => cat.name === data.categoryName);
      if (!targetCategory || targetCategory.balance < data.amount) {
        if (targetCategory) alert(`عفواً! الكمية لا تكفي. المتوفر: ${targetCategory.balance}`);
        return prevCategories;
      }
      return prevCategories.map(item => 
        item.name === data.categoryName 
          ? { ...item, balance: item.balance - data.amount, operations: [...item.operations, { date: new Date().toLocaleDateString(), type: `سحب للإنتاج (${data.productionLine})`, amount: data.amount, finalBalance: item.balance - data.amount }] } 
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
        return { ...cat, balance: newBalance, operations: [...cat.operations, { date: new Date().toLocaleDateString(), type: type === 'IN' ? 'تعديل (إضافة)' : 'تعديل (سحب)', amount: val, finalBalance: newBalance }] };
      }
      return cat;
    }));
  };

  return (
    <div className="min-h-screen bg-[#fff5f7] pb-24" dir="rtl">
      
      {/* الهيدر العلوي: نحيف جداً، أيقونات بجانب بعضها، ثابت */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#ff4d7d1a] h-12 flex items-center px-4">
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto">
          
          {/* اسم التطبيق الصغير جداً */}
          <span className="text-[#ff4d7d] font-black text-sm tracking-tighter">المخزن الذكي</span>

          {/* أيقونات الإحصائيات بجانب بعضها بشكل أفقي أنيق */}
          <div className="flex gap-2">
            <div className="flex items-center bg-[#ff4d7d0d] px-2 py-1 rounded-lg border border-[#ff4d7d1a]">
              <Package size={14} className="text-[#ff4d7d] ml-1" />
              <span className="text-[11px] font-bold text-gray-700">{totalStock}</span>
            </div>
            
            <div className="flex items-center bg-[#ff4d7d0d] px-2 py-1 rounded-lg border border-[#ff4d7d1a]">
              <Activity size={14} className="text-[#ff4d7d] ml-1" />
              <span className="text-[11px] font-bold text-gray-700">{categories.length}</span>
            </div>
          </div>

        </div>
      </nav>

      {/* محتوى الصفحة الرئيسي */}
      <main className="container mx-auto p-4 max-w-4xl">
        {page === 'home' && <HomeView categories={categories} />}
        {page === 'dashboard' && <Dashboard categories={categories} />}
        {page === 'inventory' && <Inventory categories={categories} onDelete={handleDeleteCategory} onUpdate={handleUpdate} />}
        {page === 'purchases' && <PurchasesManager onPurchaseComplete={handleNewPurchase} />}
        {page === 'production' && <ProductionManager categories={categories} onProductionComplete={handleProductionSync} />}
        {page === 'reports' && <Reports categories={categories} />}
      </main>

      {/* القائمة السفلية الثابتة */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-[0_-4px_15px_rgba(0,0,0,0.05)] h-16 px-2 z-50 border-t border-gray-100">
        <div className="flex justify-around items-center h-full max-w-4xl mx-auto">
          <NavItem active={page === 'home'} onClick={() => setPage('home')} icon={<Home size={22} />} label="الرئيسية" />
          <NavItem active={page === 'dashboard'} onClick={() => setPage('dashboard')} icon={<LayoutDashboard size={22} />} label="البيانات" />
          
          {/* زر الإنتاج المركزي */}
          <div className="relative -top-3">
            <button 
              onClick={() => setPage('production')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${page === 'production' ? 'bg-[#ff4d7d] text-white scale-110' : 'bg-white text-[#ff4d7d] border border-[#ff4d7d33]'}`}
            >
              <Factory size={26} />
            </button>
          </div>

          <NavItem active={page === 'inventory'} onClick={() => setPage('inventory')} icon={<Box size={22} />} label="المخزن" />
          <NavItem active={page === 'reports'} onClick={() => setPage('reports')} icon={<FileText size={22} />} label="تقارير" />
          <NavItem active={page === 'purchases'} onClick={() => setPage('purchases')} icon={<ShoppingCart size={22} />} label="مشتريات" />
        </div>
      </div>
    </div>
  );
}

const NavItem = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center min-w-[60px] transition-all ${active ? 'text-[#ff4d7d]' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[9px] font-bold mt-1">{label}</span>
  </button>
);
