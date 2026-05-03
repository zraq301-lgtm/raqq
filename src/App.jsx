import React, { useState } from 'react';
// استيراد لوحة التحكم والأقسام من المسار الصحيح
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Waste from './components/Waste';
import Expenses from './components/Expenses';
import Suppliers from './components/Suppliers';
import Financials from './components/Financials';
import Reports from './components/Reports';
import Customers from './components/Customers';

// ملاحظة: تأكد من وجود ملفات Purchases و Production و Inventory و Returns 
// داخل مجلد components ليعمل الكود بدون أخطاء

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
  
  // عند تسجيل عملية بيع
  const handleSaveSale = (newSale) => {
    setSalesData([...salesData, newSale]);
    // هنا يمكن إضافة منطق لخصم الكمية من المخزن تلقائياً
    setActivePage('dashboard');
  };

  // عند تسجيل مصروفات
  const handleSaveExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  // عند تسجيل هالك
  const handleSaveWaste = (newWaste) => {
    setWaste([...waste, newWaste]);
    // خصم الهالك من المخزن
  };

  // حساب الإحصائيات المالية للقوائم المالية
  const financialStats = {
    income: salesData.reduce((sum, item) => sum + item.total, 0),
    expenses: expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
    wasteValue: waste.length * 50 // مثال: قيمة تقديرية للهالك
  };

  // --- محرك عرض الصفحات (التبديل بين الـ 11 قسم) ---
  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': 
        return <Dashboard setActivePage={setActivePage} />;
      
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

      // الحالات الافتراضية للأقسام التي لم نكتب كودها التفصيلي بعد
      case 'purchases':
      case 'production':
      case 'inventory':
      case 'returns':
        return (
          <div style={{padding: '20px', textAlign: 'center', direction: 'rtl'}}>
            <h3>قسم {activePage} قيد التطوير</h3>
            <button onClick={() => setActivePage('dashboard')}>رجوع</button>
          </div>
        );

      default: 
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر بسيط يظهر في كل الصفحات ما عدا الرئيسية */}
      {activePage !== 'dashboard' && (
        <nav style={{ 
          padding: '10px 15px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
        }}>
          <span style={{ fontWeight: 'bold', color: '#333' }}>نظام المعمول</span>
          <button 
            onClick={() => setActivePage('dashboard')}
            style={{ padding: '5px 15px', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            الرئيسية
          </button>
        </nav>
      )}

      {/* عرض الصفحة النشطة */}
      {renderPage()}
    </div>
  );
};

export default App;
