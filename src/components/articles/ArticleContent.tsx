'use client';

import React from 'react';
import { Article } from '@/db/schema';
import Link from 'next/link';

interface ArticleContentProps {
  article: Article;
}

// Responsive typography styles for article content
const articleResponsiveStyles = `
  .article-prose h1 {
    font-size: 1.25rem; /* 20px mobile */
    font-weight: 700; /* bold */
    line-height: 1.2;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #111827;
    font-family: 'Montserrat', sans-serif;
  }
  
  .article-prose h2 {
    font-size: 1.125rem; /* 18px mobile */
    font-weight: 600; /* semibold */
    line-height: 1.3;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    color: #111827;
    font-family: 'Montserrat', sans-serif;
  }
  
  .article-prose h3 {
    font-size: 1rem; /* 16px mobile */
    font-weight: 600; /* semibold */
    line-height: 1.4;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: #1f2937;
    font-family: 'Montserrat', sans-serif;
  }
  
  /* Tablet breakpoint (768px+) */
  @media (min-width: 768px) {
    .article-prose h1 {
      font-size: 1.5rem; /* 24px tablet */
      line-height: 1.2;
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
    }
    
    .article-prose h2 {
      font-size: 1.25rem; /* 20px tablet */
      line-height: 1.3;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    
    .article-prose h3 {
      font-size: 1.125rem; /* 18px tablet */
      line-height: 1.4;
      margin-top: 1.75rem;
      margin-bottom: 0.75rem;
    }
  }
  
  /* Desktop breakpoint (1024px+) */
  @media (min-width: 1024px) {
    .article-prose h1 {
      font-size: 1.75rem; /* 28px desktop */
      line-height: 1.2;
      margin-top: 3rem;
      margin-bottom: 1.5rem;
    }
    
    .article-prose h2 {
      font-size: 1.5rem; /* 24px desktop */
      line-height: 1.3;
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
    }
    
    .article-prose h3 {
      font-size: 1.25rem; /* 20px desktop */
      line-height: 1.4;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
  }
  
  /* Additional prose elements for consistency */
  .article-prose p {
    margin-bottom: 1rem;
    color: #374151;
    line-height: 1.7;
  }
  
  .article-prose ul, .article-prose ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  .article-prose li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .article-prose a {
    color: #2563eb;
    text-decoration: underline;
  }
  
  .article-prose a:hover {
    color: #1d4ed8;
  }
  
  .article-prose strong {
    font-weight: 600;
    color: #111827;
  }
  
  .article-prose em {
    font-style: italic;
  }
  
  /* First heading after title gets extra top margin */
  .article-prose h1:first-child,
  .article-prose h2:first-child,
  .article-prose h3:first-child {
    margin-top: 0;
  }
`;

export default function ArticleContent({ article }: ArticleContentProps) {
  if (!article) return null;
  
  return (
    <>
      <style>{articleResponsiveStyles}</style>
      <section className="mt-8 border-t py-12 flex flex-col gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 w-full text-center font-montserrat">
          {article.title}
        </h1>
        <div 
          className="article-prose text-sm md:text-base font-montserrat max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        <p className='leading-8 md:leading-10 font-montserrat'>
          Hy vọng với những thông tin trên sẽ giúp ích cho bạn trong quá trình đầu tư và Bất Động Sản. Đừng quên truy cập vào trang chủ của chúng tôi để cập nhật tình hình Bất Động Sản mới nhất. Chúc các bạn có trải nghiệm thú vị tại trang <Link href="/" aria-label="Trang chủ" className="text-brand-darkest/90 font-bold hover:underline">của chúng tôi </Link>.
        </p>
      </section>
    </>
  );
} 