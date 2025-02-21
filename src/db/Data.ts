type MediaType = 'image' | 'youtube';
export interface MediaItem {
    type: MediaType;
    url?: string;
    alt?: string;
    thumbnail?: string;
    videoId?: string;
}

export interface RealEstateCardProps {
    title: string;
    address: string;
    id: string;
    description: string;
    price: string;
    area?: string;
    bedrooms?: number;
    bathrooms?: number;
    kindOfEstate?: string;
    // loại hình nhà ở
    datePost: string;
    floor?: number;
    legalPaper?: string;
    // giấy tờ pháp lý
    mainDir?: string;
    // hướng cửa chính
    mediaItems: MediaItem[];
    variant?: "vertical" | "horizontal"
    badge?: "Nổi bật" | "Tin thường" | "Vip1" | "Vip2" | "Vip3"
}

export const postsData: RealEstateCardProps[] = [
    {
        id: "BDS001",
        title: "Căn hộ Vinhomes Central Park",
        address: "208 Nguyễn Hữu Cảnh, P.22, Bình Thạnh, TP.HCM",
        description: "Căn hộ cao cấp 3PN, view sông trực diện, full nội thất cao cấp nhập khẩu, sàn gỗ, điều hòa âm trần",
        price: "8.5 tỷ",
        area: "98m²",
        bedrooms: 3,
        bathrooms: 2,
        kindOfEstate: "Căn hộ chung cư",
        datePost: "2024-03-15",
        floor: 25,
        legalPaper: "Sổ hồng",
        mainDir: "Đông Nam",
        mediaItems: [
            {
                type: 'image',
                url: '/lorem.png',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: '/lorem.png',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Vip1"
    },
    {
        id: "BDS002",
        title: "Biệt thự compound Thảo Điền",
        address: "Đường 11, Thảo Điền, Quận 2, TP.HCM",
        description: "Biệt thự compound cao cấp, thiết kế hiện đại, sân vườn rộng, hồ bơi riêng, an ninh 24/7",
        price: "45 tỷ",
        area: "350m²",
        bedrooms: 5,
        bathrooms: 6,
        kindOfEstate: "Biệt thự",
        datePost: "2024-03-14",
        floor: 3,
        legalPaper: "Sổ hồng",
        mainDir: "Đông",
        mediaItems: [
            {
                type: 'image',
                url: '/lorem.png',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Vip3"
    },
    {
        id: "BDS003",
        title: "Shophouse Phú Mỹ Hưng",
        address: "Nguyễn Lương Bằng, Quận 7, TP.HCM",
        description: "Shophouse mặt tiền kinh doanh, vị trí đắc địa, thuận tiện kinh doanh mọi ngành nghề",
        price: "30 tỷ",
        area: "200m²",
        bedrooms: 4,
        bathrooms: 5,
        kindOfEstate: "Shophouse",
        datePost: "2024-03-13",
        floor: 4,
        legalPaper: "Sổ hồng",
        mainDir: "Nam",
        mediaItems: [
            {
                type: 'image',
                url: '/lorem.png',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: '/lorem.png'
            },
            {
                type: 'image',
                url: '/lorem.png',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Vip2"
    },
    {
        id: "BDS004",
        title: "Căn hộ Masteri An Phú",
        address: "179 Xa lộ Hà Nội, Thảo Điền, Quận 2, TP.HCM",
        description: "Căn hộ 2PN, view thành phố, nội thất cao cấp, tiện ích đầy đủ",
        price: "4.2 tỷ",
        area: "70m²",
        bedrooms: 2,
        bathrooms: 2,
        kindOfEstate: "Căn hộ chung cư",
        datePost: "2024-03-12",
        floor: 15,
        legalPaper: "Sổ hồng",
        mainDir: "Đông Bắc",
        mediaItems: [
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1a/1500/500',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Tin thường"
    },
    {
        id: "BDS005",
        title: "Nhà phố Quận Bình Thạnh",
        address: "Phan Văn Trị, P.11, Bình Thạnh, TP.HCM",
        description: "Nhà phố 1 trệt 3 lầu, nội thất cao cấp, khu dân cư an ninh, gần chợ và trường học",
        price: "12 tỷ",
        area: "100m²",
        bedrooms: 4,
        bathrooms: 5,
        kindOfEstate: "Nhà phố",
        datePost: "2024-03-11",
        floor: 4,
        legalPaper: "Sổ hồng",
        mainDir: "Tây Nam",
        mediaItems: [
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1a/1500/500',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Nổi bật"
    },
    {
        id: "BDS006",
        title: "Đất nền Long Thành",
        address: "Xã An Phước, Long Thành, Đồng Nai",
        description: "Đất nền sổ đỏ, view công viên, cơ sở hạ tầng hoàn thiện, gần sân bay Long Thành",
        price: "2.8 tỷ",
        area: "100m²",
        kindOfEstate: "Đất nền",
        datePost: "2024-03-10",
        legalPaper: "Sổ đỏ",
        mainDir: "Đông Nam",
        mediaItems: [
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1a/1500/500',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Tin thường"
    },
    {
        id: "BDS007",
        title: "Penthouse The Sun Avenue",
        address: "28 Mai Chí Thọ, An Phú, Quận 2, TP.HCM",
        description: "Penthouse duplex view sông panorama, nội thất cao cấp, tiện ích 5 sao",
        price: "15 tỷ",
        area: "250m²",
        bedrooms: 4,
        bathrooms: 4,
        kindOfEstate: "Penthouse",
        datePost: "2024-03-09",
        floor: 34,
        legalPaper: "Sổ hồng",
        mainDir: "Nam",
        mediaItems: [
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1a/1500/500',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Vip2"
    },
    {
        id: "BDS008",
        title: "Officetel River Gate",
        address: "151 Bến Vân Đồn, Quận 4, TP.HCM",
        description: "Officetel đa năng, thích hợp làm văn phòng và ở, full nội thất",
        price: "3.2 tỷ",
        area: "45m²",
        bedrooms: 1,
        bathrooms: 1,
        kindOfEstate: "Officetel",
        datePost: "2024-03-08",
        floor: 8,
        legalPaper: "Sổ hồng",
        mainDir: "Đông",
        mediaItems: [
            {
                type: 'image',
                url: '/lorem.png',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Tin thường"
    },
    {
        id: "BDS009",
        title: "Nhà xưởng Bình Dương",
        address: "KCN Sóng Thần, Dĩ An, Bình Dương",
        description: "Nhà xưởng mới xây, đầy đủ giấy phép PCCC, phù hợp sản xuất công nghiệp",
        price: "20 tỷ",
        area: "1000m²",
        kindOfEstate: "Nhà xưởng",
        datePost: "2024-03-07",
        legalPaper: "Sổ hồng",
        mainDir: "Bắc",
        mediaItems: [
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1a/1500/500',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Vip1"
    },
    {
        id: "BDS010",
        title: "Resort nghỉ dưỡng Vũng Tàu",
        address: "Đường Thùy Vân, P.8, Vũng Tàu",
        description: "Resort ven biển, 15 phòng nghỉ cao cấp, hồ bơi, nhà hàng, đang kinh doanh tốt",
        price: "35 tỷ",
        area: "500m²",
        bedrooms: 15,
        bathrooms: 17,
        kindOfEstate: "Resort",
        datePost: "2024-03-06",
        floor: 3,
        legalPaper: "Sổ hồng",
        mainDir: "Đông",
        mediaItems: [
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1a/1500/500',
                alt: 'Toàn cảnh căn hộ Vinhomes Central Park'
            },
            {
                type: 'youtube',
                videoId: '2g811Eo7K8U',  // Verified: Vinhomes Central Park Tour
                thumbnail: 'https://picsum.photos/seed/bds1b/1500/500'
            },
            {
                type: 'image',
                url: 'https://picsum.photos/seed/bds1c/1500/500',
                alt: 'Nội thất phòng khách sang trọng'
            }
        ],
        variant: "vertical",
        badge: "Vip3"
    }
];
