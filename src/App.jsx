// --- دالة حفظ المشتريات وتحديث المخزن (تعديل التوافق) ---
  const handleSavePurchase = (newPurchase) => {
    // 1. إضافة الفاتورة لسجل المشتريات العام
    setInventory([...inventory, newPurchase]);

    // 2. تحديث كميات المخزن (Stock)
    setStock(prevStock => {
      // نستخدم newPurchase.item لأن هذا هو المسمى في مكون المشتريات
      const itemName = newPurchase.item; 
      const itemQuantity = parseFloat(newPurchase.quantity || 0);

      const existingItemIndex = prevStock.findIndex(
        stockItem => stockItem.name === itemName
      );
      
      if (existingItemIndex > -1) {
        // إذا الصنف موجود، نحدث الكمية فقط
        const updatedStock = [...prevStock];
        const currentQty = parseFloat(updatedStock[existingItemIndex].quantity || 0);
        
        updatedStock[existingItemIndex] = {
          ...updatedStock[existingItemIndex],
          quantity: currentQty + itemQuantity
        };
        return updatedStock;
      } else {
        // إذا صنف جديد، نضيفه للمخزن
        return [...prevStock, { 
          id: Date.now(), 
          name: itemName, 
          quantity: itemQuantity,
          unit: newPurchase.unit 
        }];
      }
    });

    setActivePage('dashboard');
  };
