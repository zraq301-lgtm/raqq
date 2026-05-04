import React, { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

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

  // --- محرك استعادة البيانات من التخزين الدائم ---
  const loadSavedData = (key, initialValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (e) {
      console.error(`خطأ في تحميل ${key}`, e);
      return initialValue;
    }
  };

  // --- إدارة الحالة المركزية (مع التحميل التلقائي) ---
  const [inventory, setInventory] = useState(() => loadSavedData('inventory', []));      
  const [stock, setStock] = useState(() => loadSavedData('stock', []));              
  const [salesData, setSalesData] = useState(() => loadSavedData('salesData', []));      
  const [expenses, setExpenses] = useState(() => loadSavedData('expenses', []));        
  const [waste, setWaste] = useState(() => loadSavedData('waste', []));              
  const [suppliers, setSuppliers] = useState(() => loadSavedData('suppliers', []));      
  const [customers, setCustomers] = useState(() => loadSavedData('customers', []));      
  const [productionData, setProductionData] = useState(() => loadSavedData('productionData', []));
  const [supplierWaitingList, setSupplierWaitingList] = useState(() => loadSavedData('waitingList', []));

  // --- محرك حفظ البيانات التلقائي عند أي تغيير (Auto-Save) ---
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('stock', JSON.stringify(stock));
    localStorage.setItem('salesData', JSON.stringify(salesData));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('waste', JSON.stringify(waste));
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('productionData', JSON.stringify(productionData));
    localStorage.setItem('waitingList', JSON.stringify(supplierWaitingList));
  }, [inventory, stock, salesData, expenses, waste, suppliers, customers, productionData, supplierWaitingList]);

  // تهيئة الإشعارات
  useEffect(() => {
    const initNotifications = async () => {
      try { await LocalNotifications.requestPermissions(); } 
      catch (err) { console.warn("Notifications not supported"); }
    };
    initNotifications();
  }, []);

  // مراقب المخزن الذكي
  useEffect(() => {
    stock.forEach(item => {
      if (item.balance < 5) {
        scheduleAlert("⚠️ تنبيه المخزن", `المنتج (${item.name}) رصيده منخفض جداً`);
      }
    });
  }, [stock]);

  const scheduleAlert = async (title, body) => {
    try {
      await LocalNotifications.schedule({
        notifications: [{
          title, body, id: Math.floor(Math.random() * 10000),
          schedule: { at: new Date(Date.now() + 500) }
        }]
      });
    } catch (e) { console.error(e); }
  };

  const handleOrderTrigger = (orderData) => {
    setSupplierWaitingList(prev => [orderData, ...prev]);
  };

  const handleSavePurchase = (newPurchase) => {
    setInventory(prev => [...prev, newPurchase]);
    setStock(prevStock => {
      const existing = prevStock.findIndex(s => s.name === newPurchase.item);
      const qty = parseFloat(newPurchase.quantity || 0);
      if (existing > -1) {
        const updated = [...prevStock];
        updated[existing].balance += qty;
        return updated;
      }
      return [...prevStock, { 
        id: Date.now(), name: newPurchase.item, balance: qty, price: parseFloat(newPurchase.price || 0) 
      }];
    });
    setActivePage('dashboard');
  };

  const handleGeneralUpdate = (type, data) => {
    if (type === 'sales') setSalesData(prev => [...prev, data]);
    if (type === 'waste') setWaste(prev => [...prev, data]);
    if (data.itemName) {
      setStock(prev => prev.map(item => 
        item.name === data.itemName ? { ...item, balance: item.balance - (data.quantity || 0) } : item
      ));
    }
  };

  const renderPage = () => {
    const commonProps = { onBack: () => setActivePage('dashboard') };
    
    switch(activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} />;
      case 'purchases': 
        return <PurchasesManager {...commonProps} stock={stock} onPurchaseComplete={handleSavePurchase} onOrderTrigger={handleOrderTrigger} />;
      case 'suppliers': 
        return (
          <Suppliers 
            {...commonProps} 
            suppliers={suppliers} 
            waitingList={supplierWaitingList}
            onAddSupplier={(s) => setSuppliers([...suppliers, s])}
            onUpdateWaitingList={setSupplierWaitingList}
          />
        );
      case 'inventory': return <Inventory {...commonProps} categories={stock} onDelete={(id) => setStock(stock.filter(s => s.id !== id))} />;
      case 'sales': return <Sales {...commonProps} onSaveSale={(s) => handleGeneralUpdate('sales', s)} customers={customers} />;
      case 'production': return <ProductionManager {...commonProps} stock={stock} setStock={setStock} onSaveProduction={(p) => setProductionData([...productionData, p])} onSaveWaste={(w) => handleGeneralUpdate('waste', w)} />;
      case 'waste': return <Waste {...commonProps} inventory={stock} onSaveWaste={(w) => handleGeneralUpdate('waste', w)} />;
      case 'expenses': return <Expenses {...commonProps} onSaveExpense={(e) => setExpenses([...expenses, e])} />;
      case 'customers': return <Customers {...commonProps} customers={customers} onAddCustomer={(c) => setCustomers([...customers, c])} />;
      case 'financials': return <Financials {...commonProps} salesData={salesData} expenses={expenses} />;
      case 'reports': return <Reports {...commonProps} inventory={inventory} stock={stock} salesData={salesData} expenses={expenses} />;
      default: return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container" style={{ direction: 'rtl' }}>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
