

export enum ModelType {
  NANO_BANANA = 'gemini-2.5-flash-image',
  IMAGEN = 'imagen-4.0-generate-001',
}

export const AspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;
export type AspectRatio = typeof AspectRatios[number];

export interface ImageGenerationOptions {
  model: ModelType;
  numberOfImages: number;
  aspectRatio: AspectRatio;
}

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  options: ImageGenerationOptions;
  isUpscaling: boolean;
  isUpscaled: boolean;
}

export interface BattleGenerationOptions {
  promptA: string;
  optionsA: ImageGenerationOptions;
  promptB: string;
  optionsB: ImageGenerationOptions;
}

export interface BattleResult {
    image: string;
    prompt: string;
    // FIX: Add options to BattleResult to pass them to ImageCard.
    options: ImageGenerationOptions;
}

export interface BattleResults {
    contenderA: BattleResult;
    contenderB: BattleResult;
}
