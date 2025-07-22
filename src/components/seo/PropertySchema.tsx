interface PropertySchemaProps {
  post: {
    id: number
    tieuDeBaiViet: string
    noiDung: string
    giaTien: number
    dienTichDat: number
    thanhPho: string
    quan: string
    phuong: string
    duong: string
    soPhongNgu: number
    soPhongVeSinh: number
    images?: string[]
    user: {
      name: string
      number: string
      email: string
    }
    createdAt?: Date
  }
}

export default function PropertySchema({ post }: PropertySchemaProps) {
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": post.tieuDeBaiViet,
    "description": post.noiDung.substring(0, 160),
    "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://fuland.vn"}/post/${post.id}`,
    "price": {
      "@type": "PriceSpecification",
      "price": post.giaTien,
      "priceCurrency": "VND"
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": post.dienTichDat,
      "unitCode": "MTK"
    },
    "numberOfRooms": post.soPhongNgu,
    "numberOfBathroomsTotal": post.soPhongVeSinh,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": post.duong,
      "addressLocality": post.phuong,
      "addressRegion": post.quan,
      "addressCountry": "VN"
    },
    "datePosted": post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
    "availability": "https://schema.org/InStock",
    "category": "RealEstate",
    "agent": {
      "@type": "RealEstateAgent",
      "name": post.user.name,
      "telephone": post.user.number,
      "email": post.user.email
    },
    "image": post.images || [],
    "potentialAction": {
      "@type": "ViewAction",
      "target": `${process.env.NEXT_PUBLIC_APP_URL || "https://fuland.vn"}/post/${post.id}`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(propertySchema).replace(/</g, '\\u003c'),
      }}
    />
  )
} 