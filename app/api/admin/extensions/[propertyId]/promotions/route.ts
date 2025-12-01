import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getPromotionsByPropertyId,
  addPromotion,
  updatePromotion,
  deletePromotion,
  getExtensionByPropertyId,
} from "@/lib/property-extensions";

interface RouteParams {
  params: Promise<{ propertyId: string }>;
}

// GET /api/admin/extensions/[propertyId]/promotions - Get all promotions for a property
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await params;
    const promotions = await getPromotionsByPropertyId(propertyId);

    return NextResponse.json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

// POST /api/admin/extensions/[propertyId]/promotions - Add a promotion
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await params;
    const body = await request.json();

    if (!body.label || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: label and type" },
        { status: 400 }
      );
    }

    await addPromotion(propertyId, {
      label: body.label,
      type: body.type,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
      isActive: body.isActive ?? true,
    });

    // Return the full extension with all promotions
    const extension = await getExtensionByPropertyId(propertyId);

    return NextResponse.json({
      success: true,
      data: extension,
    });
  } catch (error) {
    console.error("Error adding promotion:", error);
    return NextResponse.json(
      { error: "Failed to add promotion" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/extensions/[propertyId]/promotions - Update a promotion (requires promotionId in body)
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.promotionId) {
      return NextResponse.json(
        { error: "Missing required field: promotionId" },
        { status: 400 }
      );
    }

    const promotion = await updatePromotion(body.promotionId, {
      label: body.label,
      type: body.type,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
      isActive: body.isActive,
    });

    return NextResponse.json({
      success: true,
      data: promotion,
    });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/extensions/[propertyId]/promotions - Delete a promotion (requires promotionId in query)
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const promotionId = searchParams.get("promotionId");

    if (!promotionId) {
      return NextResponse.json(
        { error: "Missing required query param: promotionId" },
        { status: 400 }
      );
    }

    await deletePromotion(promotionId);

    return NextResponse.json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}
