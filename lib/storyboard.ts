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
    console.log("Starting storyboard generation...");
    console.log("API Key present:", !!process.env.DOOO_API_KEY);
    
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

    console.log("API response received");

    if (!completion?.choices?.[0]?.message?.content) {
      console.error("Invalid response structure:", JSON.stringify(completion).substring(0, 200));
      throw new Error("API 未返回有效內容");
    }

    const content = completion.choices[0].message.content;
    console.log("Parsing JSON content...");
    
    const result = JSON.parse(content) as StoryboardResult;
    console.log("Storyboard generated successfully");
    
    return result;
  } catch (error: any) {
    console.error("LLM error:", error.message);
    console.error("Error code:", error.code);
    console.error("Error status:", error.status);
    console.error("Full error:", JSON.stringify(error).substring(0, 500));
    throw new Error(`分鏡生成失敗: ${error.message}`);
  }
}
