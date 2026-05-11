import React, { useState, useEffect, useMemo } from 'react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorHttp, Capacitor } from '@capacitor/core';
import Swal from 'sweetalert2';

// استيراد المكونات
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ProductionManager from './components/ProductionManager';

const API_BASE = 'https://maamoul-pro-five.vercel.app/api';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [stock, setStock] = useState([]);
  const [productionHistory, setProductionHistory] = useState([]);

  // --- 1. استقرار البيانات (Preferences API) ---
  const saveData = async (key, value) => {
    await Preferences.set({ key, value: JSON.stringify(value) });
  };

  const loadData = async (key) => {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  };

  // --- 2. نظام الإشعارات الذكي (AI-Informed Notifications) ---
  const checkProductionTrend = async (history) => {
    if (history.length < 3) return;

    // الحصول على آخر 3 مدخلات إنتاج
    const last3Days = history.slice(0, 3).map(p => parseFloat(p.totalActualCost) || 0);
    
    // منطق الذكاء: إذا كان اليوم الثالث أقل من الثاني، والثاني أقل من الأول
    if (last3Days[0] < last3Days[1] && last3Days[1] < last3Days[2]) {
      await LocalNotifications.schedule({
        notifications: [{
          title: "⚠️ تنبيه ذكي: تراجع الإنتاج",
          body: `لاحظ نظام "راق" هبوطاً مستمراً في الإنتاج لـ 3 أيام. يرجى مراجعة الخامات أو كفاءة الورديات.`,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'beep.wav'
        }]
      });
    }
  };

  // --- 3. منطق الاتصال الخارجي (CapacitorHttp) ---
  const syncWithCloud = async (collectionName, data) => {
    if (!data || data.length === 0) return;
    try {
      await CapacitorHttp.post({
        url: `${API_BASE}/sync`,
        headers: { 'Content-Type': 'application/json' },
        data: { collectionName, data }
      });
    } catch (error) {
      console.error("Cloud sync failed:", error);
    }
  };

  // تحميل البيانات عند البداية
  useEffect(() => {
    const init = async () => {
      // طلب إذن الإشعارات
      await LocalNotifications.requestPermissions();
      
      const savedStock = await loadData('stock');
      if (savedStock) setStock(savedStock);

      const savedHistory = await loadData('productionHistory');
      if (savedHistory) setProductionHistory(savedHistory);

      // جلب البيانات من السيرفر لتحديث المحلي
      try {
        const response = await CapacitorHttp.get({ 
          url: `${API_BASE}/get-data?collectionName=productionData` 
        });
        if (response.data?.success) {
          const cloudData = response.data.data;
          setProductionHistory(cloudData);
          await saveData('productionHistory', cloudData);
        }
      } catch (e) { console.log("Offline mode: Using cached data"); }
    };
    init();
  }, []);

  // حفظ ومزامنة البيانات عند التغيير
  useEffect(() => {
    if (stock.length > 0) {
      saveData('stock', stock);
      syncWithCloud('stock', stock);
    }
    if (productionHistory.length > 0) {
      saveData('productionHistory', productionHistory);
      syncWithCloud('productionData', productionHistory);
      checkProductionTrend(productionHistory); // فحص تريند الإنتاج
    }
  }, [stock, productionHistory]);

  // --- 4. الحسابات والذكاء المالي ---
  const stats = useMemo(() => {
    const totalCost = productionHistory.reduce((sum, p) => sum + (parseFloat(p.totalActualCost) || 0), 0);
    return {
      totalItems: stock.length,
      lowStockAlert: stock.filter(item => (item.balance || 0) < 10).length,
      totalProductionValue: totalCost.toFixed(2),
      stockValue: stock.reduce((sum, s) => sum + ((s.balance || 0) * (s.price || 0)), 0).toFixed(2),
    };
  }, [stock, productionHistory]);

  const handleSaveProduction = (newProd) => {
    setProductionHistory(prev => [newProd, ...prev]);
    Swal.fire({
      title: 'تم الحفظ',
      text: 'تم ترحيل الإنتاج للمخزن ومزامنة السحابة',
      icon: 'success',
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const renderPage = () => {
    const common = { onBack: () => setActivePage('dashboard') };
    switch (activePage) {
      case 'dashboard': 
        return <Dashboard 
                  setActivePage={setActivePage} 
                  productionHistory={productionHistory} 
                  stats={stats} 
               />;
      case 'inventory': 
        return <Inventory {...common} stock={stock} setStock={setStock} />;
      case 'production': 
        return <ProductionManager {...common} stock={stock} setStock={setStock} onSaveProduction={handleSaveProduction} />;
      default: 
        return <Dashboard setActivePage={setActivePage} productionHistory={productionHistory} />;
    }
  };

  return (
    <div className="app-container" style={{ direction: 'rtl', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <main className="main-content" style={{ paddingBottom: '80px' }}>
        {renderPage()}
      </main>

      {/* Nav السفلي */}
      <nav className="bottom-nav" style={{
        position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fff', 
        display: 'flex', justifyContent: 'space-around', padding: '10px 0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)', borderTop: '1px solid #e2e8f0'
      }}>
        <button onClick={() => setActivePage('dashboard')} style={{ border: 'none', background: 'none', color: activePage === 'dashboard' ? '#e67e22' : '#64748b' }}>
          <div style={{ textAlign: 'center' }}>الرئيسية</div>
        </button>
        <button onClick={() => setActivePage('production')} style={{ border: 'none', background: 'none', color: activePage === 'production' ? '#e67e22' : '#64748b' }}>
          <div style={{ textAlign: 'center' }}>الإنتاج</div>
        </button>
        <button onClick={() => setActivePage('inventory')} style={{ border: 'none', background: 'none', color: activePage === 'inventory' ? '#e67e22' : '#64748b' }}>
          <div style={{ textAlign: 'center' }}>المخزن</div>
        </button>
      </nav>
    </div>
  );
};

export default App;
