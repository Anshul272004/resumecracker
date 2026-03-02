import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeData, jobDescription, targetCompany } = await req.json();
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
            content: `You are an elite cover letter writer. Generate a compelling, personalized cover letter that: 1) Opens with a company-specific hook showing genuine interest, 2) Maps the candidate's experience to the job requirements using STAR-lite format, 3) Uses psychology (reciprocity, social proof, scarcity) to create urgency, 4) Closes with a confident call to action. Keep it under 350 words, professional but warm.`,
          },
          {
            role: "user",
            content: `Resume: ${JSON.stringify(resumeData)}\n\nJob Description: ${jobDescription}\n\nTarget Company: ${targetCompany}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_cover_letter",
              description: "Return the generated cover letter",
              parameters: {
                type: "object",
                properties: {
                  cover_letter: { type: "string", description: "The full cover letter text" },
                  key_hooks: { type: "array", items: { type: "string" }, description: "Key persuasion hooks used" },
                },
                required: ["cover_letter", "key_hooks"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_cover_letter" } },
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
    console.error("ai-cover-letter error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
