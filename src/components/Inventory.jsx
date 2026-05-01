import React from 'react';
import { Plus, Minus, Tag } from 'lucide-react';

// مكون فرعي لكل صنف - يعرض النوع والكمية والسعر
const InventoryCard = ({ name, balance, price, onIn, onOut, styles }) => (
  <div style={styles.categoryCard}>
    <div style={styles.cardHeader}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={styles.categoryName}>{name}</span>
        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tag size={14} /> السعر: {price} ج.م
        </span>
      </div>
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

const InventoryManager = ({ inventoryData = [] }) => {
  // ملاحظة: inventoryData هي المصفوفة التي ستجلبها من كود المشتريات
  
  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px', // تم التوسيع ليملأ الشاشة كما طلبت سابقاً
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: "'Tajawal', sans-serif",
      direction: 'rtl',
      margin: '0 auto',
      padding: '20px',
      boxSizing: 'border-box',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '800',
      color: '#374151',
      marginBottom: '8px',
      borderRight: '4px solid #ff4d7d',
      paddingRight: '12px',
    },
    categoryCard: {
      background: '#ffffff',
      padding: '20px',
      borderRadius: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
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
      backgroundColor: '#fff5f7',
      color: '#ff4d7d',
      padding: '6px 14px',
      borderRadius: '10px',
      fontSize: '0.9rem',
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
      fontFamily: "'Tajawal', sans-serif",
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
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#94a3b8',
        fontSize: '1.1rem'
    }
  };

  const handleAction = (type, category) => {
    console.log(`${type === 'in' ? 'توريد' : 'سحب'} : ${category}`);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>مخزون المواد الخام</h2>

        {/* عرض الأصناف بناءً على البيانات القادمة من المشتريات */}
        {inventoryData.length > 0 ? (
          inventoryData.map((item, index) => (
            <InventoryCard 
              key={index}
              name={item.type}      // النوع
              balance={item.quantity} // الكمية
              price={item.price}     // السعر
              onIn={() => handleAction('in', item.type)}
              onOut={() => handleAction('out', item.type)}
              styles={styles} 
            />
          ))
        ) : (
          <div style={styles.emptyState}>
            لا توجد أصناف في المخزن حالياً. قم بإضافة مشتريات لجلب البيانات.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
