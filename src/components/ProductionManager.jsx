import React, { useState } from 'react';
import { Factory, PlayCircle, Box, Layout, Hash, ChevronLeft } from 'lucide-react';

const ProductionManager = ({ categories, onProductionComplete }) => {
  const [production, setProduction] = useState({
    productionLine: '', // اسم الطلبية أو التشغيلة
    categoryName: '',   // القسم المسحوب منه
    amount: ''          // الكمية المستهلكة
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!production.productionLine || !production.categoryName || !production.amount) {
      alert("يرجى إكمال بيانات الكروت لبدء عملية الإنتاج");
      return;
    }

    onProductionComplete({
      productionLine: production.productionLine,
      categoryName: production.categoryName,
      amount: parseFloat(production.amount)
    });

    setProduction({ productionLine: '', categoryName: '', amount: '' });
    alert("تم تسجيل أمر الإنتاج وخصم الكمية من المخزن");
  };

  const styles = {
    wrapper: {
      padding: '15px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      direction: 'rtl',
      fontFamily: "'Tajawal', sans-serif",
      paddingBottom: '120px'
    },
    headerCard: {
      background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
      borderRadius: '20px',
      padding: '20px',
      color: 'white',
      marginBottom: '20px',
      boxShadow: '0 10px 20px rgba(230, 126, 34, 0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    inputCard: {
      background: '#ffffff',
      borderRadius: '18px',
      padding: '18px',
      marginBottom: '15px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9rem',
      color: '#64748b',
      fontWeight: '700'
    },
    input: {
      width: '100%',
      padding: '10px 0',
      fontSize: '1.1rem',
      border: 'none',
      borderBottom: '2px solid #f1f5f9',
      outline: 'none',
      color: '#1e293b',
      backgroundColor: 'transparent',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      backgroundColor: '#f8fafc',
      marginTop: '5px',
      color: '#334155'
    },
    submitArea: {
      marginTop: '25px'
    },
    btnProduction: {
      width: '100%',
      backgroundColor: '#e67e22',
      color: 'white',
      padding: '18px',
      borderRadius: '15px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '900',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 15px rgba(230, 126, 34, 0.3)',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* هيدر الإنتاج الاحترافي */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={{margin: 0, fontSize: '1.3rem'}}>منصة الإنتاج</h2>
          <p style={{margin: 0, fontSize: '0.85rem', opacity: 0.9}}>تحويل المواد الخام إلى منتجات جاهزة</p>
        </div>
        <Factory size={35} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* كارت تعريف التشغيلة */}
        <div style={styles.inputCard}>
          <label style={styles.label}>
            <Layout size={18} color="#e67e22" /> اسم الطلبية / المنتج النهائي
          </label>
          <input 
            style={styles.input}
            placeholder="مثلاً: معمول تمر فخار - 50 كرتونة"
            value={production.productionLine}
            onChange={(e) => setProduction({...production, productionLine: e.target.value})}
          />
        </div>

        {/* كارت اختيار الخام (الرف) */}
        <div style={styles.inputCard}>
          <label style={styles.label}>
            <Box size={18} color="#e67e22" /> السحب من المخزن
          </label>
          <select 
            style={styles.select}
            value={production.categoryName}
            onChange={(e) => setProduction({...production, categoryName: e.target.value})}
          >
            <option value="">اختر المادة المراد سحبها...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name} (المتاح حالياً: {cat.balance})
              </option>
            ))}
          </select>
        </div>

        {/* كارت الكمية المستهلكة */}
        <div style={styles.inputCard}>
          <label style={styles.label}>
            <Hash size={18} color="#e67e22" /> الكمية المراد سحبها
          </label>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input 
              type="number"
              style={{...styles.input, flex: 1}}
              placeholder="0.00"
              value={production.amount}
              onChange={(e) => setProduction({...production, amount: e.target.value})}
            />
            <span style={{fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'bold'}}>وحدة</span>
          </div>
        </div>

        {/* زر التشغيل الكبير */}
        <div style={styles.submitArea}>
          <button type="submit" style={styles.btnProduction}>
            <PlayCircle size={26} />
            تأكيد السحب والإنتاج
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductionManager;
