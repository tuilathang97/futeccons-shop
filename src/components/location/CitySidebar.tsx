'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useSelectAddress } from './Utils';
import { Separator } from '../ui/separator';

// Define province and district types based on the JSON structure
interface District {
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
}

interface Province {
  name: string;
  codename: string;
  division_type: string;
  phone_code: number;
  districts: District[];
}

interface CitySidebarProps {
  provinces: Province[];
  className?: string;
}

export default function CitySidebar({ provinces, className }: CitySidebarProps) {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const { handleSelectAddress } = useSelectAddress()
  if (!provinces || provinces.length === 0) {
    return null;
  }
  const majorCities = provinces.filter((province: Province) =>
    ['thanh_pho_ha_noi', 'thanh_pho_ho_chi_minh', 'thanh_pho_da_nang',
      'thanh_pho_hai_phong', 'thanh_pho_can_tho'].includes(province.codename)
  );
  
  

  if (majorCities.length === 0) {
    return (
      <div className={className}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Tìm kiếm theo khu vực
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <div className="animate-pulse">Đang tải...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader className="px-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Tìm kiếm theo khu vực
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            {provinces.map((province,index) => (
              <div key={province.codename} className="space-y-2 flex flex-col justify-center">
                <span
                  onClick={() => handleSelectAddress(province.codename)}
                  className={`flex cursor-pointer hover:underline min-w-full text-base sm:text-sm items-center gap-2 font-medium hover:text-primary transition-colors
                    }`}
                >
                  <Building2 className="h-4 w-4" />
                  {province.name}
                </span>

                {
                  <div>
                    <div className=" mt-4 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4">
                      {province.districts
                        .filter(district => district.division_type === 'huyện' || district.division_type === 'quận')
                        .slice(0, selectedProvince === index ? province.districts.length : 6)
                        .sort((a, b) => b.name.length - a.name.length)
                        .map((district) => (
                          <span
                            key={district.codename}
                            onClick={() => handleSelectAddress(province.codename, district.codename)}
                            className={`text-sm flex hover:underline cursor-pointer text-left hover:text-primary transition-colors 
                              }`}
                          >
                            {district.name}
                          </span>
                        ))}
                    </div>
                    {province.districts.length > 8 && (
                      <Button
                        onClick={() => setSelectedProvince(selectedProvince === index ? null : index)}

                        className="text-sm bg-brand-medium mt-4 min-w-full  font-medium"
                      >
                        {selectedProvince === index ? "Thu gọn" : "Xem thêm..."}
                      </Button>
                    )}
                    <Separator className="my-4 w-[100%] h-[1px] bg-gray-200" />
                  </div>
                }
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 