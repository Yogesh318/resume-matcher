import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Briefcase, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Layers,
  Chrome,
  Download,
  Search,
  Plus
} from "lucide-react";
import { auth, saveScan, getResumes } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { analyzeResume } from "./lib/gemini";
import { AnalysisResult, JobData } from "./types";
import { History, Save } from "lucide-react";

// Components
import Layout from "./components/Layout";
import ResumeInput from "./components/ResumeInput";
import JobInput from "./components/JobInput";
import Dashboard from "./components/Dashboard";
import ExtensionInfo from "./components/ExtensionInfo";
import HistoryDrawer from "./components/HistoryDrawer";

export default function App() {
  const [step, setStep] = useState<"input" | "analyzing" | "dashboard">("input");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [scrapedJobs, setScrapedJobs] = useState<JobData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch scraped jobs from backend
  const fetchScrapedJobs = async () => {
    try {
      const res = await fetch("/api/scraped-jobs");
      const data = await res.json();
      setScrapedJobs(data);
    } catch (e) {
      console.error("Failed to fetch jobs", e);
    }
  };

  useEffect(() => {
    fetchScrapedJobs();
    const interval = setInterval(fetchScrapedJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) return;
    
    setStep("analyzing");
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysis(result);
      setStep("dashboard");

      // Auto-save scan if logged in
      if (auth.currentUser) {
        saveScan(auth.currentUser.uid, {
          jobTitle,
          company,
          jobDescription,
          resumeText,
          atsScore: result.atsScore,
          analysis: result
        });
      }
    } catch (error) {
      console.error(error);
      setStep("input");
      alert("Analysis failed. Please check your connection and try again.");
    }
  };

  const selectScrapedJob = (job: JobData) => {
    setJobDescription(job.description);
    setJobTitle(job.title);
    setCompany(job.company);
  };

  const handleSelectHistory = (historyItem: any) => {
    if (historyItem._isResumeOnly) {
      setResumeText(historyItem.resumeText);
      return;
    }
    setResumeText(historyItem.resumeText);
    setJobDescription(historyItem.jobDescription);
    setJobTitle(historyItem.jobTitle);
    setCompany(historyItem.company);
    setAnalysis(historyItem.analysis);
    setStep("dashboard");
    setIsHistoryOpen(false);
  };

  return (
    <Layout 
      onOpenExtension={() => setIsExtensionOpen(true)}
      onOpenHistory={() => setIsHistoryOpen(true)}
      onReset={() => {
        setStep("input");
        setAnalysis(null);
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
                  Tailor your resume with <span className="text-indigo-600">AI Precision</span>
                </h1>
                <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                  ResuMatch AI analyzes job descriptions, identifies missing keywords, and rewrites your resume to pass ATS filters.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ResumeInput 
                  value={resumeText} 
                  onChange={setResumeText} 
                />
                <JobInput 
                  value={jobDescription} 
                  onChange={setJobDescription}
                  jobTitle={jobTitle}
                  onTitleChange={setJobTitle}
                  company={company}
                  onCompanyChange={setCompany}
                  scrapedJobs={scrapedJobs}
                  onSelectJob={selectScrapedJob}
                />
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={!resumeText || !jobDescription}
                  className="px-8 py-4 bg-zinc-900 text-white rounded-full font-medium flex items-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-200"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Analysis
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-zinc-100 border-t-indigo-600 rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-zinc-900">Analyzing Match...</h2>
                <p className="text-zinc-500">The AI is deconstructing requirements and optimizing your content.</p>
              </div>
            </motion.div>
          )}

          {step === "dashboard" && analysis && (
            <motion.div
              key="dashboard-step"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <Dashboard 
                analysis={analysis} 
                resumeText={resumeText} 
                jobTitle={jobTitle}
                company={company}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ExtensionInfo 
        isOpen={isExtensionOpen} 
        onClose={() => setIsExtensionOpen(false)} 
      />

      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectScan={handleSelectHistory}
      />
    </Layout>
  );
}
