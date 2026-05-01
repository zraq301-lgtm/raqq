import React from 'react';
import * as XLSX from 'xlsx';
import { FileText, Download } from 'lucide-react';

export default function Reports({ categories = [] }) {
  
  // وظيفة تصدير ملف Excel
  const exportExcel = () => {
    // التحقق من وجود بيانات قبل التصدير
    if (!categories || categories.length === 0) {
      alert("لا توجد بيانات لتصديرها");
      return;
    }

    const data = categories.flatMap(cat => 
      (cat.operations || []).map(op => ({
        "القسم": cat.name,
        "التاريخ": op.date,
        "النوع": op.type === 'in' ? 'توريد' : 'سحب',
        "الكمية": op.amount,
        "الرصيد بعد العملية": op.finalBalance
      }))
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تقرير المخزن العام");
    XLSX.writeFile(wb, "Inventory_Report_2026.xlsx");
  };

  // كائن التنسيقات (CSS-in-JS)
  const styles = {
    wrapper: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      direction: 'rtl',
      fontFamily: "'Almarai', sans-serif",
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '32px 24px',
      borderRadius: '24px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      border: '1px solid #f1f5f9',
      textAlign: 'center',
    },
    iconContainer: {
      color: '#2563eb',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'center',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '8px',
      margin: '0 0 8px 0',
    },
    description: {
      fontSize: '0.9rem',
      color: '#64748b',
      marginBottom: '24px',
      lineHeight: '1.6',
    },
    downloadBtn: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '16px',
      fontWeight: '700',
      fontSize: '1rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
      transition: 'transform 0.1s ease',
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* أيقونة التقرير */}
        <div style={styles.iconContainer}>
          <FileText size={56} strokeWidth={1.5} />
        </div>

        <h2 style={styles.title}>التقارير المحاسبية</h2>
        
        <p style={styles.description}>
          يمكنك استخراج كافة حركات المخزن في ملف اكسل واحد 
          <br /> 
          منظم ومتوافق مع معايير الطباعة والجرد العام.
        </p>
        
        <button 
          onClick={exportExcel}
          style={styles.downloadBtn}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.97)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          <Download size={22} />
          تحميل سجل الجرد العام (Excel)
        </button>
      </div>
    </div>
  );
}
