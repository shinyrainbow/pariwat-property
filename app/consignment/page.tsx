"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { toast } from "sonner";

const propertyTypes = [
  { value: "Condo", label: "คอนโดมิเนียม" },
  { value: "Townhouse", label: "ทาวน์เฮ้าส์" },
  { value: "SingleHouse", label: "บ้านเดี่ยว" },
  { value: "Villa", label: "วิลล่า" },
  { value: "Land", label: "ที่ดิน" },
  { value: "Office", label: "สำนักงาน" },
  { value: "Store", label: "ร้านค้า" },
  { value: "Factory", label: "โรงงาน" },
  { value: "Hotel", label: "โรงแรม" },
  { value: "Building", label: "อาคาร" },
];

const listingTypes = [
  { value: "sell", label: "ขาย" },
  { value: "rent", label: "เช่า" },
];

export default function ConsignmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    listingType: "",
    propertyType: "",
    location: "",
    size: "",
    price: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.listingType || !formData.propertyType) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/public/property-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        toast.success("ส่งข้อมูลเรียบร้อยแล้ว");
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ส่งข้อมูลเรียบร้อยแล้ว!
              </h2>
              <p className="text-gray-600 mb-6">
                ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมง เพื่อสอบถามรายละเอียดเพิ่มเติม
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    กลับหน้าหลัก
                  </Button>
                </Link>
                <Button
                  className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      listingType: "",
                      propertyType: "",
                      location: "",
                      size: "",
                      price: "",
                      details: "",
                    });
                  }}
                >
                  ฝากทรัพย์สินเพิ่ม
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-[#c6af6c]/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ฝากขาย/เช่า ทรัพย์สินกับเรา
            </h1>
            <p className="text-gray-600">
              ให้ทีมงานมืออาชีพของเราช่วยดูแลการขายหรือเช่าทรัพย์สินของคุณ
              ด้วยประสบการณ์และเครือข่ายที่กว้างขวาง
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              กรอกข้อมูลทรัพย์สินของคุณ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#c6af6c]" />
                  ข้อมูลติดต่อ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ชื่อ-นามสกุล"
                      className="text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์ *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812345678"
                      className="text-gray-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล (ไม่บังคับ)
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="text-gray-900"
                  />
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#c6af6c]" />
                  ข้อมูลทรัพย์สิน
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภทการลงประกาศ *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {listingTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, listingType: type.value })}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.listingType === type.value
                              ? "border-[#c6af6c] bg-[#c6af6c]/10 text-[#c6af6c]"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภททรัพย์สิน *
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c6af6c] text-gray-900"
                      required
                    >
                      <option value="">เลือกประเภท</option>
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่ตั้ง/โครงการ
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="เช่น: คอนโด XXX สุขุมวิท 39"
                    className="text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ขนาดพื้นที่
                    </label>
                    <Input
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="เช่น: 35 ตร.ม. หรือ 100 ตร.ว."
                      className="text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ราคาที่ต้องการ
                    </label>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="เช่น: 3,500,000 บาท หรือ 15,000 บาท/เดือน"
                      className="text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียดเพิ่มเติม
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="รายละเอียดเพิ่มเติม เช่น จำนวนห้องนอน ห้องน้ำ สิ่งอำนวยความสะดวก..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c6af6c] text-gray-900 resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white py-6 text-lg font-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      กำลังส่งข้อมูล...
                    </>
                  ) : (
                    "ส่งข้อมูลฝากขาย/เช่า"
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  เราจะติดต่อกลับภายใน 24 ชั่วโมงเพื่อสอบถามรายละเอียดเพิ่มเติม
                </p>
              </div>
            </form>
          </Card>

          {/* Benefits Section */}
          <div className="max-w-2xl mx-auto mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              ทำไมต้องฝากขาย/เช่ากับเรา?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="w-12 h-12 bg-[#c6af6c]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-[#c6af6c]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">ทีมงานมืออาชีพ</h4>
                <p className="text-sm text-gray-600">ประสบการณ์กว่า 10 ปีในธุรกิจอสังหาริมทรัพย์</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-12 h-12 bg-[#c6af6c]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-[#c6af6c]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">เครือข่ายกว้างขวาง</h4>
                <p className="text-sm text-gray-600">ฐานลูกค้าและพันธมิตรทั่วประเทศ</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-12 h-12 bg-[#c6af6c]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-[#c6af6c]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">บริการครบวงจร</h4>
                <p className="text-sm text-gray-600">ดูแลตั้งแต่ต้นจนปิดการขาย/เช่า</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
