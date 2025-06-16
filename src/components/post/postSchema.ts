import { z } from "zod";


export const PostSchema = z.object({
  active: z.boolean().default(false),
  level1Category: z.string().min(1,{message: "Vui lòng loại giao dịch"} ),
  level2Category: z.string().min(1,{message: "Vui lòng loại bất động sản"} ),
  level3Category: z.string().min(1,{message: "Vui lòng kiểu bất động sản"} ),
  path: z.string().optional(),
  giaTien: z.number({message: "Vui lòng nhập giá tiền"}).min(10000000,{message: "Giá tiền quá thấp"}).max(1000000000000000,{message: "Giá tiền quá cao"}),
  duong: z.string().min(5,{message: "Vui lòng nhập tên đường"}),
  phuong: z.string().min(1,{message: "Vui lòng nhập phường ( phải nhập quận trước )"}),
  quan: z.string().min(1,{message: "Vui lòng nhập tên quận ( phải nhập tp trước )"}),
  thanhPho: z.string().min(1,{message: "Vui lòng nhập tên thành phố"}),
  userId:z.string().optional(),
  phuongCodeName: z.string().min(1).optional(),
  quanCodeName: z.string().min(1).optional(),
  thanhPhoCodeName: z.string().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  tieuDeBaiViet:z.string().min(1,{message:"Vui lòng nhập tiêu đề cho bài viết"}),
  loaiHinhNhaO: z.string().min(1,{message:"Loại hình nhà ở là bắt buộc"}),
  dienTichDat: z.number().min(10,{message:"Diện tích đất quá nhỏ"}).max(1000000,{message:"Diện tích đất quá lớn so với hạn mức"}),
  dienTichSuDung: z.number().min(10,{message:"Diện tích sử dụng quá nhỏ"}).max(1000000,{message:"Diện tích sử dụng quá lớn"}).optional(),
  soTang: z.number({message: "Vui lòng nhập số tầng"}).max(20).optional(),
  soPhongNgu: z.number().min(1,{message: "Vui lòng nhập số phòng ngủ"}),
  soPhongVeSinh: z.number().min(1,{message:"Ít nhất phải có 1 nhà vệ sinh"}),
  giayToPhapLy: z.string().min(1, {message: "Vui lòng nhập giấy tờ pháp lý"}),
  noiDung: z.string().min(30, {message: "Nội dung quá ngắn"}).max(1000000,{message:"Nội dung quá dài"}),
  huongCuaChinh: z.enum(["Đông", "Tây", "Nam", "Bắc", "Đông Bắc", "Đông Nam", "Tây Bắc", "Tây Nam"], {message: "Vui lòng chọn hướng"}),
  chieuNgang: z.number().min(1,{message:"Vui lòng nhập chiều ngang hợp lệ "}).max(500,{message:"Chiều ngang quá lớn"}),
  chieuDai: z.number().min(1,{message:"Vui lòng nhập chiều dài hợp lệ "}).max(500,{message:"Chiều dài quá lớn"}),
})

export type Post = z.infer<typeof PostSchema> & {id: string};