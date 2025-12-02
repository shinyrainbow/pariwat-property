import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - Fetch all portfolio items
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
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

// POST - Create new portfolio item
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { imageUrl, title, description, order, isActive } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400 }
      );
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        imageUrl,
        title: title || null,
        description: description || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}

// PUT - Update portfolio item
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, imageUrl, title, description, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...(imageUrl !== undefined && { imageUrl }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

// DELETE - Delete portfolio item
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}
