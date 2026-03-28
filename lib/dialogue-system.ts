import client from "./llm";
import type { AdvancedPanel } from "./advanced-storyboard";

export type DialogueBoxType = "speech" | "thought" | "narration" | "scream" | "whisper" | "singing";
export type DialoguePosition = "top" | "middle" | "bottom" | "left" | "right";
export type Emotion = "angry" | "sad" | "happy" | "surprised" | "neutral" | "confused" | "excited" | "scared";

export interface DialogueBox {
  id: string;
  type: DialogueBoxType;
  character?: string;
  text: string;
  position: DialoguePosition;
  emotion?: Emotion;
  fontSize: "small" | "medium" | "large";
  fontStyle: "normal" | "italic" | "bold";
}

export interface DialogueResult {
  panels: DialogueBox[][];
  narratorVoice?: string;
}

export async function generateDialogueBoxes(
  panels: AdvancedPanel[]
): Promise<DialogueResult> {
  try {
    const panelDescriptions = panels
      .map(
        (p) =>
          `Panel ${p.panel}: ${p.type} - ${p.characters.join(", ")} - ${p.dialogue || p.actionDescription}`
      )
      .join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      max_tokens: 6000,
      messages: [
        {
          role: "system",
          content: `你是專業的漫畫對話框設計師。根據分鏡內容，為每個 panel 設計對話框。
每個對話框需要包含：
- 類型（對話、思考、旁白、尖叫、低語、唱歌）
- 角色名稱（如果適用）
- 文本內容
- 位置（上、中、下、左、右）
- 情緒（憤怒、悲傷、快樂、驚訝、中立、困惑、興奮、害怕）
- 字體大小（小、中、大）
- 字體風格（正常、斜體、粗體）

輸出為 JSON 格式：
{
  "panels": [
    [
      {
        "id": "box_1_1",
        "type": "speech/thought/narration/scream/whisper/singing",
        "character": "角色名稱",
        "text": "對話內容",
        "position": "top/middle/bottom/left/right",
        "emotion": "angry/sad/happy/surprised/neutral/confused/excited/scared",
        "fontSize": "small/medium/large",
        "fontStyle": "normal/italic/bold"
      }
    ]
  ],
  "narratorVoice": "旁白風格描述"
}`,
        },
        {
          role: "user",
          content: panelDescriptions,
        },
      ],
    } as any);

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("API 未返回有效內容");
    }

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content) as DialogueResult;
    return result;
  } catch (error: any) {
    console.error("Dialogue generation error:", error.message);
    throw new Error(`對話框生成失敗: ${error.message}`);
  }
}
