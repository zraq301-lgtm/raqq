import React from 'react';
import { Trash2, Calendar, Package, Banknote, Tag } from 'lucide-react';

const FinishedProducts = ({ productionHistory = [], onDeleteItem }) => {
  
  // دالة لحساب وتنسيق عرض المنتجات من سجل الإنتاج
  // نستخدم reverse لعرض أحدث إنتاج في الأعلى
  const displayData = [...productionHistory].reverse();

  return (
    <div style={{ padding: '15px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1e293b' }}>سجل المنتجات الجاهزة</h2>
      
      {displayData.length > 0 ? displayData.map((record, index) => {
        // حساب القيم لكل عملية إنتاج
        const totalQty = record.products?.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0) || 0;
        const totalCost = parseFloat(record.totalActualCost || 0);
        const unitPrice = totalQty > 0 ? (totalCost / totalQty).toFixed(2) : 0;
        const productName = record.products?.[0]?.name || "منتج نهائي";

        return (
          <div key={record.id || index} style={cardStyle}>
            {/* رأس الكارت: التاريخ واسم المنتج */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#3498db" />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>{record.date}</span>
              </div>
              <Trash2 
                size={18} 
                color="#ef4444" 
                style={{ cursor: 'pointer' }} 
                onClick={() => onDeleteItem(record.id || record._id, 'production')} 
              />
            </div>

            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b' }}>{productName}</h3>

            {/* تفاصيل الإنتاج: الكمية والسعر */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              
              <div style={infoBox}>
                <Package size={14} color="#e67e22" />
                <span style={labelStyle}>الكمية:</span>
                <b style={valueStyle}>{totalQty} كرتونة</b>
              </div>

              <div style={infoBox}>
                <Tag size={14} color="#10b981" />
                <span style={labelStyle}>سعر الكرتونة:</span>
                <b style={{...valueStyle, color: '#10b981'}}>{unitPrice} ج.م</b>
              </div>

              <div style={{ ...infoBox, gridColumn: 'span 2', background: '#f8fafc' }}>
                <Banknote size={14} color="#6366f1" />
                <span style={labelStyle}>إجمالي التكلفة المحملة:</span>
                <b style={{...valueStyle, color: '#6366f1', fontSize: '15px'}}>{totalCost.toFixed(2)} ج.م</b>
              </div>

            </div>
          </div>
        );
      }) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <Package size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p>لا توجد عمليات إنتاج مسجلة حالياً</p>
        </div>
      )}
    </div>
  );
};

// الأنماط التنسيقية
const cardStyle = { 
  background: '#fff', 
  padding: '15px', 
  borderRadius: '20px', 
  marginBottom: '15px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  border: '1px solid #f1f5f9'
};

const infoBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px',
  borderRadius: '10px',
  background: '#fff'
};

const labelStyle = {
  fontSize: '11px',
  color: '#64748b'
};

const valueStyle = {
  fontSize: '13px',
  color: '#1e293b'
};

export default FinishedProducts;
