import React from 'react';

interface NewsProps {
    title: string;
    subtitle: string;
    body: string;
}

const News: React.FC<NewsProps> = ({ title, subtitle, body }) => {
    return (
        title && subtitle && body && (
            <div className="mt-4 text-left">
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <h2 className="text-base mb-4 text-gray-600">{subtitle}</h2>
                <div className="text-sm text-gray-800 space-y-4">
                    {body.split("\n").map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        )
    );
};

export default News;