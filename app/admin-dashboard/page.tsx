"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Building2,
  Home,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  Star,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalProperties: number;
    activeProperties: number;
    rentedProperties: number;
    soldProperties: number;
    totalViews: number;
    forRent: number;
    forSale: number;
    featured: number;
  };
  recentProperties: Array<{
    id: string;
    propertyTitleTh: string;
    propertyType: string;
    status: string;
    createdAt: string;
    agentPropertyCode: string;
  }>;
  topViewed: Array<{
    id: string;
    propertyTitleTh: string;
    views: number;
    agentPropertyCode: string;
  }>;
  propertyTypeDistribution: {
    Condo: number;
    Townhouse: number;
    SingleHouse: number;
  };
  statusDistribution: {
    active: number;
    inactive: number;
    sold: number;
    rented: number;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; className: string; icon: React.ReactNode }
    > = {
      active: {
        label: "Active",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      inactive: {
        label: "Inactive",
        className: "bg-gray-100 text-gray-800",
        icon: <XCircle className="w-3 h-3" />,
      },
      sold: {
        label: "Sold",
        className: "bg-blue-100 text-blue-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      rented: {
        label: "Rented",
        className: "bg-purple-100 text-purple-800",
        icon: <Clock className="w-3 h-3" />,
      },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
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
      change: "+12%",
    },
    {
      label: "ทรัพย์สินที่ Active",
      value: data.stats.activeProperties,
      icon: Home,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      label: "ยอดเข้าชมทั้งหมด",
      value: data.stats.totalViews,
      icon: Eye,
      color: "bg-purple-500",
      change: "+25%",
    },
    {
      label: "ทรัพย์สินแนะนำ",
      value: data.stats.featured,
      icon: Star,
      color: "bg-amber-500",
      change: "+5%",
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
            ภาพรวมของทรัพย์สินและสถิติการใช้งาน
          </p>
        </div>
        <Link href="/admin-dashboard/properties/new">
          <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มทรัพย์สินใหม่
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#c6af6c]">
            {data.stats.forRent}
          </p>
          <p className="text-sm text-gray-600">ให้เช่า</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#c6af6c]">
            {data.stats.forSale}
          </p>
          <p className="text-sm text-gray-600">ขาย</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {data.stats.rentedProperties}
          </p>
          <p className="text-sm text-gray-600">ปล่อยเช่าแล้ว</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.stats.soldProperties}
          </p>
          <p className="text-sm text-gray-600">ขายแล้ว</p>
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
                const labels: Record<string, string> = {
                  Condo: "คอนโด",
                  Townhouse: "ทาวน์เฮ้าส์",
                  SingleHouse: "บ้านเดี่ยว",
                };
                const colors: Record<string, string> = {
                  Condo: "bg-blue-500",
                  Townhouse: "bg-green-500",
                  SingleHouse: "bg-purple-500",
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{labels[type]}</span>
                      <span className="text-gray-500">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[type]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            สถานะทรัพย์สิน
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.statusDistribution).map(([status, count]) => {
              const labels: Record<string, string> = {
                active: "Active",
                inactive: "Inactive",
                sold: "ขายแล้ว",
                rented: "ปล่อยเช่าแล้ว",
              };
              const colors: Record<string, string> = {
                active: "bg-green-100 text-green-800 border-green-200",
                inactive: "bg-gray-100 text-gray-800 border-gray-200",
                sold: "bg-blue-100 text-blue-800 border-blue-200",
                rented: "bg-purple-100 text-purple-800 border-purple-200",
              };
              return (
                <div
                  key={status}
                  className={`p-4 rounded-lg border ${colors[status]}`}
                >
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm">{labels[status]}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ทรัพย์สินล่าสุด
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
                href={`/admin-dashboard/properties/${property.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {property.propertyTitleTh}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.agentPropertyCode} •{" "}
                    {formatDate(property.createdAt)}
                  </p>
                </div>
                {getStatusBadge(property.status)}
              </Link>
            ))}
          </div>
        </Card>

        {/* Top Viewed */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ยอดเข้าชมสูงสุด
            </h3>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {data.topViewed.map((property, index) => (
              <Link
                key={property.id}
                href={`/admin-dashboard/properties/${property.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-amber-600"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {property.propertyTitleTh}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.agentPropertyCode}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">{property.views}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
