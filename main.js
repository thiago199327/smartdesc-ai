// SmartDesc AI - Versão Segura (Cofre Ativado 🔒)
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
        return new Response(JSON.stringify({ description: "Erro: Chave não configurada no painel do Deno." }), { headers });
      }

      // Usando o modelo estável de 2026
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Crie uma descrição curta e persuasiva para: ${productName}` }] }]
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify({ description: "Erro no Google: " + data.error.message }), { headers });
      }

      const description = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ description: "O motor deu um soluço. Tente novamente!" }), { headers });
    }
  }

  return new Response("Segurança máxima ativada! 🔒🚀", { headers: { "content-type": "text/plain" } });
});
