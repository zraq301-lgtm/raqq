import React from 'react';
import { Trash2, Box } from 'lucide-react';

const RawMaterials = ({ categories = [], onDeleteItem }) => {
  // 1. تنظيف وفلترة البيانات لضمان عرض الخامات فقط
  const rawData = categories.filter(item => {
    // استخراج الاسم وتنظيفه (دعم لجميع المسميات الممكنة)
    const nameStr = String(item.name || item.item || "").trim().toLowerCase();
    
    // استبعاد المنتجات النهائية (معمول / جاهز) وإبقاء الخامات
    return nameStr.length > 0 && 
           !nameStr.includes("معمول") && 
           !nameStr.includes("جاهز");
  });

  return (
    <div style={{ padding: '10px' }}>
      {rawData.length > 0 ? (
        rawData.map((item, index) => {
          // تحويل البيانات لأرقام بشكل آمن لأن الـ API يرسلها كنصوص في بعض الأحيان
          const displayBalance = parseFloat(item.balance || item.quantity || 0);
          const displayPrice = parseFloat(item.price || 0);
          
          // تأمين الحصول على المعرف الصحيح للحذف
          const itemId = item._id || item.id;

          return (
            <div key={itemId || index} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box size={18} color="#3498db" />
                  <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '16px', fontWeight: 'bold' }}>
                    {item.name || item.item || "صنف مجهول"}
                  </h3>
                </div>
                
                <button 
                  onClick={() => onDeleteItem(itemId, 'stock')} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                  title="حذف الخامة"
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
                borderRadius: '10px'
              }}>
                <span>الرصيد: <b style={{ color: '#2563eb' }}>{displayBalance}</b></span>
                <span>السعر: <b style={{ color: '#10b981' }}>{displayPrice} ج.م</b></span>
              </div>

              {/* عرض المعرف بشكل خافت للتأكد من المزامنة */}
              <div style={{ 
                fontSize: '9px', 
                color: '#cbd5e1', 
                marginTop: '8px',
                textAlign: 'left',
                fontFamily: 'monospace'
              }}>
                REF: {String(itemId).slice(-8)}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px 20px', 
          color: '#94a3b8',
          background: '#fff',
          borderRadius: '20px',
          border: '2px dashed #f1f5f9'
        }}>
          <Box size={40} style={{ marginBottom: '10px', opacity: 0.2 }} />
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>المخزن فارغ من الخامات</p>
          <small>تأكد من إضافة الخامات (مثل: دقيق، سمن) من قسم التوريد</small>
        </div>
      )}
    </div>
  );
};

// تصميم الكارت الموحد
const cardStyle = { 
  background: '#fff', 
  padding: '15px', 
  borderRadius: '18px', 
  marginBottom: '12px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
  borderRight: '6px solid #3498db',
  transition: 'all 0.2s ease'
};

export default RawMaterials;
