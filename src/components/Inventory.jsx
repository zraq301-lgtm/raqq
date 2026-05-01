import React from 'react';
import { Plus, Minus, Trash2, Box, Tag } from 'lucide-react';

const Inventory = ({ categories, onUpdate, onDelete }) => {
  const styles = {
    container: {
      padding: '20px',
      direction: 'rtl',
      maxWidth: '800px',
      margin: '0 auto',
      paddingBottom: '100px'
    },
    grid: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: '1fr' // مناسب جداً لشاشات الموبايل
    },
    card: {
      background: '#fff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      position: 'relative'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    },
    titleGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    name: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    badge: {
      backgroundColor: '#fce7f3',
      color: '#be185d',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 'bold'
    },
    actionRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
    },
    btn: {
      flex: 1,
      padding: '10px',
      borderRadius: '12px',
      border: 'none',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px'
    },
    btnDelete: {
      backgroundColor: 'transparent',
      color: '#ef4444',
      border: '1px solid #fee2e2',
      padding: '8px',
      borderRadius: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '20px', color: '#2563eb', borderRight: '5px solid', paddingRight: '10px' }}>
        إدارة المخزون المباشر
      </h2>
      
      <div style={styles.grid}>
        {categories.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>المخزن فارغ حالياً..</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} style={styles.card}>
              <div style={styles.header}>
                <div style={styles.titleGroup}>
                  <Box size={20} color="#2563eb" />
                  <span style={styles.name}>{cat.name}</span>
                </div>
                {/* زر الحذف */}
                <button 
                  onClick={() => onDelete(cat.id)} 
                  style={styles.btnDelete}
                  title="حذف الصنف"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={styles.badge}>{cat.balance} وحدة متوفرة</span>
              </div>

              <div style={styles.actionRow}>
                <button 
                  style={{ ...styles.btn, backgroundColor: '#22c55e' }}
                  onClick={() => onUpdate(cat.id, 'IN')}
                >
                  <Plus size={16} /> توريد
                </button>
                <button 
                  style={{ ...styles.btn, backgroundColor: '#ef4444' }}
                  onClick={() => onUpdate(cat.id, 'OUT')}
                >
                  <Minus size={16} /> سحب
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
