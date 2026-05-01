import React from 'react';
import { Plus, Minus } from 'lucide-react';

const InventoryCard = ({ name, balance, onUpdate, styles, id }) => (
  <div style={styles.categoryCard}>
    <div style={styles.cardHeader}>
      <span style={styles.categoryName}>{name}</span>
      <span style={styles.balanceBadge}>{balance} وحدة</span>
    </div>
    <div style={styles.actionsGroup}>
      <button style={{ ...styles.btn, ...styles.btnIn }} onClick={() => onUpdate(id, 'IN')}>
        <Plus size={18} /> توريد
      </button>
      <button style={{ ...styles.btn, ...styles.btnOut }} onClick={() => onUpdate(id, 'OUT')}>
        <Minus size={18} /> سحب
      </button>
    </div>
  </div>
);

const Inventory = ({ categories, onUpdate }) => {
  const styles = {
    container: { width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', direction: 'rtl' },
    categoryCard: { background: '#ffffff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    categoryName: { fontWeight: '700', color: '#374151' },
    balanceBadge: { backgroundColor: '#fff5f7', color: '#ff4d7d', padding: '6px 14px', borderRadius: '10px', fontWeight: '800' },
    actionsGroup: { display: 'flex', gap: '12px' },
    btn: { flex: 1, border: 'none', padding: '12px', borderRadius: '15px', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' },
    btnIn: { backgroundColor: '#22c55e' },
    btnOut: { backgroundColor: '#ef4444' },
  };

  return (
    <div style={styles.container}>
      <h2 style={{ borderRight: '4px solid #ff4d7d', paddingRight: '10px' }}>أقسام المواد الخام</h2>
      {categories.map(cat => (
        <InventoryCard 
          key={cat.id} 
          id={cat.id}
          name={cat.name} 
          balance={cat.balance} 
          onUpdate={onUpdate} 
          styles={styles} 
        />
      ))}
    </div>
  );
};

export default Inventory;
