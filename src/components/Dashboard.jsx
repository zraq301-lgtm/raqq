import React from 'react';
import { 
  ShoppingCart, Tag, Factory, Warehouse, Trash2, 
  Wallet, Truck, RotateCcw, BarChart3, FileText, Users 
} from 'lucide-react';

const Dashboard = ({ activePage, setActivePage }) => {
  // تعريف الأقسام الـ 11 بناءً على صورتك المحللة
  const sections = [
    { id: 'purchases', title: 'المشتريات', icon: <ShoppingCart />, color: '#9b59b6' },
    { id: 'sales', title: 'المبيعات', icon: <Tag />, color: '#2ecc71' },
    { id: 'production', title: 'الإنتاج', icon: <Factory />, color: '#e67e22' },
    { id: 'inventory', title: 'المخزن', icon: <Warehouse />, color: '#3498db' },
    { id: 'waste', title: 'الهالك', icon: <Trash2 />, color: '#e74c3c' },
    { id: 'expenses', title: 'المصروفات', icon: <Wallet />, color: '#7f8c8d' },
    { id: 'suppliers', title: 'الموردين', icon: <Truck />, color: '#34495e' },
    { id: 'returns', title: 'المرتجع', icon: <RotateCcw />, color: '#d35400' },
    { id: 'financials', title: 'قوائم مالية', icon: <BarChart3 />, color: '#16a085' },
    { id: 'reports', title: 'التقارير', icon: <FileText />, color: '#2980b9' },
    { id: 'customers', title: 'العملاء', icon: <Users />, color: '#27ae60' },
  ];

  return (
    <div className="page-content">
      <div className="grid-container">
        {sections.map((sec) => (
          <div 
            key={sec.id} 
            className="card" 
            onClick={() => setActivePage(sec.id)}
            style={{ borderTop: `5px solid ${sec.color}`, cursor: 'pointer' }}
          >
            <div style={{ color: sec.color }}>{sec.icon}</div>
            <span className="card-title">{sec.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
