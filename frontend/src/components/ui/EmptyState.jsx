import React from 'react';
import { Database } from 'lucide-react';

export function EmptyState({ title = "No data found", description = "We couldn't find any data matching your criteria." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-64 border border-dashed border-border rounded-xl bg-surface/20">
      <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-textSecondary">
        <Database size={24} />
      </div>
      <h3 className="text-lg font-semibold text-textPrimary mb-1">{title}</h3>
      <p className="text-sm text-textSecondary max-w-sm">{description}</p>
    </div>
  );
}
