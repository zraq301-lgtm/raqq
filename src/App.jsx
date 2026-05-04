import React, { useState } from 'react';
// استيراد المكونات الأساسية
import Dashboard from './components/Dashboard';
import PurchasesManager from './components/PurchasesManager';
import Sales from './components/Sales';
import Waste from './components/Waste';
import Expenses from './components/Expenses';
import Suppliers from './components/Suppliers';
import Financials from './components/Financials';
import Reports from './components/Reports'; 
import Customers from './components/Customers';

// استدعاء ملف التنسيق الموحد
import './App.css'; 

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  // --- الحالة المركزية للبيانات ---
  const [inventory, setInventory] = useState([]);      // سجل فواتير المشتريات
  const [stock, setStock] = useState([]);              // حالة المخزن الحالية (الكميات الفعلية)
  const [salesData, setSalesData] = useState([]);      
  const [expenses, setExpenses] = useState([]);        
  const [waste, setWaste] = useState([]);              
  const [suppliers, setSuppliers] = useState([]);      
  const [customers, setCustomers] = useState([]);      
  const [staffData, setStaffData] = useState([]);      

  // --- دوال المعالجة ---

  // دالة حفظ المشتريات وتحديث المخزن تلقائياً
  const handleSavePurchase = (newPurchase) => {
    // 1. إضافة الفاتورة لسجل المشتريات
    setInventory([...inventory, newPurchase]);

    // 2. تحديث كميات المخزن (Stock)
    setStock(prevStock => {
      const existingItemIndex = prevStock.findIndex(item => item.name === newPurchase.itemName);
      
      if (existingItemIndex > -1) {
        // إذا الصنف موجود، نحدث الكمية فقط
        const updatedStock = [...prevStock];
        updatedStock[existingItemIndex] = {
          ...updatedStock[existingItemIndex],
          quantity: parseFloat(updatedStock[existingItemIndex].quantity) + parseFloat(newPurchase.quantity)
        };
        return updatedStock;
      } else {
        // إذا صنف جديد، نضيفه للمخزن
        return [...prevStock, { 
          id: Date.now(), 
          name: newPurchase.itemName, 
          quantity: parseFloat(newPurchase.quantity),
          unit: newPurchase.unit 
        }];
      }
    });

    setActivePage('dashboard');
  };

  const handleSaveSale = (newSale) => {
    setSalesData([...salesData, newSale]);
    // ملاحظة: هنا يمكن مستقبلاً إضافة دالة لخصم المباع من الـ stock
    setActivePage('dashboard');
  };

  // حساب الإحصائيات المالية
  const financialStats = {
    income: salesData.reduce((sum, item) => sum + (item.total || 0), 0),
    expenses: expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
    wasteValue: waste.length * 50 
  };

  // --- محرك عرض الصفحات ---
  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': 
        return <Dashboard setActivePage={setActivePage} />;
      
      case 'purchases': 
        return <PurchasesManager 
          onBack={() => setActivePage('dashboard')} 
          onPurchaseComplete={handleSavePurchase} 
        />;

      case 'sales': 
        return <Sales 
          onBack={() => setActivePage('dashboard')} 
          onSaveSale={handleSaveSale} 
          customers={customers} 
        />;

      case 'waste': 
        return <Waste 
          onBack={() => setActivePage('dashboard')} 
          onSaveWaste={(w) => setWaste([...waste, w])} 
          inventory={stock} // نمرر المخزن الحالي لخصم الهالك منه
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

      case 'financials': 
        return <Financials 
          onBack={() => setActivePage('dashboard')} 
          stats={financialStats} 
        />;

      case 'reports': 
        return <Reports 
          onBack={() => setActivePage('dashboard')} 
          inventory={inventory}    
          stock={stock}            // تقرير الجرد الفعلي
          salesData={salesData}    
          expenses={expenses}      
          staffData={staffData}    
        />;

      case 'customers': 
        return <Customers 
          onBack={() => setActivePage('dashboard')} 
          customers={customers}
          onAddCustomer={(c) => setCustomers([...customers, c])}
        />;

      default: 
        return (
          <div className="page-content" style={{textAlign: 'center'}}>
            <h3>قسم {activePage} قيد التطوير</h3>
            <button className="card" onClick={() => setActivePage('dashboard')}>رجوع</button>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {activePage !== 'dashboard' && (
        <nav className="nav-bar" style={{ 
          padding: '10px 15px', 
          background: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '10px',
          direction: 'rtl'
        }}>
          <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>
              معمول <span style={{color: '#e67e22'}}>راق</span>
          </span>
          <button 
            onClick={() => setActivePage('dashboard')}
            style={{ 
              padding: '5px 15px', 
              borderRadius: '12px', 
              border: '1px solid #eee',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontFamily: 'Tajawal'
            }}
          >
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
