import React, { useState } from 'react';
import Dashboard from './Dashboard';
import PurchasesManager from './PurchasesManager';
import ProductionManager from './ProductionManager';
// استيراد بقية الأقسام هنا...

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  // الحالة المركزية (البيانات التي تتقاسمها كل الصفحات)
  const [inventory, setInventory] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  // دالة الربط الذكي: تحديث المخزن عند الشراء
  const handlePurchase = (item) => {
    // منطق تحديث المخزن التلقائي
    console.log("تم تحديث المخزن بناءً على المشتريات:", item);
    setActivePage('dashboard'); // العودة للوحة التحكم بعد الإضافة
  };

  // تبديل الصفحات بناءً على اختيارك من الـ Dashboard
  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} />;
      case 'purchases': return <PurchasesManager onPurchaseComplete={handlePurchase} />;
      case 'production': return <ProductionManager categories={inventory} />;
      // أضف بقية الحالات هنا...
      default: return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      {/* الهيدر ثابت دائماً */}
      <nav className="main-nav">
        <div className="app-logo">نظام المعمول</div>
        {activePage !== 'dashboard' && (
          <button onClick={() => setActivePage('dashboard')} style={{marginRight: 'auto'}}>رجوع</button>
        )}
      </nav>

      {/* عرض الصفحة المختارة */}
      {renderPage()}
      
      {/* المنيو السفلي للوصول السريع */}
    </div>
  );
};

export default App;
