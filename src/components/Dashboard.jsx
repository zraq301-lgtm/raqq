import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorHttp, Capacitor } from '@capacitor/core';
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

  // --- 1. المحرك المحلي الهجين (Preferences + Sync) ---
  const storage = {
    save: async (key, data) => await Preferences.set({ key, value: JSON.stringify(data) }),
    load: async (key) => {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
    }
  };

  // --- 2. نظام المزامنة (Cloud Bridge) المستوحى من الكود الناجح ---
  const syncWithCloud = async (collectionName, data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    setIsSyncing(true);
    try {
      await CapacitorHttp.post({
        url: API_CONFIG.SYNC,
        headers: { 'Content-Type': 'application/json' },
        data: { collectionName, data }
      });
    } catch (error) {
      console.error("ERP Sync Error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

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
      console.warn("نظام المزامنة يعمل في وضع الأوفلاين.");
    }
  }, []);

  // --- 3. دوال إدارة المخزن والتوريد (المنطق الذي طلبته) ---
  
  // دالة حفظ التوريد داخل المخزن (المعالجة المباشرة)
  const handleInventoryEntry = async (p) => {
    try {
      const qty = parseFloat(p.quantity || 0);
      const price = parseFloat(p.price || 0);
      
      setStock(prev => {
        const idx = prev.findIndex(s => s.name === p.item);
        let newStock;

        if (idx > -1) {
          // إذا كان الصنف موجوداً، نحدث الرصيد والسعر
          const updated = [...prev];
          updated[idx] = { 
            ...updated[idx], 
            balance: (updated[idx].balance || 0) + qty, 
            price: price || updated[idx].price 
          };
          newStock = updated;
        } else {
          // إضافة صنف جديد تماماً
          newStock = [...prev, { 
            id: Date.now(), 
            name: p.item, 
            balance: qty, 
            price: price, 
            unit: p.unit || 'وحدة' 
          }];
        }
        
        // حفظ ومزامنة فورية للمخزن
        storage.save('stock', newStock);
        syncWithCloud('stock', newStock);
        return newStock;
      });

      Swal.fire({ title: 'تم التوريد للمخزن', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire('خطأ في التوريد', error.message, 'error');
    }
  };

  const handleDelete = async (id, type) => {
    const collection = type === 'stock' ? 'stock' : 'productionData';
    const setter = type === 'stock' ? setStock : setProductionHistory;
    
    setter(prev => prev.filter(item => (item.id !== id && item._id !== id)));
    
    try {
      await CapacitorHttp.post({
        url: API_CONFIG.DELETE,
        headers: { 'Content-Type': 'application/json' },
        data: { collectionName: collection, id }
      });
    } catch (e) {
      console.error("Delete Error");
    }
  };

  // --- 4. دورة حياة النظام ---
  useEffect(() => {
    const bootSystem = async () => {
      await LocalNotifications.requestPermissions();
      const localStock = await storage.load('stock');
      const localHistory = await storage.load('productionHistory');
      if (localStock) setStock(localStock);
      if (localHistory) setProductionHistory(localHistory);
      await fetchCloudData();
    };
    bootSystem();
  }, [fetchCloudData]);

  // مزامنة آلية عند حدوث تغييرات كبيرة
  useEffect(() => {
    if (productionHistory.length > 0) {
      storage.save('productionHistory', productionHistory);
      syncWithCloud('productionData', productionHistory);
    }
  }, [productionHistory]);

  const stats = useMemo(() => {
    const totalProd = productionHistory.reduce((s, p) => s + (parseFloat(p.totalActualCost) || 0), 0);
    return {
      totalItems: stock.length,
      lowStock: stock.filter(i => (i.balance || 0) < 5).length,
      financialValue: totalProd.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
      inventoryWorth: stock.reduce((s, i) => s + ((i.balance || 0) * (i.price || 0)), 0).toFixed(2)
    };
  }, [stock, productionHistory]);

  // --- 5. واجهة المستخدم والتنقل ---
  const pages = {
    dashboard: <Dashboard setActivePage={setActivePage} productionHistory={productionHistory} stats={stats} />,
    inventory: (
      <Inventory 
        onBack={() => setActivePage('dashboard')} 
        stock={stock} 
        setStock={setStock} 
        onDelete={handleDelete} 
        onInventoryEntry={handleInventoryEntry} // تمرير الدالة الجديدة هنا
      />
    ),
    production: (
      <ProductionManager 
        onBack={() => setActivePage('dashboard')} 
        stock={stock} 
        setStock={setStock} 
        onSaveProduction={(p) => setProductionHistory(prev => [p, ...prev])} 
      />
    )
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', backgroundColor: '#f4f7fe' }}>
      {isSyncing && (
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000, fontSize: '10px', color: '#2563eb' }}>
          🔄 جاري مزامنة معمول...
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
    alignItems: 'center', color: active ? '#2563eb' : '#94a3b8', transition: '0.3s', cursor: 'pointer'
  }}>
    <span style={{ fontSize: '20px' }}>{icon}</span>
    <span style={{ fontSize: '12px', fontWeight: active ? 'bold' : 'normal' }}>{label}</span>
  </button>
);

export default App;
