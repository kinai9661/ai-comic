import { NextRequest, NextResponse } from "next/server";
import { generateStoryboard } from "@/lib/storyboard";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { story, panelCount = 4, style = "manga" } = await req.json();

  if (!story || story.trim().length === 0) {
    return NextResponse.json({ error: "請提���故事內容" }, { status: 400 });
  }

  try {
    const result = await generateStoryboard(story, panelCount, style);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Storyboard error:", error);
    return NextResponse.json(
      { error: "分鏡生成失敗", detail: error.message },
      { status: 500 }
    );
  }
}
