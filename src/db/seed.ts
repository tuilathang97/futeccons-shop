import { categoriesTable } from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

// Initialize the database connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

// Categories seed data
const categoryData = [
  // ===== LEVEL 1: BÁN NHÀ =====
  { name: "Bán nhà", parentId: null, level: 1 as const, slug: "/ban-nha", path: "/ban-nha" },
  
  // ===== LEVEL 2 under "Bán nhà" =====
  { name: "Nhà đất", parentId: 1, level: 2 as const, slug: "/nha-dat", path: "/ban-nha/nha-dat" },
  { name: "Chung cư", parentId: 1, level: 2 as const, slug: "/chung-cu", path: "/ban-nha/chung-cu" },
  
  // ===== LEVEL 3 under "Nhà đất" =====
  { name: "Nhà cấp 4", parentId: 2, level: 3 as const, slug: "/nha-cap-4", path: "/ban-nha/nha-dat/nha-cap-4" },
  { name: "Nhà hẻm", parentId: 2, level: 3 as const, slug: "/nha-hem", path: "/ban-nha/nha-dat/nha-hem" },
  { name: "Nhà mặt tiền", parentId: 2, level: 3 as const, slug: "/nha-mat-tien", path: "/ban-nha/nha-dat/nha-mat-tien" },
  { name: "Nhà phố thương mại", parentId: 2, level: 3 as const, slug: "/nha-pho-thuong-mai", path: "/ban-nha/nha-dat/nha-pho-thuong-mai" },
  { name: "Biệt thự", parentId: 2, level: 3 as const, slug: "/biet-thu", path: "/ban-nha/nha-dat/biet-thu" },
  { name: "Nhà phố", parentId: 2, level: 3 as const, slug: "/nha-pho", path: "/ban-nha/nha-dat/nha-pho" },
  { name: "Đất nền", parentId: 2, level: 3 as const, slug: "/dat-nen", path: "/ban-nha/nha-dat/dat-nen" },
  { name: "Văn phòng", parentId: 2, level: 3 as const, slug: "/van-phong", path: "/ban-nha/nha-dat/van-phong" },
  
  // ===== LEVEL 3 under "Chung cư" =====
  { name: "Chung cư cao cấp", parentId: 3, level: 3 as const, slug: "/chung-cu-cao-cap", path: "/ban-nha/chung-cu/chung-cu-cao-cap" },
  { name: "Chung cư giá rẻ", parentId: 3, level: 3 as const, slug: "/chung-cu-gia-re", path: "/ban-nha/chung-cu/chung-cu-gia-re" },
    
  // ===== LEVEL 1: CHO THUÊ =====
  { name: "Cho thuê", parentId: null, level: 1 as const, slug: "/cho-thue", path: "/cho-thue" },
  
  // ===== LEVEL 2 under "Cho thuê" =====
  { name: "Nhà đất", parentId: 22, level: 2 as const, slug: "/nha-dat", path: "/cho-thue/nha-dat" },
  { name: "Chung cư", parentId: 22, level: 2 as const, slug: "/chung-cu", path: "/cho-thue/chung-cu" },
  
  // ===== LEVEL 3 under "Cho thuê -> Nhà đất" =====
  { name: "Nhà mặt tiền", parentId: 23, level: 3 as const, slug: "/nha-mat-tien", path: "/cho-thue/nha-dat/nha-mat-tien" },
  { name: "Nhà phố", parentId: 23, level: 3 as const, slug: "/nha-pho", path: "/cho-thue/nha-dat/nha-pho" },
  { name: "Biệt thự", parentId: 23, level: 3 as const, slug: "/biet-thu", path: "/cho-thue/nha-dat/biet-thu" },
  { name: "Văn phòng", parentId: 23, level: 3 as const, slug: "/van-phong", path: "/cho-thue/nha-dat/van-phong" },
  { name: "Mặt bằng", parentId: 23, level: 3 as const, slug: "/mat-bang", path: "/cho-thue/nha-dat/mat-bang" },
  { name: "Phòng trọ", parentId: 23, level: 3 as const, slug: "/phong-tro", path: "/cho-thue/nha-dat/phong-tro" },
  
  // ===== LEVEL 3 under "Cho thuê -> Chung cư" =====
  { name: "Chung cư mini", parentId: 24, level: 3 as const, slug: "/chung-cu-mini", path: "/cho-thue/chung-cu/chung-cu-mini" },
  { name: "Chung cư cao cấp", parentId: 24, level: 3 as const, slug: "/chung-cu-cao-cap", path: "/cho-thue/chung-cu/chung-cu-cao-cap" },
  { name: "Duplex", parentId: 24, level: 3 as const, slug: "/duplex", path: "/cho-thue/chung-cu/duplex" },
      
  // ===== LEVEL 1: Tất cả bài viết =====
  { name: "Tất cả bài viết", parentId: null, level: 1 as const, slug: "/tim-kiem-theo-tu-khoa", path: "/tim-kiem-theo-tu-khoa" },
];

async function seed() {
  try {
    console.log('Seeding categories...');
    
    // Clear existing categories first (optional)
    // await db.delete(categoriesTable);
    
    // Insert new categories in batches
    const BATCH_SIZE = 10;
    for (let i = 0; i < categoryData.length; i += BATCH_SIZE) {
      const batch = categoryData.slice(i, i + BATCH_SIZE);
      await db.insert(categoriesTable).values(batch);
      console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
    }
    
    console.log('Categories seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await client.end();
  }
}

// Run the seed function
seed(); 