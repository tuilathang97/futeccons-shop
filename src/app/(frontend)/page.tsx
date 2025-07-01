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
          <div className="container flex flex-col sm:py-[3rem] py-[2rem] min-w-full items-center text-center text-sm/8 gap-6">
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
        <div className="w-full container xl:px-0">
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
    </CategoriesProvider>
  );
}

export const metadata: Metadata = {
  title: 'Futeccons Shop',
  description: 'Futeccons Shop - Real Estate Platform',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  }
} 