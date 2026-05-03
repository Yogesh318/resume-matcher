import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Briefcase, FileText, ChevronRight, Archive, Trash2 } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan: (scan: any) => void;
}

export default function HistoryDrawer({ isOpen, onClose, onSelectScan }: HistoryDrawerProps) {
  const [scans, setScans] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"scans" | "resumes">("scans");

  const fetchData = async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    try {
      const scansRef = collection(db, `users/${auth.currentUser.uid}/scans`);
      const scansQuery = query(scansRef, orderBy("createdAt", "desc"));
      const scansSnap = await getDocs(scansQuery);
      setScans(scansSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const resumesRef = collection(db, `users/${auth.currentUser.uid}/resumes`);
      const resumesQuery = query(resumesRef, orderBy("createdAt", "desc"));
      const resumesSnap = await getDocs(resumesQuery);
      setResumes(resumesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleDelete = async (id: string, type: "scans" | "resumes") => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/${type}`, id));
      if (type === "scans") setScans(scans.filter(s => s.id !== id));
      else setResumes(resumes.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[50]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Your History</h2>
                  <p className="text-xs text-zinc-500">View and reuse past scans</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex p-2 bg-zinc-50 m-6 rounded-2xl border border-zinc-200">
              <button 
                onClick={() => setActiveTab("scans")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'scans' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
              >
                Past Scans
              </button>
              <button 
                onClick={() => setActiveTab("resumes")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'resumes' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
              >
                Saved Resumes
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-4">
                  <div className="w-6 h-6 border-2 border-zinc-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-xs text-zinc-400 font-medium">Loading historical data...</p>
                </div>
              ) : activeTab === "scans" ? (
                scans.length > 0 ? (
                  scans.map((scan) => (
                    <div 
                      key={scan.id}
                      onClick={() => onSelectScan(scan)}
                      className="p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-zinc-900 line-clamp-1">{scan.jobTitle}</h4>
                          <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {scan.company || "Unknown Company"}
                          </p>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${scan.atsScore >= 70 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                          {scan.atsScore}%
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {scan.createdAt?.toDate ? scan.createdAt.toDate().toLocaleDateString() : 'Recently'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(scan.id, "scans"); }}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-zinc-300 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-40">
                    <Archive className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-sm font-medium">No past scans found</p>
                  </div>
                )
              ) : (
                resumes.length > 0 ? (
                  resumes.map((resume) => (
                    <div 
                      key={resume.id}
                      onClick={() => {
                        onSelectScan({ resumeText: resume.text, _isResumeOnly: true });
                        onClose();
                      }}
                      className="p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-white rounded-lg border border-zinc-200 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-zinc-400" />
                        </div>
                        <h4 className="font-bold text-sm text-zinc-900 truncate">{resume.name}</h4>
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 mb-4 font-mono leading-relaxed">
                        {resume.text.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-zinc-400 font-mono">
                          {resume.createdAt?.toDate ? resume.createdAt.toDate().toLocaleDateString() : 'Recently'}
                        </span>
                        <div className="flex items-center gap-2">
                           <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(resume.id, "resumes"); }}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-zinc-300 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-bold text-indigo-600 italic">Use Resume</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-40">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-sm font-medium">No saved resumes found</p>
                  </div>
                )
              )}
            </div>
            
            <div className="p-6 border-t border-zinc-100 bg-zinc-50">
               <p className="text-[10px] text-zinc-400 leading-relaxed text-center italic">
                 Your data is protected by Firebase Security Rules. Only you can access your saved resumes and scans.
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
