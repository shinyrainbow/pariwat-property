"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building2,
  Phone,
  Mail,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  Calendar,
  CheckCircle2,
  Star,
  MessageCircle,
  X,
  Images,
  ZoomIn,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PropertyJsonLd } from "@/components/seo/json-ld";

interface PropertyPromotion {
  id: string;
  label: string;
  type: string;
  isActive: boolean;
  discountedPrice: number | null;
  discountedRentalPrice: number | null;
}

interface PropertyExtension {
  promotions: PropertyPromotion[];
}

interface Property {
  id: string;
  agentPropertyCode: string;
  propertyType: string;
  listingType: string;
  propertyTitleEn: string;
  propertyTitleTh: string;
  descriptionEn?: string;
  descriptionTh?: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number | null;
  usableAreaSqm: number | null;
  landSizeSqw: number | null;
  floor: string | null;
  building: string | null;
  imageUrls: string[];
  rentalRateNum: number | null;
  sellPriceNum: number | null;
  latitude: number | null;
  longitude: number | null;
  address?: string;
  district?: string;
  province?: string;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  note: string | null;
  project: {
    projectNameEn: string;
    projectNameTh: string;
  } | null;
  extension?: PropertyExtension | null;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState<{ count: number; avgRating: number }>({ count: 0, avgRating: 0 });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      setFormError("กรุณากรอกชื่อและเบอร์โทรศัพท์");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    try {
      // Send inquiry to API
      const response = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property?.id,
          propertyCode: property?.agentPropertyCode,
          propertyTitle: property?.propertyTitleTh || property?.propertyTitleEn,
          name: contactForm.name,
          phone: contactForm.phone,
          message: contactForm.message || `สนใจทรัพย์รหัส ${property?.agentPropertyCode}`,
        }),
      });

      if (response.ok) {
        setFormSuccess(true);
        setContactForm({ name: "", phone: "", message: "" });
        // Reset success message after 5 seconds
        setTimeout(() => setFormSuccess(false), 5000);
      } else {
        setFormError("ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      setFormError("ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard navigation in lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen || !property) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === property.imageUrls.length - 1 ? 0 : prev + 1
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === 0 ? property.imageUrls.length - 1 : prev - 1
        );
      }
    },
    [lightboxOpen, property]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Use enhanced-properties API for real data from NainaHub
        const res = await fetch(`/api/public/enhanced-properties/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProperty(data.data);
          // Fetch recommended properties
          fetchRecommendedProperties(data.data.id, data.data.propertyType);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedProperties = async (currentId: string, propertyType?: string) => {
      try {
        // Use enhanced-properties API for real data from NainaHub
        // Fetch more to ensure we have enough after filtering
        const res = await fetch(`/api/public/enhanced-properties?limit=8`);
        const data = await res.json();
        if (data.success) {
          // Filter out current property, prioritize same type, and limit to 4
          let filtered = data.data.filter((p: Property) => p.id !== currentId);

          // Sort to prioritize same property type
          if (propertyType) {
            filtered.sort((a: Property, b: Property) => {
              if (a.propertyType === propertyType && b.propertyType !== propertyType) return -1;
              if (a.propertyType !== propertyType && b.propertyType === propertyType) return 1;
              return 0;
            });
          }

          setRecommendedProperties(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch recommended properties:", error);
      }
    };

    const fetchReviewStats = async () => {
      try {
        const res = await fetch("/api/public/reviews");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const reviews = data.data;
          const totalRating = reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
          const avgRating = totalRating / reviews.length;
          setReviewStats({ count: reviews.length, avgRating: Math.round(avgRating * 10) / 10 });
        }
      } catch (error) {
        console.error("Failed to fetch review stats:", error);
      }
    };

    if (params.id) {
      fetchProperty();
      fetchReviewStats();
    }
  }, [params.id]);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getSize = () => {
    if (!property) return "-";
    if (property.propertyType === "Condo") {
      return property.roomSizeNum ? `${property.roomSizeNum}` : "-";
    }
    return property.usableAreaSqm ? `${property.usableAreaSqm}` : "-";
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case "Condo":
        return "คอนโดมิเนียม";
      case "Townhouse":
        return "ทาวน์เฮ้าส์";
      case "SingleHouse":
        return "บ้านเดี่ยว";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Skeleton */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </nav>

        {/* Content Skeleton */}
        <div className="pt-20 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
              <div className="mt-6 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ไม่พบทรัพย์สินนี้
          </h2>
          <p className="text-gray-600 mb-6">
            ทรัพย์สินที่คุณกำลังค้นหาไม่พบหรือไม่พร้อมให้บริการ
          </p>
          <Link href="/">
            <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data for SEO */}
      <PropertyJsonLd property={property} />

      {/* Shared Header */}
      <Header />

      {/* Action Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#c6af6c] transition-colors pt-6 pb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">ย้อนกลับ</span>
          </button>

          {/* <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`}
              />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div> */}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && property?.imageUrls && (
        <div className="fixed inset-0 z-[100] bg-black">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
              {lightboxIndex + 1} / {property.imageUrls.length}
            </div>
          </div>

          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-16">
            <div className="relative w-full h-full">
              <Image
                src={property.imageUrls[lightboxIndex]}
                alt={property.propertyTitleEn || "Property"}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          {property.imageUrls.length > 1 && (
            <>
              <button
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === 0 ? property.imageUrls.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white group"
              >
                <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === property.imageUrls.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white group"
              >
                <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              {property.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                    lightboxIndex === index
                      ? "ring-2 ring-white scale-105"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-40">
        {/* Premium Image Gallery - Bento Grid Layout */}
        <div className="container mx-auto px-4 py-6">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <div className="relative">
              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 rounded-2xl overflow-hidden">
                {/* Main Large Image */}
                <div
                  className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto md:h-[500px] cursor-pointer group"
                  onClick={() => openLightbox(0)}
                >
                  <Image
                    src={property.imageUrls[0]}
                    alt={property.propertyTitleEn || "Property"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Premium Badge */}
                  {property.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-[#c6af6c] to-[#d4c07a] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Star className="w-4 h-4 fill-white" />
                        Premium
                      </span>
                    </div>
                  )}
                </div>

                {/* Secondary Images */}
                {property.imageUrls.slice(1, 5).map((url, index) => (
                  <div
                    key={index}
                    className={`relative aspect-[4/3] md:aspect-auto md:h-[245px] cursor-pointer group ${
                      index >= 2 ? "hidden md:block" : ""
                    }`}
                    onClick={() => openLightbox(index + 1)}
                  >
                    <Image
                      src={url}
                      alt={`Property image ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Show more overlay on last visible image */}
                    {index === 3 && property.imageUrls.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Images className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-lg font-semibold">
                            +{property.imageUrls.length - 5} รูปภาพ
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* View All Photos Button */}
              <button
                onClick={() => openLightbox(0)}
                className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold shadow-xl flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Images className="w-5 h-5" />
                ดูรูปทั้งหมด ({property.imageUrls.length})
              </button>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Home className="w-20 h-20 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">ไม่มีรูปภาพ</p>
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Location */}
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {getPropertyTypeLabel(property.propertyType)}
                  </span>
                  <span>|</span>
                  <span>รหัส: {property.agentPropertyCode}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {property.propertyTitleTh || property.propertyTitleEn}
                </h1>
                {property.project && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building2 className="w-5 h-5 mr-2 text-[#c6af6c]" />
                    {property.project.projectNameTh ||
                      property.project.projectNameEn}
                  </div>
                )}
                {/* <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-[#c6af6c]" />
                  {[property.address, property.district, property.province]
                    .filter(Boolean)
                    .join(", ")}
                </div> */}
              </div>

              {/* Price */}
              <Card
                className={`p-6 border-0 shadow-lg bg-gradient-to-r from-[#c6af6c]/10 to-transparent transition-all duration-700 delay-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >

                <div className="flex flex-wrap gap-6">
                  {property.rentalRateNum !== null && property.rentalRateNum > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        ค่าเช่า / เดือน
                      </div>
                      {(() => {
                        const discountPromo = property.extension?.promotions?.find(
                          (p) => p.type === "discount" && p.discountedRentalPrice
                        );
                        if (discountPromo) {
                          return (
                            <div>
                              <div className="text-xl text-gray-400 line-through">
                                ฿ {formatPrice(property.rentalRateNum)}
                              </div>
                              <div className="text-3xl font-bold text-red-500">
                                ฿ {formatPrice(discountPromo.discountedRentalPrice)}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="text-3xl font-bold text-[#c6af6c]">
                            ฿ {formatPrice(property.rentalRateNum)}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {property.sellPriceNum !== null && property.sellPriceNum > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">ราคาขาย</div>
                      {(() => {
                        const discountPromo = property.extension?.promotions?.find(
                          (p) => p.type === "discount" && p.discountedPrice
                        );
                        if (discountPromo) {
                          return (
                            <div>
                              <div className="text-xl text-gray-400 line-through">
                                ฿ {formatPrice(property.sellPriceNum)}
                              </div>
                              <div className="text-3xl font-bold text-red-500">
                                ฿ {formatPrice(discountPromo.discountedPrice)}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="text-3xl font-bold text-[#c6af6c]">
                            ฿ {formatPrice(property.sellPriceNum)}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </Card>

              {/* Features Grid */}
              <Card
                className={`p-6 border-0 shadow-lg transition-all duration-700 delay-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  รายละเอียดทรัพย์สิน
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.propertyType !== "Land" && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
                          <Bed className="w-6 h-6 text-[#c6af6c]" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {property.bedRoomNum}
                          </div>
                          <div className="text-sm text-gray-500">ห้องนอน</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
                          <Bath className="w-6 h-6 text-[#c6af6c]" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {property.bathRoomNum}
                          </div>
                          <div className="text-sm text-gray-500">ห้องน้ำ</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
                          <Maximize className="w-6 h-6 text-[#c6af6c]" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {getSize()}
                          </div>
                          <div className="text-sm text-gray-500">ตร.ม.</div>
                        </div>
                      </div>
                    </>
                  )}
                  {property.landSizeSqw && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
                        <Home className="w-6 h-6 text-[#c6af6c]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {property.landSizeSqw}
                        </div>
                        <div className="text-sm text-gray-500">ตร.วา</div>
                      </div>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
                        <Layers className="w-6 h-6 text-[#c6af6c]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {property.floor}
                        </div>
                        <div className="text-sm text-gray-500">ชั้น</div>
                      </div>
                    </div>
                  )}
                  {property.building && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
                        <Building2 className="w-6 h-6 text-[#c6af6c]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {property.building}
                        </div>
                        <div className="text-sm text-gray-500">อาคาร</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Description */}
              {(property.descriptionTh || property.descriptionEn) && (
                <Card
                  className={`p-6 border-0 shadow-lg transition-all duration-700 delay-300 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    รายละเอียดเพิ่มเติม
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.descriptionTh || property.descriptionEn}
                  </p>
                </Card>
              )}

              {/* Note */}
              {property.note && (
                <Card
                  className={`p-6 border-0 shadow-lg transition-all duration-700 delay-350 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    เพิ่มเติม
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.note}
                  </p>
                </Card>
              )}

              {/* Amenities */}
              <Card
                className={`p-6 border-0 shadow-lg transition-all duration-700 delay-[400ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  สิ่งอำนวยความสะดวก
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "สระว่ายน้ำ",
                    "ฟิตเนส",
                    "ระบบรักษาความปลอดภัย 24 ชม.",
                    "ที่จอดรถ",
                    "ลิฟต์",
                    "สวนส่วนกลาง",
                  ].map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#c6af6c]" />
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Location Map */}
              {property.latitude && property.longitude && (
                <Card
                  className={`p-6 border-0 shadow-lg transition-all duration-700 delay-[500ms] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#c6af6c]" />
                    ตำแหน่งที่ตั้ง
                  </h2>
                  <div className="rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1938.5!2d${property.longitude}!3d${property.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${property.latitude}!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth`}
                      width="100%"
                      height="350"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {/* <span className="font-medium">ที่อยู่: </span> */}
                      {[property.address, property.district, property.province]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#c6af6c] hover:text-[#b39d5b] font-medium flex items-center gap-1"
                    >
                      <MapPin className="w-4 h-4" />
                      เปิดใน Google Maps
                    </a>
                  </div>
                </Card>
              )}

              {/* Updated Date */}
              {property.updatedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    อัปเดต{" "}
                    {new Date(property.updatedAt).toLocaleDateString("th-TH")}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div
                className={`sticky top-24 transition-all duration-700 delay-200 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
              >
                <Card className="p-6 border-0 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-500">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    สนใจทรัพย์สินนี้?
                  </h3>

                  {/* Agent Info */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 bg-[#c6af6c] rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">PW</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Pariwat Property
                      </div>
                      <div className="text-sm text-gray-500">
                        ตัวแทนอสังหาริมทรัพย์
                      </div>
                      {reviewStats.count > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-gray-600">{reviewStats.avgRating}</span>
                          <span className="text-xs text-gray-400">({reviewStats.count} รีวิว)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    {/* Phone Button */}
                    <Button
                      className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      onClick={() => copyToClipboard("0655614169", "phone")}
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      {copiedText === "phone" ? "คัดลอกแล้ว!" : "065-561-4169"}
                    </Button>
                    <a
                      href="https://lin.ee/5nLXDZY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border-2 border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white h-12 text-base font-semibold rounded-xl transition-all inline-flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Line
                    </a>
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 text-gray-500 hover:bg-gray-50 h-12 text-base font-medium rounded-xl transition-all"
                      onClick={() => copyToClipboard("bkgroup.ch.official@gmail.com", "email")}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      {copiedText === "email" ? "คัดลอกแล้ว!" : "คัดลอกอีเมล"}
                    </Button>
                  </div>


                  {/* Quick Contact Form */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      ขอข้อมูลเพิ่มเติม
                    </h4>

                    {formSuccess ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <div className="text-green-600 font-semibold mb-1">ส่งข้อมูลเรียบร้อยแล้ว!</div>
                        <p className="text-sm text-green-500">เราจะติดต่อกลับโดยเร็วที่สุด</p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3">
                        <input
                          type="text"
                          placeholder="ชื่อ-นามสกุล *"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c6af6c]/50 focus:border-[#c6af6c] transition-all text-gray-900"
                          disabled={formSubmitting}
                        />
                        <input
                          type="tel"
                          placeholder="เบอร์โทรศัพท์ *"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c6af6c]/50 focus:border-[#c6af6c] transition-all text-gray-900"
                          disabled={formSubmitting}
                        />
                        <textarea
                          placeholder="ข้อความ (ไม่บังคับ)"
                          rows={3}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c6af6c]/50 focus:border-[#c6af6c] transition-all resize-none text-gray-900"
                          disabled={formSubmitting}
                        />

                        {formError && (
                          <p className="text-sm text-red-500">{formError}</p>
                        )}

                        <Button
                          type="submit"
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={formSubmitting}
                        >
                          {formSubmitting ? "กำลังส่ง..." : "ส่งข้อมูล"}
                        </Button>
                      </form>
                    )}

                    <p className="text-xs text-gray-400 mt-3 text-center">
                      เราจะติดต่อกลับภายใน 24 ชั่วโมง
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Properties Section */}
        {recommendedProperties.length > 0 && (
          <section className="bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  ทรัพย์สินที่คุณอาจสนใจ
                </h2>
                <div className="w-16 h-1 bg-[#c6af6c] mx-auto mb-3"></div>
                <p className="text-gray-600">
                  ค้นพบทรัพย์สินอื่นๆ ที่เหมาะกับคุณ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProperties.map((rec, index) => (
                  <Link
                    key={rec.id}
                    href={`/property/${rec.id}`}
                    className={`group block transition-all duration-700 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      {/* Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {rec.imageUrls && rec.imageUrls.length > 0 ? (
                          <Image
                            src={rec.imageUrls[0]}
                            alt={rec.propertyTitleEn || "Property"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Home className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-1">
                          {rec.rentalRateNum != null && rec.rentalRateNum > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-emerald-500">
                              เช่า
                            </span>
                          )}
                          {rec.sellPriceNum != null && rec.sellPriceNum > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-amber-500">
                              ขาย
                            </span>
                          )}
                        </div>

                        {/* Property Type */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {rec.propertyType === "Condo"
                              ? "คอนโด"
                              : rec.propertyType === "Townhouse"
                              ? "ทาวน์เฮ้าส์"
                              : rec.propertyType === "Land"
                              ? "ที่ดิน"
                              : "บ้านเดี่ยว"}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#c6af6c] transition-colors duration-300">
                          {rec.propertyTitleTh || rec.propertyTitleEn}
                        </h3>

                        {rec.project && (
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {rec.project.projectNameTh || rec.project.projectNameEn}
                            </span>
                          </div>
                        )}

                        {rec.propertyType === "Land" ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            {rec.landSizeSqw && rec.landSizeSqw > 0 ? (
                              <>
                                {Math.floor(rec.landSizeSqw / 400) > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Maximize className="w-4 h-4 text-[#c6af6c]" />
                                    {Math.floor(rec.landSizeSqw / 400)} ไร่
                                  </span>
                                )}
                                {Math.floor((rec.landSizeSqw % 400) / 100) > 0 && (
                                  <span>{Math.floor((rec.landSizeSqw % 400) / 100)} งาน</span>
                                )}
                                <span>{rec.landSizeSqw % 100} ตร.ว.</span>
                              </>
                            ) : (
                              <span>-</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4 text-[#c6af6c]" />
                              <span>{rec.bedRoomNum}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4 text-[#c6af6c]" />
                              <span>{rec.bathRoomNum}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Maximize className="w-4 h-4 text-[#c6af6c]" />
                              <span>
                                {rec.propertyType === "Condo"
                                  ? rec.roomSizeNum || "-"
                                  : rec.usableAreaSqm || "-"}{" "}
                                ตร.ม.
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-100">
                          {rec.rentalRateNum != null && rec.rentalRateNum > 0 && (
                            <div className="text-lg font-bold text-[#c6af6c]">
                              <span className="text-xs font-normal text-gray-500 mr-1">เช่า:</span>
                              ฿{formatPrice(rec.rentalRateNum)}
                              <span className="text-xs font-normal text-gray-500">
                                /เดือน
                              </span>
                            </div>
                          )}
                          {rec.sellPriceNum != null && rec.sellPriceNum > 0 && (
                            <div className={`text-lg font-bold text-[#c6af6c] ${rec.rentalRateNum != null && rec.rentalRateNum > 0 ? "text-sm mt-1" : ""}`}>
                              <span className="text-xs font-normal text-gray-500 mr-1">ขาย:</span>
                              ฿{formatPrice(rec.sellPriceNum)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-10">
                <Link href="/search">
                  <Button
                    variant="outline"
                    className="border-2 border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  >
                    ดูทรัพย์สินทั้งหมด
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
