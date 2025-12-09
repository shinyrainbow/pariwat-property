import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#c6af6c",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pariwatproperty.com"),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  title: {
    default: "Pariwat Property - อสังหาริมทรัพย์พรีเมียม กรุงเทพฯ",
    template: "%s | Pariwat Property",
  },
  description:
    "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในทำเลที่ดีที่สุดของกรุงเทพฯ บริการที่ปรึกษาอสังหาริมทรัพย์มืออาชีพ",
  keywords: [
    "อสังหาริมทรัพย์",
    "คอนโด",
    "บ้านเดี่ยว",
    "ทาวน์เฮ้าส์",
    "เช่าคอนโด",
    "ซื้อคอนโด",
    "คอนโดกรุงเทพ",
    "บ้านให้เช่า",
    "บ้านขาย",
    "Pariwat Property",
    "real estate Bangkok",
    "condo for rent",
    "house for sale",
    "สุขุมวิท",
    "ทองหล่อ",
    "เอกมัย",
    "สาทร",
    "สีลม",
  ],
  authors: [{ name: "Pariwat Property" }],
  creator: "Pariwat Property",
  publisher: "Pariwat Property",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://www.pariwatproperty.com",
    siteName: "Pariwat Property",
    title: "Pariwat Property - อสังหาริมทรัพย์พรีเมียม กรุงเทพฯ",
    description:
      "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในทำเลที่ดีที่สุดของกรุงเทพฯ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pariwat Property - Premium Real Estate Bangkok",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pariwat Property - อสังหาริมทรัพย์พรีเมียม กรุงเทพฯ",
    description:
      "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในทำเลที่ดีที่สุดของกรุงเทพฯ",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://www.pariwatproperty.com",
    languages: {
      "th-TH": "https://www.pariwatproperty.com",
      "en-US": "https://www.pariwatproperty.com/en",
    },
  },
  category: "real estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${kanit.variable} font-sans antialiased`}>
        <OrganizationJsonLd />
        <AuthSessionProvider>
          <ConfirmDialogProvider>
            {children}
          </ConfirmDialogProvider>
        </AuthSessionProvider>
        <Toaster />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
