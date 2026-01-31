// SmartDesc AI - Motor Gemini 1.5 Flash (Versão Estável v1)
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
      
      // Trocamos para a v1, que é a versão oficial e estável
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Crie uma descrição de venda profissional e atraente para o produto: ${productName}` }] 
          }]
        }),
      });

      const data = await response.json();

      // Se der erro de novo, ele vai nos mostrar uma mensagem amigável
      if (data.error) {
        return new Response(JSON.stringify({ description: "Erro técnico: " + data.error.message }), { headers });
      }

      // Extraindo o texto da forma correta que o Google entrega
      const description = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ description: "Ops! O motor deu um soluço. Tente novamente." }), { headers });
    }
  }

  return new Response("O motor gratuito está pronto para decolar! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
