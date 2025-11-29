import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Fetch property data for dynamic metadata
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/properties/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        title: "รายละเอียดทรัพย์สิน",
        description: "ดูรายละเอียดอสังหาริมทรัพย์จาก Pariwat Property",
      };
    }

    const property = await res.json();
    const title = property.propertyTitleTh || property.propertyTitleEn;
    const price = property.rentalRateNum
      ? `เช่า ฿${property.rentalRateNum.toLocaleString()}/เดือน`
      : property.sellPriceNum
        ? `ขาย ฿${property.sellPriceNum.toLocaleString()}`
        : "";
    const location = [property.district, property.province]
      .filter(Boolean)
      .join(", ");

    return {
      title: title,
      description: `${title} ${price} ${location} - ${property.bedRoomNum} ห้องนอน ${property.bathRoomNum} ห้องน้ำ ${property.roomSizeNum || property.usableAreaSqm || ""} ตร.ม.`,
      keywords: [
        property.propertyType,
        property.district,
        property.province,
        "คอนโด",
        "บ้าน",
        property.listingType === "rent" ? "เช่า" : "ขาย",
      ].filter(Boolean),
      openGraph: {
        title: `${title} | Pariwat Property`,
        description: `${price} ${location}`,
        url: `https://primeestate.co.th/property/${id}`,
        type: "website",
        images: property.imageUrls?.[0]
          ? [
              {
                url: property.imageUrls[0],
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Pariwat Property`,
        description: `${price} ${location}`,
        images: property.imageUrls?.[0] ? [property.imageUrls[0]] : [],
      },
    };
  } catch {
    return {
      title: "รายละเอียดทรัพย์สิน",
      description: "ดูรายละเอียดอสังหาริมทรัพย์จาก Pariwat Property",
    };
  }
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
