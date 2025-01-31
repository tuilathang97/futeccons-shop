'use client'

import { useFormStatus } from "react-dom";
import { Button } from '@/components/ui/button';

export default function SubmitButton({ children, className }: {children: React.ReactNode, className?: string}) {
  const { pending } =useFormStatus();
  return(
    <Button className={className} disabled={pending} type='submit' aria-disabled={pending}>
      {children}
    </Button>
  )
}