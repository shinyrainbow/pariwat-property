"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailPropertyView: false,
    emailWeeklyReport: true,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ตั้งค่า</h1>
        <p className="text-gray-600 mt-1">จัดการบัญชีและการตั้งค่าของคุณ</p>
      </div>

      {saved && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-green-800 text-sm">บันทึกการตั้งค่าเรียบร้อยแล้ว</p>
        </Card>
      )}

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
            <User className="w-5 h-5 text-[#c6af6c]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ข้อมูลส่วนตัว</h2>
            <p className="text-sm text-gray-500">อัพเดทข้อมูลบัญชีของคุณ</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="pl-10"
                placeholder="ชื่อของคุณ"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
                className="pl-10"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            className="bg-[#c6af6c] hover:bg-[#b39d5b] text-white"
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </div>
      </Card>

      {/* Password Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
            <Lock className="w-5 h-5 text-[#c6af6c]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              เปลี่ยนรหัสผ่าน
            </h2>
            <p className="text-sm text-gray-500">อัพเดทรหัสผ่านของคุณ</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านปัจจุบัน
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านใหม่
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ยืนยันรหัสผ่านใหม่
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button variant="outline">เปลี่ยนรหัสผ่าน</Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
            <Bell className="w-5 h-5 text-[#c6af6c]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              การแจ้งเตือน
            </h2>
            <p className="text-sm text-gray-500">ตั้งค่าการแจ้งเตือนทางอีเมล</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "emailNewLead",
              label: "ลูกค้าใหม่สนใจทรัพย์สิน",
              desc: "รับอีเมลเมื่อมีลูกค้าติดต่อสอบถาม",
            },
            {
              key: "emailPropertyView",
              label: "มีคนเข้าชมทรัพย์สิน",
              desc: "รับอีเมลเมื่อทรัพย์สินของคุณมียอดเข้าชมสูง",
            },
            {
              key: "emailWeeklyReport",
              label: "รายงานประจำสัปดาห์",
              desc: "รับสรุปยอดเข้าชมและสถิติทุกสัปดาห์",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications]
                    ? "bg-[#c6af6c]"
                    : "bg-gray-200"
                }`}
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof notifications],
                  }))
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#c6af6c]/10 rounded-lg">
            <Shield className="w-5 h-5 text-[#c6af6c]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ความปลอดภัย</h2>
            <p className="text-sm text-gray-500">ตั้งค่าความปลอดภัยของบัญชี</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                การยืนยันตัวตนสองชั้น (2FA)
              </p>
              <p className="text-xs text-gray-500">
                เพิ่มความปลอดภัยด้วยการยืนยันตัวตนเพิ่มเติม
              </p>
            </div>
            <Button variant="outline" size="sm">
              ตั้งค่า
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">
                ประวัติการเข้าสู่ระบบ
              </p>
              <p className="text-xs text-gray-500">
                ดูประวัติการเข้าสู่ระบบทั้งหมด
              </p>
            </div>
            <Button variant="outline" size="sm">
              ดู
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
