// SmartDesc AI - Backend Simples em Deno
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const OPENAI_API_KEY = "SUA_CHAVE_AQUI"; // Usaremos uma API para gerar os textos

async function handleRequest(req) {
  // Configuração de CORS para o seu frontend poder acessar
  const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") return new Response(null, { headers });

  if (req.method === "POST") {
    const { productName } = await req.json();

    // Aqui chamamos a IA para criar a descrição
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
          content: `Crie uma descrição de venda matadora para o produto: ${productName}`
        }],
      }),
    });

    const data = await response.json();
    const description = data.choices[0].message.content;

    return new Response(JSON.stringify({ description }), { headers });
  }

  return new Response("Método não permitido", { status: 405 });
}

serve(handleRequest);