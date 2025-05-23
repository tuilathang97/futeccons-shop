import { cn } from '@/lib/utils'
import React from 'react'

function PageWrapper({children,className}:{children:React.ReactNode,className?:string}) {
  return (
    <div className={cn("container px-4 lg:px-8 2xl:px-0 ",className)}>
        {children}
    </div>
  )
}

export default PageWrapper