import { z } from "zod";

export const PostSchema = z.object({
  active: z.boolean().default(true),
  level1Category: z.string().min(1,{message: "Vui lòng loại giao dịch"} ),
  level2Category: z.string().min(1,{message: "Vui lòng loại bất động sản"} ),
  level3Category: z.string().min(1,{message: "Vui lòng kiểu bất động sản"} ),
  path: z.string(),
  giaTien: z.number().min(50000000).max(100000000000),
  duong: z.string(),
  phuong: z.string(),
  quan: z.string(),
  thanhPho: z.string(),
  loaiHinhNhaO: z.string(),
  dienTichDat: z.number().min(10).max(1000),
  soTang: z.number().min(1, {message: "Vui lòng nhập số tầng"}).max(20),
  soPhongNgu: z.number().min(1, {message: "Vui lòng nhập số phòng ngủ"}),
  soPhongVeSinh: z.number().min(1, {message: "Vui lòng nhập số phòng vệ sinh"}),
  giayToPhapLy: z.string().min(1, {message: "Vui lòng nhập giấy tờ pháp lý"}),
  noiDung: z.string().min(50, {message: "Bài viết phải có ít nhất 50 kí tự"}),
})

export type Post = z.infer<typeof PostSchema> & {id: string};