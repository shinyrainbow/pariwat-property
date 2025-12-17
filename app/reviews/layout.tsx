import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "รีวิวจากลูกค้า",
  description:
    "รีวิวและความคิดเห็นจากลูกค้าที่ใช้บริการ Pariwat Property ประสบการณ์การเช่าและซื้ออสังหาริมทรัพย์ในฉะเชิงเทรา",
  keywords: [
    "รีวิว Pariwat Property",
    "ความคิดเห็นลูกค้า",
    "รีวิวนายหน้าอสังหา",
    "real estate reviews Chachoengsao",
  ],
  openGraph: {
    title: "รีวิวจากลูกค้า - Pariwat Property",
    description:
      "รีวิวและความคิดเห็นจากลูกค้าที่ใช้บริการ Pariwat Property",
    url: "https://primeestate.co.th/reviews",
    type: "website",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
