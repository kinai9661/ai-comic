import { NextRequest, NextResponse } from "next/server";
import { generateScenes } from "@/lib/background-generator";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { storyContext, panelCount = 8, style = "manga" } = await req.json();

  if (!storyContext || storyContext.trim().length === 0) {
    return NextResponse.json({ error: "請提供故事背景" }, { status: 400 });
  }

  try {
    const result = await generateScenes(storyContext, panelCount, style);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scene generation error:", error);
    return NextResponse.json(
      { error: "場景生成失敗", detail: error.message },
      { status: 500 }
    );
  }
}
