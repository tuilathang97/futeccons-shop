import { cn } from '@/lib/utils'
import React from 'react'

function PageWrapper({children,className}:{children:React.ReactNode,className?:string}) {
  return (
    <div className={cn("container",className)}>
        {children}
    </div>
  )
}

export default PageWrapper