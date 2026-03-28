import client from "./llm";

export interface Character {
  id: string;
  name: string;
  age: number;
  gender: string;
  personality: string[];
  appearance: {
    height: string;
    build: string;
    hairColor: string;
    hairStyle: string;
    eyeColor: string;
    skinTone: string;
    clothing: string;
    accessories: string[];
    distinguishingFeatures: string[];
  };
  backstory: string;
  role: "protagonist" | "antagonist" | "supporting" | "minor";
  skills: string[];
  imagePrompt: string;
}

export interface CharacterGenerationResult {
  characters: Character[];
  relationships: Array<{
    character1: string;
    character2: string;
    relationship: string;
  }>;
}

export async function generateCharacters(
  storyContext: string,
  characterCount: number = 3,
  style: string = "manga"
): Promise<CharacterGenerationResult> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      max_tokens: 8000,
      messages: [
        {
          role: "system",
          content: `你是專業的角色設計師。根據故事背景，為故事創建 ${characterCount} 個獨特的角色。
每個角色需要完整的設定，包括外觀、性格、背景故事和技能。
同時描述角色之間的關係。

輸出為 JSON 格式：
{
  "characters": [
    {
      "id": "char_1",
      "name": "角色名稱",
      "age": 25,
      "gender": "male/female/other",
      "personality": ["特質1", "特質2"],
      "appearance": {
        "height": "身高",
        "build": "體型",
        "hairColor": "髮色",
        "hairStyle": "髮型",
        "eyeColor": "眼色",
        "skinTone": "膚色",
        "clothing": "服裝描述",
        "accessories": ["配飾1"],
        "distinguishingFeatures": ["特徵1"]
      },
      "backstory": "背景故事",
      "role": "protagonist/antagonist/supporting/minor",
      "skills": ["技能1", "技能2"],
      "imagePrompt": "英文圖像生成提示詞，${style} style"
    }
  ],
  "relationships": [
    {
      "character1": "角色1名稱",
      "character2": "角色2名稱",
      "relationship": "關係描述"
    }
  ]
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
    const result = JSON.parse(content) as CharacterGenerationResult;
    return result;
  } catch (error: any) {
    console.error("Character generation error:", error.message);
    throw new Error(`角色生成失敗: ${error.message}`);
  }
}

export async function generateCharacterImage(
  character: Character
): Promise<string> {
  // 使用 infip.ts 中的 generateImage 函數
  const { generateImage } = await import("./infip");
  const urls = await generateImage({
    prompt: character.imagePrompt,
    n: 1,
    size: "1024x1024",
    model: "img4",
  });
  return urls[0];
}
