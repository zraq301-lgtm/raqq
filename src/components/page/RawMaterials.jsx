import React from 'react';
import { Trash2 } from 'lucide-react';

const RawMaterials = ({ categories = [], onDeleteItem }) => {
  // 1. تنظيف وتصفية البيانات لضمان عرض الخامات فقط
  const rawData = categories.filter(item => {
    // التحقق من الاسم سواء كان مخزناً في name أو item (لتجنب الخطأ البرمي)
    const displayName = (item.name || item.item || '').toLowerCase();
    
    // استبعاد المنتجات الجاهزة (المعمول) وإبقاء المواد الخام
    return displayName && !(displayName.includes("معمول") || displayName.includes("جاهز"));
  });

  return (
    <div style={{ padding: '10px' }}>
      {rawData.length > 0 ? rawData.map((item, index) => (
        <div key={item.id || index} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* عرض الاسم سواء كان القادم من التوريد 'item' أو 'name' */}
            <h3 style={{ margin: 0, color: '#2c3e50' }}>{item.name || item.item}</h3>
            <button 
              onClick={() => onDeleteItem(item.id)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Trash2 size={18} color="#ef4444" />
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#666', fontSize: '14px' }}>
            {/* تأكد من مسميات الحقول القادمة من التوريد (balance أو quantity) */}
            <span>الرصيد: <b style={{ color: '#2563eb' }}>{item.balance || item.quantity || 0}</b></span>
            <span>السعر: <b style={{ color: '#10b981' }}>{item.price || 0} ج.م</b></span>
          </div>

          {/* إضافة رقم العملية إذا وجد لتمييز التوريدات الجديدة */}
          {item.batchId && (
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>
              رقم العملية: {item.batchId}
            </div>
          )}
        </div>
      )) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
          <p>لا توجد خامات حالياً في المخزن</p>
        </div>
      )}
    </div>
  );
};

const cardStyle = { 
  background: '#fff', 
  padding: '15px', 
  borderRadius: '15px', 
  marginBottom: '10px', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  borderRight: '5px solid #3498db' // تمييز بصري للخامات
};

export default RawMaterials;
