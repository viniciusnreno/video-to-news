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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [title, setTitle] = React.useState<string | null>(null);
  const [subtitle, setSubtitle] = React.useState<string | null>(null);
  const [body, setBody] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleGenerateNews = async (data: FormData) => {
    const id = getId(data.youtubeLink);
    if (!id) {
      alert("Link do YouTube inválido!");
      return;
    }
  
    setLoading(true);
    try {
      // Etapa 1: Converte o vídeo para MP3
      const mp3Res = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
        headers: {
          "X-RapidAPI-Key": `${import.meta.env.VITE_YOUTUBE_API_KEY}`,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
        params: { id },
      });
      const mp3Url = mp3Res.data.link;
  
      // Etapa 2: Transcreve o áudio para texto
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
  
      // Etapa 3: Gera a notícia
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
  
      // Extração com base nos delimitadores
      const titleMatch = rawText.match(/### Título ###\n(.+?)\n/);
      const subtitleMatch = rawText.match(/### Subtítulo ###\n(.+?)\n/);
      const bodyMatch = rawText.match(/### Corpo ###\n([\s\S]+)/);
  
      // Atualiza os estados com base nas correspondências
      setTitle(titleMatch ? titleMatch[1].trim() : "Título não encontrado");
      setSubtitle(subtitleMatch ? subtitleMatch[1].trim() : "Subtítulo não encontrado");
      setBody(bodyMatch ? bodyMatch[1].trim() : "Corpo da notícia não encontrado");
    } catch (err) {
      console.error("Erro ao gerar notícia:", err);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="container mx-auto text-center mt-8 p-4">
      <div className="bg-gray-100 p-10 rounded-lg opacity-90">
        <h1 className="font-bold text-2xl mb-2">YouTube para Notícia</h1>
        <p className="text-gray-700 mb-6 text-sm">
          Insira o link de um vídeo do YouTube para transformar o conteúdo em uma notícia bem escrita.  <br />O site irá automaticamente converter o áudio do vídeo em texto e gerar uma notícia com título, subtítulo e corpo detalhado.
        </p>
        <form onSubmit={handleSubmit(handleGenerateNews)}>
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
            {loading ? (
              <div className="mb-1">
                <div role="status mx-auto">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <Button type="submit">Gerar Notícia</Button>
            )}
          </div>
        </form>
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
