// SmartDesc AI - Motor Versão Gratuita (Gemini)
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "SUA_CHAVE_GEMINI_AQUI";

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
      
      // Chamada para a API gratuita do Google Gemini
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Crie uma descrição de venda matadora, com emojis e gatilhos mentais para o produto: ${productName}` }] }]
        }),
      });

      const data = await response.json();
      const description = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Erro no motor gratuito." }), { headers, status: 500 });
    }
  }

  return new Response("Motor Gemini rodando de graça! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
