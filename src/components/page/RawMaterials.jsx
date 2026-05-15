import React from 'react';
import { Trash2, Box, Info, Database, CircleDollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

// 1. تأكد من استقبال onDelete (وليس onDeleteItem) لتطابق كود المحرك القديم
const RawMaterials = ({ categories = [], onDelete }) => {
  
  const itemsArray = Array.isArray(categories) ? categories : (categories?.data || []);

  const rawMaterialsList = itemsArray.filter(item => {
    if (!item) return false;
    const nameStr = String(item.name || item.item || "").trim().toLowerCase();
    return nameStr.length > 0 && 
           !nameStr.includes("معمول") && 
           !nameStr.includes("جاهز");
  });

  if (!itemsArray || itemsArray.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <Loader2 size={40} className="animate-spin" color="#cbd5e1" />
        <p>جاري جلب البيانات من السحابة...</p>
      </div>
    );
  }

  const confirmDelete = (id, name) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف ${name} نهائياً`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // 2. هنا تم تغييرها لـ onDelete لتسمع في المحرك
        if (onDelete) {
          onDelete(id, 'stock');
        } else {
          console.error("خطأ: دالة الحذف غير واصلة للمكون");
        }
      }
    });
  };

  return (
    <div style={{ padding: '10px', direction: 'rtl' }}>
      <div style={{ marginBottom: '15px', fontSize: '12px', color: '#64748b' }}>
        📦 تم العثور على ({rawMaterialsList.length}) خامة في المخزن
      </div>

      {rawMaterialsList.length > 0 ? (
        rawMaterialsList.map((item, index) => {
          const name = item.name || item.item || "صنف غير مسمى";
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
                  onClick={() => confirmDelete(itemId, name)}
                  style={deleteBtnStyle}
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>
              </div>

              <div style={detailsGrid}>
                <div style={detailItem}>
                  <Database size={14} color="#64748b" />
                  <span>الرصيد: <b style={{ color: balance > 0 ? '#10b981' : '#ef4444' }}>{balance}</b></span>
                </div>
                
                <div style={detailItem}>
                  <CircleDollarSign size={14} color="#64748b" />
                  <span>السعر: <b>{price} ج</b></span>
                </div>

                <div style={{ ...detailItem, gridColumn: 'span 2', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '5px' }}>
                  <Info size={14} color="#3b82f6" />
                  <span>إجمالي القيمة: <b style={{ color: '#2563eb' }}>{totalValue} ج.م</b></span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div style={emptyStateStyle}>
          <AlertTriangle size={40} color="#f59e0b" />
          <p>لم يتم العثور على خامات</p>
        </div>
      )}
    </div>
  );
};

// التنسيقات ثابتة كما هي
const cardStyle = { background: '#fff', padding: '15px', borderRadius: '18px', marginBottom: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', borderRight: '6px solid #2563eb' };
const iconWrapper = { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const detailsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' };
const detailItem = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' };
const deleteBtnStyle = { background: '#fff1f2', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const emptyStateStyle = { textAlign: 'center', padding: '100px 20px', background: '#fff', borderRadius: '20px', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' };

export default RawMaterials;
