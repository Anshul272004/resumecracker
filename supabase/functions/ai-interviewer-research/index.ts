import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { interviewerName, scrapedData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const scrapedContent = Array.isArray(scrapedData)
      ? scrapedData.map((d: any) => `Source: ${d.url || 'unknown'}\n${d.markdown || d.description || ''}`).join('\n\n---\n\n')
      : typeof scrapedData === 'string' ? scrapedData : JSON.stringify(scrapedData);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert career coach and interview strategist. Analyze scraped social media/web data about an interviewer and extract actionable insights for interview preparation. Focus on: their professional interests, communication style, topics they care about, and personalized tips for the candidate.`,
          },
          {
            role: "user",
            content: `Interviewer Name: ${interviewerName}\n\nScraped Profile Data:\n${scrapedContent}\n\nAnalyze this person's profile and provide personalized interview preparation insights.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_insights",
              description: "Return interviewer analysis insights",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "2-3 sentence professional summary of the interviewer" },
                  interests: { type: "array", items: { type: "string" }, description: "5-8 professional interests/topics they care about" },
                  tips: { type: "array", items: { type: "string" }, description: "5-7 specific actionable tips for the interview" },
                  commonTopics: { type: "array", items: { type: "string" }, description: "4-6 topics they're likely to ask about" },
                  communicationStyle: { type: "string", description: "Brief description of their communication style" },
                },
                required: ["summary", "interests", "tips", "commonTopics", "communicationStyle"],
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
