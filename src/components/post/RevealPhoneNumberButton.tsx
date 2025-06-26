'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface RevealPhoneNumberButtonProps {
  phoneNumber: string | null | undefined;
  isCurrentUserLoggedIn: boolean;
  loginUrl: string; 
  pageCallbackUrl: string; 
}

const maskPhoneNumber = (num: string | null | undefined): string => {
  if (!num || num.length < 3) {
    return 'ẩn';
  }
  return `${num.substring(0, 3)}***`;
};

export default function RevealPhoneNumberButton({ 
  phoneNumber,
  isCurrentUserLoggedIn,
  loginUrl,
  pageCallbackUrl 
}: RevealPhoneNumberButtonProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (!isCurrentUserLoggedIn) {
      router.push(`${loginUrl}?callbackUrl=${encodeURIComponent(pageCallbackUrl)}`);
      return;
    }
    setIsRevealed(true);
  };

  if (isRevealed && isCurrentUserLoggedIn && phoneNumber) {
    return (
      <Button variant={"destructive"} asChild className="w-full">
        <a href={`tel:${phoneNumber}`}>
          {phoneNumber} 
          <Phone className="ml-2" size={16} />
        </a>
      </Button>
    );
  }

  return (
    <Button onClick={handleClick} variant={"destructive"} className="w-full">
      {`Bấm để hiện số: ${maskPhoneNumber(phoneNumber)}`}
      <Phone className="ml-2" size={16} />
    </Button>
  );
} 