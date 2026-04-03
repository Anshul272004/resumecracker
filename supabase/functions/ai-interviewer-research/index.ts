import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { interviewerName, scrapedData, mode, companyName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const scrapedContent = Array.isArray(scrapedData)
      ? scrapedData.map((d: any) => `Source: ${d.url || 'unknown'}\n${d.markdown || d.description || ''}`).join('\n\n---\n\n')
      : typeof scrapedData === 'string' ? scrapedData : JSON.stringify(scrapedData);

    // Company research mode
    if (mode === "company") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are an elite career strategist and interview coach with 20 years of experience. Analyze scraped company data and provide deeply actionable interview preparation insights. Go beyond surface-level advice — provide specific strategies to impress interviewers at this company.`,
            },
            {
              role: "user",
              content: `Company Name: ${companyName}\n\nScraped Company Data:\n${scrapedContent}\n\nProvide comprehensive company intelligence for interview preparation.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_company_insights",
                description: "Return deep company analysis insights for interview prep",
                parameters: {
                  type: "object",
                  properties: {
                    companySummary: { type: "string", description: "2-3 sentence summary of the company culture and work environment" },
                    cultureTraits: { type: "array", items: { type: "string" }, description: "5-6 key cultural traits/values the company emphasizes" },
                    interviewStyle: { type: "string", description: "Description of their typical interview process and what they look for" },
                    dressCode: { type: "string", enum: ["Formal", "Business Casual", "Smart Casual", "Startup Casual"], description: "Recommended dress code tier" },
                    dressDetails: { type: "string", description: "Specific what-to-wear advice for this company" },
                    valuesToMirror: { type: "array", items: { type: "string" }, description: "5-6 specific values/phrases to mirror in your answers" },
                    commonQuestionThemes: { type: "array", items: { type: "string" }, description: "4-6 common interview question themes at this company" },
                    tipsForSuccess: { type: "array", items: { type: "string" }, description: "5-7 actionable tips for interviewing at this company" },
                    personalityArchetypes: { type: "array", items: { type: "object", properties: { type: { type: "string" }, description: { type: "string" }, strategy: { type: "string" } }, required: ["type", "description", "strategy"] }, description: "3-4 typical interviewer personality types at this company with specific strategies for each" },
                    companyWeakPoints: { type: "array", items: { type: "string" }, description: "3-4 sensitive topics or weak points to avoid mentioning about the company" },
                    impressStrategies: { type: "array", items: { type: "string" }, description: "5-6 specific strategies to instantly impress interviewers at this company" },
                  },
                  required: ["companySummary", "cultureTraits", "interviewStyle", "dressCode", "dressDetails", "valuesToMirror", "commonQuestionThemes", "tipsForSuccess", "personalityArchetypes", "companyWeakPoints", "impressStrategies"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_company_insights" } },
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Usage limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const aiData = await response.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      const result = toolCall ? JSON.parse(toolCall.function.arguments) : null;
      if (!result) throw new Error("No structured output from AI");

      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Interviewer research mode (default) — ENHANCED with personality decoder
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an elite interview strategist who profiles interviewers from their social media presence. Analyze scraped data from LinkedIn, Twitter, Instagram, Facebook, and other sources. Extract deep personality insights, communication preferences, likes/dislikes, weak points to avoid, and strategic recommendations to make the candidate instantly likeable and memorable. Think like a social psychologist.`,
          },
          {
            role: "user",
            content: `Interviewer Name: ${interviewerName}\n\nScraped Social Media Data:\n${scrapedContent}\n\nProvide a complete personality decoder and interview strategy.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_insights",
              description: "Return deep interviewer personality analysis and strategy",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "2-3 sentence professional summary of the interviewer" },
                  interests: { type: "array", items: { type: "string" }, description: "5-8 professional interests/topics they care about" },
                  tips: { type: "array", items: { type: "string" }, description: "5-7 specific actionable tips for the interview" },
                  commonTopics: { type: "array", items: { type: "string" }, description: "4-6 topics they're likely to ask about" },
                  communicationStyle: { type: "string", description: "Brief description of their communication style" },
                  communicationStyleType: { type: "string", enum: ["Analytical", "Conversational", "Technical", "Executive"], description: "One of 4 communication style types" },
                  personalityType: { type: "string", enum: ["The Engineer", "The People Leader", "The Strategist", "The Detail-Oriented"], description: "One of 4 personality archetypes" },
                  personalityStrategy: { type: "string", description: "2-3 sentences on how to tailor your responses for this personality type" },
                  dressCode: { type: "string", enum: ["Formal", "Business Casual", "Smart Casual", "Startup Casual"], description: "Recommended dress code based on their company culture" },
                  dressDetails: { type: "string", description: "Specific what-to-wear advice" },
                  iceBreakers: { type: "array", items: { type: "string" }, description: "3-4 personalized conversation starters based on their interests/posts" },
                  likes: { type: "array", items: { type: "string" }, description: "5-6 things the interviewer likes/values based on their social media activity" },
                  dislikes: { type: "array", items: { type: "string" }, description: "4-5 things the interviewer dislikes/avoids or gets annoyed by" },
                  weakPoints: { type: "array", items: { type: "string" }, description: "3-4 sensitive topics or trigger points to avoid during the interview" },
                  instantLikeStrategies: { type: "array", items: { type: "string" }, description: "5-6 strategies to make the interviewer instantly like you (shared interests, compliments, mirroring techniques)" },
                  openingLines: { type: "array", items: { type: "string" }, description: "3-4 personalized opening lines to start the interview on a positive note" },
                  bodyLanguageTips: { type: "array", items: { type: "string" }, description: "4-5 body language recommendations specific to this interviewer's personality" },
                },
                required: ["summary", "interests", "tips", "commonTopics", "communicationStyle", "communicationStyleType", "personalityType", "personalityStrategy", "dressCode", "dressDetails", "iceBreakers", "likes", "dislikes", "weakPoints", "instantLikeStrategies", "openingLines", "bodyLanguageTips"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_insights" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Usage limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : null;
    if (!result) throw new Error("No structured output from AI");

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-interviewer-research error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
