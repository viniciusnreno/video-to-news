import { useState } from "react";
import { getId } from "@/utils/getId";
import { generateMp3 } from "@/utils/generateMp3";
import { transcribeAudio } from "@/utils/transcribeAudio";
import { generateNews } from "@/utils/generateNews";

export const useGenerateNews = () => {
  const [loadingRef, setLoadingRef] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [body, setBody] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);

  const generateNewsFromYoutube = async (youtubeLink: string) => {
    const id = getId(youtubeLink);
    if (!id) {
      alert("Link do YouTube inválido!");
      return;
    }

    setLoadingRef(true);
    setTitle(null);
    setSubtitle(null);
    setBody(null);
    setLinkId(id);

    try {
      const mp3Url = await generateMp3(id);
      const transcription = await transcribeAudio(mp3Url);
      const { title, subtitle, body } = await generateNews(transcription);

      setTitle(title);
      setSubtitle(subtitle);
      setBody(body);
    } catch (err) {
      console.error("Erro ao converter vídeo para MP3:", err);
      throw new Error(
        "Erro ao converter vídeo para MP3. Verifique o link e tente novamente."
      );
    } finally {
      setLoadingRef(false);
    }
  };

  return {
    loadingRef,
    title,
    subtitle,
    body,
    linkId,
    generateNews: generateNewsFromYoutube,
  };
};
