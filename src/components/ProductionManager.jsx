import React, { useState } from 'react';
import { Factory, Save, ArrowRight, AlertTriangle, Box, TrendingUp, Info } from 'lucide-react';

const ProductionManager = ({ stock, onSaveProduction, onSaveWaste, onBack, setStock }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'الأولى',
    ingredients: {
      دقيق: 0, سكر: 0, عجوة: 0, سمنة: 0, زبدة: 0, 
      سولار: 0, كهرباء: 0, لبن: 0, كارتون: 0, تغليف: 0
    },
    productionQty: 0, 
    wasteQty: 0,
    expectedCostPerUnit: 0 
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

      // البحث عن الصنف مع تجاهل المسافات الزائدة
      const stockItem = updatedStock.find(s => s.name.trim() === ingName.trim());
      
      // حساب إجمالي المتوفر (من الحقل المباشر أو الشحنات)
      const totalAvailable = stockItem ? (stockItem.balance || 0) : 0;

      if (!stockItem || totalAvailable < requiredQty) {
        alert(`خطأ في مادة: ${ingName}\nالمطلوب: ${requiredQty}\nالمتوفر في المخزن حالياً: ${totalAvailable}`);
        return;
      }

      let remainingToWithdraw = requiredQty;

      // إذا كانت المادة موجودة ولكن لا تملك مصفوفة شحنات (لحماية الكود)
      if (!stockItem.batches || stockItem.batches.length === 0) {
        totalActualCost += (requiredQty * (stockItem.price || 0));
        stockItem.balance -= requiredQty;
      } else {
        // سحب FIFO من الشحنات
        while (remainingToWithdraw > 0 && stockItem.batches.length > 0) {
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
        // تحديث الرصيد الإجمالي بناءً على المتبقي في الشحنات
        stockItem.balance = stockItem.batches.reduce((sum, b) => sum + b.quantity, 0);
      }
    }

    // 2. حساب المخرجات
    const actualUnitCost = formData.productionQty > 0 ? (totalActualCost / formData.productionQty) : 0;
    let deviationRate = 0;
    if (formData.expectedCostPerUnit > 0) {
      deviationRate = ((actualUnitCost - formData.expectedCostPerUnit) / formData.expectedCostPerUnit) * 100;
    }

    // 3. تحديث المنتج النهائي
    const finalProductName = "معمول جاهز";
    let productItem = updatedStock.find(s => s.name.trim() === finalProductName);
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
        batches: [newProductBatch],
        price: actualUnitCost
      });
    }

    // 4. ترحيل البيانات
    setStock(updatedStock);
    onSaveProduction({
      ...formData,
      totalActualCost: totalActualCost.toFixed(2),
      actualUnitCost: actualUnitCost.toFixed(2),
      deviationRate: deviationRate.toFixed(2)
    });

    if (formData.wasteQty > 0) {
      onSaveWaste({
        id: Date.now(),
        date: formData.date,
        item: `هالك إنتاج - ${formData.shift}`,
        quantity: formData.wasteQty,
        costAtLoss: (actualUnitCost * formData.wasteQty).toFixed(2),
        reason: "هالك تشغيل"
      });
    }

    alert(`تم الترحيل بنجاح!\nالتكلفة الفعلية: ${totalActualCost.toFixed(2)} ج.م`);
    onBack();
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Tajawal', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Factory size={35} color="#d35400" />
          <h2 style={{ margin: 0, color: '#2c3e50' }}>سجل تشغيل الإنتاج</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <input type="date" value={formData.date} onChange={(e) => handleChange(e, 'info', 'date')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <select value={formData.shift} onChange={(e) => handleChange(e, 'info', 'shift')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
              {shifts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #f1c40f', paddingBottom: '10px', color: '#f39c12', display: 'flex', justifyContent: 'space-between' }}>
            <span>خامات التشغيل</span>
            <span style={{ fontSize: '0.7rem', color: '#999' }}>* تأكد من كتابة الكمية المستهلكة فقط</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '20px' }}>
            {Object.keys(formData.ingredients).map(ing => {
              const inStock = stock.find(s => s.name.trim() === ing.trim())?.balance || 0;
              return (
                <div key={ing} style={{ background: inStock <= 0 ? '#fff1f1' : '#fcfcfc', padding: '10px', borderRadius: '10px', border: '1px solid #eee' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>{ing}</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    onChange={(e) => handleChange(e, 'ingredients', ing)}
                    style={{ width: '100%', border: 'none', background: 'transparent', borderBottom: '1px solid #ccc', textAlign: 'center', fontWeight: 'bold' }} 
                  />
                  <div style={{ fontSize: '0.65rem', color: inStock > 0 ? '#27ae60' : '#e74c3c', marginTop: '5px', textAlign: 'center' }}>
                    متوفر: {inStock}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#2c3e50', color: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#f1c40f', marginBottom: '20px' }}>الإنتاج التام</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.9rem' }}>حجم الإنتاج (كرتونة):</label>
              <input type="number" onChange={(e) => handleChange(e, 'info', 'productionQty')} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '5px', fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.9rem' }}>كمية الهالك:</label>
              <input type="number" onChange={(e) => handleChange(e, 'info', 'wasteQty')} style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '5px', color: '#e74c3c' }} />
            </div>
            <button 
              onClick={handleProcessProduction}
              style={{ width: '100%', padding: '15px', background: '#27ae60', border: 'none', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              ترحيل عملية الإنتاج
            </button>
          </div>

          <div style={{ background: '#e8f4fd', padding: '15px', borderRadius: '15px', borderRight: '5px solid #3498db' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2980b9' }}>
              <Info size={20} />
              <strong style={{ fontSize: '0.9rem' }}>تنبيه المخزن:</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#34495e', marginTop: '5px' }}>
              يتم الآن عرض الكمية المتوفرة تحت كل مادة. إذا ظهر "المتوفر: 0" رغم وجود رصيد، يرجى التأكد من تطابق اسم المادة تماماً في صفحة المشتريات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionManager;
