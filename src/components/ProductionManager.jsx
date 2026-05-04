import React, { useState } from 'react';
import { Factory, Save, ArrowRight, AlertTriangle, Box, calculator } from 'lucide-react';

const ProductionManager = ({ stock, onSaveProduction, onSaveWaste, onBack, setStock }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'الأولى',
    ingredients: {
      دقيق: 0, سكر: 0, عجوة: 0, سمن: 0, zبدة: 0, لبن: 0, كرتون: 0, تغليف: 0
    },
    productionQty: 0, // الكمية المنتجة
    wasteQty: 0       // الكمية التالفة
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
    let totalProductionCost = 0;
    // عمل نسخة عميقة من المخزن لتعديل الشحنات بدقة
    const updatedStock = JSON.parse(JSON.stringify(stock));

    // 1. التحقق من التوفر الفعلي وحساب التكلفة بنظام FIFO
    for (const [ingName, requiredQty] of Object.entries(formData.ingredients)) {
      if (requiredQty <= 0) continue;

      const stockItem = updatedStock.find(s => s.name === ingName);
      // حساب إجمالي الكمية المتوفرة في جميع الشحنات لهذا الصنف
      const totalAvailable = stockItem?.batches?.reduce((sum, b) => sum + b.quantity, 0) || 0;

      if (totalAvailable < requiredQty) {
        alert(`نقص في كمية ${ingName}! مطلوب ${requiredQty} والمتوفر ${totalAvailable}`);
        return;
      }

      // --- منطق السحب الذكي ---
      let remainingToWithdraw = requiredQty;
      while (remainingToWithdraw > 0) {
        const currentBatch = stockItem.batches[0]; // سحب أقدم شحنة

        if (currentBatch.quantity <= remainingToWithdraw) {
          // الشحنة تنتهي بالكامل
          totalProductionCost += (currentBatch.quantity * currentBatch.price);
          remainingToWithdraw -= currentBatch.quantity;
          stockItem.batches.shift(); // حذف الشحنة المنتهية
        } else {
          // السحب من جزء من الشحنة
          totalProductionCost += (remainingToWithdraw * currentBatch.price);
          currentBatch.quantity -= remainingToWithdraw;
          remainingToWithdraw = 0;
        }
      }
      // تحديث الإجمالي العام للصنف (Balance) ليتوافق مع مجموع الشحنات المتبقية
      stockItem.balance = stockItem.batches.reduce((sum, b) => sum + b.quantity, 0);
    }

    // 2. حساب تكلفة الوحدة المنتجة بناءً على الاستهلاك الفعلي
    const unitCost = formData.productionQty > 0 ? (totalProductionCost / formData.productionQty) : 0;

    // 3. إضافة المنتج النهائي للمخزن كشحنة جديدة بتكلفتها الحقيقية
    const finalProductName = "معمول جاهز";
    let productItem = updatedStock.find(s => s.name === finalProductName);
    
    const newProductBatch = {
      purchaseDate: formData.date,
      quantity: formData.productionQty,
      price: unitCost // التكلفة المحسوبة للوحدة
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

    // 4. ترحيل الهالك المسجل بسعر التكلفة الحقيقي
    if (formData.wasteQty > 0) {
      onSaveWaste({
        id: Date.now(),
        date: formData.date,
        item: "هالك إنتاج - معمول",
        quantity: formData.wasteQty,
        costAtLoss: (unitCost * formData.wasteQty).toFixed(2), // قيمة الخسارة الفعلية
        reason: "تالف تصنيع"
      });
    }

    // 5. حفظ وتحديث
    setStock(updatedStock);
    onSaveProduction({
      ...formData,
      totalCost: totalProductionCost.toFixed(2),
      unitCost: unitCost.toFixed(2)
    });

    alert(`تم الترحيل! التكلفة الإجمالية المسحوبة: ${totalProductionCost.toFixed(2)} ج.م`);
    onBack();
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Tajawal' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #f1f1f1', pb: '15px' }}>
        <div style={{ background: '#e67e22', padding: '10px', borderRadius: '12px' }}>
          <Factory size={28} color="white" />
        </div>
        <div>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>نظام الإنتاج الذكي (FIFO)</h2>
          <small style={{ color: '#7f8c8d' }}>سحب المكونات وحساب التكاليف بالأسعار الحقيقية</small>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' }}>
        {/* قسم المكونات */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={20} color="#3498db" /> المكونات المستهلكة
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
            {Object.keys(formData.ingredients).map(ing => (
              <div key={ing} style={{ background: '#f8f9fa', padding: '10px', borderRadius: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#34495e', display: 'block', marginBottom: '5px' }}>{ing}</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  onChange={(e) => handleChange(e, 'ingredients', ing)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #dcdde1', outline: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* النتائج والترحيل */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '20px', color: '#27ae60' }}>مخرجات العملية</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كمية الإنتاج التام:</label>
              <input 
                type="number" 
                placeholder="كم كرتونة؟"
                onChange={(e) => handleChange(e, 'output', 'productionQty')}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #2ecc71', fontSize: '1.1rem' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e74c3c' }}>كمية الهالك (التالف):</label>
              <input 
                type="number" 
                placeholder="0.00"
                onChange={(e) => handleChange(e, 'output', 'wasteQty')}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e74c3c', fontSize: '1.1rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleProcessProduction}
                style={{ flex: 1, padding: '15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s' }}
              >
                <Save size={22} /> تنفيذ وترحيل ذكي
              </button>
              <button 
                onClick={onBack}
                style={{ padding: '15px', background: '#ecf0f1', color: '#7f8c8d', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </div>

          <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '15px', border: '1px solid #ffeeba', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertTriangle color="#856404" size={20} />
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#856404' }}>
              <strong>ملاحظة الذكاء الاصطناعي:</strong> النظام يسحب التكلفة من أقدم شحنة شراء مسجلة أولاً. في حال انتهائها، ينتقل للشحنة الأحدث بالسعر الجديد تلقائياً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionManager;
