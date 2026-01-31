// SmartDesc AI - Motor Ultra-Atualizado 2026
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "SUA_CHAVE_AQUI";

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
      
      // Rota oficial v1 com o modelo 1.5-flash (o mais estável)
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Você é um especialista em vendas. Crie uma descrição curta, com emojis e gatilhos mentais para: ${productName}` }] 
          }]
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify({ description: "Erro do Google: " + data.error.message }), { headers });
      }

      // Se a IA responder, o texto estará aqui
      if (data.candidates && data.candidates[0].content) {
        const description = data.candidates[0].content.parts[0].text;
        return new Response(JSON.stringify({ description }), { headers });
      } else {
        return new Response(JSON.stringify({ description: "IA não gerou resposta. Tente outro nome." }), { headers });
      }

    } catch (err) {
      return new Response(JSON.stringify({ description: "Erro interno no motor. Verifique a chave no Deno." }), { headers });
    }
  }

  return new Response("O coração do nosso império está batendo! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
