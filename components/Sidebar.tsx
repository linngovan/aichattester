import React, { useRef } from 'react';
import { KnowledgeFile } from '../types';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';

interface SidebarProps {
  files: KnowledgeFile[];
  onFileUpload: (files: FileList) => void;
  onRemoveFile: (fileName: string) => void;
  onClearChat: () => void;
  messageStats: { name: string; length: number; role: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  files, 
  onFileUpload, 
  onRemoveFile, 
  onClearChat,
  messageStats 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Prepare simple chart data - last 10 messages
  const chartData = messageStats.slice(-10);

  return (
    <div className="w-72 glass-sidebar flex flex-col h-full z-20 transition-all duration-300">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 text-white mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
               <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436h.67a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.67C9.555 21.617 5.056 24 0 24a.75.75 0 0 1-.75-.75c0-5.055 2.383-9.555 6.084-12.436V10.17a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v.67c2.88-2.382 5.263-6.882 5.263-11.936a.75.75 0 0 0-.75-.75h-.67Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">AI Chat Tester</h1>
            <p className="text-[10px] text-slate-500 font-medium">GEMINI FLASH</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={triggerFileUpload}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-xs font-medium border border-white/5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Add Context File
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
          accept=".txt,.md,.json,.csv"
          multiple
        />
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">
          Knowledge Base ({files.length})
        </h2>
        
        <div className="space-y-1">
          {files.length === 0 ? (
            <div className="px-2 py-8 text-center border border-dashed border-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">No context loaded.</p>
            </div>
          ) : (
            files.map((file, idx) => (
              <div key={idx} className="group flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-md transition-colors cursor-default">
                <div className="flex items-center gap-3 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                    <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-300 truncate font-medium">{file.name}</p>
                    <p className="text-[10px] text-slate-600 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveFile(file.name)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-600 transition-all"
                  title="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer / Stats */}
      <div className="p-4 bg-slate-900/50 border-t border-white/5">
        {chartData.length > 0 && (
          <div className="mb-4">
             <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Activity</span>
                <span className="text-[10px] text-slate-600 font-mono">{messageStats.length} msgs</span>
             </div>
             <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar dataKey="length" radius={[2, 2, 2, 2]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.role === 'user' ? '#6366f1' : '#334155'} 
                        fillOpacity={0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        <button 
          onClick={onClearChat}
          className="w-full text-xs text-slate-500 hover:text-slate-300 py-2 transition-colors flex items-center justify-center gap-2 hover:bg-slate-800 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reset Session
        </button>
      </div>
    </div>
  );
};

export default Sidebar;