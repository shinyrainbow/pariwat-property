import { NextRequest, NextResponse } from "next/server";
import { getEnhancedPropertyById } from "@/lib/property-extensions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/public/enhanced-properties/[id] - Get single enhanced property
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const property = await getEnhancedPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // Don't return hidden properties to public
    if (property.extension?.isHidden) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error fetching enhanced property:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
