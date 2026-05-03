import React, { useState } from 'react';
import { ShoppingCart, PlusCircle, Package, Truck, Calendar, Hash, DollarSign, ArrowRight, Save } from 'lucide-react';

const PurchasesManager = ({ onPurchaseComplete, onBack }) => {
  const [activeForm, setActiveForm] = useState(null); // 'raw', 'packing', 'tools'
  const [formData, setFormData] = useState({
    item: '', unit: '', quantity: '', price: '', total: '', supplier: '', date: new Date().toISOString().split('T')[0], note: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    onPurchaseComplete({ ...formData, type: activeForm, id: Date.now() });
    alert("تم حفظ بيانات الشراء بنجاح");
    setActiveForm(null);
    setFormData({ item: '', unit: '', quantity: '', price: '', total: '', supplier: '', date: new Date().toISOString().split('T')[0], note: '' });
  };

  const styles = {
    wrapper: { padding: '15px', direction: 'rtl', fontFamily: 'Tajawal', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '15px', marginTop: '20px' },
    actionCard: { 
      background: 'white', padding: '30px 20px', borderRadius: '20px', textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderBottom: '5px solid #9b59b6', cursor: 'pointer'
    },
    formCard: { background: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#444', marginBottom: '8px', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' },
    submitBtn: { width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#9b59b6', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }
  };

  // واجهة الأزرار الثلاثة الرئيسية (الشبكة)
  if (!activeForm) {
    return (
      <div style={styles.wrapper}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
           <h2 style={{color: '#2c3e50'}}>قسم المشتريات</h2>
           <p style={{color: '#7f8c8d'}}>اختر نوع المشتريات لإدخال البيانات</p>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.actionCard} onClick={() => setActiveForm('raw')}>
            <Package size={40} color="#9b59b6" />
            <h3 style={{marginTop: '15px'}}>خامات الإنتاج</h3>
            <p style={{fontSize: '0.8rem', color: '#888'}}>دقيق، سمن، عجوة...</p>
          </div>

          <div style={styles.actionCard} onClick={() => setActiveForm('packing')}>
            <ShoppingCart size={40} color="#9b59b6" />
            <h3 style={{marginTop: '15px'}}>مواد التغليف</h3>
            <p style={{fontSize: '0.8rem', color: '#888'}}>كراتين، أكياس، ملصقات...</p>
          </div>

          <div style={styles.actionCard} onClick={() => setActiveForm('tools')}>
            <Truck size={40} color="#9b59b6" />
            <h3 style={{marginTop: '15px'}}>أدوات وصيانة</h3>
            <p style={{fontSize: '0.8rem', color: '#888'}}>أدوات مصنع، قطع غيار...</p>
          </div>
        </div>

        <button onClick={onBack} style={{marginTop: '30px', width: '100%', background: 'none', border: 'none', color: '#9b59b6', fontWeight: 'bold'}}>
          <ArrowRight size={18} /> العودة للرئيسية
        </button>
      </div>
    );
  }

  // واجهة الكارت (Form) بناءً على ما اخترته من الشبكة
  return (
    <div style={styles.wrapper}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
        <button onClick={() => setActiveForm(null)} style={{border: 'none', background: '#eee', padding: '8px', borderRadius: '50%'}}><ArrowRight size={20} /></button>
        <h3 style={{margin: 0}}>إدخال بيانات {activeForm === 'raw' ? 'الخامات' : activeForm === 'packing' ? 'التغليف' : 'الأدوات'}</h3>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={handleSave}>
          <div style={styles.inputGroup}>
            <label style={styles.label}><Package size={16} /> اسم الصنف</label>
            <input style={styles.input} placeholder="مثال: دقيق فاخر" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>الوحدة</label>
              <input style={styles.input} placeholder="كيلو/كرتونة" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}><Hash size={16} /> الكمية</label>
              <input type="number" style={styles.input} placeholder="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
            <div style={styles.inputGroup}>
              <label style={styles.label}><DollarSign size={16} /> سعر الوحدة</label>
              <input type="number" style={styles.input} placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>الإجمالي</label>
              <input style={{...styles.input, backgroundColor: '#f0f0f0'}} value={formData.quantity * formData.price} readOnly />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}><Truck size={16} /> المورد</label>
            <input style={styles.input} placeholder="اسم المورد" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}><Calendar size={16} /> التاريخ</label>
            <input type="date" style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>

          <button type="submit" style={styles.submitBtn}>
            <Save size={20} /> حفظ في المخزن
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchasesManager;
