import React from 'react';
import '../App.css'; 
import { 
  ShoppingCart, Tag, Factory, Warehouse, Trash2, 
  Wallet, Truck, RotateCcw, BarChart3, FileText, Users 
} from 'lucide-react';

const Dashboard = ({ setActivePage }) => {
  const sections = [
    { id: 'purchases', title: 'المشتريات', icon: <ShoppingCart size={32} />, color: '#9b59b6' },
    { id: 'sales', title: 'المبيعات', icon: <Tag size={32} />, color: '#2ecc71' },
    { id: 'production', title: 'الإنتاج', icon: <Factory size={32} />, color: '#e67e22' },
    { id: 'inventory', title: 'المخزن', icon: <Warehouse size={32} />, color: '#3498db' },
    { id: 'waste', title: 'الهالك', icon: <Trash2 size={32} />, color: '#e74c3c' },
    { id: 'expenses', title: 'المصروفات', icon: <Wallet size={32} />, color: '#7f8c8d' },
    { id: 'suppliers', title: 'الموردين', icon: <Truck size={32} />, color: '#34495e' },
    { id: 'returns', title: 'المرتجع', icon: <RotateCcw size={32} />, color: '#d35400' },
    { id: 'financials', title: 'قوائم مالية', icon: <BarChart3 size={32} />, color: '#16a085' },
    { id: 'reports', title: 'التقارير', icon: <FileText size={32} />, color: '#2980b9' },
    { id: 'customers', title: 'العملاء', icon: <Users size={32} />, color: '#27ae60' },
  ];

  return (
    <div className="page-content" style={{ padding: '10px', direction: 'rtl' }}>
      {/* اسم التطبيق الجديد */}
      <header style={{ 
        textAlign: 'center', 
        padding: '20px 0', 
        marginBottom: '10px' 
      }}>
        <h1 style={{ 
          margin: 0, 
          color: '#2c3e50', 
          fontSize: '2rem', 
          fontWeight: '800',
          fontFamily: 'Tajawal, sans-serif'
        }}>
          معمول <span style={{ color: '#e67e22' }}>راق</span>
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: '5px 0' }}>نظام إدارة الإنتاج والمخازن</p>
      </header>

      {/* الحاويات مع تكبير الحجم */}
      <div className="grid-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        padding: '5px'
      }}>
        {sections.map((sec) => (
          <div 
            key={sec.id} 
            className="card" 
            onClick={() => setActivePage(sec.id)}
            style={{ 
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px 15px', // زيادة المسافات الداخلية لتكبير الكرت
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              borderTop: `6px solid ${sec.color}`,
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            <div style={{ color: sec.color }}>{sec.icon}</div>
            <span style={{ 
              fontSize: '1.1rem', // تكبير حجم الخط
              fontWeight: 'bold', 
              color: '#34495e',
              fontFamily: 'Tajawal, sans-serif'
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
