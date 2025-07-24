interface NewsArticleSchemaProps {
  title: string;
  description: string;
  date: string;
  url: string;
  image?: string;
  keywords?: string;
  author?: {
    name: string;
    jobTitle?: string;
  };
}

export default function NewsArticleSchema({ 
  title, 
  description, 
  date, 
  url, 
  image,
  keywords,
  author = { name: "Fuland", jobTitle: "Phóng viên Bất động sản" }
}: NewsArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fuland.vn";
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/logo.webp`;

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title.length > 110 ? title.substring(0, 107) + '...' : title,
    "description": description,
    "url": fullUrl,
    "datePublished": new Date(date).toISOString(),
    "dateModified": new Date(date).toISOString(),
    "author": [{
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.jobTitle || "Phóng viên Bất động sản"
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
    "image": {
      "@type": "ImageObject", 
      "url": fullImageUrl,
      "width": 1200,
      "height": 630
    },
    "articleSection": "Bất động sản",
    "keywords": keywords || "bất động sản, tin tức, thị trường",
    "isAccessibleForFree": true,
    "inLanguage": "vi-VN",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    }
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