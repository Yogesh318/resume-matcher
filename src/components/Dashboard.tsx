import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Target, 
  RefreshCw,
  FileText,
  AlertCircle,
  Copy,
  ChevronDown
} from "lucide-react";
import { AnalysisResult } from "../types";
import { motion } from "motion/react";

interface DashboardProps {
  analysis: AnalysisResult;
  resumeText: string;
  jobTitle: string;
  company: string;
}

export default function Dashboard({ analysis, resumeText, jobTitle, company }: DashboardProps) {
  const [activeTab, setActiveTab] = React.useState<"optimization" | "tailored">("optimization");

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <header className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-zinc-100"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251}
                strokeDashoffset={251 - (251 * analysis.atsScore) / 100}
                className={`${scoreColor(analysis.atsScore)} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${scoreColor(analysis.atsScore)}`}>{analysis.atsScore}</span>
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">ATS Match</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">{jobTitle || "Your Target Role"}</h2>
            <p className="text-zinc-500 font-medium">at {company || "Selected Company"}</p>
            <div className="flex gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${scoreBg(analysis.atsScore)} uppercase tracking-widest`}>
                {analysis.atsScore >= 80 ? 'Highly Competitive' : analysis.atsScore >= 60 ? 'Competitive' : 'Needs Optimization'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab("optimization")}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'optimization' ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
          >
            Match Optimizer
          </button>
          <button 
            onClick={() => setActiveTab("tailored")}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'tailored' ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
          >
            Rewrite Draft
          </button>
        </div>
      </header>

      {/* Detailed Score Breakdown & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-3xl p-8 border ${scoreBg(analysis.atsScore)} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/50 border border-current opacity-70`}>
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg tracking-tight">Match Breakdown</h3>
          </div>
          <p className="text-sm font-medium leading-relaxed opacity-80">
            {analysis.scoreBreakdown}
          </p>
          <div className="mt-auto pt-6 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Confidence Level:</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/40 border border-white/20">High Reliability</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg tracking-tight">Critical Action Plan</h3>
          </div>
          <ul className="space-y-4">
            {analysis.actionPlan?.map((step, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-[10px] font-black flex items-center justify-center ring-4 ring-indigo-500/20">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors pt-0.5">
                  {step}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {activeTab === "optimization" ? (
        <div className="space-y-8">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Executive Summary</h3>
            <p className="text-zinc-700 leading-relaxed font-medium capitalize-first">
              {analysis.explanation}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Keyword Analysis */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-4 h-4 text-rose-500" />
                  <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-widest">Missing Keywords</h3>
                </div>
                
                {/* Grouped Missing Keywords */}
                <div className="space-y-6">
                  {Array.from(new Set(analysis.missingKeywords.map(k => k.suggestedSection || "General"))).map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">{section}</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.filter(k => (k.suggestedSection || "General") === section).map((kw, i) => (
                          <motion.span 
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (idx + i) * 0.05 }}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${kw.importance === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-zinc-50 text-zinc-600 border border-zinc-100'}`}
                          >
                            {kw.word}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              <div className="mt-8 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-widest">Strengths Found</h3>
                </div>
                <div className="flex flex-wrap gap-2 opacity-60">
                  {analysis.foundKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                      {kw.word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Insights */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-zinc-900 text-lg tracking-tight">Match Transformation Insights</h3>
              </div>
              
              <div className="space-y-6">
                {analysis.tailoringSuggestions.map((suggestion, i) => (
                  <div key={i} className="group border-b border-zinc-100 last:border-0 pb-6 last:pb-0 mb-6 last:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-black rounded uppercase tracking-tighter">Section</span>
                      <h4 className="font-bold text-zinc-900">{suggestion.section}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 opacity-50">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Original</p>
                        <p className="text-sm italic leading-relaxed font-serif">"{suggestion.original}"</p>
                      </div>
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Recommendation</p>
                        <p className="text-sm font-medium leading-relaxed">"{suggestion.suggestion}"</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-start gap-2">
                       <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-1" />
                       <p className="text-xs text-zinc-600 font-medium">Why it works: {suggestion.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900">Tailored Draft Generation</h3>
              <p className="text-zinc-500 text-sm">Copy these updated sections directly into your resume file.</p>
            </div>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition">
              <Copy className="w-4 h-4" />
              Copy Full Draft
            </button>
          </div>

          <div className="space-y-12">
            {analysis.tailoringSuggestions.map((s, i) => (
              <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-zinc-200">
                <div className="absolute left-[-4px] top-6 w-2 h-2 bg-indigo-600 rounded-full border-4 border-white ring-1 ring-zinc-200" />
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">{s.section}</h4>
                <div className="bg-zinc-50 p-6 rounded-3xl font-mono text-sm border border-zinc-100 leading-relaxed max-w-4xl">
                  {s.suggestion}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-zinc-900 rounded-3xl text-zinc-400 text-sm font-serif italic text-center">
             "Passes through the job description with a {analysis.atsScore}% semantic alignment score. Good luck with the application!"
          </div>
        </div>
      )}
    </div>
  );
}
