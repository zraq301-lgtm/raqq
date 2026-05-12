import React from 'react';
import { Trash2, Box } from 'lucide-react';

const RawMaterials = ({ categories = [], onDeleteItem }) => {
  // 1. تصفية البيانات لضمان عرض الخامات فقط (استبعاد المنتجات النهائية)
  // نعتمد هنا على المسميات الموحدة التي تم ضبطها في App.jsx
  const rawData = categories.filter(item => {
    const displayName = (item.name || item.item || '').toLowerCase();
    
    // إبقاء المواد الخام فقط واستبعاد أي صنف يحتوي اسمه على "معمول" أو "جاهز"
    return displayName && !(displayName.includes("معمول") || displayName.includes("جاهز"));
  });

  return (
    <div style={{ padding: '10px' }}>
      {rawData.length > 0 ? (
        rawData.map((item, index) => (
          <div key={item.id || index} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Box size={18} color="#3498db" />
                <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>
                  {/* استقبال الاسم الموحد 'name' مع دعم 'item' كبديل احتياطي */}
                  {item.name || item.item}
                </h3>
              </div>
              <button 
                onClick={() => onDeleteItem(item.id)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                title="حذف الصنف"
              >
                <Trash2 size={18} color="#ef4444" />
              </button>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '12px', 
              color: '#666', 
              fontSize: '14px',
              backgroundColor: '#f8fafc',
              padding: '8px',
              borderRadius: '8px'
            }}>
              {/* استقبال الرصيد الموحد 'balance' مع دعم 'quantity' كبديل احتياطي */}
              <span>الرصيد: <b style={{ color: '#2563eb' }}>{item.balance ?? item.quantity ?? 0}</b></span>
              <span>السعر: <b style={{ color: '#10b981' }}>{item.price || 0} ج.م</b></span>
            </div>

            {/* عرض رقم العملية أو الباتش إن وجد لتمييز التوريدات */}
            {(item.batchId || item.id) && (
              <div style={{ 
                fontSize: '10px', 
                color: '#94a3b8', 
                marginTop: '8px',
                textAlign: 'left',
                fontFamily: 'monospace' 
              }}>
                ID: {item.batchId || item.id}
              </div>
            )}
          </div>
        ))
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          color: '#94a3b8',
          background: '#fff',
          borderRadius: '15px'
        }}>
          <p style={{ margin: 0 }}>📦 لا توجد خامات حالياً في المخزن</p>
          <small>قم بإضافة أصناف جديدة من قسم التوريد</small>
        </div>
      )}
    </div>
  );
};

// تصميم الكارت المتوافق مع هوية "معمول" البصرية
const cardStyle = { 
  background: '#fff', 
  padding: '15px', 
  borderRadius: '15px', 
  marginBottom: '12px', 
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  borderRight: '6px solid #3498db', // تمييز جانبي بلون الخامات (الأزرق)
  transition: 'transform 0.2s ease'
};

export default RawMaterials;
