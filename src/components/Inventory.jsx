import React, { useState } from 'react';
import { Package, Truck, Archive } from 'lucide-react';

// --- التصحيح الذكي للمسارات (حرف p صغير ليطابق المجلد الفعلي) ---
import RawMaterials from './page/RawMaterials';
import SupplyEntry from './page/SupplyEntry';
import FinishedProducts from './page/FinishedProducts';

const Inventory = ({ categories = [], onDeleteItem, onInventoryEntry }) => {
  // الحالة المسؤولة عن تحديد أي واجهة تظهر الآن
  const [activeTab, setActiveTab] = useState('raw');

  const styles = {
    container: { 
      padding: '15px', 
      direction: 'rtl', 
      backgroundColor: '#f0f4f8', 
      minHeight: '100vh' 
    },
    tabContainer: { 
      display: 'flex', 
      background: '#fff', 
      borderRadius: '20px', 
      padding: '8px', 
      marginBottom: '20px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: '10px',
      zIndex: 10
    },
    tab: { 
      flex: 1, 
      padding: '12px', 
      textAlign: 'center', 
      borderRadius: '15px', 
      cursor: 'pointer', 
      transition: '0.3s', 
      fontWeight: 'bold', 
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '14px'
    },
    activeTab: { 
      background: '#22c55e', 
      color: '#fff' 
    },
    contentArea: { 
      marginTop: '10px' 
    }
  };

  return (
    <div style={styles.container}>
      {/* شريط التنقل العلوي الذكي */}
      <div style={styles.tabContainer}>
        <div 
          style={{...styles.tab, ...(activeTab === 'raw' ? styles.activeTab : {})}} 
          onClick={() => setActiveTab('raw')}
        >
          <Archive size={18} /> الخامات
        </div>
        <div 
          style={{...styles.tab, ...(activeTab === 'supply' ? styles.activeTab : {})}} 
          onClick={() => setActiveTab('supply')}
        >
          <Truck size={18} /> توريد
        </div>
        <div 
          style={{...styles.tab, ...(activeTab === 'finished' ? styles.activeTab : {})}} 
          onClick={() => setActiveTab('finished')}
        >
          <Package size={18} /> منتجات
        </div>
      </div>

      {/* منطقة عرض المحتوى المتغيرة حسب التبويب المختار */}
      <div style={styles.contentArea}>
        
        {/* 1. واجهة الخامات والمواد الأولية */}
        {activeTab === 'raw' && (
          <RawMaterials 
            categories={categories} 
            onDeleteItem={onDeleteItem} 
          />
        )}

        {/* 2. واجهة تسجيل عمليات التوريد الجديدة */}
        {activeTab === 'supply' && (
          <SupplyEntry 
            onInventoryEntry={onInventoryEntry} 
            categories={categories} 
          />
        )}

        {/* 3. واجهة عرض وإدارة المنتجات النهائية */}
        {activeTab === 'finished' && (
          <FinishedProducts 
            categories={categories} 
            onDeleteItem={onDeleteItem} 
          />
        )}

      </div>
    </div>
  );
};

export default Inventory;
