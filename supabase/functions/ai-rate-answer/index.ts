import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, userAnswer, idealAnswer } = await req.json();
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
            content: `You are an expert interview coach. Rate the user's answer on 4 categories (0-100 each): Structure (STAR method usage), Impact Language (action verbs, confidence), Specificity (concrete examples, numbers), Psychology (rapport building, storytelling). Provide actionable feedback and an improved version.`,
          },
          {
            role: "user",
            content: `Question: ${question}\n\nUser's Answer: ${userAnswer}\n\nIdeal Answer: ${idealAnswer}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_rating",
              description: "Return the answer rating",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Overall score 0-100" },
                  categories: {
                    type: "object",
                    properties: {
                      structure: { type: "number" },
                      impact_language: { type: "number" },
                      specificity: { type: "number" },
                      psychology: { type: "number" },
                    },
                    required: ["structure", "impact_language", "specificity", "psychology"],
                  },
                  feedback: { type: "string", description: "Specific actionable feedback" },
                  improved_answer: { type: "string", description: "An improved version of the answer" },
                },
                required: ["score", "categories", "feedback", "improved_answer"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_rating" } },
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
    console.error("ai-rate-answer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
