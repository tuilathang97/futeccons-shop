
export default function LocalBusinessSchema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Fuland - Mua Bán Cho Thuê Bất Động Sản Uy Tín",
    "description": "Nền tảng bất động sản hàng đầu Việt Nam",
    "url": process.env.NEXT_PUBLIC_APP_URL,
    "logo": `${process.env.NEXT_PUBLIC_APP_URL}/logo.svg`,
    "image": `${process.env.NEXT_PUBLIC_APP_URL}/logo.svg`,
    "telephone": "0765563567",
    "email": "thanhlb1990@gmail.com",
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "City",
        "name": "Hồ Chí Minh",
        "addressCountry": "VN"
      },
      {
        "@type": "City", 
        "name": "Hà Nội",
        "addressCountry": "VN"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 10.8231,
        "longitude": 106.6297
      },
      "geoRadius": "100000"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "12/66/3 đường ấp 4, Đông Thạnh",
      "addressLocality": "Hóc Môn",
      "addressRegion": "Hồ Chí Minh",
      "postalCode": "70000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.8231,
      "longitude": 106.6297
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Listings",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bán nhà",
            "description": "Dịch vụ môi giới bán nhà, đất"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Cho thuê",
            "description": "Dịch vụ môi giới cho thuê nhà, căn hộ"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHours": ["Mo-Su 08:00-22:00"],
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "VND"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c'),
      }}
    />
  )
} 