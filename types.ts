

// Define the structured response from the AI

export interface DetailedMetric {
  value: string;
  basis?: string; // Optional now, inferred from context
  source_table?: string; // Removed from extraction, kept optional for compatibility
  page?: string | number; // Removed from extraction
}

export interface FinancialMetrics {
  // Key Performance Indicators
  revenue: DetailedMetric; // Interest Earned (Bank) OR Total Revenue (Non-Bank)
  net_markup_income: DetailedMetric; // Net Interest Income (Bank Only)
  gross_profit: DetailedMetric; // Gross Profit (Non-Bank Only)
  operating_income: DetailedMetric; // Operating Profit / EBIT (Non-Bank Only)
  
  net_profit: DetailedMetric; // PAT (Shared)
  eps: DetailedMetric; // (Shared)
  
  // Balance Sheet High Level
  total_assets: DetailedMetric;
  total_liabilities: DetailedMetric;
  total_equity: DetailedMetric;
  deposits: DetailedMetric; // Bank Only
  advances: DetailedMetric; // Bank Only
  
  // Ratios
  return_on_equity: DetailedMetric;
  return_on_assets: DetailedMetric;
  net_profit_margin: DetailedMetric;
  cost_to_income_ratio: DetailedMetric; // Bank
  gross_npa_ratio: DetailedMetric; // Bank
  debt_to_equity: DetailedMetric; // Non-Bank
}

export interface FinancialDataPoint extends FinancialMetrics {
  period: string;
}

export interface GraphDataPoint {
  label: string;
  value: number;
}

export interface GraphDataCollection {
  net_profit_trend: { labels: string[]; values: number[] };
  revenue_trend: { labels: string[]; values: number[] };
  eps_trend: { labels: string[]; values: number[] };
  assets_vs_liabilities: { labels: string[]; assets: number[]; liabilities: number[] };
  deposits_vs_advances: { labels: string[]; deposits: number[]; advances: number[] };
}

export interface FinancialReportResponse {
  finance_valid: boolean;
  error?: string;
  file_info?: {
    report_type: string;
    entity_type?: 'Bank' | 'Non-Bank';
    periods_detected: string[];
    company_name?: string;
    currency_symbol?: string;
  };
  
  unconsolidated_data?: {
    financial_data_points: FinancialDataPoint[];
  };
  consolidated_data?: {
    financial_data_points: FinancialDataPoint[];
  };
  
  graph_data?: GraphDataCollection;
  
  investor_summary?: string; 
  comparative_analysis?: string; // Uncon vs Con analysis
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export interface AgentLog {
  id: string;
  agent: string;
  message: string;
  status: 'pending' | 'active' | 'complete';
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  companyName: string;
  period: string;
  createdAt: string;
  imageUrl: string;
  userEmail?: string;
}
