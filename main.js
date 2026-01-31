// SmartDesc AI - Motor de Elite 2026 (Modelo 2.0 Flash)
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
  const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") return new Response(null, { headers, status: 204 });

  if (req.method === "POST") {
    try {
      const { productName } = await req.json();
      
      if (!GEMINI_API_KEY) {
        return new Response(JSON.stringify({ description: "Erro: Chave não configurada no Deno." }), { headers });
      }

      // Mudamos para o gemini-2.0-flash, o padrão estável de 2026
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Você é um especialista em e-commerce. Crie uma descrição curta, persuasiva e com emojis para: ${productName}` }] 
          }]
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify({ description: "Aviso do Google: " + data.error.message }), { headers });
      }

      if (data.candidates && data.candidates[0].content) {
        const description = data.candidates[0].content.parts[0].text;
        return new Response(JSON.stringify({ description }), { headers });
      } else {
        return new Response(JSON.stringify({ description: "O motor está aquecendo... tente de novo!" }), { headers });
      }

    } catch (err) {
      return new Response(JSON.stringify({ description: "Erro interno no motor. Verifique a conexão." }), { headers });
    }
  }

  return new Response("SmartDesc AI: Motor 2.0 pronto para faturar! 💸", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
