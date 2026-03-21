import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, history, system_message, max_tokens, temperature, top_p } = req.body;
  const hfToken = process.env.VITE_HF_TOKEN || process.env.HF_TOKEN;

  console.log("API Proxy: Forwarding request to /respond endpoint...");

  try {
    // The screenshot shows the endpoint is actually "/respond"
    const response = await fetch("https://kiran143-lms-ai.hf.space/api/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(hfToken ? { "Authorization": `Bearer ${hfToken.startsWith('hf_') ? hfToken : `hf_${hfToken}`}` } : {})
      },
      body: JSON.stringify({
        data: [
          message,
          system_message || "You are a friendly Chatbot.",
          max_tokens || 512,
          temperature || 0.7,
          top_p || 0.95
        ]
      }),
      signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Proxy: HF Error (${response.status}):`, errorText);
      return res.status(response.status).json({ error: `Hugging Face error: ${errorText}` });
    }

    const json = await response.json();
    console.log("API Proxy: Success!");
    return res.status(200).json({ data: json.data });
  } catch (error: any) {
    console.error("API Proxy: Technical Failure:", error);
    return res.status(500).json({ error: `Server-side proxy failed: ${error.message}` });
  }
}
