// SmartDesc AI - Versão Ultra-Estável (Gemini Pro)
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "AIzaSyBnkvLXb8GX8bYJJVoNYfFfICCH7TIRpBE";

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
      
      // Mudamos para o modelo 'gemini-pro' na v1beta, que é o mais compatível de todos
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Crie uma descrição de venda curta, com emojis e muito persuasiva para o produto: ${productName}` }] 
          }]
        }),
      });

      const data = await response.json();

      // Se der erro, vamos mostrar o que o Google está reclamando exatamente
      if (data.error) {
        return new Response(JSON.stringify({ description: "Erro do Google: " + data.error.message }), { headers });
      }

      // Resposta padrão do Gemini Pro
      const description = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ description: "Ops! O motor deu um soluço. Verifique sua chave no Deno." }), { headers });
    }
  }

  return new Response("Motor Gemini Pro pronto para o show! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});

