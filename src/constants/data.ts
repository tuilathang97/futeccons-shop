import { NavItem } from 'types';

export type Product = {
    photo_url: string;
    name: string;
    description: string;
    created_at: string;
    price: number;
    id: number;
    category: string;
    updated_at: string;
};


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


//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
    {
        title: 'Trang chủ',
        url: '/',
        icon: 'home',
        shortcut: ['h', 'h'],
        isActive: false,
        items: [] // No child items
    },
    {
        title: 'Quản lí',
        url: '/admin',
        icon: 'building',
        isActive: true,
        shortcut: ['q', 'q'],
        items: [
            {
                title: 'Danh mục',
                url: '/admin/category',
                icon: 'category',
                shortcut: ['d', 'd']
            },
            {
                title: 'Bài viết',
                url: '/admin/articles',
                icon: 'post',
                shortcut: ['a', 'a']
            },
            {
                title: 'Duyệt bài đăng',
                url: '/admin/posts-management',
                icon: 'post',
                shortcut: ['p', 'm']
            }
        ]
    },
];

export interface SaleUser {
    id: number;
    name: string;
    email: string;
    amount: string;
    image: string;
    initials: string;
}

export const recentSalesData: SaleUser[] = [
    {
        id: 1,
        name: 'Olivia Martin',
        email: 'olivia.martin@email.com',
        amount: '+$1,999.00',
        image: 'https://api.slingacademy.com/public/sample-users/1.png',
        initials: 'OM'
    },
    {
        id: 2,
        name: 'Jackson Lee',
        email: 'jackson.lee@email.com',
        amount: '+$39.00',
        image: 'https://api.slingacademy.com/public/sample-users/2.png',
        initials: 'JL'
    },
    {
        id: 3,
        name: 'Isabella Nguyen',
        email: 'isabella.nguyen@email.com',
        amount: '+$299.00',
        image: 'https://api.slingacademy.com/public/sample-users/3.png',
        initials: 'IN'
    },
    {
        id: 4,
        name: 'William Kim',
        email: 'will@email.com',
        amount: '+$99.00',
        image: 'https://api.slingacademy.com/public/sample-users/4.png',
        initials: 'WK'
    },
    {
        id: 5,
        name: 'Sofia Davis',
        email: 'sofia.davis@email.com',
        amount: '+$39.00',
        image: 'https://api.slingacademy.com/public/sample-users/5.png',
        initials: 'SD'
    }
];



export const EstatePriceRanges = [
    {
        label: "Dưới 500 triệu",
        value: { min: 0, max: 500000000 }
    },
    {
        label: "Từ 500 triệu - 1 tỷ",
        value: { min: 500000000, max: 1000000000 }
    },
    {
        label: "Từ 1 tỷ - 2 tỷ",
        value: { min: 1000000000, max: 2000000000 }
    },
    {
        label: "Từ 2 tỷ - 3 tỷ",
        value: { min: 2000000000, max: 3000000000 }
    },
    {
        label: "Từ 3 tỷ - 5 tỷ",
        value: { min: 3000000000, max: 5000000000 }
    },
    {
        label: "Từ 5 tỷ - 7 tỷ",
        value: { min: 5000000000, max: 7000000000 }
    },
    {
        label: "Từ 7 tỷ - 10 tỷ",
        value: { min: 7000000000, max: 10000000000 }
    },
    {
        label: "Từ 10 tỷ - 20 tỷ",
        value: { min: 10000000000, max: 20000000000 }
    },
    {
        label: "Từ 20 tỷ - 30 tỷ",
        value: { min: 20000000000, max: 30000000000 }
    },
    {
        label: "Từ 30 tỷ - 50 tỷ",
        value: { min: 30000000000, max: 50000000000 }
    },
    {
        label: "Trên 50 tỷ",
        value: { min: 50000000000, max: 1000000000000 }
    }
];

export const estateRentPriceRanges = [
    {
        label: "Dưới 1 triệu",
        value: { min: 0, max: 1000000 }
    },
    {
        label: "Từ 1 - 3 triệu",
        value: { min: 1000000, max: 3000000 }
    },
    {
        label: "Từ 3 - 5 triệu",
        value: { min: 3000000, max: 5000000 }
    },
    {
        label: "Từ 5 - 7 triệu",
        value: { min: 5000000, max: 7000000 }
    },
    {
        label: "Từ 7 - 10 triệu",
        value: { min: 7000000, max: 10000000 }
    },
    {
        label: "Từ 10 - 20 triệu",
        value: { min: 10000000, max: 20000000 }
    },
    {
        label: "Từ 20 - 50 triệu",
        value: { min: 20000000, max: 50000000 }
    },
    {
        label: "Từ 50 - 100 triệu",
        value: { min: 50000000, max: 100000000 }
    },
    {
        label: "Trên 100 triệu",
        value: { min: 100000000, max: null }
    }
];

export const areaRanges = [
    {
        label: "Dưới 30 m²",
        area: { min: 0, max: 30 }
    },
    {
        label: "Từ 30 - 50 m²",
        area: { min: 30, max: 50 }
    },
    {
        label: "Từ 50 - 70 m²",
        area: { min: 50, max: 70 }
    },
    {
        label: "Từ 70 - 100 m²",
        area: { min: 70, max: 100 }
    },
    {
        label: "Từ 100 - 150 m²",
        area: { min: 100, max: 150 }
    },
    {
        label: "Từ 150 - 250 m²",
        area: { min: 150, max: 250 }
    },
    {
        label: "Từ 250 - 500 m²",
        area: { min: 250, max: 500 }
    },
    {
        label: "Trên 500 m²",
        area: { min: 500, max: 500000 }
    }
];


export const bedroomOptions = [
    {
        label: "1 Phòng ngủ",
        value: 1
    },
    {
        label: "2 Phòng ngủ",
        value: 2
    },
    {
        label: "3 Phòng ngủ",
        value: 3
    },
    {
        label: "4 Phòng ngủ",
        value: 4
    },
    {
        label: "5 Phòng ngủ trở lên",
        value: "5+"
    }
];