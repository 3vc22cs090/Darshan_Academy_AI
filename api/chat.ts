import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@gradio/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, system_message, max_tokens, temperature, top_p } = req.body;
  const hfToken = process.env.VITE_HF_TOKEN || process.env.HF_TOKEN;

  console.log("API Proxy: Connecting via @gradio/client to /respond...");

  try {
    const client = await Client.connect("https://kiran143-lms-ai.hf.space", {
      hf_token: hfToken ? (hfToken.startsWith('hf_') ? hfToken : `hf_${hfToken}`) : undefined
    });

    const result = await client.predict("/respond", {
      message: message,
      system_message: system_message || "You are a friendly Chatbot for Darshan Academy LMS. Help users with course information and learning queries.",
      max_tokens: max_tokens || 512,
      temperature: temperature || 0.7,
      top_p: top_p || 0.95
    });

    console.log("API Proxy: Success via Library!");
    return res.status(200).json({ data: result.data });
  } catch (error: any) {
    console.error("API Proxy: Library Failure:", error);
    return res.status(500).json({ error: `Library-side proxy failed: ${error.message || 'Unknown error'}` });
  }
}
