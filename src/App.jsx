import React, { useState } from 'react';
// استيراد المكونات (تأكد من مطابقة أسماء الملفات في مجلد components)
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
  // الحالة المسؤولة عن التنقل - تبدأ بلوحة التحكم
  const [activePage, setActivePage] = useState('dashboard');
  
  // --- الحالة المركزية للبيانات (Logic Core) ---
  const [inventory, setInventory] = useState([]);      // سجل فواتير المشتريات
  const [stock, setStock] = useState([]);              // أرصدة المخزن الحالية
  const [salesData, setSalesData] = useState([]);      
  const [expenses, setExpenses] = useState([]);        
  const [waste, setWaste] = useState([]);              
  const [suppliers, setSuppliers] = useState([]);      
  const [customers, setCustomers] = useState([]);      
  const [productionData, setProductionData] = useState([]);

  // --- وظيفة الربط بين المشتريات والمخزن (Core Function) ---
  const handleSavePurchase = (newPurchase) => {
    // 1. تحديث سجل المشتريات العام للتقارير
    setInventory(prev => [...prev, newPurchase]);

    // 2. تحديث أرصدة المخزن الفعلية (الكميات)
    setStock(prevStock => {
      const itemName = newPurchase.item;
      const itemQuantity = parseFloat(newPurchase.quantity || 0);
      const itemPrice = parseFloat(newPurchase.price || 0);

      const existingItemIndex = prevStock.findIndex(s => s.name === itemName);
      
      if (existingItemIndex > -1) {
        const updatedStock = [...prevStock];
        updatedStock[existingItemIndex] = {
          ...updatedStock[existingItemIndex],
          balance: (updatedStock[existingItemIndex].balance || 0) + itemQuantity,
          price: itemPrice
        };
        return updatedStock;
      } else {
        return [...prevStock, { 
          id: Date.now(), 
          name: itemName, 
          balance: itemQuantity, 
          price: itemPrice,
          unit: newPurchase.unit || 'وحدة'
        }];
      }
    });
    // العودة التلقائية للوحة التحكم بعد الحفظ
    setActivePage('dashboard');
  };

  // --- محرك عرض الصفحات (الربط مع لوحة التحكم) ---
  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': 
        return <Dashboard setActivePage={setActivePage} />;
      
      case 'purchases': 
        return <PurchasesManager 
          onBack={() => setActivePage('dashboard')} 
          onPurchaseComplete={handleSavePurchase} 
        />;

      case 'inventory': 
        return <Inventory 
          categories={stock} 
          onDelete={(id) => setStock(stock.filter(s => s.id !== id))}
          onBack={() => setActivePage('dashboard')}
        />;

      case 'sales': 
        return <Sales 
          onBack={() => setActivePage('dashboard')} 
          onSaveSale={(s) => setSalesData([...salesData, s])} 
          customers={customers} 
        />;

      case 'production':
        return <ProductionManager 
          onBack={() => setActivePage('dashboard')}
          stock={stock}
          onSaveProduction={(p) => setProductionData([...productionData, p])}
        />;

      case 'waste': 
        return <Waste 
          onBack={() => setActivePage('dashboard')} 
          inventory={stock}
          onSaveWaste={(w) => setWaste([...waste, w])} 
        />;

      case 'expenses': 
        return <Expenses 
          onBack={() => setActivePage('dashboard')} 
          onSaveExpense={(e) => setExpenses([...expenses, e])} 
        />;

      case 'suppliers': 
        return <Suppliers 
          onBack={() => setActivePage('dashboard')} 
          suppliers={suppliers}
          onAddSupplier={(s) => setSuppliers([...suppliers, s])}
        />;

      case 'customers': 
        return <Customers 
          onBack={() => setActivePage('dashboard')} 
          customers={customers}
          onAddCustomer={(c) => setCustomers([...customers, c])}
        />;

      case 'financials': 
        return <Financials 
          onBack={() => setActivePage('dashboard')} 
          salesData={salesData}
          expenses={expenses}
        />;

      case 'reports': 
        return <Reports 
          onBack={() => setActivePage('dashboard')} 
          inventory={inventory}    
          stock={stock} 
          salesData={salesData}    
          expenses={expenses}      
        />;

      default: 
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      {/* شريط التنقل العلوي (NavBar) يظهر فقط عند الخروج من لوحة التحكم */}
      {activePage !== 'dashboard' && (
        <nav className="nav-bar" style={{ direction: 'rtl' }}>
          <span className="logo">معمول <span className="highlight">راق</span></span>
          <button onClick={() => setActivePage('dashboard')} className="home-btn">
            الرئيسية
          </button>
        </nav>
      )}

      {/* عرض المحتوى بناءً على اختيار المستخدم من لوحة التحكم */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
