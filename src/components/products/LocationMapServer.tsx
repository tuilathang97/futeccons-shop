"use client";

import React from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const LocationMapWithNoSSR = dynamic(
  () => import('./LocationMap'),
  { ssr: false }
);

interface LocationMapServerProps {
  latitude?: number | null;
  longitude?: number | null;
  popupText?: string;
}

export default function LocationMapServer({
  latitude,
  longitude,
  popupText
}: LocationMapServerProps) {
  return (
    <Suspense fallback={<div className="h-[300px] flex items-center justify-center bg-gray-100 border rounded-md">Đang tải bản đồ...</div>}>
      <LocationMapWithNoSSR 
        latitude={latitude} 
        longitude={longitude} 
        popupText={popupText}
      />
    </Suspense>
  );
} 