import React from 'react';
import { Plus, Minus } from 'lucide-react';

// مكون فرعي لكل قسم من الأقسام لتقليل تكرار الكود
const InventoryCard = ({ name, balance, onIn, onOut, styles }) => (
  <div style={styles.categoryCard}>
    <div style={styles.cardHeader}>
      <span style={styles.categoryName}>{name}</span>
      <span style={styles.balanceBadge}>{balance} وحدة</span>
    </div>
    <div style={styles.actionsGroup}>
      <button 
        style={{ ...styles.btn, ...styles.btnIn }} 
        onClick={() => onIn(name)}
      >
        <Plus size={18} />
        توريد
      </button>
      <button 
        style={{ ...styles.btn, ...styles.btnOut }} 
        onClick={() => onOut(name)}
      >
        <Minus size={18} />
        سحب
      </button>
    </div>
  </div>
);

const InventoryManager = () => {
  // تعريف التنسيقات
  const styles = {
    container: {
      width: '100%',
      maxWidth: '500px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: "'Almarai', sans-serif",
      direction: 'rtl',
      margin: '0 auto',
      padding: '20px',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '800',
      color: '#374151',
      marginBottom: '8px',
      borderRight: '4px solid #2563eb',
      paddingRight: '12px',
    },
    categoryCard: {
      background: '#ffffff',
      padding: '20px',
      borderRadius: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #f1f5f9',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    categoryName: {
      fontWeight: '700',
      color: '#374151',
      fontSize: '1.1rem',
    },
    balanceBadge: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      padding: '6px 14px',
      borderRadius: '10px',
      fontSize: '0.85rem',
      fontWeight: '800',
    },
    actionsGroup: {
      display: 'flex',
      gap: '12px',
    },
    btn: {
      flex: 1,
      border: 'none',
      padding: '14px',
      borderRadius: '15px',
      fontFamily: "'Almarai', sans-serif",
      fontWeight: '700',
      fontSize: '1rem',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'opacity 0.2s ease',
    },
    btnIn: { backgroundColor: '#22c55e' },
    btnOut: { backgroundColor: '#ef4444' },
  };

  const handleAction = (type, category) => {
    console.log(`${type === 'in' ? 'توريد' : 'سحب'} : ${category}`);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>أقسام المواد الخام</h2>

        <InventoryCard 
          name="خشب زان" 
          balance="120" 
          onIn={() => handleAction('in', 'خشب زان')}
          onOut={() => handleAction('out', 'خشب زان')}
          styles={styles} 
        />

        <InventoryCard 
          name="حديد تسليح" 
          balance="45" 
          onIn={() => handleAction('in', 'حديد تسليح')}
          onOut={() => handleAction('out', 'حديد تسليح')}
          styles={styles} 
        />

        <InventoryCard 
          name="أسمنت بورتلاندي" 
          balance="8" 
          onIn={() => handleAction('in', 'أسمنت بورتلاندي')}
          onOut={() => handleAction('out', 'أسمنت بورتلاندي')}
          styles={styles} 
        />
      </div>
    </div>
  );
};

export default InventoryManager;
