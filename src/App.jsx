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

  // --- وظيفة الربط بين المشتريات والمخزن (دالة السحب أولاً بأول الذكية) ---
  const handleSavePurchase = (newPurchase) => {
    // 1. تحديث سجل المشتريات العام للتقارير
    setInventory(prev => [...prev, newPurchase]);

    // 2. تحديث أرصدة المخزن الفعلية مع نظام الشحنات (Batches)
    setStock(prevStock => {
      const itemName = newPurchase.item;
      const itemQuantity = parseFloat(newPurchase.quantity || 0);
      const itemPrice = parseFloat(newPurchase.price || 0);

      const existingItemIndex = prevStock.findIndex(s => s.name === itemName);
      
      const newBatch = {
        id: Date.now(),
        quantity: itemQuantity,
        price: itemPrice,
        date: newPurchase.date || new Date().toISOString()
      };

      if (existingItemIndex > -1) {
        const updatedStock = [...prevStock];
        const targetItem = updatedStock[existingItemIndex];
        
        updatedStock[existingItemIndex] = {
          ...targetItem,
          balance: (targetItem.balance || 0) + itemQuantity,
          // إضافة الشحنة الجديدة إلى مصفوفة الشحنات لضمان تتبع السعر
          batches: targetItem.batches ? [...targetItem.batches, newBatch] : [newBatch],
          price: itemPrice // السعر الأحدث للعرض السريع
        };
        return updatedStock;
      } else {
        return [...prevStock, { 
          id: Date.now(), 
          name: itemName, 
          balance: itemQuantity, 
          price: itemPrice,
          unit: newPurchase.unit || 'وحدة',
          batches: [newBatch] // أول شحنة لهذا الصنف
        }];
      }
    });

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
          setStock={setStock}
          onSaveProduction={(p) => setProductionData([...productionData, p])}
          onSaveWaste={(w) => setWaste([...waste, w])}
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
      {activePage !== 'dashboard' && (
        <nav className="nav-bar" style={{ direction: 'rtl' }}>
          <span className="logo">معمول <span className="highlight">راق</span></span>
          <button onClick={() => setActivePage('dashboard')} className="home-btn">
            الرئيسية
          </button>
        </nav>
      )}

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
