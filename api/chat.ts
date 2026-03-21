import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@gradio/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, system_message, max_tokens, temperature, top_p, version } = req.body;
  const hfToken = process.env.VITE_HF_TOKEN || process.env.HF_TOKEN;

  console.log(`API Proxy v1.7: Connecting for request v${version || 'unknown'}...`);

  try {
    // 1. Connect to the space
    const client = await Client.connect("Kiran143/LMS_AI", {
      hf_token: hfToken ? (hfToken.startsWith('hf_') ? hfToken : `hf_${hfToken}`) : undefined
    });

    // 2. Log available endpoints for debugging
    const config = (client as any).config;
    const availableEndpoints = config?.dependencies?.map((d: any) => d.api_name).filter(Boolean) || [];
    console.log("API Proxy: Available endpoints:", availableEndpoints);

    // 3. Try identified endpoints in order of likelihood
    const endpointsToTry = ["/respond", "respond", "/chat", "chat"];
    
    // Also try the first one that exists in the metadata if none of the above match exactly
    if (availableEndpoints.length > 0 && !endpointsToTry.some(e => availableEndpoints.includes(e.replace("/", "")))) {
        endpointsToTry.unshift(availableEndpoints[0]);
    }

    let lastError: any = null;
    for (const endpoint of endpointsToTry) {
        try {
            console.log(`API Proxy: Trying endpoint "${endpoint}"...`);
            const result = await client.predict(endpoint, {
                message: message,
                system_message: system_message || "You are a friendly Chatbot for Darshan Academy LMS. Help users with course information and learning queries.",
                max_tokens: max_tokens || 512,
                temperature: temperature || 0.7,
                top_p: top_p || 0.95
            });
            console.log(`API Proxy: Success with "${endpoint}"!`);
            return res.status(200).json({ data: result.data });
        } catch (err: any) {
            console.warn(`API Proxy: Endpoint "${endpoint}" failed:`, err.message);
            lastError = err;
        }
    }

    // 4. Final Fallback: try positional arguments on index 0 if named endpoints failed
    try {
        console.log("API Proxy: Final fallback - trying positional arguments on fn_index 0...");
        const result = await client.predict(0, [
            message,
            system_message || "",
            max_tokens || 512,
            temperature || 0.7,
            top_p || 0.95
        ]);
        return res.status(200).json({ data: result.data });
    } catch (finalErr: any) {
        console.error("API Proxy: All connection attempts failed.");
        return res.status(500).json({ 
            error: `All endpoints failed. Last error: ${lastError?.message || 'Unknown'}. Available: ${availableEndpoints.join(', ')}` 
        });
    }

  } catch (error: any) {
    console.error("API Proxy: Initialization Failure:", error);
    return res.status(500).json({ error: `Connection initialization failed: ${error.message}` });
  }
}
