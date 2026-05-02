import React, { useState } from 'react';
import { Factory, PlayCircle, AlertTriangle, Box } from 'lucide-react';

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
    container: {
      padding: '25px',
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      direction: 'rtl',
      fontFamily: "'Tajawal', sans-serif"
    },
    title: { display: 'flex', alignItems: 'center', gap: '10px', color: '#e67e22', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '15px', fontSize: '1rem' },
    btn: { width: '100%', backgroundColor: '#e67e22', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Factory size={28} />
        <h2>أمر تشغيل وإنتاج</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <label>اسم خط الإنتاج أو الطلبية</label>
        <input 
          style={styles.input}
          placeholder="مثلاً: خط إنتاج الكراسي - طلبية رقم 101"
          value={production.productionLine}
          onChange={(e) => setProduction({...production, productionLine: e.target.value})}
        />

        <label>اسحب من قسم (الرف)</label>
        <select 
          style={styles.input}
          value={production.categoryName}
          onChange={(e) => setProduction({...production, categoryName: e.target.value})}
        >
          <option value="">اختر القسم للسحب منه...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name} (المتوفر: {cat.balance})</option>
          ))}
        </select>

        <label>الكمية المستهلكة</label>
        <input 
          type="number"
          style={styles.input}
          placeholder="0.00"
          value={production.amount}
          onChange={(e) => setProduction({...production, amount: e.target.value})}
        />

        <button type="submit" style={styles.btn}>
          <PlayCircle size={22} />
          تأكيد السحب وبدء الإنتاج
        </button>
      </form>
    </div>
  );
};

export default ProductionManager;
