import React, { Suspense } from 'react'
import ProvincesCard from './ProvincesCard'
import ProvincesCardSkeleton from './ProvincesCardSkeleton'

interface ProvincesCardWithSuspenseProps {
  className?: string
}

export default function ProvincesCardWithSuspense({ className }: ProvincesCardWithSuspenseProps) {
  return (
    <Suspense fallback={<ProvincesCardSkeleton className={className} />}>
      <ProvincesCard className={className} />
    </Suspense>
  )
} 