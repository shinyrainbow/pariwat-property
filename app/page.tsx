"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bed, Bath, Maximize, MapPin, Search, Star, Phone, Mail, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, Award, ArrowRight, Quote, MessageSquare, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";

interface Property {
  id: string;
  agentPropertyCode: string;
  propertyType: string;
  propertyTitleEn: string;
  propertyTitleTh: string;
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
  status?: "active" | "inactive" | "sold" | "rented";
  views?: number;
  project: {
    projectNameEn: string;
    projectNameTh: string;
  } | null;
}

interface Location {
  name: string;
  count: number;
  image: string;
}

export default function PublicPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [popularProperties, setPopularProperties] = useState<Property[]>([]);
  const [closedDeals, setClosedDeals] = useState<Property[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const popularSliderRef = useRef<HTMLDivElement>(null);
  const closedDealsSliderRef = useRef<HTMLDivElement>(null);

  // Filters
  const [propertyType, setPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(propertyType && { propertyType }),
        ...(listingType && { listingType }),
        ...(bedrooms && { bedrooms }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      });

      const res = await fetch(`/api/public/properties?${params}`);
      const data = await res.json();

      if (data.success) {
        setProperties(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, propertyType, listingType, bedrooms, minPrice, maxPrice]);

  // Fetch popular properties, closed deals, and locations on mount
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [popularRes, closedRes, locationsRes] = await Promise.all([
          fetch("/api/public/popular"),
          fetch("/api/public/closed-deals"),
          fetch("/api/public/locations"),
        ]);

        const [popularData, closedData, locationsData] = await Promise.all([
          popularRes.json(),
          closedRes.json(),
          locationsRes.json(),
        ]);

        if (popularData.success) setPopularProperties(popularData.data);
        if (closedData.success) setClosedDeals(closedData.data);
        if (locationsData.success) setLocations(locationsData.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  // Slider scroll functions
  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getSize = (property: Property) => {
    if (property.propertyType === "Condo") {
      return property.roomSizeNum ? `${property.roomSizeNum}` : "-";
    }
    return property.usableAreaSqm ? `${property.usableAreaSqm}` : "-";
  };

  const handleResetFilters = () => {
    setPropertyType("");
    setListingType("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Shared Header */}
      <Header transparent />

      {/* Hero Section with Parallax */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-75"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920')",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Animated Overlay Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bS00LjUgMjcuNUMxOC42IDQzLjIgOCAzMi43IDggMjBjMC03LjcgNi4zLTE0IDE0LTE0czE0IDYuMyAxNCAxNC02LjMgMTQtMTQgMTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20" />

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <div
            className="animate-fade-in-up"
            style={{ animation: "fadeInUp 1s ease-out" }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              ค้นหาอสังหาริมทรัพย์
              <br />
              <span className="text-[#c6af6c]">ในฝันของคุณ</span>
            </h1>
          </div>
          <p
            className="text-base md:text-lg mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animation: "fadeInUp 1s ease-out 0.2s both" }}
          >
            พบกับทรัพย์สินคุณภาพระดับพรีเมียม ในทำเลที่ดีที่สุดของกรุงเทพฯ
          </p>
          <div
            className="animate-fade-in-up"
            style={{ animation: "fadeInUp 1s ease-out 0.4s both" }}
          >
            <Link href="/properties">
              <Button
                size="default"
                className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white px-6 py-4 rounded-full transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-[#c6af6c]/50"
              >
                <Search className="w-4 h-4 mr-2" />
                เริ่มค้นหา
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-10 h-10 text-white drop-shadow-lg" />
        </div>

        {/* Floating Stats */}
        <div
          className="absolute bottom-20 left-0 right-0 animate-fade-in-up"
          style={{ animation: "fadeInUp 1s ease-out 0.6s both" }}
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { number: "500+", label: "Properties" },
                { number: "1000+", label: "Happy Clients" },
                { number: "50+", label: "Expert Agents" },
                { number: "15+", label: "Years" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center text-white border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-xl md:text-2xl font-bold text-[#c6af6c] mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section
        id="search"
        ref={(el) => {
          observerRefs.current["search"] = el;
        }}
        className="relative -mt-20 z-20"
      >
        <div className="container mx-auto px-4 pb-12">
          <Card
            className={`max-w-6xl mx-auto p-4 md:p-6 bg-white shadow-2xl rounded-2xl border-0 transition-all duration-1000 ${
              isVisible["search"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center">
              ค้นหาทรัพย์สินของคุณ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ประเภทการตลาด
                </label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="h-9 text-sm border-gray-300">
                    <SelectValue placeholder="ทั้งหมด" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="rent">เช่า</SelectItem>
                    <SelectItem value="sale">ขาย</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ประเภททรัพย์
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-9 text-sm border-gray-300">
                    <SelectValue placeholder="ทั้งหมด" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="Condo">คอนโด</SelectItem>
                    <SelectItem value="Townhouse">ทาวน์เฮ้าส์</SelectItem>
                    <SelectItem value="SingleHouse">บ้านเดี่ยว</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ห้องนอน
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="h-9 text-sm border-gray-300">
                    <SelectValue placeholder="ไม่ระบุ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ไม่ระบุ</SelectItem>
                    <SelectItem value="1">1 ห้อง</SelectItem>
                    <SelectItem value="2">2 ห้อง</SelectItem>
                    <SelectItem value="3">3 ห้อง</SelectItem>
                    <SelectItem value="4">4+ ห้อง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ราคาต่ำสุด (฿)
                </label>
                <Input
                  type="number"
                  placeholder="ไม่ระบุ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-9 text-sm border-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ราคาสูงสุด (฿)
                </label>
                <Input
                  type="number"
                  placeholder="ไม่ระบุ"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-9 text-sm border-gray-300"
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  className="h-9 flex-1 bg-[#c6af6c] hover:bg-[#b39d5b] text-white text-sm font-medium transform hover:scale-105 transition-all duration-300"
                  onClick={() => setPage(1)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา
                </Button>
                <Button
                  variant="outline"
                  className="h-9 text-sm border-gray-300 hover:bg-gray-50"
                  onClick={handleResetFilters}
                >
                  รีเซ็ต
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
              {[
                { label: "คอนโด", value: "Condo" },
                { label: "ทาวน์เฮ้าส์", value: "Townhouse" },
                { label: "บ้านเดี่ยว", value: "SingleHouse" },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    setPropertyType(type.value);
                    setPage(1);
                  }}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Popular Properties Section */}
      <section
        id="popular"
        ref={(el) => {
          observerRefs.current["popular"] = el;
        }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`flex items-center justify-between mb-8 transition-all duration-1000 ${
              isVisible["popular"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-[#c6af6c]" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  ทรัพย์สินยอดนิยม
                </h2>
              </div>
              <p className="text-gray-600">ทรัพย์สินที่ได้รับความสนใจสูงสุด</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white transition-all duration-300"
                onClick={() => scrollSlider(popularSliderRef, "left")}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white transition-all duration-300"
                onClick={() => scrollSlider(popularSliderRef, "right")}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div
            ref={popularSliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {popularProperties.map((property, index) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className={`flex-shrink-0 w-72 transition-all duration-500 ${
                  isVisible["popular"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 rounded-xl bg-white h-full">
                  <div className="relative h-44 overflow-hidden">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <Image
                        src={property.imageUrls[0]}
                        alt={property.propertyTitleTh || property.propertyTitleEn}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <MapPin className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-[#c6af6c] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {property.views} views
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-lg line-clamp-1 drop-shadow-lg">
                        {property.rentalRateNum
                          ? `฿${formatPrice(property.rentalRateNum)}/เดือน`
                          : `฿${formatPrice(property.sellPriceNum)}`}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#c6af6c] transition-colors">
                      {property.propertyTitleTh || property.propertyTitleEn}
                    </h3>
                    {property.project && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {property.project.projectNameTh || property.project.projectNameEn}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3 text-[#c6af6c]" />
                        {property.bedRoomNum}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3 text-[#c6af6c]" />
                        {property.bathRoomNum}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3 h-3 text-[#c6af6c]" />
                        {getSize(property)} ตร.ม.
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Just Closed Deals Section */}
      <section
        id="closed-deals"
        ref={(el) => {
          observerRefs.current["closed-deals"] = el;
        }}
        className="py-16 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`flex items-center justify-between mb-8 transition-all duration-1000 ${
              isVisible["closed-deals"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6 text-[#c6af6c]" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  ปิดการขายล่าสุด
                </h2>
              </div>
              <p className="text-gray-600">ทรัพย์สินที่เพิ่งปิดการขายหรือเช่าสำเร็จ</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white transition-all duration-300"
                onClick={() => scrollSlider(closedDealsSliderRef, "left")}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white transition-all duration-300"
                onClick={() => scrollSlider(closedDealsSliderRef, "right")}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div
            ref={closedDealsSliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {closedDeals.map((property, index) => (
              <div
                key={property.id}
                className={`flex-shrink-0 w-72 transition-all duration-500 ${
                  isVisible["closed-deals"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="group overflow-hidden transition-all duration-500 border-0 rounded-xl bg-white h-full relative">
                  {/* Sold/Rented Overlay */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                      <div
                        className={`absolute top-4 -right-8 w-40 text-center py-1 text-xs font-bold text-white transform rotate-45 shadow-lg ${
                          property.status === "sold" ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        {property.status === "sold" ? "ขายแล้ว" : "เช่าแล้ว"}
                      </div>
                    </div>
                  </div>
                  <div className="relative h-44 overflow-hidden">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <Image
                        src={property.imageUrls[0]}
                        alt={property.propertyTitleTh || property.propertyTitleEn}
                        fill
                        className="object-cover grayscale-[30%]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <MapPin className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-lg line-clamp-1 drop-shadow-lg">
                        {property.sellPriceNum
                          ? `฿${formatPrice(property.sellPriceNum)}`
                          : `฿${formatPrice(property.rentalRateNum)}/เดือน`}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                      {property.propertyTitleTh || property.propertyTitleEn}
                    </h3>
                    {property.project && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {property.project.projectNameTh || property.project.projectNameEn}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3 text-[#c6af6c]" />
                        {property.bedRoomNum}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3 text-[#c6af6c]" />
                        {property.bathRoomNum}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3 h-3 text-[#c6af6c]" />
                        {getSize(property)} ตร.ม.
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section
        id="locations"
        ref={(el) => {
          observerRefs.current["locations"] = el;
        }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`text-center mb-10 transition-all duration-1000 ${
              isVisible["locations"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              ค้นหาตามทำเล
            </h2>
            <div className="w-16 h-1 bg-[#c6af6c] mx-auto mb-3"></div>
            <p className="text-gray-600">เลือกทำเลที่คุณสนใจเพื่อค้นหาทรัพย์สิน</p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {locations.map((location, index) => (
              <Link
                key={location.name}
                href={`/search?location=${encodeURIComponent(location.name)}`}
                className={`group transition-all duration-500 ${
                  isVisible["locations"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card className="relative overflow-hidden rounded-xl h-40 cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <MapPin className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-bold text-lg text-center">{location.name}</h3>
                    <p className="text-sm text-gray-200">{location.count} ทรัพย์สิน</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c6af6c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Locations Button */}
          <div className="text-center mt-8">
            <Link href="/search">
              <Button
                variant="outline"
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white px-8 transform hover:scale-105 transition-all duration-300"
              >
                ดูทำเลทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section
        id="promotions"
        ref={(el) => {
          observerRefs.current["promotions"] = el;
        }}
        className="py-16 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`text-center mb-10 transition-all duration-1000 ${
              isVisible["promotions"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              โปรโมชันพิเศษ
            </h2>
            <div className="w-16 h-1 bg-[#c6af6c] mx-auto mb-3"></div>
            <p className="text-gray-600">ข้อเสนอสุดพิเศษสำหรับคุณ</p>
          </div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Promotion Card 1 */}
            <Card
              className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                isVisible["promotions"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative h-48 bg-gradient-to-br from-[#c6af6c] to-[#b39d5b]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-5xl font-bold mb-2">10%</div>
                    <div className="text-lg">ส่วนลดค่านายหน้า</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  HOT
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  โปรโมชันสำหรับลูกค้าใหม่
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  รับส่วนลดค่านายหน้า 10% เมื่อทำสัญญาเช่าหรือซื้อภายในเดือนนี้
                </p>
                <p className="text-xs text-gray-400">หมดเขต: 31 ธันวาคม 2025</p>
              </div>
            </Card>

            {/* Promotion Card 2 */}
            <Card
              className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                isVisible["promotions"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-5xl font-bold mb-2">ฟรี</div>
                    <div className="text-lg">ค่าโอนกรรมสิทธิ์</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  NEW
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  โปรโมชันซื้อคอนโดใหม่
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  ซื้อคอนโดโครงการใหม่ รับฟรีค่าโอนกรรมสิทธิ์และค่าจดจำนอง
                </p>
                <p className="text-xs text-gray-400">เฉพาะโครงการที่ร่วมรายการ</p>
              </div>
            </Card>

            {/* Promotion Card 3 */}
            <Card
              className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                isVisible["promotions"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-5xl font-bold mb-2">1 เดือน</div>
                    <div className="text-lg">เช่าฟรี</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  LIMITED
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  โปรโมชันเช่าระยะยาว
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  เช่าสัญญา 1 ปีขึ้นไป รับฟรีค่าเช่า 1 เดือน
                </p>
                <p className="text-xs text-gray-400">เฉพาะห้องที่ร่วมรายการ</p>
              </div>
            </Card>
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link href="/promotions">
              <Button
                variant="outline"
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white px-8 transform hover:scale-105 transition-all duration-300"
              >
                ดูโปรโมชันทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section
        id="properties"
        ref={(el) => {
          observerRefs.current["properties"] = el;
        }}
        className="py-12 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`text-center mb-8 transition-all duration-1000 ${
              isVisible["properties"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              รายการทรัพย์สินทั้งหมด
            </h2>
            <div className="w-16 h-1 bg-[#c6af6c] mx-auto mb-3"></div>
            <p className="text-base text-gray-600">
              พบ {total} รายการที่ตรงกับความต้องการของคุณ
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <Card
                  key={i}
                  className="h-80 animate-pulse bg-gray-100 rounded-xl"
                />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <Search className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ไม่พบรายการทรัพย์สิน
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                ลองปรับเปลี่ยนเงื่อนไขการค้นหาของคุณ
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white transform hover:scale-105 transition-all duration-300"
              >
                รีเซ็ตตัวกรอง
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {properties.map((property, index) => (
                  <Card
                    key={property.id}
                    className={`group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 rounded-xl bg-white ${
                      isVisible["properties"]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {/* Property Image */}
                    <div className="relative h-40 bg-gray-100 overflow-hidden">
                      {property.imageUrls && property.imageUrls.length > 0 ? (
                        <Image
                          src={property.imageUrls[0]}
                          alt={property.propertyTitleEn || "Property"}
                          fill
                          className="object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <MapPin className="w-12 h-12" />
                        </div>
                      )}

                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Listing Type Badge */}
                      {property.rentalRateNum && property.rentalRateNum > 0 && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                          เช่า
                        </div>
                      )}
                      {property.sellPriceNum &&
                        property.sellPriceNum > 0 &&
                        !property.rentalRateNum && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                            ขาย
                          </div>
                        )}

                      {/* Property Type Badge */}
                      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md text-gray-800 px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {property.propertyType === "Condo"
                          ? "คอนโด"
                          : property.propertyType === "Townhouse"
                          ? "ทาวน์เฮ้าส์"
                          : "บ้านเดี่ยว"}
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute bottom-2 left-2 bg-[#c6af6c]/95 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-white" />
                        4.8
                      </div>

                      {/* View Details Button (Appears on Hover) */}
                      <div className="absolute inset-x-0 bottom-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Link href={`/property/${property.id}`}>
                          <Button size="sm" className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white text-xs font-semibold shadow-xl">
                            ดูรายละเอียด
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-3">
                      {/* Project Name */}
                      {property.project && (
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.project.projectNameTh ||
                            property.project.projectNameEn}
                        </div>
                      )}

                      {/* Property Title */}
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 h-10 text-gray-900 group-hover:text-[#c6af6c] transition-colors duration-300">
                        {property.propertyTitleTh ||
                          property.propertyTitleEn ||
                          "ไม่ระบุชื่อ"}
                      </h3>

                      {/* Property Features */}
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3 h-3 text-[#c6af6c]" />
                          <span className="font-semibold">
                            {property.bedRoomNum}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3 h-3 text-[#c6af6c]" />
                          <span className="font-semibold">
                            {property.bathRoomNum}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize className="w-3 h-3 text-[#c6af6c]" />
                          <span className="font-semibold">
                            {getSize(property)} ตร.ม.
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        {property.rentalRateNum && property.rentalRateNum > 0 && (
                          <div className="text-lg font-bold text-[#c6af6c]">
                            ฿ {formatPrice(property.rentalRateNum)}
                            <span className="text-xs font-normal text-gray-600">
                              / เดือน
                            </span>
                          </div>
                        )}
                        {property.sellPriceNum &&
                          property.sellPriceNum > 0 &&
                          !property.rentalRateNum && (
                            <div className="text-lg font-bold text-[#c6af6c]">
                              ฿ {formatPrice(property.sellPriceNum)}
                            </div>
                          )}
                      </div>

                      {/* Property Code */}
                      <div className="text-xs text-gray-400 mt-2">
                        รหัส: {property.agentPropertyCode}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="text-xs border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    ก่อนหน้า
                  </Button>
                  <div className="flex gap-2">
                    {Array.from(
                      { length: Math.min(5, Math.ceil(total / 12)) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={page === pageNum ? "default" : "outline"}
                            onClick={() => setPage(pageNum)}
                            className={
                              page === pageNum
                                ? "bg-[#c6af6c] hover:bg-[#b39d5b] text-white text-xs"
                                : "border-gray-300 hover:bg-gray-50 text-xs"
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                    {Math.ceil(total / 12) > 5 && (
                      <span className="flex items-center px-2 text-gray-500">
                        ...
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= Math.ceil(total / 12)}
                    onClick={() => setPage(page + 1)}
                    className="text-xs border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    ถัดไป
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section with Animation */}
      <section
        id="contact"
        ref={(el) => {
          observerRefs.current["contact"] = el;
        }}
        className="relative py-16 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#c6af6c] via-[#b39d5b] to-[#c6af6c] bg-[length:200%_200%] animate-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bS00LjUgMjcuNUMxOC42IDQzLjIgOCAzMi43IDggMjBjMC03LjcgNi4zLTE0IDE0LTE0czE0IDYuMyAxNCAxNC02LjMgMTQtMTQgMTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div
          className={`container mx-auto px-4 relative z-10 transition-all duration-1000 ${
            isVisible["contact"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              พร้อมที่จะค้นหาทรัพย์สินในฝันของคุณหรือยัง?
            </h2>
            <p className="text-base mb-6 text-white/90">
              ติดต่อเราวันนี้เพื่อรับคำปรึกษาและข้อเสนอพิเศษ
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="default"
                className="bg-white text-[#c6af6c] hover:bg-gray-100 font-bold px-6 py-4 rounded-full transform hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                <Phone className="w-4 h-4 mr-2" />
                โทรติดต่อ
              </Button>
              <Button
                size="default"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-[#c6af6c] font-bold px-6 py-4 rounded-full transform hover:scale-110 transition-all duration-300"
              >
                <Mail className="w-4 h-4 mr-2" />
                ส่งอีเมล
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="reviews"
        ref={(el) => {
          observerRefs.current["reviews"] = el;
        }}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`text-center mb-10 transition-all duration-1000 ${
              isVisible["reviews"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              รีวิวจากลูกค้า
            </h2>
            <div className="w-16 h-1 bg-[#c6af6c] mx-auto mb-3"></div>
            <p className="text-gray-600">ความคิดเห็นจากลูกค้าที่ไว้วางใจเรา</p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review Card 1 */}
            <Card
              className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                isVisible["reviews"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#c6af6c] mb-3" />
              <p className="text-gray-600 mb-4 leading-relaxed">
                &quot;บริการดีมาก ตอบเร็ว ช่วยหาห้องที่ตรงใจได้เลย ขอบคุณทีมงาน Pariwat Property มากครับ&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#c6af6c] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  ส
                </div>
                <div>
                  <p className="font-semibold text-gray-900">คุณสมชาย</p>
                  <p className="text-sm text-gray-500">เช่าคอนโด สุขุมวิท</p>
                </div>
              </div>
            </Card>

            {/* Review Card 2 */}
            <Card
              className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                isVisible["reviews"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#c6af6c] mb-3" />
              <p className="text-gray-600 mb-4 leading-relaxed">
                &quot;ประทับใจมากค่ะ ให้ข้อมูลครบถ้วน พาดูหลายที่จนได้ห้องที่ถูกใจ ราคาดีด้วย&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  น
                </div>
                <div>
                  <p className="font-semibold text-gray-900">คุณนภา</p>
                  <p className="text-sm text-gray-500">ซื้อคอนโด พระราม 9</p>
                </div>
              </div>
            </Card>

            {/* Review Card 3 */}
            <Card
              className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                isVisible["reviews"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#c6af6c] mb-3" />
              <p className="text-gray-600 mb-4 leading-relaxed">
                &quot;เป็นครั้งแรกที่หาบ้าน ทีมงานให้คำแนะนำดีมาก ช่วยเรื่องเอกสารทุกอย่าง สะดวกมากครับ&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  ว
                </div>
                <div>
                  <p className="font-semibold text-gray-900">คุณวิชัย</p>
                  <p className="text-sm text-gray-500">ซื้อบ้านเดี่ยว บางนา</p>
                </div>
              </div>
            </Card>
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link href="/reviews">
              <Button
                variant="outline"
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white px-8 transform hover:scale-105 transition-all duration-300"
              >
                ดูรีวิวทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
