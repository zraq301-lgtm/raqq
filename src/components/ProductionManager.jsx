import React, { useState } from 'react';
import { Factory, Save, ArrowRight, AlertTriangle, Box, TrendingUp } from 'lucide-react';

const ProductionManager = ({ stock, onSaveProduction, onSaveWaste, onBack, setStock }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'الأولى', // الخيارات: الأولى، الثانية، السهرة، ساعات إضافية
    ingredients: {
      دقيق: 0, سكر: 0, عجوة: 0, سمنة: 0, زبدة: 0, 
      سولار: 0, كهرباء: 0, لبن: 0, كارتون: 0, تغليف: 0
    },
    productionQty: 0, 
    wasteQty: 0,
    expectedCostPerUnit: 0 // التكلفة التقديرية لحساب الانحراف
  });

  const shifts = ['الأولى', 'الثانية', 'السهرة', 'ساعات إضافية'];

  const handleChange = (e, category, field) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    if (category === 'ingredients') {
      setFormData({ ...formData, ingredients: { ...formData.ingredients, [field]: value } });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleProcessProduction = () => {
    let totalActualCost = 0;
    const updatedStock = JSON.parse(JSON.stringify(stock));

    // 1. منطق سحب الخامات وحساب التكلفة الفعلية (FIFO)
    for (const [ingName, requiredQty] of Object.entries(formData.ingredients)) {
      if (requiredQty <= 0) continue;

      const stockItem = updatedStock.find(s => s.name === ingName);
      const totalAvailable = stockItem?.batches?.reduce((sum, b) => sum + b.quantity, 0) || 0;

      if (totalAvailable < requiredQty) {
        alert(`نقص حاد في مادة: ${ingName}! المطلوب: ${requiredQty} والمتوفر: ${totalAvailable}`);
        return;
      }

      let remainingToWithdraw = requiredQty;
      while (remainingToWithdraw > 0) {
        const currentBatch = stockItem.batches[0];
        if (currentBatch.quantity <= remainingToWithdraw) {
          totalActualCost += (currentBatch.quantity * currentBatch.price);
          remainingToWithdraw -= currentBatch.quantity;
          stockItem.batches.shift();
        } else {
          totalActualCost += (remainingToWithdraw * currentBatch.price);
          currentBatch.quantity -= remainingToWithdraw;
          remainingToWithdraw = 0;
        }
      }
      stockItem.balance = stockItem.batches.reduce((sum, b) => sum + b.quantity, 0);
    }

    // 2. حساب مخرجات الإنتاج والانحراف
    const actualUnitCost = formData.productionQty > 0 ? (totalActualCost / formData.productionQty) : 0;
    
    // حساب معدل الانحراف (Deviation Rate)
    // الانحراف = ((التكلفة الفعلية - التكلفة التقديرية) / التكلفة التقديرية) * 100
    let deviationRate = 0;
    if (formData.expectedCostPerUnit > 0) {
      deviationRate = ((actualUnitCost - formData.expectedCostPerUnit) / formData.expectedCostPerUnit) * 100;
    }

    // 3. تحديث المنتج النهائي في المخزن
    const finalProductName = "معمول جاهز";
    let productItem = updatedStock.find(s => s.name === finalProductName);
    const newProductBatch = {
      purchaseDate: formData.date,
      quantity: formData.productionQty,
      price: actualUnitCost
    };

    if (productItem) {
      if (!productItem.batches) productItem.batches = [];
      productItem.batches.push(newProductBatch);
      productItem.balance = (productItem.balance || 0) + formData.productionQty;
    } else {
      updatedStock.push({
        id: Date.now(),
        name: finalProductName,
        balance: formData.productionQty,
        unit: 'كرتونة',
        batches: [newProductBatch]
      });
    }

    // 4. تسجيل الهالك
    if (formData.wasteQty > 0) {
      onSaveWaste({
        id: Date.now(),
        date: formData.date,
        item: `هالك إنتاج - وردية ${formData.shift}`,
        quantity: formData.wasteQty,
        costAtLoss: (actualUnitCost * formData.wasteQty).toFixed(2),
        reason: "هالك تشغيل"
      });
    }

    // 5. الحفظ النهائي
    setStock(updatedStock);
    onSaveProduction({
      ...formData,
      totalActualCost: totalActualCost.toFixed(2),
      actualUnitCost: actualUnitCost.toFixed(2),
      deviationRate: deviationRate.toFixed(2)
    });

    alert(`تم بنجاح! التكلفة الفعلية: ${totalActualCost.toFixed(2)} | الانحراف: ${deviationRate.toFixed(2)}%`);
    onBack();
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Tajawal', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {/* الرأس */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Factory size={35} color="#d35400" />
          <h2 style={{ margin: 0, color: '#2c3e50' }}>سجل تشغيل الإنتاج والورديات</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <input type="date" value={formData.date} onChange={(e) => handleChange(e, 'info', 'date')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <select value={formData.shift} onChange={(e) => handleChange(e, 'info', 'shift')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
              {shifts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr', gap: '20px' }}>
        {/* جدول المكونات (كما في الصورة) */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1c40f', paddingBottom: '10px', color: '#f39c12' }}>خامات التشغيل (المسحوبة)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '20px' }}>
            {Object.keys(formData.ingredients).map(ing => (
              <div key={ing} style={{ background: '#fcfcfc', padding: '10px', borderRadius: '10px', border: '1px solid #eee' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>{ing}</label>
                <input 
                  type="number" 
                  placeholder="0"
                  onChange={(e) => handleChange(e, 'ingredients', ing)}
                  style={{ width: '100%', border: 'none', background: 'transparent', borderBottom: '1px solid #ccc', textAlign: 'center' }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* النتائج والمحاسبة */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#2c3e50', color: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#f1c40f', marginBottom: '20px' }}>مخرجات الإنتاج والتكلفة</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.9rem' }}>حجم الإنتاج (كرتونة):</label>
              <input type="number" onChange={(e) => handleChange(e, 'info', 'productionQty')} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '5px', fontSize: '1.2rem', fontWeight: 'bold' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.9rem' }}>كمية الهالك:</label>
              <input type="number" onChange={(e) => handleChange(e, 'info', 'wasteQty')} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '5px', color: '#e74c3c' }} />
            </div>

            <div style={{ marginBottom: '20px', borderTop: '1px solid #444', paddingTop: '15px' }}>
              <label style={{ fontSize: '0.8rem', color: '#bdc3c7' }}>التكلفة التقديرية للوحدة (لمقارنة الانحراف):</label>
              <input type="number" onChange={(e) => handleChange(e, 'info', 'expectedCostPerUnit')} style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#34495e', border: 'none', color: '#fff' }} />
            </div>

            <button 
              onClick={handleProcessProduction}
              style={{ width: '100%', padding: '15px', background: '#27ae60', border: 'none', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <Save /> تنفيذ وترحيل السجل
            </button>
          </div>

          <div style={{ background: '#fff', padding: '15px', borderRadius: '15px', borderLeft: '5px solid #f39c12' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f39c12' }}>
              <TrendingUp size={20} />
              <strong style={{ fontSize: '0.9rem' }}>معادلة معدل الانحراف:</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#7f8c8d', marginTop: '5px' }}>
              يقيس النظام الفارق بين ما استهلكته فعلياً وما كان مفترض استهلاكه. النسبة الموجبة تعني زيادة في الهالك أو سوء استخدام للخامات.
            </p>
          </div>
        </div>
      </div>
      
      <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 20px', background: '#95a5a6', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>
        عودة للرئيسية
      </button>
    </div>
  );
};

export default ProductionManager;
