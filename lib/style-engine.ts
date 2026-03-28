import client from "./llm";
import type { AdvancedPanel } from "./advanced-storyboard";

export type ComicStyle = "manga" | "webtoon" | "american" | "european" | "watercolor" | "oil" | "3d";

export interface StyleConfig {
  name: string;
  promptPrefix: string;
  colorPalette: string[];
  lineStyle: string;
  textureStyle: string;
  detailLevel: "minimal" | "moderate" | "detailed" | "ultra-detailed";
}

export const STYLE_CONFIGS: Record<ComicStyle, StyleConfig> = {
  manga: {
    name: "日漫",
    promptPrefix: "manga style, high quality line art, detailed ink drawing",
    colorPalette: ["black", "white", "gray"],
    lineStyle: "clean ink lines, screentone",
    textureStyle: "halftone dots, crosshatching",
    detailLevel: "detailed",
  },
  webtoon: {
    name: "韓漫",
    promptPrefix: "webtoon style, digital art, smooth colors, modern",
    colorPalette: ["vibrant", "saturated"],
    lineStyle: "smooth digital lines",
    textureStyle: "flat colors, gradient",
    detailLevel: "detailed",
  },
  american: {
    name: "美漫",
    promptPrefix: "american comic style, bold lines, dynamic action",
    colorPalette: ["primary colors", "bold"],
    lineStyle: "thick bold lines",
    textureStyle: "solid colors, bold shadows",
    detailLevel: "moderate",
  },
  european: {
    name: "歐漫",
    promptPrefix: "european comic style, realistic, detailed backgrounds",
    colorPalette: ["natural", "muted"],
    lineStyle: "realistic lines",
    textureStyle: "realistic shading",
    detailLevel: "ultra-detailed",
  },
  watercolor: {
    name: "水彩風格",
    promptPrefix: "watercolor painting style, soft edges, artistic",
    colorPalette: ["pastel", "soft"],
    lineStyle: "soft watercolor strokes",
    textureStyle: "watercolor texture, wet paper effect",
    detailLevel: "moderate",
  },
  oil: {
    name: "油畫風格",
    promptPrefix: "oil painting style, rich colors, textured brushstrokes",
    colorPalette: ["warm", "rich"],
    lineStyle: "oil painting strokes",
    textureStyle: "thick paint texture, impasto",
    detailLevel: "detailed",
  },
  "3d": {
    name: "3D 風格",
    promptPrefix: "3D render, CGI, cinematic lighting, high quality",
    colorPalette: ["realistic", "cinematic"],
    lineStyle: "3D model edges",
    textureStyle: "3D textures, realistic materials",
    detailLevel: "ultra-detailed",
  },
};

export function getStyleConfig(style: ComicStyle): StyleConfig {
  return STYLE_CONFIGS[style] || STYLE_CONFIGS.manga;
}

export function enhancePromptWithStyle(
  basePrompt: string,
  style: ComicStyle
): string {
  const config = getStyleConfig(style);
  return `${config.promptPrefix}, ${basePrompt}, ${config.lineStyle}, ${config.textureStyle}`;
}

export async function generateStyleVariations(
  basePrompt: string,
  styles: ComicStyle[]
): Promise<Record<ComicStyle, string>> {
  const variations: Record<ComicStyle, string> = {} as any;
  for (const style of styles) {
    variations[style] = enhancePromptWithStyle(basePrompt, style);
  }
  return variations;
}
