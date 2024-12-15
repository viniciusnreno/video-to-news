import { useState } from "react";
import axios from "axios";
import { getId } from "./getId";

export const useGenerateNews = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [body, setBody] = useState<string | null>(null);

  const generateNews = async (youtubeLink: string) => {
    const id = getId(youtubeLink);
    if (!id) {
      alert("Link do YouTube inválido!");
      return;
    }

    setLoading(true);
    try {
      // Passo 1: Converte vídeo para MP3
      const mp3Res = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
        headers: {
          "X-RapidAPI-Key": `${import.meta.env.VITE_YOUTUBE_API_KEY}`,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
        params: { id },
      });

      const mp3Url = mp3Res.data.link;

      // Passo 2: Transcrição de áudio
      const audioBlob = await fetch(mp3Url).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", new File([audioBlob], "audio.mp3"));
      formData.append("model", "whisper-1");

      const transcriptionRes = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const transcription = transcriptionRes.data.text;

      // Passo 3: Geração da notícia
      const newsRes = await axios.post(
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

          Texto transcrito: ${transcription}`,
          max_tokens: 700,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const rawText = newsRes.data.choices[0].text.trim();
      const titleMatch = rawText.match(/### Título ###\n(.+?)\n/);
      const subtitleMatch = rawText.match(/### Subtítulo ###\n(.+?)\n/);
      const bodyMatch = rawText.match(/### Corpo ###\n([\s\S]+)/);

      setTitle(titleMatch ? titleMatch[1].trim() : "Título não encontrado");
      setSubtitle(
        subtitleMatch ? subtitleMatch[1].trim() : "Subtítulo não encontrado"
      );
      setBody(
        bodyMatch ? bodyMatch[1].trim() : "Corpo da notícia não encontrado"
      );
    } catch (err) {
      console.error("Erro ao gerar notícia:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, title, subtitle, body, generateNews };
};
