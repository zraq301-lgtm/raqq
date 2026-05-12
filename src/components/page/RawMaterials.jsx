import React from 'react';
import { Trash2, Box } from 'lucide-react';

const RawMaterials = ({ categories = [], onDeleteItem }) => {
  // 1. تنظيف وفلترة البيانات
  const rawData = categories.filter(item => {
    // استخراج الاسم وتنظيفه من المسافات الزائدة
    const nameStr = String(item.name || item.item || "").trim().toLowerCase();
    
    // الشرط: أن يكون له اسم، ولا يحتوي على الكلمات المستبعدة
    return nameStr.length > 0 && 
           !nameStr.includes("معمول") && 
           !nameStr.includes("جاهز");
  });

  return (
    <div style={{ padding: '10px' }}>
      {rawData.length > 0 ? (
        rawData.map((item, index) => {
          // تأمين تحويل الرصيد والسعر لأرقام لأنها في الصورة تظهر كنصوص "200"
          const displayBalance = item.balance ?? item.quantity ?? 0;
          const displayPrice = item.price ?? 0;

          return (
            <div key={item.id || item._id || index} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box size={18} color="#3498db" />
                  <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>
                    {item.name || item.item}
                  </h3>
                </div>
                <button 
                  onClick={() => onDeleteItem(item.id || item._id)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
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
                padding: '10px',
                borderRadius: '8px'
              }}>
                <span>الرصيد: <b style={{ color: '#2563eb' }}>{displayBalance}</b></span>
                <span>السعر: <b style={{ color: '#10b981' }}>{displayPrice} ج.م</b></span>
              </div>

              <div style={{ 
                fontSize: '10px', 
                color: '#94a3b8', 
                marginTop: '8px',
                textAlign: 'left',
                fontFamily: 'monospace',
                opacity: 0.7
              }}>
                ID: {item._id || item.id}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          color: '#94a3b8',
          background: '#fff',
          borderRadius: '15px',
          border: '1px dashed #e2e8f0'
        }}>
          <p style={{ margin: 0, fontSize: '16px' }}>📦 لا توجد خامات متاحة</p>
          <small>تأكد من إضافة الأصناف في قسم المخزن/التوريد</small>
        </div>
      )}
    </div>
  );
};

const cardStyle = { 
  background: '#fff', 
  padding: '15px', 
  borderRadius: '15px', 
  marginBottom: '12px', 
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  borderRight: '6px solid #3498db'
};

export default RawMaterials;
