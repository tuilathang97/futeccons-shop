import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import PageWrapper from '../PageWrapper'
import { cn } from '@/lib/utils'

interface ProvincesCardSkeletonProps {
  className?: string
}

export default function ProvincesCardSkeleton({ className }: ProvincesCardSkeletonProps) {
  return (
    <PageWrapper className='container px-0 py-4 bg-none flex flex-col gap-4'>
      {/* Title skeleton */}
      <Skeleton className="h-8 w-64" />
      
      <Card className={cn("p-0 bg-transparent border-none shadow-none", className)}>
        <CardContent className='p-0 gap-4 min-w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {/* Province cards skeleton */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group min-w-full min-h-full flex flex-col items-center gap-2 rounded-md"
            >
              <div className='relative min-w-full'>
                <div className="flex flex-col-reverse items-center gap-2">
                  <Skeleton className='min-w-full min-h-full w-[10rem] h-[10rem] rounded-md' />
                </div>
                {/* Text overlay skeleton */}
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
                  <Skeleton className="h-6 w-20 bg-white/20" />
                </div>
              </div>
            </div>
          ))}
          
          {/* "Other provinces" card skeleton */}
          <div className="group col-span-2 min-w-full min-h-full flex flex-col items-center gap-2 rounded-md">
            <div className='relative min-w-full'>
              <div className="flex flex-col-reverse items-center gap-2">
                <Skeleton className='min-w-full min-h-full w-[10rem] h-[10rem] rounded-md' />
              </div>
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
                <Skeleton className="h-6 w-32 bg-white/20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  )
} 