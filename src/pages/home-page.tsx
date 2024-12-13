import * as React from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../utils/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getId } from "../../utils/getId";

interface FormData {
  youtubeLink: string;
}

const CombinedApp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [mp3Url, setMp3Url] = React.useState<string | null>(null);
  const [transcription, setTranscription] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string | null>(null);
  const [subtitle, setSubtitle] = React.useState<string | null>(null);
  const [body, setBody] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleConvertToMp3: SubmitHandler<FormData> = async (data) => {
    const id = getId(data.youtubeLink);
    if (!id) {
      alert("Link do YouTube inválido!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
        headers: {
          "X-RapidAPI-Key": `${import.meta.env.VITE_YOUTUBE_API_KEY}`,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
        params: { id },
      });
      setMp3Url(res.data.link);
      reset();
    } catch (err) {
      console.error("Erro ao converter para MP3:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranscription = async () => {
    if (!mp3Url) return;
    setLoading(true);
    try {
      const audioBlob = await fetch(mp3Url).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", new File([audioBlob], "audio.mp3"));
      formData.append("model", "whisper-1");

      const res = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTranscription(res.data.text);
    } catch (err) {
      console.error("Erro ao transcrever áudio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNews = async () => {
    if (!transcription) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "gpt-3.5-turbo-instruct",
          prompt: `
            Baseado no texto transcrito abaixo, escreva uma notícia completa com o seguinte formato:
            title: [Um título claro e impactante]
            subtitle: [Um subtítulo que resuma os principais pontos]
            body: [Um corpo com introdução, desenvolvimento e conclusão bem estruturados]

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

      const rawText = res.data.choices[0].text.trim();
      const [rawTitle, rawSubtitle, ...rawBody] = rawText.split("\n").filter(Boolean);

      setTitle(rawTitle.replace(/^(Title|title):\s*/, "").replace(/^"|"$/g, ""));
      setSubtitle(rawSubtitle.replace(/^(Subtitle|subtitle):\s*/, "").replace(/^"|"$/g, ""));
      setBody(rawBody.join("\n").replace(/^(Body|body):\s*/, ""));
    } catch (err) {
      console.error("Erro ao gerar notícia:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto text-center mt-8 p-4">
      <div className="bg-gray-100 p-10 rounded-lg opacity-90">
        <h1 className="font-bold text-2xl mb-4">YouTube para Notícia</h1>
        <form onSubmit={handleSubmit(handleConvertToMp3)}>
          <div className="flex gap-4 items-end justify-center">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="text"
                id="youtubeLink"
                placeholder="Cole o link do YouTube aqui"
                {...register("youtubeLink")}
              />
              {errors.youtubeLink && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.youtubeLink.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={loading}>
              Converter para MP3
            </Button>
          </div>
        </form>
        {mp3Url && (
          <div className="mt-4">
            <p>MP3 Gerado!</p>
            <Button onClick={handleTranscription} disabled={loading}>
              Transcrever Áudio
            </Button>
          </div>
        )}
        {transcription && (
          <div className="mt-4">
            <p>Transcrição Concluída!</p>
            <p>{transcription}</p>
            <Button onClick={handleGenerateNews} disabled={loading}>
              Gerar Notícia
            </Button>
          </div>
        )}
        {title && subtitle && body && (
          <div className="mt-4 text-left">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <h2 className="text-base mb-4 text-gray-600">{subtitle}</h2>
            <div className="text-sm text-gray-800 space-y-4">
              {body.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedApp;
