import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { fetchNainaHubProperties } from "@/lib/nainahub";

// GET /api/admin/promotions - Get all promotions with property info
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all promotions with their extension info
    const promotions = await prisma.promotion.findMany({
      include: {
        extension: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch properties from NainaHub to get property details
    const apiResponse = await fetchNainaHubProperties({ limit: 100 });
    const propertyMap = new Map(
      apiResponse.data.map((p) => [p.id, p])
    );

    // Merge promotion data with property info
    const promotionsWithProperty = promotions.map((promo) => {
      const property = propertyMap.get(promo.extension.externalPropertyId);
      return {
        ...promo,
        property: property
          ? {
              id: property.id,
              title: property.propertyTitleTh || property.propertyTitleEn || property.project?.projectNameTh || property.project?.projectNameEn || "ไม่ระบุชื่อ",
              code: property.agentPropertyCode || property.projectPropertyCode,
              type: property.propertyType,
              imageUrl: property.imageUrls?.[0] || null,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: promotionsWithProperty,
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/promotions - Delete a promotion
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const promotionId = searchParams.get("id");

    if (!promotionId) {
      return NextResponse.json(
        { error: "Missing required query param: id" },
        { status: 400 }
      );
    }

    await prisma.promotion.delete({
      where: { id: promotionId },
    });

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
