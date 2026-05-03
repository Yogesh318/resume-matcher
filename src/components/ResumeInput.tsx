import React, { useRef, useState } from "react";
import { FileText, Clipboard, Upload, Loader2, FileUp, Check, Save } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { auth, saveResume } from "../lib/firebase";

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ResumeInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ResumeInput({ value, onChange }: ResumeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert(`File size exceeds the 10MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return;
    }
    
    setIsParsing(true);
    setFileName(file.name);
    
    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        text = await extractTextFromDocx(file);
      } else {
        alert("Please upload a PDF or DOCX file.");
        setIsParsing(false);
        setFileName(null);
        return;
      }
      
      onChange(text);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to read file. Please try copy-pasting your text.");
    } finally {
      setIsParsing(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!auth.currentUser || !value) return;
    setIsSaving(true);
    try {
      await saveResume(auth.currentUser.uid, fileName || "New Resume", value);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to save resume profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => (item as any).str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Your Current Resume</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                onChange(text);
              } catch (e) {
                alert("Please grant clipboard permission or paste manually.");
              }
            }}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            <Clipboard className="w-3 h-3" />
            Paste
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            <FileUp className="w-3.5 h-3.5" />
            Upload File
          </button>
          {auth.currentUser && value && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`text-xs font-bold flex items-center gap-1 transition-all ${saveSuccess ? 'text-emerald-600' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saveSuccess ? 'Saved' : 'Save to Profile'}
            </button>
          )}
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept=".pdf,.docx"
        className="hidden"
      />

      <div 
        className={`flex-1 relative rounded-2xl transition-all ${isOver ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (fileName) setFileName(null);
          }}
          placeholder="Paste your resume or drag & drop a PDF/DOCX file here..."
          className="w-full h-full p-6 bg-zinc-50 border border-zinc-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm leading-relaxed"
        />
        
        {isParsing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm font-bold text-zinc-900">Extracted text from {fileName}...</p>
            </div>
          </div>
        )}

        {!value && !isParsing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-3 px-8">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-200">
                <Upload className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-lg font-bold text-zinc-900 tracking-tight">Drop your Resume here</p>
              <p className="text-sm text-zinc-400 max-w-[200px]">Supports PDF and Word documents up to 10MB</p>
            </div>
          </div>
        )}

        {fileName && !isParsing && value && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[150px]">{fileName} imported</span>
          </div>
        )}
      </div>
    </div>
  );
}
