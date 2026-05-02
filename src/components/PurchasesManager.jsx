import React, { useState } from 'react';
import { ShoppingCart, PlusCircle, Tag, Hash, Layout, BaggageClaim, DollarSign } from 'lucide-react';

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
      alert("يرجى تعبئة كافة بيانات الكرت للمتابعة");
      return;
    }

    onPurchaseComplete({
      name: purchase.category.trim(),
      amount: parseInt(purchase.quantity),
      price: parseFloat(purchase.price),
      details: purchase.itemName
    });

    setPurchase({ itemName: '', quantity: '', category: '', price: '' });
  };

  const styles = {
    wrapper: {
      padding: '15px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      direction: 'rtl',
      fontFamily: "'Tajawal', sans-serif"
    },
    headerCard: {
      background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
      borderRadius: '20px',
      padding: '20px',
      color: 'white',
      marginBottom: '20px',
      boxShadow: '0 10px 20px rgba(155, 89, 182, 0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    inputCard: {
      background: '#ffffff',
      borderRadius: '18px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9rem',
      color: '#64748b',
      marginBottom: '10px',
      fontWeight: '600'
    },
    input: {
      width: '100%',
      padding: '12px 0',
      fontSize: '1.1rem',
      border: 'none',
      borderBottom: '2px solid #f1f5f9',
      outline: 'none',
      color: '#1e293b',
      backgroundColor: 'transparent',
      transition: 'border-color 0.3s'
    },
    gridRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
    },
    submitArea: {
      marginTop: '20px',
      paddingBottom: '100px'
    },
    btnMain: {
      width: '100%',
      backgroundColor: '#9b59b6',
      color: 'white',
      padding: '18px',
      borderRadius: '15px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 8px 15px rgba(155, 89, 182, 0.3)'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* كارت العنوان العلوي */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={{margin: 0, fontSize: '1.2rem'}}>توريد مواد خام</h2>
          <p style={{margin: 0, fontSize: '0.8rem', opacity: 0.8}}>إضافة مشتريات جديدة للمصنع</p>
        </div>
        <ShoppingCart size={32} />
      </div>

      <form onSubmit={handleAddPurchase}>
        {/* كارت القسم */}
        <div style={styles.inputCard}>
          <label style={styles.label}><Layout size={18} /> القسم المخزني</label>
          <input 
            style={styles.input}
            placeholder="مثلاً: قسم العجوة"
            value={purchase.category}
            onChange={(e) => setPurchase({...purchase, category: e.target.value})}
          />
        </div>

        {/* كارت البيان التفصيلي */}
        <div style={styles.inputCard}>
          <label style={styles.label}><BaggageClaim size={18} /> تفاصيل المادة</label>
          <input 
            style={styles.input}
            placeholder="مثلاً: عجوة المدينة نخب أول"
            value={purchase.itemName}
            onChange={(e) => setPurchase({...purchase, itemName: e.target.value})}
          />
        </div>

        {/* كروت الكمية والسعر (جنب بعض) */}
        <div style={styles.gridRow}>
          <div style={styles.inputCard}>
            <label style={styles.label}><Hash size={18} /> الكمية</label>
            <input 
              type="number"
              style={styles.input}
              placeholder="0"
              value={purchase.quantity}
              onChange={(e) => setPurchase({...purchase, quantity: e.target.value})}
            />
          </div>
          <div style={{...styles.inputCard, borderColor: '#9b59b640'}}>
            <label style={{...styles.label, color: '#9b59b6'}}><DollarSign size={18} /> السعر</label>
            <input 
              type="number"
              step="0.01"
              style={styles.input}
              placeholder="0.00"
              value={purchase.price}
              onChange={(e) => setPurchase({...purchase, price: e.target.value})}
            />
          </div>
        </div>

        <div style={styles.submitArea}>
          <button type="submit" style={styles.btnMain}>
            <PlusCircle size={24} />
            تأكيد وإضافة للمخزن
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchasesManager;
