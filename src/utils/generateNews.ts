import axios from "axios";

export async function generateNews(transcription: string): Promise<{
  title: string;
  subtitle: string;
  body: string;
}> {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt: `
Baseado no texto transcrito abaixo, escreva uma notícia completa em formato JSON com a seguinte estrutura EXATA:
{
  "title": "[Um título claro e impactante]",
  "subtitle": "[Um subtítulo que resuma os principais pontos]",
  "body": "[Um corpo dividido em parágrafos, com cada parágrafo separado pelo marcador '\\n'. Os parágrafos devem ser bem estruturados, como uma notícia real, contendo introdução, desenvolvimento e conclusão.]"
}
Certifique-se de que:
1. O campo "body" tenha parágrafos separados pelo marcador '\\n'.
2. O JSON retornado seja válido e siga o formato exato especificado acima.

Texto transcrito: ${transcription}

Certifique-se de retornar apenas o JSON válido conforme o exemplo fornecido.
        `,
        max_tokens: 700,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
      }
    );

    const rawJson = response.data.choices[0].text.trim();

    // Validar se a resposta é um JSON válido
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawJson);
    } catch (err) {
      console.error("Erro ao parsear o JSON retornado:", rawJson);
      throw new Error("O modelo retornou um JSON inválido.");
    }

    // Validar se contém as chaves esperadas
    const { title, subtitle, body } = parsedResponse;
    if (!title || !subtitle || !body) {
      console.error("JSON retornado está incompleto:", parsedResponse);
      throw new Error("O JSON retornado não contém todas as chaves esperadas.");
    }

    // Não substituir \n por quebras reais, pois React tratará no componente
    return {
      title: title.trim(),
      subtitle: subtitle.trim(),
      body: body.trim(), // Mantém o marcador `\n` intacto
    };
  } catch (err) {
    console.error("Erro ao gerar notícia:", err);
    throw new Error("Erro ao gerar notícia. Tente novamente mais tarde.");
  }
}
