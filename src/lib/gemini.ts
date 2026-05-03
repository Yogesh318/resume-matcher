import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";

  const prompt = `
    Analyze the following resume against the job description.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Provide a detailed analysis including:
    1. An ATS match score (0-100).
    2. A list of keywords (skills, technologies, certifications) found in the job description that are MISSING from the resume.
    3. A list of keywords found in the job description that ARE in the resume.
    4. Specific tailoring suggestions for sections (like Summary, Experience, etc.) with original vs suggested text and an explanation of why the change helps.
    5. A general explanation of the match.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["atsScore", "missingKeywords", "foundKeywords", "tailoringSuggestions", "explanation"],
          properties: {
            atsScore: { type: Type.NUMBER },
            missingKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["word", "importance", "found"],
                properties: {
                  word: { type: Type.STRING },
                  importance: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  found: { type: Type.BOOLEAN }
                }
              }
            },
            foundKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["word", "importance", "found"],
                properties: {
                  word: { type: Type.STRING },
                  importance: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  found: { type: Type.BOOLEAN }
                }
              }
            },
            tailoringSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["section", "original", "suggestion", "explanation"],
                properties: {
                  section: { type: Type.STRING },
                  original: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              }
            },
            explanation: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}

export async function identifyKeywords(text: string): Promise<string[]> {
  const model = "gemini-3-flash-preview";
  const prompt = `Extract exactly the top 15 most important technical skills, tools, or keywords from this job description as a simple JSON array of strings:
  
  ${text}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Keyword Extraction Error:", error);
    return [];
  }
}
