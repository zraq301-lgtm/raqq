import React, { useState } from 'react';
import { Factory, Save, ArrowLeft, AlertTriangle, Box, Info, Calendar, Clock, Plus, Trash2 } from 'lucide-react';

const ProductionManager = ({ stock, onSaveProduction, onSaveWaste, onBack, setStock }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'الأولى',
    ingredients: {
      دقيق: 0, سكر: 0, عجوة: 0, سمنة: 0, زبدة: 0, 
      سولار: 0, كهرباء: 0, لبن: 0, كارتون: 0, تغليف: 0
    },
    // تعديل: الإنتاج أصبح مصفوفة لدعم منتجات متعددة
    products: [{ name: 'معمول جاهز', quantity: 0 }],
    wasteQty: 0
  });

  const shifts = ['الأولى', 'الثانية', 'السهرة', 'إضافي'];

  const handleChange = (e, category, field, index = null) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    
    if (category === 'ingredients') {
      setFormData({ ...formData, ingredients: { ...formData.ingredients, [field]: value } });
    } else if (category === 'products') {
      const updatedProducts = [...formData.products];
      updatedProducts[index][field] = value;
      setFormData({ ...formData, products: updatedProducts });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', quantity: 0 }]
    });
  };

  const removeProductField = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleProcessProduction = () => {
    let totalActualCost = 0;
    const updatedStock = JSON.parse(JSON.stringify(stock));

    // 1. سحب الخامات وحساب التكلفة الإجمالية
    for (const [ingName, requiredQty] of Object.entries(formData.ingredients)) {
      if (requiredQty <= 0) continue;
      const stockItem = updatedStock.find(s => s.name.trim() === ingName.trim());
      const totalAvailable = stockItem ? (stockItem.balance || 0) : 0;

      if (!stockItem || totalAvailable < requiredQty) {
        alert(`⚠️ عجز في مادة: ${ingName}\nالمطلوب: ${requiredQty}\nالمتوفر: ${totalAvailable}`);
        return;
      }

      let remainingToWithdraw = requiredQty;
      if (!stockItem.batches || stockItem.batches.length === 0) {
        totalActualCost += (requiredQty * (stockItem.price || 0));
        stockItem.balance -= requiredQty;
      } else {
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
        stockItem.balance = stockItem.batches.reduce((sum, b) => sum + b.quantity, 0);
      }
    }

    // 2. توزيع التكلفة على المنتجات وحفظها في المخزن النهائي
    const totalProductionUnits = formData.products.reduce((sum, p) => sum + p.quantity, 0);
    const costPerGeneralUnit = totalProductionUnits > 0 ? (totalActualCost / totalProductionUnits) : 0;

    formData.products.forEach(prod => {
      if (prod.quantity <= 0) return;

      let productInStock = updatedStock.find(s => s.name.trim() === prod.name.trim());
      const newBatch = { 
        purchaseDate: formData.date, 
        quantity: prod.quantity, 
        price: costPerGeneralUnit 
      };

      if (productInStock) {
        if (!productInStock.batches) productInStock.batches = [];
        productInStock.batches.push(newBatch);
        productInStock.balance = (productInStock.balance || 0) + prod.quantity;
      } else {
        updatedStock.push({
          id: Date.now() + Math.random(),
          name: prod.name,
          balance: prod.quantity,
          unit: 'كرتونة',
          batches: [newBatch],
          price: costPerGeneralUnit
        });
      }
    });

    // تحديث المخزن العام
    setStock(updatedStock);
    
    // حفظ السجل للتقارير
    onSaveProduction({ 
      ...formData, 
      totalActualCost: totalActualCost.toFixed(2), 
      actualUnitCost: costPerGeneralUnit.toFixed(2) 
    });

    // معالجة الهالك
    if (formData.wasteQty > 0) {
      onSaveWaste({
        id: Date.now(),
        date: formData.date,
        item: `هالك إنتاج - وردية ${formData.shift}`,
        quantity: formData.wasteQty,
        costAtLoss: (costPerGeneralUnit * formData.wasteQty).toFixed(2),
        reason: "هالك تشغيل"
      });
    }

    alert(`✅ تم ترحيل الإنتاج للمخزن بنجاح!\nإجمالي التكلفة المستهلكة: ${totalActualCost.toFixed(2)} ج.م`);
    onBack();
  };

  return (
    <div className="production-container" style={{ 
      direction: 'rtl', padding: '15px', backgroundColor: '#f8fafd', minHeight: '100vh', fontFamily: 'sans-serif' 
    }}>
      
      {/* هيدر الصفحة */}
      <div style={{ 
        backgroundColor: '#fff', borderRadius: '25px', padding: '20px', marginBottom: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#1e293b', fontWeight: '800' }}>سجل تشغيل الإنتاج</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b' }}>
             <Factory size={18} /> <span style={{fontSize: '14px'}}>قسم التصنيع</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <div style={{ background: '#f1f5f9', padding: '5px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} color="#64748b" />
                <input type="date" value={formData.date} onChange={(e) => handleChange(e, 'info', 'date')} style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#475569', outline: 'none' }} />
             </div>
             <div style={{ background: '#f1f5f9', padding: '5px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} color="#64748b" />
                <select value={formData.shift} onChange={(e) => handleChange(e, 'info', 'shift')} style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#475569', outline: 'none' }}>
                  {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* قسم خامات التشغيل */}
        <div style={{ backgroundColor: '#fff', borderRadius: '25px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b', borderBottom: '2px solid #fef3c7', paddingBottom: '10px' }}>الخامات المستهلكة</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {Object.keys(formData.ingredients).map(ing => {
              const inStock = stock.find(s => s.name.trim() === ing.trim())?.balance || 0;
              return (
                <div key={ing} style={{ 
                  background: '#f8fafc', padding: '12px', borderRadius: '18px', border: '1px solid #e2e8f0',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>{ing}</span>
                  <input 
                    type="number" placeholder="0"
                    onChange={(e) => handleChange(e, 'ingredients', ing)}
                    style={{ width: '80%', border: 'none', background: 'transparent', borderBottom: '2px solid #cbd5e1', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', outline: 'none' }} 
                  />
                  <span style={{ fontSize: '10px', color: inStock > 0 ? '#10b981' : '#ef4444', marginTop: '5px' }}>مخزن: {inStock}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* قسم الإنتاج التام (ديناميكي) */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '25px', padding: '20px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#f59e0b', margin: 0 }}>الإنتاج التام والمخرجات</h3>
            <button 
              onClick={addProductField}
              style={{ background: '#334155', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            >
              <Plus size={14} /> إضافة منتج آخر
            </button>
          </div>

          {formData.products.map((prod, index) => (
            <div key={index} style={{ background: '#2d3a4f', padding: '15px', borderRadius: '15px', marginBottom: '10px', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '11px', opacity: 0.7 }}>اسم المنتج:</label>
                  <input 
                    type="text" 
                    value={prod.name} 
                    onChange={(e) => handleChange(e, 'products', 'name', index)}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #475569', color: '#fff', padding: '8px', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', opacity: 0.7 }}>الكمية:</label>
                  <input 
                    type="number" 
                    value={prod.quantity} 
                    onChange={(e) => handleChange(e, 'products', 'quantity', index)}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #475569', color: '#fff', padding: '8px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}
                  />
                </div>
                {index > 0 && (
                  <button onClick={() => removeProductField(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', marginTop: '15px' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: '15px', borderTop: '1px solid #334155', paddingTop: '15px' }}>
            <label style={{ fontSize: '13px', opacity: 0.8 }}>إجمالي كمية الهالك (وردية):</label>
            <input 
              type="number" 
              onChange={(e) => handleChange(e, 'info', 'wasteQty')} 
              style={{ width: '100%', padding: '10px', borderRadius: '12px', marginTop: '5px', border: 'none', color: '#ef4444', fontWeight: 'bold' }} 
              placeholder="0"
            />
          </div>

          <button onClick={handleProcessProduction} style={{ 
            width: '100%', padding: '15px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '18px', fontWeight: '800', fontSize: '16px', marginTop: '20px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', cursor: 'pointer'
          }}>
            ترحيل وحفظ في المخزن النهائي
          </button>
        </div>

        {/* زر العودة */}
        <button onClick={onBack} style={{ 
          width: '100%', padding: '12px', background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px'
        }}>
          <ArrowLeft size={18} /> العودة للوحة التحكم
        </button>

      </div>
    </div>
  );
};

export default ProductionManager;
