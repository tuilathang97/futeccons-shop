import { postsTable } from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

// Initialize the database connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

// Sample user IDs
const userIds = [
  "user_1",
  "user_2",
  "user_3",
  "user_4",
  "user_5"
];

// Sample location data
const locations = [
  {
    thanhPho: "Hồ Chí Minh",
    thanhPhoCodeName: "ho-chi-minh",
    quan: [
      { name: "Quận 1", codeName: "quan-1", phuong: [{ name: "Phường Bến Nghé", codeName: "phuong-ben-nghe" }, { name: "Phường Bến Thành", codeName: "phuong-ben-thanh" }] },
      { name: "Quận 2", codeName: "quan-2", phuong: [{ name: "Phường Thảo Điền", codeName: "phuong-thao-dien" }, { name: "Phường An Phú", codeName: "phuong-an-phu" }] },
      { name: "Quận 7", codeName: "quan-7", phuong: [{ name: "Phường Tân Phú", codeName: "phuong-tan-phu" }, { name: "Phường Tân Thuận Đông", codeName: "phuong-tan-thuan-dong" }] },
    ]
  },
  {
    thanhPho: "Hà Nội",
    thanhPhoCodeName: "ha-noi",
    quan: [
      { name: "Quận Ba Đình", codeName: "quan-ba-dinh", phuong: [{ name: "Phường Trúc Bạch", codeName: "phuong-truc-bach" }, { name: "Phường Vĩnh Phúc", codeName: "phuong-vinh-phuc" }] },
      { name: "Quận Hoàn Kiếm", codeName: "quan-hoan-kiem", phuong: [{ name: "Phường Hàng Trống", codeName: "phuong-hang-trong" }, { name: "Phường Hàng Bạc", codeName: "phuong-hang-bac" }] },
      { name: "Quận Tây Hồ", codeName: "quan-tay-ho", phuong: [{ name: "Phường Quảng An", codeName: "phuong-quang-an" }, { name: "Phường Xuân La", codeName: "phuong-xuan-la" }] },
    ]
  },
  {
    thanhPho: "Đà Nẵng",
    thanhPhoCodeName: "da-nang",
    quan: [
      { name: "Quận Hải Châu", codeName: "quan-hai-chau", phuong: [{ name: "Phường Thanh Bình", codeName: "phuong-thanh-binh" }, { name: "Phường Hải Châu I", codeName: "phuong-hai-chau-i" }] },
      { name: "Quận Sơn Trà", codeName: "quan-son-tra", phuong: [{ name: "Phường An Hải Bắc", codeName: "phuong-an-hai-bac" }, { name: "Phường Mân Thái", codeName: "phuong-man-thai" }] },
    ]
  }
];

// Sample street names
const streetNames = [
  "Đường Lê Lợi", "Đường Nguyễn Huệ", "Đường Trần Hưng Đạo", "Đường Hai Bà Trưng", 
  "Đường Lê Duẩn", "Đường Nguyễn Thị Minh Khai", "Đường Điện Biên Phủ", "Đường Nam Kỳ Khởi Nghĩa",
  "Đường Trần Phú", "Đường Võ Văn Tần", "Đường Phan Xích Long", "Đường Lê Văn Sỹ",
  "Đường Bạch Đằng", "Đường Ngô Quyền", "Đường Phan Đình Phùng", "Đường Hoàng Diệu"
];

// Post title templates by category type
type CategoryTitleType = "nhaDat" | "chungCu" | "bietThu" | "choThueNha" | "choThueChungCu" | "duAnCanHo" | "duAnDatNen";

// Sample post titles by category
const postTitleTemplates: Record<CategoryTitleType, string[]> = {
  // Bán nhà > Nhà đất (level1:1, level2:2)
  "nhaDat": [
    "Bán nhà {location}, {features}, giá {price} tỷ",
    "Cần bán gấp nhà {location}, {area}m², sổ hồng chính chủ",
    "Chính chủ bán nhà {location}, {rooms} phòng ngủ, {bathrooms} WC",
    "Nhà đẹp {location}, hẻm xe hơi, giá chỉ {price} tỷ",
  ],
  
  // Bán nhà > Chung cư (level1:1, level2:3)
  "chungCu": [
    "Bán căn hộ chung cư {location}, {area}m², view đẹp",
    "Căn hộ {rooms} phòng ngủ tại {location}, nội thất cao cấp",
    "Bán gấp căn hộ {location}, giá {price} tỷ, sổ hồng sẵn sàng",
    "Căn hộ chung cư {location}, {area}m², {rooms}PN, tầng cao view đẹp",
  ],
  
  // Bán nhà > Biệt thự (level1:1, level2:4)
  "bietThu": [
    "Biệt thự đẳng cấp {location}, {area}m², thiết kế hiện đại",
    "Bán biệt thự sân vườn {location}, {rooms} phòng ngủ, hồ bơi riêng",
    "Biệt thự {location}, {area}m², nội thất cao cấp, an ninh 24/7",
    "Biệt thự liền kề {location}, {rooms}PN, {bathrooms}WC, giá {price} tỷ",
  ],
  
  // Cho thuê > Nhà đất (level1:22, level2:23)
  "choThueNha": [
    "Cho thuê nhà nguyên căn {location}, {area}m², giá {price} triệu/tháng",
    "Nhà cho thuê {location}, {rooms} phòng ngủ, full nội thất",
    "Cho thuê nhà mặt tiền {location}, kinh doanh tốt",
    "Nhà cho thuê hẻm xe hơi {location}, {area}m², {rooms}PN",
  ],
  
  // Cho thuê > Chung cư (level1:22, level2:24)
  "choThueChungCu": [
    "Cho thuê căn hộ {location}, {area}m², đầy đủ nội thất",
    "Căn hộ dịch vụ {location}, {rooms}PN, {price} triệu/tháng",
    "Cho thuê chung cư cao cấp {location}, view đẹp, giá tốt",
    "Căn hộ cho thuê {location}, {rooms}PN, {bathrooms}WC, nội thất cao cấp",
  ],
  
  // Dự án > Căn hộ (level1:36, level2:37)
  "duAnCanHo": [
    "Mở bán dự án căn hộ {location}, giá từ {price} tỷ/căn",
    "Đặt chỗ căn hộ cao cấp {location}, chiết khấu lên đến 10%",
    "Dự án căn hộ {location}, thanh toán 30% nhận nhà",
    "Căn hộ đầu tư sinh lời cao {location}, {rooms}PN từ {price} tỷ",
  ],
  
  // Dự án > Đất nền (level1:36, level2:38)
  "duAnDatNen": [
    "Đất nền dự án {location}, sổ đỏ trao tay, giá chỉ {price} triệu/m²",
    "Mở bán đất nền {location}, vị trí đắc địa, sinh lời cao",
    "Đầu tư đất nền {location}, cơ hội sinh lời 200%",
    "Đất nền phân lô {location}, đã có sổ, xây tự do",
  ]
};

// Sample post contents
const postContents = [
  `Thông tin chi tiết:
- Diện tích: {area}m²
- Kết cấu: {floors} tầng, {rooms} phòng ngủ, {bathrooms} nhà vệ sinh
- Pháp lý: {legalStatus}
- Hướng nhà: {direction}

Vị trí đắc địa, giao thông thuận tiện, gần trường học, bệnh viện, siêu thị. Nhà thiết kế hiện đại, không gian thoáng mát. Liên hệ ngay để xem nhà!`,

  `Bán {propertyType} tại {location}:
- Diện tích: {area}m²
- Gồm {rooms} phòng ngủ, {bathrooms} WC
- {floors} tầng kiên cố
- {legalStatus}

Nhà gần các tiện ích công cộng, khu vực an ninh, dân trí cao. Giá có thương lượng cho khách thiện chí. Liên hệ để được tư vấn chi tiết và xem nhà trực tiếp.`,

  `THÔNG TIN CHI TIẾT:
Diện tích: {area}m²
Kết cấu: {floors} tầng, {rooms} phòng ngủ, {bathrooms} phòng vệ sinh
Pháp lý: {legalStatus}

ƯU ĐIỂM:
- Vị trí đẹp, thuận tiện di chuyển
- Thiết kế hiện đại, nội thất cao cấp
- An ninh 24/7, môi trường sống văn minh
- Gần trường học, chợ, bệnh viện

Liên hệ ngay hôm nay để được tư vấn!`,

  `MÔ TẢ BẤT ĐỘNG SẢN:
* Diện tích đất: {area}m²
* Diện tích sử dụng: {usableArea}m²
* Số tầng: {floors}
* Số phòng ngủ: {rooms}
* Số phòng vệ sinh: {bathrooms}
* Pháp lý: {legalStatus}

Nhà thiết kế hiện đại, nội thất sang trọng, không gian sống thoáng đãng. Khu vực an ninh, yên tĩnh, lý tưởng cho gia đình. Giá có thương lượng.`
];

// Generate random posts linked to categories
function generatePosts(count = 30) {
  const posts = [];
  
  for (let i = 0; i < count; i++) {
    // Choose random location
    const location = locations[Math.floor(Math.random() * locations.length)];
    const quan = location.quan[Math.floor(Math.random() * location.quan.length)];
    const phuong = quan.phuong[Math.floor(Math.random() * quan.phuong.length)];
    const duong = streetNames[Math.floor(Math.random() * streetNames.length)];
    
    // Generate random property details
    const area = Math.floor(Math.random() * 150) + 50; // 50-200m²
    const usableArea = Math.floor(area * 0.8);
    const floors = Math.floor(Math.random() * 4) + 1; // 1-4 floors
    const rooms = Math.floor(Math.random() * 3) + 1; // 1-3 rooms
    const bathrooms = Math.floor(Math.random() * 2) + 1; // 1-2 bathrooms
    const price = Math.floor(Math.random() * 10) + 1; // 1-10 billion
    
    // Choose random category combination
    const categoryTypes = [
      { level1: 1, level2: 2, level3: Math.floor(Math.random() * 4) + 8, titleType: "nhaDat" as CategoryTitleType, propertyType: "nhà đất" }, // Bán nhà > Nhà đất
      { level1: 1, level2: 3, level3: Math.floor(Math.random() * 4) + 12, titleType: "chungCu" as CategoryTitleType, propertyType: "căn hộ chung cư" }, // Bán nhà > Chung cư
      { level1: 1, level2: 4, level3: Math.floor(Math.random() * 3) + 16, titleType: "bietThu" as CategoryTitleType, propertyType: "biệt thự" }, // Bán nhà > Biệt thự
      { level1: 22, level2: 23, level3: Math.floor(Math.random() * 3) + 28, titleType: "choThueNha" as CategoryTitleType, propertyType: "nhà cho thuê" }, // Cho thuê > Nhà đất
      { level1: 22, level2: 24, level3: Math.floor(Math.random() * 3) + 31, titleType: "choThueChungCu" as CategoryTitleType, propertyType: "căn hộ cho thuê" }, // Cho thuê > Chung cư
      { level1: 36, level2: 37, level3: Math.floor(Math.random() * 3) + 41, titleType: "duAnCanHo" as CategoryTitleType, propertyType: "căn hộ dự án" }, // Dự án > Căn hộ
      { level1: 36, level2: 38, level3: Math.floor(Math.random() * 2) + 44, titleType: "duAnDatNen" as CategoryTitleType, propertyType: "đất nền dự án" }, // Dự án > Đất nền
    ];
    
    const category = categoryTypes[Math.floor(Math.random() * categoryTypes.length)];
    
    // Legal status options
    const legalStatusOptions = ["Sổ hồng chính chủ", "Sổ đỏ", "HĐMB", "Đã có sổ", "Sổ hồng riêng"];
    const legalStatus = legalStatusOptions[Math.floor(Math.random() * legalStatusOptions.length)];
    
    // House type options
    const houseTypeOptions = ["Nhà phố", "Nhà mặt tiền", "Nhà hẻm", "Nhà biệt lập"];
    const houseType = houseTypeOptions[Math.floor(Math.random() * houseTypeOptions.length)];
    
    // Direction options
    const directionOptions = ["Đông", "Tây", "Nam", "Bắc", "Đông Nam", "Đông Bắc", "Tây Nam", "Tây Bắc"];
    const direction = directionOptions[Math.floor(Math.random() * directionOptions.length)];
    
    // Select title template and populate
    const titleTemplates = postTitleTemplates[category.titleType];
    let title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    title = title.replace("{location}", `${quan.name}, ${location.thanhPho}`)
                .replace("{area}", area.toString())
                .replace("{rooms}", rooms.toString())
                .replace("{bathrooms}", bathrooms.toString())
                .replace("{price}", price.toString());
    
    // Select content template and populate
    let content = postContents[Math.floor(Math.random() * postContents.length)];
    content = content.replace(/{area}/g, area.toString())
                    .replace(/{usableArea}/g, usableArea.toString())
                    .replace(/{floors}/g, floors.toString())
                    .replace(/{rooms}/g, rooms.toString())
                    .replace(/{bathrooms}/g, bathrooms.toString())
                    .replace(/{legalStatus}/g, legalStatus)
                    .replace(/{direction}/g, direction)
                    .replace(/{propertyType}/g, category.propertyType)
                    .replace(/{location}/g, `${quan.name}, ${location.thanhPho}`);
    
    // Create a timestamp for createdAt and updatedAt
    const now = new Date();
    
    // Create post object - converting numeric values to strings where needed for schema
    posts.push({
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      active: Math.random() > 0.2, // 80% chance of being active
      level1Category: category.level1,
      level2Category: category.level2,
      level3Category: category.level3,
      path: `${i + 1}`,
      thanhPho: location.thanhPho,
      thanhPhoCodeName: location.thanhPhoCodeName,
      quan: quan.name,
      quanCodeName: quan.codeName,
      phuong: phuong.name,
      phuongCodeName: phuong.codeName,
      duong: duong,
      tieuDeBaiViet: title,
      giaTien: `${price * 1000000000}`, // Convert to VND (billion) as string
      dienTichDat: `${area}`, // Convert to string
      soTang: floors,
      soPhongNgu: rooms,
      soPhongVeSinh: bathrooms,
      giayToPhapLy: legalStatus,
      loaiHinhNhaO: houseType,
      noiDung: content,
      createdAt: now,
      updatedAt: now
    });
  }
  
  return posts;
}

async function seed() {
  try {
    console.log('Generating post data...');
    const posts = generatePosts(30);
    
    console.log('Seeding posts...');
    
    // Clear existing posts first (optional)
    // await db.delete(postsTable);
    
    // Insert posts in batches
    const BATCH_SIZE = 5;
    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch = posts.slice(i, i + BATCH_SIZE);
      await db.insert(postsTable).values(batch);
      console.log(`Inserted batch ${i / BATCH_SIZE + 1} of ${Math.ceil(posts.length / BATCH_SIZE)}`);
    }
    
    console.log(`Posts seeding completed successfully! Total: ${posts.length} posts`);
  } catch (error) {
    console.error('Error seeding posts:', error);
  } finally {
    await client.end();
  }
}

// Run the seed function
seed(); 