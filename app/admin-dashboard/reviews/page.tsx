"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  ThumbsUp,
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  rating: number;
  comment: string;
  transactionType: string;
  location: string;
  date: string;
  helpful: number;
  status: "published" | "pending" | "rejected";
}

// Mock data - in production, this would come from an API
const mockReviews: Review[] = [
  {
    id: "1",
    name: "คุณสมชาย",
    avatar: "ส",
    avatarBg: "bg-[#c6af6c]",
    rating: 5,
    comment:
      "บริการดีมาก ตอบเร็ว ช่วยหาห้องที่ตรงใจได้เลย ขอบคุณทีมงาน Pariwat Property มากครับ",
    transactionType: "เช่าคอนโด",
    location: "สุขุมวิท",
    date: "15 พฤศจิกายน 2024",
    helpful: 24,
    status: "published",
  },
  {
    id: "2",
    name: "คุณนภา",
    avatar: "น",
    avatarBg: "bg-blue-500",
    rating: 5,
    comment:
      "ประทับใจมากค่ะ ให้ข้อมูลครบถ้วน พาดูหลายที่จนได้ห้องที่ถูกใจ ราคาดีด้วย",
    transactionType: "ซื้อคอนโด",
    location: "พระราม 9",
    date: "10 พฤศจิกายน 2024",
    helpful: 18,
    status: "published",
  },
  {
    id: "3",
    name: "คุณวิชัย",
    avatar: "ว",
    avatarBg: "bg-green-500",
    rating: 4,
    comment: "บริการดี แต่อยากให้มีรูปห้องมากกว่านี้ในประกาศ",
    transactionType: "เช่าทาวน์เฮ้าส์",
    location: "ลาดพร้าว",
    date: "8 พฤศจิกายน 2024",
    helpful: 12,
    status: "pending",
  },
  {
    id: "4",
    name: "คุณมานะ",
    avatar: "ม",
    avatarBg: "bg-purple-500",
    rating: 5,
    comment: "ขายบ้านได้เร็วมาก ขอบคุณทีมงานที่ช่วยประสานงานทุกอย่าง",
    transactionType: "ขายบ้านเดี่ยว",
    location: "บางนา",
    date: "5 พฤศจิกายน 2024",
    helpful: 8,
    status: "published",
  },
];

export default function AdminReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            เผยแพร่แล้ว
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            รอตรวจสอบ
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            ไม่อนุมัติ
          </span>
        );
      default:
        return null;
    }
  };

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">จัดการรีวิว</h1>
        <p className="text-gray-600 mt-1">
          ตรวจสอบและจัดการรีวิวจากลูกค้าทั้งหมด
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">คะแนนเฉลี่ย</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">เผยแพร่แล้ว</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter((r) => r.status === "published").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รอตรวจสอบ</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รีวิวทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ค้นหาชื่อหรือความคิดเห็น..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={
                filterStatus === "all"
                  ? "bg-[#c6af6c] hover:bg-[#b39d5b]"
                  : ""
              }
            >
              ทั้งหมด
            </Button>
            <Button
              variant={filterStatus === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("published")}
              className={
                filterStatus === "published"
                  ? "bg-[#c6af6c] hover:bg-[#b39d5b]"
                  : ""
              }
            >
              เผยแพร่แล้ว
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
              className={
                filterStatus === "pending"
                  ? "bg-[#c6af6c] hover:bg-[#b39d5b]"
                  : ""
              }
            >
              รอตรวจสอบ
            </Button>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Avatar */}
              <div
                className={`w-12 h-12 ${review.avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white text-lg font-bold">
                  {review.avatar}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">
                    {review.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {getStatusBadge(review.status)}
                </div>

                <p className="text-gray-600 mb-3">{review.comment}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span>{review.transactionType}</span>
                  <span>•</span>
                  <span>{review.location}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {review.helpful} คนเห็นว่ามีประโยชน์
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {review.status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      อนุมัติ
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      ไม่อนุมัติ
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card className="p-12 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">ไม่พบรีวิว</p>
          </Card>
        )}
      </div>
    </div>
  );
}
