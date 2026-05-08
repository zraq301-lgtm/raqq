import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Plus, Trash2, Save, ArrowRight, Copy, Check } from 'lucide-react';

const EditableCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full bg-transparent outline-none p-1 text-center border-none focus:bg-blue-50 transition-colors"
    />
  );
};

const DataEntryGrid = ({ onBack, onSave, initialData = [] }) => {
  const [data, setData] = useState(() =>
    initialData.length > 0 ? initialData : [{ name: '', balance: 0, price: 0, unit: 'وحدة' }]
  );
  const [copied, setCopied] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'اسم الصنف',
        cell: EditableCell,
      },
      {
        accessorKey: 'balance',
        header: 'الكمية / الرصيد',
        cell: EditableCell,
      },
      {
        accessorKey: 'price',
        header: 'سعر الوحدة',
        cell: EditableCell,
      },
      {
        accessorKey: 'unit',
        header: 'الوحدة',
        cell: EditableCell,
      },
      {
        id: 'actions',
        header: 'إجراءات',
        cell: ({ row }) => (
          <button
            onClick={() => deleteRow(row.index)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  const addRow = () => {
    setData([...data, { name: '', balance: 0, price: 0, unit: 'وحدة' }]);
  };

  const deleteRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const rows = paste.split('\n').filter(row => row.trim() !== '');

    const newData = rows.map(row => {
      const cells = row.split('\t');
      return {
        name: cells[0] || '',
        balance: parseFloat(cells[1]) || 0,
        price: parseFloat(cells[2]) || 0,
        unit: cells[3] || 'وحدة'
      };
    });

    setData([...data.filter(r => r.name !== ''), ...newData]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rtl font-sans bg-gray-50 min-h-screen" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <Copy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">إدخال بيانات سريع (Excel)</h2>
        </div>
        <button onClick={onBack} className="bg-white p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-all shadow-sm">
          <ArrowRight size={20} />
        </button>
      </div>

      <div
        onPaste={handlePaste}
        className={`mb-5 p-4 rounded-xl border-2 border-dashed transition-all text-center ${
          copied ? 'bg-green-50 border-green-400 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}
      >
        {copied ? (
          <span className="flex items-center justify-center gap-2 font-bold">
            <Check size={18}/> تم اللصق من الحافظة بنجاح!
          </span>
        ) : (
          <p className="flex flex-col gap-1">
            <span className="font-bold">نظام اللصق الذكي مفعل</span>
            <span className="text-sm opacity-80">انسخ البيانات من Excel والصقها هنا مباشرة (Ctrl+V)</span>
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-right text-gray-500 font-bold border-b border-gray-100 text-sm">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b border-gray-50">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={addRow}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <Plus size={18} /> إضافة صنف جديد
        </button>
        <button
          onClick={() => onSave(data)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Save size={18} /> اعتماد وحفظ في المخزن
        </button>
      </div>
    </div>
  );
};

export default DataEntryGrid;
