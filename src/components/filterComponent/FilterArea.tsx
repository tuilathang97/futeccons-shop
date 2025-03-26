"use client"
import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '../ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { areaRanges } from '@/constants/data'
import { Button } from '../ui/button'

interface AreaI {
    label: string
    area: { min: number, max: number | null }
}

// Hàm chuyển đổi giá trị diện tích thành định dạng URL dễ đọc
function formatAreaForUrl(area?: number): string {
    if (!area) return '0';
    return area.toString();
}

// Hàm phân tích giá trị từ URL về số
function parseAreaFromUrl(areaStr: string): number {
    return parseInt(areaStr);
}

// Hàm hiển thị giá trị đẹp hơn cho người dùng
function formatAreaForDisplay(min: number, max?: number | null): string {
    if (min === 0 && max) {
        return `Dưới ${max} m²`;
    } else if (max === null) {
        return `Trên ${min} m²`;
    } else if (max) {
        return `${min} - ${max} m²`;
    }
    return `${min} m²`;
}

function FilterArea() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [customMinArea, setCustomMinArea] = useState<string>('');
    const [customMaxArea, setCustomMaxArea] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [displayValue, setDisplayValue] = useState<string>('');

    // Khởi tạo giá trị từ URL khi component mount
    useEffect(() => {
        const areaParam = searchParams.get('area');
        if (areaParam) {
            setSelectedArea(areaParam);

            const [minStr, maxStr] = areaParam.split('-');
            const min = minStr ? parseAreaFromUrl(minStr) : 0;
            const max = maxStr ? parseAreaFromUrl(maxStr) : null;

            // Kiểm tra xem có phải là khoảng diện tích được định nghĩa sẵn không
            const predefinedRange = areaRanges.find(range => {
                const rangeMin = range.area.min;
                const rangeMax = range.area.max;

                if (rangeMax === null) {
                    return rangeMin === min && max === null;
                }

                return rangeMin === min && rangeMax === max;
            });

            if (predefinedRange) {
                setDisplayValue(predefinedRange.label);
            } else {
                // Đây là giá trị tùy chỉnh
                setDisplayValue(formatAreaForDisplay(min, max));
                setCustomMinArea(min.toString());
                setCustomMaxArea(max ? max.toString() : '');
            }
        }
    }, [searchParams]);

    // Xử lý khi chọn khoảng diện tích
    const handleAreaChange = (value: string) => {
        setSelectedArea(value);

        // Tìm và cập nhật giá trị hiển thị
        const [minStr, maxStr] = value.split('-');
        const min = minStr ? parseAreaFromUrl(minStr) : 0;
        const max = maxStr ? parseAreaFromUrl(maxStr) : null;

        const predefinedRange = areaRanges.find(range => {
            const rangeMin = range.area.min;
            const rangeMax = range.area.max;

            if (rangeMax === null) {
                return rangeMin === min && max === null;
            }

            return rangeMin === min && rangeMax === max;
        });

        if (predefinedRange) {
            setDisplayValue(predefinedRange.label);
        } else {
            setDisplayValue(formatAreaForDisplay(min, max));
        }

        // Cập nhật URL với giá trị mới
        updateUrl(value);
    };

    // Xử lý khi nhập diện tích tùy chỉnh
    const handleCustomAreaApply = () => {
        if (customMinArea || customMaxArea) {
            const min = customMinArea ? parseInt(customMinArea) : 0;
            const max = customMaxArea ? parseInt(customMaxArea) : null;

            const formattedValue = max
                ? `${formatAreaForUrl(min)}-${formatAreaForUrl(max)}`
                : `${formatAreaForUrl(min)}-`;

            setSelectedArea(formattedValue);

            // Cập nhật giá trị hiển thị
            setDisplayValue(formatAreaForDisplay(min, max));

            updateUrl(formattedValue);
        }
    };

    // Xử lý khi đặt lại toàn bộ
    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện lan tỏa
        
        // Reset các state
        setCustomMinArea('');
        setCustomMaxArea('');
        setSelectedArea('');
        setDisplayValue('');
        
        // Xóa query param area
        const params = new URLSearchParams(searchParams.toString());
        params.delete('area');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Cập nhật URL với giá trị mới
    const updateUrl = (areaValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (areaValue) {
            params.set('area', areaValue);
        } else {
            params.delete('area');
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div>
            <div className=''>
                <Select
                    value={selectedArea}
                    onValueChange={handleAreaChange}
                >
                    <SelectTrigger className={`${displayValue ? "border border-red-500 text-red-500" : ""} w-full sm:w-[200px]`}>
                        <SelectValue placeholder="Chọn diện tích">
                            {displayValue}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <div className='grid grid-cols-2 p-4 gap-4'>
                            <Input
                                type="number"
                                placeholder="Diện tích nhỏ nhất"
                                value={customMinArea}
                                onChange={(e) => setCustomMinArea(e.target.value)}
                            />
                            <Input
                                type="number"
                                placeholder="Diện tích lớn nhất"
                                value={customMaxArea}
                                onChange={(e) => setCustomMaxArea(e.target.value)}
                            />
                            <div className='flex gap-4'>
                                <Button
                                    className="min-w-full"
                                    onClick={handleCustomAreaApply}
                                >
                                    Áp dụng
                                </Button>
                                <Button
                                    className="min-w-full"
                                    variant="outline"
                                    onClick={handleReset}
                                >
                                    Đặt lại
                                </Button>
                            </div>
                        </div>
                        {areaRanges.map((areaRange: AreaI, index: number) => {
                            const min = areaRange.area.min;
                            const max = areaRange.area.max;
                            const formattedValue = max
                                ? `${formatAreaForUrl(min)}-${formatAreaForUrl(max)}`
                                : `${formatAreaForUrl(min)}-`;

                            return (
                                <SelectItem
                                    key={index}
                                    value={formattedValue}
                                >
                                    {areaRange.label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default FilterArea;
