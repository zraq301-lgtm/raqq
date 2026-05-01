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
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },
    shelfItem: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      borderBottom: '5px solid #3b82f6',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '140px'
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
    deleteArea: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 10 // لضمان ظهور الزر فوق أي عنصر آخر
    },
    btnDelete: {
      background: '#fff1f2',
      color: '#e11d48',
      border: 'none',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
                  onClick={() => onDelete(cat.id)} // استدعاء دالة الحذف
                  style={styles.btnDelete}
                  title="إزالة الرف"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={styles.itemName}>
                <Box size={18} color="#64748b" />
                {cat.name}
              </div>

              <div style={styles.quantityDisplay}>
                <span style={styles.number}>{cat.balance}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>وحدة متاحة</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
