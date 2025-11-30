import { NextRequest, NextResponse } from "next/server";
import { getPopularProperties } from "@/lib/property-extensions";

// GET /api/public/enhanced-properties/popular - Get popular properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "8");

    const popularProperties = await getPopularProperties(limit);

    return NextResponse.json({
      success: true,
      data: popularProperties,
    });
  } catch (error) {
    console.error("Error fetching popular properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular properties" },
      { status: 500 }
    );
  }
}
