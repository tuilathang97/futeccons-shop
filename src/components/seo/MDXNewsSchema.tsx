'use client';

interface MDXNewsSchemaProps {
  headline: string;
  author?: string;
  jobTitle?: string;
  datePublished?: string;
}

export default function MDXNewsSchema({ 
  headline, 
  author = "Fuland", 
  jobTitle = "Phóng viên Bất động sản",
  datePublished 
}: MDXNewsSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fuland.vn";
  
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": headline.length > 110 ? headline.substring(0, 107) + '...' : headline,
    "datePublished": datePublished ? new Date(datePublished).toISOString() : new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": author,
      "jobTitle": jobTitle
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Fuland",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.webp`
      }
    },
    "isAccessibleForFree": true,
    "inLanguage": "vi-VN"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(newsArticleSchema).replace(/</g, '\\u003c'),
      }}
    />
  );
} 