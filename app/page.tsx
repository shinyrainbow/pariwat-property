"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { Bed, Bath, Maximize, MapPin, Search, Star, Phone, Mail, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, Award, ArrowRight, Quote, MessageSquare, Building2, Flame, Sparkles, Percent, LandPlot, Grid2x2, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { toast } from "sonner";

// Hero background images for slideshow
const heroImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920",
];

interface Promotion {
  id: string;
  label: string;
  type: string;
  isActive: boolean;
  discountedPrice: number | null;
  discountedRentalPrice: number | null;
}

interface PropertyTag {
  id: string;
  name: string;
  color: string | null;
}

interface PropertyExtension {
  id: string;
  priority: number;
  isHidden: boolean;
  isFeaturedPopular: boolean;
  promotions: Promotion[];
  tags: PropertyTag[];
}

type PropertyStatus =
  | "pending"
  | "available"
  | "reserved"
  | "under_contract"
  | "sold"
  | "rented"
  | "under_maintenance"
  | "off_market";

interface Property {
  id: string;
  agentPropertyCode: string | null;
  propertyType: string;
  propertyTitleEn: string;
  propertyTitleTh: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number | null;
  usableAreaSqm: number | null;
  rai: number | null;
  ngan: number | null;
  landSizeSqw: number | null;
  floor: string | null;
  building: string | null;
  imageUrls: string[];
  rentalRateNum: number | null;
  sellPriceNum: number | null;
  latitude: number | null;
  longitude: number | null;
  status: PropertyStatus;
  views?: number;
  project: {
    projectNameEn: string;
    projectNameTh: string;
  } | null;
  extension?: PropertyExtension | null;
}

interface Project {
  projectCode: string;
  projectNameEn: string;
  projectNameTh: string;
  count: number;
  image: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  transactionType: string;
  location: string;
  createdAt: string;
}

interface Portfolio {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
}

export default function PublicPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [popularProperties, setPopularProperties] = useState<Property[]>([]);
  const [closedDeals, setClosedDeals] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [propertiesWithPromotions, setPropertiesWithPromotions] = useState<Property[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const popularSliderRef = useRef<HTMLDivElement>(null);
  const closedDealsSliderRef = useRef<HTMLDivElement>(null);

  // Slider scroll position states
  const [popularCanScrollLeft, setPopularCanScrollLeft] = useState(false);
  const [popularCanScrollRight, setPopularCanScrollRight] = useState(true);
  const [closedCanScrollLeft, setClosedCanScrollLeft] = useState(false);
  const [closedCanScrollRight, setClosedCanScrollRight] = useState(true);

  // Hero background slideshow
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Portfolio slideshow
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0);

  // Filters
  const [propertyType, setPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Format number with commas (e.g., 1000000 -> 1,000,000)
  const formatPriceWithCommas = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, "");
    if (!numbers) return "";
    return Number(numbers).toLocaleString("en-US");
  };

  // Parse formatted price back to plain number string
  const parsePriceValue = (value: string): string => {
    return value.replace(/,/g, "");
  };

  // Handle price input change with auto-formatting
  const handlePriceChange = (value: string, setter: (v: string) => void) => {
    const formatted = formatPriceWithCommas(value);
    setter(formatted);
  };

  // Handle search - navigate to /search with filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
    if (listingType && listingType !== "all") params.set("listingType", listingType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (minPrice) params.set("minPrice", parsePriceValue(minPrice));
    if (maxPrice) params.set("maxPrice", parsePriceValue(maxPrice));

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero background image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Portfolio slideshow - auto advance every 2 seconds
  useEffect(() => {
    if (portfolios.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPortfolioIndex((prev) => (prev + 1) % portfolios.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [portfolios.length]);

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

      const res = await fetch(`/api/public/enhanced-properties?${params}`);
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

  // Fetch popular properties, closed deals, projects, and reviews on mount
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [popularRes, closedRes, projectsRes, reviewsRes, promotionsRes, portfolioRes] = await Promise.all([
          fetch("/api/public/enhanced-properties/popular"),
          fetch("/api/public/enhanced-properties/closed-deals"),
          fetch("/api/public/projects"),
          fetch("/api/public/reviews"),
          fetch("/api/public/enhanced-properties/with-promotions?limit=6"),
          fetch("/api/public/portfolio"),
        ]);

        const [popularData, closedData, projectsData, reviewsData, promotionsData, portfolioData] = await Promise.all([
          popularRes.json(),
          closedRes.json(),
          projectsRes.json(),
          reviewsRes.json(),
          promotionsRes.json(),
          portfolioRes.json(),
        ]);

        if (popularData.success) setPopularProperties(popularData.data);
        if (closedData.success) setClosedDeals(closedData.data);
        if (projectsData.success) setProjects(projectsData.data);
        if (reviewsData.success) setReviews(reviewsData.data.slice(0, 3));
        if (promotionsData.success) setPropertiesWithPromotions(promotionsData.data.slice(0, 3));
        if (portfolioData.success) setPortfolios(portfolioData.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  // Check slider scroll position
  const checkSliderScroll = (ref: React.RefObject<HTMLDivElement | null>, type: "popular" | "closed") => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const canLeft = scrollLeft > 0;
      const canRight = scrollLeft < scrollWidth - clientWidth - 10;

      if (type === "popular") {
        setPopularCanScrollLeft(canLeft);
        setPopularCanScrollRight(canRight);
      } else if (type === "closed") {
        setClosedCanScrollLeft(canLeft);
        setClosedCanScrollRight(canRight);
      }
    }
  };

  // Initialize slider scroll states
  useEffect(() => {
    checkSliderScroll(popularSliderRef, "popular");
    checkSliderScroll(closedDealsSliderRef, "closed");
  }, [popularProperties, closedDeals]);

  // Slider scroll functions
  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right", type: "popular" | "closed") => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      // Check scroll position after animation
      setTimeout(() => checkSliderScroll(ref, type), 350);
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

  // Helper function to get promotion styling based on type
  const getPromotionStyle = (type: string) => {
    switch (type) {
      case "hot":
        return { color: "bg-red-500", Icon: Flame };
      case "new":
        return { color: "bg-green-500", Icon: Sparkles };
      case "discount":
        return { color: "bg-blue-500", Icon: Percent };
      case "featured":
        return { color: "bg-purple-500", Icon: Award };
      default:
        return { color: "bg-red-500", Icon: Flame };
    }
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
        {/* Rotating Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
              index === currentImageIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          />
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

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
            <Link href="/search">
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
        <div className="container mx-auto px-4 pb-10">
          <Card
            className={`max-w-4xl mx-auto p-6 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border-0 transition-all duration-1000 ${
              isVisible["search"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Row 1: Main filters */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ประเภทการตลาด
                </label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="h-11 text-sm border-gray-200">
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
                  <SelectTrigger className="h-11 text-sm border-gray-200">
                    <SelectValue placeholder="ทั้งหมด" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
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
                    <SelectItem value="Apartment">อพาร์ทเมนท์</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ห้องนอน
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="h-11 text-sm border-gray-200">
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
            </div>

            {/* Row 2: Price range + Search button */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ราคาต่ำสุด (฿)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="ไม่ระบุ"
                  value={minPrice}
                  onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
                  className="h-11 text-sm border-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ราคาสูงสุด (฿)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="ไม่ระบุ"
                  value={maxPrice}
                  onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
                  className="h-11 text-sm border-gray-200"
                />
              </div>

              <div className="flex items-end">
                <Button
                  className="h-11 w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white text-sm font-semibold transform hover:scale-105 transition-all duration-300"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

    

      {/* Projects Section */}
      <section
        id="projects"
        ref={(el) => {
          observerRefs.current["projects"] = el;
        }}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`text-center mb-10 transition-all duration-1000 ${
              isVisible["projects"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              โครงการยอดนิยม
            </h2>
            <div className="w-16 h-1 bg-[#c6af6c] mx-auto mb-3"></div>
            <p className="text-gray-600">เลือกโครงการที่คุณสนใจเพื่อค้นหาทรัพย์สิน</p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((project, index) => (
              <Link
                key={project.projectCode}
                href={`/search?project=${encodeURIComponent(project.projectCode)}`}
                className={`group transition-all duration-500 ${
                  isVisible["projects"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card className="relative overflow-hidden rounded-xl h-40 cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <Image
                    src={project.image}
                    alt={project.projectNameTh || project.projectNameEn}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <Building2 className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-bold text-lg text-center line-clamp-2">{project.projectNameTh || project.projectNameEn}</h3>
                    <p className="text-sm text-gray-200">{project.count} ทรัพย์สิน</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c6af6c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="text-center mt-8">
            <Link href="/search">
              <Button
                variant="outline"
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white px-8 transform hover:scale-105 transition-all duration-300"
              >
                ดูโครงการทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
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
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  popularCanScrollLeft
                    ? "border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(popularSliderRef, "left", "popular")}
                disabled={!popularCanScrollLeft}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  popularCanScrollRight
                    ? "border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(popularSliderRef, "right", "popular")}
                disabled={!popularCanScrollRight}
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
            onScroll={() => checkSliderScroll(popularSliderRef, "popular")}
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
                    {/* Promotion or Popular Badge */}
                    {property.extension?.promotions && property.extension.promotions.length > 0 ? (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        {property.extension.promotions[0].label}
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 bg-[#c6af6c] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Popular
                      </div>
                    )}
                    {/* Listing Type Badges */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      {property.rentalRateNum && property.rentalRateNum > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-emerald-500">
                          เช่า
                        </span>
                      )}
                      {property.sellPriceNum && property.sellPriceNum > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-amber-500">
                          ขาย
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-lg line-clamp-1 drop-shadow-lg">
                        {property.rentalRateNum && property.rentalRateNum > 0
                          ? `฿${formatPrice(property.rentalRateNum)}/เดือน`
                          : property.sellPriceNum && property.sellPriceNum > 0
                          ? `฿${formatPrice(property.sellPriceNum)}`
                          : "ติดต่อสอบถาม"}
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
                    {property.propertyType === "Land" ? (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <LandPlot className="w-3 h-3 text-[#c6af6c]" />
                          {property.rai ?? 0} ไร่
                        </span>
                        <span className="flex items-center gap-1">
                          <Grid2x2 className="w-3 h-3 text-[#c6af6c]" />
                          {property.ngan ?? 0} งาน
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="w-3 h-3 text-[#c6af6c]" />
                          {property.landSizeSqw ?? 0} ตร.ว.
                        </span>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </Card>
              </Link>
            ))}
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
            {propertiesWithPromotions.length > 0 ? (
              propertiesWithPromotions.map((property, index) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <Card
                    className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                      isVisible["promotions"]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {property.imageUrls && property.imageUrls.length > 0 ? (
                        <Image
                          src={property.imageUrls[0]}
                          alt={property.propertyTitleTh || property.propertyTitleEn || "Property"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#c6af6c] to-[#b39d5b]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      {property.extension?.promotions && property.extension.promotions[0] && (() => {
                        const promo = property.extension.promotions[0];
                        const { color, Icon } = getPromotionStyle(promo.type);
                        return (
                          <div className={`absolute top-4 right-4 ${color} px-3 py-1 rounded-full text-sm font-bold text-white flex items-center gap-1`}>
                            <Icon className="w-4 h-4" />
                            {promo.label}
                          </div>
                        );
                      })()}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        {(() => {
                          const discountPromo = property.extension?.promotions?.find(
                            (p) => p.type === "discount" && (p.discountedPrice || p.discountedRentalPrice)
                          );

                          // Show rental price with discount
                          if (property.rentalRateNum && property.rentalRateNum > 0) {
                            if (discountPromo?.discountedRentalPrice) {
                              return (
                                <div>
                                  <p className="text-sm line-through text-white/70">
                                    เช่า: ฿{formatPrice(property.rentalRateNum)}/เดือน
                                  </p>
                                  <p className="text-2xl font-bold text-red-400">
                                    เช่า: ฿{formatPrice(discountPromo.discountedRentalPrice)}/เดือน
                                  </p>
                                </div>
                              );
                            }
                            return (
                              <p className="text-2xl font-bold">
                                เช่า: ฿{formatPrice(property.rentalRateNum)}/เดือน
                              </p>
                            );
                          }

                          // Show sell price with discount
                          if (property.sellPriceNum && property.sellPriceNum > 0) {
                            if (discountPromo?.discountedPrice) {
                              return (
                                <div>
                                  <p className="text-sm line-through text-white/70">
                                    ขาย: ฿{formatPrice(property.sellPriceNum)}
                                  </p>
                                  <p className="text-2xl font-bold text-red-400">
                                    ขาย: ฿{formatPrice(discountPromo.discountedPrice)}
                                  </p>
                                </div>
                              );
                            }
                            return (
                              <p className="text-2xl font-bold">
                                ขาย: ฿{formatPrice(property.sellPriceNum)}
                              </p>
                            );
                          }

                          return <p className="text-2xl font-bold">ติดต่อสอบถาม</p>;
                        })()}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {property.propertyTitleTh || property.propertyTitleEn || property.project?.projectNameTh || "ทรัพย์สินโปรโมชัน"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.project?.projectNameTh || property.project?.projectNameEn || ""}
                      </p>
                      {property.propertyType === "Land" ? (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <LandPlot className="w-3 h-3 text-[#c6af6c]" />
                            {property.rai ?? 0} ไร่
                          </span>
                          <span className="flex items-center gap-1">
                            <Grid2x2 className="w-3 h-3 text-[#c6af6c]" />
                            {property.ngan ?? 0} งาน
                          </span>
                          <span className="flex items-center gap-1">
                            <Square className="w-3 h-3 text-[#c6af6c]" />
                            {property.landSizeSqw ?? 0} ตร.ว.
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3 h-3" /> {property.bedRoomNum}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3 h-3" /> {property.bathRoomNum}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                ยังไม่มีโปรโมชันในขณะนี้
              </div>
            )}
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

                      {/* Promotion Badge */}
                      {property.extension?.promotions && property.extension.promotions.length > 0 && (() => {
                        const promo = property.extension.promotions[0];
                        const { color, Icon } = getPromotionStyle(promo.type);
                        return (
                          <div className={`absolute top-2 right-2 ${color} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300 flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {promo.label}
                          </div>
                        );
                      })()}
                      {/* Listing Type Badge - only show if no promotion */}
                      {(!property.extension?.promotions || property.extension.promotions.length === 0) && (
                        <>
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
                        </>
                      )}

                      {/* Property Type Badge */}
                      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md text-gray-800 px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {property.propertyType === "Condo"
                          ? "คอนโด"
                          : property.propertyType === "Townhouse"
                          ? "ทาวน์เฮ้าส์"
                          : property.propertyType === "SingleHouse"
                          ? "บ้านเดี่ยว"
                          : property.propertyType === "Villa"
                          ? "วิลล่า"
                          : property.propertyType === "Land"
                          ? "ที่ดิน"
                          : property.propertyType === "Office"
                          ? "สำนักงาน"
                          : property.propertyType === "Store"
                          ? "ร้านค้า"
                          : property.propertyType === "Factory"
                          ? "โรงงาน"
                          : property.propertyType === "Hotel"
                          ? "โรงแรม"
                          : property.propertyType === "Building"
                          ? "อาคาร"
                          : property.propertyType === "Apartment"
                          ? "อพาร์ทเมนท์"
                          : property.propertyType}
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

                      {/* Property Title - only show if not Condo */}
                      {property.propertyType !== "Condo" && (
                        <h3 className="font-bold text-sm mb-2 line-clamp-2 h-10 text-gray-900 group-hover:text-[#c6af6c] transition-colors duration-300">
                          {property.propertyTitleTh ||
                            property.propertyTitleEn ||
                            "ไม่ระบุชื่อ"}
                        </h3>
                      )}

                      {/* Property Features */}
                      {property.propertyType === "Land" ? (
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-1">
                            <LandPlot className="w-3 h-3 text-[#c6af6c]" />
                            <span className="font-semibold">{property.rai ?? 0} ไร่</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Grid2x2 className="w-3 h-3 text-[#c6af6c]" />
                            <span className="font-semibold">{property.ngan ?? 0} งาน</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-3 h-3 text-[#c6af6c]" />
                            <span className="font-semibold">{property.landSizeSqw ?? 0} ตร.ว.</span>
                          </div>
                        </div>
                      ) : (
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
                      )}

                      {/* Price */}
                      <div>
                        {property.rentalRateNum != null && property.rentalRateNum > 0 && (
                          <div className="text-lg font-bold text-[#c6af6c]">
                            <span className="text-sm font-medium text-gray-600">เช่า: </span>
                            ฿ {formatPrice(property.rentalRateNum)}
                            <span className="text-xs font-normal text-gray-600">
                              / เดือน
                            </span>
                          </div>
                        )}
                        {property.sellPriceNum != null && property.sellPriceNum > 0 &&
                          (property.rentalRateNum == null || property.rentalRateNum === 0) && (
                            <div className="text-lg font-bold text-[#c6af6c]">
                              <span className="text-sm font-medium text-gray-600">ขาย: </span>
                              ฿ {formatPrice(property.sellPriceNum)}
                            </div>
                          )}
                      </div>

                      {/* Tags */}
                      {property.extension?.tags && property.extension.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {property.extension.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: tag.color || "#3B82F6" }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Property Code */}
                      <div className="text-xs text-gray-400 mt-2">
                        รหัส: {property.agentPropertyCode || "-"}
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
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  closedCanScrollLeft
                    ? "border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(closedDealsSliderRef, "left", "closed")}
                disabled={!closedCanScrollLeft}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  closedCanScrollRight
                    ? "border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(closedDealsSliderRef, "right", "closed")}
                disabled={!closedCanScrollRight}
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
            onScroll={() => checkSliderScroll(closedDealsSliderRef, "closed")}
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
                        {property.status === "sold" && property.sellPriceNum && property.sellPriceNum > 0
                          ? `฿${formatPrice(property.sellPriceNum)}`
                          : property.rentalRateNum && property.rentalRateNum > 0
                          ? `฿${formatPrice(property.rentalRateNum)}/เดือน`
                          : property.sellPriceNum && property.sellPriceNum > 0
                          ? `฿${formatPrice(property.sellPriceNum)}`
                          : "ติดต่อสอบถาม"}
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
                    {property.propertyType === "Land" ? (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <LandPlot className="w-3 h-3 text-[#c6af6c]" />
                          {property.rai ?? 0} ไร่
                        </span>
                        <span className="flex items-center gap-1">
                          <Grid2x2 className="w-3 h-3 text-[#c6af6c]" />
                          {property.ngan ?? 0} งาน
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="w-3 h-3 text-[#c6af6c]" />
                          {property.landSizeSqw ?? 0} ตร.ว.
                        </span>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>


  {/* Portfolio Section - ผลงานของเรา (4 images in a row) */}
      {portfolios.length > 0 && (
        <section
          id="portfolio-showcase"
          ref={(el) => {
            observerRefs.current["portfolio-showcase"] = el;
          }}
          className="py-16 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-[#c6af6c]" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    ผลงานของเรา
                  </h2>
                </div>
                <p className="text-gray-600">ตัวอย่างผลงานที่เราภูมิใจนำเสนอ</p>
              </div>
            </div>

            {/* 4 Images Grid with auto-advance */}
            <div className="relative overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(() => {
                  // Calculate which 4 images to show based on currentPortfolioIndex
                  const imagesPerPage = 4;
                  const totalPages = Math.ceil(portfolios.length / imagesPerPage);
                  const currentPage = currentPortfolioIndex % totalPages;
                  const startIndex = currentPage * imagesPerPage;
                  const visiblePortfolios = portfolios.slice(startIndex, startIndex + imagesPerPage);

                  return visiblePortfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-500"
                    >
                      <Image
                        src={portfolio.imageUrl}
                        alt={portfolio.title || "ผลงานของเรา"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {portfolio.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white font-semibold text-sm line-clamp-1">
                            {portfolio.title}
                          </p>
                          {portfolio.description && (
                            <p className="text-white/80 text-xs mt-1 line-clamp-1">
                              {portfolio.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.max(1, Math.ceil(portfolios.length / 4)) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPortfolioIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      (currentPortfolioIndex % Math.max(1, Math.ceil(portfolios.length / 4))) === index
                        ? "bg-[#c6af6c] w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`ไปยังหน้าที่ ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
            {reviews.length > 0 ? (
              reviews.map((review, index) => {
                const avatarColors = ["bg-[#c6af6c]", "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500"];
                const avatarColor = avatarColors[index % avatarColors.length];
                const firstChar = review.name.charAt(0).toUpperCase();

                return (
                  <Card
                    key={review.id}
                    className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                      isVisible["reviews"]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-[#c6af6c] mb-3" />
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      &quot;{review.comment}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {firstChar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <p className="text-sm text-gray-500">
                          {review.transactionType === "rent" ? "เช่า" : "ซื้อ"} {review.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                ยังไม่มีรีวิวในขณะนี้
              </div>
            )}
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
                onClick={() => {
                  navigator.clipboard.writeText("0655614169");
                  toast.success("คัดลอกเบอร์โทรศัพท์แล้ว");
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                065-561-4169
              </Button>
              <Button
                size="default"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-[#c6af6c] font-bold px-6 py-4 rounded-full transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  navigator.clipboard.writeText("bkgroup.ch.official@gmail.com");
                  toast.success("คัดลอกอีเมลแล้ว");
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                bkgroup.ch.official@gmail.com
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />

      {/* Floating LINE CTA Button */}
      <a
        href="https://lin.ee/5nLXDZY"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#00B900] hover:bg-[#00a000] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-[#00B900]/50 transform hover:scale-110 transition-all duration-300 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.066-.022.137-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
        <span className="hidden sm:inline font-semibold">LINE</span>
        <MessageSquare className="w-4 h-4 absolute -top-1 -right-1 text-white bg-red-500 rounded-full p-0.5 animate-pulse" />
      </a>

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
