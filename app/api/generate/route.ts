import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/infip";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { panels } = await req.json();

  try {
    const results = await Promise.all(
      panels.map(async (panel: { prompt: string; dialogue: string; description: string }) => {
        const urls = await generateImage({
          prompt: `${panel.prompt}, manga style, high quality comic art, detailed line art`,
          n: 1,
          size: "1024x1024",
          model: "img4",
        });
        return {
          imageUrl: urls[0],
          dialogue: panel.dialogue,
          description: panel.description,
        };
      })
    );

    return NextResponse.json({ panels: results });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "���像生成失敗", detail: error.message },
      { status: 500 }
    );
  }
}
