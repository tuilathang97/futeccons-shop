import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MobileAccountLinksProps {
  onNavigate?: (path: string) => void;
}

function MobileAccountLinks({ onNavigate }: MobileAccountLinksProps) {
  const handleLoginClick = () => {
    onNavigate?.('/dang-nhap');
  };

  const handleRegisterClick = () => {
    onNavigate?.('/dang-ky');
  };

  return (
    <div className='w-full px-4 flex flex-col gap-2'>
      {/* Header */}
      <div className='flex flex-col gap-2'>
        <h3 className="text-lg font-semibold text-gray-800">Tham gia cùng chúng tôi</h3>
        <p className="text-sm text-gray-600">Khám phá thế giới bất động sản</p>
      </div>
      <div className='flex flex-col h-12 sm:flex-row gap-2'>
        <Button variant="secondary" className='w-full' asChild>
          <Link href="/dang-nhap" onClick={handleLoginClick}>
            Đăng nhập
          </Link>
        </Button>
        <Button variant="secondary" className='w-full h-12' asChild>
          <Link href="/dang-ky" onClick={handleRegisterClick}>
            Đăng ký
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default MobileAccountLinks