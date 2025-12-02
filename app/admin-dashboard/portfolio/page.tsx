"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Loader2,
  Images,
  Upload,
  X,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import Image from "next/image";

interface Portfolio {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { confirm } = useConfirmDialog();

  const fetchPortfolios = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      if (data.success) {
        setPortfolios(data.data);
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("กรุณาเลือกรูปภาพ");
      return;
    }

    setUploading(true);

    try {
      // Upload image via server-side API
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success || !uploadData.data?.url) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      // Save to database
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.data.url,
          title: formData.title || null,
          description: formData.description || null,
          order: portfolios.length,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("อัปโหลดรูปภาพสำเร็จ");
        setShowModal(false);
        setSelectedFile(null);
        setImagePreview(null);
        setFormData({ title: "", description: "" });
        fetchPortfolios();
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "ยืนยันการลบ",
      message: "คุณต้องการลบรูปภาพนี้ใช่หรือไม่?",
      confirmText: "ลบ",
      cancelText: "ยกเลิก",
      variant: "danger",
    });
    if (!confirmed) return;

    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("ลบรูปภาพสำเร็จ");
        fetchPortfolios();
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (portfolio: Portfolio) => {
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: portfolio.id,
          isActive: !portfolio.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          portfolio.isActive ? "ซ่อนรูปภาพแล้ว" : "แสดงรูปภาพแล้ว"
        );
        fetchPortfolios();
      }
    } catch (error) {
      console.error("Error toggling active:", error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const activeCount = portfolios.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ผลงานของเรา</h1>
          <p className="text-gray-600 mt-1">
            จัดการรูปภาพผลงานที่จะแสดงบนหน้าเว็บไซต์
          </p>
        </div>
        <Button
          className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มรูปภาพใหม่
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รูปภาพที่แสดง</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Images className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รูปภาพทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolios.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Portfolio Grid */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-12">
            <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">ยังไม่มีรูปภาพผลงาน</p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มรูปภาพแรก
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className={`relative group rounded-lg overflow-hidden border-2 ${
                  portfolio.isActive ? "border-green-200" : "border-gray-200"
                }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={portfolio.imageUrl}
                    alt={portfolio.title || "Portfolio"}
                    fill
                    className="object-cover"
                  />
                  {!portfolio.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        ซ่อนอยู่
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white hover:bg-gray-100 text-gray-700"
                      onClick={() => toggleActive(portfolio)}
                    >
                      {portfolio.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white hover:bg-red-50 text-red-600 border-red-200"
                      onClick={() => handleDelete(portfolio.id)}
                      disabled={deleting === portfolio.id}
                    >
                      {deleting === portfolio.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {portfolio.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-white text-xs truncate">
                      {portfolio.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                เพิ่มรูปภาพใหม่
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                  setImagePreview(null);
                  setFormData({ title: "", description: "" });
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปภาพ *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-[#c6af6c] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      คลิกเพื่อเลือกรูปภาพ
                    </p>
                    <p className="text-xs text-gray-400">
                      รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Title (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อรูปภาพ (ไม่บังคับ)
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="เช่น โครงการ A, ห้องตัวอย่าง"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedFile(null);
                    setImagePreview(null);
                    setFormData({ title: "", description: "" });
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังอัปโหลด...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      อัปโหลด
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
