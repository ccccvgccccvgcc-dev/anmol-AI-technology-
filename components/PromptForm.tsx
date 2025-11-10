import React, { useState, useEffect } from 'react';
import { ImageGenerationOptions, ModelType, AspectRatios, BattleGenerationOptions } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { SwordsIcon } from './icons/SwordsIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { AppMode } from '../App';

interface ContenderProps {
  options: ImageGenerationOptions;
  setOptions: React.Dispatch<React.SetStateAction<ImageGenerationOptions>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  title: string;
}

const ContenderForm: React.FC<ContenderProps> = ({ options, setOptions, prompt, setPrompt, isLoading, title }) => {
  const isImagen = options.model === ModelType.IMAGEN;
  const handleModelChange = (model: ModelType) => {
    setOptions(prev => ({ ...prev, model }));
  };

  return (
    <div className="space-y-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 transition-all duration-300 hover:border-slate-600">
       <h3 className="text-lg font-bold text-center text-cyan-400">{title}</h3>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Prompt
        </label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A creative prompt..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 placeholder-slate-500"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          AI Model
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => handleModelChange(ModelType.IMAGEN)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors font-semibold ${isImagen ? 'bg-cyan-500 text-white shadow-md' : 'hover:bg-slate-700/50'}`}
          >
            Imagen 4
          </button>
          <button
            type="button"
            onClick={() => handleModelChange(ModelType.NANO_BANANA)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors font-semibold ${!isImagen ? 'bg-cyan-500 text-white shadow-md' : 'hover:bg-slate-700/50'}`}
          >
            Nano Banana
          </button>
        </div>
      </div>
      <div className={`transition-opacity duration-300 ${isImagen ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-5 gap-1">
          {AspectRatios.map(ratio => (
            <button
              key={ratio}
              type="button"
              onClick={() => setOptions(prev => ({ ...prev, aspectRatio: ratio }))}
              className={`py-1 text-[10px] sm:text-xs rounded-lg border transition-all duration-200 transform hover:scale-105 ${options.aspectRatio === ratio ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
              disabled={!isImagen || isLoading}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface PromptFormProps {
  onGenerate: (prompt: string, options: ImageGenerationOptions) => void;
  onBattleGenerate: (options: BattleGenerationOptions) => void;
  isLoading: boolean;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, onBattleGenerate, isLoading, mode, setMode }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [options, setOptions] = useState<ImageGenerationOptions>({
    model: ModelType.IMAGEN,
    numberOfImages: 1,
    aspectRatio: '1:1',
  });
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const [promptA, setPromptA] = useState<string>('');
  const [optionsA, setOptionsA] = useState<ImageGenerationOptions>({
    model: ModelType.IMAGEN,
    numberOfImages: 1,
    aspectRatio: '1:1',
  });

  const [promptB, setPromptB] = useState<string>('');
  const [optionsB, setOptionsB] = useState<ImageGenerationOptions>({
    model: ModelType.NANO_BANANA,
    numberOfImages: 1,
    aspectRatio: '1:1',
  });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
    }
  }, []);

  const addToHistory = (p: string) => {
    if (!p.trim()) return;
    const newHistory = [p, ...history.filter(item => item !== p)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('promptHistory', JSON.stringify(newHistory));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (mode === 'forge') {
      addToHistory(prompt);
      onGenerate(prompt, options);
    } else {
      addToHistory(promptA);
      addToHistory(promptB);
      onBattleGenerate({ promptA, optionsA, promptB, optionsB });
    }
    setShowHistory(false);
  };

  const isForgeMode = mode === 'forge';
  const isBattleReady = promptA.trim() && promptB.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/30 p-4 sm:p-6 rounded-2xl border border-slate-700/50 shadow-2xl shadow-slate-950/50 fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex justify-center bg-slate-800/50 p-1 rounded-full border border-slate-700">
        <button
          type="button"
          onClick={() => setMode('forge')}
          className={`w-1/2 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-300 font-semibold transform active:scale-95 ${isForgeMode ? 'bg-cyan-500 text-white shadow-md' : 'hover:bg-slate-700/50 text-slate-300'}`}
        >
          <SparklesIcon className="w-4 h-4" /> Forge
        </button>
        <button
          type="button"
          onClick={() => setMode('battle')}
          className={`w-1/2 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-300 font-semibold transform active:scale-95 ${!isForgeMode ? 'bg-cyan-500 text-white shadow-md' : 'hover:bg-slate-700/50 text-slate-300'}`}
        >
          <SwordsIcon className="w-4 h-4" /> Battle
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className={`transition-transform duration-500 ease-in-out ${isForgeMode ? 'transform -translate-x-0' : 'transform -translate-x-full'}`}>
          <div className="grid grid-cols-2">
            <div className={`w-full transition-opacity duration-300 ${isForgeMode ? 'opacity-100' : 'opacity-0'}`}>
              {/* Forge Mode Form */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="prompt" className="block text-sm font-medium text-slate-300">
                      Enter your creative prompt
                    </label>
                    {history.length > 0 && (
                       <div className="relative">
                        <button type="button" onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                            <HistoryIcon className="w-3.5 h-3.5" /> History
                        </button>
                        {showHistory && (
                            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 slide-in-down">
                                <ul className="max-h-60 overflow-y-auto">
                                    {history.map((item, index) => (
                                        <li key={index} onClick={() => { setPrompt(item); setShowHistory(false);}} className="text-sm text-slate-300 p-2 cursor-pointer hover:bg-slate-700/50 truncate">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                      </div>
                    )}
                  </div>
                  <textarea
                    id="prompt"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A majestic lion wearing a crown, cinematic lighting, 4k"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 placeholder-slate-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Model & Number of Images */}
                   <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      AI Model
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-1 rounded-full border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setOptions(prev => ({ ...prev, model: ModelType.IMAGEN }))}
                        className={`px-4 py-2 text-sm rounded-full transition-colors font-semibold ${options.model === ModelType.IMAGEN ? 'bg-cyan-500 text-white shadow-md' : 'hover:bg-slate-700/50'}`}
                      >
                        Imagen 4
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptions(prev => ({ ...prev, model: ModelType.NANO_BANANA }))}
                        className={`px-4 py-2 text-sm rounded-full transition-colors font-semibold ${options.model !== ModelType.IMAGEN ? 'bg-cyan-500 text-white shadow-md' : 'hover:bg-slate-700/50'}`}
                      >
                        Nano
                      </button>
                    </div>
                  </div>
                  
                  <div className={`transition-opacity duration-300 ${options.model === ModelType.IMAGEN ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <label htmlFor="num-images" className="block text-sm font-medium text-slate-300 mb-2">
                      Number of Images <span className="text-slate-400">({options.numberOfImages})</span>
                    </label>
                    <input
                      id="num-images"
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={options.numberOfImages}
                      onChange={(e) => setOptions(prev => ({ ...prev, numberOfImages: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      disabled={options.model !== ModelType.IMAGEN || isLoading}
                    />
                  </div>
                </div>

                <div className={`transition-opacity duration-300 ${options.model === ModelType.IMAGEN ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {AspectRatios.map(ratio => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setOptions(prev => ({...prev, aspectRatio: ratio}))}
                          className={`py-2 text-xs rounded-lg border transition-all duration-200 transform hover:scale-105 active:scale-100 ${options.aspectRatio === ratio ? 'bg-cyan-500 text-white border-cyan-500 shadow-md' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                          disabled={options.model !== ModelType.IMAGEN || isLoading}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
              </div>
            </div>

            {/* Battle Mode Form Placeholder */}
            <div className={`w-full absolute top-0 left-full transition-opacity duration-300 ${!isForgeMode ? 'opacity-100' : 'opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ContenderForm title="Contender A" options={optionsA} setOptions={setOptionsA} prompt={promptA} setPrompt={setPromptA} isLoading={isLoading} />
                  <ContenderForm title="Contender B" options={optionsB} setOptions={setOptionsB} prompt={promptB} setPrompt={setPromptB} isLoading={isLoading} />
                </div>
            </div>
          </div>
        </div>
      </div>


      <button
        type="submit"
        disabled={isLoading || (isForgeMode && !prompt.trim()) || (!isForgeMode && !isBattleReady)}
        className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 disabled:scale-100 shadow-lg hover:shadow-cyan-500/30 disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            {isForgeMode ? <SparklesIcon className="w-5 h-5 mr-2" /> : <SwordsIcon className="w-5 h-5 mr-2" />}
            {isForgeMode ? 'Generate' : 'Start Battle'}
          </>
        )}
      </button>
    </form>
  );
};