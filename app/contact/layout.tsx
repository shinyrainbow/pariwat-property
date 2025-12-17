import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description:
    "ติดต่อ Pariwat Property สำหรับบริการที่ปรึกษาอสังหาริมทรัพย์ การเช่า ซื้อ ขาย คอนโด บ้าน ทาวน์เฮ้าส์ในฉะเชิงเทรา",
  keywords: [
    "ติดต่อ Pariwat Property",
    "ที่ปรึกษาอสังหาริมทรัพย์",
    "นายหน้าอสังหา",
    "contact real estate Chachoengsao",
  ],
  openGraph: {
    title: "ติดต่อเรา - Pariwat Property",
    description:
      "ติดต่อ Pariwat Property สำหรับบริการที่ปรึกษาอสังหาริมทรัพย์ในฉะเชิงเทรา",
    url: "www.pariwatproperty.com/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
