"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function NewReviewPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: 5,
    comment: "",
    transactionType: "",
    location: "",
  });

  const transactionTypes = [
    "เช่าคอนโด",
    "ซื้อคอนโด",
    "เช่าบ้านเดี่ยว",
    "ซื้อบ้านเดี่ยว",
    "เช่าทาวน์เฮ้าส์",
    "ซื้อทาวน์เฮ้าส์",
    "ขายคอนโด",
    "ขายบ้านเดี่ยว",
    "ขายทาวน์เฮ้าส์",
    "อื่นๆ",
  ];

  const locations = [
    "สุขุมวิท",
    "พระราม 9",
    "อโศก",
    "ทองหล่อ",
    "เอกมัย",
    "ลาดพร้าว",
    "รัชดา",
    "สีลม",
    "สาทร",
    "บางนา",
    "รามอินทรา",
    "พญาไท",
    "อารีย์",
    "อื่นๆ",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/public/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-16" />

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto p-8 text-center border-0 shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ขอบคุณสำหรับรีวิว!
            </h1>
            <p className="text-gray-600 mb-8">
              รีวิวของคุณจะแสดงบนเว็บไซต์หลังจากได้รับการตรวจสอบและอนุมัติ
              ขอบคุณที่ใช้บริการ Pariwat Property
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/reviews">
                <Button
                  variant="outline"
                  className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                >
                  ดูรีวิวทั้งหมด
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
                  กลับหน้าหลัก
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#c6af6c] to-[#b39d5b] py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">เขียนรีวิว</h1>
          <p className="text-lg text-white/90">
            แบ่งปันประสบการณ์การใช้บริการ Pariwat Property
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/reviews"
            className="inline-flex items-center text-gray-600 hover:text-[#c6af6c] mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้ารีวิว
          </Link>

          <Card className="p-8 border-0 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ให้คะแนนความพึงพอใจ *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ (แสดงบนเว็บไซต์) *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="เช่น: คุณสมชาย"
                  required
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อีเมล (ไม่แสดงบนเว็บไซต์)
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทร (ไม่แสดงบนเว็บไซต์)
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0812345678"
                  />
                </div>
              </div>

              {/* Transaction Type & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทธุรกรรม *
                  </label>
                  <Select
                    value={formData.transactionType}
                    onValueChange={(v) =>
                      setFormData({ ...formData, transactionType: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ทำเล *
                  </label>
                  <Select
                    value={formData.location}
                    onValueChange={(v) =>
                      setFormData({ ...formData, location: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกทำเล" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ความคิดเห็น *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="เล่าประสบการณ์การใช้บริการ Pariwat Property..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#c6af6c] focus:border-transparent text-gray-900"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  submitting ||
                  !formData.name ||
                  !formData.transactionType ||
                  !formData.location ||
                  !formData.comment
                }
                className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white py-6 text-lg"
              >
                {submitting ? "กำลังส่ง..." : "ส่งรีวิว"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                รีวิวของคุณจะถูกตรวจสอบก่อนเผยแพร่บนเว็บไซต์
              </p>
            </form>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
