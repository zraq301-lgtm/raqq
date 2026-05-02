import React from 'react';
import { Trash2, Box, Layers, AlertCircle, Tag } from 'lucide-react';

const Inventory = ({ categories, onDelete }) => {
  const styles = {
    container: {
      padding: '25px',
      direction: 'rtl',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: "'Tajawal', sans-serif",
      paddingBottom: '100px'
    },
    shelfTitle: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center', // تم الإصلاح هنا (بدل align-items)
      gap: '12px',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '15px'
    },
    shelfGrid: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },
    shelfItem: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      borderBottom: '6px solid #3b82f6',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      minHeight: '200px'
    },
    itemName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#334155',
      display: 'flex',
      alignItems: 'center', // تم الإصلاح هنا
      gap: '8px',
      paddingLeft: '35px'
    },
    dataContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      backgroundColor: '#f8fafc',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    dataRow: {
      display: 'flex',
      justifyContent: 'space-between', // تم الإصلاح هنا (بدل justify-content)
      alignItems: 'center' // تم الإصلاح هنا
    },
    label: {
      fontSize: '0.85rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center', // تم الإصلاح هنا
      gap: '5px'
    },
    value: {
      fontSize: '1.1rem',
      fontWeight: '800',
      color: '#1e293b'
    },
    totalSection: {
      marginTop: '5px',
      paddingTop: '10px',
      borderTop: '2px dashed #cbd5e1',
      display: 'flex',
      justifyContent: 'space-between', // تم الإصلاح هنا
      alignItems: 'center' // تم الإصلاح هنا
    },
    totalValue: {
      fontSize: '1.3rem',
      fontWeight: '900',
      color: '#10b981'
    },
    deleteArea: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      zIndex: 10
    },
    btnDelete: {
      background: '#fff1f2',
      color: '#e11d48',
      border: 'none',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center', // تم الإصلاح هنا
      justifyContent: 'center', // تم الإصلاح هنا
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.shelfTitle}>
        <Layers size={28} color="#2563eb" />
        <span>رفوف المخزون الحالية</span>
      </div>

      <div style={styles.shelfGrid}>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#94a3b8' }}>
            <AlertCircle size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>المخزن فارغ تماماً حالياً</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} style={styles.shelfItem}>
              <div style={styles.deleteArea}>
                <button 
                  onClick={() => onDelete(cat.id)}
                  style={styles.btnDelete}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={styles.itemName}>
                <Box size={20} color="#3b82f6" />
                {cat.name}
              </div>

              <div style={styles.dataContainer}>
                <div style={styles.dataRow}>
                  <span style={styles.label}>الكمية المتاحة:</span>
                  <span style={styles.value}>{cat.balance} وحدة</span>
                </div>
                
                <div style={styles.dataRow}>
                  <span style={styles.label}>
                    <Tag size={14} /> سعر الوحدة:
                  </span>
                  <span style={styles.value}>{cat.price || 0} ج.م</span>
                </div>

                <div style={styles.totalSection}>
                  <span style={{...styles.label, fontWeight: 'bold', color: '#1e293b'}}>إجمالي القيمة:</span>
                  <span style={styles.totalValue}>
                    {(cat.balance * (cat.price || 0)).toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
