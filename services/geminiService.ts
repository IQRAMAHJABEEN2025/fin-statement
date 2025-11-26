
import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { FinancialReportResponse, GraphDataCollection, FinancialDataPoint } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// UPDATED KEYS LIST
const METRICS_KEYS = [
  "revenue", 
  "net_markup_income",
  "gross_profit",
  "operating_income",
  "net_profit", 
  "eps", 
  "total_assets", 
  "total_liabilities", 
  "total_equity",
  "deposits",
  "advances",
  "return_on_equity", 
  "return_on_assets", 
  "net_profit_margin",
  "cost_to_income_ratio", 
  "gross_npa_ratio", 
  "debt_to_equity"
];

const DATA_POINT_PROPERTIES: Record<string, Schema> = {
  period: { type: Type.STRING },
};

METRICS_KEYS.forEach(key => {
  DATA_POINT_PROPERTIES[key] = { type: Type.STRING };
});

const DATA_POINT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: DATA_POINT_PROPERTIES,
  required: ["period"]
};

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    finance_valid: { type: Type.BOOLEAN },
    error: { type: Type.STRING },
    file_info: {
      type: Type.OBJECT,
      properties: {
        report_type: { type: Type.STRING },
        entity_type: { type: Type.STRING, enum: ["Bank", "Non-Bank"] },
        company_name: { type: Type.STRING },
        currency_symbol: { type: Type.STRING },
        periods_detected: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
    },
    unconsolidated_data: {
      type: Type.OBJECT,
      properties: {
        financial_data_points: { type: Type.ARRAY, items: DATA_POINT_SCHEMA }
      }
    },
    consolidated_data: {
      type: Type.OBJECT,
      properties: {
        financial_data_points: { type: Type.ARRAY, items: DATA_POINT_SCHEMA }
      }
    },
    investor_summary: { type: Type.STRING },
    comparative_analysis: { type: Type.STRING },
  },
  required: ["finance_valid"],
};

const parseValue = (val: string | undefined): number => {
  if (!val || val === "data_missing" || val === "N/A") return 0;
  const cleaned = val.replace(/[^0-9.-]/g, ''); 
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const generateGraphData = (points: FinancialDataPoint[]): GraphDataCollection => {
  const sortedPoints = [...points].reverse();
  const labels = sortedPoints.map(p => p.period);

  return {
    net_profit_trend: {
      labels,
      values: sortedPoints.map(p => parseValue(p.net_profit?.value))
    },
    revenue_trend: {
      labels,
      values: sortedPoints.map(p => parseValue(p.revenue?.value))
    },
    eps_trend: {
      labels,
      values: sortedPoints.map(p => parseValue(p.eps?.value))
    },
    assets_vs_liabilities: {
      labels,
      assets: sortedPoints.map(p => parseValue(p.total_assets?.value)),
      liabilities: sortedPoints.map(p => parseValue(p.total_liabilities?.value))
    },
    deposits_vs_advances: {
      labels,
      deposits: sortedPoints.map(p => parseValue(p.deposits?.value)),
      advances: sortedPoints.map(p => parseValue(p.advances?.value))
    }
  };
};

const transformResponse = (raw: any): FinancialReportResponse => {
  if (!raw) return { finance_valid: false, error: "Empty response" };

  const transformPoints = (points: any[], basisLabel: string): FinancialDataPoint[] => {
    return points?.map(p => {
      const newPoint: any = { period: p.period };
      METRICS_KEYS.forEach(key => {
        if (p[key]) {
          newPoint[key] = {
            value: p[key],
            basis: basisLabel
          };
        }
      });
      return newPoint as FinancialDataPoint;
    }) || [];
  };

  const unconsolidatedPoints = transformPoints(raw.unconsolidated_data?.financial_data_points, 'Unconsolidated');
  const consolidatedPoints = transformPoints(raw.consolidated_data?.financial_data_points, 'Consolidated');
  const graphSource = unconsolidatedPoints.length > 0 ? unconsolidatedPoints : consolidatedPoints;

  return {
    ...raw,
    unconsolidated_data: { financial_data_points: unconsolidatedPoints },
    consolidated_data: { financial_data_points: consolidatedPoints },
    graph_data: generateGraphData(graphSource)
  };
};

export const analyzeFinancialPDF = async (base64Files: string[]): Promise<FinancialReportResponse> => {
  const model = "gemini-2.5-flash"; // Flash is efficient and cheap/free
  
  const systemPrompt = `
    You are an Expert Financial Auditor.
    
    STEP 1: IDENTIFY ENTITY TYPE (Bank vs Non-Bank)
    - Bank keywords: "Markup Earned", "Advances", "NPA".
    - Non-Bank keywords: "Sales", "COGS", "Gross Profit".
    
    STEP 2: EXTRACT DATA (Strictly LATEST 2 PERIODS ONLY)
    - Extract exact numbers verbatim. No rounding.
    - If a field is missing, strictly return "N/A".
    
    === IF BANK ===
    - revenue: "Interest Earned"
    - net_markup_income: "Net Interest Income"
    - gross_profit: "N/A"
    - deposits: "Deposits"
    - advances: "Advances"

    === IF NON-BANK ===
    - revenue: "Net Sales"
    - net_markup_income: "N/A"
    - gross_profit: "Gross Profit"
    - deposits: "N/A"
    - advances: "N/A"

    === COMMON ===
    - net_profit, eps, total_assets, total_liabilities, total_equity.

    OUTPUT RULES:
    1. "investor_summary": Max 2 sentences. Very concise.
    2. "comparative_analysis": Max 1 sentence difference check.
    3. Return RAW JSON. No markdown formatting.
  `;

  try {
    const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = base64Files.map(data => ({
      inlineData: { mimeType: "application/pdf", data: data }
    }));

    parts.push({ text: "Analyze. Identify Entity. Extract strictly." });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.1, // Lower temperature for more deterministic/concise output
        maxOutputTokens: 8192,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    const text = response.text;
    const finishReason = response.candidates?.[0]?.finishReason;

    // Handle token overflow gracefully
    if (finishReason === 'MAX_TOKENS') {
       console.warn("Response truncated due to token limit. Attempting to parse partial JSON...");
       // Often the JSON is mostly complete, or we can catch this specific error
    }

    if (!text) {
      throw new Error(`AI returned empty response. Reason: ${finishReason}`);
    }
    
    const rawData = JSON.parse(text);
    return transformResponse(rawData);

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error.message.includes("MAX_TOKENS") || error.message.includes("Unterminated string")) {
       throw new Error("Report is too large. Please upload only the Financial Statements section (Balance Sheet & P&L).");
    }
    throw error;
  }
};
