import React, { useState } from 'react';
import { ShoppingCart, PlusCircle, PackageCheck, Tag } from 'lucide-react';

const PurchasesManager = ({ onPurchaseComplete }) => {
  // حالة لإدارة مدخلات عملية الشراء الجديدة
  const [purchase, setPurchase] = useState({
    itemName: '',
    quantity: '',
    category: '', // أصبحت فارغة لتسمح بالكتابة الحرة
    price: ''
  });

  const handleAddPurchase = (e) => {
    e.preventDefault();
    
    // التحقق من ملء البيانات بما في ذلك الفئة
    if (!purchase.itemName || !purchase.quantity || !purchase.category) {
      alert("يرجى ملء كافة البيانات (اسم المنتج، الفئة، والكمية)");
      return;
    }

    // إرسال البيانات للقسم الرئيسي
    // الدالة في App.jsx ستقارن اسم "category" مع المخزن وتضيفه تلقائياً
    onPurchaseComplete({
      name: purchase.category.trim(), // إزالة المسافات الزائدة
      amount: parseInt(purchase.quantity),
      details: purchase.itemName
    });

    // تصفير الحقول بعد الإضافة
    setPurchase({ itemName: '', quantity: '', category: '', price: '' });
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
      transition: 'border 0.3s',
      backgroundColor: '#fff'
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
        {/* اسم المادة التفصيلي */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>اسم المنتج/المادة</label>
          <input 
            style={styles.input}
            placeholder="مثلاً: خشب سويد نخب أول"
            value={purchase.itemName}
            onChange={(e) => setPurchase({...purchase, itemName: e.target.value})}
          />
        </div>

        {/* الفئة المخزنية - تحولت إلى مدخل نصي حر */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>الفئة المخزنية (الرف المراد الإضافة إليه)</label>
          <input 
            style={styles.input}
            placeholder="اكتب اسم القسم (مثال: خشب زان، مواد خام...)"
            value={purchase.category}
            onChange={(e) => setPurchase({...purchase, category: e.target.value})}
          />
          <small style={{color: '#888', fontSize: '0.75rem'}}>
            * إذا كتبت اسماً جديداً، سيتم إنشاء رف جديد له في المخزن تلقائياً.
          </small>
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
          تأكيد الشراء والترسيم بالمخزن
        </button>
      </form>
    </div>
  );
};

export default PurchasesManager;
