import client from "./llm";

export interface Scene {
  id: string;
  name: string;
  description: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night" | "dawn" | "dusk";
  weather: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "foggy";
  season: "spring" | "summer" | "autumn" | "winter";
  location: string;
  atmosphere: string;
  colorPalette: string[];
  imagePrompt: string;
}

export interface BackgroundGenerationResult {
  scenes: Scene[];
  environmentNotes: string;
}

export async function generateScenes(
  storyContext: string,
  panelCount: number = 8,
  style: string = "manga"
): Promise<BackgroundGenerationResult> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      max_tokens: 8000,
      messages: [
        {
          role: "system",
          content: `你是專業的場景設計師。根據故事背景，為 ${panelCount} 個分鏡設計場景和背景。
每個場景需要包含：
- 場景名稱
- 詳細描述
- 時間（早晨、下午、傍晚、夜晚、黎明、黃昏）
- 天氣（晴朗、多雲、下雨、下雪、暴風雨、霧霾）
- 季節（春、夏、秋、冬）
- 位置
- 氛圍
- 色彩調色板
- 英文圖像生成提示詞（${style} style）

輸出為 JSON 格式：
{
  "scenes": [
    {
      "id": "scene_1",
      "name": "場景名稱",
      "description": "詳細描述",
      "timeOfDay": "morning/afternoon/evening/night/dawn/dusk",
      "weather": "sunny/cloudy/rainy/snowy/stormy/foggy",
      "season": "spring/summer/autumn/winter",
      "location": "位置",
      "atmosphere": "氛圍描述",
      "colorPalette": ["顏色1", "顏色2"],
      "imagePrompt": "英文圖像生成提示詞"
    }
  ],
  "environmentNotes": "環境設計筆記"
}`,
        },
        {
          role: "user",
          content: storyContext,
        },
      ],
    } as any);

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("API 未返回有效內容");
    }

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content) as BackgroundGenerationResult;
    return result;
  } catch (error: any) {
    console.error("Scene generation error:", error.message);
    throw new Error(`場景生成失敗: ${error.message}`);
  }
}
