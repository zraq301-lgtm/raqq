import React from 'react';
import * as XLSX from 'xlsx';
import { FileText, Download, Share2 } from 'lucide-react';

export default function Reports({ categories }) {
  const exportExcel = () => {
    const data = categories.flatMap(cat => 
      cat.operations.map(op => ({
        "القسم": cat.name,
        "التاريخ": op.date,
        "النوع": op.type,
        "الكمية": op.amount,
        "الرصيد بعد العملية": op.finalBalance
      }))
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تقرير المخزن العام");
    XLSX.writeFile(wb, "Inventory_Report_2026.xlsx");
  };

  return (
    <div className="p-4 space-y-4 text-right">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
        <FileText className="mx-auto text-blue-500 mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2">التقارير المحاسبية</h2>
        <p className="text-gray-500 text-sm mb-6">يمكنك استخراج كافة حركات المخزن في ملف اكسل واحد متوافق مع الطباعة</p>
        
        <button 
          onClick={exportExcel}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
        >
          <Download size={20} /> تحميل سجل الجرد العام (Excel)
        </button>
      </div>
    </div>
  );
}
