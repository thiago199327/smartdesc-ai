// SmartDesc AI - Versão de Elite 2026
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
      
      // Voltamos para a v1beta, onde o Flash é rei
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Crie uma descrição de venda curta e matadora para o produto: ${productName}. Use emojis.` }] 
          }]
        }),
      });

      const data = await response.json();

      if (data.error) {
        // Se der erro, ele vai nos mostrar exatamente o que é
        return new Response(JSON.stringify({ description: "Aviso do Google: " + data.error.message }), { headers });
      }

      if (data.candidates && data.candidates[0].content) {
        const description = data.candidates[0].content.parts[0].text;
        return new Response(JSON.stringify({ description }), { headers });
      } else {
        return new Response(JSON.stringify({ description: "A IA está pensando... tente de novo em 2 segundos!" }), { headers });
      }

    } catch (err) {
      return new Response(JSON.stringify({ description: "Erro no motor. Verifique a chave no Deno." }), { headers });
    }
  }

  return new Response("O motor do império está online! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
