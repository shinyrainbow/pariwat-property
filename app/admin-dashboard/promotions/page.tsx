"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Search,
} from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  badge: string;
  badgeColor: string;
  expiryDate: string;
  status: "active" | "expired" | "draft";
}

// Mock data - in production, this would come from an API
const mockPromotions: Promotion[] = [
  {
    id: "1",
    title: "โปรโมชันสำหรับลูกค้าใหม่",
    description: "รับส่วนลดค่านายหน้า 10% เมื่อทำสัญญาเช่าหรือซื้อภายในเดือนนี้",
    discount: "10%",
    badge: "HOT",
    badgeColor: "bg-red-500",
    expiryDate: "31 ธันวาคม 2025",
    status: "active",
  },
  {
    id: "2",
    title: "โปรโมชันซื้อคอนโดใหม่",
    description: "ซื้อคอนโดโครงการใหม่ รับฟรีค่าโอนกรรมสิทธิ์",
    discount: "ฟรี",
    badge: "NEW",
    badgeColor: "bg-green-500",
    expiryDate: "31 มกราคม 2026",
    status: "active",
  },
  {
    id: "3",
    title: "โปรโมชันเช่ารายปี",
    description: "เช่าสัญญารายปี รับส่วนลด 1 เดือน",
    discount: "ฟรี 1 เดือน",
    badge: "DEAL",
    badgeColor: "bg-blue-500",
    expiryDate: "28 กุมภาพันธ์ 2026",
    status: "active",
  },
];

export default function AdminPromotionsPage() {
  const [promotions] = useState<Promotion[]>(mockPromotions);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPromotions = promotions.filter((promo) =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            เปิดใช้งาน
          </span>
        );
      case "expired":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            หมดอายุ
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            ฉบับร่าง
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการโปรโมชัน</h1>
          <p className="text-gray-600 mt-1">
            จัดการโปรโมชันและข้อเสนอพิเศษทั้งหมด
          </p>
        </div>
        <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มโปรโมชันใหม่
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="ค้นหาโปรโมชัน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">โปรโมชันที่เปิดใช้งาน</p>
              <p className="text-2xl font-bold text-gray-900">
                {promotions.filter((p) => p.status === "active").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">โปรโมชันหมดอายุ</p>
              <p className="text-2xl font-bold text-gray-900">
                {promotions.filter((p) => p.status === "expired").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">โปรโมชันทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {promotions.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Promotions List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  โปรโมชัน
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  ส่วนลด
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  วันหมดอายุ
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  สถานะ
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPromotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${promo.badgeColor} rounded-lg flex items-center justify-center`}
                      >
                        <span className="text-white text-xs font-bold">
                          {promo.badge}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {promo.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {promo.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-[#c6af6c]">
                      {promo.discount}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {promo.expiryDate}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(promo.status)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">ไม่พบโปรโมชัน</p>
          </div>
        )}
      </Card>
    </div>
  );
}
