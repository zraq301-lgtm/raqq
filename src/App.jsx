import React, { useState, useEffect } from 'react';
// استيراد مكتبة الإشعارات المحلية
import { LocalNotifications } from '@capacitor/local-notifications';

// استيراد المكونات حسب هيكل المجلدات الظاهر في الصورة
import Dashboard from './components/Dashboard';
import PurchasesManager from './components/PurchasesManager';
import Sales from './components/Sales';
import Waste from './components/Waste';
import Expenses from './components/Expenses';
import Suppliers from './components/Suppliers';
import Financials from './components/Financials';
import Reports from './components/Reports'; 
import Customers from './components/Customers';
import Inventory from './components/Inventory';
import ProductionManager from './components/ProductionManager';

import './App.css'; 

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  // --- شبكة البيانات المركزية (Central State Management) ---
  const [inventory, setInventory] = useState([]);      // سجل الفواتير
  const [stock, setStock] = useState([]);              // أرصدة المخزن الحالية
  const [salesData, setSalesData] = useState([]);      
  const [expenses, setExpenses] = useState([]);        
  const [waste, setWaste] = useState([]);              
  const [suppliers, setSuppliers] = useState([]);      
  const [customers, setCustomers] = useState([]);      
  const [productionData, setProductionData] = useState([]);

  // 1. طلب إذن الإشعارات عند تشغيل التطبيق لأول مرة
  useEffect(() => {
    LocalNotifications.requestPermissions();
  }, []);

  // 2. مراقب المخزن الذكي: يرسل إشعار محلي إذا قل رصيد مادة خام
  useEffect(() => {
    stock.forEach(item => {
      if (item.balance < 5) { // حد التنبيه الأدنى
        scheduleAlert("تنبيه مخزن", `كمية ${item.name} منخفضة جداً (${item.balance})`);
      }
    });
  }, [stock]);

  // دالة جدولة الإشعارات
  const scheduleAlert = async (title, body) => {
    await LocalNotifications.schedule({
      notifications: [{
        title,
        body,
        id: Date.now(),
        schedule: { at: new Date(Date.now() + 1000) }, // يظهر بعد ثانية واحدة
        sound: 'res://notification_sound'
      }]
    });
  };

  // --- محرك التوزيع: ربط المشتريات بالمخزن ---
  const handleSavePurchase = (newPurchase) => {
    setInventory(prev => [...prev, newPurchase]);

    setStock(prevStock => {
      const existingItemIndex = prevStock.findIndex(s => s.name === newPurchase.item);
      const qty = parseFloat(newPurchase.quantity || 0);
      
      if (existingItemIndex > -1) {
        const updated = [...prevStock];
        updated[existingItemIndex].balance += qty;
        return updated;
      } else {
        return [...prevStock, { 
          id: Date.now(), 
          name: newPurchase.item, 
          balance: qty, 
          price: parseFloat(newPurchase.price || 0) 
        }];
      }
    });
    
    scheduleAlert("عملية ناجحة", `تم إضافة ${newPurchase.quantity} إلى المخزن`);
    setActivePage('dashboard');
  };

  // --- محرك التوزيع: ربط المبيعات والإنتاج بتنقيص المخزن ---
  const handleGeneralUpdate = (type, data) => {
    if (type === 'sales') setSalesData([...salesData, data]);
    if (type === 'waste') setWaste([...waste, data]);
    
    // منطق تحديث المخزن التلقائي (نقص الكميات)
    if (data.itemName) {
      setStock(prev => prev.map(item => 
        item.name === data.itemName 
        ? { ...item, balance: item.balance - (data.quantity || 0) } 
        : item
      ));
    }
  };

  const renderPage = () => {
    const commonProps = { onBack: () => setActivePage('dashboard') };

    switch(activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} />;
      
      case 'purchases': 
        return <PurchasesManager {...commonProps} onPurchaseComplete={handleSavePurchase} />;

      case 'inventory': 
        return <Inventory {...commonProps} categories={stock} onDelete={(id) => setStock(stock.filter(s => s.id !== id))} />;

      case 'sales': 
        return <Sales {...commonProps} onSaveSale={(s) => handleGeneralUpdate('sales', s)} customers={customers} />;

      case 'production':
        return <ProductionManager {...commonProps} stock={stock} onSaveProduction={(p) => setProductionData([...productionData, p])} />;

      case 'waste': 
        return <Waste {...commonProps} inventory={stock} onSaveWaste={(w) => handleGeneralUpdate('waste', w)} />;

      case 'expenses': 
        return <Expenses {...commonProps} onSaveExpense={(e) => setExpenses([...expenses, e])} />;

      case 'suppliers': 
        return <Suppliers {...commonProps} suppliers={suppliers} onAddSupplier={(s) => setSuppliers([...suppliers, s])} />;

      case 'customers': 
        return <Customers {...commonProps} customers={customers} onAddCustomer={(c) => setCustomers([...customers, c])} />;

      case 'financials': 
        return <Financials {...commonProps} salesData={salesData} expenses={expenses} />;

      case 'reports': 
        return <Reports {...commonProps} inventory={inventory} stock={stock} salesData={salesData} expenses={expenses} />;

      default: return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container" style={{ direction: 'rtl' }}>
      {activePage !== 'dashboard' && (
        <nav className="nav-bar">
          <div className="nav-content">
            <span className="logo">معمول <span className="highlight">راق</span></span>
            <button onClick={() => setActivePage('dashboard')} className="home-icon-btn">
              🏠 الرئيسية
            </button>
          </div>
        </nav>
      )}

      <main className="main-content">
        {renderPage()}
      </main>

      {/* شريط سفلي سريع للتنقل (اختياري لتحسين UI الجوال) */}
      <footer className="mobile-footer">
        <button onClick={() => setActivePage('sales')}>💰 بيع</button>
        <button onClick={() => setActivePage('inventory')}>📦 مخزن</button>
        <button onClick={() => setActivePage('reports')}>📊 تقارير</button>
      </footer>
    </div>
  );
};

export default App;
