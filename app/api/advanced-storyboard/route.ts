import { NextRequest, NextResponse } from "next/server";
import { generateAdvancedStoryboard } from "@/lib/advanced-storyboard";
import type { Character } from "@/lib/character";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { story, characters, panelCount = 8, style = "manga" } = await req.json();

  if (!story || story.trim().length === 0) {
    return NextResponse.json({ error: "請提供故事內容" }, { status: 400 });
  }

  if (!characters || characters.length === 0) {
    return NextResponse.json({ error: "請提供角色設定" }, { status: 400 });
  }

  try {
    const result = await generateAdvancedStoryboard(
      story,
      characters as Character[],
      panelCount,
      style
    );
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Advanced storyboard error:", error);
    return NextResponse.json(
      { error: "進階分鏡生成失敗", detail: error.message },
      { status: 500 }
    );
  }
}
