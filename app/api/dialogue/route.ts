import { NextRequest, NextResponse } from "next/server";
import { generateDialogueBoxes } from "@/lib/dialogue-system";
import type { AdvancedPanel } from "@/lib/advanced-storyboard";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { panels } = await req.json();

  if (!panels || panels.length === 0) {
    return NextResponse.json({ error: "請提供分鏡資料" }, { status: 400 });
  }

  try {
    const result = await generateDialogueBoxes(panels as AdvancedPanel[]);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Dialogue generation error:", error);
    return NextResponse.json(
      { error: "對話框生成失敗", detail: error.message },
      { status: 500 }
    );
  }
}
