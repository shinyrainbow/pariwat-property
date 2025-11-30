"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Phone, Mail, MapPin, Clock, Send, MessageSquare, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/header";

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "โทรศัพท์",
      details: ["065-561-4169", "093-664-2593"],
      color: "bg-green-500",
      links: ["tel:0655614169", "tel:0936642593"],
    },
    {
      icon: Mail,
      title: "อีเมล",
      details: ["bkgroup.ch.official@gmail.com"],
      color: "bg-blue-500",
      links: ["mailto:bkgroup.ch.official@gmail.com"],
    },
    {
      icon: MapPin,
      title: "ที่อยู่",
      details: ["จังหวัดฉะเชิงเทรา", "ประเทศไทย"],
      color: "bg-red-500",
      links: [],
    },
    {
      icon: Clock,
      title: "เวลาทำการ",
      details: ["จันทร์ - อาทิตย์: 09:00 - 18:00"],
      color: "bg-purple-500",
      links: [],
    },
  ];

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
            <h1 className="text-3xl md:text-4xl font-bold">ติดต่อเรา</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            พร้อมให้บริการและตอบทุกคำถามของคุณ ติดต่อเราได้หลายช่องทาง
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={info.title}
                className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 ${info.color} rounded-full flex items-center justify-center mb-4`}>
                  <info.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  info.links && info.links[i] ? (
                    <a
                      key={i}
                      href={info.links[i]}
                      className="block text-gray-600 text-sm hover:text-[#c6af6c] transition-colors"
                    >
                      {detail}
                    </a>
                  ) : (
                    <p key={i} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  )
                ))}
              </Card>
            ))}

            {/* Line QR Code Card */}
            <Card
              className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="w-14 h-14 bg-[#00B900] rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Line Official</h3>
              <p className="text-gray-600 text-sm mb-3">สแกน QR Code เพื่อติดต่อผ่าน Line</p>
              <div className="flex justify-center">
                <Image
                  src="/pariwat-qr.jpg"
                  alt="Line QR Code"
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ส่งข้อความถึงเรา</h2>

              {submitted ? (
                <Card className="p-8 text-center border-0 shadow-lg bg-green-50">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">ส่งข้อความสำเร็จ!</h3>
                  <p className="text-gray-600 mb-4">
                    ขอบคุณที่ติดต่อเรา เราจะตอบกลับโดยเร็วที่สุด
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                  >
                    ส่งข้อความอีกครั้ง
                  </Button>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อ-นามสกุล *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="กรอกชื่อ-นามสกุล"
                        className="border-gray-300 focus:border-[#c6af6c] focus:ring-[#c6af6c]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เบอร์โทรศัพท์ *
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="08X-XXX-XXXX"
                        className="border-gray-300 focus:border-[#c6af6c] focus:ring-[#c6af6c]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อีเมล *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="border-gray-300 focus:border-[#c6af6c] focus:ring-[#c6af6c]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หัวข้อ
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="เรื่องที่ต้องการติดต่อ"
                      className="border-gray-300 focus:border-[#c6af6c] focus:ring-[#c6af6c]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ข้อความ *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="รายละเอียดที่ต้องการสอบถาม..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#c6af6c] focus:ring-1 focus:ring-[#c6af6c]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        กำลังส่ง...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        ส่งข้อความ
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Map & Social */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">แผนที่และช่องทางติดตาม</h2>

              {/* Map Placeholder */}
              <Card className="overflow-hidden border-0 shadow-lg mb-6">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-[#c6af6c]" />
                    <p className="font-medium">Pariwat Property</p>
                    <p className="text-sm">ฉะเชิงเทรา, ประเทศไทย</p>
                  </div>
                </div>
              </Card>

              {/* Line QR Code Large */}
              <Card className="p-6 border-0 shadow-lg mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">เพิ่มเพื่อนทาง Line</h3>
                <div className="flex justify-center">
                  <Image
                    src="/pariwat-qr.jpg"
                    alt="Line QR Code"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                  สแกน QR Code เพื่อติดต่อเราผ่าน Line
                </p>
              </Card>

              {/* Social Media */}
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">ติดตามเราได้ที่</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <Youtube className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  ติดตามข่าวสารและโปรโมชันล่าสุดได้ทุกช่องทาง
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">คำถามที่พบบ่อย</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "เวลาทำการของสำนักงานคือเมื่อไหร่?",
                a: "สำนักงานเปิดให้บริการวันจันทร์ - ศุกร์ เวลา 09:00 - 18:00 น. และวันเสาร์ - อาทิตย์ เวลา 10:00 - 16:00 น.",
              },
              {
                q: "ต้องเตรียมเอกสารอะไรบ้างสำหรับการเช่าหรือซื้อ?",
                a: "สำหรับการเช่า: สำเนาบัตรประชาชน, สลิปเงินเดือน 3 เดือน / สำหรับการซื้อ: สำเนาบัตรประชาชน, ทะเบียนบ้าน, statement บัญชี 6 เดือน",
              },
              {
                q: "สามารถนัดดูห้องได้อย่างไร?",
                a: "ติดต่อเราผ่านทางโทรศัพท์ หรือกรอกแบบฟอร์มด้านบน ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง",
              },
              {
                q: "มีค่าบริการนายหน้าหรือไม่?",
                a: "สำหรับผู้เช่าไม่มีค่านายหน้า ส่วนผู้ซื้อและผู้ขายมีค่านายหน้าตามมาตรฐานอุตสาหกรรม กรุณาติดต่อสอบถามรายละเอียด",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className={`p-6 border-0 shadow-lg transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#c6af6c] to-[#b39d5b]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            พร้อมเริ่มต้นหาทรัพย์สินในฝัน?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            ดูทรัพย์สินทั้งหมดของเราและค้นหาบ้านที่ตรงใจคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button
                size="lg"
                className="bg-white text-[#c6af6c] hover:bg-gray-100 px-8"
              >
                ค้นหาทรัพย์สิน
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#c6af6c] px-8"
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
