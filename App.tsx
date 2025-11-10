
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ImageGrid } from './components/ImageGrid';
import { ImageGenerationOptions, ModelType, BattleGenerationOptions, BattleResults, GeneratedImage } from './types';
import { generateWithImagen, generateWithNanoBanana } from './services/geminiService';
import { Footer } from './components/Footer';

export type AppMode = 'forge' | 'battle';

const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [battleResults, setBattleResults] = useState<BattleResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [numImagesToGenerate, setNumImagesToGenerate] = useState<number>(1);
  const [mode, setMode] = useState<AppMode>('forge');

  const handleGenerate = useCallback(async (prompt: string, options: ImageGenerationOptions) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setBattleResults(null);
    setNumImagesToGenerate(options.model === ModelType.IMAGEN ? options.numberOfImages : 1);

    try {
      let imageUrls: string[] = [];
      if (options.model === ModelType.IMAGEN) {
        imageUrls = await generateWithImagen(prompt, options.numberOfImages, options.aspectRatio);
      } else {
        imageUrls = await generateWithNanoBanana(prompt);
      }
      const newImages: GeneratedImage[] = imageUrls.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        src: url,
        prompt: prompt,
        options: options,
        isUpscaling: false,
        isUpscaled: false, 
      }));
      setGeneratedImages(newImages);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBattleGenerate = useCallback(async (options: BattleGenerationOptions) => {
    const { promptA, optionsA, promptB, optionsB } = options;
    if (!promptA.trim() || !promptB.trim()) {
      setError("Please enter a prompt for both contenders.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setBattleResults(null);

    const generateImage = async (prompt: string, opts: ImageGenerationOptions): Promise<string[]> => {
      if (opts.model === ModelType.IMAGEN) {
        return generateWithImagen(prompt, 1, opts.aspectRatio);
      }
      return generateWithNanoBanana(prompt);
    };

    try {
      const [resultA, resultB] = await Promise.all([
        generateImage(promptA, optionsA),
        generateImage(promptB, optionsB),
      ]);
      // FIX: Pass options through to battle results state.
      setBattleResults({
        contenderA: { image: resultA[0], prompt: promptA, options: optionsA },
        contenderB: { image: resultB[0], prompt: promptB, options: optionsB },
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpscale = useCallback(async (imageId: string) => {
    const imageToUpscale = generatedImages.find(img => img.id === imageId);
    if (!imageToUpscale || imageToUpscale.isUpscaling) return;

    setGeneratedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isUpscaling: true } : img
    ));
    
    try {
      // Always use Imagen for upscaling for best quality
      const upscaledUrls = await generateWithImagen(imageToUpscale.prompt, 1, imageToUpscale.options.aspectRatio);
      
      setGeneratedImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, src: upscaledUrls[0], isUpscaling: false, isUpscaled: true } 
          : img
      ));
    } catch (err) {
      console.error("Upscale failed:", err);
      setError("Failed to upscale the image.");
      setGeneratedImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, isUpscaling: false } : img
      ));
    }
  }, [generatedImages]);

  const handleClear = useCallback(() => {
    setGeneratedImages([]);
    setBattleResults(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex flex-col">
        <div className="w-full max-w-4xl mx-auto">
          <PromptForm 
            onGenerate={handleGenerate} 
            onBattleGenerate={handleBattleGenerate}
            isLoading={isLoading}
            mode={mode}
            setMode={setMode} 
          />
          <ImageGrid 
            images={generatedImages}
            battleResults={battleResults}
            isLoading={isLoading} 
            error={error}
            numImagesToGenerate={numImagesToGenerate}
            mode={mode}
            onUpscale={handleUpscale}
            onClear={handleClear}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
