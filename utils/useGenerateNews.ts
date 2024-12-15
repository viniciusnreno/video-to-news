import { useState } from "react";
import axios from "axios";
import { getId } from "./getId";

export const useGenerateNews = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [body, setBody] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  /**
   * Gera uma imagem usando a API DALL·E
   * @param prompt - Descrição detalhada para a geração da imagem
   */
  const generateImage = async (prompt: string) => {
    try {
      const imageRes = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt,
          n: 1,
          size: "512x512",
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const imageUrl = imageRes.data.data[0].url;
      setImage(imageUrl);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      alert("Falha na geração da imagem. Tente novamente mais tarde.");
    }
  };

  /**
   * Gera uma notícia baseada em um link do YouTube
   * @param youtubeLink - Link do vídeo do YouTube
   */
  const generateNews = async (youtubeLink: string) => {
    const id = getId(youtubeLink);
    if (!id) {
      alert("Link do YouTube inválido!");
      return;
    }

    setLoading(true);
    setTitle(null);
    setSubtitle(null);
    setBody(null);
    setImage(null);

    let mp3Url = "";

    try {
      // Passo 1: Converte o vídeo para MP3
      const mp3Res = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
        headers: {
          "X-RapidAPI-Key": `${import.meta.env.VITE_YOUTUBE_API_KEY}`,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
        params: { id },
      });

      mp3Url = mp3Res.data.link;
    } catch (err) {
      console.error("Erro ao converter vídeo para MP3:", err);
      alert(
        "Erro ao converter vídeo para MP3. Verifique o link e tente novamente."
      );
      setLoading(false);
      return;
    }

    let transcription = "";

    try {
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

      transcription = transcriptionRes.data.text;
    } catch (err) {
      console.error("Erro ao transcrever o áudio:", err);
      alert("Erro ao transcrever o áudio. Tente novamente mais tarde.");
      setLoading(false);
      return;
    }

    let generatedTitle = "";
    let generatedSubtitle = "";
    let generatedBody = "";

    try {
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

      const rawText = newsRes.data.choices[0].text.trim();
      const titleMatch = rawText.match(/### Título ###\n(.+?)\n/);
      const subtitleMatch = rawText.match(/### Subtítulo ###\n(.+?)\n/);
      const bodyMatch = rawText.match(/### Corpo ###\n([\s\S]+)/);

      generatedTitle = titleMatch
        ? titleMatch[1].trim()
        : "Título não encontrado";
      generatedSubtitle = subtitleMatch
        ? subtitleMatch[1].trim()
        : "Subtítulo não encontrado";
      generatedBody = bodyMatch
        ? bodyMatch[1].trim()
        : "Corpo da notícia não encontrado";

      setTitle(generatedTitle);
      setSubtitle(generatedSubtitle);
      setBody(generatedBody);
    } catch (err) {
      console.error("Erro ao gerar notícia:", err);
      alert("Erro ao gerar notícia. Tente novamente mais tarde.");
      setLoading(false);
      return;
    }

    try {
      // Passo 4: Geração de imagem
      if (generatedTitle && generatedSubtitle) {
        await generateImage(`${generatedTitle} - ${generatedSubtitle}`);
      }
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, title, subtitle, body, image, generateNews };
};
