import React, { useMemo, useState } from 'react';
import { 
  ShoppingCart, Tag, Factory, Warehouse, 
  BarChart3, TrendingUp, Calendar, BrainCircuit, Loader2, Clock, Trash2
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
// حذفنا CapacitorHttp لأننا سنستخدم الدالة الممررة onDeleteItem

import LogoImage from '../services/icon-foreground.png';

// الحل هنا: نمرر onDeleteItem كبروبس (Props) زي صفحة الخامات بالظبط
const Dashboard = ({ setActivePage, productionHistory = [], stock = [], stats = {}, onDeleteItem }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 1. معالجة بيانات الرسم البياني
  const chartData = useMemo(() => {
    if (!productionHistory || !Array.isArray(productionHistory)) return [];
    return productionHistory.map(item => ({
      name: item.date ? item.date.split('-').slice(1).join('/') : '', 
      كمية: parseFloat(item.products?.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0) || 0),
      تكلفة: parseFloat(item.totalActualCost || 0)
    })).slice(-7); 
  }, [productionHistory]);

  // دالة الحذف الجديدة: تنفذ نفس نظام صفحة الخامات
  const confirmDelete = (id) => {
    if (!id) return;
    // استدعاء الدالة المركزية الممررة من App.jsx مع تحديد اسم الجدول 'production'
    if (onDeleteItem) {
      onDeleteItem(id, 'production');
    }
  };

  // 2. تحليل الذكاء الاصطناعي (كما هو)
  const analyzeWithAI = async () => {
    if (!productionHistory.length) return;
    setIsAiLoading(true);
    // ... منطق الـ AI ...
    setIsAiLoading(false);
  };

  const sections = [
    { id: 'production', title: 'تشغيل الإنتاج', icon: <Factory size={28} />, color: '#e67e22', desc: 'إضافة وردية جديدة' },
    { id: 'inventory', title: 'إدارة المخزن', icon: <Warehouse size={28} />, color: '#3498db', desc: 'خامات ومنتجات' },
  ];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={LogoImage} alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '10px' }} />
          <div>
            <h1 style={{ fontSize: '1.3rem', color: '#1e293b', margin: 0, fontWeight: '900' }}>زاد <span style={{ color: '#e67e22' }}>الخير</span></h1>
            <p style={{ color: '#64748b', fontSize: '10px', margin: 0 }}>للصناعات الغذائية</p>
          </div>
        </div>
      </header>

      {/* ... كود الرسم البياني والسكشنز كما هو ... */}

      <div style={cardStyle}>
        <h3 style={cardTitleStyle}><Calendar size={18} color="#3498db" /> تفاصيل آخر عمليات الإنتاج</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', minWidth: '400px' }}>
            <thead>
              <tr style={{ color: '#94a3b8', fontSize: '11px', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '10px 5px' }}>التاريخ</th>
                <th style={{ padding: '10px 5px' }}>المنتج</th>
                <th style={{ padding: '10px 5px' }}>الكمية</th>
                <th style={{ padding: '10px 5px' }}>حذف</th>
              </tr>
            </thead>
            <tbody>
              {productionHistory.slice(-5).reverse().map((log, idx) => {
                const logId = log._id || log.id;
                return (
                  <tr key={logId || idx} style={{ fontSize: '12px', borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 5px', color: '#64748b' }}>
                      <span>{log.date}</span>
                    </td>
                    <td style={{ padding: '10px 5px', fontWeight: 'bold' }}>{log.products?.[0]?.name || 'معمول'}</td>
                    <td style={{ padding: '10px 5px' }}>{log.products?.[0]?.quantity || 0} كرتونة</td>
                    <td style={{ padding: '10px 5px' }}>
                      <button 
                        onClick={() => confirmDelete(logId)} // استخدام الدالة الموحدة
                        style={deleteIconBtn}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const deleteIconBtn = { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' };
// بقية التنسيقات (cardStyle, cardTitleStyle, الخ) كما هي في كودك الأصلي...

export default Dashboard;
