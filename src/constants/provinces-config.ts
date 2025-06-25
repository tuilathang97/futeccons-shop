// Cache provinces data to avoid re-reading file system on every request
export const POPULAR_PROVINCES = [
  'Thành phố Hà Nội', 
  'Thành phố Hồ Chí Minh', 
  'Thành phố Hải Phòng', 
  'Thành phố Huế', 
  'Thành phố Đà Nẵng', 
  'Tỉnh Khánh Hòa', 
  'Tỉnh Ninh Thuận', 
  'Tỉnh Quảng Ninh'
];

export const PROVINCE_IMAGES = [
  "/images/provinceImages/hanoi.webp",
  "/images/provinceImages/quangNinh.webp", 
  "/images/provinceImages/haiphong.webp",
  "/images/provinceImages/hue.webp",
  "/images/provinceImages/daNang.webp",
  "/images/provinceImages/khanhHoa.webp",
  "/images/provinceImages/ninhThuan.webp",
  "/images/provinceImages/hoChiMinh.webp",
];

// Base64 placeholder for image loading
export const IMAGE_PLACEHOLDER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="; 