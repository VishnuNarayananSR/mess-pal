import { NextRequest, NextResponse } from "next/server";
import { incrementVisitorCount } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const count = await incrementVisitorCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error handling visitor count:", error);
    return NextResponse.json(
      { error: "Failed to update visitor count" },
      { status: 500 }
    );
  }
}
