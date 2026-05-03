import React from "react";
import { Briefcase, Building2, Globe, Clock, Plus } from "lucide-react";
import { JobData } from "../types";

interface JobInputProps {
  value: string;
  onChange: (val: string) => void;
  jobTitle: string;
  onTitleChange: (val: string) => void;
  company: string;
  onCompanyChange: (val: string) => void;
  scrapedJobs: JobData[];
  onSelectJob: (job: JobData) => void;
}

export default function JobInput({ 
  value, 
  onChange, 
  jobTitle, 
  onTitleChange, 
  company, 
  onCompanyChange,
  scrapedJobs,
  onSelectJob
}: JobInputProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col h-[500px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-zinc-600" />
          </div>
          <h2 className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Target Job Description</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Job Title</label>
            <div className="relative">
              <input 
                type="text" 
                value={jobTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Senior Product Designer"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Company</label>
            <div className="relative">
              <input 
                type="text" 
                value={company}
                onChange={(e) => onCompanyChange(e.target.value)}
                placeholder="Linear (optional)"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste the full job posting text here..."
            className="w-full h-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm leading-relaxed"
          />
        </div>
      </div>

      {scrapedJobs.length > 0 && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-400" />
              Imported from Scraper
            </h3>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">
              {scrapedJobs.length} NEW
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {scrapedJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="flex-shrink-0 w-48 p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-2xl transition-all text-left group"
              >
                <h4 className="font-bold text-sm text-zinc-900 truncate mb-1 group-hover:text-indigo-600">{job.title}</h4>
                <p className="text-xs text-zinc-500 flex items-center gap-1 mb-3">
                  <Building2 className="w-3 h-3" />
                  {job.company}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 italic font-serif">
                    <Clock className="w-3 h-3" />
                    just now
                  </span>
                  <Plus className="w-4 h-4 text-zinc-300 group-hover:text-indigo-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
