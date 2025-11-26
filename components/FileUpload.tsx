
import React, { useRef } from 'react';
import { UploadCloud, Files } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) => (f as File).type === 'application/pdf') as File[];
      if (files.length > 0) {
        onFileSelect(files);
      } else {
        alert("Please upload PDF files.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter((f) => (f as File).type === 'application/pdf') as File[];
      onFileSelect(files);
    }
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        accept="application/pdf" 
        multiple
        className="hidden" 
        onChange={handleInputChange}
      />
      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`
          group relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 shadow-sm
          ${isProcessing 
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-50 dark:border-slate-700 dark:bg-slate-900/50' 
            : 'border-slate-300 bg-white hover:border-blue-500 hover:shadow-md hover:scale-[1.01] dark:border-slate-700 dark:bg-slate-900/30 dark:hover:bg-slate-900/80'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="p-5 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors relative dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
            <UploadCloud className="w-10 h-10" />
            <div className="absolute -right-2 -bottom-2 bg-white dark:bg-slate-900 rounded-full p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm">
               <Files className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">
              {isProcessing ? "Processing Documents..." : "Upload Financial Reports"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Drag & drop one or more PDFs here.
              <br/>
              <span className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-transparent px-2 py-0.5 rounded-full text-xs mt-1 inline-block">
                Auto-Cross-Verification enabled
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
