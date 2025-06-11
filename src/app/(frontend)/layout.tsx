import type { Metadata } from "next";
import { Arimo, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/Header";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCategories } from "@/lib/queries/categoryQueries";
import { SessionProvider } from "@/contexts/SessionContext";
import { Session, User } from "@/db/schema";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { PostHogProvider } from "@/components/layout/PostHogProvider";
import PageWrapper from "@/components/PageWrapper";

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
  const dataSession = await auth.api.getSession({ headers: await headers() });
  const session = dataSession?.session;

  const user = dataSession?.user;
  const categories = await getCategories();

  return (
    <html lang="vi" className="h-svh">
      <body
        className={`${arimo.variable} ${montserrat.variable} font-arimo min-w-full antialiased mx-0 !pt-[7rem] md:pt-[5rem] `}
      >
        <PostHogProvider>
          <SessionProvider session={session as Session} user={user as User}>
            <CategoriesProvider initialCategories={categories}>
              <Header />
              <PageWrapper >
                <main>{children}</main>
              </PageWrapper>
              <Footer />
            </CategoriesProvider>
          </SessionProvider>
          <Toaster />
        </PostHogProvider>
      </body>
    </html>
  );
}
