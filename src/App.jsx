import React, { useState } from 'react';
import { LayoutDashboard, Box, ShoppingCart, FileBarChart, Menu, X } from 'lucide-react';

// --- المكونات (الشاشات) ---

// 1. شاشة لوحة التحكم (Dashboard)
const Dashboard = () => (
  <div className="p-4 space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg">
        <p className="text-sm opacity-80">إجمالي المخزون</p>
        <h2 className="text-2xl font-bold">1,250 وحدة</h2>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg">
        <p className="text-sm opacity-80">مشتريات الشهر</p>
        <h2 className="text-2xl font-bold">45 عملية</h2>
      </div>
    </div>
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold mb-3">آخر حركات السحب</h3>
      <div className="text-sm text-gray-500 italic">لا يوجد سحوبات اليوم...</div>
    </div>
  </div>
);

// 2. شاشة أقسام المخزن (Inventory)
const Inventory = () => (
  <div className="p-4 space-y-4">
    {["قسم المواد الخام", "قسم البلاستيك", "قسم المعادن"].map((dept) => (
      <div key={dept} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border-r-4 border-blue-500">
        <div>
          <h3 className="font-bold">{dept}</h3>
          <p className="text-xs text-gray-400">عدد العناصر: 12</p>
        </div>
        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm">فتح القسم</button>
      </div>
    ))}
  </div>
);

// 3. شاشة المشتريات (Purchases)
const Purchases = () => (
  <div className="p-4">
    <div className="bg-green-50 border-2 border-dashed border-green-200 p-8 rounded-2xl text-center">
      <ShoppingCart className="mx-auto text-green-500 mb-2" size={40} />
      <p className="text-green-700 font-medium">اضغط على الأقسام بالأسفل لإضافة مشتريات جديدة</p>
    </div>
  </div>
);

// 4. شاشة التقارير (Reports)
const Reports = () => (
  <div className="p-4">
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="font-bold mb-4 flex items-center gap-2"><FileBarChart size={20}/> استخراج تقارير إكسل</h3>
      <button className="w-full bg-gray-800 text-white py-3 rounded-xl mb-3">تقرير المخزون العام</button>
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl">تقرير المشتريات الشهري</button>
    </div>
  </div>
);

// --- المكون الرئيسي (App) ---
export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // دالة لتغيير الصفحة وإغلاق القائمة (للموبايل)
  const navigateTo = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      {/* شريط علوي (Header) */}
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <h1 className="font-black text-xl text-blue-600">مخزني الذكي</h1>
        <div className="w-6"></div> {/* للتوازن */}
      </nav>

      {/* القائمة الجانبية (Sidebar/Drawer) للموبايل */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)}>
          <div className="w-64 bg-white h-full p-6 space-y-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => navigateTo('dashboard')} className={`flex items-center gap-3 w-full p-3 rounded-xl ${activePage === 'dashboard' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <LayoutDashboard size={20}/> لوحة التحكم
            </button>
            <button onClick={() => navigateTo('inventory')} className={`flex items-center gap-3 w-full p-3 rounded-xl ${activePage === 'inventory' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Box size={20}/> الأقسام والمخزون
            </button>
            <button onClick={() => navigateTo('purchases')} className={`flex items-center gap-3 w-full p-3 rounded-xl ${activePage === 'purchases' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <ShoppingCart size={20}/> المشتريات
            </button>
            <button onClick={() => navigateTo('reports')} className={`flex items-center gap-3 w-full p-3 rounded-xl ${activePage === 'reports' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <FileBarChart size={20}/> التقارير
            </button>
          </div>
        </div>
      )}

      {/* محتوى الصفحات الديناميكي */}
      <main className="pb-20">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'inventory' && <Inventory />}
        {activePage === 'purchases' && <Purchases />}
        {activePage === 'reports' && <Reports />}
      </main>

      {/* شريط سفلي سريع (Bottom Navigation) - ممتاز للأندرويد */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-2xl">
        <button onClick={() => setActivePage('dashboard')} className={activePage === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActivePage('inventory')} className={activePage === 'inventory' ? 'text-blue-600' : 'text-gray-400'}>
          <Box size={24} />
        </button>
        <button onClick={() => setActivePage('reports')} className={activePage === 'reports' ? 'text-blue-600' : 'text-gray-400'}>
          <FileBarChart size={24} />
        </button>
      </div>
    </div>
  );
}
