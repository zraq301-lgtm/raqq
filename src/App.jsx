import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { CapacitorHttp, Capacitor } from '@capacitor/core';

// استيراد المكونات المتوفرة فقط (تأكد أن هذه الملفات موجودة في مجلد components)
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ProductionManager from './components/ProductionManager';

import './App.css';

const httpPost = async (url, body) => {
  if (Capacitor.isNativePlatform()) {
    const response = await CapacitorHttp.post({
      url,
      headers: { 'Content-Type': 'application/json' },
      data: body
    });
    return response.data;
  }
  const res = await fetch(url, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(body) 
  });
  return res.json();
};

const httpGet = async (url) => {
  if (Capacitor.isNativePlatform()) {
    const response = await CapacitorHttp.get({
      url,
      headers: { 'Content-Type': 'application/json' }
    });
    return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
  }
  const res = await fetch(url);
  return res.json();
};

const showSwal = (title, icon = 'success') => {
  Swal.fire({ title, icon, timer: 1500, showConfirmButton: false, position: 'center', toast: true });
};

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const loadInitial = (key, initialValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (e) { return initialValue; }
  };

  const [stock, setStock] = useState(() => loadInitial('stock', []));
  const [productionData, setProductionData] = useState(() => loadInitial('productionData', []));

  useEffect(() => {
    const fetchFromCloud = async (collectionName, setter) => {
      try {
        const parsed = await httpGet(`https://maamoul-pro-five.vercel.app/api/get-data?collectionName=${collectionName}`);
        if (parsed?.success && parsed?.data) {
          setter(parsed.data);
          localStorage.setItem(collectionName, JSON.stringify(parsed.data));
        }
      } catch (error) { console.error("Fetch error:", error); }
    };
    fetchFromCloud('stock', setStock);
    fetchFromCloud('productionData', setProductionData);
  }, []);

  useEffect(() => {
    const syncWithCloud = async (collectionName, data) => {
      if (!data || data.length === 0) return;
      try {
        await httpPost('https://maamoul-pro-five.vercel.app/api/sync', { collectionName, data });
      } catch (error) { console.error("Sync error:", error); }
    };
    localStorage.setItem('stock', JSON.stringify(stock));
    localStorage.setItem('productionData', JSON.stringify(productionData));
    syncWithCloud('stock', stock);
    syncWithCloud('productionData', productionData);
  }, [stock, productionData]);

  const stats = useMemo(() => ({
    totalItems: stock.length,
    lowStockAlert: stock.filter(item => (item.balance || 0) < 10).length,
    totalProductionVolume: productionData.reduce((sum, p) => sum + (parseFloat(p.totalUnits) || 0), 0),
    stockValue: stock.reduce((sum, s) => sum + ((parseFloat(s.balance) || 0) * (parseFloat(s.price) || 0)), 0),
  }), [stock, productionData]);

  const handleSaveProduction = (production) => {
    const totalUnits = (parseFloat(production.boxes) || 0) * (parseFloat(production.unitsPerBox) || 0);
    const productionEntry = { ...production, totalUnits, id: Date.now(), date: new Date().toLocaleDateString() };
    setProductionData(prev => [productionEntry, ...prev]);
    setStock(prev => {
      const idx = prev.findIndex(s => s.name === production.productName);
      if (idx > -1) {
        const up = [...prev];
        up[idx] = { ...up[idx], balance: (up[idx].balance || 0) + totalUnits };
        return up;
      }
      return [...prev, { id: Date.now(), name: production.productName, balance: totalUnits, price: 0, unit: 'وحدة', category: 'منتج نهائي' }];
    });
    showSwal(`تم إنتاج ${totalUnits} وحدة`);
  };

  const handleGenericDelete = async (collectionName, id, setter) => {
    setter(prev => prev.filter(item => (item.id !== id && item._id !== id)));
    try {
      await httpPost('https://maamoul-pro-five.vercel.app/api/delete-item', { collectionName, id });
      showSwal('تم الحذف');
    } catch (e) { console.error(e); }
  };

  const renderPage = () => {
    const cp = { onBack: () => setActivePage('dashboard') };
    switch (activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} stats={stats} />;
      case 'inventory': return <Inventory {...cp} categories={stock} setStock={setStock} onDeleteItem={(id) => handleGenericDelete('stock', id, setStock)} />;
      case 'production': return <ProductionManager {...cp} stock={stock} onSaveProduction={handleSaveProduction} />;
      default: return <Dashboard setActivePage={setActivePage} stats={stats} />;
    }
  };

  return (
    <div className="app-container" style={{ direction: 'rtl' }}>
      <main className="main-content">{renderPage()}</main>
      <nav className="bottom-nav">
        {[
          { id: 'dashboard', label: 'الرئيسية', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { id: 'inventory', label: 'المخزن', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
          { id: 'production', label: 'الإنتاج', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' }
        ].map(item => (
          <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={item.icon} /></svg>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
