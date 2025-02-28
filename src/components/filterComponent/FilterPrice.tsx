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
import { EstatePriceRanges, estateRentPriceRanges } from '@/constants/data'
import { Button } from '../ui/button'

interface PriceI {
    label: string
    value: { min?: number, max?: number | null }
}



// Hàm chuyển đổi giá trị số thành định dạng URL dễ đọc
function formatPriceForUrl(price?: number): string {
    if (!price) return '0';
    if (price >= 1000000000) {
        return `${Math.floor(price / 1000000000)}ty`
    } else if (price >= 1000000) {
        return `${Math.floor(price / 1000000)}tr`
    }
    return price.toString()
}

// Hàm phân tích giá trị từ URL về số
function parsePriceFromUrl(priceStr: string): number {
    if (priceStr.includes('ty')) {
        return parseInt(priceStr.replace('ty', '')) * 1000000000
    } else if (priceStr.includes('tr')) {
        return parseInt(priceStr.replace('tr', '')) * 1000000
    }
    return parseInt(priceStr)
}

// Hàm hiển thị giá trị đẹp hơn cho người dùng
function formatPriceForDisplay(min: number, max?: number | null): string {
    if (min === 0 && max) {
        return `Dưới ${formatPriceValue(max)}`
    } else if (max === null || max === 1000000000000) {
        return `Trên ${formatPriceValue(min)}`
    } else if (max) {
        return `${formatPriceValue(min)} - ${formatPriceValue(max)}`
    }
    return formatPriceValue(min)
}

function formatPriceValue(value: number): string {
    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(value % 1000000000 === 0 ? 0 : 1)} tỷ`
    } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)} triệu`
    }
    return value.toLocaleString('vi-VN')
}

interface FilterPriceProps {
    priceType: 'sale' | 'rent';
}

function FilterPrice({ priceType }: FilterPriceProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [customMinPrice, setCustomMinPrice] = useState<string>('')
    const [customMaxPrice, setCustomMaxPrice] = useState<string>('')
    const [selectedPrice, setSelectedPrice] = useState<string>('')
    const [displayValue, setDisplayValue] = useState<string>('')

    // Select the appropriate price ranges based on the type
    const priceRanges = priceType === 'sale' ? EstatePriceRanges : estateRentPriceRanges

    // Khởi tạo giá trị từ URL khi component mount
    useEffect(() => {
        const priceParam = searchParams.get('price')
        if (priceParam) {
            setSelectedPrice(priceParam)

            const [minStr, maxStr] = priceParam.split('-')
            const min = minStr ? parsePriceFromUrl(minStr) : 0
            const max = maxStr ? parsePriceFromUrl(maxStr) : (priceType === 'sale' ? 1000000000000 : null)

            // Kiểm tra xem có phải là khoảng giá được định nghĩa sẵn không
            const predefinedRange = priceRanges.find(range => {
                const rangeMin = range.value.min || 0;
                const rangeMax = range.value.max === null ? null : (range.value.max || (priceType === 'sale' ? 1000000000000 : null));

                if (rangeMax === null) {
                    return rangeMin === min && max === null;
                }

                return rangeMin === min && rangeMax === max;
            });

            if (predefinedRange) {
                setDisplayValue(predefinedRange.label)
            } else {
                // Đây là giá trị tùy chỉnh
                setDisplayValue(formatPriceForDisplay(min, max))
                setCustomMinPrice(min.toString())
                setCustomMaxPrice(max ? max.toString() : '')
            }
        }
    }, [searchParams, priceType, priceRanges])

    // Xử lý khi chọn khoảng giá
    const handlePriceChange = (value: string) => {
        setSelectedPrice(value)

        // Tìm và cập nhật giá trị hiển thị
        const [minStr, maxStr] = value.split('-')
        const min = minStr ? parsePriceFromUrl(minStr) : 0
        const max = maxStr ? parsePriceFromUrl(maxStr) : (priceType === 'sale' ? 1000000000000 : null)

        const predefinedRange = priceRanges.find(range => {
            const rangeMin = range.value.min || 0;
            const rangeMax = range.value.max === null ? null : (range.value.max || (priceType === 'sale' ? 1000000000000 : null));

            if (rangeMax === null) {
                return rangeMin === min && max === null;
            }

            return rangeMin === min && rangeMax === max;
        });

        if (predefinedRange) {
            setDisplayValue(predefinedRange.label)
        } else {
            setDisplayValue(formatPriceForDisplay(min, max))
        }

        // Cập nhật URL với giá trị mới
        updateUrl(value)
    }
    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện lan tỏa
        
        // Reset các state
        setCustomMinPrice('');
        setCustomMaxPrice('');
        setSelectedPrice('');
        setDisplayValue('');
        
        // Xóa query param price
        const params = new URLSearchParams(searchParams.toString());
        params.delete('price');
        router.push(`?${params.toString()}`, { scroll: false });
    }
    

    // Xử lý khi nhập giá tùy chỉnh
    const handleCustomPriceApply = () => {
        if (customMinPrice || customMaxPrice) {
            const min = customMinPrice ? parseInt(customMinPrice) : 0
            const max = customMaxPrice ? parseInt(customMaxPrice) : (priceType === 'sale' ? 1000000000000 : null)

            const formattedValue = max
                ? `${formatPriceForUrl(min)}-${formatPriceForUrl(max)}`
                : `${formatPriceForUrl(min)}-`;

            setSelectedPrice(formattedValue)

            // Cập nhật giá trị hiển thị
            setDisplayValue(formatPriceForDisplay(min, max))

            updateUrl(formattedValue)
        }
    }

    // Cập nhật URL với giá trị mới
    const updateUrl = (priceValue: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (priceValue) {
            params.set('price', priceValue)
        } else {
            params.delete('price')
        }

        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div>
            <div className=''>
                <Select
                    value={selectedPrice}
                    onValueChange={handlePriceChange}
                >
                    <SelectTrigger className={`${displayValue ? "border border-red-500 text-red-500" : ""} w-full sm:w-[200px]`}>
                        <SelectValue placeholder="Chọn giá">
                            {displayValue}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <div className='grid grid-cols-2 p-4 gap-4'>
                            <Input
                                type="number"
                                placeholder="Giá thấp nhất"
                                value={customMinPrice}
                                onChange={(e) => setCustomMinPrice(e.target.value)}
                            />
                            <Input
                                type="number"
                                placeholder="Giá cao nhất"
                                value={customMaxPrice}
                                onChange={(e) => setCustomMaxPrice(e.target.value)}
                            />
                            <div className='flex gap-4'>
                                <Button
                                className='min-w-full'
                                    onClick={handleCustomPriceApply}
                                >
                                    Áp dụng
                                </Button>
                                <Button
                                    onClick={(e) => handleReset(e)}
                                    className='min-w-full'
                                >
                                    Đặt lại
                                </Button>
                            </div>
                        </div>
                        {priceRanges.map((price: PriceI, index: number) => {
                            const min = price.value.min || 0
                            const max = price.value.max
                            const formattedValue = max
                                ? `${formatPriceForUrl(min)}-${formatPriceForUrl(max)}`
                                : `${formatPriceForUrl(min)}-`;

                            return (
                                <SelectItem
                                    key={index}
                                    value={formattedValue}
                                >
                                    {price.label}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default FilterPrice
