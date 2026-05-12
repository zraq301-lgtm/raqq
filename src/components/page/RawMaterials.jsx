import React from 'react';
// تمت إضافة AlertTriangle هنا لإصلاح مشكلة الصفحة البيضاء
import { Trash2, Box, Info, Database, CircleDollarSign, AlertTriangle } from 'lucide-react';

const RawMaterials = ({ categories = [], onDeleteItem }) => {
  
  // 1. تصفية الخامات فقط
  const rawMaterialsList = categories.filter(item => {
    const nameStr = String(item.name || item.item || "").trim().toLowerCase();
    return nameStr.length > 0 && 
           !nameStr.includes("معمول") && 
           !nameStr.includes("جاهز");
  });

  return (
    <div style={{ padding: '10px', direction: 'rtl' }}>
      {rawMaterialsList.length > 0 ? (
        rawMaterialsList.map((item, index) => {
          const name = item.name || item.item;
          const balance = parseFloat(item.balance || item.quantity || 0);
          const price = parseFloat(item.price || 0);
          const totalValue = (balance * price).toFixed(2);
          const itemId = item._id || item.id;

          return (
            <div key={itemId || index} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={iconWrapper}>
                    <Box size={18} color="#2563eb" />
                  </div>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: 'bold' }}>
                    {name}
                  </h3>
                </div>
                <button 
                  onClick={() => onDeleteItem(itemId, 'stock')}
                  style={deleteBtnStyle}
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>
              </div>

              <div style={detailsGrid}>
                <div style={detailItem}>
                  <Database size={14} color="#64748b" />
                  <span>الرصيد: <b style={{ color: balance > 5 ? '#10b981' : '#ef4444' }}>{balance}</b></span>
                </div>
                
                <div style={detailItem}>
                  <CircleDollarSign size={14} color="#64748b" />
                  <span>السعر: <b>{price} ج.م</b></span>
                </div>

                <div style={{ ...detailItem, gridColumn: 'span 2', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '5px' }}>
                  <Info size={14} color="#3b82f6" />
                  <span>القيمة: <b style={{ color: '#2563eb' }}>{totalValue} ج.م</b></span>
                </div>
              </div>

              <div style={idFooter}>
                المعرف: {itemId ? String(itemId).slice(-8) : 'N/A'}
              </div>
            </div>
          );
        })
      ) : (
        <div style={emptyStateStyle}>
          <AlertTriangle size={40} color="#cbd5e1" />
          <p>لا توجد خامات مسجلة حالياً</p>
          <small>قم بإضافة الخامات من "توريد المخزن"</small>
        </div>
      )}
    </div>
  );
};

// --- التنسيقات (لم يتغير بها شيء ولكنها ضرورية لعمل الكود) ---
const cardStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '18px',
  marginBottom: '15px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  borderRight: '6px solid #2563eb',
};

const iconWrapper = {
  width: '32px', height: '32px', borderRadius: '8px',
  backgroundColor: '#eff6ff', display: 'flex',
  justifyContent: 'center', alignItems: 'center'
};

const detailsGrid = {
  display: 'grid', gridTemplateColumns: '1fr 1fr',
  gap: '10px', backgroundColor: '#f8fafc',
  padding: '12px', borderRadius: '12px'
};

const detailItem = {
  display: 'flex', alignItems: 'center',
  gap: '6px', fontSize: '13px', color: '#475569'
};

const deleteBtnStyle = {
  background: '#fff1f2', border: 'none',
  padding: '8px', borderRadius: '10px',
  cursor: 'pointer', display: 'flex', alignItems: 'center'
};

const idFooter = {
  fontSize: '9px', color: '#94a3b8',
  marginTop: '10px', textAlign: 'left', fontFamily: 'monospace'
};

const emptyStateStyle = {
  textAlign: 'center', padding: '60px 20px',
  background: '#fff', borderRadius: '20px',
  color: '#94a3b8', display: 'flex',
  flexDirection: 'column', alignItems: 'center', gap: '10px'
};

export default RawMaterials;
