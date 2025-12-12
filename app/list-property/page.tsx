"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Home,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Maximize,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { toast } from "sonner";

export default function ListPropertyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.listingType || !formData.propertyType) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/public/property-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success("ส่งข้อมูลสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด");
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-16" />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto p-8 text-center border-0 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ส่งข้อมูลสำเร็จ!
            </h2>
            <p className="text-gray-600 mb-6">
              ขอบคุณที่ใช้บริการ Pariwat Property
              <br />
              ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
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
                className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
              >
                ส่งข้อมูลใหม่
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
              >
                กลับหน้าหลัก
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c6af6c] to-[#b39d5b] py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">ฝากขาย / ฝากเช่า</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            ฝากทรัพย์สินของคุณกับ Pariwat Property เราพร้อมช่วยหาผู้ซื้อหรือผู้เช่าให้คุณ
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-6 md:p-8 border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              กรอกข้อมูลทรัพย์สินของคุณ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#c6af6c]" />
                  ข้อมูลติดต่อ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="ชื่อของคุณ"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์ *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="08X-XXX-XXXX"
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#c6af6c]" />
                  ข้อมูลทรัพย์สิน
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภทการฝาก *
                    </label>
                    <Select
                      value={formData.listingType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, listingType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภท" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sell">ฝากขาย</SelectItem>
                        <SelectItem value="rent">ฝากเช่า</SelectItem>
                        <SelectItem value="both">ขายและเช่า</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภททรัพย์สิน *
                    </label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, propertyType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภท" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Condo">คอนโด</SelectItem>
                        <SelectItem value="Townhouse">ทาวน์เฮ้าส์</SelectItem>
                        <SelectItem value="SingleHouse">บ้านเดี่ยว</SelectItem>
                        <SelectItem value="Villa">วิลล่า</SelectItem>
                        <SelectItem value="Land">ที่ดิน</SelectItem>
                        <SelectItem value="Office">สำนักงาน</SelectItem>
                        <SelectItem value="Store">ร้านค้า</SelectItem>
                        <SelectItem value="Factory">โรงงาน</SelectItem>
                        <SelectItem value="Hotel">โรงแรม</SelectItem>
                        <SelectItem value="Building">อาคาร</SelectItem>
                        <SelectItem value="Other">อื่นๆ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1 text-[#c6af6c]" />
                    ที่ตั้ง / ทำเล
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="เช่น พระราม 9, สุขุมวิท, ฉะเชิงเทรา"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Maximize className="w-4 h-4 inline mr-1 text-[#c6af6c]" />
                      ขนาดพื้นที่
                    </label>
                    <Input
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      placeholder="เช่น 35 ตร.ม., 100 ตร.ว."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSign className="w-4 h-4 inline mr-1 text-[#c6af6c]" />
                      ราคาที่ต้องการ
                    </label>
                    <Input
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="เช่น 1,500,000 บาท, 15,000/เดือน"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียดเพิ่มเติม
                  </label>
                  <Textarea
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    placeholder="เช่น จำนวนห้องนอน ห้องน้ำ สิ่งอำนวยความสะดวก ฯลฯ"
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    ส่งข้อมูลฝากทรัพย์
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ทำไมต้องฝากกับ Pariwat Property?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#c6af6c]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-[#c6af6c]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ทีมงานมืออาชีพ
                </h3>
                <p className="text-sm text-gray-600">
                  เรามีทีมงานที่มีประสบการณ์พร้อมช่วยเหลือคุณ
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#c6af6c]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-[#c6af6c]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ครอบคลุมทุกพื้นที่
                </h3>
                <p className="text-sm text-gray-600">
                  บริการครอบคลุมทั้งในกรุงเทพฯ และต่างจังหวัด
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#c6af6c]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-[#c6af6c]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ติดต่อง่าย
                </h3>
                <p className="text-sm text-gray-600">
                  ติดตามความคืบหน้าได้ตลอดเวลา
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
