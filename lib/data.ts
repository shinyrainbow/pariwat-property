// Mock data store for properties
// In production, replace with actual database (Prisma, etc.)

export interface Property {
  id: string;
  agentPropertyCode: string;
  propertyType: "Condo" | "Townhouse" | "SingleHouse";
  listingType: "rent" | "sale" | "both";
  propertyTitleEn: string;
  propertyTitleTh: string;
  descriptionEn?: string;
  descriptionTh?: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number | null;
  usableAreaSqm: number | null;
  landSizeSqw: number | null;
  floor: string | null;
  building: string | null;
  imageUrls: string[];
  rentalRateNum: number | null;
  sellPriceNum: number | null;
  latitude: number | null;
  longitude: number | null;
  address?: string;
  district?: string;
  province?: string;
  status: "active" | "inactive" | "sold" | "rented";
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  project: {
    projectNameEn: string;
    projectNameTh: string;
  } | null;
}

// Mock properties data
export let properties: Property[] = [
  {
    id: "1",
    agentPropertyCode: "PW-001",
    propertyType: "Condo",
    listingType: "rent",
    propertyTitleEn: "Luxury Condo at Sukhumvit",
    propertyTitleTh: "คอนโดหรู สุขุมวิท",
    descriptionEn: "Beautiful luxury condo with stunning city views",
    descriptionTh: "คอนโดหรูวิวเมืองสวยงาม",
    bedRoomNum: 2,
    bathRoomNum: 2,
    roomSizeNum: 65,
    usableAreaSqm: 65,
    landSizeSqw: null,
    floor: "25",
    building: "A",
    imageUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    rentalRateNum: 35000,
    sellPriceNum: null,
    latitude: 13.7563,
    longitude: 100.5018,
    address: "123 Sukhumvit Road",
    district: "Watthana",
    province: "Chachoengsao",
    status: "active",
    featured: true,
    views: 150,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
    project: {
      projectNameEn: "The Line Sukhumvit",
      projectNameTh: "เดอะไลน์ สุขุมวิท",
    },
  },
  {
    id: "2",
    agentPropertyCode: "PW-002",
    propertyType: "SingleHouse",
    listingType: "sale",
    propertyTitleEn: "Modern House in Bangna",
    propertyTitleTh: "บ้านเดี่ยวโมเดิร์น บางนา",
    descriptionEn: "Spacious modern house with private garden",
    descriptionTh: "บ้านเดี่ยวกว้างขวางพร้อมสวนส่วนตัว",
    bedRoomNum: 4,
    bathRoomNum: 3,
    roomSizeNum: null,
    usableAreaSqm: 250,
    landSizeSqw: 100,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    ],
    rentalRateNum: null,
    sellPriceNum: 15000000,
    latitude: 13.6673,
    longitude: 100.6057,
    address: "456 Bangna-Trad Road",
    district: "Bangna",
    province: "Chachoengsao",
    status: "active",
    featured: true,
    views: 89,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-18T11:00:00Z",
    project: null,
  },
  {
    id: "3",
    agentPropertyCode: "PW-003",
    propertyType: "Townhouse",
    listingType: "both",
    propertyTitleEn: "Townhouse near BTS",
    propertyTitleTh: "ทาวน์เฮ้าส์ใกล้ BTS",
    descriptionEn: "Convenient townhouse near BTS station",
    descriptionTh: "ทาวน์เฮ้าส์ทำเลดีใกล้รถไฟฟ้า",
    bedRoomNum: 3,
    bathRoomNum: 2,
    roomSizeNum: null,
    usableAreaSqm: 150,
    landSizeSqw: 25,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6c0f1f08e7?w=800",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800",
    ],
    rentalRateNum: 25000,
    sellPriceNum: 5500000,
    latitude: 13.7450,
    longitude: 100.5340,
    address: "789 Rama 4 Road",
    district: "Khlong Toei",
    province: "Chachoengsao",
    status: "active",
    featured: false,
    views: 67,
    createdAt: "2025-01-12T09:00:00Z",
    updatedAt: "2025-01-19T16:00:00Z",
    project: {
      projectNameEn: "Baan Klang Muang",
      projectNameTh: "บ้านกลางเมือง",
    },
  },
  {
    id: "4",
    agentPropertyCode: "PW-004",
    propertyType: "Condo",
    listingType: "rent",
    propertyTitleEn: "Studio Condo Asoke",
    propertyTitleTh: "สตูดิโอ คอนโด อโศก",
    descriptionEn: "Cozy studio perfect for singles",
    descriptionTh: "สตูดิโออบอุ่นเหมาะสำหรับคนโสด",
    bedRoomNum: 1,
    bathRoomNum: 1,
    roomSizeNum: 32,
    usableAreaSqm: 32,
    landSizeSqw: null,
    floor: "15",
    building: "B",
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    ],
    rentalRateNum: 18000,
    sellPriceNum: null,
    latitude: 13.7380,
    longitude: 100.5600,
    address: "321 Asoke Road",
    district: "Watthana",
    province: "Chachoengsao",
    status: "rented",
    featured: false,
    views: 234,
    createdAt: "2025-01-08T07:00:00Z",
    updatedAt: "2025-01-21T10:00:00Z",
    project: {
      projectNameEn: "Edge Sukhumvit 23",
      projectNameTh: "เอดจ์ สุขุมวิท 23",
    },
  },
  {
    id: "5",
    agentPropertyCode: "PW-005",
    propertyType: "SingleHouse",
    listingType: "sale",
    propertyTitleEn: "Pool Villa Pattaya",
    propertyTitleTh: "พูลวิลล่า พัทยา",
    descriptionEn: "Luxury pool villa with sea view",
    descriptionTh: "พูลวิลล่าหรูวิวทะเล",
    bedRoomNum: 5,
    bathRoomNum: 5,
    roomSizeNum: null,
    usableAreaSqm: 400,
    landSizeSqw: 200,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
    ],
    rentalRateNum: null,
    sellPriceNum: 35000000,
    latitude: 12.9236,
    longitude: 100.8825,
    address: "999 Jomtien Beach Road",
    district: "Jomtien",
    province: "Chonburi",
    status: "active",
    featured: true,
    views: 456,
    createdAt: "2025-01-05T06:00:00Z",
    updatedAt: "2025-01-22T12:00:00Z",
    project: null,
  },
  {
    id: "6",
    agentPropertyCode: "PW-006",
    propertyType: "Condo",
    listingType: "rent",
    propertyTitleEn: "Riverside Condo with River View",
    propertyTitleTh: "คอนโดริมแม่น้ำ วิวแม่น้ำเจ้าพระยา",
    descriptionEn: "Stunning riverside condo with panoramic Chao Phraya River views. Features modern interior design, fully furnished with premium appliances. Building amenities include infinity pool, gym, and 24-hour security.",
    descriptionTh: "คอนโดหรูริมแม่น้ำเจ้าพระยา วิวพาโนรามา ตกแต่งสไตล์โมเดิร์น เฟอร์นิเจอร์ครบพร้อมเครื่องใช้ไฟฟ้าระดับพรีเมียม สิ่งอำนวยความสะดวกครบครัน สระว่ายน้ำอินฟินิตี้ ฟิตเนส รปภ. 24 ชั่วโมง",
    bedRoomNum: 2,
    bathRoomNum: 2,
    roomSizeNum: 78,
    usableAreaSqm: 78,
    landSizeSqw: null,
    floor: "32",
    building: "River Tower",
    imageUrls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    ],
    rentalRateNum: 45000,
    sellPriceNum: null,
    latitude: 13.7245,
    longitude: 100.5130,
    address: "88 Charoen Nakhon Road",
    district: "Khlong San",
    province: "Chachoengsao",
    status: "active",
    featured: true,
    views: 312,
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-25T14:30:00Z",
    project: {
      projectNameEn: "The River",
      projectNameTh: "เดอะริเวอร์",
    },
  },
  {
    id: "7",
    agentPropertyCode: "PW-007",
    propertyType: "Townhouse",
    listingType: "sale",
    propertyTitleEn: "Modern Townhouse Ladprao",
    propertyTitleTh: "ทาวน์เฮ้าส์โมเดิร์น ลาดพร้าว",
    descriptionEn: "Brand new 3-story townhouse in prime Ladprao location. Modern design with spacious rooms, private parking for 2 cars. Near MRT station and Central Ladprao.",
    descriptionTh: "ทาวน์เฮ้าส์ 3 ชั้น สร้างใหม่ ทำเลดีลาดพร้าว ดีไซน์โมเดิร์น ห้องกว้างขวาง ที่จอดรถ 2 คัน ใกล้ MRT และเซ็นทรัลลาดพร้าว",
    bedRoomNum: 3,
    bathRoomNum: 3,
    roomSizeNum: null,
    usableAreaSqm: 180,
    landSizeSqw: 22,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6c0f1f08e7?w=800",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800",
    ],
    rentalRateNum: null,
    sellPriceNum: 6500000,
    latitude: 13.8167,
    longitude: 100.5617,
    address: "123 Ladprao 71",
    district: "Ladprao",
    province: "Chachoengsao",
    status: "active",
    featured: false,
    views: 145,
    createdAt: "2025-01-20T09:00:00Z",
    updatedAt: "2025-01-26T11:00:00Z",
    project: {
      projectNameEn: "Baan Klang Muang Ladprao",
      projectNameTh: "บ้านกลางเมือง ลาดพร้าว",
    },
  },
  {
    id: "8",
    agentPropertyCode: "PW-008",
    propertyType: "SingleHouse",
    listingType: "both",
    propertyTitleEn: "Luxury House with Pool Ratchaphruek",
    propertyTitleTh: "บ้านหรูพร้อมสระว่ายน้ำ ราชพฤกษ์",
    descriptionEn: "Magnificent luxury house with private swimming pool. Grand living spaces, European-style kitchen, home theater room. Landscaped garden with outdoor entertaining area.",
    descriptionTh: "บ้านหรูพร้อมสระว่ายน้ำส่วนตัว ห้องนั่งเล่นกว้างขวาง ครัวสไตล์ยุโรป ห้องโฮมเธียเตอร์ สวนจัดแต่งสวยงาม พร้อมพื้นที่พักผ่อนกลางแจ้ง",
    bedRoomNum: 5,
    bathRoomNum: 6,
    roomSizeNum: null,
    usableAreaSqm: 450,
    landSizeSqw: 150,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    ],
    rentalRateNum: 150000,
    sellPriceNum: 45000000,
    latitude: 13.8756,
    longitude: 100.4230,
    address: "99 Ratchaphruek Road",
    district: "Taling Chan",
    province: "Chachoengsao",
    status: "active",
    featured: true,
    views: 567,
    createdAt: "2025-01-22T08:00:00Z",
    updatedAt: "2025-01-28T16:00:00Z",
    project: {
      projectNameEn: "Nantawan Ratchaphruek",
      projectNameTh: "นันทวัน ราชพฤกษ์",
    },
  },
  {
    id: "9",
    agentPropertyCode: "PW-009",
    propertyType: "Condo",
    listingType: "rent",
    propertyTitleEn: "Penthouse at Thonglor",
    propertyTitleTh: "เพนท์เฮ้าส์ ทองหล่อ",
    descriptionEn: "Exclusive penthouse with private rooftop terrace. Breathtaking city skyline views, premium finishes throughout. Double-height ceilings in living area.",
    descriptionTh: "เพนท์เฮ้าส์สุดเอ็กซ์คลูซีฟพร้อมดาดฟ้าส่วนตัว วิวสกายไลน์ฉะเชิงเทรา ตกแต่งระดับพรีเมียม เพดานสูงสองเท่าในห้องนั่งเล่น",
    bedRoomNum: 4,
    bathRoomNum: 4,
    roomSizeNum: 280,
    usableAreaSqm: 280,
    landSizeSqw: null,
    floor: "45",
    building: "Penthouse Tower",
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    ],
    rentalRateNum: 250000,
    sellPriceNum: null,
    latitude: 13.7340,
    longitude: 100.5780,
    address: "55 Sukhumvit 55 (Thonglor)",
    district: "Watthana",
    province: "Chachoengsao",
    status: "active",
    featured: true,
    views: 423,
    createdAt: "2025-01-23T11:00:00Z",
    updatedAt: "2025-01-29T09:00:00Z",
    project: {
      projectNameEn: "The Esse at Singha Estate",
      projectNameTh: "ดิ เอส แอท สิงห์ เอสเตท",
    },
  },
  {
    id: "10",
    agentPropertyCode: "PW-010",
    propertyType: "Condo",
    listingType: "sale",
    propertyTitleEn: "Smart Condo Phra Khanong",
    propertyTitleTh: "สมาร์ทคอนโด พระโขนง",
    descriptionEn: "Modern smart-home enabled condo near BTS Phra Khanong. Fully automated lighting, AC, and security systems. Perfect for tech-savvy professionals.",
    descriptionTh: "คอนโดสมาร์ทโฮมใกล้ BTS พระโขนง ระบบไฟ แอร์ และความปลอดภัยอัตโนมัติ เหมาะสำหรับคนรุ่นใหม่",
    bedRoomNum: 1,
    bathRoomNum: 1,
    roomSizeNum: 35,
    usableAreaSqm: 35,
    landSizeSqw: null,
    floor: "18",
    building: "C",
    imageUrls: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    ],
    rentalRateNum: null,
    sellPriceNum: 3800000,
    latitude: 13.7150,
    longitude: 100.5870,
    address: "789 Sukhumvit 71",
    district: "Phra Khanong",
    province: "Chachoengsao",
    status: "active",
    featured: false,
    views: 198,
    createdAt: "2025-01-24T14:00:00Z",
    updatedAt: "2025-01-29T10:00:00Z",
    project: {
      projectNameEn: "Life Sukhumvit 62",
      projectNameTh: "ไลฟ์ สุขุมวิท 62",
    },
  },
  {
    id: "11",
    agentPropertyCode: "PW-011",
    propertyType: "SingleHouse",
    listingType: "rent",
    propertyTitleEn: "Cozy House in Ekamai",
    propertyTitleTh: "บ้านน่ารัก เอกมัย",
    descriptionEn: "Charming single house in quiet Ekamai neighborhood. Renovated with modern amenities while keeping original character. Pet-friendly with fenced garden.",
    descriptionTh: "บ้านเดี่ยวน่ารักในซอยเงียบเอกมัย รีโนเวทใหม่พร้อมสิ่งอำนวยความสะดวกทันสมัย เลี้ยงสัตว์ได้ มีสวนรั้วกั้น",
    bedRoomNum: 3,
    bathRoomNum: 2,
    roomSizeNum: null,
    usableAreaSqm: 200,
    landSizeSqw: 60,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ],
    rentalRateNum: 65000,
    sellPriceNum: null,
    latitude: 13.7290,
    longitude: 100.5830,
    address: "42 Ekamai 12",
    district: "Watthana",
    province: "Chachoengsao",
    status: "active",
    featured: false,
    views: 287,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-29T15:00:00Z",
    project: null,
  },
  {
    id: "12",
    agentPropertyCode: "PW-012",
    propertyType: "Condo",
    listingType: "both",
    propertyTitleEn: "Duplex Loft Ari",
    propertyTitleTh: "ดูเพล็กซ์ลอฟท์ อารีย์",
    descriptionEn: "Unique duplex loft-style condo in trendy Ari area. Industrial-chic design with exposed brick and high ceilings. Walking distance to cafes and restaurants.",
    descriptionTh: "ดูเพล็กซ์สไตล์ลอฟท์ในย่านอารีย์ ดีไซน์อินดัสเทรียล ผนังอิฐโชว์ เพดานสูง เดินถึงร้านกาแฟและร้านอาหาร",
    bedRoomNum: 2,
    bathRoomNum: 2,
    roomSizeNum: 85,
    usableAreaSqm: 85,
    landSizeSqw: null,
    floor: "8-9",
    building: "Loft Building",
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    ],
    rentalRateNum: 38000,
    sellPriceNum: 8500000,
    latitude: 13.7820,
    longitude: 100.5450,
    address: "15 Phahonyothin 7",
    district: "Phaya Thai",
    province: "Chachoengsao",
    status: "active",
    featured: true,
    views: 356,
    createdAt: "2025-01-26T09:00:00Z",
    updatedAt: "2025-01-29T12:00:00Z",
    project: {
      projectNameEn: "Noble Around Ari",
      projectNameTh: "โนเบิล อะราวด์ อารีย์",
    },
  },
  {
    id: "13",
    agentPropertyCode: "PW-013",
    propertyType: "Condo",
    listingType: "sale",
    propertyTitleEn: "Sold: Luxury Condo Sathorn",
    propertyTitleTh: "ขายแล้ว: คอนโดหรู สาทร",
    descriptionEn: "Prestigious condo in the heart of Sathorn business district.",
    descriptionTh: "คอนโดหรูใจกลางย่านธุรกิจสาทร",
    bedRoomNum: 2,
    bathRoomNum: 2,
    roomSizeNum: 85,
    usableAreaSqm: 85,
    landSizeSqw: null,
    floor: "28",
    building: "Tower A",
    imageUrls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    rentalRateNum: null,
    sellPriceNum: 12500000,
    latitude: 13.7210,
    longitude: 100.5290,
    address: "88 Sathorn Road",
    district: "Sathorn",
    province: "Chachoengsao",
    status: "sold",
    featured: false,
    views: 389,
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-27T14:00:00Z",
    project: {
      projectNameEn: "The Met Sathorn",
      projectNameTh: "เดอะ เม็ท สาทร",
    },
  },
  {
    id: "14",
    agentPropertyCode: "PW-014",
    propertyType: "SingleHouse",
    listingType: "sale",
    propertyTitleEn: "Sold: Family House Rama 9",
    propertyTitleTh: "ขายแล้ว: บ้านครอบครัว พระราม 9",
    descriptionEn: "Beautiful family home in a peaceful neighborhood.",
    descriptionTh: "บ้านครอบครัวสวยงามในย่านเงียบสงบ",
    bedRoomNum: 4,
    bathRoomNum: 3,
    roomSizeNum: null,
    usableAreaSqm: 280,
    landSizeSqw: 80,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    ],
    rentalRateNum: null,
    sellPriceNum: 18500000,
    latitude: 13.7570,
    longitude: 100.5650,
    address: "45 Rama 9 Soi 41",
    district: "Huai Khwang",
    province: "Chachoengsao",
    status: "sold",
    featured: false,
    views: 267,
    createdAt: "2025-01-12T11:00:00Z",
    updatedAt: "2025-01-26T16:00:00Z",
    project: {
      projectNameEn: "Grand Bangkok Boulevard",
      projectNameTh: "แกรนด์ บางกอก บูเลอวาร์ด",
    },
  },
  {
    id: "15",
    agentPropertyCode: "PW-015",
    propertyType: "Condo",
    listingType: "rent",
    propertyTitleEn: "Rented: Modern Loft Silom",
    propertyTitleTh: "เช่าแล้ว: ลอฟท์โมเดิร์น สีลม",
    descriptionEn: "Stylish loft apartment in Silom business district.",
    descriptionTh: "อพาร์ทเมนท์ลอฟท์สไตล์โมเดิร์นในย่านธุรกิจสีลม",
    bedRoomNum: 1,
    bathRoomNum: 1,
    roomSizeNum: 45,
    usableAreaSqm: 45,
    landSizeSqw: null,
    floor: "22",
    building: "Silom Tower",
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    ],
    rentalRateNum: 28000,
    sellPriceNum: null,
    latitude: 13.7280,
    longitude: 100.5350,
    address: "123 Silom Road",
    district: "Silom",
    province: "Chachoengsao",
    status: "rented",
    featured: false,
    views: 312,
    createdAt: "2025-01-14T08:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    project: {
      projectNameEn: "Silom Edge",
      projectNameTh: "สีลม เอดจ์",
    },
  },
  {
    id: "16",
    agentPropertyCode: "PW-016",
    propertyType: "Townhouse",
    listingType: "sale",
    propertyTitleEn: "Sold: Corner Townhouse Onnut",
    propertyTitleTh: "ขายแล้ว: ทาวน์เฮ้าส์มุม อ่อนนุช",
    descriptionEn: "Spacious corner townhouse with extra garden space.",
    descriptionTh: "ทาวน์เฮ้าส์มุมกว้างขวางพร้อมพื้นที่สวนเพิ่มเติม",
    bedRoomNum: 3,
    bathRoomNum: 3,
    roomSizeNum: null,
    usableAreaSqm: 170,
    landSizeSqw: 28,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6c0f1f08e7?w=800",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800",
    ],
    rentalRateNum: null,
    sellPriceNum: 5200000,
    latitude: 13.7050,
    longitude: 100.6010,
    address: "89 Onnut 17",
    district: "Suan Luang",
    province: "Chachoengsao",
    status: "sold",
    featured: false,
    views: 198,
    createdAt: "2025-01-16T10:00:00Z",
    updatedAt: "2025-01-24T12:00:00Z",
    project: {
      projectNameEn: "Baan Klang Muang Onnut",
      projectNameTh: "บ้านกลางเมือง อ่อนนุช",
    },
  },
  {
    id: "17",
    agentPropertyCode: "PW-017",
    propertyType: "Condo",
    listingType: "rent",
    propertyTitleEn: "Rented: Studio near MRT",
    propertyTitleTh: "เช่าแล้ว: สตูดิโอใกล้ MRT",
    descriptionEn: "Cozy studio just steps from MRT Phetchaburi station.",
    descriptionTh: "สตูดิโออบอุ่นใกล้ MRT เพชรบุรี",
    bedRoomNum: 1,
    bathRoomNum: 1,
    roomSizeNum: 28,
    usableAreaSqm: 28,
    landSizeSqw: null,
    floor: "12",
    building: "B",
    imageUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    rentalRateNum: 15000,
    sellPriceNum: null,
    latitude: 13.7480,
    longitude: 100.5580,
    address: "55 Phetchaburi Road",
    district: "Ratchathewi",
    province: "Chachoengsao",
    status: "rented",
    featured: false,
    views: 145,
    createdAt: "2025-01-18T14:00:00Z",
    updatedAt: "2025-01-23T09:00:00Z",
    project: {
      projectNameEn: "Rhythm Phetchaburi",
      projectNameTh: "ริธึ่ม เพชรบุรี",
    },
  },
];

// Helper functions
export function getProperties() {
  return properties;
}

export function getPropertyById(id: string) {
  return properties.find((p) => p.id === id);
}

export function createProperty(data: Omit<Property, "id" | "createdAt" | "updatedAt" | "views">) {
  const newProperty: Property = {
    ...data,
    id: String(Date.now()),
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  properties.push(newProperty);
  return newProperty;
}

export function updateProperty(id: string, data: Partial<Property>) {
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return null;

  properties[index] = {
    ...properties[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return properties[index];
}

export function deleteProperty(id: string) {
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return false;

  properties.splice(index, 1);
  return true;
}

export function getDashboardStats() {
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === "active").length;
  const rentedProperties = properties.filter((p) => p.status === "rented").length;
  const soldProperties = properties.filter((p) => p.status === "sold").length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const forRent = properties.filter((p) => p.listingType === "rent" || p.listingType === "both").length;
  const forSale = properties.filter((p) => p.listingType === "sale" || p.listingType === "both").length;
  const featured = properties.filter((p) => p.featured).length;

  return {
    totalProperties,
    activeProperties,
    rentedProperties,
    soldProperties,
    totalViews,
    forRent,
    forSale,
    featured,
  };
}

// Get popular properties sorted by views
export function getPopularProperties(limit: number = 10) {
  return [...properties]
    .filter((p) => p.status === "active")
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Get closed deals (sold or rented properties)
export function getClosedDeals(limit: number = 8) {
  return [...properties]
    .filter((p) => p.status === "sold" || p.status === "rented")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

// Get all unique locations (districts)
export function getLocations() {
  const locationMap = new Map<string, { count: number; image: string }>();

  properties.forEach((p) => {
    if (p.district) {
      const existing = locationMap.get(p.district);
      if (existing) {
        existing.count++;
      } else {
        locationMap.set(p.district, {
          count: 1,
          image: p.imageUrls[0] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        });
      }
    }
  });

  return Array.from(locationMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    image: data.image,
  }));
}
