import React, { useEffect } from 'react';
import { Trash2, Box, Info, Database, CircleDollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

// تم اعتماد onDeleteItem ليتوافق مع Inventory.js و App.js
const RawMaterials = ({ categories = [], onDeleteItem }) => {
  
  // 1. تحويل البيانات لمصفوفة لضمان عدم حدوث خطأ Map
  const itemsArray = Array.isArray(categories) ? categories : (categories?.data || []);

  // 2. تصفية الخامات فقط (استبعاد المنتجات النهائية)
  const rawMaterialsList = itemsArray.filter(item => {
    if (!item) return false;
    const nameStr = String(item.name || item.item || "").trim().toLowerCase();
    return nameStr.length > 0 && 
           !nameStr.includes("معمول") && 
           !nameStr.includes("جاهز");
  });

  // فحص الأصناف المنخفضة عن 200 وحدة لإرسال إشعار للنظام
  const lowStockItems = rawMaterialsList.filter(item => {
    const balance = parseFloat(item.balance || item.quantity || 0);
    return balance < 200;
  });

  // دالة إرسال إشعارات أندرويد محلياً عبر النظام الأساسي
  useEffect(() => {
    if (lowStockItems.length > 0) {
      lowStockItems.forEach(async (item) => {
        const name = item.name || item.item || "صنف غير مسمى";
        const balance = parseFloat(item.balance || item.quantity || 0);
        
        // محاولة إرسال الإشعار إلى أندرويد عبر محرك كاباسيتور المتواجد بـ App.jsx
        try {
          const { LocalNotifications } = require('@capacitor/local-notifications');
          await LocalNotifications.schedule({
            notifications: [
              {
                title: '⚠️ تنبيه نقص خامات',
                body: `الخامة "${name}" انخفضت إلى ${balance} وحدة! (أقل من 200)`,
                id: Math.floor(Math.random() * 100000),
                schedule: { at: new Date(Date.now() + 1000) },
                sound: null,
                attachments: null,
                actionTypeId: '',
                extra: null
              }
            ]
          });
        } catch (e) {
          console.log("البيئة الحالية ليست هاتف أو لم يتم تفعيل نظام الإشعارات في App.jsx بعد.");
        }
      });
    }
  }, [categories]);

  // 3. حالة التحميل
  if (!itemsArray || itemsArray.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <Loader2 size={40} className="animate-spin" color="#cbd5e1" />
        <p>جاري جلب البيانات من السحابة...</p>
      </div>
    );
  }

  // دالة التأكيد والحذف
  const confirmDelete = (id, name) => {
    if (!id) {
      console.error("خطأ: الصنف ليس له معرف (ID)");
      Swal.fire('خطأ', 'لا يمكن حذف هذا الصنف لعدم وجود معرف رقمي', 'error');
      return;
    }

    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف "${name}" نهائياً من المخزن والسحابة`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، احذف الآن',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (onDeleteItem) {
          onDeleteItem(id, 'stock');
        } else {
          console.error("خطأ: دالة onDeleteItem غير واصلة للمكون");
        }
      }
    });
  };

  return (
    <div style={{ padding: '10px', direction: 'rtl' }}>
      
      {/* التنبيه الأحمر اللحظي أعلى الشاشة عند انخفاض أي مخزون عن 200 */}
      {lowStockItems.length > 0 && (
        <div style={topAlertStyle}>
          <AlertTriangle size={16} />
          <span>
            تنبيه: يوجد عدد ({lowStockItems.length}) خامات رصيدها أقل من 200 وحدة!
          </span>
        </div>
      )}

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

          // إذا قل المخزون عن 200 وحدة، يتحول الشريط الجانبي للكارت تلقائياً للون الأحمر كإشارة بصرية إضافية
          const dynamicCardStyle = {
            ...cardStyle,
            borderRight: balance < 200 ? '6px solid #ef4444' : '6px solid #2563eb'
          };

          return (
            <div key={itemId || index} style={dynamicCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={iconWrapper}>
                    <Box size={18} color={balance < 200 ? "#ef4444" : "#2563eb"} />
                  </div>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: 'bold' }}>
                    {name}
                    {balance < 200 && <span style={badgeStyle}>ناقص ⚠️</span>}
                  </h3>
                </div>
                <button 
                  onClick={() => confirmDelete(itemId, name)}
                  style={deleteBtnStyle}
                  title="حذف الصنف"
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>
              </div>

              <div style={detailsGrid}>
                <div style={detailItem}>
                  <Database size={14} color="#64748b" />
                  <span>الرصيد: <b style={{ color: balance >= 200 ? '#10b981' : '#ef4444' }}>{balance}</b></span>
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
          <small>تأكد من عدم وجود كلمة "معمول" في اسم الخامة</small>
        </div>
      )}
    </div>
  );
};

// --- التنسيقات الأصلية مع إضافة التنسيقات الجديدة للتنبيهات ---
const cardStyle = { 
  background: '#fff', 
  padding: '15px', 
  borderRadius: '18px', 
  marginBottom: '15px', 
  boxShadow: '0 4px 10px rgba(0,0,0,0.03)', 
  borderRight: '6px solid #2563eb' 
};

const topAlertStyle = {
  backgroundColor: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fee2e2',
  padding: '12px',
  borderRadius: '12px',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: 'bold',
  boxShadow: '0 2px 5px rgba(239,68,68,0.05)'
};

const badgeStyle = {
  fontSize: '11px',
  backgroundColor: '#fef2f2',
  color: '#ef4444',
  padding: '2px 6px',
  borderRadius: '6px',
  marginRight: '8px',
  border: '1px solid #fee2e2'
};

const iconWrapper = { 
  width: '32px', height: '32px', borderRadius: '8px', 
  backgroundColor: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center' 
};

const detailsGrid = { 
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', 
  backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' 
};

const detailItem = { 
  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' 
};

const deleteBtnStyle = { 
  background: '#fff1f2', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', 
  display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s'
};

const emptyStateStyle = { 
  textAlign: 'center', padding: '100px 20px', background: '#fff', 
  borderRadius: '20px', color: '#94a3b8', display: 'flex', 
  flexDirection: 'column', alignItems: 'center', gap: '10px' 
};

export default RawMaterials;
