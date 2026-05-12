import React, { useMemo, useState } from 'react';
import { 
  ShoppingCart, Tag, Factory, Warehouse, 
  BarChart3, TrendingUp, Calendar, BrainCircuit, Loader2
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CapacitorHttp } from '@capacitor/core';
import Swal from 'sweetalert2';

// تأكدنا هنا من استقبال stock و stats لضمان ربط البيانات
const Dashboard = ({ setActivePage, productionHistory = [], stock = [], stats = {} }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 1. معالجة البيانات للرسم البياني
  const chartData = useMemo(() => {
    if (!productionHistory.length) return [];
    return productionHistory.map(item => ({
      name: item.date ? item.date.split('-').slice(1).join('/') : '', 
      كمية: parseFloat(item.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0),
      تكلفة: parseFloat(item.totalActualCost || 0)
    })).slice(-7); 
  }, [productionHistory]);

  // 2. تقرير اليوم التقليدي
  const generateTodayReport = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayProd = productionHistory.filter(p => p.date === today);
    const total = todayProd.reduce((sum, p) => sum + parseFloat(p.totalActualCost || 0), 0);
    
    Swal.fire({
      title: '📊 تقرير مرتقبة اليوم',
      html: `
        <div style="text-align: right; font-family: 'Tajawal', sans-serif;">
          <p>عدد الورديات: <b>${todayProd.length}</b></p>
          <p>إجمالي التكلفة: <b>${total.toFixed(2)} ج.م</b></p>
          <p>أصناف المخزن حالياً: <b>${stock.length} صنف</b></p>
        </div>`,
      icon: 'info',
      confirmButtonText: 'حسناً'
    });
  };

  // 3. تحليل الذكاء الاصطناعي
  const analyzeWithAI = async () => {
    if (productionHistory.length === 0) {
      Swal.fire('تنبيه', 'لا توجد بيانات إنتاج كافية للتحليل حالياً', 'warning');
      return;
    }
    setIsAiLoading(true);
    try {
      const contextData = productionHistory.slice(-10).map(p => ({
        date: p.date,
        cost: p.totalActualCost,
        qty: p.products.reduce((s, pr) => s + pr.quantity, 0)
      }));

      const response = await CapacitorHttp.post({
        url: 'https://maamoul-one.vercel.app/api/raqqa-ai',
        headers: { 'Content-Type': 'application/json' },
        data: { 
          prompt: `حلل بيانات الإنتاج هذه لمصنع معمول: ${JSON.stringify(contextData)}` 
        }
      });

      const aiMessage = response.data?.message || "المحلل الذكي مشغول حالياً، حاول لاحقاً.";

      Swal.fire({
        title: '🤖 تحليل معمول الذكي',
        text: aiMessage,
        icon: 'success',
        confirmButtonText: 'فهمت'
      });
    } catch (error) {
      Swal.fire('خطأ', 'فشل الاتصال بمحرك معمول الذكي', 'error');
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
      
      {/* رأس الصفحة */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#2c3e50', margin: 0 }}>معمول <span style={{ color: '#e67e22' }}>راق</span></h1>
          <p style={{ color: '#7f8c8d', fontSize: '12px' }}>نظام إدارة الخامات والإنتاج</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={analyzeWithAI}
            disabled={isAiLoading}
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}
          >
            {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />} 
            AI
          </button>
          
          <button 
            onClick={generateTodayReport}
            style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <BarChart3 size={16} /> تقرير
          </button>
        </div>
      </header>

      {/* مؤشر الإنتاج */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '15px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
          <TrendingUp size={18} color="#e67e22" /> حركة الإنتاج الأخيرة
        </h3>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e67e22" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e67e22" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: '10px'}} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="كمية" stroke="#e67e22" strokeWidth={3} fillOpacity={1} fill="url(#colorQty)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* الأقسام - هنا يتم تمرير setActivePage للتنقل */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {sections.map((sec) => (
          <div 
            key={sec.id} 
            onClick={() => setActivePage(sec.id)} 
            style={{ 
              backgroundColor: '#fff', borderRadius: '18px', padding: '15px', 
              display: 'flex', alignItems: 'center', gap: '10px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', 
              borderRight: `5px solid ${sec.color}` 
            }}
          >
            <div style={{ color: sec.color }}>{sec.icon}</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>{sec.title}</div>
              {sec.id === 'inventory' && (
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{stock.length} صنف</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* جدول السجلات */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#3498db" /> السجل الزمني للإنتاج
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px' }}>
                <th style={{ padding: '8px' }}>التاريخ</th>
                <th style={{ padding: '8px' }}>المنتج</th>
                <th style={{ padding: '8px' }}>التكلفة</th>
              </tr>
            </thead>
            <tbody>
              {productionHistory.slice(-5).reverse().map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', fontSize: '12px' }}>
                  <td style={{ padding: '8px' }}>{log.date}</td>
                  <td style={{ padding: '8px' }}>{log.products?.[0]?.name || 'إنتاج متنوع'}</td>
                  <td style={{ padding: '8px', color: '#10b981', fontWeight: 'bold' }}>{log.totalActualCost} ج</td>
                </tr>
              ))}
              {productionHistory.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>لا توجد بيانات متاحة</td>
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
