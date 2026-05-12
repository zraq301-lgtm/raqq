import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorHttp, Capacitor } from '@capacitor/core';
import { App as AppLauncher } from '@capacitor/app';
import Swal from 'sweetalert2';

// استيراد المكونات الأساسية للنظام
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ProductionManager from './components/ProductionManager';

// إعدادات الروابط الموحدة لنظام معمول ERP
const API_CONFIG = {
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
    save: async (key, data) => {
      await Preferences.set({ key, value: JSON.stringify(data) });
      localStorage.setItem(key, JSON.stringify(data)); // نسخة احتياطية
    },
    load: async (key) => {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : JSON.parse(localStorage.getItem(key) || 'null');
    }
  };

  // --- ميزة تفعيل أزرار الهاتف ---
  useEffect(() => {
    const backHandler = AppLauncher.addListener('backButton', () => {
      if (activePage === 'dashboard') {
        AppLauncher.exitApp();
      } else {
        setActivePage('dashboard');
      }
    });
    return () => { backHandler.then(h => h.remove()); };
  }, [activePage]);

  // --- 2. نظام المزامنة والتوحيد (Normalization Logic) ---
  
  const fetchCloudData = useCallback(async () => {
    try {
      // 1. جلب بيانات الإنتاج
      const resProd = await CapacitorHttp.get({ url: `${API_CONFIG.GET}?collectionName=productionData` });
      let prodResponse = typeof resProd.data === 'string' ? JSON.parse(resProd.data) : resProd.data;
      if (prodResponse?.success && prodResponse.data) {
        setProductionHistory(prodResponse.data);
        await storage.save('productionHistory', prodResponse.data);
      }

      // 2. جلب بيانات المخزن (تم تعديل الدخول للمصفوفة هنا)
      const resStock = await CapacitorHttp.get({ url: `${API_CONFIG.GET}?collectionName=stock` });
      let stockResponse = typeof resStock.data === 'string' ? JSON.parse(resStock.data) : resStock.data;
      
      // التعديل الجوهري: الوصول لـ stockResponse.data لأن الصورة أظهرت أن البيانات بداخلها
      const rawItems = stockResponse.data || [];

      if (stockResponse?.success && Array.isArray(rawItems)) {
        const normalizedStock = rawItems.map(s => ({
          ...s,
          // استخدام _id القادم من MongoDB كـ id أساسي
          id: s.id || s._id || (Date.now() + Math.random()),
          name: s.name || s.item || "صنف غير مسمى",
          balance: parseFloat(s.balance || s.quantity || 0),
          price: parseFloat(s.price || 0)
        }));

        setStock(normalizedStock);
        await storage.save('stock', normalizedStock);
      }
    } catch (error) {
      console.warn("ERP Alert: نظام المزامنة يعمل محلياً حالياً.");
    }
  }, []);

  const syncData = async (collection, data) => {
    if (!data || data.length === 0) return;
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

  // --- معالجة الحفظ الموحد ---
  const handleSaveInventory = async (newItem) => {
    const formattedItem = {
      ...newItem,
      id: newItem.id || Date.now(),
      name: newItem.name || newItem.item,
      balance: parseFloat(newItem.balance || newItem.quantity || 0),
      price: parseFloat(newItem.price || 0)
    };

    const updatedStock = [...stock, formattedItem];
    setStock(updatedStock);
    await storage.save('stock', updatedStock);
    await syncData('stock', updatedStock);
  };

  const performDelete = async (collection, id) => {
    try {
      await CapacitorHttp.post({
        url: API_CONFIG.DELETE,
        headers: { 'Content-Type': 'application/json' },
        data: { collectionName: collection, id }
      });
    } catch (error) {
      Swal.fire('حذف محلي', 'سيتم التحديث سحابياً لاحقاً', 'info');
    }
  };

  // --- 3. دورة حياة النظام ---
  useEffect(() => {
    const bootSystem = async () => {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.requestPermissions();
      }
      const localStock = await storage.load('stock');
      const localHistory = await storage.load('productionHistory');
      if (localStock) setStock(localStock);
      if (localHistory) setProductionHistory(localHistory);
      
      // جلب أحدث البيانات من السحاب
      await fetchCloudData();
    };
    bootSystem();
  }, [fetchCloudData]);

  // مزامنة تلقائية عند تغيير البيانات
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
    }
  }, [productionHistory]);

  const handleDelete = async (id, type) => {
    if (type === 'stock') {
      setStock(prev => prev.filter(item => (item.id !== id && item._id !== id)));
      await performDelete('stock', id);
    } else {
      setProductionHistory(prev => prev.filter(item => (item.id !== id && item._id !== id)));
      await performDelete('productionData', id);
    }
  };

  const stats = useMemo(() => {
    const totalProduction = productionHistory.reduce((s, p) => s + (parseFloat(p.totalActualCost) || 0), 0);
    return {
      totalItems: stock.length,
      lowStock: stock.filter(i => (parseFloat(i.balance) || 0) < 5).length,
      financialValue: totalProduction.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
      inventoryWorth: stock.reduce((s, i) => s + ((parseFloat(i.balance) || 0) * (parseFloat(i.price) || 0)), 0).toFixed(2)
    };
  }, [stock, productionHistory]);

  // --- 4. واجهة المستخدم ---
  const pages = {
    dashboard: <Dashboard setActivePage={setActivePage} productionHistory={productionHistory} stats={stats} />,
    inventory: (
      <Inventory 
        onBack={() => setActivePage('dashboard')} 
        stock={stock} 
        setStock={setStock} 
        onDelete={handleDelete} 
        onInventoryEntry={handleSaveInventory} 
      />
    ),
    production: <ProductionManager onBack={() => setActivePage('dashboard')} stock={stock} setStock={setStock} onSaveProduction={(p) => setProductionHistory(prev => [p, ...prev])} />
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', backgroundColor: '#f4f7fe' }}>
      {isSyncing && (
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000, fontSize: '10px', color: '#2563eb' }}>
          🔄 جاري مزامنة ERP...
        </div>
      )}

      <main style={{ padding: '16px', paddingBottom: '100px' }}>
        {pages[activePage] || pages.dashboard}
      </main>

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
