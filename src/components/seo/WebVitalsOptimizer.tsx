'use client'

// Web Vitals optimizer - currently disabled to avoid package dependency
export default function WebVitalsOptimizer() {
  // Web vitals tracking can be enabled by installing web-vitals package
  // and implementing the tracking logic here
  return null
}

// Preload critical resources
export function CriticalResourcePreloader() {
  return (
    <>
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <meta name="format-detection" content="telephone=no" />
    </>
  )
} 