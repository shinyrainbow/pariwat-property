import { NextRequest, NextResponse } from "next/server";
import { getEnhancedPropertiesWithPromotions } from "@/lib/property-extensions";

// GET /api/public/enhanced-properties/with-promotions - Get properties with active promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");

    const propertiesWithPromotions = await getEnhancedPropertiesWithPromotions(limit);

    return NextResponse.json({
      success: true,
      data: propertiesWithPromotions,
    });
  } catch (error) {
    console.error("Error fetching properties with promotions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties with promotions" },
      { status: 500 }
    );
  }
}
