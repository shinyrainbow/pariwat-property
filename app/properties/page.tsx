"use client";

import { useEffect, useState } from "react";
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
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ArrowUpDown,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";

interface Property {
  id: string;
  agentPropertyCode: string;
  propertyType: string;
  listingType: string;
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
  featured: boolean;
  project: {
    projectNameEn: string;
    projectNameTh: string;
  } | null;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [propertyType, setPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(propertyType && propertyType !== "all" && { propertyType }),
        ...(listingType && listingType !== "all" && { listingType }),
        ...(bedrooms && bedrooms !== "all" && { bedrooms }),
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

  const activeFiltersCount = [
    propertyType && propertyType !== "all",
    listingType && listingType !== "all",
    bedrooms && bedrooms !== "all",
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Header */}
      <Header />

      {/* Page Header */}
      <div className="pt-20 bg-gradient-to-b from-[#c6af6c]/10 to-transparent">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ค้นหาอสังหาริมทรัพย์
          </h1>
          <p className="text-gray-600">
            พบ {total} รายการที่พร้อมให้บริการ
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="p-6 border-0 shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">ตัวกรอง</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-[#c6af6c] hover:underline"
                  >
                    รีเซ็ตทั้งหมด
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    ประเภทการตลาด
                  </label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="border-gray-200">
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
                    ประเภททรัพย์สิน
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="ทั้งหมด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="Condo">คอนโด</SelectItem>
                      <SelectItem value="Townhouse">ทาวน์เฮ้าส์</SelectItem>
                      <SelectItem value="SingleHouse">บ้านเดี่ยว</SelectItem>
                      <SelectItem value="Land">ที่ดิน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    จำนวนห้องนอน
                  </label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="border-gray-200">
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
                    ช่วงราคา (฿)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="ต่ำสุด"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="border-gray-200"
                    />
                    <span className="flex items-center text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="สูงสุด"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="border-gray-200"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setPage(1)}
                  className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา
                </Button>
              </div>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & View Options */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>ตัวกรอง</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#c6af6c] text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  มุมมอง:
                </span>
                <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-[#c6af6c] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-[#c6af6c] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
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
              <div className="text-center py-20">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ไม่พบรายการทรัพย์สิน
                </h3>
                <p className="text-gray-600 mb-4">
                  ลองปรับเปลี่ยนเงื่อนไขการค้นหาของคุณ
                </p>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                >
                  รีเซ็ตตัวกรอง
                </Button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <Link
                        key={property.id}
                        href={`/property/${property.id}`}
                      >
                        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white h-full">
                          {/* Image */}
                          <div className="relative h-48 bg-gray-100 overflow-hidden">
                            {property.imageUrls &&
                            property.imageUrls.length > 0 ? (
                              <Image
                                src={property.imageUrls[0]}
                                alt={property.propertyTitleEn || "Property"}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <MapPin className="w-12 h-12" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                              {property.featured && (
                                <span className="bg-[#c6af6c] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-white" />
                                  แนะนำ
                                </span>
                              )}
                            </div>
                            <div className="absolute top-3 right-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                                  property.listingType === "rent"
                                    ? "bg-emerald-500"
                                    : property.listingType === "sale"
                                    ? "bg-amber-500"
                                    : "bg-purple-500"
                                }`}
                              >
                                {property.listingType === "rent"
                                  ? "เช่า"
                                  : property.listingType === "sale"
                                  ? "ขาย"
                                  : "ขาย/เช่า"}
                              </span>
                            </div>

                            {/* Property Type */}
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                {property.propertyType === "Condo"
                                  ? "คอนโด"
                                  : property.propertyType === "Townhouse"
                                  ? "ทาวน์เฮ้าส์"
                                  : property.propertyType === "Land"
                                  ? "ที่ดิน"
                                  : "บ้านเดี่ยว"}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-4">
                            {property.project && (
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {property.project.projectNameTh ||
                                  property.project.projectNameEn}
                              </div>
                            )}

                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#c6af6c] transition-colors">
                              {property.propertyTitleTh ||
                                property.propertyTitleEn}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4 text-[#c6af6c]" />
                                <span>{property.bedRoomNum}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4 text-[#c6af6c]" />
                                <span>{property.bathRoomNum}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Maximize className="w-4 h-4 text-[#c6af6c]" />
                                <span>{getSize(property)} ตร.ม.</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                              {property.rentalRateNum &&
                                property.rentalRateNum > 0 && (
                                  <div className="text-lg font-bold text-[#c6af6c]">
                                    ฿ {formatPrice(property.rentalRateNum)}
                                    <span className="text-xs font-normal text-gray-500">
                                      /เดือน
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

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <Link
                        key={property.id}
                        href={`/property/${property.id}`}
                      >
                        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image */}
                            <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gray-100 overflow-hidden">
                              {property.imageUrls &&
                              property.imageUrls.length > 0 ? (
                                <Image
                                  src={property.imageUrls[0]}
                                  alt={property.propertyTitleEn || "Property"}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                  <MapPin className="w-12 h-12" />
                                </div>
                              )}

                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex gap-2">
                                {property.featured && (
                                  <span className="bg-[#c6af6c] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-white" />
                                    แนะนำ
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                                    property.listingType === "rent"
                                      ? "bg-emerald-500"
                                      : property.listingType === "sale"
                                      ? "bg-amber-500"
                                      : "bg-purple-500"
                                  }`}
                                >
                                  {property.listingType === "rent"
                                    ? "เช่า"
                                    : property.listingType === "sale"
                                    ? "ขาย"
                                    : "ขาย/เช่า"}
                                </span>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 p-5">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                  {property.propertyType === "Condo"
                                    ? "คอนโด"
                                    : property.propertyType === "Townhouse"
                                    ? "ทาวน์เฮ้าส์"
                                    : property.propertyType === "Land"
                                    ? "ที่ดิน"
                                    : "บ้านเดี่ยว"}
                                </span>
                                <span className="text-xs text-gray-400">
                                  รหัส: {property.agentPropertyCode}
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#c6af6c] transition-colors">
                                {property.propertyTitleTh ||
                                  property.propertyTitleEn}
                              </h3>

                              {property.project && (
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {property.project.projectNameTh ||
                                    property.project.projectNameEn}
                                </div>
                              )}

                              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                  <Bed className="w-4 h-4 text-[#c6af6c]" />
                                  <span>{property.bedRoomNum} ห้องนอน</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Bath className="w-4 h-4 text-[#c6af6c]" />
                                  <span>{property.bathRoomNum} ห้องน้ำ</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Maximize className="w-4 h-4 text-[#c6af6c]" />
                                  <span>{getSize(property)} ตร.ม.</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div>
                                  {property.rentalRateNum &&
                                    property.rentalRateNum > 0 && (
                                      <div className="text-xl font-bold text-[#c6af6c]">
                                        ฿ {formatPrice(property.rentalRateNum)}
                                        <span className="text-sm font-normal text-gray-500">
                                          /เดือน
                                        </span>
                                      </div>
                                    )}
                                  {property.sellPriceNum &&
                                    property.sellPriceNum > 0 &&
                                    !property.rentalRateNum && (
                                      <div className="text-xl font-bold text-[#c6af6c]">
                                        ฿ {formatPrice(property.sellPriceNum)}
                                      </div>
                                    )}
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                                >
                                  ดูรายละเอียด
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {total > 12 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="border-gray-200"
                    >
                      ก่อนหน้า
                    </Button>
                    <div className="flex gap-1">
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
                                  ? "bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                                  : "border-gray-200"
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= Math.ceil(total / 12)}
                      onClick={() => setPage(page + 1)}
                      className="border-gray-200"
                    >
                      ถัดไป
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">ตัวกรอง</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ประเภทการตลาด
                </label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="border-gray-200">
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
                  ประเภททรัพย์สิน
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="ทั้งหมด" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="Condo">คอนโด</SelectItem>
                    <SelectItem value="Townhouse">ทาวน์เฮ้าส์</SelectItem>
                    <SelectItem value="SingleHouse">บ้านเดี่ยว</SelectItem>
                    <SelectItem value="Land">ที่ดิน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  จำนวนห้องนอน
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="border-gray-200">
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
                  ช่วงราคา (฿)
                </label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="ราคาต่ำสุด"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border-gray-200"
                  />
                  <Input
                    type="number"
                    placeholder="ราคาสูงสุด"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex-1 border-gray-200"
                >
                  รีเซ็ต
                </Button>
                <Button
                  onClick={() => {
                    setPage(1);
                    setShowFilters(false);
                  }}
                  className="flex-1 bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                >
                  ค้นหา
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <p className="text-xs">
            © 2025 Pariwat Property. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
