export interface ResumeData {
  text: string;
}

export interface JobData {
  id?: string;
  title: string;
  company: string;
  description: string;
  url?: string;
}

export interface Keyword {
  word: string;
  importance: "high" | "medium" | "low";
  found: boolean;
  suggestedSection?: string;
}

export interface AnalysisResult {
  atsScore: number;
  missingKeywords: Keyword[];
  foundKeywords: Keyword[];
  tailoringSuggestions: {
    section: string;
    original: string;
    suggestion: string;
    explanation: string;
  }[];
  explanation: string;
  actionPlan?: string[];
  scoreBreakdown?: string;
}
