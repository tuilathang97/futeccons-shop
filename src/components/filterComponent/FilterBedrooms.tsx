"use client"
import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from "@/lib/utils"
import { bedroomOptions } from '@/constants/data'

interface BedroomOptionI {
    label: string
    value: number | string
}

function FilterBedrooms() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedBedrooms, setSelectedBedrooms] = useState<string>('');
    const [displayValue, setDisplayValue] = useState<string>('');

    // Khởi tạo giá trị từ URL khi component mount
    useEffect(() => {
        const bedroomsParam = searchParams.get('bedrooms');
        if (bedroomsParam) {
            setSelectedBedrooms(bedroomsParam);

            // Tìm và hiển thị label tương ứng
            const option = bedroomOptions.find(opt => opt.value.toString() === bedroomsParam);
            if (option) {
                setDisplayValue(option.label);
            }
            return
        }
        setSelectedBedrooms('');
        setDisplayValue('');
        return
    }, [searchParams]);

    const handleBedroomsChange = (value: string) => {
        setSelectedBedrooms(value);
        const option = bedroomOptions.find(opt => opt.value.toString() === value);
        if (option) {
            setDisplayValue(option.label);
        }

        // Cập nhật URL với giá trị mới
        updateUrl(value);
    };

    // Cập nhật URL với giá trị mới
    const updateUrl = (bedroomsValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (bedroomsValue) {
            params.set('bedrooms', bedroomsValue);
        } else {
            params.delete('bedrooms');
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Xử lý khi xóa bộ lọc
    const clearFilter = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa đến các phần tử cha

        setSelectedBedrooms('');
        setDisplayValue('');

        const params = new URLSearchParams(searchParams.toString());
        params.delete('bedrooms');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div>
            <div>
                <Select
                    value={selectedBedrooms}
                    onValueChange={handleBedroomsChange}
                >
                    <SelectTrigger
                        className={cn(
                            "w-full md:w-[180px]",
                            selectedBedrooms && "border-red-500 text-red-500 border " // Thêm border màu vàng khi có giá trị được chọn
                        )}
                    >
                        <SelectValue placeholder="Số phòng ngủ">
                            {displayValue}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {/* Thêm tùy chọn để reset */}
                        {selectedBedrooms && (
                            <div className="px-2 py-2 border-b">
                                <button
                                    onClick={clearFilter}
                                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 text-red-500"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}

                        {bedroomOptions.map((option: BedroomOptionI, index: number) => (
                            <SelectItem
                                key={index}
                                value={option.value.toString()}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default FilterBedrooms;
