
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { DetailedMetric } from '../types';

interface MetricCardProps {
  label: string;
  metric?: DetailedMetric;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  currency?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, metric, trend, highlight, currency }) => {
  const value = metric?.value;
  const basis = metric?.basis === 'Unconsolidated' ? 'Uncon' : metric?.basis === 'Consolidated' ? 'Con' : '';
  const page = metric?.page ? `Pg ${metric.page}` : '';
  const table = metric?.source_table ? metric.source_table.replace("Statement of", "").replace("Condensed Interim", "").trim() : '';

  // Helper to format the display value with currency
  const displayValue = () => {
    if (!value || value === 'data_missing' || value === '0') return 'N/A';
    
    // Check if the value already contains non-numeric characters (like $, PKR)
    // If it's mostly numeric (with commas/periods), prepend the currency
    const isNumeric = /^[\d,.-]+$/.test(value);
    
    if (currency && isNumeric) {
      return `${currency} ${value}`;
    }
    
    return value;
  };

  const hasMetadata = basis || page || table;

  return (
    <div className={`p-5 rounded-2xl border flex flex-col h-full justify-between transition-all duration-300 
      ${highlight 
        ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-md shadow-indigo-100/50 dark:from-indigo-900/40 dark:to-slate-900 dark:border-indigo-500/50 dark:shadow-none' 
        : 'bg-white border-slate-200 shadow-sm hover:shadow-md dark:bg-slate-900/50 dark:border-slate-800 dark:shadow-none'
      }`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
          {trend === 'up' && <div className="bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded-full"><TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" /></div>}
          {trend === 'down' && <div className="bg-red-50 dark:bg-red-900/30 p-1 rounded-full"><TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-500" /></div>}
          {trend === 'neutral' && <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full"><Minus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /></div>}
        </div>
        <div className={`text-2xl md:text-3xl font-extrabold tracking-tight break-words ${highlight ? 'text-indigo-950 dark:text-indigo-50' : 'text-slate-900 dark:text-slate-100'}`}>
          {displayValue()}
        </div>
      </div>
      
      {/* Source Metadata Footer */}
      {hasMetadata && value !== 'data_missing' && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-start gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          <Info className="w-3 h-3 mt-0.5 shrink-0 opacity-70" />
          <div className="leading-tight">
             {basis && <span className={`font-semibold ${basis === 'Uncon' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>{basis}</span>}
             {basis && (table || page) && <span> • </span>}
             {table && <span className="opacity-80 truncate max-w-[100px] inline-block align-bottom">{table}</span>}
             {table && page && <span> • </span>}
             {page && <span>{page}</span>}
          </div>
        </div>
      )}
    </div>
  );
};
