
import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { getUserHistory } from '../services/historyService';
import { Calendar, Loader2, Image as ImageIcon, Search, X, Download, Eye, Mail, User } from 'lucide-react';
import { auth } from '../firebaseConfig';

interface UserProfileProps {
  userId: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for Image Modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getUserHistory(userId);
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayName = auth.currentUser?.displayName || "Analyst";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
        <p>Loading your analysis history...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {displayName}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Your saved financial reports and summaries.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
             <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No History Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Analyses you save will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image Preview */}
              <div 
                className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage(item.imageUrl)}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.companyName}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <button 
                     className="text-white text-sm font-medium hover:text-blue-300 flex items-center gap-2 transition-colors"
                   >
                     <Eye className="w-4 h-4" /> View Full Report
                   </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1" title={item.companyName}>
                    {item.companyName}
                  </h3>
                  <span className="text-xs font-mono font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                    {item.period}
                  </span>
                </div>
                
                {/* User Email Display (Added as requested) */}
                {item.userEmail && (
                   <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-500 dark:text-slate-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">{item.userEmail}</span>
                   </div>
                )}
                
                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadImage(item.imageUrl, `${item.companyName}_${item.period}`);
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Download Image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- FULLSCREEN IMAGE MODAL --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] overflow-auto rounded-lg shadow-2xl bg-white dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          >
            <img 
              src={selectedImage} 
              alt="Full Report" 
              className="w-full h-auto block"
            />
            
            {/* Action Bar */}
            <div className="sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 p-4 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => handleDownloadImage(selectedImage, 'Financial_Report')}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
