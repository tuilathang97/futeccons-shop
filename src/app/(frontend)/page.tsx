import CategoryPicker from "@/components/homepage/CategoryPicker";
import ProductsContainer from "@/components/products/ProductsContainer";
import { getCategories } from "@/lib/queries/categoryQueries";
import { getHomepageData } from "@/lib/queries/postQueries";
import { Metadata } from "next";
import { PaginationParams } from '@/lib/queries/paginateQuery';
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import HomeImage from "@/components/homepage/HomeImage";
import Link from "next/link";
import WhyUs from "@/components/homepage/WhyUs";
import ProvincesCardWithSuspense from "@/components/homepage/ProvincesCardWithSuspense";
import ReviewsCarousel from "@/components/homepage/ReviewsCarousel";
import SearchBar from "@/components/homepage/SearchBar";
import ProvincesLinks from "@/components/Links/ProvincesLinks";
import RealEstateSEOSection from "@/components/SEO/RealEstateSEOSection";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

const DEFAULT_PAGE_SIZE = 10;

export default async function Home({ searchParams }: HomePageProps) {
  const categories = await getCategories();
  const searchParamsValue = await searchParams;
  const page = searchParamsValue.page ? parseInt(searchParamsValue.page, 10) : 1;
  const pageSize = searchParamsValue.pageSize ? parseInt(searchParamsValue.pageSize, 10) : DEFAULT_PAGE_SIZE;

  const paginationParams: PaginationParams = {
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
  };
  
  const homepageData = await getHomepageData(paginationParams, {});

  return (
    <CategoriesProvider initialCategories={categories}>
      <div className="flex flex-col justify-center items-center gap-[2rem] ">
        <div className="min-w-full mx-auto">
          <div className="container flex flex-col sm:pt-[3rem] pt-[2rem] min-w-full items-center text-center text-sm/8 gap-6">
            <h1 className="max-w-4xl tracking-wide text-[2.5rem] leading-[3rem] font-bold font-montserrat">Tìm Kiếm Bất Động Sản Phù Hợp Với Nhu Cầu Của Bạn</h1>
            <p className="text-base tracking-wide font-montserrat sm:text-lg text-gray-500 ">Tại đây,chúng tôi sẽ giúp bạn
              <span className="text-brand-medium text-xl mx-1">
                <Link href="/ban-nha" className="hover:text-brand-dark hover:underline">Mua bán</Link>
              </span>
              hoặc
              <span className="text-brand-medium text-xl mx-1">
                <Link href="/cho-thue" className="hover:text-brand-dark hover:underline">thuê / cho thuê </Link>
              </span> không gian lý tưởng</p>
          </div>
        </div>
        <div className="w-full mb-8 container xl:px-0">
          <SearchBar />
        </div>
        <HomeImage href="/tim-kiem-theo-tu-khoa" imgUrl="/categoryImages/saigon.webp" />
        <div className="container xl:px-0">
          <ProvincesCardWithSuspense />
          <ProductsContainer title="Tin nổi bật" posts={homepageData.featuredPosts} />
        </div>
        <WhyUs />
        <CategoryPicker />
        <div className="container rounded-lg 2xl:px-0 bg-brand-light/10">
          <ReviewsCarousel />
        </div>
        <ProvincesLinks />
        <section className="container 2xl:px-0">
          <RealEstateSEOSection />
        </section>
      </div>
      <div className="aaaaaaaaaaaaaa"></div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
        }}
      />
    </CategoriesProvider>
  );
}

export const metadata: Metadata = {
  title: 'Futeccons Shop',
  description: 'Futeccons Shop - Real Estate Platform',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Futeccons Shop',
    description: 'Futeccons Shop - Real Estate Platform',
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: 'Futeccons Shop',
    images: [
      {
        url: '/favicon.svg',
        width: 800,
        height: 600,
        alt: 'Futeccons Shop',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Futeccons Shop',
    description: 'Futeccons Shop - Real Estate Platform',
    images: ['/favicon.svg'],
  },
  other: {
    'og:url': process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    'og:site_name': 'Futeccons Shop',
    'og:title': 'Futeccons Shop',
    'og:description': 'Futeccons Shop - Real Estate Platform',
    'og:image': '/favicon.svg',
    'twitter:url': process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    'twitter:title': 'Futeccons Shop',
    'twitter:description': 'Futeccons Shop - Real Estate Platform',
    'twitter:image': '/favicon.svg',
    'msapplication-TileColor': '#da532c',
    'msapplication-config': '/favicon/browserconfig.xml',
    'theme-color': '#ffffff',
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization", 
  "name": "Futeccons Shop",
  "description": "Nền tảng bất động sản hàng đầu Việt Nam",
  "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "1900-xxx-xxx", 
    "contactType": "customer service",
    "availableLanguage": "Vietnamese"
  },
  
};