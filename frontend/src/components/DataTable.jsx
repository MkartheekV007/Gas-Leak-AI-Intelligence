import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { EmptyState } from './ui/EmptyState';
import { RiskBadge } from './ui/RiskBadge';

export default function DataTable({ endpoint, columns, title }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total_pages: 1, total_items: 0, page_size: 10 });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${endpoint}?page=${page}&page_size=${pagination.page_size}&search=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page]);

  const renderCell = (row, col) => {
    const val = row[col.key];
    if (col.key === 'Risk_Level') {
      return <RiskBadge level={val} />;
    }
    return val;
  };

  return (
    <Card className="flex flex-col w-full">
      <div className="flex justify-between items-center flex-wrap gap-4 p-6 border-b border-border">
        <h2 className="text-xl font-bold text-textPrimary">{title}</h2>
        <div className="relative w-full max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
          <Input 
            type="text" 
            placeholder="Search records..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-6">
        {error ? (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger mb-4">
            <p className="font-medium">⚠️ Error fetching data</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        ) : loading && data.length === 0 ? (
          <LoadingSkeleton rows={5} />
        ) : data.length === 0 ? (
          <EmptyState title="No records found" description="Try adjusting your search criteria." />
        ) : (
          <>
            <div className="rounded-xl border border-border overflow-hidden bg-black/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-surface/50 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      {columns.map(col => (
                        <th key={col.key} className="px-6 py-4 font-semibold text-textSecondary cursor-pointer hover:text-textPrimary transition-colors group">
                          <div className="flex items-center gap-2">
                            {col.label}
                            <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.map((row, i) => (
                      <tr 
                        key={i} 
                        className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors even:bg-white/[0.02]"
                      >
                        {columns.map(col => (
                          <td key={col.key} className="px-6 py-4 text-textPrimary">
                            {renderCell(row, col)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <span className="text-sm text-textSecondary">
                Showing <span className="font-medium text-textPrimary">{data.length > 0 ? (page - 1) * pagination.page_size + 1 : 0}</span> to <span className="font-medium text-textPrimary">{Math.min(page * pagination.page_size, pagination.total_items)}</span> of <span className="font-medium text-textPrimary">{pagination.total_items}</span> results
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={16} className="mr-1" /> Prev
                </Button>
                <div className="flex items-center justify-center min-w-[4rem] text-sm font-medium text-textPrimary">
                  {page} / {pagination.total_pages || 1}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  disabled={page === pagination.total_pages || pagination.total_pages === 0}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
