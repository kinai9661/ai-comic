import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "API 正常運作",
    env: {
      hasDoooKey: !!process.env.DOOO_API_KEY,
      hasInfipKey: !!process.env.INFIP_API_KEY,
    },
  });
}
