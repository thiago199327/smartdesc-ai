// SmartDesc AI - Motor Estável (Versão Anti-Bloqueio) 🔒
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
        return new Response(JSON.stringify({ description: "Erro: Configure a chave no Deno!" }), { headers });
      }

      // Usando o 1.5-flash que é o mais generoso no Free Tier
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Escreva uma descrição de venda curta, persuasiva e com emojis para: ${productName}` }] 
          }]
        }),
      });

      const data = await response.json();

      if (data.error) {
        // Se o erro de quota persistir, ele vai avisar aqui
        return new Response(JSON.stringify({ description: "Google diz: " + data.error.message }), { headers });
      }

      if (data.candidates && data.candidates[0].content) {
        const description = data.candidates[0].content.parts[0].text;
        return new Response(JSON.stringify({ description }), { headers });
      } else {
        return new Response(JSON.stringify({ description: "A IA deu um soluço. Tente de novo!" }), { headers });
      }

    } catch (err) {
      return new Response(JSON.stringify({ description: "Erro no motor. Verifique os logs." }), { headers });
    }
  }

  return new Response("Motor SmartDesc Online! 💸", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
