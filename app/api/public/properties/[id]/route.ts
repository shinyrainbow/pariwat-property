import { NextRequest, NextResponse } from "next/server";
import { getPropertyById, updateProperty } from "@/lib/data";

// GET /api/public/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return NextResponse.json(
      { success: false, error: "Property not found" },
      { status: 404 }
    );
  }

  // Only return active properties to public
  if (property.status !== "active") {
    return NextResponse.json(
      { success: false, error: "Property not available" },
      { status: 404 }
    );
  }

  // Increment views
  updateProperty(id, { views: property.views + 1 });

  return NextResponse.json({
    success: true,
    data: property,
  });
}
