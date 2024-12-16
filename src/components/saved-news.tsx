import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface NewsData {
  title: string;
  subtitle: string;
  body: string;
  createdAt: string;
}

interface SavedNewsProps {
  savedNews: NewsData[];
}

const SavedNews: React.FC<SavedNewsProps> = ({ savedNews }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  return (
    <div className="mt-8">
      <h2 className="font-bold text-xl mb-4">Notícias Salvas</h2>
      <div className="flex flex-col gap-4">
        {savedNews.slice(0, visibleCount).map((news, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <button className="p-4 bg-white rounded-lg shadow text-left hover:bg-gray-100">
                <h3 className="font-bold">{news.title}</h3>
                <p className="text-sm text-gray-600">{news.subtitle}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Gerado em: {new Date(news.createdAt).toLocaleString()}
                </p>
              </button>
            </DialogTrigger>
            <DialogContent
              className="max-h-[80vh] overflow-y-auto"
              // Classe adicionada para rolagem
            >
              <div>
                <h1 className="text-2xl font-bold mb-2">{news.title}</h1>
                <h2 className="text-base mb-4 text-gray-600">{news.subtitle}</h2>
                {news.body.split("\n").map((paragraph, i) => (
                  <p key={i} className="text-sm text-gray-800 mb-3">
                    {paragraph}
                  </p>
                ))}
                <p className="text-xs text-gray-400 mt-4">
                  Gerado em: {new Date(news.createdAt).toLocaleString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
        {savedNews.length > visibleCount && (
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 self-center mt-4"
          >
            Ver Mais
          </button>
        )}
        {savedNews.length === 0 && (
          <p className="text-sm text-gray-600">Nenhuma notícia salva.</p>
        )}
      </div>
    </div>
  );
};

export default SavedNews;
