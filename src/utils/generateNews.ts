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
          Baseado no texto transcrito abaixo, escreva uma notícia completa com o seguinte formato:
           sempre deve ter exatamente o '### Título ###', '### Subtítulo ###' e '### Corpo ###'. pois estou esperando em meu código que esses delimitadores estejam presentes.
          ### Título ###
          [Um título claro e impactante]
          ### Subtítulo ###
          [Um subtítulo que resuma os principais pontos]
          ### Corpo ###
          [Um corpo com introdução, desenvolvimento e conclusão bem estruturados]
          Texto transcrito: ${transcription}
        `,
        max_tokens: 700,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
      }
    );

    const rawText = response.data.choices[0].text.trim();
    const titleMatch = rawText.match(/### Título ###\n(.+?)\n/);
    const subtitleMatch = rawText.match(/### Subtítulo ###\n(.+?)\n/);
    const bodyMatch = rawText.match(/### Corpo ###\n([\s\S]+)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : "Título não encontrado",
      subtitle: subtitleMatch
        ? subtitleMatch[1].trim()
        : "Subtítulo não encontrado",
      body: bodyMatch ? bodyMatch[1].trim() : "Corpo da notícia não encontrado",
    };
  } catch (err) {
    console.error("Erro ao gerar notícia:", err);
    throw new Error("Erro ao gerar notícia. Tente novamente mais tarde.");
  }
}
