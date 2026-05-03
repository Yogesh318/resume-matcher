import React from "react";
import { Chrome, RefreshCw, Layers } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  onOpenExtension: () => void;
  onReset: () => void;
}

export default function Layout({ children, onOpenExtension, onReset }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-bottom border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onReset}
          >
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900">ResuMatch<span className="text-indigo-600">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenExtension}
              className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Chrome className="w-4 h-4" />
              Chrome Extension
            </button>
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-sm font-medium text-zinc-900 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Scan
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      
      <footer className="py-12 border-t border-zinc-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-zinc-400" />
            <span className="text-sm text-zinc-500 font-medium tracking-tight">© 2026 ResuMatch AI. Optimize your career.</span>
          </div>
          <div className="text-xs text-zinc-400 font-mono italic">
            Powered by Google Gemini 3.1 Pro
          </div>
        </div>
      </footer>
    </div>
  );
}
