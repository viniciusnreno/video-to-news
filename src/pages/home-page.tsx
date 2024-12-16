import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../utils/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGenerateNews } from "@/hooks/useGenerateNews";
import Loading from "@/components/loading";
import News from "@/components/news";
import Iframe from "@/components/iframe";

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

  const [loading, setLoading] = React.useState(false);
  const { loadingRef, title, subtitle, body, generateNews, linkId } = useGenerateNews();

  useEffect(() => {
    setLoading(loadingRef);
  }
  , [loadingRef]);

  const handleGenerateNews: SubmitHandler<FormData> = (data) => {
    generateNews(data.youtubeLink);
  };

  return (
    <div className="container !max-w-[600px] mx-auto text-center mt-8 p-4">
      <div className="bg-gray-300 p-10 rounded-lg opacity-90">
        <h1 className="font-bold text-2xl mb-2">YouTube para Notícia</h1>
        <p className="text-gray-700 mb-6 text-sm">
          Insira o link de um vídeo do YouTube para transformar o conteúdo em
          uma notícia bem escrita.
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
            <Loading />
            ) : (
              <Button type="submit">Gerar Notícia</Button>
            )}
          </div>
          <span className="font-semibold float-left text-sm ms-2 mt-0.5">O vídeo deve ter no máximo 3 minutos</span>
        </form>

        <Iframe linkId={linkId} />
        <News title={title} subtitle={subtitle} body={body} />
      </div>
    </div>
  );
};

export default CombinedApp;
