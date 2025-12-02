import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewPropertyInquiry } from "@/lib/line-notify";

// POST /api/public/inquiries - Submit a property inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, propertyCode, propertyTitle, name, phone, message } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Save inquiry to database
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId: propertyId || null,
        propertyCode: propertyCode || null,
        propertyTitle: propertyTitle || null,
        name,
        phone,
        message: message || null,
        status: "new",
      },
    });

    // Send LINE notification (non-blocking)
    notifyNewPropertyInquiry({
      name,
      phone,
      propertyTitle: propertyTitle || undefined,
      propertyCode: propertyCode || undefined,
      message: message || undefined,
    }).catch((err) => console.error("Failed to send LINE notification:", err));

    return NextResponse.json({
      success: true,
      data: { id: inquiry.id },
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

// GET /api/public/inquiries - Get all inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const inquiries = await prisma.inquiry.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
