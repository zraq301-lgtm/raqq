import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView'; 
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import PurchasesManager from './components/PurchasesManager';
import ProductionManager from './components/ProductionManager';
import { LayoutDashboard, Box, FileText, ShoppingCart, Factory, Home, Package, Activity } from 'lucide-react';
import './App.css'; // استيراد ملف التنسيق الخاص بك

export default function App() {
  const [page, setPage] = useState('home');
  
  const [categories, setCategories] = useState(() => {
    const localData = localStorage.getItem('warehouse_data');
    // إضافة السعر (price) للبيانات الافتراضية
    return localData ? JSON.parse(localData) : [
      { id: 1, name: "قسم البولي إيثيلين", balance: 150, price: 0, operations: [] },
      { id: 2, name: "قسم الأصباغ الخام", balance: 45, price: 0, operations: [] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('warehouse_data', JSON.stringify(categories));
  }, [categories]);

  const totalStock = categories.reduce((acc, cat) => acc + cat.balance, 0);

  // --- دوال التحكم (تم تحديثها لدعم السعر) ---
  const handleDeleteCategory = (id) => {
    if (window.confirm("هل تريد حذف هذا القسم؟")) {
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
                price: data.price || item.price, // تحديث السعر إذا توفر في المشتريات
                operations: [...item.operations, { 
                  date: new Date().toLocaleDateString(), 
                  type: 'توريد', 
                  amount: data.amount, 
                  finalBalance: item.balance + data.amount 
                }] 
              } 
            : item
        );
      }
      // إضافة صنف جديد مع السعر
      return [...prevCategories, { 
        id: Date.now(), 
        name: data.name, 
        balance: data.amount, 
        price: data.price || 0, // السعر الجديد
        operations: [{ 
          date: new Date().toLocaleDateString(), 
          type: 'إضافة صنف', 
          amount: data.amount, 
          finalBalance: data.amount 
        }] 
      }];
    });
    setPage('inventory');
  };

  return (
    <div className="app-container" dir="rtl">
      
      {/* الهيدر العلوي - نحيف جداً وثابت */}
      <nav className="main-nav">
        <div className="nav-content">
          <span className="app-logo">المخزن الذكي</span>

          <div className="stats-container">
            <div className="stats-badge">
              <Package size={14} />
              <span>{totalStock}</span>
            </div>
            <div className="stats-badge">
              <Activity size={14} />
              <span>{categories.length}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* محتوى الصفحات */}
      <main className="page-content">
        {page === 'home' && <HomeView categories={categories} />}
        {page === 'dashboard' && <Dashboard categories={categories} />}
        {page === 'inventory' && <Inventory categories={categories} onDelete={handleDeleteCategory} onUpdate={(id, type) => {}} />}
        {page === 'purchases' && <PurchasesManager onPurchaseComplete={handleNewPurchase} />}
        {page === 'production' && <ProductionManager categories={categories} onProductionComplete={() => {}} />}
        {page === 'reports' && <Reports categories={categories} />}
      </main>

      {/* المنيو السفلي */}
      <div className="bottom-nav">
        <NavItem active={page === 'home'} onClick={() => setPage('home')} icon={<Home size={22} />} label="الرئيسية" />
        <NavItem active={page === 'dashboard'} onClick={() => setPage('dashboard')} icon={<LayoutDashboard size={22} />} label="البيانات" />
        
        <div className="fab-button-container">
          <button 
            onClick={() => setPage('production')}
            className={`fab-button ${page === 'production' ? 'active' : ''}`}
          >
            <Factory size={26} />
          </button>
        </div>

        <NavItem active={page === 'inventory'} onClick={() => setPage('inventory')} icon={<Box size={22} />} label="المخزن" />
        <NavItem active={page === 'reports'} onClick={() => setPage('reports')} icon={<FileText size={22} />} label="تقارير" />
        <NavItem active={page === 'purchases'} onClick={() => setPage('purchases')} icon={<ShoppingCart size={22} />} label="مشتريات" />
      </div>
    </div>
  );
}

const NavItem = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`}>
    {icon}
    <span className="nav-label">{label}</span>
  </button>
);
