"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Tag, Percent, Home, Bed, Bath, Maximize, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/header";

interface PropertyPromotion {
  id: string;
  label: string;
  type: string;
  isActive: boolean;
}

interface PropertyExtension {
  promotions: PropertyPromotion[];
}

interface EnhancedProperty {
  id: string;
  propertyTitleTh: string;
  propertyType: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number;
  usableAreaSqm: number;
  landSizeSqw: number;
  imageUrls: string[];
  rentalRateNum: number;
  sellPriceNum: number;
  project: {
    projectNameTh: string;
  };
  extension: PropertyExtension | null;
}

export default function PromotionsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [propertiesWithPromotions, setPropertiesWithPromotions] = useState<EnhancedProperty[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchPropertiesWithPromotions() {
      try {
        const response = await fetch("/api/public/enhanced-properties/with-promotions?limit=12");
        const data = await response.json();
        if (data.success) {
          setPropertiesWithPromotions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch properties with promotions:", error);
      } finally {
        setLoadingProperties(false);
      }
    }
    fetchPropertiesWithPromotions();
  }, []);

  const formatPrice = (price: number) => {
    if (!price) return "-";
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Condo: "คอนโด",
      Townhouse: "ทาวน์เฮ้าส์",
      SingleHouse: "บ้านเดี่ยว",
      Land: "ที่ดิน",
    };
    return labels[type] || type;
  };

  // Helper function to format land size in Thai units (rai-ngan-wa)
  const formatLandSize = (landSizeSqw: number | null) => {
    if (!landSizeSqw) return null;
    const rai = Math.floor(landSizeSqw / 400);
    const ngan = Math.floor((landSizeSqw % 400) / 100);
    const sqw = landSizeSqw % 100;
    return { rai, ngan, sqw };
  };

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
            <h1 className="text-3xl md:text-4xl font-bold">ทรัพย์โปรโมชันพิเศษ</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            รวมข้อเสนอสุดพิเศษจาก Pariwat Property เพื่อคุณโดยเฉพาะ
          </p>
        </div>
      </section>

      {/* Properties with Promotions Section */}
      <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {/* <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Home className="w-8 h-8 text-[#c6af6c]" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  ทรัพย์โปรโมชันพิเศษ
                </h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                ทรัพย์สินที่มีโปรโมชันพิเศษ รับข้อเสนอดีๆ ก่อนใคร
              </p>
            </div> */}

            {loadingProperties ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {propertiesWithPromotions.map((property, index) => (
                  <Link key={property.id} href={`/property/${property.id}`}>
                    <Card
                      className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {property.imageUrls && property.imageUrls.length > 0 ? (
                          <Image
                            src={property.imageUrls[0]}
                            alt={property.propertyTitleTh}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Home className="w-12 h-12 text-gray-300" />
                          </div>
                        )}

                        {/* Property Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#c6af6c] text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {getPropertyTypeLabel(property.propertyType)}
                          </span>
                        </div>

                        {/* Promotion Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          {property.extension?.promotions.slice(0, 2).map((promo) => (
                            <span
                              key={promo.id}
                              className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                            >
                              <Percent className="w-3 h-3" />
                              {promo.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {property.propertyTitleTh}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.project?.projectNameTh || "-"}
                        </p>

                        {/* Property Info */}
                        {property.propertyType === "Land" ? (
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            {(() => {
                              const landSize = formatLandSize(property.landSizeSqw);
                              if (!landSize) return <span>-</span>;
                              return (
                                <>
                                  {landSize.rai > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Maximize className="w-3 h-3 text-[#c6af6c]" />
                                      {landSize.rai} ไร่
                                    </span>
                                  )}
                                  {landSize.ngan > 0 && (
                                    <span className="flex items-center gap-1">
                                      {landSize.ngan} งาน
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    {landSize.sqw} ตร.ว.
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Bed className="w-3 h-3" />
                              {property.bedRoomNum}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="w-3 h-3" />
                              {property.bathRoomNum}
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize className="w-3 h-3" />
                              {property.roomSizeNum || property.usableAreaSqm} ตร.ม.
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="border-t pt-3">
                          {property.rentalRateNum > 0 && (
                            <p className="text-sm">
                              <span className="text-gray-500">เช่า:</span>{" "}
                              <span className="font-bold text-[#c6af6c]">
                                ฿{formatPrice(property.rentalRateNum)}
                              </span>
                              <span className="text-gray-400">/เดือน</span>
                            </p>
                          )}
                          {property.sellPriceNum > 0 && (
                            <p className="text-sm">
                              <span className="text-gray-500">ขาย:</span>{" "}
                              <span className="font-bold text-[#c6af6c]">
                                ฿{formatPrice(property.sellPriceNum)}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {propertiesWithPromotions.length === 0 && !loadingProperties && (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ยังไม่มีทรัพย์ที่มีโปรโมชัน</p>
              </div>
            )}
          </div>
        </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
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
