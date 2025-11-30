import { NextRequest, NextResponse } from "next/server";
import { getClosedDeals } from "@/lib/property-extensions";

// GET /api/public/enhanced-properties/closed-deals - Get closed deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "8");

    const closedDeals = await getClosedDeals(limit);

    return NextResponse.json({
      success: true,
      data: closedDeals,
    });
  } catch (error) {
    console.error("Error fetching closed deals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch closed deals" },
      { status: 500 }
    );
  }
}
