import React from "react";

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
  return (
    <div className="mt-8">
      <h2 className="font-bold text-xl mb-4">Notícias Salvas</h2>
      <div className="flex flex-col gap-4">
        {savedNews.length > 0 ? (
          savedNews.map((news, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold">{news.title}</h3>
              <p className="text-sm text-gray-600">{news.subtitle}</p>
              <p className="text-sm mt-2">{news.body}</p>
              <p className="text-xs text-gray-400 mt-2">
                Gerado em: {new Date(news.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">Nenhuma notícia salva.</p>
        )}
      </div>
    </div>
  );
};

export default SavedNews;
