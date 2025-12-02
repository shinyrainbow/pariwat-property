import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewPropertyListing } from "@/lib/line-notify";

// POST - Submit a property listing request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, listingType, propertyType, location, size, price, details } = body;

    // Validation
    if (!name || !phone || !listingType || !propertyType) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const propertyListing = await prisma.propertyListing.create({
      data: {
        name,
        phone,
        email: email || null,
        listingType,
        propertyType,
        location: location || null,
        size: size || null,
        price: price || null,
        details: details || null,
        status: "new",
      },
    });

    // Send LINE notification (non-blocking)
    notifyNewPropertyListing({
      name,
      phone,
      propertyType,
      listingType,
      location: location || undefined,
    }).catch((err) => console.error("Failed to send LINE notification:", err));

    return NextResponse.json({ success: true, data: propertyListing });
  } catch (error) {
    console.error("Error creating property listing:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
