// SmartDesc AI - Motor Gemini Pro 1.5 (Versão Estável)
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
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Escreva uma descrição de venda curta e persuasiva para este produto: ${productName}` }] }]
        }),
      });

      const data = await response.json();

      // Verificação de erro na resposta do Google
      if (data.error) {
        return new Response(JSON.stringify({ description: "Erro na Chave: " + data.error.message }), { headers });
      }

      // Verificação de segurança (o Gemini às vezes bloqueia a resposta)
      if (!data.candidates || data.candidates.length === 0) {
        return new Response(JSON.stringify({ description: "A IA bloqueou a resposta por segurança. Tente outro nome." }), { headers });
      }

      const description = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ description: "Erro no motor: Verifique se a variável GEMINI_API_KEY foi criada no Deno." }), { headers });
    }
  }

  return new Response("Motor Gemini Online!", { headers: { "content-type": "text/plain" } });
});
