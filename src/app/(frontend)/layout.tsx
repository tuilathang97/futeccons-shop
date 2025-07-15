import type { Metadata } from "next";
import { Arimo, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/Header";
import Footer from "@/components/layout/Footer";
import { getCategories } from "@/lib/queries/categoryQueries";
import { SessionProvider } from "@/contexts/SessionContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import PageWrapper from "@/components/PageWrapper";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";
import ProgressProviderComponent from "@/components/provider/ProgressProvider";


const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Futeccons Shop",
  description: "Mua bán bất động sản",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = null;
  const user = null;
  const categories = await getCategories();
  return (
    <html lang="vi" className="h-svh">
      <head>
        <meta name="description" content="Mua bán bất động sản" />
        <meta name="keywords" content="Mua bán bất động sản, bất động sản, đất đai, nhà đất, đầu tư bất động sản" />
        <meta name="author" content="Fuland Shop" />
        <meta name="robots" content="index, follow" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        <meta name="og:title" content="Fuland Shop" />
        <meta name="og:description" content="Mua bán bất động sản" />
        <meta name="og:image" content="/images/logo.png" />
        <meta name="og:type" content="website" />
        <meta name="og:site_name" content="Fuland Shop" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://fuland.vn/"} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${arimo.variable} ${montserrat.variable} flex min-h-svh flex-col font-arimo min-w-full antialiased mx-0 !pt-16 `}
      >
        <SessionProvider session={session} user={user}>
          <CategoriesProvider initialCategories={categories}>
            <Header />
            <PageWrapper className="flex-1">
              <main>
                <ProgressProviderComponent>
                  {children}
                </ProgressProviderComponent>
              </main>
            </PageWrapper>
            <Footer />
          </CategoriesProvider>
        </SessionProvider>
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
          }}
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Futeccons Shop",
  "description": "Nền tảng bất động sản hàng đầu Việt Nam",
  "url": "http://localhost:3000",
  "hasPart": [
    {
      "@type": "WebPage",
      "name": "Đăng tin",
      "url": "https://fuland.vn/dang-tin"
    },
    {
      "@type": "WebPage",
      "name": "Bán nhà",
      "url": "https://fuland.vn/ban-nha"
    },
    {
      "@type": "WebPage",
      "name": "Cho thuê",
      "url": "https://fuland.vn/cho-thue"
    },
    {
      "@type": "WebPage",
      "name": "Tìm kiếm theo khu vực Hà Nội",
      "url": "https://fuland.vn/tim-kiem-theo-tu-khoa?thanhPho=thanh_pho_ha_noi"
    },

  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "0765563567",
    "contactType": "customer service"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "VN",
    "postalCode": "10000",
    "addressLocality": "Hồ Chí Minh",
    "addressRegion": "Hồ Chí Minh",
    "streetAddress": "12/66/3 đường ấp 4, Đông Thạnh, Hóc Môn, Hồ Chí Minh"
  }
};
