import axios from "axios";
import React from "react";

export async function generateMp3(id: string): Promise<string> {
  try {
    const response = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
      headers: {
        "X-RapidAPI-Key": `${import.meta.env.VITE_YOUTUBE_API_KEY}`,
        "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
      },
      params: { id },
    });

    return response.data.link;
  } catch (err) {
    console.error("Erro ao converter vídeo para MP3:", err);
    throw new Error(
      "Erro ao converter vídeo para MP3. Verifique o link e tente novamente."
    );
  }
}
