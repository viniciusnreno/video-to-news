import axios from "axios";

export async function transcribeAudio(mp3Url: string): Promise<string> {
  try {
    const audioBlob = await fetch(mp3Url).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", new File([audioBlob], "audio.mp3"));
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.text;
  } catch (err) {
    console.error("Erro ao transcrever o áudio:", err);
    throw new Error("Erro ao transcrever o áudio. Tente novamente mais tarde.");
  }
}
