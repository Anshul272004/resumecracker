import { supabase } from "@/integrations/supabase/client";

export interface OptimizeResumeResult {
  optimized_bullets: string[];
  keyword_suggestions: string[];
  ats_score: number;
  psychology_tips: string[];
  cover_letter_draft: string;
}

export interface RateAnswerResult {
  score: number;
  categories: {
    structure: number;
    impact_language: number;
    specificity: number;
    psychology: number;
  };
  feedback: string;
  improved_answer: string;
}

export interface CoverLetterResult {
  cover_letter: string;
  key_hooks: string[];
}

export const aiApi = {
  async optimizeResume(resumeData: any, targetRole: string, jobDescription: string): Promise<OptimizeResumeResult> {
    const { data, error } = await supabase.functions.invoke("ai-optimize-resume", {
      body: { resumeData, targetRole, jobDescription },
    });
    if (error) throw new Error(error.message || "Failed to optimize resume");
    return data;
  },

  async rateAnswer(question: string, userAnswer: string, idealAnswer: string): Promise<RateAnswerResult> {
    const { data, error } = await supabase.functions.invoke("ai-rate-answer", {
      body: { question, userAnswer, idealAnswer },
    });
    if (error) throw new Error(error.message || "Failed to rate answer");
    return data;
  },

  async generateCoverLetter(resumeData: any, jobDescription: string, targetCompany: string): Promise<CoverLetterResult> {
    const { data, error } = await supabase.functions.invoke("ai-cover-letter", {
      body: { resumeData, jobDescription, targetCompany },
    });
    if (error) throw new Error(error.message || "Failed to generate cover letter");
    return data;
  },
};
