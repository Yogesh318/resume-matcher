import React from "react";
import { Chrome, Download, Copy, ExternalLink, Code2, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExtensionInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExtensionInfo({ isOpen, onClose }: ExtensionInfoProps) {
  const [copied, setCopied] = React.useState(false);

  const extensionCode = `{
  "manifest_version": 3,
  "name": "ResuMatch Scraper",
  "version": "1.0",
  "permissions": ["activeTab", "scripting"],
  "content_scripts": [
    {
      "matches": ["https://*.linkedin.com/jobs/*", "https://*.indeed.com/*"],
      "js": ["content.js"]
    }
  ]
}`;

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
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl z-[60] overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <Chrome className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">ResuMatch Scraper</h2>
                  <p className="text-sm text-zinc-500">Collect job postings from LinkedIn & Indeed with one click.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors"
              >
                <XIcon className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 font-mono">How to Developer Mode Install</h3>
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <span className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                      <p className="text-sm text-zinc-600 font-medium">Create a folder named <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono">resumatch-extension</code> on your PC.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                      <p className="text-sm text-zinc-600 font-medium">Save the <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono">manifest.json</code> and <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono">content.js</code> code shown here.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                      <p className="text-sm text-zinc-600 font-medium">Go to <code className="text-indigo-600 underline font-mono">chrome://extensions</code> and toggle <span className="font-bold">Developer mode</span>.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">4</span>
                      <p className="text-sm text-zinc-600 font-medium">Click <span className="font-bold">Load unpacked</span> and select your folder.</p>
                    </li>
                  </ol>
                </section>

                <div className="p-6 bg-indigo-900 rounded-3xl text-white shadow-xl shadow-indigo-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Terminal className="w-5 h-5 text-indigo-300" />
                    <h4 className="font-bold">Scraping URL Config</h4>
                  </div>
                  <p className="text-xs text-indigo-100/70 mb-4 leading-relaxed">
                    Once installed, open any LinkedIn job post. The extension will automatically find the title and description and send it here.
                  </p>
                  <div className="px-4 py-2 bg-indigo-800 rounded-xl font-mono text-[10px] break-all border border-indigo-700">
                    Endpoint: {window.location.origin}/api/scrape
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-950 rounded-3xl p-6 border border-zinc-800 shadow-2xl h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">manifest.json</span>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(extensionCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-[10px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {extensionCode}
                  </pre>
                  
                  <div className="mt-8 pt-8 border-t border-zinc-800">
                    <div className="flex items-center gap-2 mb-4">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">content.js</span>
                    </div>
                    <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed h-48 overflow-y-auto">
{`const scrapData = () => {
  const title = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText || document.title;
  const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText;
  const description = document.querySelector('.jobs-description__container')?.innerText;
  
  if (description) {
    fetch('${window.location.origin}/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, description, url: window.location.href })
    }).then(() => alert('ResuMatch: Job details sent to app!'));
  }
};

// Add a simple button to the page to trigger scrap
const btn = document.createElement('button');
btn.innerText = '✨ Scrape & Match';
btn.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;padding:12px;background:#4f46e5;color:white;border-radius:8px;border:none;font-weight:bold;cursor:pointer;';
btn.onclick = scrapData;
document.body.appendChild(btn);`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function XIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
