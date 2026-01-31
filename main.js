// SmartDesc AI - Motor Oficial Deno Deploy
// Dica: A chave da API pode ser colocada aqui ou nas variáveis de ambiente do Deno
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "COLOQUE_SUA_CHAVE_AQUI";

Deno.serve(async (req) => {
  // Configuração de CORS para o frontend (index.html) funcionar
  const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // 1. Responde a testes do navegador
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  // 2. Lógica de Geração da Descrição
  if (req.method === "POST") {
    try {
      const { productName } = await req.json();

      if (!productName) {
        return new Response(JSON.stringify({ error: "O nome do produto sumiu!" }), { headers, status: 400 });
      }

      // Chamada para a inteligência artificial
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
            content: `Crie uma descrição de venda matadora, com emojis e gatilhos mentais para o produto: ${productName}`
          }],
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify({ description: "Ops! A chave da IA deu erro. Verifique se ela é válida." }), { headers });
      }

      const description = data.choices[0].message.content;
      return new Response(JSON.stringify({ description }), { headers });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Erro no processamento do motor." }), { headers, status: 500 });
    }
  }

  // 3. Página de Boas-Vindas (se abrir o link direto)
  return new Response("O motor do SmartDesc AI está rodando a 1000%! 🚀", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
