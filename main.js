// SmartDesc AI - Motor de Elite (Atualizado para os modelos de 2026)
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
      
      // ATENÇÃO: Mudamos para o gemini-2.5-flash, que é o padrão atual de 2026
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Você é um mestre em vendas e SEO. Crie uma descrição curta, matadora e com emojis para: ${productName}` }] 
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
        return new Response(JSON.stringify({ description: "A IA está recarregando as energias... tente de novo!" }), { headers });
      }

    } catch (err) {
      return new Response(JSON.stringify({ description: "Erro no motor. Verifique a chave no painel do Deno." }), { headers });
    }
  }

  return new Response("O motor do império está pronto para 2026! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
