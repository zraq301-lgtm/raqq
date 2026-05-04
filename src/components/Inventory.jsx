import React from 'react';
import { Trash2, Box, Layers, AlertCircle, Tag, ArrowRight } from 'lucide-react';

const Inventory = ({ categories, onDelete, onBack }) => {
  const styles = {
    container: { padding: '20px', direction: 'rtl', maxWidth: '900px', margin: '0 auto', fontFamily: "'Tajawal', sans-serif" },
    shelfTitle: { fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' },
    shelfGrid: { display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' },
    shelfItem: { background: '#ffffff', borderRadius: '16px', padding: '20px', borderBottom: '6px solid #3b82f6', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' },
    itemName: { fontSize: '1.2rem', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' },
    dataContainer: { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    dataRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    label: { fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' },
    value: { fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' },
    totalSection: { marginTop: '10px', paddingTop: '10px', borderTop: '2px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    btnDelete: { background: '#fff1f2', color: '#e11d48', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', position: 'absolute', top: '15px', left: '15px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.shelfTitle}>
        <Layers size={28} color="#2563eb" />
        <span>رصيد المخزن الحالي</span>
      </div>

      <div style={styles.shelfGrid}>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#94a3b8' }}>
            <AlertCircle size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>لا توجد أصناف في المخزن. ابدأ بتسجيل عملية شراء.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} style={styles.shelfItem}>
              <button onClick={() => onDelete(cat.id)} style={styles.btnDelete} title="حذف الصنف">
                <Trash2 size={18} />
              </button>

              <div style={styles.itemName}>
                <Box size={20} color="#3b82f6" />
                {cat.name}
              </div>

              <div style={styles.dataContainer}>
                <div style={styles.dataRow}>
                  <span style={styles.label}>الكمية المتوفرة:</span>
                  {/* هنا التعديل الجوهري: نتحقق من المسميين */}
                  <span style={styles.value}>
                    {cat.balance ?? cat.quantity ?? 0} {cat.unit || ''}
                  </span>
                </div>
                
                <div style={styles.dataRow}>
                  <span style={styles.label}><Tag size={14} /> سعر الشراء:</span>
                  <span style={styles.value}>{cat.price || 0} ج.م</span>
                </div>

                <div style={styles.totalSection}>
                  <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>إجمالي القيمة:</span>
                  <span style={{color: '#10b981', fontWeight: '900'}}>
                    {((cat.balance ?? cat.quantity ?? 0) * (cat.price || 0)).toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button onClick={onBack} style={{marginTop: '30px', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold'}}>
        <ArrowRight size={20} /> العودة للرئيسية
      </button>
    </div>
  );
};

export default Inventory;
