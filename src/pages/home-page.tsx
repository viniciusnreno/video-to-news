import * as React from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getId } from "../../utils/getId";

const VITE_YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const CombinedApp: React.FC = () => {
  const [youtubeLink, setYoutubeLink] = React.useState("");
  const [mp3Url, setMp3Url] = React.useState<string | null>(null);
  const [transcription, setTranscription] = React.useState<string | null>(null);
  const [news, setNews] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [title, setTitle] = React.useState<string | null>(null);
  const [subtitle, setSubtitle] = React.useState<string | null>(null);
  const [body, setBody] = React.useState<string | null>(null);

  const handleConvertToMp3 = async () => {
    const id = getId(youtubeLink);
    if (!id) {
      alert("Link do YouTube inválido!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
        headers: {
          "X-RapidAPI-Key": VITE_YOUTUBE_API_KEY,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
        params: { id },
      });
      setMp3Url(res.data.link);
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
            Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
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

          Texto transcrito: ${'Nessa sexta-feira, dia 19, tivemos um apagão global de tecnologia que afetou os voos dos Estados Unidos, as transmissões de TV do Reino Unido e até as empresas de telecomunicações da Austrália. O problema foi gerado por uma atualização defeituosa do software de segurança cibernética da empresa CloudStrike. E, no momento, ele já está em processo de reparo. E esse problema causou aquela famosa tela azul da morte do Windows. Só que, como ele já está sendo reparado, imaginamos que nas próximas horas, tudo já esteja voltado à normalidade. Comenta aqui embaixo se você foi afetado em algum voo que você está fora do país. Que siga o canal até aqui e até a próxima.'}
          `,
          max_tokens: 700,
        },
        {
          headers: {
            Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
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
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Cole o link do YouTube aqui"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
          <Button onClick={handleConvertToMp3} disabled={loading}>
            Converter para MP3
          </Button>
        </div>
        {mp3Url && (
          <div>
            <p>MP3 Gerado!</p>
            <Button onClick={handleTranscription} disabled={loading}>
              Transcrever Áudio
            </Button>
          </div>
        )}
        {transcription && (
          <div>
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
