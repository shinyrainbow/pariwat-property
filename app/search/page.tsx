"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Search,
  Star,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  Building2,
} from "lucide-react";
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
  district?: string;
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

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location") || "";

  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(locationParam);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Filters
  const [propertyType, setPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propertiesRes, locationsRes] = await Promise.all([
          fetch("/api/public/properties?limit=100"),
          fetch("/api/public/locations"),
        ]);

        const [propertiesData, locationsData] = await Promise.all([
          propertiesRes.json(),
          locationsRes.json(),
        ]);

        if (propertiesData.success) {
          setAllProperties(propertiesData.data);
        }
        if (locationsData.success) {
          setLocations(locationsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter properties based on selected filters
  useEffect(() => {
    let filtered = [...allProperties];

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(
        (p) => p.district?.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    // Filter by property type
    if (propertyType && propertyType !== "all") {
      filtered = filtered.filter((p) => p.propertyType === propertyType);
    }

    // Filter by listing type
    if (listingType && listingType !== "all") {
      if (listingType === "rent") {
        filtered = filtered.filter(
          (p) => p.rentalRateNum && p.rentalRateNum > 0
        );
      } else if (listingType === "sale") {
        filtered = filtered.filter(
          (p) => p.sellPriceNum && p.sellPriceNum > 0 && !p.rentalRateNum
        );
      }
    }

    // Filter by bedrooms
    if (bedrooms && bedrooms !== "all") {
      const bedroomNum = parseInt(bedrooms);
      if (bedroomNum === 4) {
        filtered = filtered.filter((p) => p.bedRoomNum >= 4);
      } else {
        filtered = filtered.filter((p) => p.bedRoomNum === bedroomNum);
      }
    }

    // Filter by price
    if (minPrice) {
      const min = parseInt(minPrice);
      filtered = filtered.filter((p) => {
        const price = p.rentalRateNum || p.sellPriceNum || 0;
        return price >= min;
      });
    }
    if (maxPrice) {
      const max = parseInt(maxPrice);
      filtered = filtered.filter((p) => {
        const price = p.rentalRateNum || p.sellPriceNum || 0;
        return price <= max;
      });
    }

    setProperties(filtered);
  }, [
    allProperties,
    selectedLocation,
    propertyType,
    listingType,
    bedrooms,
    minPrice,
    maxPrice,
  ]);

  // Update URL when location changes
  useEffect(() => {
    if (selectedLocation) {
      router.push(`/search?location=${encodeURIComponent(selectedLocation)}`, {
        scroll: false,
      });
    } else {
      router.push("/search", { scroll: false });
    }
  }, [selectedLocation, router]);

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
    setSelectedLocation("");
    setPropertyType("");
    setListingType("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location === selectedLocation ? "" : location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Header */}
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c6af6c] to-[#b39d5b] py-12">
        <div
          className={`container mx-auto px-4 text-center text-white transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {selectedLocation
              ? `ค้นหาทรัพย์สินใน ${selectedLocation}`
              : "ค้นหาทรัพย์สินตามทำเล"}
          </h1>
          <p className="text-lg text-white/90 mb-6">
            {selectedLocation
              ? `พบ ${properties.length} รายการในทำเล ${selectedLocation}`
              : "เลือกทำเลที่คุณสนใจเพื่อค้นหาทรัพย์สิน"}
          </p>

          {selectedLocation && (
            <Button
              variant="outline"
              className="bg-white/20 border-white text-white hover:bg-white hover:text-[#c6af6c]"
              onClick={() => setSelectedLocation("")}
            >
              <X className="w-4 h-4 mr-2" />
              ล้างทำเลที่เลือก
            </Button>
          )}
        </div>
      </section>

      {/* Locations Quick Select */}
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {locations.map((location) => (
              <Button
                key={location.name}
                variant={
                  selectedLocation === location.name ? "default" : "outline"
                }
                className={`transition-all duration-300 ${
                  selectedLocation === location.name
                    ? "bg-[#c6af6c] hover:bg-[#b39d5b] text-white border-[#c6af6c]"
                    : "bg-gray-100 border-2 border-gray-200 text-gray-800 hover:border-[#c6af6c] hover:bg-[#c6af6c]/10 hover:text-[#b39d5b]"
                }`}
                onClick={() => handleLocationSelect(location.name)}
              >
                <MapPin className="w-4 h-4 mr-1" />
                {location.name}
                <span className="ml-1 text-xs opacity-75">
                  ({location.count})
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-72 ${
              showFilters ? "block" : "hidden"
            } lg:block transition-all duration-300`}
          >
            <Card className="p-6 sticky top-24 border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">ตัวกรอง</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-0 text-[#c6af6c] hover:text-[#b39d5b] hover:bg-transparent"
                  onClick={handleResetFilters}
                >
                  รีเซ็ต
                </Button>
              </div>

              <div className="space-y-5">
                {/* Property Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    ประเภททรัพย์
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="border-gray-300">
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

                {/* Listing Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    ประเภทการตลาด
                  </label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="ทั้งหมด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="rent">เช่า</SelectItem>
                      <SelectItem value="sale">ขาย</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    ห้องนอน
                  </label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="border-gray-300">
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

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    ช่วงราคา (฿)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="ต่ำสุด"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="border-gray-300"
                    />
                    <Input
                      type="number"
                      placeholder="สูงสุด"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  ผลการค้นหา
                </h2>
                <p className="text-sm text-gray-600">
                  พบ {properties.length} รายการ
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewMode === "grid"
                      ? "bg-[#c6af6c] hover:bg-[#b39d5b]"
                      : "border-gray-300"
                  }
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewMode === "list"
                      ? "bg-[#c6af6c] hover:bg-[#b39d5b]"
                      : "border-gray-300"
                  }
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className={`animate-pulse bg-gray-100 ${
                      viewMode === "grid" ? "h-80" : "h-40"
                    }`}
                  />
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <Card className="p-12 text-center border-0 shadow-lg">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ไม่พบรายการทรัพย์สิน
                </h3>
                <p className="text-gray-600 mb-6">
                  ลองปรับเปลี่ยนเงื่อนไขการค้นหาของคุณ
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                >
                  รีเซ็ตตัวกรอง
                </Button>
              </Card>
            ) : (
              /* Properties Grid/List */
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {properties.map((property, index) => (
                  <Link
                    key={property.id}
                    href={`/property/${property.id}`}
                    className={`transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <Card
                      className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white ${
                        viewMode === "list" ? "flex flex-row" : ""
                      }`}
                    >
                      {/* Property Image */}
                      <div
                        className={`relative overflow-hidden bg-gray-100 ${
                          viewMode === "list" ? "w-48 h-full" : "h-48"
                        }`}
                      >
                        {property.imageUrls && property.imageUrls.length > 0 ? (
                          <Image
                            src={property.imageUrls[0]}
                            alt={
                              property.propertyTitleTh ||
                              property.propertyTitleEn
                            }
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <MapPin className="w-12 h-12 text-gray-300" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md text-gray-800 px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {property.propertyType === "Condo"
                            ? "คอนโด"
                            : property.propertyType === "Townhouse"
                            ? "ทาวน์เฮ้าส์"
                            : "บ้านเดี่ยว"}
                        </div>

                        {property.rentalRateNum && property.rentalRateNum > 0 && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            เช่า
                          </div>
                        )}
                        {property.sellPriceNum &&
                          property.sellPriceNum > 0 &&
                          !property.rentalRateNum && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              ขาย
                            </div>
                          )}

                        {/* Rating */}
                        <div className="absolute bottom-2 left-2 bg-[#c6af6c]/95 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-white" />
                          4.8
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="p-4 flex-1">
                        {property.project && (
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {property.project.projectNameTh ||
                              property.project.projectNameEn}
                          </div>
                        )}

                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#c6af6c] transition-colors">
                          {property.propertyTitleTh || property.propertyTitleEn}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
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
                          {property.rentalRateNum &&
                            property.rentalRateNum > 0 && (
                              <div className="text-lg font-bold text-[#c6af6c]">
                                ฿ {formatPrice(property.rentalRateNum)}
                                <span className="text-xs font-normal text-gray-600">
                                  {" "}
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

                        <div className="text-xs text-gray-400 mt-2">
                          รหัส: {property.agentPropertyCode}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
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
          <p className="text-xs">
            © 2025 Puriwat Properties. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
      <section className="bg-gradient-to-r from-gray-200 to-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-64 h-10 bg-white/30 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-48 h-6 bg-white/30 rounded mx-auto animate-pulse" />
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
