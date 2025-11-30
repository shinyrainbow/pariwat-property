"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  Wrench,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";

interface OtherService {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminOtherServicesPage() {
  const [services, setServices] = useState<OtherService[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<OtherService | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    order: 0,
    isActive: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (data.success) {
        setFormData({ ...formData, imageUrl: data.data.url });
      } else {
        alert(data.error || "อัปโหลดไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/other-services");
      const data = await res.json();

      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async () => {
    if (!formData.title) return;

    setUpdating("form");
    try {
      const url = "/api/admin/other-services";
      const method = editingService ? "PUT" : "POST";
      const body = editingService
        ? { id: editingService.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchServices();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบริการนี้?")) return;

    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/other-services?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleActive = async (service: OtherService) => {
    setUpdating(service.id);
    try {
      const res = await fetch("/api/admin/other-services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: service.id,
          isActive: !service.isActive,
        }),
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to toggle service:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleOpenModal = (service?: OtherService) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        titleEn: service.titleEn || "",
        description: service.description || "",
        imageUrl: service.imageUrl || "",
        linkUrl: service.linkUrl || "",
        order: service.order,
        isActive: service.isActive,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        titleEn: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        order: services.length,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      title: "",
      titleEn: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      order: 0,
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">บริการอื่นๆ</h1>
          <p className="text-gray-600 mt-1">
            จัดการบริการเสริม เช่น ทำความสะอาด, ล้างแอร์ ฯลฯ
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มบริการ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">บริการทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">กำลังแสดง</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter((s) => s.isActive).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ซ่อนอยู่</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter((s) => !s.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Card className="p-12 text-center">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">ยังไม่มีบริการ</p>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มบริการแรก
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`overflow-hidden ${!service.isActive ? "opacity-60" : ""}`}
            >
              {/* Image */}
              <div className="relative h-40 bg-gray-100">
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {/* Order Badge */}
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <GripVertical className="w-3 h-3" />
                  ลำดับ {service.order + 1}
                </div>
                {/* Active Badge */}
                {!service.isActive && (
                  <div className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ซ่อน
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                {service.titleEn && (
                  <p className="text-sm text-gray-500 mb-2">{service.titleEn}</p>
                )}
                {service.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.description}
                  </p>
                )}
                {service.linkUrl && (
                  <a
                    href={service.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#c6af6c] hover:text-[#b39d5b] flex items-center gap-1 mb-3"
                  >
                    <ExternalLink className="w-3 h-3" />
                    ดูลิงก์
                  </a>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(service)}
                    disabled={updating === service.id}
                    className={
                      service.isActive
                        ? "text-gray-600 hover:text-gray-700"
                        : "text-green-600 hover:text-green-700"
                    }
                  >
                    {updating === service.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : service.isActive ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        ซ่อน
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        แสดง
                      </>
                    )}
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(service)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      disabled={updating === service.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 bg-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingService ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อบริการ (ภาษาไทย) *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="เช่น: บริการทำความสะอาด"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อบริการ (ภาษาอังกฤษ)
                </label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                  placeholder="e.g., Cleaning Service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รายละเอียด
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="รายละเอียดเกี่ยวกับบริการ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#c6af6c] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รูปภาพ
                </label>

                {/* Image Preview or Upload Area */}
                {formData.imageUrl ? (
                  <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#c6af6c] hover:bg-[#c6af6c]/5 transition-colors mb-2"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-[#c6af6c] animate-spin mb-2" />
                        <p className="text-sm text-gray-500">กำลังอัปโหลด...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 font-medium">คลิกเพื่ออัปโหลดรูปภาพ</p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP หรือ GIF (สูงสุด 5MB)</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Or Enter URL */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">หรือใส่ URL</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ลิงก์บริการ
                </label>
                <Input
                  value={formData.linkUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
                  placeholder="https://example.com/service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ลำดับการแสดง
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                  min={0}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-[#c6af6c] border-gray-300 rounded focus:ring-[#c6af6c]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  แสดงบนหน้าเว็บ
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={updating === "form"}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                onClick={handleSubmit}
                disabled={updating === "form" || !formData.title}
              >
                {updating === "form" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : editingService ? (
                  "บันทึกการแก้ไข"
                ) : (
                  "เพิ่มบริการ"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
