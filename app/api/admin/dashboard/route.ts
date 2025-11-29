import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardStats, getProperties } from "@/lib/data";

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = getDashboardStats();
  const properties = getProperties();

  // Get recent properties (last 5)
  const recentProperties = [...properties]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Get top viewed properties
  const topViewed = [...properties]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Property type distribution
  const propertyTypeDistribution = {
    Condo: properties.filter((p) => p.propertyType === "Condo").length,
    Townhouse: properties.filter((p) => p.propertyType === "Townhouse").length,
    SingleHouse: properties.filter((p) => p.propertyType === "SingleHouse")
      .length,
  };

  // Status distribution
  const statusDistribution = {
    active: properties.filter((p) => p.status === "active").length,
    inactive: properties.filter((p) => p.status === "inactive").length,
    sold: properties.filter((p) => p.status === "sold").length,
    rented: properties.filter((p) => p.status === "rented").length,
  };

  return NextResponse.json({
    success: true,
    data: {
      stats,
      recentProperties,
      topViewed,
      propertyTypeDistribution,
      statusDistribution,
    },
  });
}
