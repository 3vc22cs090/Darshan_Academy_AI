import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-ai-proxy',
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (req.url?.startsWith('/api/chat') && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body);
                const hfToken = process.env.VITE_HF_TOKEN;

                // Local simulation of the Vercel proxy
                const hfResponse = await fetch('https://kiran143-lms-ai.hf.space/api/respond', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(hfToken ? { 'Authorization': `Bearer ${hfToken.startsWith('hf_') ? hfToken : `hf_${hfToken}`}` } : {})
                  },
                  body: JSON.stringify({
                    data: [
                      data.message,
                      data.system_message || "You are a friendly Chatbot.",
                      data.max_tokens || 512,
                      data.temperature || 0.7,
                      data.top_p || 0.95
                    ]
                  })
                });

                const result = await hfResponse.json();
                console.log("Local Proxy: HF Result:", JSON.stringify(result));
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (error: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: `Local Proxy Error: ${error.message}` }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ]
})
