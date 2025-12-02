import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import { Message } from '../types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative bg-[#020617] mesh-bg">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-20 lg:px-40 relative z-10 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-slate-800">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-indigo-500">
                 <path d="M16.5 7.5h-9v9h9v-9Z" />
                 <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v1.5h6V3a.75.75 0 0 1 1.5 0v1.5h.75c.966 0 1.844.329 2.53.886l1.54-1.54a.75.75 0 1 1 1.06 1.06l-1.54 1.54c.557.686.886 1.564.886 2.53v.75h1.5a.75.75 0 0 1 0 1.5h-1.5v6h1.5a.75.75 0 0 1 0 1.5h-1.5v.75c0 .966-.329 1.844-.886 2.53l1.54 1.54a.75.75 0 1 1-1.06 1.06l-1.54-1.54c-.686.557-1.564.886-2.53.886h-.75v1.5a.75.75 0 0 1-1.5 0v-1.5h-6v1.5a.75.75 0 0 1-1.5 0v-1.5h-.75a4.49 4.49 0 0 1-2.53-.886l-1.54 1.54a.75.75 0 0 1-1.06-1.06l1.54-1.54A4.49 4.49 0 0 1 2.25 15.75v-.75h-1.5a.75.75 0 0 1 0-1.5h1.5v-6h-1.5a.75.75 0 0 1 0-1.5h1.5v-.75A4.49 4.49 0 0 1 3.136 3.136l-1.54-1.54a.75.75 0 1 1 1.06-1.06l1.54 1.54A4.49 4.49 0 0 1 6.75 4.5h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A2.25 2.25 0 0 0 3.75 9v6A2.25 2.25 0 0 0 6 17.25h12A2.25 2.25 0 0 0 20.25 15V9A2.25 2.25 0 0 0 18 6.75H6Z" clipRule="evenodd" />
               </svg>
            </div>
            <h2 className="text-xl font-medium text-slate-200 mb-2">
              Ready to verify
            </h2>
            <p className="text-sm text-slate-500 max-w-sm">
              Add context files from the sidebar to test your RAG implementation, or just start chatting to test the base model.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`mb-8 flex gap-4 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {/* AI Avatar (Only for model) */}
            {msg.role === 'model' && (
              <div className="flex-shrink-0 mt-1">
                 <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                      <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436h.67a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.67C9.555 21.617 5.056 24 0 24a.75.75 0 0 1-.75-.75c0-5.055 2.383-9.555 6.084-12.436V10.17a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v.67c2.88-2.382 5.263-6.882 5.263-11.936a.75.75 0 0 0-.75-.75h-.67Z" clipRule="evenodd" />
                    </svg>
                 </div>
              </div>
            )}

            <div className={`
              max-w-[85%] md:max-w-[75%]
              ${msg.role === 'user' 
                ? 'bg-[#1e293b] text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm' 
                : 'text-slate-300 py-1 pl-1'}
            `}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  Gemini
                </div>
              )}
              
              <div className="markdown-content">
                <Markdown
                  options={{
                    overrides: {
                      a: {
                        component: ({ children, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                      },
                    },
                  }}
                >
                  {msg.text}
                </Markdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 mb-8 animate-fade-in">
             <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
             </div>
             <div className="py-2">
               <span className="text-sm text-slate-500 animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Minimal Input Area */}
      <div className="p-4 md:p-6 lg:px-40 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-20">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <div className="relative group">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="w-full bg-slate-900/80 backdrop-blur text-slate-200 rounded-xl pl-5 pr-12 py-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-white/5 placeholder:text-slate-600 resize-none h-[60px] shadow-lg transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-0 rounded-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;