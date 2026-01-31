// SmartDesc AI - Motor Nativo Deno
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "SUA_CHAVE_AQUI";

Deno.serve(async (req) => {
  // Configuração de CORS (Essencial para o seu index.html funcionar)
  const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Responde a requisições de teste do navegador (Preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  // Lógica principal de geração de descrição
  if (req.method === "POST") {
    try {
      const { productName } = await req.json();

      if (!productName) {
        return new Response(JSON.stringify({ error: "Nome do produto vazio" }), { headers, status: 400 });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Crie uma descrição de venda matadora e curta para o produto: ${productName}. Use gatilhos mentais.`
          }],
        }),
      });

      const data = await response.json();
      
      // Se a chave for inválida, a IA vai avisar aqui
      if (data.error) {
        return new Response(JSON.stringify({ description: "Erro na API da IA: Verifique sua chave." }), { headers });
      }

      const description = data.choices[0].message.content;
      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Erro interno no servidor" }), { headers, status: 500 });
    }
  }

  // Página inicial simples caso alguém acesse o link do Deno diretamente
  return new Response("O motor do SmartDesc AI está rodando! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
