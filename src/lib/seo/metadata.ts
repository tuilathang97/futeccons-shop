import { Metadata } from 'next'

interface GenerateMetadataProps {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
}

export function generateSEOMetadata({
  title,
  description,
  path,
  image = '/logo.webp',
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords = []
}: GenerateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fuland.vn'
  const url = `${baseUrl}${path}`
  
  const defaultKeywords = [
    'bất động sản',
    'mua bán nhà đất',
    'cho thuê',
    'nhà đất',
    'chung cư',
    'đầu tư bất động sản',
    'Việt Nam'
  ]

  return {
    title: `${title} | Futeccons Land`,
    description,
    keywords: [...defaultKeywords, ...keywords].join(', '),
    authors: [{ name: 'Futeccons Land' }],
    creator: 'Futeccons Land',
    publisher: 'Futeccons Land',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Futeccons Land',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'vi_VN',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@futeccons',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

// Helper function for category pages
export function generateCategoryMetadata(
  categoryName: string,
  level: number,
  path: string,
  parentCategories?: string[]
): Metadata {
  const breadcrumbPath = parentCategories ? parentCategories.join(' > ') + ' > ' + categoryName : categoryName
  
  return generateSEOMetadata({
    title: `${breadcrumbPath} - Mua bán & cho thuê`,
    description: `Khám phá ${categoryName.toLowerCase()} tại Futeccons Land. Tìm kiếm ${categoryName.toLowerCase()} phù hợp với nhu cầu của bạn.`,
    path,
    keywords: [categoryName, 'mua bán', 'cho thuê', ...parentCategories || []],
  })
}

// Helper function for post pages  
export function generatePostMetadata(
  title: string,
  description: string,
  postId: number,
  price?: number,
  location?: string,
  image?: string
): Metadata {
  const priceText = price ? ` - ${price.toLocaleString('vi-VN')} VND` : ''
  const locationText = location ? ` tại ${location}` : ''
  
  return generateSEOMetadata({
    title: `${title}${priceText}${locationText}`,
    description: description.substring(0, 160),
    path: `/post/${postId}`,
    image,
    keywords: ['bán nhà', 'cho thuê', location || '', title].filter(Boolean),
  })
} 