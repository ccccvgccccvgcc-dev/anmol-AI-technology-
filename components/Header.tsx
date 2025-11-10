import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 pt-8 pb-4">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center gap-3 fade-in-up">
          <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
            AI Image Forge
          </h1>
        </div>
        <p className="mt-2 text-md sm:text-lg text-slate-400 fade-in-up" style={{ animationDelay: '0.2s' }}>
          Turn your imagination into stunning visuals with the power of AI.
        </p>
      </div>
    </header>
  );
};