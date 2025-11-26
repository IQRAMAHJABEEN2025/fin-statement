
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { FinancialReportResponse, FinancialDataPoint, GraphDataCollection } from '../types';
import { MetricCard } from './MetricCard';
import { Charts } from './Charts';
import { downloadDashboardImage, generateCompressedBase64 } from '../services/pdfExport';
import { saveAnalysisToHistory } from '../services/historyService';
import { auth } from '../firebaseConfig';
import { 
  Activity, Building, Scale, Files, ImageIcon, BookOpen, Loader2, AlertTriangle, Save, CheckCircle2, Layers
} from 'lucide-react';
import { Footer } from './Footer';

interface DashboardProps {
  data: FinancialReportResponse;
  onReset: () => void;
  savedReportIds: Set<string>;
  onMarkAsSaved: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset, savedReportIds, onMarkAsSaved }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const isSavingProcessRef = useRef(false);

  // Entity Type Check
  const isNonBank = data.file_info?.entity_type === 'Non-Bank';
  
  // Periods
  const periods = data.file_info?.periods_detected || [];
  let latestPeriod = periods.length > 0 ? periods[0] : '';
  const currency = data.file_info?.currency_symbol || "";

  // --- DATA PREPARATION ---
  
  // 1. Consolidated Data
  const conPoints = data.consolidated_data?.financial_data_points || [];
  const hasConData = conPoints.length > 0;
  const conLatest = conPoints.find(p => p.period === latestPeriod) || conPoints[0];

  // 2. Unconsolidated Data
  const unconPoints = data.unconsolidated_data?.financial_data_points || [];
  const hasUnconData = unconPoints.length > 0;
  const unconLatest = unconPoints.find(p => p.period === latestPeriod) || unconPoints[0];

  // Helper to generate graphs for a specific dataset
  const generateGraphs = (points: FinancialDataPoint[]): GraphDataCollection => {
    const sorted = [...points].reverse(); 
    const parse = (v?: string) => {
      if (!v || v === 'data_missing' || v === 'N/A') return 0;
      return parseFloat(v.replace(/[^0-9.-]/g, '')) || 0;
    };

    return {
      net_profit_trend: { labels: sorted.map(p => p.period), values: sorted.map(p => parse(p.net_profit?.value)) },
      revenue_trend: { labels: sorted.map(p => p.period), values: sorted.map(p => parse(p.revenue?.value)) },
      eps_trend: { labels: sorted.map(p => p.period), values: sorted.map(p => parse(p.eps?.value)) },
      assets_vs_liabilities: { 
        labels: sorted.map(p => p.period), 
        assets: sorted.map(p => parse(p.total_assets?.value)),
        liabilities: sorted.map(p => parse(p.total_liabilities?.value))
      },
      deposits_vs_advances: { 
        labels: sorted.map(p => p.period), 
        deposits: sorted.map(p => parse(p.deposits?.value)),
        advances: sorted.map(p => parse(p.advances?.value))
      }
    };
  };

  const conGraphData = useMemo(() => generateGraphs(conPoints), [conPoints]);
  const unconGraphData = useMemo(() => generateGraphs(unconPoints), [unconPoints]);

  const uniqueReportId = `${data.file_info?.company_name}_${latestPeriod}`;

  // Check if this report is already saved
  const isAlreadySaved = savedReportIds.has(uniqueReportId);

  // --- ACTIONS ---

  const handleDownload = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      // Capture the MAIN dashboard content div which now has everything stacked
      await downloadDashboardImage('dashboard-content-capture', `${data.file_info?.company_name || 'Report'}_Full_Analysis.png`);
      setIsExporting(false);
    }, 500);
  };

  const handleSaveToHistory = useCallback(async () => {
    if (!auth.currentUser || !data) return;
    
    // Prevent double saving logic using Parent Prop
    if (savedReportIds.has(uniqueReportId)) {
        console.log("Report already saved (Checked in parent). Skipping.");
        setSaveSuccess(true); 
        return;
    }
    if (isSavingProcessRef.current) return;

    isSavingProcessRef.current = true;
    setIsSavingHistory(true);
    setSaveSuccess(false);

    try {
      // Capture the visible dashboard (which is now stacked)
      const base64Image = await generateCompressedBase64('dashboard-content-capture');
      
      if (base64Image) {
        await saveAnalysisToHistory(
          auth.currentUser.uid, 
          base64Image, 
          data.file_info?.company_name || 'Unknown Company',
          latestPeriod,
          auth.currentUser.email || undefined
        );
        
        // Notify Parent that this ID is saved
        onMarkAsSaved(uniqueReportId);
        setSaveSuccess(true);
      } else {
        console.error("Could not generate dashboard preview.");
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsSavingHistory(false);
      isSavingProcessRef.current = false;
    }
  }, [uniqueReportId, data, latestPeriod, savedReportIds, onMarkAsSaved]);

  // --- AUTOMATIC SAVE EFFECT ---
  useEffect(() => {
    if (auth.currentUser && data && uniqueReportId) {
      // Use the Prop from Parent to check save status
      if (!savedReportIds.has(uniqueReportId)) {
        const timer = setTimeout(() => {
          handleSaveToHistory();
        }, 2000); // 2s delay
        return () => clearTimeout(timer);
      } else {
          setSaveSuccess(true);
      }
    }
  }, [uniqueReportId, handleSaveToHistory, data, savedReportIds]);


  const calculateDiff = (val1?: string, val2?: string) => {
    if (!val1 || !val2 || val1 === 'data_missing' || val2 === 'data_missing') return null;
    const n1 = parseFloat(val1.replace(/[^0-9.-]/g, ''));
    const n2 = parseFloat(val2.replace(/[^0-9.-]/g, ''));
    if (isNaN(n1) || isNaN(n2)) return null;
    return n1 - n2;
  };

  const conUnconDiff = calculateDiff(conLatest?.net_profit?.value, unconLatest?.net_profit?.value);


  // --- RENDER SECTION HELPER ---
  const renderMetricsSection = (
      title: string, 
      subTitle: string,
      metrics: FinancialDataPoint | undefined, 
      graphData: GraphDataCollection, 
      themeColor: 'indigo' | 'slate'
  ) => {
    if (!metrics) return null;

    const isIndigo = themeColor === 'indigo';

    return (
      <div className={`rounded-2xl border mb-10 overflow-hidden ${isIndigo ? 'bg-indigo-50/30 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/30' : 'bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800'}`}>
        {/* Section Header */}
        <div className={`px-6 py-4 border-b flex items-center gap-3 ${isIndigo ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-800'}`}>
           <div className={`p-2 rounded-lg ${isIndigo ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
             <Layers className="w-5 h-5" />
           </div>
           <div>
             <h2 className={`text-lg font-bold ${isIndigo ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>{title}</h2>
             <p className={`text-xs font-medium ${isIndigo ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>{subTitle}</p>
           </div>
        </div>

        <div className="p-6 space-y-8">
           {/* Metrics Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                label={isNonBank ? "Total Revenue" : "Interest Earned"}
                metric={metrics.revenue} 
                trend="up" 
                currency={currency}
              />
              
              {isNonBank ? (
                <MetricCard 
                  label="Gross Profit"
                  metric={metrics.gross_profit} 
                  trend="up" 
                  currency={currency}
                />
              ) : (
                <MetricCard 
                  label="Net Interest Income"
                  metric={metrics.net_markup_income} 
                  trend="up" 
                  currency={currency}
                />
              )}

              <MetricCard 
                label="Net Profit (PAT)" 
                metric={metrics.net_profit} 
                trend="up" 
                highlight={isIndigo} 
                currency={currency}
              />

              <MetricCard 
                label="EPS" 
                metric={metrics.eps} 
                trend="neutral" 
                currency={currency}
              />
              
              {/* Row 2 */}
              <MetricCard 
                label="Return on Equity" 
                metric={metrics.return_on_equity} 
                trend="up" 
              />
               <MetricCard 
                label="Return on Assets" 
                metric={metrics.return_on_assets} 
                trend="neutral" 
              />
               <MetricCard 
                label="Assets" 
                metric={metrics.total_assets} 
                trend="up" 
                currency={currency}
              />
               <MetricCard 
                label="Liabilities" 
                metric={metrics.total_liabilities} 
                trend="down" 
                currency={currency}
              />
           </div>

           {/* Charts */}
           <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4 mt-2">
                <Activity className={`w-4 h-4 ${isIndigo ? 'text-indigo-500' : 'text-slate-500'}`} />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isIndigo ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>Historical Trends ({title})</h3>
              </div>
              <Charts data={graphData} />
           </div>
        </div>
      </div>
    );
  };


  return (
    <div className="transition-all duration-300 flex flex-col min-h-full bg-slate-50 dark:bg-slate-950">
      
      {/* ---------------- GLOBAL HEADER ---------------- */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0">
        
        {/* Title & Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
             <span className="text-blue-600 dark:text-blue-400 font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center gap-1">
               <Files className="w-3 h-3" />
               {data.file_info?.report_type || 'Financial Report'}
             </span>
             {isNonBank && (
               <span className="text-orange-600 dark:text-orange-400 font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center gap-1">
                 <Building className="w-3 h-3" />
                 Non-Bank Entity
               </span>
             )}
          </div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-2">
            {data.file_info?.company_name || 'Financial Analysis'}
            <span className="text-slate-400 dark:text-slate-500 font-normal text-sm">| {latestPeriod}</span>
          </h1>
        </div>
        
        {/* Global Actions */}
        <div className="flex items-center gap-3">
             <button 
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shadow-sm cursor-default ${
                saveSuccess || isAlreadySaved 
                ? 'bg-emerald-600 text-white' 
                : isSavingHistory 
                  ? 'bg-blue-600/80 text-white'
                  : 'bg-blue-600 text-white'
              }`}
              title="Auto-saving to history"
            >
              {isSavingHistory ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (saveSuccess || isAlreadySaved) ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {isSavingHistory ? 'Saving...' : (saveSuccess || isAlreadySaved) ? 'Saved' : 'Save'}
            </button>
            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
              Save Image
            </button>
            <button onClick={onReset} className="text-sm text-slate-500 hover:text-blue-600 dark:hover:text-white transition-colors">
              New Upload
            </button>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex flex-1 overflow-hidden relative flex-col w-full bg-slate-50 dark:bg-slate-950">
          
          {/* WARNING BANNER FOR NON-BANK ENTITIES */}
          {isNonBank && (
            <div className="bg-orange-50 dark:bg-orange-950/30 border-b border-orange-100 dark:border-orange-900/30 px-6 py-3">
              <div className="max-w-7xl mx-auto flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200">Non-Bank Entity Detected</h3>
                  <p className="text-xs text-orange-600 dark:text-orange-200/70 mt-1 max-w-4xl leading-relaxed">
                    Financial metrics have been adjusted for {data.file_info?.company_name}. 
                    Showing <span className="font-medium">Sales, Gross Profit, and Operating Income</span> instead of banking interest metrics.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
            {/* ID used for Capture */}
            <div id="dashboard-content-capture" className="max-w-7xl mx-auto space-y-8 min-h-[calc(100vh-200px)] bg-slate-50 dark:bg-slate-950 pt-2 pb-8 px-4 sm:px-0">

              {/* 1. Executive Summary */}
              <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Executive Summary</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  {data.investor_summary || "AI is generating summary..."}
                </p>
              </div>

              {/* 2. Group / Consolidated Section (Priority) */}
              {hasConData && (
                 renderMetricsSection(
                    "Consolidated Results", 
                    "Group Level Performance (Including Subsidiaries)", 
                    conLatest, 
                    conGraphData, 
                    'indigo'
                 )
              )}

              {/* 3. Standalone / Unconsolidated Section */}
              {hasUnconData && (
                 renderMetricsSection(
                    "Unconsolidated Results", 
                    "Standalone Entity Performance", 
                    unconLatest, 
                    unconGraphData, 
                    'slate'
                 )
              )}

              {/* Fallback if no data */}
              {!hasConData && !hasUnconData && (
                 <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <Files className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No financial data points could be extracted.</p>
                 </div>
              )}

            </div>
            
            {/* Added Footer to the Dashboard Scroll View */}
            <div className="mt-8">
              <Footer />
            </div>

          </div>
      </div>
    </div>
  );
};
