import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PurchasesManager from './components/PurchasesManager'; // تم الربط هنا
import Sales from './components/Sales';
import Waste from './components/Waste';
import Expenses from './components/Expenses';
import Suppliers from './components/Suppliers';
import Financials from './components/Financials';
import Reports from './components/Reports';
import Customers from './components/Customers';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  // --- الحالة المركزية (البيانات المشتركة) ---
  const [inventory, setInventory] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [waste, setWaste] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);

  // --- دوال الربط الذكي ونقل البيانات ---
  
  // دالة حفظ المشتريات وتحديث المخزن
  const handleSavePurchase = (newPurchase) => {
    setInventory([...inventory, newPurchase]);
    // اختيارياً: يمكن إضافة المورد لقائمة الموردين إذا لم يكن موجوداً
    setActivePage('dashboard');
  };

  // عند تسجيل عملية بيع
  const handleSaveSale = (newSale) => {
    setSalesData([...salesData, newSale]);
    setActivePage('dashboard');
  };

  // عند تسجيل مصروفات
  const handleSaveExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  // عند تسجيل هالك
  const handleSaveWaste = (newWaste) => {
    setWaste([...waste, newWaste]);
  };

  // حساب الإحصائيات المالية للقوائم المالية
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
      
      // تفعيل قسم المشتريات الجديد بالأزرار الثلاثة
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
          onSaveWaste={handleSaveWaste} 
          inventory={inventory} 
        />;

      case 'expenses': 
        return <Expenses 
          onBack={() => setActivePage('dashboard')} 
          onSaveExpense={handleSaveExpense} 
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
          transactions={salesData} 
        />;

      case 'customers': 
        return <Customers 
          onBack={() => setActivePage('dashboard')} 
          customers={customers}
          onAddCustomer={(c) => setCustomers([...customers, c])}
        />;

      // الأقسام المتبقية
      case 'production':
      case 'inventory':
      case 'returns':
        return (
          <div style={{padding: '20px', textAlign: 'center', direction: 'rtl'}}>
            <h3>قسم {activePage} قيد التطوير</h3>
            <button 
              style={{padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'}}
              onClick={() => setActivePage('dashboard')}
            >
              رجوع للرئيسية
            </button>
          </div>
        );

      default: 
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* هيدر التطبيق */}
      {activePage !== 'dashboard' && (
        <nav style={{ 
          padding: '15px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <span style={{ fontWeight: '800', color: '#2c3e50', fontSize: '1.2rem' }}>
            معمول <span style={{color: '#e67e22'}}>راق</span>
          </span>
          <button 
            onClick={() => setActivePage('dashboard')}
            style={{ 
              padding: '8px 18px', 
              borderRadius: '10px', 
              border: 'none', 
              backgroundColor: '#f1f5f9',
              color: '#475569',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            الرئيسية
          </button>
        </nav>
      )}

      {/* عرض الصفحة النشطة */}
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
