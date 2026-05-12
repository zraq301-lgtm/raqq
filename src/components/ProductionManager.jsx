import React, { useState } from 'react';
import { Factory, Save, ArrowLeft, AlertTriangle, Box, Info, Calendar, Clock, Plus, Trash2 } from 'lucide-react';

const ProductionManager = ({ stock = [], onSaveProduction, onSaveWaste, onBack, setStock }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'الأولى',
    ingredients: {
      دقيق: 0, سكر: 0, عجوة: 0, سمنة: 0, زبدة: 0, 
      سولار: 0, كهرباء: 0, لبن: 0, كارتون: 0, تغليف: 0
    },
    products: [{ name: 'معمول جاهز', quantity: 0 }],
    wasteQty: 0
  });

  const shifts = ['الأولى', 'الثانية', 'السهرة', 'إضافي'];

  const handleChange = (e, category, field, index = null) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    
    if (category === 'ingredients') {
      setFormData(prev => ({ ...prev, ingredients: { ...prev.ingredients, [field]: value } }));
    } else if (category === 'products') {
      const updatedProducts = [...formData.products];
      updatedProducts[index][field] = value;
      setFormData(prev => ({ ...prev, products: updatedProducts }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addProductField = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: 0 }]
    }));
  };

  const removeProductField = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const handleProcessProduction = () => {
    if (!onSaveProduction || !setStock) {
      console.error("Missing required functions (onSaveProduction or setStock)");
      return;
    }

    let totalActualCost = 0;
    const updatedStock = JSON.parse(JSON.stringify(stock || []));

    // 1. سحب الخامات وحساب التكلفة
    for (const [ingName, requiredQty] of Object.entries(formData.ingredients)) {
      if (requiredQty <= 0) continue;
      
      const stockItem = updatedStock.find(s => s.name && s.name.trim() === ingName.trim());
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
            totalActualCost += (currentBatch.quantity * (currentBatch.price || 0));
            remainingToWithdraw -= currentBatch.quantity;
            stockItem.batches.shift();
          } else {
            totalActualCost += (remainingToWithdraw * (currentBatch.price || 0));
            currentBatch.quantity -= remainingToWithdraw;
            remainingToWithdraw = 0;
          }
        }
        stockItem.balance = stockItem.batches.reduce((sum, b) => sum + b.quantity, 0);
      }
    }

    // 2. توزيع التكلفة وتحديث المنتجات
    const totalProductionUnits = formData.products.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0);
    const costPerGeneralUnit = totalProductionUnits > 0 ? (totalActualCost / totalProductionUnits) : 0;

    formData.products.forEach(prod => {
      if (prod.quantity <= 0) return;

      let productInStock = updatedStock.find(s => s.name && s.name.trim() === prod.name.trim());
      const newBatch = { 
        purchaseDate: formData.date, 
        quantity: parseFloat(prod.quantity), 
        price: costPerGeneralUnit 
      };

      if (productInStock) {
        if (!productInStock.batches) productInStock.batches = [];
        productInStock.batches.push(newBatch);
        productInStock.balance = (productInStock.balance || 0) + parseFloat(prod.quantity);
        // تأكد من تحديث النوع لضمان ظهوره في صفحة المنتجات
        productInStock.type = 'finished'; 
      } else {
        updatedStock.push({
          id: Date.now() + Math.random(),
          name: prod.name,
          balance: parseFloat(prod.quantity),
          unit: 'كرتونة',
          batches: [newBatch],
          price: costPerGeneralUnit,
          type: 'finished' // هذا هو السطر المفتاح لظهور المنتج في الواجهة الصحيحة
        });
      }
    });

    // تحديث الحالة في App
    setStock(updatedStock);
    
    // إرسال البيانات لسجل الإنتاج لظهورها في لوحة التحكم
    onSaveProduction({ 
      ...formData, 
      totalActualCost: totalActualCost.toFixed(2), 
      actualUnitCost: costPerGeneralUnit.toFixed(2) 
    });

    if (formData.wasteQty > 0 && onSaveWaste) {
      onSaveWaste({
        id: Date.now(),
        date: formData.date,
        item: `هالك إنتاج - وردية ${formData.shift}`,
        quantity: formData.wasteQty,
        costAtLoss: (costPerGeneralUnit * formData.wasteQty).toFixed(2),
        reason: "هالك تشغيل"
      });
    }

    alert(`✅ تم ترحيل الإنتاج بنجاح!\nإجمالي التكلفة: ${totalActualCost.toFixed(2)} ج.م`);
    if (onBack) onBack();
  };

  return (
    <div className="production-manager" style={{ direction: 'rtl', padding: '15px', backgroundColor: '#f8fafd', minHeight: '100vh' }}>
      {/* رأس الصفحة */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>تشغيل الإنتاج</h2>
          <span style={{ color: '#f59e0b', fontSize: '14px' }}><Factory size={16} /> قسم التصنيع</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <input type="date" value={formData.date} onChange={(e) => handleChange(e, 'info', 'date')} style={{ padding: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <select value={formData.shift} onChange={(e) => handleChange(e, 'info', 'shift')} style={{ padding: '5px', borderRadius: '8px', border: '1px solid #ddd' }}>
            {shifts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* مدخلات الخامات */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '15px', marginBottom: '15px' }}>
        <h3 style={{ color: '#64748b', fontSize: '16px', marginBottom: '10px' }}>الخامات المستهلكة</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
          {Object.keys(formData.ingredients).map(ing => {
            const itemInStock = (stock || []).find(s => s.name && s.name.trim() === ing.trim());
            const balance = itemInStock ? itemInStock.balance : 0;
            return (
              <div key={ing} style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{ing}</div>
                <input 
                  type="number" 
                  placeholder="0"
                  onChange={(e) => handleChange(e, 'ingredients', ing)}
                  style={{ width: '100%', textAlign: 'center', border: 'none', background: 'transparent', fontSize: '16px', outline: 'none', borderBottom: '1px solid #cbd5e1' }}
                />
                <div style={{ fontSize: '10px', color: balance > 0 ? '#10b981' : '#ef4444' }}>متاح: {balance}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* المنتجات المستهدفة */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '20px', padding: '20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#f59e0b' }}>المنتج التام</h3>
          <button onClick={addProductField} style={{ background: '#334155', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>
            <Plus size={14} /> إضافة منتج
          </button>
        </div>

        {formData.products.map((prod, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: '11px' }}>المنتج</label>
              <input 
                type="text" 
                value={prod.name} 
                onChange={(e) => handleChange(e, 'products', 'name', index)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #475569', background: '#2d3a4f', color: '#fff' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px' }}>الكمية</label>
              <input 
                type="number" 
                value={prod.quantity} 
                onChange={(e) => handleChange(e, 'products', 'quantity', index)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #475569', background: '#2d3a4f', color: '#fff' }}
              />
            </div>
            {index > 0 && (
              <button onClick={() => removeProductField(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444' }}><Trash2 size={20} /></button>
            )}
          </div>
        ))}

        <div style={{ marginTop: '15px', borderTop: '1px solid #334155', paddingTop: '10px' }}>
          <label style={{ fontSize: '12px' }}>كمية الهالك:</label>
          <input 
            type="number" 
            onChange={(e) => handleChange(e, 'info', 'wasteQty')}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', marginTop: '5px' }}
            placeholder="أدخل كمية الهالك إن وجدت"
          />
        </div>

        <button onClick={handleProcessProduction} style={{ width: '100%', padding: '15px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}>
          ترحيل الإنتاج للمخزن
        </button>
      </div>

      <button onClick={onBack} style={{ width: '100%', marginTop: '10px', background: 'none', border: '1px solid #ddd', padding: '10px', borderRadius: '12px', color: '#64748b', cursor: 'pointer' }}>
        <ArrowLeft size={16} /> العودة
      </button>
    </div>
  );
};

export default ProductionManager;
