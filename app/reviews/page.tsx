"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  MessageSquare,
  ThumbsUp,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  transactionType: string;
  location: string;
  helpful: number;
  createdAt: string;
}

// Generate avatar background color based on name
function getAvatarBg(name: string): string {
  const colors = [
    "bg-[#c6af6c]",
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-teal-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Format date to Thai
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/public/reviews");
        const data = await res.json();
        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Header */}
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c6af6c] to-[#b39d5b] py-16">
        <div
          className={`container mx-auto px-4 text-center text-white transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">รีวิวจากลูกค้า</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
            ความคิดเห็นจากลูกค้าที่ไว้วางใจใช้บริการ Pariwat Property
          </p>

          {/* Rating Summary */}
          {reviews.length > 0 && (
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/50"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-white/80">({reviews.length} รีวิว)</span>
            </div>
          )}

          {/* Add Review Button */}
          <div>
            <Link href="/reviews/new">
              <Button
                size="lg"
                className="bg-white text-[#c6af6c] hover:bg-white/90 font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มรีวิว
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-gray-200" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-lg max-w-lg mx-auto">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ยังไม่มีรีวิว
              </h3>
              <p className="text-gray-600 mb-6">
                เป็นคนแรกที่แบ่งปันประสบการณ์การใช้บริการ Pariwat Property
              </p>
              <Link href="/reviews/new">
                <Button className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มรีวิว
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <Card
                  key={review.id}
                  className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* Quote */}
                  <Quote className="w-8 h-8 text-[#c6af6c] mb-3" />

                  {/* Comment */}
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    &quot;{review.comment}&quot;
                  </p>

                  {/* Transaction Info */}
                  <div className="flex items-center gap-2 text-xs text-[#c6af6c] mb-4">
                    <span className="bg-[#c6af6c]/10 px-2 py-1 rounded-full">
                      {review.transactionType}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {review.location}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 ${getAvatarBg(
                          review.name
                        )} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ลูกค้า Pariwat Property
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            พร้อมเป็นลูกค้าคนถัดไป?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            ให้เราช่วยคุณหาทรัพย์สินในฝัน เหมือนที่ช่วยลูกค้าหลายร้อยคนมาแล้ว
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button
                size="lg"
                className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white px-8"
              >
                ติดต่อเรา
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white px-8"
              >
                กลับหน้าหลัก
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
