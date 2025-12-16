"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Home,
  Tag,
  Star,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalProperties: number;
    forRent: number;
    forSale: number;
    popular: number;
    closedDeals: number;
    activePromotions: number;
    withPromotions: number;
    pendingReviews: number;
    publishedReviews: number;
    newInquiries: number;
    totalInquiries: number;
  };
  recentProperties: Array<{
    id: string;
    propertyTitleTh: string;
    propertyTitleEn: string;
    propertyType: string;
    agentPropertyCode: string;
    rentalRateNum: number;
    sellPriceNum: number;
    imageUrl: string | null;
    project: {
      projectNameTh: string;
      projectNameEn: string;
    } | null;
  }>;
  propertyTypeDistribution: Record<string, number>;
  listingDistribution: {
    rent: number;
    sale: number;
    both: number;
  };
  propertiesWithPromotions: Array<{
    id: string;
    propertyTitleTh: string;
    propertyType: string;
    imageUrl: string | null;
    project: {
      projectNameTh: string;
      projectNameEn: string;
    } | null;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load data");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Condo: "คอนโด",
      Townhouse: "ทาวน์เฮ้าส์",
      SingleHouse: "บ้านเดี่ยว",
      Villa: "วิลล่า",
      Land: "ที่ดิน",
      Office: "สำนักงาน",
      Store: "ร้านค้า",
      Factory: "โรงงาน",
      Hotel: "โรงแรม",
      Building: "อาคาร",
      Apartment: "อพาร์ทเมนท์",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-64 animate-pulse bg-gray-200" />
          <Card className="h-64 animate-pulse bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || "Failed to load dashboard data"}</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          ลองอีกครั้ง
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      label: "ทรัพย์สินทั้งหมด",
      value: data.stats.totalProperties,
      icon: Building2,
      color: "bg-blue-500",
      href: "/admin-dashboard/properties",
    },
    {
      label: "ยอดนิยม",
      value: data.stats.popular,
      icon: Star,
      color: "bg-amber-500",
      href: "/admin-dashboard/properties?filter=popular",
    },
    {
      label: "โปรโมชันที่ใช้งาน",
      value: data.stats.activePromotions,
      icon: Tag,
      color: "bg-purple-500",
      href: "/admin-dashboard/promotions",
    },
    {
      label: "ข้อความใหม่",
      value: data.stats.newInquiries,
      icon: MessageSquare,
      color: data.stats.newInquiries > 0 ? "bg-red-500" : "bg-green-500",
      href: "/admin-dashboard/inquiries",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ยินดีต้อนรับสู่แดชบอร์ด
          </h1>
          <p className="text-gray-600 mt-1">
            ข้อมูลจริงจาก NainaHub API และระบบภายใน
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
          <CheckCircle className="w-4 h-4" />
          <span>เชื่อมต่อ API สำเร็จ</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {data.stats.forRent}
          </p>
          <p className="text-sm text-gray-600">ให้เช่า</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {data.stats.forSale}
          </p>
          <p className="text-sm text-gray-600">ขาย</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {data.listingDistribution.both}
          </p>
          <p className="text-sm text-gray-600">ขาย/เช่า</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.stats.closedDeals}
          </p>
          <p className="text-sm text-gray-600">ปิดการขาย</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {data.stats.pendingReviews}
          </p>
          <p className="text-sm text-gray-600">รีวิวรอตรวจสอบ</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-cyan-600">
            {data.stats.totalInquiries}
          </p>
          <p className="text-sm text-gray-600">ข้อความทั้งหมด</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ประเภททรัพย์สิน
          </h3>
          <div className="space-y-4">
            {Object.entries(data.propertyTypeDistribution).map(
              ([type, count]) => {
                const total = data.stats.totalProperties;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colors: Record<string, string> = {
                  Condo: "bg-blue-500",
                  Townhouse: "bg-green-500",
                  SingleHouse: "bg-purple-500",
                  Villa: "bg-pink-500",
                  Land: "bg-amber-500",
                  Office: "bg-indigo-500",
                  Store: "bg-orange-500",
                  Factory: "bg-gray-500",
                  Hotel: "bg-red-500",
                  Building: "bg-cyan-500",
                  Apartment: "bg-teal-500",
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">
                        {getPropertyTypeLabel(type)}
                      </span>
                      <span className="text-gray-500">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[type] || "bg-gray-400"} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Card>

        {/* Listing Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ประเภทการลงประกาศ
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200 text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {data.listingDistribution.rent}
              </p>
              <p className="text-sm text-emerald-700 mt-1">เช่า</p>
            </div>
            <div className="p-4 rounded-lg border bg-amber-50 border-amber-200 text-center">
              <p className="text-3xl font-bold text-amber-600">
                {data.listingDistribution.sale}
              </p>
              <p className="text-sm text-amber-700 mt-1">ขาย</p>
            </div>
            <div className="p-4 rounded-lg border bg-purple-50 border-purple-200 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {data.listingDistribution.both}
              </p>
              <p className="text-sm text-purple-700 mt-1">ขาย/เช่า</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              การดำเนินการด่วน
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/admin-dashboard/promotions">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  จัดการโปรโมชัน
                </Button>
              </Link>
              <Link href="/admin-dashboard/reviews">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  จัดการรีวิว
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ทรัพย์สินล่าสุดจาก API
            </h3>
            <Link
              href="/admin-dashboard/properties"
              className="text-sm text-[#c6af6c] hover:text-[#b39d5b] flex items-center gap-1"
            >
              ดูทั้งหมด
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentProperties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                target="_blank"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {property.imageUrl ? (
                    <Image
                      src={property.imageUrl}
                      alt={property.propertyTitleTh}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {property.propertyTitleTh || property.propertyTitleEn}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.agentPropertyCode} •{" "}
                    {getPropertyTypeLabel(property.propertyType)}
                    {property.propertyType === "Condo" && property.project?.projectNameEn && (
                      <> • {property.project.projectNameEn}</>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  {property.rentalRateNum > 0 && (
                    <p className="text-sm font-semibold text-emerald-600">
                      ฿{formatPrice(property.rentalRateNum)}/ด.
                    </p>
                  )}
                  {property.sellPriceNum > 0 && (
                    <p className="text-sm font-semibold text-amber-600">
                      ฿{formatPrice(property.sellPriceNum)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Properties with Promotions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ทรัพย์สินที่มีโปรโมชัน
            </h3>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          {data.propertiesWithPromotions.length > 0 ? (
            <div className="space-y-3">
              {data.propertiesWithPromotions.map((property) => (
                <Link
                  key={property.id}
                  href={`/property/${property.id}`}
                  target="_blank"
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-colors border border-amber-200"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {property.imageUrl ? (
                      <Image
                        src={property.imageUrl}
                        alt={property.propertyTitleTh}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.propertyTitleTh}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getPropertyTypeLabel(property.propertyType)}
                      {property.propertyType === "Condo" && property.project?.projectNameEn && (
                        <> • {property.project.projectNameEn}</>
                      )}
                    </p>
                  </div>
                  <Tag className="w-5 h-5 text-amber-500" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">ยังไม่มีทรัพย์สินที่มีโปรโมชัน</p>
              <Link href="/admin-dashboard/promotions">
                <Button size="sm" className="mt-3 bg-[#c6af6c] hover:bg-[#b39d5b]">
                  เพิ่มโปรโมชัน
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
