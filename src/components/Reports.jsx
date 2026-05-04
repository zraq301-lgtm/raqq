import React, { useState } from 'react';
import { ArrowRight, LayoutGrid } from 'lucide-react';

// استيراد كافة المكونات من المجلد الفرعي حسب الصورة
import CashReport from './Repourt/CashReport';
import CustomersReport from './Repourt/CustomersReport';
import ExpenseReports from './Repourt/ExpenseReports';
import PurchaseReportCard from './Repourt/PurchaseReportCard';
import SalesReportCard from './Repourt/SalesReportCard';
import StaffReports from './Repourt/StaffReports';
import SuppliersReport from './Repourt/SuppliersReport';

const Reports = ({ inventory, salesData, expenses, staffData, onBack }) => {
  // الحالة للتحكم في التقرير المعروض حالياً
  const [activeSubReport, setActiveSubReport] = useState('main');

  // مصفوفة لتنظيم كروت التقارير بشكل آلي
  const reportCards = [
    { id: 'cash', title: 'تقرير النقدي', icon: '💰', color: '#e67e22', component: CashReport },
    { id: 'purchases', title: 'تقرير المشتريات', icon: '🛒', color: '#9b59b6', component: PurchaseReportCard },
    { id: 'sales', title: 'تقرير المبيعات', icon: '📈', color: '#2ecc71', component: SalesReportCard },
    { id: 'expenses', title: 'تقرير المصروفات', icon: '💸', color: '#e74c3c', component: ExpenseReports },
    { id: 'staff', title: 'تقرير العمال', icon: '👷', color: '#27ae60', component: StaffReports },
    { id: 'customers', title: 'تقرير العملاء', icon: '👥', color: '#3498db', component: CustomersReport },
    { id: 'suppliers', title: 'تقرير الموردين', icon: '🚛', color: '#34495e', component: SuppliersReport },
  ];

  // دالة الرجوع للقائمة الرئيسية للتقارير
  const goBackToMenu = () => setActiveSubReport('main');

  // منطق عرض التقارير التفصيلية
  if (activeSubReport !== 'main') {
    const selected = reportCards.find(r => r.id === activeSubReport);
    const ReportComponent = selected.component;

    return (
      <ReportComponent 
        inventory={inventory} 
        salesData={salesData} 
        expenses={expenses} 
        staffData={staffData} 
        expensesData={expenses} // لضمان التوافق مع مسمى البروبس في بعض المكونات
        onBack={goBackToMenu} 
      />
    );
  }

  // واجهة الشبكة الرئيسية (Grid)
  return (
    <div style={{ padding: '15px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <button onClick={onBack} style={{ border: 'none', background: '#eee', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
          <ArrowRight size={20} />
        </button>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>مركز التقارير المحاسبية</h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '15px' 
      }}>
        {reportCards.map((card) => (
          <div 
            key={card.id}
            onClick={() => setActiveSubReport(card.id)}
            style={{
              background: 'white',
              padding: '20px 10px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              borderBottom: `4px solid ${card.color}`,
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{card.icon}</div>
            <div style={{ fontWeight: 'bold', color: '#34495e', fontSize: '0.9rem' }}>{card.title}</div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '15px', 
        textAlign: 'center',
        border: '1px dashed #ddd'
      }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f8c8d' }}>
          جميع التقارير يتم استخراجها بصيغة Excel مطورة.
        </p>
      </div>
    </div>
  );
};

export default Reports;
