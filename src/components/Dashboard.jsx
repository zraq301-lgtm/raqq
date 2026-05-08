import React, { useRef } from 'react';
import '../App.css'; 
import { 
  ShoppingCart, Tag, Factory, Warehouse, Trash2, 
  Wallet, Truck, BarChart3, FileText, Users,
  TrendingUp, AlertTriangle, Download, Upload
} from 'lucide-react';

const Dashboard = ({ setActivePage, salesData = [], stock = [], allData, onImportData }) => {
  const fileInputRef = useRef(null);

  // حساب إحصائيات سريعة
  const today = new Date().toISOString().split('T')[0];
  const todaySales = (salesData || [])
    .filter(s => s.date === today)
    .reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);

  const lowStockItems = (stock || []).filter(item => (item.balance || 0) < 5).length;

  const sections = [
    { id: 'sales', title: 'المبيعات (كاشير)', icon: <Tag size={30} />, color: '#2ecc71' },
    { id: 'purchases', title: 'المشتريات', icon: <ShoppingCart size={30} />, color: '#9b59b6' },
    { id: 'production', title: 'الإنتاج', icon: <Factory size={30} />, color: '#e67e22' },
    { id: 'inventory', title: 'المخزن', icon: <Warehouse size={30} />, color: '#3498db' },
    { id: 'waste', title: 'الهالك', icon: <Trash2 size={30} />, color: '#e74c3c' },
    { id: 'expenses', title: 'المصروفات', icon: <Wallet size={30} />, color: '#7f8c8d' },
    { id: 'suppliers', title: 'الموردين', icon: <Truck size={30} />, color: '#34495e' },
    { id: 'customers', title: 'العملاء', icon: <Users size={30} />, color: '#27ae60' },
    { id: 'financials', title: 'قوائم مالية', icon: <BarChart3 size={30} />, color: '#16a085' },
    { id: 'reports', title: 'التقارير', icon: <FileText size={30} />, color: '#2980b9' },
  ];

  const exportData = () => {
    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `mamoul_backup_${today}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onImportData(data);
          alert('تم استيراد البيانات بنجاح!');
        } catch (error) {
          alert('خطأ في قراءة الملف!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="page-content" style={{ padding: '15px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* رأس الصفحة مع إحصائيات سريعة */}
      <header style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#1e293b', fontWeight: '800', margin: 0 }}>
              معمول <span style={{ color: '#e67e22' }}>راق</span>
            </h1>
            <p style={{ color: '#64748b', margin: 0 }}>نظام الإدارة المتكامل</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportData} title="نسخة احتياطية" style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#64748b' }}>
              <Download size={20} />
            </button>
            <button onClick={() => fileInputRef.current.click()} title="استعادة بيانات" style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#64748b' }}>
              <Upload size={20} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImport} style={{ display: 'none' }} accept=".json" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)', padding: '15px', borderRadius: '20px', color: 'white', boxShadow: '0 4px 12px rgba(46, 204, 113, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '0.9rem' }}>
              <TrendingUp size={16} /> مبيعات اليوم
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '5px' }}>{todaySales} ج.م</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f39c12, #d35400)', padding: '15px', borderRadius: '20px', color: 'white', boxShadow: '0 4px 12px rgba(243, 156, 18, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '0.9rem' }}>
              <AlertTriangle size={16} /> نواقص المخزن
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '5px' }}>{lowStockItems} أصناف</div>
          </div>
        </div>
      </header>

      {/* شبكة الأقسام - Grid */}
      <div className="grid-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px'
      }}>
        {sections.map((sec) => (
          <div 
            key={sec.id} 
            className="card" 
            onClick={() => setActivePage(sec.id)}
            style={{ 
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '20px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              border: '1px solid #f1f5f9',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              backgroundColor: `${sec.color}15`,
              color: sec.color,
              padding: '12px',
              borderRadius: '15px',
              marginBottom: '10px'
            }}>
              {sec.icon}
            </div>
            <span style={{ 
              fontSize: '1rem',
              fontWeight: 'bold', 
              color: '#334155'
            }}>
              {sec.title}
            </span>
          </div>
        ))}
      </div>

      <div style={{ height: '30px' }}></div>
    </div>
  );
};

export default Dashboard;
