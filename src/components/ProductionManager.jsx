import React, { useState } from 'react';
import { Factory, PlayCircle, Box, Layout, Hash } from 'lucide-react';

const ProductionManager = ({ categories, onProductionComplete }) => {
  const [production, setProduction] = useState({
    productionLine: '',
    categoryName: '',
    amount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!production.productionLine || !production.categoryName || !production.amount) {
      alert("يرجى إكمال بيانات أمر الإنتاج");
      return;
    }

    onProductionComplete({
      productionLine: production.productionLine,
      categoryName: production.categoryName,
      amount: parseFloat(production.amount)
    });

    setProduction({ productionLine: '', categoryName: '', amount: '' });
  };

  const styles = {
    // تم إلغاء الـ wrapper المضغوط ليعود الحجم لطبيعته
    container: {
      padding: '20px',
      direction: 'rtl',
      fontFamily: "'Tajawal', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    headerCard: {
      background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
      borderRadius: '20px',
      padding: '25px',
      color: 'white',
      boxShadow: '0 10px 20px rgba(230, 126, 34, 0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    // كروت واسعة لا تسبب شعوراً بالتصغير
    inputCard: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      border: '1px solid #eee',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '1rem', // تكبير الخط للوضع الطبيعي
      color: '#444',
      fontWeight: 'bold',
      marginBottom: '12px'
    },
    input: {
      width: '100%',
      padding: '15px',
      fontSize: '1.1rem',
      borderRadius: '12px',
      border: '2px solid #f1f5f9',
      outline: 'none',
      boxSizing: 'border-box'
    },
    submitBtn: {
      width: '100%',
      backgroundColor: '#e67e22',
      color: 'white',
      padding: '20px',
      borderRadius: '15px',
      border: 'none',
      fontSize: '1.2rem',
      fontWeight: '900',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      {/* كارت الرأس */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={{margin: 0, fontSize: '1.5rem'}}>أمر الإنتاج</h2>
          <p style={{margin: 0, opacity: 0.9}}>سحب خامات المعمول</p>
        </div>
        <Factory size={40} />
      </div>

      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        {/* كارت التشغيلة */}
        <div style={styles.inputCard}>
          <label style={styles.label}><Layout size={22} color="#e67e22" /> اسم المنتج النهائي</label>
          <input 
            style={styles.input}
            placeholder="مثلاً: معمول تمر (طلبية الصباح)"
            value={production.productionLine}
            onChange={(e) => setProduction({...production, productionLine: e.target.value})}
          />
        </div>

        {/* كارت القسم */}
        <div style={styles.inputCard}>
          <label style={styles.label}><Box size={22} color="#e67e22" /> السحب من القسم</label>
          <select 
            style={styles.input}
            value={production.categoryName}
            onChange={(e) => setProduction({...production, categoryName: e.target.value})}
          >
            <option value="">اختر القسم للسحب منه...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name} (المتوفر: {cat.balance})
              </option>
            ))}
          </select>
        </div>

        {/* كارت الكمية */}
        <div style={styles.inputCard}>
          <label style={styles.label}><Hash size={22} color="#e67e22" /> الكمية المستهلكة</label>
          <input 
            type="number"
            style={styles.input}
            placeholder="0.00"
            value={production.amount}
            onChange={(e) => setProduction({...production, amount: e.target.value})}
          />
        </div>

        <button type="submit" style={styles.submitBtn}>
          <PlayCircle size={28} />
          تأكيد الإنتاج الآن
        </button>
      </form>
    </div>
  );
};

export default ProductionManager;
