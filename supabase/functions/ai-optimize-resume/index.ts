import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeData, targetRole, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an elite career consultant with expertise in ATS systems, hiring psychology, and resume optimization. Analyze the resume and optimize it for the target role and job description. Apply cognitive biases: Halo Effect (strong opening), Anchoring (quantified metrics first), Von Restorff (standout achievements). Return structured output via the tool call.`,
          },
          {
            role: "user",
            content: `Resume Data: ${JSON.stringify(resumeData)}\n\nTarget Role: ${targetRole}\n\nJob Description: ${jobDescription}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_optimization",
              description: "Return the optimized resume data",
              parameters: {
                type: "object",
                properties: {
                  optimized_bullets: { type: "array", items: { type: "string" }, description: "Optimized resume bullet points with quantified metrics" },
                  keyword_suggestions: { type: "array", items: { type: "string" }, description: "Missing keywords from the job description" },
                  ats_score: { type: "number", description: "ATS compatibility score 0-100" },
                  psychology_tips: { type: "array", items: { type: "string" }, description: "Psychology-based tips to improve the resume" },
                  cover_letter_draft: { type: "string", description: "A brief cover letter draft tailored to the role" },
                },
                required: ["optimized_bullets", "keyword_suggestions", "ats_score", "psychology_tips", "cover_letter_draft"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_optimization" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    if (!result) throw new Error("No structured output from AI");

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-optimize-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
