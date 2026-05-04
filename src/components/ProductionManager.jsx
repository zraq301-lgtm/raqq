import React, { useState } from 'react';
import { Factory, Save, ArrowRight, AlertTriangle, Box } from 'lucide-react';

const ProductionManager = ({ stock, onSaveProduction, onSaveWaste, onBack, setStock }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'الأولى',
    ingredients: {
      دقيق: 0, سكر: 0, عجوة: 0, سمن: 0, زبدة: 0, لبن: 0, كرتون: 0, تغليف: 0
    },
    productionQty: 0, // حجم الإنتاج (كرتونة/وحدة)
    wasteQty: 0       // التالف
  });

  const handleChange = (e, category, field) => {
    const value = parseFloat(e.target.value) || 0;
    if (category === 'ingredients') {
      setFormData({ ...formData, ingredients: { ...formData.ingredients, [field]: value } });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleProcessProduction = () => {
    // 1. التحقق من توفر الكميات في المخزن قبل البدء
    for (const [item, qty] of Object.entries(formData.ingredients)) {
      const stockItem = stock.find(s => s.name === item);
      if (!stockItem || stockItem.balance < qty) {
        alert(`نقص في كمية ${item}! المتوفر: ${stockItem?.balance || 0}`);
        return;
      }
    }

    // 2. خصم المكونات من المخزن
    const updatedStock = stock.map(s => {
      if (formData.ingredients[s.name]) {
        return { ...s, balance: s.balance - formData.ingredients[s.name] };
      }
      return s;
    });

    // 3. إضافة المنتج النهائي (المعمول) للمخزن
    const finalProductName = "معمول جاهز";
    const productIndex = updatedStock.findIndex(s => s.name === finalProductName);
    if (productIndex > -1) {
      updatedStock[productIndex].balance += formData.productionQty;
    } else {
      updatedStock.push({
        id: Date.now(),
        name: finalProductName,
        balance: formData.productionQty,
        unit: 'كرتونة',
        price: 0
      });
    }

    // 4. تسجيل الهالك في قسم الهالك (Waste)
    if (formData.wasteQty > 0) {
      onSaveWaste({
        id: Date.now(),
        date: formData.date,
        item: "هالك إنتاج - معمول",
        quantity: formData.wasteQty,
        reason: "تالف أثناء التصنيع"
      });
    }

    // تنفيذ التحديثات النهائية
    setStock(updatedStock);
    onSaveProduction(formData);
    alert("تم تسجيل الإنتاج، تحديث المخزن، وترحيل الهالك بنجاح!");
    onBack();
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Tajawal' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Factory size={32} color="#e67e22" />
        <h2 style={{ color: '#2c3e50' }}>سجل تشغيل الإنتاج اليومي</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* قسم المكونات (حسب الصورة) */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #eee', pb: '10px' }}>المكونات المستخدمة</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
            {Object.keys(formData.ingredients).map(ing => (
              <div key={ing}>
                <label style={{ fontSize: '0.9rem', display: 'block' }}>{ing}:</label>
                <input 
                  type="number" 
                  onChange={(e) => handleChange(e, 'ingredients', ing)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* قسم مخرجات الإنتاج */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #eee', pb: '10px' }}>مخرجات الوردية</h3>
          <div style={{ marginTop: '15px' }}>
            <label>حجم الإنتاج التام (كرتونة):</label>
            <input 
              type="number" 
              onChange={(e) => handleChange(e, 'output', 'productionQty')}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #2ecc71', marginBottom: '15px' }}
            />
            
            <label style={{ color: '#e74c3c' }}>الكمية التالفة (الهالك):</label>
            <input 
              type="number" 
              onChange={(e) => handleChange(e, 'output', 'wasteQty')}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e74c3c' }}
            />
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleProcessProduction}
              style={{ flex: 1, padding: '15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={20} /> ترحيل الإنتاج والمخزن
            </button>
            <button 
              onClick={onBack}
              style={{ padding: '15px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionManager;
