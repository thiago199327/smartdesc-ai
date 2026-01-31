// SmartDesc AI - Edição Especial Gemini 3 🌌
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
      
      if (!GEMINI_API_KEY) return new Response(JSON.stringify({ description: "Erro: Chave ausente." }), { headers });

      // O modelo mais novo que você acabou de descobrir!
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Você é uma IA de elite. Crie uma descrição de venda perfeita para: ${productName}` }] }]
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify({ description: "Aviso: " + data.error.message }), { headers });
      }

      const description = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ description: "Erro ao conectar com o Gemini 3." }), { headers });
    }
  }

  return new Response("SmartDesc AI rodando no motor do futuro! ⚡", { headers: { "content-type": "text/plain" } });
});
