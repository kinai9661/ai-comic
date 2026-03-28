import client from "./llm";

export interface Panel {
  panel: number;
  prompt: string;
  dialogue: string;
  description: string;
  camera_angle: string;
  emotion: string;
}

export interface StoryboardResult {
  panels: Panel[];
  style: string;
  title: string;
}

export async function generateStoryboard(
  story: string,
  panelCount: number = 4,
  style: string = "manga"
): Promise<StoryboardResult> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `你是專業漫畫分鏡師。請將故事拆分為 ${panelCount} 個 panel。
每個 panel 需要：prompt（英文圖像提示）、dialogue（繁體中文對話）、description、camera_angle、emotion。
輸出為 JSON：{"title":"...","style":"${style}","panels":[...]}`,
        },
        {
          role: "user",
          content: story,
        },
      ],
    } as any);

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("API 未返回有效內容");
    }

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content) as StoryboardResult;
    return result;
  } catch (error: any) {
    console.error("LLM error:", error.message);
    console.error("Full error:", error);
    throw new Error(`分鏡生成失敗: ${error.message}`);
  }
}
