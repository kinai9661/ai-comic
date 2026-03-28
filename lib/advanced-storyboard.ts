import client from "./llm";
import type { Character } from "./character";

export type PanelType = "dialogue" | "action" | "reaction" | "transition" | "climax";
export type CameraAngle = "close-up" | "medium" | "wide" | "bird's-eye" | "low-angle" | "dutch-angle";
export type Lighting = "bright" | "dim" | "dramatic" | "natural" | "neon" | "candlelight";

export interface AdvancedPanel {
  panel: number;
  type: PanelType;
  characters: string[]; // 角色名稱
  cameraAngle: CameraAngle;
  lighting: Lighting;
  mood: string;
  sceneDescription: string;
  prompt: string;
  dialogue: string;
  soundEffect?: string;
  transitionEffect?: string;
  actionDescription?: string;
}

export interface AdvancedStoryboardResult {
  panels: AdvancedPanel[];
  pacing: string;
  climaxPanel: number;
  themes: string[];
}

export async function generateAdvancedStoryboard(
  story: string,
  characters: Character[],
  panelCount: number = 8,
  style: string = "manga"
): Promise<AdvancedStoryboardResult> {
  try {
    const characterDescriptions = characters
      .map((c) => `${c.name}（${c.role}）：${c.backstory}`)
      .join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      max_tokens: 12000,
      messages: [
        {
          role: "system",
          content: `你是專業的漫畫分鏡師。根據故事和角色設定，創建 ${panelCount} 個高質量的分鏡。
每個分鏡需要包含：
- 分鏡類型（對話、動作、反應、轉場、高潮）
- 出現的角色
- 攝影機角度（特寫、中景、遠景、俯視、低角度、荷蘭角）
- 光線設定（明亮、昏暗、戲劇性、自然、霓虹、燭光）
- 氛圍和情緒
- 場景描述
- 對話內容
- 音效提示
- 轉場效果
- 英文圖像生成提示詞（${style} style）

輸出為 JSON 格式：
{
  "panels": [
    {
      "panel": 1,
      "type": "dialogue/action/reaction/transition/climax",
      "characters": ["角色名稱"],
      "cameraAngle": "close-up/medium/wide/bird's-eye/low-angle/dutch-angle",
      "lighting": "bright/dim/dramatic/natural/neon/candlelight",
      "mood": "情緒描述",
      "sceneDescription": "場景描述",
      "prompt": "英文圖像生成提示詞",
      "dialogue": "對話內容",
      "soundEffect": "音效",
      "transitionEffect": "轉場效果",
      "actionDescription": "動作描述"
    }
  ],
  "pacing": "故事節奏分析",
  "climaxPanel": 6,
  "themes": ["主題1", "主題2"]
}`,
        },
        {
          role: "user",
          content: `故事：${story}\n\n角色設定：\n${characterDescriptions}`,
        },
      ],
    } as any);

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("API 未返回有效內容");
    }

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content) as AdvancedStoryboardResult;
    return result;
  } catch (error: any) {
    console.error("Advanced storyboard generation error:", error.message);
    throw new Error(`進階分鏡生成失敗: ${error.message}`);
  }
}
