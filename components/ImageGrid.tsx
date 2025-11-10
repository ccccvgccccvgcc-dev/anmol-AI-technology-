
import React, { useState } from 'react';
import { ImageCard } from './ImageCard';
import { BattleResults, GeneratedImage, ImageGenerationOptions } from '../types';
import { AppMode } from '../App';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoadingCard } from './LoadingCard';
import { TrashIcon } from './icons/TrashIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ImageGridProps {
  images: GeneratedImage[];
  battleResults: BattleResults | null;
  isLoading: boolean;
  error: string | null;
  numImagesToGenerate: number;
  mode: AppMode;
  onUpscale: (id: string) => void;
  onClear: () => void;
}

// FIX: Update BattleResultCard props to include `options`
const BattleResultCard: React.FC<{ title: string; src: string; prompt: string; options: ImageGenerationOptions }> = ({ title, src, prompt, options }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    return (
        <div className="flex flex-col gap-3 scale-in">
            <h3 className="text-lg font-bold text-center text-slate-300">{title}</h3>
            {/* FIX: Pass all required props to ImageCard to resolve TypeScript error. */}
            <ImageCard
                id={title}
                src={src}
                prompt={prompt}
                options={options}
                isUpscaled={false}
                isUpscaling={false}
            />
            <div className="relative text-xs text-slate-400 bg-slate-800/50 p-2 rounded-md border border-slate-700/50 h-full">
                <p>"{prompt}"</p>
                <button 
                    onClick={handleCopy}
                    className="absolute top-1 right-1 p-1 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-colors"
                    aria-label="Copy prompt"
                >
                    {copied ? <CheckIcon className="w-3 h-3 text-green-400" /> : <CopyIcon className="w-3 h-3" />}
                </button>
            </div>
        </div>
    );
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, battleResults, isLoading, error, numImagesToGenerate, mode, onUpscale, onClear }) => {
  const showInitialMessage = !isLoading && !error && images.length === 0 && battleResults === null;
  const showResults = !isLoading && (images.length > 0 || battleResults !== null);

  return (
    <div className="mt-8 sm:mt-12">
        {showResults && (
            <div className="flex justify-end mb-4">
                <button 
                    onClick={onClear} 
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200"
                >
                    <TrashIcon className="w-4 h-4" />
                    Clear Gallery
                </button>
            </div>
        )}
      {isLoading && (
        <div className="text-center">
            <p className="mb-4 text-slate-400">Your creations are materializing from the digital ether...</p>
            {mode === 'forge' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: numImagesToGenerate }).map((_, index) => (
                        <LoadingCard key={index} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LoadingCard />
                    <LoadingCard />
                </div>
            )}
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center scale-in" role="alert">
          <strong className="font-bold">Oops! A creative spark fizzled out. </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {showInitialMessage && (
        <div className="text-center py-16 px-6 border-2 border-dashed border-slate-800 rounded-2xl fade-in-up">
          <SparklesIcon className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 text-lg font-medium text-slate-300">Your gallery awaits</h3>
          <p className="mt-1 text-slate-500">Let your imagination run wild and see what you can create!</p>
        </div>
      )}

      {images.length > 0 && mode === 'forge' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <ImageCard 
                key={image.id} 
                {...image}
                onUpscale={onUpscale}
                style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                className="scale-in"
            />
          ))}
        </div>
      )}

      {battleResults && mode === 'battle' && (
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* FIX: Pass `options` prop to BattleResultCard */}
            <BattleResultCard title="Contender A" src={battleResults.contenderA.image} prompt={battleResults.contenderA.prompt} options={battleResults.contenderA.options} />
            <BattleResultCard title="Contender B" src={battleResults.contenderB.image} prompt={battleResults.contenderB.prompt} options={battleResults.contenderB.options} />
         </div>
      )}
    </div>
  );
};
