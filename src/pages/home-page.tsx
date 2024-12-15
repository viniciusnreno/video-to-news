import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../utils/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGenerateNews } from "../../utils/useGenerateNews";
import Loading from "@/components/loading";

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

  const { loading, title, subtitle, body, generateNews } = useGenerateNews();

  const handleGenerateNews: SubmitHandler<FormData> = (data) => {
    generateNews(data.youtubeLink);
  };

  return (
    <div className="container mx-auto text-center mt-8 p-4">
      <div className="bg-gray-100 p-10 rounded-lg opacity-90">
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
