import React, { useState, useEffect } from 'react';
import { Plus, Minus, Package, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const InventoryManager = () => {
  // 1. حافظة المواد (State) - تبدأ فارغة لتستقبل البيانات
  const [materials, setMaterials] = useState([
    { id: 1, name: "خشب زان", balance: 120, category: "مشتريات" },
    { id: 2, name: "حديد تسليح", balance: 45, category: "مشتريات" }
  ]);

  // حالة لتخزين القيمة التي يتم إدخالها في الحاسبة لكل مادة
  const [amounts, setAmounts] = useState({});

  // 2. محاكاة استقبال منتجات جديدة من قسم المشتريات (يمكن ربطها بـ API لاحقاً)
  const fetchNewPurchases = () => {
    // مثال: إضافة مادة جديدة قادمة من قسم المشتريات
    const newMaterial = { id: Date.now(), name: "مادة جديدة من المشتريات", balance: 0, category: "مشتريات" };
    setMaterials(prev => [...prev, newMaterial]);
  };

  // 3. وظائف الحاسبة (الرفع والنقص)
  const handleUpdateBalance = (id, type) => {
    const amount = parseInt(amounts[id] || 0);
    if (amount <= 0) return alert("يرجى إدخال كمية صحيحة");

    setMaterials(prev => prev.map(item => {
      if (item.id === id) {
        const newBalance = type === 'add' ? item.balance + amount : item.balance - amount;
        return { ...item, balance: Math.max(0, newBalance) };
      }
      return item;
    }));
    
    // تصفير الحقل بعد العملية
    setAmounts({ ...amounts, [id]: "" });
  };

  const handleInputChange = (id, value) => {
    setAmounts({ ...amounts, [id]: value });
  };

  // التنسيقات الموسعة لتناسب حجم الشاشة بالكامل
  const styles = {
    wrapper: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#fff5f7',
      padding: '20px',
      boxSizing: 'border-box',
      direction: 'rtl',
      fontFamily: "'Tajawal', sans-serif",
    },
    container: {
      width: '100%',
      maxWidth: '1200px', // إلغاء الحجم الصغير وتوسيع الحاوية
      margin: '0 auto',
      display: 'grid',
      gap: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4d7d' },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
      border: '1px solid #ff4d7d20',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    balanceText: {
      fontSize: '1.8rem',
      fontWeight: '800',
      color: '#ff4d7d',
    },
    calculator: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      padding: '15px',
      borderRadius: '15px',
    },
    input: {
      flex: 1,
      padding: '12px',
      borderRadius: '10px',
      border: '2px solid #ddd',
      fontSize: '1.1rem',
      textAlign: 'center',
      outline: 'none',
    },
    btnAction: {
      padding: '12px 20px',
      borderRadius: '10px',
      border: 'none',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>إدارة المواد الخام (المخزن)</h2>
          <button 
            onClick={fetchNewPurchases}
            style={{...styles.btnAction, backgroundColor: '#9b59b6'}}
          >
            استقبال من المشتريات +
          </button>
        </div>

        {materials.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.infoRow}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.name}</h3>
                <small style={{ color: '#888' }}>القسم: {item.category}</small>
              </div>
              <div style={styles.balanceText}>
                {item.balance} <span style={{fontSize: '0.9rem'}}>وحدة</span>
              </div>
            </div>

            {/* الحاسبة الداخلية لكل مادة */}
            <div style={styles.calculator}>
              <input 
                type="number" 
                placeholder="الكمية..." 
                style={styles.input}
                value={amounts[item.id] || ""}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
              />
              <button 
                onClick={() => handleUpdateBalance(item.id, 'add')}
                style={{...styles.btnAction, backgroundColor: '#22c55e'}}
              >
                <ArrowUpCircle size={20} /> توريد
              </button>
              <button 
                onClick={() => handleUpdateBalance(item.id, 'sub')}
                style={{...styles.btnAction, backgroundColor: '#ef4444'}}
              >
                <ArrowDownCircle size={20} /> سحب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryManager;
