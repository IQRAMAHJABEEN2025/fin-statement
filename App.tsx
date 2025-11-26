
import React, { useState, useRef, useEffect } from 'react';
import { analyzeFinancialPDF } from './services/geminiService';
import { fileToGenerativePart } from './services/pdfUtils';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { AgentStatus } from './components/AgentStatus';
import { FinancialReportResponse, ProcessingStatus, AgentLog } from './types';
import { BrainCircuit, LogOut, User as UserIcon, Moon, Sun, LayoutDashboard, History } from 'lucide-react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';

const MOCK_AGENT_LOGS: AgentLog[] = [
  { id: '1', agent: 'Document Classifier', message: 'Identifying Sector (Bank vs Non-Bank)...', status: 'pending', timestamp: 0 },
  { id: '2', agent: 'Extraction Agent (A)', message: 'Scanning tables for latest metrics...', status: 'pending', timestamp: 0 },
  { id: '3', agent: 'Auditor Agent (B)', message: 'Cross-checking values against PDF text...', status: 'pending', timestamp: 0 },
  { id: '4', agent: 'Normalization Agent', message: 'Standardizing currencies and units...', status: 'pending', timestamp: 0 },
  { id: '5', agent: 'Math Verification Agent', message: 'Running Accounting Logic Checks...', status: 'pending', timestamp: 0 },
  { id: '6', agent: 'Graph Data Agent', message: 'Preparing visualization arrays...', status: 'pending', timestamp: 0 },
  { id: '7', agent: 'Investor Summary', message: 'Synthesizing final recommendation...', status: 'pending', timestamp: 0 },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  // Theme State - Defaulting to Light Mode
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation State
  const [activeView, setActiveView] = useState<'analyzer' | 'profile'>('analyzer');

  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [data, setData] = useState<FinancialReportResponse | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Global State for Saved Reports to prevent duplicate saves across navigation
  const [savedReportIds, setSavedReportIds] = useState<Set<string>>(new Set());

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenAuth = (view: 'login' | 'signup') => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  const handleSignOut = () => {
    signOut(auth);
    resetApp();
    setActiveView('analyzer');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const markReportAsSaved = (id: string) => {
    setSavedReportIds(prev => new Set(prev).add(id));
  };

  const simulateAgents = () => {
    let currentStep = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setAgentLogs(MOCK_AGENT_LOGS.map(l => ({ ...l, status: 'pending' })));

    intervalRef.current = setInterval(() => {
      setAgentLogs(prevLogs => {
        return prevLogs.map((log, index) => {
          if (index < currentStep) return { ...log, status: 'complete' };
          if (index === currentStep) return { ...log, status: 'active' };
          return { ...log, status: 'pending' };
        });
      });
      
      currentStep++;
      
      if (currentStep >= MOCK_AGENT_LOGS.length) {
         if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 250); 
  };

  const handleFileUpload = async (files: File[]) => {
    setStatus('uploading');
    setError(null);
    setAgentLogs(MOCK_AGENT_LOGS);

    try {
      const filePromises = files.map(file => fileToGenerativePart(file));
      const base64Files = await Promise.all(filePromises);
      
      setStatus('processing');
      simulateAgents();

      const result = await analyzeFinancialPDF(base64Files);
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      if (!result.finance_valid) {
        setError(result.error || "Document is not a valid financial report.");
        setStatus('error');
        return;
      }

      setAgentLogs(MOCK_AGENT_LOGS.map(l => ({ ...l, status: 'complete' })));
      
      setTimeout(() => {
        setData(result);
        setStatus('complete');
      }, 600);

    } catch (err: any) {
      console.error(err);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setError(err.message || "Analysis failed. Please check your API key or file size.");
      setStatus('error');
    }
  };

  const resetApp = () => {
    setStatus('idle');
    setData(null);
    setError(null);
    setAgentLogs([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Note: We deliberately do NOT reset savedReportIds here so that if the user 
    // re-uploads the SAME file in the same session, it might still be considered 'saved'.
    // However, if you want a fresh upload to always save, uncomment the next line:
    // setSavedReportIds(new Set()); 
  };

  if (loadingAuth) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-blue-500">Loading...</div>;
  }

  // --- RENDER LANDING PAGE IF NOT LOGGED IN ---
  if (!user) {
    return (
      <div className={theme}>
        <LandingPage onOpenAuth={handleOpenAuth} toggleTheme={toggleTheme} theme={theme} />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          initialView={authView}
        />
      </div>
    );
  }

  // --- RENDER MAIN APP IF LOGGED IN ---
  return (
    <div className={theme}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300">
        
        {/* App Navbar */}
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveView('analyzer'); resetApp(); }}>
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Alpha<span className="text-blue-600 dark:text-blue-500">Insight</span></span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              {/* Navigation Tabs */}
              <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setActiveView('analyzer')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeView === 'analyzer' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Analyzer
                  </span>
                </button>
                <button 
                  onClick={() => setActiveView('profile')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeView === 'profile' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <span className="flex items-center gap-2">
                    <History className="w-4 h-4" /> History
                  </span>
                </button>
              </div>

               <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
               <button onClick={handleSignOut} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors uppercase tracking-wide">
                 <LogOut className="w-4 h-4" />
                 Sign Out
               </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col relative">
          
          {activeView === 'profile' ? (
             <UserProfile userId={user.uid} />
          ) : (
            <>
              {status === 'idle' && (
                <div className="flex flex-col items-center justify-center flex-1 px-4">
                  <div className="text-center mb-12 max-w-2xl">
                      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                        Institutional-Grade <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">Financial Analysis AI</span>
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-xl mx-auto">
                        Upload Annual Reports or Financial Statements. <br/> 
                        <span className="text-blue-600 dark:text-blue-400">Verbatim Extraction & Multi-Agent Verification.</span>
                      </p>
                  </div>
                  <FileUpload onFileSelect={handleFileUpload} isProcessing={false} />
                </div>
              )}

              {status === 'processing' && (
                <div className="flex flex-col items-center justify-center flex-1 px-4 bg-slate-50 dark:bg-slate-950">
                  <div className="w-full max-w-lg">
                    <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white mb-8">Analyzing & Verifying Data...</h2>
                    <AgentStatus logs={agentLogs} />
                  </div>
                </div>
              )}

              {status === 'uploading' && (
                <div className="flex flex-col items-center justify-center flex-1 px-4">
                  <div className="animate-pulse text-blue-600 dark:text-blue-400 font-bold text-lg">Uploading documents...</div>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center justify-center flex-1 px-4">
                  <div className="bg-white dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 p-8 rounded-2xl max-w-md text-center shadow-xl shadow-red-500/5 dark:shadow-none">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Analysis Failed</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 font-mono text-sm break-words">{error}</p>
                    <button 
                      onClick={resetApp}
                      className="px-6 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 dark:hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {status === 'complete' && data && (
                <Dashboard 
                  data={data} 
                  onReset={resetApp} 
                  savedReportIds={savedReportIds} 
                  onMarkAsSaved={markReportAsSaved} 
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
