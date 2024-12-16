import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../utils/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGenerateNews } from "@/hooks/useGenerateNews";
import Loading from "@/components/loading";
import News from "@/components/news";
import Iframe from "@/components/iframe";
import SavedNews, { NewsData } from "@/components/saved-news";
import Footer from "@/components/footer";

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

  const [loading, setLoading] = useState(false);
  const [savedNews, setSavedNews] = useState<NewsData[]>([]);

  const { loadingRef, title, subtitle, body, generateNews, linkId } =
    useGenerateNews(false);

  // Sincroniza o estado com o localStorage ao carregar o componente
  useEffect(() => {
    const storedNews = localStorage.getItem("generatedNews");
    if (storedNews) {
      setSavedNews(JSON.parse(storedNews));
    }
  }, []);

  useEffect(() => {
    setLoading(loadingRef);
  }, [loadingRef]);

  // Adiciona a notícia salva assim que `title`, `subtitle`, e `body` são preenchidos
  useEffect(() => {
    if (title && subtitle && body) {
      const newNews: NewsData = {
        title,
        subtitle,
        body,
        createdAt: new Date().toISOString(),
      };

      // Atualiza o localStorage
      const updatedNews = [newNews, ...savedNews];
      localStorage.setItem("generatedNews", JSON.stringify(updatedNews));

      // Atualiza o estado local
      setSavedNews(updatedNews);
    }
  }, [title, subtitle, body]);

  const handleGenerateNews: SubmitHandler<FormData> = (data) => {
    generateNews(data.youtubeLink);
  };

  return (
    <>
      <div className="container mx-auto justify-center text-center mt-8 p-4 flex flex-col md:flex-row gap-5 max-w-7xl min-h-screen">
        <div className="bg-gray-300 md:p-10 p-4 rounded-lg opacity-90 md:flex-shrink-0 md:w-[70%]">
          <h1 className="font-bold text-2xl mb-2">YouTube para Notícia</h1>
          <p className="text-gray-700 mb-6 text-sm">
            Insira o link de um vídeo do YouTube para transformar o conteúdo em
            uma notícia bem escrita. <br />
            O vídeo deve ter no máximo 3 minutos.
          </p>
          <form onSubmit={handleSubmit(handleGenerateNews)}>
            <div className="flex gap-4 items-end justify-center">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  type="text"
                  id="youtubeLink"
                  placeholder="Cole o link do YouTube"
                  {...register("youtubeLink")}
                />
                {errors.youtubeLink && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.youtubeLink.message}
                  </p>
                )}
              </div>
              {loading ? (
                <Loading />
              ) : (
                <Button type="submit">Gerar Notícia</Button>
              )}
            </div>
          </form>

          <Iframe linkId={linkId} />
          <News title={title} subtitle={subtitle} body={body} />
        </div>

        {/* Notícias salvas */}
        <div className="bg-gray-300 md:p-10 p-4 rounded-lg opacity-90">
          <SavedNews savedNews={savedNews} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CombinedApp;
