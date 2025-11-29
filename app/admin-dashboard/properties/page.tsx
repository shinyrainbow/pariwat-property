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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Bed,
  Bath,
  Maximize,
} from "lucide-react";
import Image from "next/image";

interface Property {
  id: string;
  agentPropertyCode: string;
  propertyType: string;
  listingType: string;
  propertyTitleTh: string;
  propertyTitleEn: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number | null;
  usableAreaSqm: number | null;
  imageUrls: string[];
  rentalRateNum: number | null;
  sellPriceNum: number | null;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { propertyType: typeFilter }),
      });

      const res = await fetch(`/api/admin/properties?${params}`);
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
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProperties();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteModalId(null);
        fetchProperties();
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "-";
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
      sold: { label: "Sold", className: "bg-blue-100 text-blue-800" },
      rented: { label: "Rented", className: "bg-purple-100 text-purple-800" },
    };
    const c = config[status] || config.inactive;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${c.className}`}
      >
        {c.label}
      </span>
    );
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Condo: "คอนโด",
      Townhouse: "ทาวน์เฮ้าส์",
      SingleHouse: "บ้านเดี่ยว",
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
          <p className="text-gray-600 mt-1">จัดการทรัพย์สินทั้งหมดของคุณ</p>
        </div>
        <Link href="/admin-dashboard/properties/new">
          <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มทรัพย์สินใหม่
          </Button>
        </Link>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
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
          <Link href="/admin-dashboard/properties/new">
            <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มทรัพย์สินใหม่
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="relative w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                  {property.featured && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">
                          {property.agentPropertyCode}
                        </span>
                        {getStatusBadge(property.status)}
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {property.propertyTitleTh || property.propertyTitleEn}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getPropertyTypeLabel(property.propertyType)} •{" "}
                        {property.listingType === "rent"
                          ? "ให้เช่า"
                          : property.listingType === "sale"
                          ? "ขาย"
                          : "เช่า/ขาย"}
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
                        {property.roomSizeNum || property.usableAreaSqm || "-"}{" "}
                        ตร.ม.
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{property.views} views</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-2">
                    {property.rentalRateNum && (
                      <span className="text-lg font-bold text-[#c6af6c]">
                        ฿{formatPrice(property.rentalRateNum)}
                        <span className="text-sm font-normal text-gray-500">
                          /เดือน
                        </span>
                      </span>
                    )}
                    {property.sellPriceNum && (
                      <span
                        className={`text-lg font-bold text-[#c6af6c] ${
                          property.rentalRateNum ? "ml-4" : ""
                        }`}
                      >
                        ฿{formatPrice(property.sellPriceNum)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 flex-shrink-0">
                  <Link href={`/admin-dashboard/properties/${property.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      แก้ไข
                    </Button>
                  </Link>
                  <Link href={`/property/${property.id}`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      ดู
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 w-full md:w-auto"
                    onClick={() => setDeleteModalId(property.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    ลบ
                  </Button>
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
                  className={
                    page === pageNum
                      ? "bg-[#c6af6c] hover:bg-[#b39d5b]"
                      : ""
                  }
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

      {/* Delete Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ยืนยันการลบ
            </h3>
            <p className="text-gray-600 mb-6">
              คุณต้องการลบทรัพย์สินนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModalId(null)}
                disabled={deleting}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDelete(deleteModalId)}
                disabled={deleting}
              >
                {deleting ? "กำลังลบ..." : "ลบ"}
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
