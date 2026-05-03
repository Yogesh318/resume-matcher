import React, { useState, useEffect } from "react";
import { Chrome, RefreshCw, Layers, LogIn, LogOut, User as UserIcon, History, Linkedin, Mail } from "lucide-react";
import { auth, loginWithGoogle, logout } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface LayoutProps {
  children: React.ReactNode;
  onOpenExtension: () => void;
  onReset: () => void;
  onOpenHistory: () => void;
}

export default function Layout({ children, onOpenExtension, onReset, onOpenHistory }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
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
          
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={onOpenExtension}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Chrome className="w-4 h-4" />
              Chrome Extension
            </button>
            <button 
              onClick={onOpenHistory}
              className="px-4 py-2 bg-zinc-100/50 hover:bg-zinc-100 rounded-full text-sm font-medium text-zinc-900 transition-all flex items-center gap-2"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button 
              onClick={onReset}
              className="hidden md:flex px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-sm font-medium text-zinc-900 transition-all items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Scan
            </button>

            <div className="h-6 w-px bg-zinc-200" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-bold text-zinc-900 leading-none">{user.displayName}</span>
                  <span className="text-[10px] text-zinc-500">{user.email}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-rose-600"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-200" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-bold transition-all shadow-md shadow-indigo-100"
              >
                <LogIn className="w-4 h-4" />
                Google Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      
      <footer className="py-12 border-t border-zinc-200 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-zinc-900 font-bold tracking-tight">ResuMatch AI</span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">Elevating resumes with AI precision.</p>
            <p className="text-[10px] text-zinc-400 font-mono mt-1 italic">Powered by Google Gemini 3.1 Pro</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Get in Touch</h4>
            <div className="flex items-center gap-6">
              <a 
                href="https://www.linkedin.com/in/yogeswarchegireddy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                LinkedIn
              </a>
              <a 
                href="mailto:chyogeshreddy@gmail.com" 
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                Email
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-zinc-100 flex justify-center">
          <span className="text-[10px] text-zinc-400 font-medium tracking-tight uppercase">© 2026 ResuMatch AI • Developed by Yogeswar Chegireddy</span>
        </div>
      </footer>
    </div>
  );
}
