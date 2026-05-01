import React from 'react';
import { Trash2, Box, Layers, AlertCircle } from 'lucide-react';

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
      alignItems: 'center',
      gap: '12px',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '15px'
    },
    shelfGrid: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // نظام الرفوف التلقائي
    },
    shelfItem: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      borderBottom: '5px solid #3b82f6', // قاعدة الرف
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '140px'
    },
    itemInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    itemName: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#334155',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    quantityDisplay: {
      marginTop: '15px',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px dashed #cbd5e1'
    },
    number: {
      fontSize: '1.8rem',
      fontWeight: '900',
      color: '#2563eb',
      display: 'block'
    },
    unit: {
      fontSize: '0.8rem',
      color: '#64748b',
      fontWeight: '600'
    },
    deleteArea: {
      position: 'absolute',
      top: '10px',
      left: '10px'
    },
    btnDelete: {
      background: '#fff1f2',
      color: '#e11d48',
      border: 'none',
      padding: '6px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s'
    },
    emptyShelf: {
      textAlign: 'center',
      padding: '50px',
      gridColumn: '1/-1',
      color: '#94a3b8'
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
          <div style={styles.emptyShelf}>
            <AlertCircle size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>لا توجد مواد مرصوصة على الرفوف حالياً</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} style={styles.shelfItem}>
              {/* منطقة الحذف */}
              <div style={styles.deleteArea}>
                <button 
                  onClick={() => onDelete(cat.id)} 
                  style={styles.btnDelete}
                  onMouseOver={(e) => e.currentTarget.style.background = '#ffe4e6'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#fff1f2'}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* معلومات المادة */}
              <div style={styles.itemInfo}>
                <div style={styles.itemName}>
                  <Box size={18} color="#64748b" />
                  {cat.name}
                </div>
              </div>

              {/* عرض الكمية الضخم */}
              <div style={styles.quantityDisplay}>
                <span style={styles.number}>{cat.balance}</span>
                <span style={styles.unit}>وحدة متاحة</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
