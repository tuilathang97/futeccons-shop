import { seed } from "drizzle-seed";
import db from ".";
import { postsTable } from "../schema";

async function main() {
    await seed(db, { posts: postsTable }).refine((f) => ({
        posts: {
            columns: {
                userId: f.uuid(),  // Generate a UUID for userId
                level1_category: f.string(),  // No length limit
                level2_category: f.string(),  // No length limit
                level3_category: f.string(),  // No length limit
                thanh_pho: f.city(),  // Generate a city name
                thanh_pho_code_name: f.string(),  // Generate a slug
                quan: f.string(),  // No length limit
                quan_code_name: f.string(),  // Generate a slug
                phuong: f.string(),  // No length limit
                phuong_code_name: f.string(),  // Generate a slug
                duong: f.string(),  // No length limit
                gia_tien: f.number(),
                dien_tich_dat: f.string(),  // No length limit
                so_tang: f.number(),
                so_phong_ngu: f.number(),
                so_phong_ve_sinh: f.number(),
                giay_to_phap_ly: f.string(),  // No length limit
                loai_hinh_nha_o: f.string(),  // No length limit
                noi_dung: f.string(),  // Generate random text
                created_at: f.date(),  // Automatically generate date
                updated_at: f.date(),  // Automatically generate date
            },
            count: 20  // Number of records to create
        }
    }));
}

main();
