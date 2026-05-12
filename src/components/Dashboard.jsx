import React, { useMemo, useState } from 'react';
import { 
  ShoppingCart, Tag, Factory, Warehouse, Trash2, 
  Wallet, Truck, BarChart3, FileText, Users, TrendingUp, Calendar, Info, BrainCircuit, Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CapacitorHttp } from '@capacitor/core';
import Swal from 'sweetalert2';

const Dashboard = ({ setActivePage, productionHistory = [], stock = [] }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 1. معالجة البيانات للرسم البياني (ذكاء الحركة اليومية)
  const chartData = useMemo(() => {
    return productionHistory.map(item => ({
      name: item.date.split('-').slice(1).join('/'), // عرض الشهر/اليوم
      كمية: parseFloat(item.products.reduce((sum, p) => sum + p.quantity, 0)),
      تكلفة: parseFloat(item.totalActualCost)
    })).slice(-7); // عرض آخر 7 أيام فقط
  }, [productionHistory]);

  // 2. زر تقرير مرتقبة اليوم (التقليدي)
  const generateTodayReport = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayProd = productionHistory.filter(p => p.date === today);
    const total = todayProd.reduce((sum, p) => sum + parseFloat(p.totalActualCost), 0);
    
    Swal.fire({
      title: '📊 تقرير مرتقبة اليوم',
      html: `<div style="text-align: right;">
        <p>عدد الورديات: <b>${todayProd.length}</b></p>
        <p>إجمالي التكلفة: <b>${total.toFixed(2)} ج.م</b></p>
        <p>الحالة: <b>${chartData.length > 1 && chartData[chartData.length-1].كمية > chartData[chartData.length-2].كمية ? 'صعود 📈' : 'هبوط 📉'}</b></p>
      </div>`,
      icon: 'info',
      confirmButtonText: 'حسناً'
    });
  };

  // --- وظيفة التحليل بالذكاء الاصطناعي (رقة AI) ---
  const analyzeWithAI = async () => {
    setIsAiLoading(true);
    try {
      // إعداد البيانات المختصرة لإرسالها للذكاء الاصطناعي
      const contextData = productionHistory.slice(-10).map(p => ({
        date: p.date,
        cost: p.totalActualCost,
        qty: p.products.reduce((s, pr) => s + pr.quantity, 0)
      }));

      const response = await CapacitorHttp.post({
        url: 'https://maamoul-one.vercel.app/api/raqqa-ai',
        headers: { 'Content-Type': 'application/json' },
        data: { 
          prompt: `حلل بيانات الإنتاج التالية وأعطني تقريراً احترافياً ومقارنة مع الأيام السابقة: ${JSON.stringify(contextData)}` 
        }
      });

      const aiMessage = response.data?.message || "لم أستطع تحليل البيانات حالياً.";

      Swal.fire({
        title: '🤖 تحليل رقة الذكي',
        text: aiMessage,
        icon: 'success',
        confirmButtonText: 'فهمت',
        customClass: { popup: 'font-tajawal' }
      });
    } catch (error) {
      Swal.fire('خطأ', 'فشل الاتصال بمحرك رقة الذكي', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const sections = [
    { id: 'production', title: 'الإنتاج', icon: <Factory size={30} />, color: '#e67e22' },
    { id: 'inventory', title: 'المخزن', icon: <Warehouse size={30} />, color: '#3498db' },
    { id: 'purchases', title: 'المشتريات', icon: <ShoppingCart size={30} />, color: '#9b59b6' },
    { id: 'sales', title: 'المبيعات', icon: <Tag size={30} />, color: '#2ecc71' },
  ];

  return (
    <div className="dashboard-container" style={{ padding: '15px', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* رأس الصفحة الذكي */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', margin: 0 }}>معمول <span style={{ color: '#e67e22' }}>راق</span></h1>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>مرتقبة البيانات الذكية</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* تم تعديل اسم الزر هنا إلى محلل AI */}
          <button 
            onClick={analyzeWithAI}
            disabled={isAiLoading}
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}
          >
            {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <BrainCircuit size={18} />} 
            محلل AI
          </button>
          
          <button 
            onClick={generateTodayReport}
            style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          >
            <BarChart3 size={18} /> تقرير
          </button>
        </div>
      </header>

      {/* قسم الرسم البياني (مؤشر حركة الإنتاج) */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '15px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
          <TrendingUp size={20} color="#e67e22" /> مؤشر حركة الإنتاج (صعوداً وهبوطاً)
        </h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e67e22" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e67e22" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: '12px'}} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="كمية" stroke="#e67e22" strokeWidth={3} fillOpacity={1} fill="url(#colorQty)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* أزرار الأقسام الرئيسية */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {sections.map((sec) => (
          <div key={sec.id} onClick={() => setActivePage(sec.id)} style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', borderRight: `5px solid ${sec.color}` }}>
            <div style={{ color: sec.color }}>{sec.icon}</div>
            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>{sec.title}</span>
          </div>
        ))}
      </div>

      {/* سجل الإنتاج اليومي (جدول مرصود) */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#3498db" /> رصد مسجل لحركة الإنتاج
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '13px' }}>
                <th style={{ padding: '10px' }}>التاريخ</th>
                <th style={{ padding: '10px' }}>المنتج</th>
                <th style={{ padding: '10px' }}>التكلفة</th>
              </tr>
            </thead>
            <tbody>
              {productionHistory.slice().reverse().map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                  <td style={{ padding: '10px' }}>{log.date}</td>
                  <td style={{ padding: '10px' }}>{log.products[0]?.name || 'غير معروف'}</td>
                  <td style={{ padding: '10px', color: '#10b981', fontWeight: 'bold' }}>{log.totalActualCost} ج.م</td>
                </tr>
              ))}
              {productionHistory.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>لا يوجد سجلات بعد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
