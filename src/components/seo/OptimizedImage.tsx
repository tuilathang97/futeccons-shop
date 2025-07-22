import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  title?: string
  fill?: boolean
  sizes?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  title,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: OptimizedImageProps) {
  // Generate structured data for image
  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": src,
    "name": alt,
    "description": title || alt,
    "width": width,
    "height": height
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={className}
        title={title}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageSchema).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}

// Property image gallery component with SEO
interface PropertyImageGalleryProps {
  images: string[]
  propertyTitle: string
  className?: string
}

export function PropertyImageGallery({ 
  images, 
  propertyTitle, 
  className 
}: PropertyImageGalleryProps) {
  if (!images?.length) return null

  return (
    <div className={`grid gap-4 ${className}`}>
      {images.slice(0, 6).map((image, index) => (
        <OptimizedImage
          key={index}
          src={image}
          alt={`${propertyTitle} - Hình ảnh ${index + 1}`}
          width={800}
          height={600}
          priority={index === 0}
          className="rounded-lg object-cover"
          title={`${propertyTitle} - Ảnh ${index + 1}`}
        />
      ))}
    </div>
  )
} 