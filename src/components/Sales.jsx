import React, { useState, useEffect } from 'react';
import {
  Tag, User, Hash, DollarSign, Save, ArrowRight,
  ClipboardList, ShoppingCart, Trash2, Plus, Minus, Search
} from 'lucide-react';

const Sales = ({ onBack, onSaveSale, customers = [], stock = [] }) => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(0);

  // تصفية المنتجات المتوفرة في المخزن
  const availableProducts = (stock || []).filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setPricePerUnit(product.price || 0);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!selectedProduct) return;

    const existingItemIndex = cart.findIndex(item => item.itemName === selectedProduct.name);

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      const newQty = updatedCart[existingItemIndex].quantity + quantity;

      updatedCart[existingItemIndex].quantity = newQty;
      updatedCart[existingItemIndex].total = newQty * updatedCart[existingItemIndex].pricePerUnit;
      setCart(updatedCart);
    } else {
      const newItem = {
        itemName: selectedProduct.name,
        quantity: quantity,
        pricePerUnit: pricePerUnit,
        total: quantity * pricePerUnit
      };
      setCart([...cart, newItem]);
    }

    setSelectedProduct(null);
    setSearchTerm('');
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateCartQty = (index, delta) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    const newQty = item.quantity + delta;
    if (newQty > 0) {
      updatedCart[index].quantity = newQty;
      updatedCart[index].total = newQty * item.pricePerUnit;
      setCart(updatedCart);
    }
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName) {
      alert("يرجى إدخال اسم العميل");
      return;
    }
    if (cart.length === 0) {
      alert("سلة المشتريات فارغة");
      return;
    }
    
    const finalSale = {
      customerName,
      date,
      items: cart,
      total: calculateTotal(),
      id: Date.now()
    };

    onSaveSale(finalSale);
    alert("تم تسجيل عملية البيع بنجاح");
    onBack();
  };

  return (
    <div className="p-5 rtl font-sans bg-gray-50 min-h-screen" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-xl text-green-600">
            <ShoppingCart size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">نظام الكاشير الاحترافي</h2>
        </div>
        <button onClick={onBack} className="bg-gray-100 p-2 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قسم اختيار المنتجات */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative mb-6">
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              <input 
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="ابحث عن منتج من المخزن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
              {availableProducts.map(product => (
                <div
                  key={product.id}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedProduct?.id === product.id ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="font-bold text-gray-800 mb-1">{product.name}</div>
                  <div className="text-xs text-gray-500 mb-2">المتاح: {product.balance} {product.unit}</div>
                  <div className="text-green-600 font-bold">{product.price} ج.م</div>
                </div>
              ))}
            </div>

            {selectedProduct && (
              <div className="mt-6 p-6 bg-green-50 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-bottom-4">
                <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Plus size={18}/> إضافة {selectedProduct.name} للسلة
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-green-700 font-bold mb-1 block">الكمية</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-white border border-green-200 rounded-xl outline-none"
                      value={quantity}
                      min="1"
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-green-700 font-bold mb-1 block">سعر الوحدة</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-white border border-green-200 rounded-xl outline-none"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <button onClick={addToCart} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                  إضافة للسلة
                </button>
              </div>
            )}
          </div>
        </div>

        {/* قسم العميل والسلة */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <User size={18} className="text-green-600" /> اسم العميل
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  placeholder="اختر أو اكتب اسم العميل"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  list="customers-list"
                />
                <datalist id="customers-list">
                  {customers.map((c, i) => <option key={i} value={c.name} />)}
                </datalist>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <ClipboardList size={18} className="text-green-600" /> التاريخ
                </label>
                <input
                  type="date"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="my-6 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart size={18} className="text-gray-400" /> المنتجات المختارة ({cart.length})
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <div className="font-bold text-sm text-gray-800">{item.itemName}</div>
                      <div className="text-xs text-gray-500">{item.pricePerUnit} ج.م × {item.quantity}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                        <button onClick={() => updateCartQty(index, -1)} className="p-1 hover:text-green-600"><Minus size={14} /></button>
                        <span className="px-2 font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateCartQty(index, 1)} className="p-1 hover:text-green-600"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="text-center py-10 text-gray-400 italic text-sm">السلة فارغة حالياً</div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-500 font-bold text-sm">الإجمالي النهائي</span>
                <span className="text-3xl font-black text-green-600">{calculateTotal()} <span className="text-sm">ج.م</span></span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
              >
                <Save size={20} /> إتمام البيع وحفظ الفاتورة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
