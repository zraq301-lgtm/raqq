import React, { useState } from 'react';
import { ShoppingCart, PlusCircle, PackageCheck, Tag } from 'lucide-react';

const PurchasesManager = ({ onPurchaseComplete }) => {
  // حالة لإدارة مدخلات عملية الشراء الجديدة
  const [purchase, setPurchase] = useState({
    itemName: '',
    quantity: '',
    category: 'خشب زان', // الفئة الافتراضية للربط
    price: ''
  });

  // قائمة الفئات المتاحة (يجب أن تطابق الأسماء في قسم المخزن)
  const categories = ["خشب زان", "حديد تسليح", "أسمنت بورتلاندي"];

  const handleAddPurchase = (e) => {
    e.preventDefault();
    
    if (!purchase.itemName || !purchase.quantity) {
      alert("يرجى ملء البيانات الأساسية");
      return;
    }

    // إرسال البيانات للقسم الرئيسي لتحديث المخزن فوراً
    onPurchaseComplete({
      name: purchase.category, // نستخدم الفئة للربط مع المخزن
      amount: parseInt(purchase.quantity),
      details: purchase.itemName
    });

    // تصفير الحقول بعد الإضافة
    setPurchase({ itemName: '', quantity: '', category: 'خشب زان', price: '' });
    alert("تمت الإضافة للمشتريات وتحديث المخزن بنجاح!");
  };

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      border: '1px solid #9b59b620',
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
      fontSize: '1.4rem'
    },
    form: {
      display: 'grid',
      gap: '15px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    label: { fontWeight: 'bold', color: '#555', fontSize: '0.9rem' },
    input: {
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border 0.3s'
    },
    select: {
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      fontSize: '1rem'
    },
    submitBtn: {
      backgroundColor: '#9b59b6',
      color: 'white',
      padding: '15px',
      borderRadius: '12px',
      border: 'none',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <ShoppingCart size={28} />
        <h2>إضافة مشتريات جديدة</h2>
      </div>

      <form style={styles.form} onSubmit={handleAddPurchase}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>اسم المنتج/المادة</label>
          <input 
            style={styles.input}
            placeholder="مثلاً: خشب سويد نخب أول"
            value={purchase.itemName}
            onChange={(e) => setPurchase({...purchase, itemName: e.target.value})}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>الفئة المخزنية (لربط الكمية)</label>
          <select 
            style={styles.select}
            value={purchase.category}
            onChange={(e) => setPurchase({...purchase, category: e.target.value})}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div style={{display: 'flex', gap: '10px'}}>
          <div style={{...styles.inputGroup, flex: 1}}>
            <label style={styles.label}>الكمية</label>
            <input 
              type="number"
              style={styles.input}
              placeholder="0"
              value={purchase.quantity}
              onChange={(e) => setPurchase({...purchase, quantity: e.target.value})}
            />
          </div>
          <div style={{...styles.inputGroup, flex: 1}}>
            <label style={styles.label}>السعر الإجمالي</label>
            <input 
              type="number"
              style={styles.input}
              placeholder="0.00"
              value={purchase.price}
              onChange={(e) => setPurchase({...purchase, price: e.target.value})}
            />
          </div>
        </div>

        <button type="submit" style={styles.submitBtn}>
          <PlusCircle size={22} />
          تأكيد الشراء وإضافة للمخزن
        </button>
      </form>
    </div>
  );
};

export default PurchasesManager;
