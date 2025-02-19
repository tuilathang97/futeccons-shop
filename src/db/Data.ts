export interface RealEstateCardProps {
    title: string;
    address: string;
    id: string;
    description: string;
    price: string;
    area: string;
    bedrooms: number;
    bathrooms: number;
    imageUrl: string;
    variant?:"vertical" | "horizontal"
    badge?:"Nổi bật" | "Tin thường" | "Vip1" | "Vip2" | "Vip3"
}

export const postsData: RealEstateCardProps[] = [
    {
        title: "Nhà mặt tiền Quận 1",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        id: "1",
        description: "Nhà đẹp, vị trí đắc địa, thuận tiện kinh doanh.",
        price: "100 triệu/tháng",
        area: "120 m²",
        bedrooms: 4,
        bathrooms: 3,
        imageUrl: "/lorem.png",
        badge:"Tin thường"
    },
    {
        title: "Căn hộ cao cấp Quận 2",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        id: "2",
        description: "Căn hộ đầy đủ tiện nghi, nội thất hiện đại.",
        price: "20 triệu/tháng",
        area: "80 m²",
        bedrooms: 2,
        bathrooms: 2,
        imageUrl: "/lorem.png",
        badge:"Tin thường"
    },
    {
        title: "Biệt thự sân vườn Quận 7",
        address: "789 Đường DEF, Quận 7, TP.HCM",
        id: "3",
        description: "Biệt thự thoáng mát, có hồ bơi và sân vườn.",
        price: "150 triệu/tháng",
        area: "300 m²",
        bedrooms: 5,
        bathrooms: 4,
        imageUrl: "/lorem.png",
        badge:"Tin thường"
    },
    {
        title: "Nhà phố Quận 5",
        address: "101 Đường GHI, Quận 5, TP.HCM",
        id: "4",
        description: "Nhà phố tiện nghi, gần chợ và trường học.",
        price: "50 triệu/tháng",
        area: "100 m²",
        bedrooms: 3,
        bathrooms: 2,
        imageUrl: "/lorem.png",
        badge:"Nổi bật"
    },
    {
        title: "Căn hộ view sông Quận 4",
        address: "202 Đường JKL, Quận 4, TP.HCM",
        id: "5",
        description: "Căn hộ view sông, không gian thoáng đãng.",
        price: "25 triệu/tháng",
        area: "85 m²",
        bedrooms: 2,
        bathrooms: 2,
        imageUrl: "/lorem.png",
        badge:"Vip1"
    },
    {
        title: "Nhà mặt tiền Quận Bình Thạnh",
        address: "303 Đường MNO, Bình Thạnh, TP.HCM",
        id: "6",
        description: "Nhà mặt tiền, tiện kinh doanh và làm văn phòng.",
        price: "120 triệu/tháng",
        area: "150 m²",
        bedrooms: 4,
        bathrooms: 3,
        imageUrl: "/lorem.png",
        badge:"Vip2"
    },
    {
        title: "Căn hộ mini Quận 10",
        address: "404 Đường PQR, Quận 10, TP.HCM",
        id: "7",
        description: "Căn hộ mini dành cho người độc thân.",
        price: "10 triệu/tháng",
        area: "40 m²",
        bedrooms: 1,
        bathrooms: 1,
        imageUrl: "/lorem.png",
        badge:"Vip3"
    },
    {
        title: "Biệt thự nghỉ dưỡng Quận 9",
        address: "505 Đường STU, Quận 9, TP.HCM",
        id: "8",
        description: "Biệt thự nghỉ dưỡng có sân vườn rộng.",
        price: "200 triệu/tháng",
        area: "400 m²",
        bedrooms: 6,
        bathrooms: 5,
        imageUrl: "/lorem.png",
        badge:"Vip1"
    },
    {
        title: "Nhà cấp 4 Quận Tân Bình",
        address: "606 Đường VWX, Tân Bình, TP.HCM",
        id: "9",
        description: "Nhà cấp 4, giá rẻ, vị trí trung tâm.",
        price: "15 triệu/tháng",
        area: "60 m²",
        bedrooms: 2,
        bathrooms: 1,
        imageUrl: "/lorem.png",
        badge:"Vip1"
    }
];
