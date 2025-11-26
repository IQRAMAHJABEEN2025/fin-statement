
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GraphDataCollection } from '../types';

interface ChartsProps {
  data: GraphDataCollection;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl z-50">
        <p className="text-slate-900 dark:text-slate-200 font-mono text-xs mb-2 font-semibold">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="text-xs font-medium" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Smart formatter to keep Y-Axis labels compact and readable
const formatYAxis = (value: number) => {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value.toLocaleString();
};

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  // Transform simple arrays into Recharts object arrays
  const netProfitData = data.net_profit_trend.labels.map((label, i) => ({
    name: label,
    value: data.net_profit_trend.values[i],
  }));

  const epsData = data.eps_trend.labels.map((label, i) => ({
    name: label,
    value: data.eps_trend.values[i],
  }));

  const assetsData = data.assets_vs_liabilities.labels.map((label, i) => ({
    name: label,
    Assets: data.assets_vs_liabilities.assets[i],
    Liabilities: data.assets_vs_liabilities.liabilities[i],
  }));

  const depositsData = data.deposits_vs_advances.labels.map((label, i) => ({
    name: label,
    Deposits: data.deposits_vs_advances.deposits[i],
    Advances: data.deposits_vs_advances.advances[i],
  }));
  
  // Check if deposits/advances have valid data (sum > 0)
  const hasBankData = depositsData.some(d => (d.Deposits || 0) > 0);

  // Axis Color Helper
  const axisColor = "#94a3b8"; // slate-400
  
  // Common chart margin to prevent label cutoff
  const chartMargin = { top: 10, right: 10, left: 0, bottom: 0 };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Net Profit Chart */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 ml-2">Net Profit Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netProfitData} margin={chartMargin}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} />
              <YAxis 
                stroke={axisColor} 
                fontSize={11} 
                tickLine={false} 
                tickFormatter={formatYAxis} 
                width={50}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area type="monotone" dataKey="value" name="Net Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assets vs Liabilities */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 ml-2">Assets vs Liabilities</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetsData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} />
              <YAxis 
                stroke={axisColor} 
                fontSize={11} 
                tickLine={false} 
                tickFormatter={formatYAxis} 
                width={50} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              <Legend wrapperStyle={{ fontSize: '12px', color: axisColor }} />
              <Bar dataKey="Assets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Liabilities" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* EPS Trend */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 ml-2">Earnings Per Share (EPS)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={epsData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} />
              <YAxis 
                stroke={axisColor} 
                fontSize={11} 
                tickLine={false} 
                width={50} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line type="monotone" dataKey="value" name="EPS" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deposits vs Advances (Conditional) */}
      {hasBankData && (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-none">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 ml-2">Deposits vs Advances</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depositsData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis 
                  stroke={axisColor} 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={formatYAxis} 
                  width={50} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Legend wrapperStyle={{ fontSize: '12px', color: axisColor }} />
                <Bar dataKey="Deposits" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Advances" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
