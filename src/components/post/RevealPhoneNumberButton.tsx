'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import Link from 'next/link';

interface RevealPhoneNumberButtonProps {
  phoneNumber: string | null | undefined;
}

const maskPhoneNumber = (num: string | null | undefined): string => {
  if (!num || num.length < 3) {
    return 'ẩn';
  }
  return `${num.substring(0, 3)}***`;
};

export default function RevealPhoneNumberButton({ 
  phoneNumber
}: RevealPhoneNumberButtonProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    setIsRevealed(true);
  };

  if (isRevealed && phoneNumber) {
    return (
      <Button variant={"destructive"} asChild className="w-full">
        <Link href={`tel:${phoneNumber}`}>
          {phoneNumber} 
          <Phone className="ml-2" size={16} />
        </Link>
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