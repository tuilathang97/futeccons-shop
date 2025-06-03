'use client';

import React, { useEffect, useState } from 'react';
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
  className?: string;
}

export default function CitySidebar({ className }: CitySidebarProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const { handleSelectAddress } = useSelectAddress()


  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/provinces', { cache: 'force-cache' });
        const data = await response.json();

        const majorCities = data.filter((province: Province) =>
          ['thanh_pho_ha_noi', 'thanh_pho_ho_chi_minh', 'thanh_pho_da_nang',
            'thanh_pho_hai_phong', 'thanh_pho_can_tho'].includes(province.codename)
        );

        setProvinces(majorCities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  if (loading) {
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
              <div key={province.codename} className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => handleSelectAddress(province.codename)}
                  className={`flex min-w-full items-center gap-2 font-medium hover:text-primary transition-colors
                    }`}
                >
                  <Building2 className="h-4 w-4" />
                  {province.name}
                </Button>

                {
                  <div>
                    <div className=" mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4">
                      {province.districts
                        .filter(district => district.division_type === 'huyện' || district.division_type === 'quận')
                        .slice(0, selectedProvince === index ? province.districts.length : 6)
                        .map((district) => (
                          <Button
                            variant="secondary"
                            key={district.codename}
                            onClick={() => handleSelectAddress(province.codename, district.codename)}
                            className={`text-sm text-left hover:text-primary transition-colors 
                              }`}
                          >
                            {district.name}
                          </Button>
                        ))}
                    </div>
                    {province.districts.length > 8 && (
                      <Button
                        onClick={() => setSelectedProvince(selectedProvince === index ? null : index)}
                        variant="secondary"
                        className="text-sm mt-4 min-w-full  font-medium"
                      >
                        Xem thêm...
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