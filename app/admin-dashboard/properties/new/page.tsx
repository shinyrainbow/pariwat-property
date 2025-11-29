"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save, X, Plus, ImageIcon } from "lucide-react";

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    agentPropertyCode: "",
    propertyType: "Condo",
    listingType: "rent",
    propertyTitleTh: "",
    propertyTitleEn: "",
    descriptionTh: "",
    descriptionEn: "",
    bedRoomNum: "1",
    bathRoomNum: "1",
    roomSizeNum: "",
    usableAreaSqm: "",
    landSizeSqw: "",
    floor: "",
    building: "",
    rentalRateNum: "",
    sellPriceNum: "",
    address: "",
    district: "",
    province: "Bangkok",
    latitude: "",
    longitude: "",
    status: "active",
    featured: false,
    imageUrls: [] as string[],
    projectNameTh: "",
    projectNameEn: "",
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (newImageUrl && !formData.imageUrls.includes(newImageUrl)) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrl],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((u) => u !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          project:
            formData.projectNameTh || formData.projectNameEn
              ? {
                  projectNameTh: formData.projectNameTh,
                  projectNameEn: formData.projectNameEn,
                }
              : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin-dashboard/properties");
      } else {
        setError(data.error || "Failed to create property");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin-dashboard/properties">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">เพิ่มทรัพย์สินใหม่</h1>
          <p className="text-gray-600 mt-1">กรอกข้อมูลทรัพย์สินของคุณ</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800 text-sm">{error}</p>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ข้อมูลพื้นฐาน
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสทรัพย์สิน *
                  </label>
                  <Input
                    value={formData.agentPropertyCode}
                    onChange={(e) =>
                      handleChange("agentPropertyCode", e.target.value)
                    }
                    placeholder="PW-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภททรัพย์สิน *
                  </label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(v) => handleChange("propertyType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Condo">คอนโด</SelectItem>
                      <SelectItem value="Townhouse">ทาวน์เฮ้าส์</SelectItem>
                      <SelectItem value="SingleHouse">บ้านเดี่ยว</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภทการลงขาย *
                  </label>
                  <Select
                    value={formData.listingType}
                    onValueChange={(v) => handleChange("listingType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">ให้เช่า</SelectItem>
                      <SelectItem value="sale">ขาย</SelectItem>
                      <SelectItem value="both">เช่า/ขาย</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    สถานะ *
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => handleChange("status", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อทรัพย์สิน (ไทย) *
                  </label>
                  <Input
                    value={formData.propertyTitleTh}
                    onChange={(e) =>
                      handleChange("propertyTitleTh", e.target.value)
                    }
                    placeholder="คอนโดหรู สุขุมวิท"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อทรัพย์สิน (อังกฤษ)
                  </label>
                  <Input
                    value={formData.propertyTitleEn}
                    onChange={(e) =>
                      handleChange("propertyTitleEn", e.target.value)
                    }
                    placeholder="Luxury Condo at Sukhumvit"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียด (ไทย)
                  </label>
                  <textarea
                    value={formData.descriptionTh}
                    onChange={(e) =>
                      handleChange("descriptionTh", e.target.value)
                    }
                    placeholder="รายละเอียดทรัพย์สิน..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c6af6c]"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                รายละเอียดทรัพย์สิน
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ห้องนอน *
                  </label>
                  <Select
                    value={formData.bedRoomNum}
                    onValueChange={(v) => handleChange("bedRoomNum", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ห้องน้ำ *
                  </label>
                  <Select
                    value={formData.bathRoomNum}
                    onValueChange={(v) => handleChange("bathRoomNum", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ขนาดห้อง (ตร.ม.)
                  </label>
                  <Input
                    type="number"
                    value={formData.roomSizeNum}
                    onChange={(e) => handleChange("roomSizeNum", e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    พื้นที่ใช้สอย (ตร.ม.)
                  </label>
                  <Input
                    type="number"
                    value={formData.usableAreaSqm}
                    onChange={(e) =>
                      handleChange("usableAreaSqm", e.target.value)
                    }
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ขนาดที่ดิน (ตร.ว.)
                  </label>
                  <Input
                    type="number"
                    value={formData.landSizeSqw}
                    onChange={(e) => handleChange("landSizeSqw", e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชั้น
                  </label>
                  <Input
                    value={formData.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อาคาร
                  </label>
                  <Input
                    value={formData.building}
                    onChange={(e) => handleChange("building", e.target.value)}
                    placeholder="A"
                  />
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ราคา</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ค่าเช่า (บาท/เดือน)
                  </label>
                  <Input
                    type="number"
                    value={formData.rentalRateNum}
                    onChange={(e) =>
                      handleChange("rentalRateNum", e.target.value)
                    }
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ราคาขาย (บาท)
                  </label>
                  <Input
                    type="number"
                    value={formData.sellPriceNum}
                    onChange={(e) =>
                      handleChange("sellPriceNum", e.target.value)
                    }
                    placeholder="5000000"
                  />
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ที่ตั้ง
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่อยู่
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 ถนนสุขุมวิท"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เขต/อำเภอ
                  </label>
                  <Input
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    placeholder="วัฒนา"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จังหวัด
                  </label>
                  <Input
                    value={formData.province}
                    onChange={(e) => handleChange("province", e.target.value)}
                    placeholder="กรุงเทพฯ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    placeholder="13.7563"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    placeholder="100.5018"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                โครงการ
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อโครงการ (ไทย)
                  </label>
                  <Input
                    value={formData.projectNameTh}
                    onChange={(e) =>
                      handleChange("projectNameTh", e.target.value)
                    }
                    placeholder="เดอะไลน์ สุขุมวิท"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อโครงการ (อังกฤษ)
                  </label>
                  <Input
                    value={formData.projectNameEn}
                    onChange={(e) =>
                      handleChange("projectNameEn", e.target.value)
                    }
                    placeholder="The Line Sukhumvit"
                  />
                </div>
              </div>
            </Card>

            {/* Featured */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    ทรัพย์สินแนะนำ
                  </h2>
                  <p className="text-sm text-gray-500">
                    แสดงในส่วนแนะนำของหน้าแรก
                  </p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.featured ? "bg-[#c6af6c]" : "bg-gray-200"
                  }`}
                  onClick={() => handleChange("featured", !formData.featured)}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.featured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Images */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                รูปภาพ
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL รูปภาพ"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddImage}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.imageUrls.length > 0 ? (
                  <div className="space-y-2">
                    {formData.imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate flex-1">
                          {url}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    ยังไม่มีรูปภาพ
                  </p>
                )}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
                <Link href="/admin-dashboard/properties" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    ยกเลิก
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
