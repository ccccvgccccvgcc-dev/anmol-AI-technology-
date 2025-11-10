import React, { useState } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { CheckIcon } from './icons/CheckIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';
import { GeneratedImage } from '../types';
import { LoadingSpinner } from './LoadingSpinner';


interface ImageCardProps extends GeneratedImage {
  onUpscale?: (id: string) => void;
  style?: React.CSSProperties;
  className?: string;
}
export const ImageCard: React.FC<ImageCardProps> = ({ id, src, isUpscaled, isUpscaling, onUpscale, style, className }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  }
  
  const handleUpscaleClick = () => {
    if (onUpscale && !isUpscaled && !isUpscaling) {
        onUpscale(id);
    }
  }

  return (
    <div className={`group relative aspect-square overflow-hidden rounded-lg bg-slate-800 shadow-lg ${className}`} style={style}>
      <img src={src} alt="AI generated art" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      
      {/* Interaction overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
        <div className="flex items-center gap-2">
            <a
              href={src}
              download={`ai-image-${Date.now()}.png`}
              onClick={handleDownload}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full flex items-center transition-all duration-300 transform group-hover:scale-100 scale-90 text-sm"
              aria-label="Download Image"
            >
              {isDownloaded ? (
                <CheckIcon className="w-4 h-4 text-green-400" />
              ) : (
                <DownloadIcon className="w-4 h-4" />
              )}
            </a>
            {onUpscale && (
                <button
                    onClick={handleUpscaleClick}
                    disabled={isUpscaled || isUpscaling}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full flex items-center transition-all duration-300 transform group-hover:scale-100 scale-90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Upscale Image"
                >
                   <UpscaleIcon className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>

      {/* Upscaling Loader */}
      {isUpscaling && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300">
            <LoadingSpinner />
            <p className="text-sm mt-2 text-slate-300">Upscaling...</p>
        </div>
      )}

      {/* Upscaled Badge */}
      {isUpscaled && (
        <div className="absolute top-2 right-2 bg-cyan-500/80 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            Upscaled
        </div>
      )}
    </div>
  );
};