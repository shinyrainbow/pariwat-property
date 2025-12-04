/**
 * LINE Messaging API Utility
 * Sends notifications to LINE OA admin
 */

import { prisma } from "@/lib/prisma";

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
// Supports user IDs and group IDs
const LINE_RECIPIENT_IDS = [
  // process.env.LINE_ADMIN_USER_ID,
  // process.env.LINE_ADMIN_USER_ID_2,
  process.env.LINE_GROUP_ID,
].filter(Boolean) as string[];

interface LineNotifyOptions {
  message: string;
}

/**
 * Check if LINE notifications are enabled in site settings
 */
async function isLineNotificationEnabled(): Promise<boolean> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "lineNotificationEnabled" },
    });
    // Default to true if setting doesn't exist
    return setting?.value !== "false";
  } catch (error) {
    console.error("Failed to check LINE notification setting:", error);
    // Default to true if we can't check the setting
    return true;
  }
}

/**
 * Send a push message to the LINE OA admin
 */
export async function sendLineNotification({ message }: LineNotifyOptions): Promise<boolean> {
  // Check if LINE notifications are enabled
  const enabled = await isLineNotificationEnabled();
  if (!enabled) {
    console.log("LINE notification skipped: disabled in settings");
    return false;
  }

  if (!LINE_CHANNEL_ACCESS_TOKEN || LINE_RECIPIENT_IDS.length === 0) {
    console.warn("LINE notification not configured: missing LINE_CHANNEL_ACCESS_TOKEN or LINE_RECIPIENT_IDS");
    return false;
  }

  try {
    // Send to all configured recipients (users and groups)
    const results = await Promise.all(
      LINE_RECIPIENT_IDS.map(async (recipientId) => {
        const response = await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            to: recipientId,
            messages: [
              {
                type: "text",
                text: message,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`LINE notification failed for ${recipientId}:`, response.status, errorText);
          return false;
        }
        return true;
      })
    );

    const successCount = results.filter(Boolean).length;
    console.log(`LINE notification sent to ${successCount}/${LINE_RECIPIENT_IDS.length} recipients`);
    return successCount > 0;
  } catch (error) {
    console.error("Error sending LINE notification:", error);
    return false;
  }
}

/**
 * Send notification for new property listing submission
 */
export async function notifyNewPropertyListing(data: {
  name: string;
  phone: string;
  propertyType: string;
  listingType: string;
  location?: string;
}): Promise<boolean> {
  const message = `🏠 มีผู้ติดต่อสนใจฝากทรัพย์เข้ามาใหม่

ชื่อ: ${data.name}
เบอร์โทร: ${data.phone}
ประเภท: ${data.listingType === "sale" ? "ขาย" : "เช่า"}
อสังหาริมทรัพย์: ${data.propertyType}${data.location ? `\nพื้นที่: ${data.location}` : ""}`;

  return sendLineNotification({ message });
}

/**
 * Send notification for new property inquiry
 */
export async function notifyNewPropertyInquiry(data: {
  name: string;
  phone: string;
  propertyTitle?: string;
  propertyCode?: string;
  message?: string;
}): Promise<boolean> {
  const propertyInfo = data.propertyTitle || data.propertyCode || "ไม่ระบุ";
  const messageText = `🔔 มีผู้ติดต่อสนใจชมทรัพย์เข้ามาใหม่

ทรัพย์: ${propertyInfo}
ชื่อ: ${data.name}
เบอร์โทร: ${data.phone}${data.message ? `\nข้อความ: ${data.message}` : ""}`;

  return sendLineNotification({ message: messageText });
}
