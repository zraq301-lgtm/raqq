import React from 'react';
// استدعاء التنسيقات لضمان حجم الكروت الكبير
import '../App.css'; 
import { 
  ShoppingCart, Tag, Factory, Warehouse, Trash2, 
  Wallet, Truck, RotateCcw, BarChart3, FileText, Users 
} from 'lucide-react';

const Dashboard = ({ setActivePage }) => {
  // تعريف الأقسام - تأكد أن id المشتريات هو 'purchases' بالضبط
  const sections = [
    { id: 'purchases', title: 'المشتريات', icon: <ShoppingCart size={35} />, color: '#9b59b6' },
    { id: 'sales', title: 'المبيعات', icon: <Tag size={35} />, color: '#2ecc71' },
    { id: 'production', title: 'الإنتاج', icon: <Factory size={35} />, color: '#e67e22' },
    { id: 'inventory', title: 'المخزن', icon: <Warehouse size={35} />, color: '#3498db' },
    { id: 'waste', title: 'الهالك', icon: <Trash2 size={35} />, color: '#e74c3c' },
    { id: 'expenses', title: 'المصروفات', icon: <Wallet size={35} />, color: '#7f8c8d' },
    { id: 'suppliers', title: 'الموردين', icon: <Truck size={35} />, color: '#34495e' },
    { id: 'returns', title: 'المرتجع', icon: <RotateCcw size={35} />, color: '#d35400' },
    { id: 'financials', title: 'قوائم مالية', icon: <BarChart3 size={35} />, color: '#16a085' },
    { id: 'reports', title: 'التقارير', icon: <FileText size={35} />, color: '#2980b9' },
    { id: 'customers', title: 'العملاء', icon: <Users size={35} />, color: '#27ae60' },
  ];

  return (
    <div className="page-content" style={{ padding: '15px', direction: 'rtl' }}>
      {/* رأس الصفحة مع اسم التطبيق */}
      <header style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#2c3e50', fontWeight: '800' }}>
          معمول <span style={{ color: '#e67e22' }}>راق</span>
        </h1>
      </header>

      {/* شبكة الأقسام */}
      <div className="grid-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // كرتين في كل صف للموبايل
        gap: '15px'
      }}>
        {sections.map((sec) => (
          <div 
            key={sec.id} 
            className="card" 
            onClick={() => {
                console.log("الانتقال إلى قسم:", sec.id); // للتأكد من العمل في المتصفح
                setActivePage(sec.id);
            }}
            style={{ 
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '30px 10px', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
              borderTop: `6px solid ${sec.color}`,
              cursor: 'pointer'
            }}
          >
            <div style={{ color: sec.color, marginBottom: '10px' }}>{sec.icon}</div>
            <span style={{ 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              color: '#34495e' 
            }}>
              {sec.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
