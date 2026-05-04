import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PurchasesManager from './components/PurchasesManager';
import Sales from './components/Sales';
import Waste from './components/Waste';
import Expenses from './components/Expenses';
import Suppliers from './components/Suppliers';
import Financials from './components/Financials';
import Reports from './components/Reports'; 
import Customers from './components/Customers';
import Inventory from './components/Inventory'; // تأكد من الاستيراد

import './App.css'; 

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  // الحالة المركزية
  const [inventory, setInventory] = useState([]);      // سجل الفواتير (تاريخ)
  const [stock, setStock] = useState([]);              // أرصدة المخزن (الحالي)
  const [salesData, setSalesData] = useState([]);      
  const [expenses, setExpenses] = useState([]);        
  const [waste, setWaste] = useState([]);              
  const [suppliers, setSuppliers] = useState([]);      
  const [customers, setCustomers] = useState([]);      
  const [staffData, setStaffData] = useState([]);      

  // --- دالة المعالجة المحدثة لربط المشتريات بالمخزن ---
  const handleSavePurchase = (newPurchase) => {
    // 1. إضافة العملية لسجل المشتريات العام
    setInventory(prev => [...prev, newPurchase]);

    // 2. تحديث أرصدة المخزن الفعلي (الرفوف)
    setStock(prevStock => {
      const itemName = newPurchase.item; // القادم من مكون الشراء
      const itemQuantity = parseFloat(newPurchase.quantity || 0);
      const itemPrice = parseFloat(newPurchase.price || 0);

      const existingItemIndex = prevStock.findIndex(s => s.name === itemName);
      
      if (existingItemIndex > -1) {
        // إذا الصنف موجود، نحدث الرصيد (balance)
        const updatedStock = [...prevStock];
        updatedStock[existingItemIndex] = {
          ...updatedStock[existingItemIndex],
          balance: (updatedStock[existingItemIndex].balance || 0) + itemQuantity,
          price: itemPrice // نحدث السعر لآخر سعر شراء
        };
        return updatedStock;
      } else {
        // صنف جديد ينشأ لأول مرة في المخزن
        return [...prevStock, { 
          id: Date.now(), 
          name: itemName, 
          balance: itemQuantity, // المسمى الذي يتوقعه مكون المخزن
          price: itemPrice,
          unit: newPurchase.unit || 'وحدة'
        }];
      }
    });

    setActivePage('dashboard');
  };

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} />;
      
      case 'purchases': 
        return <PurchasesManager 
          onBack={() => setActivePage('dashboard')} 
          onPurchaseComplete={handleSavePurchase} 
        />;

      case 'inventory': // عرض المخزن
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
        <nav className="nav-bar">
          <span className="logo">معمول <span className="highlight">راق</span></span>
          <button onClick={() => setActivePage('dashboard')} className="home-btn">الرئيسية</button>
        </nav>
      )}
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default App;
