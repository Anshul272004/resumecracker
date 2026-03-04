import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};

export const firecrawlApi = {
  async search(query: string, options?: { limit?: number; scrapeOptions?: { formats?: string[] } }): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-search', {
      body: { query, options },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async scrape(url: string, options?: { formats?: string[]; onlyMainContent?: boolean }): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
      body: { url, options },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async researchInterviewer(interviewerName: string, scrapedData: any): Promise<any> {
    const { data, error } = await supabase.functions.invoke('ai-interviewer-research', {
      body: { interviewerName, scrapedData },
    });
    if (error) throw new Error(error.message || 'Failed to analyze interviewer');
    return data;
  },

  async researchCompany(companyName: string, scrapedData: any): Promise<any> {
    const { data, error } = await supabase.functions.invoke('ai-interviewer-research', {
      body: { companyName, scrapedData, mode: 'company' },
    });
    if (error) throw new Error(error.message || 'Failed to analyze company');
    return data;
  },
};
