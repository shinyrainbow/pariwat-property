/**
 * LINE Messaging API Utility
 * Sends notifications to LINE OA admin
 */

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_ADMIN_USER_ID = process.env.LINE_ADMIN_USER_ID;

interface LineNotifyOptions {
  message: string;
}

/**
 * Send a push message to the LINE OA admin
 */
export async function sendLineNotification({ message }: LineNotifyOptions): Promise<boolean> {
  if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_ADMIN_USER_ID) {
    console.warn("LINE notification not configured: missing LINE_CHANNEL_ACCESS_TOKEN or LINE_ADMIN_USER_ID");
    return false;
  }

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: LINE_ADMIN_USER_ID,
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
      console.error("LINE notification failed:", response.status, errorText);
      return false;
    }

    console.log("LINE notification sent successfully");
    return true;
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
