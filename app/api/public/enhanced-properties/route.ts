import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEnhancedProperties } from "@/lib/property-extensions";
import type { FetchPropertiesParams } from "@/lib/nainahub";

// GET /api/public/enhanced-properties - Get properties from external API merged with local extensions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: FetchPropertiesParams = {};

    const propertyType = searchParams.get("propertyType");
    if (propertyType && ["Condo", "Townhouse", "SingleHouse", "Land"].includes(propertyType)) {
      params.propertyType = propertyType as FetchPropertiesParams["propertyType"];
    }

    const listingType = searchParams.get("listingType");
    if (listingType && ["rent", "sale", ""].includes(listingType)) {
      params.listingType = listingType as FetchPropertiesParams["listingType"];
    }

    const minPrice = searchParams.get("minPrice");
    if (minPrice) params.minPrice = parseInt(minPrice);

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) params.maxPrice = parseInt(maxPrice);

    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms) params.bedrooms = parseInt(bedrooms);

    const page = searchParams.get("page");
    if (page) params.page = parseInt(page);

    const limit = searchParams.get("limit");
    if (limit) params.limit = parseInt(limit);

    // Check if includeHidden is requested (admin only)
    const includeHidden = searchParams.get("includeHidden") === "true";
    let options = { includeHidden: false };

    if (includeHidden) {
      // Verify admin session for includeHidden
      const session = await getServerSession(authOptions);
      if (session) {
        options.includeHidden = true;
      }
    }

    const response = await getEnhancedProperties(params, options);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching enhanced properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
