import { NextRequest, NextResponse } from "next/server";
import { generateCharacters } from "@/lib/character";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { storyContext, characterCount = 3, style = "manga" } = await req.json();

  if (!storyContext || storyContext.trim().length === 0) {
    return NextResponse.json({ error: "請提供故事背景" }, { status: 400 });
  }

  try {
    const result = await generateCharacters(storyContext, characterCount, style);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Character generation error:", error);
    return NextResponse.json(
      { error: "角色生成失敗", detail: error.message },
      { status: 500 }
    );
  }
}
