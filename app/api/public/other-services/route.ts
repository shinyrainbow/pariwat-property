import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/other-services - Get active services
export async function GET() {
  try {
    const services = await prisma.otherService.findMany({
      where: {
        isActive: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
