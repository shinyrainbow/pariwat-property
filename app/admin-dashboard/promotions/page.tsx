"use client";

import { useState, useEffect } from "react";
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
  X,
  Loader2,
  Building,
  Flame,
  Sparkles,
  Percent,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";

interface Property {
  id: string;
  title: string;
  code: string;
  type: string;
  imageUrl: string | null;
}

interface Promotion {
  id: string;
  label: string;
  type: "hot" | "new" | "discount" | "featured";
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  extension: {
    id: string;
    externalPropertyId: string;
  };
  property: Property | null;
}

const PROMOTION_TYPES = [
  { value: "hot", label: "HOT", color: "bg-red-500", icon: Flame },
  { value: "new", label: "NEW", color: "bg-green-500", icon: Sparkles },
  { value: "discount", label: "DISCOUNT", color: "bg-blue-500", icon: Percent },
  { value: "featured", label: "FEATURED", color: "bg-purple-500", icon: Award },
];

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { confirm } = useConfirmDialog();

  // Form state
  const [formData, setFormData] = useState({
    propertyId: "",
    label: "",
    type: "hot" as "hot" | "new" | "discount" | "featured",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      const res = await fetch("/api/admin/promotions");
      const data = await res.json();
      if (data.success) {
        setPromotions(data.data);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties for selector
  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/public/enhanced-properties?limit=100");
      const data = await res.json();
      if (data.success) {
        setProperties(
          data.data.map((p: { id: string; propertyTitleTh?: string; propertyTitleEn?: string; agentPropertyCode?: string; projectPropertyCode?: string; propertyType: string; imageUrls?: string[]; project?: { projectNameTh?: string; projectNameEn?: string } }) => ({
            id: p.id,
            title: p.propertyTitleTh || p.propertyTitleEn || p.project?.projectNameTh || p.project?.projectNameEn || "ไม่ระบุชื่อ",
            code: p.agentPropertyCode || p.projectPropertyCode,
            type: p.propertyType,
            imageUrl: p.imageUrls?.[0] || null,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProperties();
  }, []);

  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.property?.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    const typeInfo = PROMOTION_TYPES.find((t) => t.value === type);
    if (!typeInfo) return null;
    const Icon = typeInfo.icon;
    return (
      <div
        className={`w-10 h-10 ${typeInfo.color} rounded-lg flex items-center justify-center`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
    );
  };

  const getStatusBadge = (isActive: boolean, endDate: string | null) => {
    const isExpired = endDate && new Date(endDate) < new Date();
    if (isExpired) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          หมดอายุ
        </span>
      );
    }
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
        เปิดใช้งาน
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
        ปิดใช้งาน
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openAddModal = () => {
    setEditingPromotion(null);
    setFormData({
      propertyId: "",
      label: "",
      type: "hot",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (promo: Promotion) => {
    setEditingPromotion(promo);
    setFormData({
      propertyId: promo.extension.externalPropertyId,
      label: promo.label,
      type: promo.type,
      startDate: promo.startDate ? promo.startDate.split("T")[0] : "",
      endDate: promo.endDate ? promo.endDate.split("T")[0] : "",
      isActive: promo.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.propertyId || !formData.label || !formData.type) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setSubmitting(true);

    try {
      if (editingPromotion) {
        // Update existing promotion
        const res = await fetch(
          `/api/admin/extensions/${formData.propertyId}/promotions`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              promotionId: editingPromotion.id,
              label: formData.label,
              type: formData.type,
              startDate: formData.startDate || null,
              endDate: formData.endDate || null,
              isActive: formData.isActive,
            }),
          }
        );
        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          toast.success("บันทึกโปรโมชันเรียบร้อยแล้ว");
          fetchPromotions();
        } else {
          toast.error(data.error || "เกิดข้อผิดพลาด");
        }
      } else {
        // Create new promotion
        const res = await fetch(
          `/api/admin/extensions/${formData.propertyId}/promotions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              label: formData.label,
              type: formData.type,
              startDate: formData.startDate || null,
              endDate: formData.endDate || null,
              isActive: formData.isActive,
            }),
          }
        );
        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          toast.success("เพิ่มโปรโมชันเรียบร้อยแล้ว");
          fetchPromotions();
        } else {
          toast.error(data.error || "เกิดข้อผิดพลาด");
        }
      }
    } catch (error) {
      console.error("Error submitting promotion:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (promoId: string) => {
    const confirmed = await confirm({
      title: "ยืนยันการลบ",
      message: "คุณต้องการลบโปรโมชันนี้ใช่หรือไม่?",
      confirmText: "ลบ",
      cancelText: "ยกเลิก",
      variant: "danger",
    });
    if (!confirmed) return;

    setDeleting(promoId);

    try {
      const res = await fetch(`/api/admin/promotions?id=${promoId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("ลบโปรโมชันเรียบร้อยแล้ว");
        fetchPromotions();
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeleting(null);
    }
  };

  const activeCount = promotions.filter((p) => p.isActive && (!p.endDate || new Date(p.endDate) >= new Date())).length;
  const expiredCount = promotions.filter((p) => p.endDate && new Date(p.endDate) < new Date()).length;

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
        <Button
          className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
          onClick={openAddModal}
        >
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
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
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
              <p className="text-2xl font-bold text-gray-900">{expiredCount}</p>
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      ทรัพย์สิน
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      โปรโมชัน
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
                          {promo.property?.imageUrl ? (
                            <img
                              src={promo.property.imageUrl}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {promo.property?.title || "ไม่พบทรัพย์สิน"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {promo.property?.code || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {getTypeBadge(promo.type)}
                          <span className="font-medium text-gray-900">
                            {promo.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(promo.endDate)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(promo.isActive, promo.endDate)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(promo)}
                          >
                            <Pencil className="w-4 h-4 text-gray-800" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(promo.id)}
                            disabled={deleting === promo.id}
                          >
                            {deleting === promo.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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
          </>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingPromotion ? "แก้ไขโปรโมชัน" : "เพิ่มโปรโมชันใหม่"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Property Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ทรัพย์สิน *
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertyId: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c6af6c] text-gray-900"
                  disabled={!!editingPromotion}
                >
                  <option value="">เลือกทรัพย์สิน</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อโปรโมชัน *
                </label>
                <Input
                  value={formData.label}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="เช่น ลด 10%, ฟรีค่าโอน"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภท *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROMOTION_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            type: type.value as typeof formData.type,
                          }))
                        }
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                          formData.type === type.value
                            ? "border-[#c6af6c] bg-[#c6af6c]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 ${type.color} rounded flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันเริ่มต้น
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันสิ้นสุด
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  เปิดใช้งาน
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isActive ? "bg-[#c6af6c]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : editingPromotion ? (
                    "บันทึกการแก้ไข"
                  ) : (
                    "เพิ่มโปรโมชัน"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
