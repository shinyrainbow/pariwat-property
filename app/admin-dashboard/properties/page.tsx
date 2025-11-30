"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Search,
  Eye,
  Bed,
  Bath,
  Maximize,
  Percent,
  CheckCircle,
  XCircle,
  Flame,
} from "lucide-react";
import Image from "next/image";

interface Promotion {
  id: string;
  label: string;
  type: string;
  isActive: boolean;
}

interface PropertyTag {
  id: string;
  name: string;
  color: string | null;
}

interface PropertyExtension {
  id: string;
  externalPropertyId: string;
  priority: number;
  internalNotes: string | null;
  isHidden: boolean;
  isFeaturedPopular: boolean;
  promotions: Promotion[];
  tags: PropertyTag[];
}

interface NainaHubProject {
  projectCode: string;
  projectNameEn: string;
  projectNameTh: string;
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
  projectPropertyCode: string | null;
  agentPropertyCode: string | null;
  propertyType: "Condo" | "Townhouse" | "SingleHouse" | "Land";
  propertyTitleEn: string;
  propertyTitleTh: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number;
  usableAreaSqm: number;
  imageUrls: string[];
  rentalRateNum: number;
  sellPriceNum: number;
  project: NainaHubProject;
  status: PropertyStatus;
  extension: PropertyExtension | null;
}

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [extensionFilter, setExtensionFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // Modal states
  const [showPromotionModal, setShowPromotionModal] = useState<Property | null>(null);
  const [promotionForm, setPromotionForm] = useState({ label: "", type: "discount" });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(typeFilter && typeFilter !== "all" && { propertyType: typeFilter }),
      });

      const res = await fetch(`/api/public/enhanced-properties?${params}&includeHidden=true`);
      const data = await res.json();

      if (data.success) {
        let filteredData = data.data;

        // Client-side search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filteredData = filteredData.filter(
            (p: Property) =>
              p.propertyTitleTh?.toLowerCase().includes(searchLower) ||
              p.propertyTitleEn?.toLowerCase().includes(searchLower) ||
              p.agentPropertyCode?.toLowerCase().includes(searchLower) ||
              p.project?.projectNameTh?.toLowerCase().includes(searchLower) ||
              p.project?.projectNameEn?.toLowerCase().includes(searchLower)
          );
        }

        // Extension filter
        if (extensionFilter && extensionFilter !== "all") {
          filteredData = filteredData.filter((p: Property) => {
            switch (extensionFilter) {
              case "popular":
                return p.extension?.isFeaturedPopular;
              case "has_promotions":
                return p.extension?.promotions && p.extension.promotions.length > 0;
              case "closed_deal":
                return p.status === "sold" || p.status === "rented";
              case "hidden":
                return p.extension?.isHidden;
              default:
                return true;
            }
          });
        }

        setProperties(filteredData);
        setTotal(data.pagination?.total || filteredData.length);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, typeFilter, extensionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProperties();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const togglePopular = async (propertyId: string, currentValue: boolean) => {
    setUpdating(propertyId);
    try {
      const res = await fetch(`/api/admin/extensions/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeaturedPopular: !currentValue }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? { ...p, extension: data.data || { ...p.extension, isFeaturedPopular: !currentValue } }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle popular:", error);
    } finally {
      setUpdating(null);
    }
  };

  const toggleHidden = async (propertyId: string, currentValue: boolean) => {
    setUpdating(propertyId);
    try {
      const res = await fetch(`/api/admin/extensions/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentValue }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? { ...p, extension: data.data || { ...p.extension, isHidden: !currentValue } }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle hidden:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleAddPromotion = async () => {
    if (!showPromotionModal || !promotionForm.label) return;

    setUpdating(showPromotionModal.id);
    try {
      const res = await fetch(`/api/admin/extensions/${showPromotionModal.id}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotionForm),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === showPromotionModal.id
              ? { ...p, extension: data.data }
              : p
          )
        );
        setShowPromotionModal(null);
        setPromotionForm({ label: "", type: "discount" });
      }
    } catch (error) {
      console.error("Failed to add promotion:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemovePromotion = async (propertyId: string, promotionId: string) => {
    setUpdating(propertyId);
    try {
      const res = await fetch(`/api/admin/extensions/${propertyId}/promotions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotionId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? { ...p, extension: data.data }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to remove promotion:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatPrice = (price: number | null) => {
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

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายการทรัพย์สิน</h1>
          <p className="text-gray-600 mt-1">
            จัดการทรัพย์สินจาก NainaHub - กำหนด Popular, Promotions
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            จาก NainaHub API
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ค้นหาชื่อ หรือรหัสทรัพย์สิน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="ประเภททั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ประเภททั้งหมด</SelectItem>
                <SelectItem value="Condo">คอนโด</SelectItem>
                <SelectItem value="Townhouse">ทาวน์เฮ้าส์</SelectItem>
                <SelectItem value="SingleHouse">บ้านเดี่ยว</SelectItem>
                <SelectItem value="Land">ที่ดิน</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={extensionFilter} onValueChange={setExtensionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะพิเศษ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="popular">
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Popular
                  </span>
                </SelectItem>
                <SelectItem value="has_promotions">
                  <span className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-red-500" />
                    มี Promotions
                  </span>
                </SelectItem>
                <SelectItem value="closed_deal">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Closed Deals
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          แสดง {properties.length} จาก {total} รายการ
        </p>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse bg-gray-200" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ไม่พบทรัพย์สิน
          </h3>
          <p className="text-gray-600 mb-4">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className={`p-4 hover:shadow-lg transition-shadow ${
                property.extension?.isHidden ? "opacity-50" : ""
              } ${property.status === "sold" || property.status === "rented" ? "border-green-300 bg-green-50/30" : ""}`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Image */}
                <div className="relative w-full lg:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {property.imageUrls && property.imageUrls.length > 0 ? (
                    <Image
                      src={property.imageUrls[0]}
                      alt={property.propertyTitleTh}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {property.extension?.isFeaturedPopular && (
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Popular
                      </span>
                    )}
                    {(property.status === "sold" || property.status === "rented") && (
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {property.status === "sold" ? "ขายแล้ว" : "ปล่อยเช่าแล้ว"}
                      </span>
                    )}
                    {property.extension?.promotions && property.extension.promotions.length > 0 && (
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        {property.extension.promotions.length} Promo
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">
                          {property.agentPropertyCode || property.id.slice(0, 8)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getPropertyTypeLabel(property.propertyType)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {property.propertyTitleTh || property.propertyTitleEn}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {property.project?.projectNameTh || property.project?.projectNameEn || "ไม่ระบุโครงการ"}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedRoomNum}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathRoomNum}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>
                        {property.roomSizeNum || property.usableAreaSqm || "-"} ตร.ม.
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-2">
                    {property.rentalRateNum > 0 && (
                      <span className="text-lg font-bold text-[#c6af6c]">
                        ฿{formatPrice(property.rentalRateNum)}
                        <span className="text-sm font-normal text-gray-500">/เดือน</span>
                      </span>
                    )}
                    {property.sellPriceNum > 0 && (
                      <span className={`text-lg font-bold text-[#c6af6c] ${property.rentalRateNum ? "ml-4" : ""}`}>
                        ฿{formatPrice(property.sellPriceNum)}
                      </span>
                    )}
                  </div>

                  {/* Promotions list */}
                  {property.extension?.promotions && property.extension.promotions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {property.extension.promotions.map((promo) => (
                        <span
                          key={promo.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs"
                        >
                          <Percent className="w-3 h-3" />
                          {promo.label}
                          <button
                            onClick={() => handleRemovePromotion(property.id, promo.id)}
                            className="ml-1 hover:text-red-900"
                            disabled={updating === property.id}
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 flex-shrink-0 flex-wrap">
                  {/* Toggle Popular */}
                  <Button
                    variant={property.extension?.isFeaturedPopular ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePopular(property.id, !!property.extension?.isFeaturedPopular)}
                    disabled={updating === property.id || property.status === "sold" || property.status === "rented"}
                    className={property.extension?.isFeaturedPopular ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    <Flame className="w-4 h-4 mr-1" />
                    Popular
                  </Button>

                  {/* Add Promotion */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPromotionModal(property)}
                    disabled={updating === property.id || property.status === "sold" || property.status === "rented"}
                  >
                    <Percent className="w-4 h-4 mr-1" />
                    โปรโมชั่น
                  </Button>

                  {/* Mark as Closed Deal */}
                  {/* {property.extension?.closedDealDate ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveClosedDeal(property.id)}
                      disabled={updating === property.id}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      ยกเลิก Closed
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowClosedDealModal(property)}
                      disabled={updating === property.id}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Closed Deal
                    </Button>
                  )} */}

                  {/* View Property */}
                  <Link href={`/property/${property.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      ดู
                    </Button>
                  </Link>

                  {/* Toggle Hidden */}
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleHidden(property.id, !!property.extension?.isHidden)}
                    disabled={updating === property.id}
                    className={property.extension?.isHidden ? "text-gray-400" : ""}
                  >
                    {property.extension?.isHidden ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        แสดง
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        ซ่อน
                      </>
                    )}
                  </Button> */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ก่อนหน้า
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={page === pageNum ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                  className={page === pageNum ? "bg-[#c6af6c] hover:bg-[#b39d5b]" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            ถัดไป
          </Button>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              เพิ่มโปรโมชั่น
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {showPromotionModal.propertyTitleTh || showPromotionModal.propertyTitleEn}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ข้อความโปรโมชั่น
                </label>
                <Input
                  value={promotionForm.label}
                  onChange={(e) => setPromotionForm({ ...promotionForm, label: e.target.value })}
                  placeholder="เช่น: ลด 10%, ฟรีค่าโอน"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภท
                </label>
                <Select
                  value={promotionForm.type}
                  onValueChange={(v) => setPromotionForm({ ...promotionForm, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">ส่วนลด</SelectItem>
                    <SelectItem value="free">ฟรี</SelectItem>
                    <SelectItem value="special">พิเศษ</SelectItem>
                    <SelectItem value="limited">จำกัดเวลา</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPromotionModal(null);
                  setPromotionForm({ label: "", type: "discount" });
                }}
                disabled={updating === showPromotionModal.id}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                onClick={handleAddPromotion}
                disabled={updating === showPromotionModal.id || !promotionForm.label}
              >
                {updating === showPromotionModal.id ? "กำลังเพิ่ม..." : "เพิ่มโปรโมชั่น"}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
