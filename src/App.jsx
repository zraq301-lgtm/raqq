import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorHttp } from '@capacitor/core';
import Swal from 'sweetalert2';

// تصحيح الاستيراد: المكونات موجودة في مجلد components بجانب App
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ProductionManager from './components/ProductionManager';

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

  const storage = {
    save: async (key, data) => await Preferences.set({ key, value: JSON.stringify(data) }),
    load: async (key) => {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
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
      console.warn("ERP Offline Mode");
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
      console.error("Sync Error");
    } finally {
      setIsSyncing(false);
    }
  };

  // دالة حفظ التوريد المحدثة
  const handleSaveInventory = async (p) => {
    if (p.item) {
      const qty = parseFloat(p.quantity || 0);
      const price = parseFloat(p.price || 0);
      
      setStock(prev => {
        const idx = prev.findIndex(s => s.name === p.item);
        let updated;
        if (idx > -1) {
          updated = [...prev];
          updated[idx] = { ...updated[idx], balance: (updated[idx].balance || 0) + qty, price: price || updated[idx].price };
        } else {
          updated = [...prev, { id: Date.now(), name: p.item, balance: qty, price, unit: p.unit || 'وحدة' }];
        }
        storage.save('stock', updated);
        syncData('stock', updated);
        return updated;
      });
      Swal.fire({ title: 'تم التوريد', icon: 'success', timer: 1000, showConfirmButton: false });
    } else if (Array.isArray(p)) {
      setStock(p);
      await storage.save('stock', p);
      await syncData('stock', p);
    }
  };

  const performDelete = async (collection, id) => {
    try {
      await CapacitorHttp.post({
        url: API_CONFIG.DELETE,
        headers: { 'Content-Type': 'application/json' },
        data: { collectionName: collection, id }
      });
    } catch (error) {
      console.error("Delete Error");
    }
  };

  useEffect(() => {
    const boot = async () => {
      await LocalNotifications.requestPermissions();
      const s = await storage.load('stock');
      const h = await storage.load('productionHistory');
      if (s) setStock(s);
      if (h) setProductionHistory(h);
      await fetchCloudData();
    };
    boot();
  }, [fetchCloudData]);

  useEffect(() => {
    if (productionHistory.length > 0) {
      storage.save('productionHistory', productionHistory);
      syncData('productionData', productionHistory);
    }
  }, [productionHistory]);

  const handleDelete = async (id, type) => {
    if (type === 'stock') {
      const updated = stock.filter(item => item.id !== id);
      setStock(updated);
      await performDelete('stock', id);
    } else {
      const updated = productionHistory.filter(item => item.id !== id);
      setProductionHistory(updated);
      await performDelete('productionData', id);
    }
  };

  const stats = useMemo(() => {
    const totalProd = productionHistory.reduce((s, p) => s + (parseFloat(p.totalActualCost) || 0), 0);
    return {
      totalItems: stock.length,
      lowStock: stock.filter(i => (i.balance || 0) < 5).length,
      financialValue: totalProd.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
      inventoryWorth: stock.reduce((s, i) => s + ((i.balance || 0) * (i.price || 0)), 0).toFixed(2)
    };
  }, [stock, productionHistory]);

  const pages = {
    dashboard: <Dashboard setActivePage={setActivePage} productionHistory={productionHistory} stock={stock} stats={stats} />,
    inventory: <Inventory onBack={() => setActivePage('dashboard')} stock={stock} setStock={setStock} onDelete={handleDelete} onSaveInventory={handleSaveInventory} />,
    production: <ProductionManager onBack={() => setActivePage('dashboard')} stock={stock} setStock={setStock} onSaveProduction={(p) => setProductionHistory(prev => [p, ...prev])} />
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', backgroundColor: '#f4f7fe' }}>
      {isSyncing && (
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000, fontSize: '10px', color: '#2563eb' }}>
          🔄 جاري المزامنة...
        </div>
      )}
      <main style={{ padding: '16px', paddingBottom: '100px' }}>
        {pages[activePage] || pages.dashboard}
      </main>
      <nav style={{ position: 'fixed', bottom: '15px', left: '15px', right: '15px', height: '70px', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(15px)', borderRadius: '25px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 1000 }}>
        <button onClick={() => setActivePage('dashboard')} style={{ border: 'none', background: 'none' }}>📊 الرئيسية</button>
        <button onClick={() => setActivePage('production')} style={{ border: 'none', background: 'none' }}>🏭 الإنتاج</button>
        <button onClick={() => setActivePage('inventory')} style={{ border: 'none', background: 'none' }}>📦 المخزن</button>
      </nav>
    </div>
  );
};

export default App;
