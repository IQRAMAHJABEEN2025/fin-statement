
import React from 'react';
import { Bot, CheckCircle2, CircleDashed, Cpu, FileSearch, LineChart, ShieldCheck, Wallet } from 'lucide-react';
import { AgentLog } from '../types';

interface AgentStatusProps {
  logs: AgentLog[];
}

const AgentRow: React.FC<{ log: AgentLog }> = ({ log }) => {
  const isComplete = log.status === 'complete';
  const isActive = log.status === 'active';

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-500 mb-3
      ${isActive 
        ? 'bg-white border-blue-200 shadow-lg shadow-blue-500/10 scale-105 z-10 dark:bg-blue-950/30 dark:border-blue-500/50' 
        : isComplete 
          ? 'bg-slate-50 border-slate-200 opacity-80 dark:bg-emerald-950/20 dark:border-emerald-500/30 dark:opacity-60' 
          : 'bg-slate-50 border-slate-100 opacity-50 dark:bg-slate-900 dark:border-slate-800 dark:opacity-40'
    }`}>
      <div className={`p-2 rounded-full shrink-0 
        ${isActive 
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' 
          : isComplete 
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
            : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
      }`}>
        {getIconForAgent(log.agent)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className={`text-sm font-bold truncate pr-2
            ${isActive 
              ? 'text-slate-900 dark:text-blue-200' 
              : 'text-slate-700 dark:text-slate-300'
            }`}>
            {log.agent}
          </h4>
          {isActive && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 animate-pulse whitespace-nowrap">Thinking...</span>}
          {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        </div>
        <p className={`text-xs truncate
          ${isActive 
            ? 'text-slate-600 dark:text-blue-300/80' 
            : 'text-slate-500 dark:text-slate-400'
          }`}>
          {log.message}
        </p>
      </div>
    </div>
  );
};

const getIconForAgent = (name: string) => {
  if (name.includes("Classifier")) return <FileSearch size={18} />;
  if (name.includes("Extractor")) return <Cpu size={18} />;
  if (name.includes("Metrics")) return <LineChart size={18} />;
  if (name.includes("Trend")) return <Wallet size={18} />;
  if (name.includes("Graph")) return <LineChart size={18} />;
  if (name.includes("Summary")) return <Bot size={18} />;
  if (name.includes("Validation")) return <ShieldCheck size={18} />;
  return <Bot size={18} />;
};

export const AgentStatus: React.FC<AgentStatusProps> = ({ logs }) => {
  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          AI Workflow
        </h3>
        <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
          <CircleDashed className="w-4 h-4 text-blue-600 dark:text-blue-500 animate-spin" />
        </div>
      </div>
      <div className="space-y-1">
        {logs.map((log) => (
          <AgentRow key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
};
