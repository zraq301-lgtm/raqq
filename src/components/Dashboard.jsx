import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, TrendingUp, Package, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const Dashboard = ({ categories }) => {
  
  // دالة احترافية لتجميع البيانات ومعالجتها مثل نظام الإكسل
  const chartData = useMemo(() => {
    const dailyStats = {};

    categories.forEach(cat => {
      cat.operations.forEach(op => {
        const date = op.date; // التاريخ (اليوم)
        if (!dailyStats[date]) {
          dailyStats[date] = { date, additions: 0, withdrawals: 0 };
        }
        
        // تصنيف العمليات (إضافة أو سحب)
        if (op.type.includes('شراء') || op.type.includes('إضافة')) {
          dailyStats[date].additions += op.amount;
        } else if (op.type.includes('إنتاج') || op.type.includes('سحب')) {
          dailyStats[date].withdrawals += op.amount;
        }
      });
    });

    // تحويل البيانات لمصفوفة مرتبة زمنياً للرسم البياني
    return Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [categories]);

  // حساب الإحصائيات العامة
  const totalStock = categories.reduce((acc, cat) => acc + cat.balance, 0);
  const totalCats = categories.length;

  const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    card: { background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' },
    chartContainer: { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '400px', marginBottom: '30px' },
    iconBox: (color) => ({ padding: '12px', borderRadius: '12px', backgroundColor: `${color}15`, color: color })
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Tajawal', sans-serif" }}>
      
      {/* كروت الإحصائيات السريعة */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.iconBox('#2563eb')}><Package size={24} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>إجمالي المخزون</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{totalStock}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.iconBox('#9b59b6')}><Activity size={24} /></div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>عدد الأقسام</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{totalCats}</h3>
          </div>
        </div>
      </div>

      {/* الرسم البياني الزمني (مثل نظام الإكسل) */}
      <div style={styles.chartContainer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <TrendingUp color="#2563eb" />
          <h3 style={{ margin: 0 }}>النشاط البياني للعمليات اليومية</h3>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAdd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Area 
              name="الإضافات (شراء)" 
              type="monotone" 
              dataKey="additions" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorAdd)" 
              strokeWidth={3}
            />
            <Area 
              name="السحب (إنتاج)" 
              type="monotone" 
              dataKey="withdrawals" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorWith)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* جدول العمليات الأخير */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>سجل النشاط الموحد</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
              <th style={{ padding: '12px' }}>التاريخ</th>
              <th>القسم</th>
              <th>العملية</th>
              <th>الكمية</th>
            </tr>
          </thead>
          <tbody>
            {categories.flatMap(cat => cat.operations.map(op => ({...op, catName: cat.name})))
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5) // عرض آخر 5 عمليات فقط
              .map((op, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{op.date}</td>
                  <td style={{ fontWeight: 'bold' }}>{op.catName}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      backgroundColor: op.type.includes('سحب') ? '#fff1f2' : '#f0fdf4',
                      color: op.type.includes('سحب') ? '#e11d48' : '#16a34a'
                    }}>
                      {op.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{op.amount}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
