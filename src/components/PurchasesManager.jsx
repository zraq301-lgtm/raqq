import React, { useState } from 'react';
import { 
  Package, Truck, Calendar, Hash, DollarSign, 
  ArrowRight, Save, ClipboardList, RefreshCcw, CreditCard 
} from 'lucide-react';

const PurchasesManager = ({ onPurchaseComplete, onBack }) => {
  const [activeView, setActiveView] = useState('menu'); // menu, entry, reports, returns
  const [formData, setFormData] = useState({
    item: '', unit: '', quantity: '', price: '', supplier: '', 
    paymentMethod: 'كاش', date: new Date().toISOString().split('T')[0]
  });
  
  // نظام تخزين التقارير محلياً (ليظهر في زر التقارير)
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    const total = formData.quantity * formData.price;
    const finalData = { ...formData, total, id: Date.now() };

    // 1. إرسال البيانات للمخزن الرئيسي (App.jsx سيتولى زيادة الرصيد أو إنشاء رف جديد)
    onPurchaseComplete(finalData);

    // 2. إضافة العملية لجدول التقارير في نفس الصفحة
    setPurchaseHistory([finalData, ...purchaseHistory]);

    alert(`تم تسجيل الشراء: ${formData.item} وإضافته للمخزن`);
    
    // إعادة تعيين النموذج والعودة للقائمة
    setFormData({ item: '', unit: '', quantity: '', price: '', supplier: '', paymentMethod: 'كاش', date: new Date().toISOString().split('T')[0] });
    setActiveView('menu');
  };

  const styles = {
    wrapper: { padding: '15px', direction: 'rtl', fontFamily: 'Tajawal', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '15px', marginTop: '20px' },
    actionCard: { 
      background: 'white', padding: '25px', borderRadius: '20px', textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderBottom: '5px solid #9b59b6', cursor: 'pointer'
    },
    formCard: { background: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '15px', fontSize: '1rem', outline: 'none' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#444', marginBottom: '5px', fontWeight: 'bold' },
    submitBtn: { width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#9b59b6', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '10px' }
  };

  // --- 1. واجهة الأزرار الثلاثة الرئيسية ---
  if (activeView === 'menu') {
    return (
      <div style={styles.wrapper}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
           <h2 style={{color: '#2c3e50'}}>إدارة المشتريات</h2>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.actionCard} onClick={() => setActiveView('entry')}>
            <Save size={35} color="#9b59b6" />
            <h3 style={{marginTop: '10px'}}>عملية شراء</h3>
            <p style={{fontSize: '0.8rem', color: '#888'}}>إضافة أصناف جديدة للمخزن</p>
          </div>

          <div style={styles.actionCard} onClick={() => setActiveView('returns')}>
            <RefreshCcw size={35} color="#e74c3c" />
            <h3 style={{marginTop: '10px'}}>مرتجع شراء</h3>
            <p style={{fontSize: '0.8rem', color: '#888'}}>إرجاع خامات للمورد</p>
          </div>

          <div style={styles.actionCard} onClick={() => setActiveView('reports')}>
            <ClipboardList size={35} color="#3498db" />
            <h3 style={{marginTop: '10px'}}>تقارير المشتريات</h3>
            <p style={{fontSize: '0.8rem', color: '#888'}}>عرض أرشيف العمليات</p>
          </div>
        </div>

        <button onClick={onBack} style={{marginTop: '30px', width: '100%', background: 'none', border: 'none', color: '#9b59b6', fontWeight: 'bold'}}>
          <ArrowRight size={18} /> العودة للوحة التحكم
        </button>
      </div>
    );
  }

  // --- 2. واجهة نموذج الإدخال (الكارت) ---
  if (activeView === 'entry') {
    return (
      <div style={styles.wrapper}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
           <button onClick={() => setActiveView('menu')} style={{border: 'none', background: '#eee', padding: '8px', borderRadius: '50%'}}><ArrowRight size={20} /></button>
           <h3 style={{margin: 0}}>تسجيل فاتورة شراء</h3>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSave}>
            <label style={styles.label}><Package size={16} /> اسم الصنف</label>
            <input style={styles.input} placeholder="مثال: دقيق" required onChange={e => setFormData({...formData, item: e.target.value})} />

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <div>
                <label style={styles.label}>الوحدة</label>
                <input style={styles.input} placeholder="كيلو/كرتونة" onChange={e => setFormData({...formData, unit: e.target.value})} />
              </div>
              <div>
                <label style={styles.label}><Hash size={16} /> الكمية</label>
                <input type="number" style={styles.input} required onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <div>
                <label style={styles.label}><DollarSign size={16} /> سعر الوحدة</label>
                <input type="number" style={styles.input} required onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label style={styles.label}>طريقة السداد</label>
                <select style={styles.input} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                  <option value="كاش">كاش</option>
                  <option value="آجل">آجل</option>
                </select>
              </div>
            </div>

            <label style={styles.label}><Truck size={16} /> اسم المورد</label>
            <input style={styles.input} placeholder="اختياري" onChange={e => setFormData({...formData, supplier: e.target.value})} />

            <label style={styles.label}><Calendar size={16} /> التاريخ</label>
            <input type="date" style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />

            <div style={{background: '#f0eef6', padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center'}}>
              <span style={{fontSize: '0.9rem'}}>إجمالي الفاتورة: </span>
              <strong style={{fontSize: '1.2rem', color: '#9b59b6'}}>{formData.quantity * formData.price}</strong>
            </div>

            <button type="submit" style={styles.submitBtn}>
              <Save size={20} /> تسجيل وإضافة للمخزن
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 3. واجهة التقارير ---
  if (activeView === 'reports') {
    return (
      <div style={styles.wrapper}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
           <button onClick={() => setActiveView('menu')} style={{border: 'none', background: '#eee', padding: '8px', borderRadius: '50%'}}><ArrowRight size={20} /></button>
           <h3 style={{margin: 0}}>تقرير المشتريات</h3>
        </div>

        {purchaseHistory.length === 0 ? (
          <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>لا توجد عمليات مسجلة حالياً</p>
        ) : (
          purchaseHistory.map(item => (
            <div key={item.id} style={{background: 'white', padding: '15px', borderRadius: '15px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <strong>{item.item}</strong>
                <span style={{color: '#9b59b6'}}>{item.total} ج.م</span>
              </div>
              <div style={{fontSize: '0.8rem', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                <span>الكمية: {item.quantity} {item.unit}</span>
                <span>المورد: {item.supplier || 'غير محدد'}</span>
              </div>
              <div style={{fontSize: '0.7rem', color: '#999', marginTop: '5px', borderTop: '1px inset #eee', paddingTop: '5px'}}>
                التاريخ: {item.date} | السداد: {item.paymentMethod}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return null;
};

export default PurchasesManager;
