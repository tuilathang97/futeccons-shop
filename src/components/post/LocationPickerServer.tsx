"use client";

import React from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const LocationPickerWithNoSSR = dynamic(
  () => import('./LocationPicker'),
  { ssr: false }
);

export default function LocationPickerServer() {
  return (
    <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-gray-100 border rounded-md">Đang tải bản đồ...</div>}>
      <LocationPickerWithNoSSR />
    </Suspense>
  );
} 