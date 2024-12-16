import React from 'react';

interface IframeProps {
    linkId: string;
}

const Iframe: React.FC<IframeProps> = ({ linkId }) => {
    return (
        linkId && (
            <iframe
                src={`https://www.youtube.com/embed/${linkId}`}
                title="YouTube Video"
                className="w-full h-72 rounded-lg shadow-lg mt-6"
                allowFullScreen
            ></iframe>
        )
        
    );
};

export default Iframe;