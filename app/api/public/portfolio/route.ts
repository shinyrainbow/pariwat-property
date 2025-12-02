import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all active portfolio items for public display
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: portfolios });
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}
