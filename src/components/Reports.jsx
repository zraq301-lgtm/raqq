import React from 'react';
import * as XLSX from 'xlsx';
import { FileText, Download, ShoppingBag, Tag, ListOrdered, Warehouse, ArrowRight } from 'lucide-react';

// نمرر البيانات المركزية من App.jsx (inventory للمشتريات، salesData للمبيعات)
export default function Reports({ inventory = [], salesData = [], onBack }) {
  
  // 1. وظيفة تصدير تقرير المشتريات (مفصل بالتاريخ والوحدة والسداد)
  const exportPurchasesExcel = () => {
    if (inventory.length === 0) return alert("لا توجد بيانات مشتريات");

    const data = inventory.map(op => ({
      "التاريخ": op.date,
      "اسم الصنف": op.item,
      "الوحدة": op.unit,
      "الكمية": op.quantity,
      "سعر الوحدة": op.price,
      "الإجمالي": op.total,
      "المورد": op.supplier || 'غير محدد',
      "طريقة السداد": op.paymentMethod || 'كاش'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "سجل المشتريات");
    XLSX.writeFile(wb, `Purchases_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  // 2. وظيفة تصدير تقرير المبيعات (البيع والطلبات)
  const exportSalesExcel = () => {
    if (salesData.length === 0) return alert("لا توجد بيانات مبيعات");

    const data = salesData.map(sale => ({
      "التاريخ": sale.date,
      "العميل": sale.customerName || 'عميل نقدي',
      "الأصناف": sale.items?.map(i => i.name).join(' - '),
      "الإجمالي": sale.total,
      "الحالة": sale.isOrder ? "طلب (Order)" : "بيع مباشر"
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "سجل المبيعات");
    XLSX.writeFile(wb, `Sales_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const styles = {
    wrapper: { padding: '15px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' },
    header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '15px' },
    reportCard: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      borderRight: '6px solid'
    },
    btn: {
      width: '100%',
      padding: '12px',
      marginTop: '15px',
      borderRadius: '12px',
      border: 'none',
      color: '#fff',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button onClick={onBack} style={{border: 'none', background: '#eee', padding: '8px', borderRadius: '50%'}}>
          <ArrowRight size={20} />
        </button>
        <h2 style={{margin: 0}}>مركز التقارير</h2>
      </div>

      <div style={styles.grid}>
        
        {/* تقرير المشتريات */}
        <div style={{...styles.reportCard, borderRightColor: '#9b59b6'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <ShoppingBag color="#9b59b6" />
            <h3 style={{margin: 0, fontSize: '1.1rem'}}>تقرير المشتريات التفصيلي</h3>
          </div>
          <p style={{fontSize: '0.85rem', color: '#666', marginTop: '8px'}}>
            يشمل الصنف، الوحدة، السعر الإجمالي، وطريقة السداد (كاش/آجل).
          </p>
          <button onClick={exportPurchasesExcel} style={{...styles.btn, backgroundColor: '#9b59b6'}}>
            <Download size={18} /> تحميل سجل المشتريات (Excel)
          </button>
        </div>

        {/* تقرير المبيعات والطلبات */}
        <div style={{...styles.reportCard, borderRightColor: '#2ecc71'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Tag color="#2ecc71" />
            <h3 style={{margin: 0, fontSize: '1.1rem'}}>تقرير المبيعات والطلبات</h3>
          </div>
          <p style={{fontSize: '0.85rem', color: '#666', marginTop: '8px'}}>
            تقرير مزدوج يشمل المبيعات المباشرة وطلبات العملاء قيد التنفيذ.
          </p>
          <button onClick={exportSalesExcel} style={{...styles.btn, backgroundColor: '#2ecc71'}}>
            <Download size={18} /> تحميل سجل المبيعات (Excel)
          </button>
        </div>

        {/* تقرير جرد المخزن */}
        <div style={{...styles.reportCard, borderRightColor: '#3498db'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Warehouse color="#3498db" />
            <h3 style={{margin: 0, fontSize: '1.1rem'}}>تقرير الجرد العام</h3>
          </div>
          <p style={{fontSize: '0.85rem', color: '#666', marginTop: '8px'}}>
            عرض الأرصدة الحالية لكل الأصناف الموجودة في المخزن.
          </p>
          <button style={{...styles.btn, backgroundColor: '#3498db'}}>
            <Download size={18} /> تحميل أرصدة المخزن (Excel)
          </button>
        </div>

      </div>
    </div>
  );
}
