"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Clock, Tag, Percent, Gift, Home, Calendar } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  discountLabel: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  expiryDate: string;
  terms: string;
}

// Mock promotions data - in production, this would come from an API
const mockPromotions: Promotion[] = [
  {
    id: "1",
    title: "โปรโมชันสำหรับลูกค้าใหม่",
    description: "รับส่วนลดค่านายหน้า 10% เมื่อทำสัญญาเช่าหรือซื้อภายในเดือนนี้ สำหรับลูกค้าที่ใช้บริการครั้งแรก",
    discount: "10%",
    discountLabel: "ส่วนลดค่านายหน้า",
    badge: "HOT",
    badgeColor: "bg-red-500",
    gradient: "from-[#c6af6c] to-[#b39d5b]",
    expiryDate: "31 ธันวาคม 2025",
    terms: "สำหรับลูกค้าใหม่เท่านั้น",
  },
  {
    id: "2",
    title: "โปรโมชันซื้อคอนโดใหม่",
    description: "ซื้อคอนโดโครงการใหม่ รับฟรีค่าโอนกรรมสิทธิ์และค่าจดจำนอง มูลค่าสูงสุด 100,000 บาท",
    discount: "ฟรี",
    discountLabel: "ค่าโอนกรรมสิทธิ์",
    badge: "NEW",
    badgeColor: "bg-green-500",
    gradient: "from-blue-500 to-blue-600",
    expiryDate: "31 มกราคม 2026",
    terms: "เฉพาะโครงการที่ร่วมรายการ",
  },
  {
    id: "3",
    title: "โปรโมชันเช่าระยะยาว",
    description: "เช่าสัญญา 1 ปีขึ้นไป รับฟรีค่าเช่า 1 เดือน พร้อมฟรีค่าส่วนกลาง 3 เดือนแรก",
    discount: "1 เดือน",
    discountLabel: "เช่าฟรี",
    badge: "LIMITED",
    badgeColor: "bg-yellow-500",
    gradient: "from-purple-500 to-purple-600",
    expiryDate: "28 กุมภาพันธ์ 2026",
    terms: "เฉพาะห้องที่ร่วมรายการ",
  },
  {
    id: "4",
    title: "โปรโมชันบ้านเดี่ยวพรีเมียม",
    description: "ซื้อบ้านเดี่ยวราคาตั้งแต่ 10 ล้านบาทขึ้นไป รับเฟอร์นิเจอร์ครบชุด มูลค่า 500,000 บาท",
    discount: "500K",
    discountLabel: "เฟอร์นิเจอร์ฟรี",
    badge: "EXCLUSIVE",
    badgeColor: "bg-amber-500",
    gradient: "from-emerald-500 to-emerald-600",
    expiryDate: "31 มีนาคม 2026",
    terms: "สำหรับบ้านเดี่ยวที่ร่วมรายการ",
  },
  {
    id: "5",
    title: "โปรโมชันแนะนำเพื่อน",
    description: "แนะนำเพื่อนมาใช้บริการ ทั้งคุณและเพื่อนรับส่วนลดค่านายหน้า 5% ไม่จำกัดจำนวนครั้ง",
    discount: "5%",
    discountLabel: "รับทั้งคู่",
    badge: "SPECIAL",
    badgeColor: "bg-pink-500",
    gradient: "from-pink-500 to-rose-500",
    expiryDate: "ไม่มีวันหมดอายุ",
    terms: "ไม่จำกัดจำนวนครั้ง",
  },
  {
    id: "6",
    title: "โปรโมชันทาวน์เฮ้าส์ใกล้รถไฟฟ้า",
    description: "ซื้อทาวน์เฮ้าส์ระยะ 500 เมตรจากสถานีรถไฟฟ้า รับส่วนลดพิเศษ 200,000 บาท",
    discount: "200K",
    discountLabel: "ส่วนลดพิเศษ",
    badge: "TRENDING",
    badgeColor: "bg-cyan-500",
    gradient: "from-cyan-500 to-teal-500",
    expiryDate: "30 เมษายน 2026",
    terms: "เฉพาะทำเลที่ร่วมรายการ",
  },
];

export default function PromotionsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Header */}
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c6af6c] to-[#b39d5b] py-16">
        <div
          className={`container mx-auto px-4 text-center text-white transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">โปรโมชันพิเศษ</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            รวมข้อเสนอสุดพิเศษจาก Pariwat Property เพื่อคุณโดยเฉพาะ
          </p>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPromotions.map((promo, index) => (
              <Card
                key={promo.id}
                className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`relative h-48 bg-gradient-to-br ${promo.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-5xl font-bold mb-2">{promo.discount}</div>
                      <div className="text-lg">{promo.discountLabel}</div>
                    </div>
                  </div>
                  <div className={`absolute top-4 right-4 ${promo.badgeColor} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                    {promo.badge}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {promo.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>หมดเขต: {promo.expiryDate}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{promo.terms}</p>
                  <Button
                    className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                  >
                    ติดต่อรับสิทธิ์
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            สนใจโปรโมชันใด?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            ติดต่อทีมงานของเราเพื่อรับข้อเสนอพิเศษและคำปรึกษาฟรี
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button
                size="lg"
                className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white px-8"
              >
                ติดต่อเรา
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white px-8"
              >
                กลับหน้าหลัก
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Building2 className="w-8 h-8 text-[#c6af6c]" />
            <span className="text-xl font-bold text-white">
              Pariwat Property
            </span>
          </div>
          <p className="mb-2 text-sm">
            Premium Real Estate Solutions | Chachoengsao, Thailand
          </p>
   <p className="text-xs">© 2025 บริษัท บุญเกตุ แอสเซท กรุ๊ป จำกัด. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
