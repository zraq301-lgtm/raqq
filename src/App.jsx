import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorHttp } from '@capacitor/core';
import Swal from 'sweetalert2';

// استيراد المكونات الأساسية للنظام
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ProductionManager from './components/ProductionManager';

// إعدادات الروابط الموحدة لنظام معمول ERP
const API_CONFIG = {
  BASE: 'https://maamoul-one.vercel.app/api',
  SYNC: 'https://maamoul-one.vercel.app/api/sync',
  GET: 'https://maamoul-one.vercel.app/api/get-data',
  DELETE: 'https://maamoul-one.vercel.app/api/delete-item'
};

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [stock, setStock] = useState([]);
  const [productionHistory, setProductionHistory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- 1. المحرك المحلي (Offline-First Engine) ---
  const storage = {
    save: async (key, data) => await Preferences.set({ key, value: JSON.stringify(data) }),
    load: async (key) => {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
    }
  };

  // --- 2. نظام المزامنة الذكي (Cloud Bridge) ---
  
  // دالة جلب البيانات الشاملة
  const fetchCloudData = useCallback(async () => {
    try {
      const response = await CapacitorHttp.get({ 
        url: `${API_CONFIG.GET}?collectionName=productionData` 
      });
      if (response.data?.success) {
        const data = response.data.data;
        setProductionHistory(data);
        await storage.save('productionHistory', data);
      }
    } catch (error) {
      console.warn("ERP Alert: نظام المزامنة يعمل في وضع الأوفلاين حالياً.");
    }
  }, []);

  // دالة الحفظ والمزامنة (ERP Push)
  const syncData = async (collection, data) => {
    setIsSyncing(true);
    try {
      await CapacitorHttp.post({
        url: API_CONFIG.SYNC,
        headers: { 'Content-Type': 'application/json' },
        data: { collectionName: collection, data }
      });
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // دالة الحفظ الجديدة لمعالجة توريد المخزن (تمت إضافتها لحل مشكلة الصورة)
  const handleSaveInventory = async (updatedStock) => {
    setStock(updatedStock);
    await storage.save('stock', updatedStock);
    await syncData('stock', updatedStock);
  };

  // دالة الحذف النهائي (ERP Purge)
  const performDelete = async (collection, id) => {
    try {
      await CapacitorHttp.post({
        url: API_CONFIG.DELETE,
        headers: { 'Content-Type': 'application/json' },
        data: { collectionName: collection, id }
      });
    } catch (error) {
      Swal.fire('خطأ مزامنة', 'سيتم الحذف محلياً والمحاولة لاحقاً سحابياً', 'warning');
    }
  };

  // --- 3. دورة حياة النظام (System Lifecycle) ---
  useEffect(() => {
    const bootSystem = async () => {
      await LocalNotifications.requestPermissions();
      
      // تحميل البيانات المحلية فوراً
      const localStock = await storage.load('stock');
      const localHistory = await storage.load('productionHistory');
      
      if (localStock) setStock(localStock);
      if (localHistory) setProductionHistory(localHistory);

      // محاولة تحديث البيانات من السحابة
      await fetchCloudData();
    };
    bootSystem();
  }, [fetchCloudData]);

  // مراقبة التغييرات وحفظها
  useEffect(() => {
    if (stock.length > 0) {
      storage.save('stock', stock);
      syncData('stock', stock);
    }
  }, [stock]);

  useEffect(() => {
    if (productionHistory.length > 0) {
      storage.save('productionHistory', productionHistory);
      syncData('productionData', productionHistory);
      analyzeProduction(productionHistory);
    }
  }, [productionHistory]);

  // --- 4. ذكاء الأعمال (Business Intelligence) ---
  const analyzeProduction = async (history) => {
    if (history.length < 3) return;
    const lastThree = history.slice(0, 3).map(i => parseFloat(i.totalActualCost) || 0);
    
    // تنبيه "رقة" الذكي في حالة هبوط الإنتاج
    if (lastThree[0] < lastThree[1] && lastThree[1] < lastThree[2]) {
      await LocalNotifications.schedule({
        notifications: [{
          title: "🚀 تنبيه رقة الذكي",
          body: "تحليل ERP يشير لتراجع الإنتاج لـ 3 فترات متتالية. نحتاج مراجعة الخامات.",
          id: 77,
          schedule: { at: new Date(Date.now() + 1000) },
          extra: { type: 'alert' }
        }]
      });
    }
  };

  const handleDelete = async (id, type) => {
    if (type === 'stock') {
      setStock(prev => prev.filter(item => item.id !== id));
      await performDelete('stock', id);
    } else {
      setProductionHistory(prev => prev.filter(item => item.id !== id));
      await performDelete('productionData', id);
    }
  };

  const stats = useMemo(() => {
    const totalProduction = productionHistory.reduce((s, p) => s + (parseFloat(p.totalActualCost) || 0), 0);
    return {
      totalItems: stock.length,
      lowStock: stock.filter(i => (i.balance || 0) < 5).length,
      financialValue: totalProduction.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
      inventoryWorth: stock.reduce((s, i) => s + ((i.balance || 0) * (i.price || 0)), 0).toFixed(2)
    };
  }, [stock, productionHistory]);

  // --- 5. واجهة المستخدم (UI Layout) ---
  const pages = {
    dashboard: <Dashboard setActivePage={setActivePage} productionHistory={productionHistory} stats={stats} />,
    // هنا تم تمرير onSaveInventory لحل الخطأ البرمي
    inventory: <Inventory onBack={() => setActivePage('dashboard')} stock={stock} setStock={setStock} onDelete={handleDelete} onSaveInventory={handleSaveInventory} />,
    production: <ProductionManager onBack={() => setActivePage('dashboard')} stock={stock} setStock={setStock} onSaveProduction={(p) => setProductionHistory(prev => [p, ...prev])} />
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', backgroundColor: '#f4f7fe' }}>
      {/* مؤشر المزامنة العلوي */}
      {isSyncing && (
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000, fontSize: '10px', color: '#2563eb' }}>
          🔄 جاري مزامنة ERP...
        </div>
      )}

      <main style={{ padding: '16px', paddingBottom: '100px' }}>
        {pages[activePage] || pages.dashboard}
      </main>

      {/* شريط التنقل الزجاجي (Glassmorphism Nav) */}
      <nav style={{
        position: 'fixed', bottom: '15px', left: '15px', right: '15px',
        height: '70px', backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(15px)', borderRadius: '25px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.3)',
        zIndex: 1000
      }}>
        <NavButton active={activePage === 'dashboard'} icon="📊" label="الرئيسية" onClick={() => setActivePage('dashboard')} />
        <NavButton active={activePage === 'production'} icon="🏭" label="الإنتاج" onClick={() => setActivePage('production')} />
        <NavButton active={activePage === 'inventory'} icon="📦" label="المخزن" onClick={() => setActivePage('inventory')} />
      </nav>
    </div>
  );
};

// مكون زر التنقل الصغير
const NavButton = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} style={{
    border: 'none', background: 'none', display: 'flex', flexDirection: 'column',
    alignItems: 'center', color: active ? '#2563eb' : '#94a3b8', transition: '0.3s'
  }}>
    <span style={{ fontSize: '20px' }}>{icon}</span>
    <span style={{ fontSize: '12px', fontWeight: active ? 'bold' : 'normal' }}>{label}</span>
  </button>
);

export default App;
