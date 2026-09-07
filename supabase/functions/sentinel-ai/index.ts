// ==============================================================================
// SUPABASE EDGE FUNCTION — SECURE SENTINEL AI PROXY WITH GROQ
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, context } = await req.json();
    const apiKey = Deno.env.get("GROQ_API_KEY");
    const model = Deno.env.get("GROQ_MODEL") || "llama-3.3-70b-versatile";

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GROQ_API_KEY is not configured on the server.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `You are SENTINEL AI, an expert forensic investigator for the Government of India MPLAD Scheme.
You MUST follow these strict rules:
1. ONLY make claims supported by the provided Grounding Context JSON.
2. NEVER accuse individuals or companies of crimes or fraud directly. Use objective decision-support terms like "potential anomaly", "evidence conflict", "unusual pattern", "requires physical verification".
3. Distinguish clearly between FACTS (documented records) and INFERENCES (risk patterns).
4. Output MUST be valid JSON matching this schema:
{
  "summary": string,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": number,
  "keyFindings": [
    {
      "title": string,
      "fact": string,
      "inference": string,
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "evidenceId": string
    }
  ],
  "evidenceLinks": [
    {
      "id": string,
      "type": string,
      "description": string
    }
  ],
  "whyItMatters": string,
  "recommendedNextSteps": string[]
}`;

    const userContent = `GROUNDING CONTEXT:
${JSON.stringify(context, null, 2)}

INVESTIGATOR QUERY:
${prompt}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.1,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: groqRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqData = await groqRes.json();
    const parsed = JSON.parse(groqData.choices[0]?.message?.content || "{}");

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
