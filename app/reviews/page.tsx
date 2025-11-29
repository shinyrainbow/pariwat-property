"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Star, Quote, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";

interface Review {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  rating: number;
  comment: string;
  transactionType: string;
  location: string;
  date: string;
  helpful: number;
}

// Mock reviews data - in production, this would come from an API
const mockReviews: Review[] = [
  {
    id: "1",
    name: "คุณสมชาย",
    avatar: "ส",
    avatarBg: "bg-[#c6af6c]",
    rating: 5,
    comment: "บริการดีมาก ตอบเร็ว ช่วยหาห้องที่ตรงใจได้เลย ขอบคุณทีมงาน Pariwat Property มากครับ ตั้งแต่ติดต่อมาจนถึงปิดการเช่า ใช้เวลาไม่ถึง 2 สัปดาห์",
    transactionType: "เช่าคอนโด",
    location: "สุขุมวิท",
    date: "15 พฤศจิกายน 2024",
    helpful: 24,
  },
  {
    id: "2",
    name: "คุณนภา",
    avatar: "น",
    avatarBg: "bg-blue-500",
    rating: 5,
    comment: "ประทับใจมากค่ะ ให้ข้อมูลครบถ้วน พาดูหลายที่จนได้ห้องที่ถูกใจ ราคาดีด้วย ทีมงานใจเย็นมาก ตอบคำถามทุกข้อสงสัย",
    transactionType: "ซื้อคอนโด",
    location: "พระราม 9",
    date: "10 พฤศจิกายน 2024",
    helpful: 18,
  },
  {
    id: "3",
    name: "คุณวิชัย",
    avatar: "ว",
    avatarBg: "bg-purple-500",
    rating: 5,
    comment: "เป็นครั้งแรกที่หาบ้าน ทีมงานให้คำแนะนำดีมาก ช่วยเรื่องเอกสารทุกอย่าง สะดวกมากครับ ประทับใจในความเป็นมืออาชีพ",
    transactionType: "ซื้อบ้านเดี่ยว",
    location: "บางนา",
    date: "5 พฤศจิกายน 2024",
    helpful: 32,
  },
  {
    id: "4",
    name: "คุณอรุณ",
    avatar: "อ",
    avatarBg: "bg-emerald-500",
    rating: 5,
    comment: "หาทาวน์เฮ้าส์ใกล้รถไฟฟ้ามานาน พอเจอ Pariwat Property ช่วยหาให้ได้ภายใน 3 วัน ราคาถูกกว่าที่คิดด้วย ขอบคุณมากครับ",
    transactionType: "ซื้อทาวน์เฮ้าส์",
    location: "ลาดพร้าว",
    date: "28 ตุลาคม 2024",
    helpful: 15,
  },
  {
    id: "5",
    name: "คุณมาลี",
    avatar: "ม",
    avatarBg: "bg-pink-500",
    rating: 5,
    comment: "ย้ายมาทำงานกรุงเทพฯ ต้องหาที่พักด่วน ทีมงานช่วยหาห้องให้ตรงงบ ใกล้ที่ทำงาน สะดวกมากค่ะ แนะนำเลย",
    transactionType: "เช่าคอนโด",
    location: "อโศก",
    date: "20 ตุลาคม 2024",
    helpful: 21,
  },
  {
    id: "6",
    name: "คุณธีรศักดิ์",
    avatar: "ธ",
    avatarBg: "bg-amber-500",
    rating: 5,
    comment: "ซื้อคอนโดเพื่อลงทุนปล่อยเช่า ทีมงานให้คำแนะนำดีมากว่าทำเลไหนดี ผลตอบแทนเท่าไหร่ ตอนนี้ปล่อยเช่าได้แล้ว ขอบคุณครับ",
    transactionType: "ซื้อคอนโด",
    location: "ทองหล่อ",
    date: "15 ตุลาคม 2024",
    helpful: 28,
  },
  {
    id: "7",
    name: "คุณพิมพ์ใจ",
    avatar: "พ",
    avatarBg: "bg-cyan-500",
    rating: 5,
    comment: "บริการหลังการขายดีมากค่ะ แม้ปิดการซื้อไปแล้ว ยังช่วยประสานงานเรื่องโอน เรื่องตกแต่ง แนะนำช่างให้ด้วย ประทับใจสุดๆ",
    transactionType: "ซื้อบ้านเดี่ยว",
    location: "รามอินทรา",
    date: "10 ตุลาคม 2024",
    helpful: 19,
  },
  {
    id: "8",
    name: "คุณสุรชัย",
    avatar: "ส",
    avatarBg: "bg-indigo-500",
    rating: 5,
    comment: "เช่าออฟฟิศให้บริษัท ทีมงานหาให้ตรงความต้องการมาก ทั้งขนาด ทำเล และราคา ขอบคุณที่ช่วยเจรจาราคาให้ด้วยครับ",
    transactionType: "เช่าออฟฟิศ",
    location: "สีลม",
    date: "5 ตุลาคม 2024",
    helpful: 12,
  },
  {
    id: "9",
    name: "คุณกาญจนา",
    avatar: "ก",
    avatarBg: "bg-rose-500",
    rating: 5,
    comment: "หาคอนโดที่ยอมให้เลี้ยงสัตว์ยากมาก แต่ทีมงานหาให้ได้เลย ห้องสวย ราคาดี เจ้าของใจดี ขอบคุณมากค่ะ",
    transactionType: "เช่าคอนโด",
    location: "เอกมัย",
    date: "28 กันยายน 2024",
    helpful: 25,
  },
];

export default function ReviewsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate average rating
  const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;

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
            <MessageSquare className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">รีวิวจากลูกค้า</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
            ความคิดเห็นจากลูกค้าที่ไว้วางใจใช้บริการ Pariwat Property
          </p>

          {/* Rating Summary */}
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-white/80">({mockReviews.length} รีวิว)</span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReviews.map((review, index) => (
              <Card
                key={review.id}
                className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>

                {/* Quote */}
                <Quote className="w-8 h-8 text-[#c6af6c] mb-3" />

                {/* Comment */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  &quot;{review.comment}&quot;
                </p>

                {/* Transaction Info */}
                <div className="flex items-center gap-2 text-xs text-[#c6af6c] mb-4">
                  <span className="bg-[#c6af6c]/10 px-2 py-1 rounded-full">
                    {review.transactionType}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {review.location}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${review.avatarBg} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">ลูกค้า Pariwat Property</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c6af6c] transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful}</span>
                  </button>
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
            พร้อมเป็นลูกค้าคนถัดไป?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            ให้เราช่วยคุณหาทรัพย์สินในฝัน เหมือนที่ช่วยลูกค้าหลายร้อยคนมาแล้ว
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
            Premium Real Estate Solutions | Bangkok, Thailand
          </p>
          <p className="text-xs">© 2025 NainaHub Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
