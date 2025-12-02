import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/admin/settings - Get all site settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.siteSetting.findMany();

    // Convert to key-value object
    const settingsObject: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsObject[setting.key] = setting.value;
    });

    return NextResponse.json({ success: true, data: settingsObject });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update a site setting
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Key is required" },
        { status: 400 }
      );
    }

    // Upsert the setting
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
