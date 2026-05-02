import React, { useState } from 'react';
import { ShoppingCart, PlusCircle, Tag, Hash, Layout } from 'lucide-react';

const PurchasesManager = ({ onPurchaseComplete }) => {
  const [purchase, setPurchase] = useState({
    itemName: '',
    quantity: '',
    category: '', 
    price: ''
  });

  const handleAddPurchase = (e) => {
    e.preventDefault();
    
    if (!purchase.itemName || !purchase.quantity || !purchase.category || !purchase.price) {
      alert("يرجى ملء كافة البيانات بما في ذلك سعر الوحدة");
      return;
    }

    // إرسال البيانات (تأكدنا هنا من إضافة السعر ليتم استقباله في App.jsx)
    onPurchaseComplete({
      name: purchase.category.trim(),
      amount: parseInt(purchase.quantity),
      price: parseFloat(purchase.price), // إضافة السعر هنا
      details: purchase.itemName
    });

    setPurchase({ itemName: '', quantity: '', category: '', price: '' });
    alert("تمت الإضافة للمشتريات وتحديث المخزن بنجاح!");
  };

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      direction: 'rtl',
      fontFamily: "'Tajawal', sans-serif",
      boxSizing: 'border-box'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#9b59b6',
      marginBottom: '20px',
      fontSize: '1.3rem',
      fontWeight: 'bold'
    },
    form: {
      display: 'grid',
      gap: '15px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: { 
      fontWeight: 'bold', 
      color: '#444', 
      fontSize: '0.95rem',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    input: {
      padding: '14px',
      borderRadius: '12px',
      border: '2px solid #f0f0f0',
      fontSize: '1rem',
      outline: 'none',
      backgroundColor: '#fdfdfd',
      transition: 'border-color 0.3s'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
    },
    submitBtn: {
      backgroundColor: '#9b59b6',
      color: 'white',
      padding: '16px',
      borderRadius: '15px',
      border: 'none',
      fontWeight: '900',
      fontSize: '1.1rem',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      marginTop: '10px',
      boxShadow: '0 5px 15px rgba(155, 89, 182, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <ShoppingCart size={28} />
        <h2>إضافة مشتريات للمخزن</h2>
      </div>

      <form style={styles.form} onSubmit={handleAddPurchase}>
        {/* الفئة المخزنية - الرف */}
        <div style={styles.inputGroup}>
          <label style={styles.label}><Layout size={18} /> القسم / الرف</label>
          <input 
            style={styles.input}
            placeholder="اسم القسم (مثلاً: بولي إيثيلين)"
            value={purchase.category}
            onChange={(e) => setPurchase({...purchase, category: e.target.value})}
          />
        </div>

        {/* اسم المنتج التفصيلي */}
        <div style={styles.inputGroup}>
          <label style={styles.label}><Tag size={18} /> تفاصيل البيان</label>
          <input 
            style={styles.input}
            placeholder="وصف الشروة (مثلاً: خشب نخب أول)"
            value={purchase.itemName}
            onChange={(e) => setPurchase({...purchase, itemName: e.target.value})}
          />
        </div>

        {/* الكمية والسعر في صف واحد واضح */}
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}><Hash size={18} /> الكمية</label>
            <input 
              type="number"
              style={{...styles.input, borderColor: '#e0e0e0'}}
              placeholder="0"
              value={purchase.quantity}
              onChange={(e) => setPurchase({...purchase, quantity: e.target.value})}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: '#27ae60'}}><Tag size={18} /> سعر الوحدة</label>
            <input 
              type="number"
              step="0.01"
              style={{...styles.input, borderColor: '#27ae6040'}}
              placeholder="0.00"
              value={purchase.price}
              onChange={(e) => setPurchase({...purchase, price: e.target.value})}
            />
          </div>
        </div>

        <button type="submit" style={styles.submitBtn}>
          <PlusCircle size={24} />
          تأكيد الإضافة للمخزن
        </button>
      </form>
    </div>
  );
};

export default PurchasesManager;
