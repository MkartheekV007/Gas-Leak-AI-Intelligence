import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Download, Filter, Eye } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

export default function DataTable({ columns, data, loading, page, totalPages, onPageChange, search, onSearchChange }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const exportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = data.map(row => columns.map(c => row[c.accessor] || '').join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((_, i) => i));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRow = (i) => {
    if (selectedRows.includes(i)) {
      setSelectedRows(selectedRows.filter(r => r !== i));
    } else {
      setSelectedRows([...selectedRows, i]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={16} />
          <Input 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records..."
            className="pl-9 h-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 text-xs font-medium" onClick={exportCSV}>
            <Download size={14} className="mr-2" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="h-10 text-xs font-medium">
            <Filter size={14} className="mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="h-10 text-xs font-medium">
            <Eye size={14} className="mr-2" /> Columns
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="border border-border rounded-xl overflow-hidden bg-surface flex-1 flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-textSecondary uppercase bg-black/20 border-b border-border sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <input type="checkbox" className="rounded border-border bg-black/40 text-primary focus:ring-primary h-4 w-4" 
                    onChange={toggleAll}
                    checked={data.length > 0 && selectedRows.length === data.length}
                  />
                </th>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-3.5 font-semibold tracking-wider cursor-pointer hover:text-textPrimary transition-colors">
                    <div className="flex items-center gap-1">
                      {col.header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-textSecondary">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-textSecondary">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className={`border-b border-border transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${selectedRows.includes(rowIdx) ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded border-border bg-black/40 text-primary focus:ring-primary h-4 w-4"
                        checked={selectedRows.includes(rowIdx)}
                        onChange={() => toggleRow(rowIdx)}
                      />
                    </td>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-textPrimary">
                        {col.cell ? col.cell(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-surface shrink-0">
          <span className="text-sm text-textSecondary">
            Page <span className="font-medium text-textPrimary">{page}</span> of <span className="font-medium text-textPrimary">{totalPages}</span>
            {selectedRows.length > 0 && <span className="ml-4 text-primary">{selectedRows.length} rows selected</span>}
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
