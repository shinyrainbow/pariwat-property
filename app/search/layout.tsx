import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ค้นหาอสังหาริมทรัพย์ - คอนโด บ้าน ทาวน์เฮ้าส์",
  description:
    "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในฉะเชิงเทรา และปริมณฑล กรองตามราคา ขนาด ทำเล และประเภท",
  keywords: [
    "ค้นหาคอนโด",
    "ค้นหาบ้าน",
    "คอนโดให้เช่า",
    "บ้านขาย",
    "อสังหาริมทรัพย์ฉะเชิงเทรา",
    "condo search Chachoengsao",
  ],
  openGraph: {
    title: "ค้นหาอสังหาริมทรัพย์ - Pariwat Property",
    description:
      "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในฉะเชิงเทรา และปริมณฑล",
    url: "https://primeestate.co.th/search",
    type: "website",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
