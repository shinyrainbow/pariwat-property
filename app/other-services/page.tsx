"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface OtherService {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  order: number;
}

// Ensure URL has protocol prefix
const ensureAbsoluteUrl = (url: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

export default function OtherServicesPage() {
  const [services, setServices] = useState<OtherService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/public/other-services");
        const data = await res.json();

        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wrench className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">บริการอื่นๆ</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            บริการเสริมที่เราคัดสรรมาเพื่อคุณ ไม่ว่าจะเป็นบริการทำความสะอาด
            ล้างแอร์ หรือบริการอื่นๆ ที่จะช่วยให้ชีวิตคุณสะดวกสบายยิ่งขึ้น
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-80 animate-pulse bg-gray-200" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ยังไม่มีบริการในขณะนี้
              </h3>
              <p className="text-gray-600 mb-6">
                กรุณากลับมาตรวจสอบใหม่ภายหลัง
              </p>
              <Link href="/">
                <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
                  กลับหน้าหลัก
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card
                  key={service.id}
                  className={`group overflow-hidden hover:shadow-xl transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {service.imageUrl ? (
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#c6af6c]/20 to-[#c6af6c]/5">
                        <Wrench className="w-16 h-16 text-[#c6af6c]/50" />
                      </div>
                    )}
                    {/* Sparkle Badge */}
                    <div className="absolute top-3 right-3 bg-[#c6af6c] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      บริการแนะนำ
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#c6af6c] transition-colors">
                      {service.title}
                    </h3>
                    {service.titleEn && (
                      <p className="text-sm text-gray-500 mb-3">
                        {service.titleEn}
                      </p>
                    )}
                    {service.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {service.description}
                      </p>
                    )}

                    {/* Link Button */}
                    {service.linkUrl ? (
                      <a
                        href={ensureAbsoluteUrl(service.linkUrl) || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#c6af6c] hover:text-[#b39d5b] font-medium transition-colors group/link"
                      >
                        ดูรายละเอียด
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-gray-400">
                        เร็วๆ นี้
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ต้องการบริการเพิ่มเติม?
            </h2>
            <p className="text-gray-600 mb-8">
              หากคุณมีความต้องการบริการอื่นๆ เพิ่มเติม
              สามารถติดต่อเราได้ทันทีเพื่อรับคำปรึกษาฟรี
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white px-8 py-6 text-lg">
                  ติดต่อเรา
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="px-8 py-6 text-lg">
                  กลับหน้าหลัก
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
