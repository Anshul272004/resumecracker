import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeData, targetRole } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert resume writer. Generate 4 distinct versions of the resume summary and bullet points, each tailored for a different audience:
1. ATS-Optimized: Maximum keyword density, formal tone, standard section headers
2. Creative: Personality-driven, storytelling approach, unique phrasing
3. Startup: Action-oriented, growth metrics, scrappy/resourceful tone
4. Corporate: Professional, structured, emphasizing leadership and process

Return via tool call.`,
          },
          {
            role: "user",
            content: `Resume: ${JSON.stringify(resumeData)}\nTarget Role: ${targetRole}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_versions",
              description: "Return 4 resume versions",
              parameters: {
                type: "object",
                properties: {
                  versions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["ats", "creative", "startup", "corporate"] },
                        summary: { type: "string", description: "2-sentence professional summary" },
                        bullets: { type: "array", items: { type: "string" }, description: "5-8 optimized bullet points" },
                        tone_note: { type: "string", description: "Brief note on the tone used" },
                      },
                      required: ["type", "summary", "bullets", "tone_note"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["versions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_versions" } },
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
    console.error("ai-resume-versions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
