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



function formatPriceForUrl(price?: number): string {
    if (!price) return '0';
    if (price >= 1000000000) {
        return `${Math.floor(price / 1000000000)}ty`
    } else if (price >= 1000000) {
        return `${Math.floor(price / 1000000)}tr`
    }
    return price.toString()
}

function parsePriceFromUrl(priceStr: string): number {
    if (priceStr.includes('ty')) {
        return parseInt(priceStr.replace('ty', '')) * 1000000000
    } else if (priceStr.includes('tr')) {
        return parseInt(priceStr.replace('tr', '')) * 1000000
    }
    return parseInt(priceStr)
}

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
    const price = searchParams.has("gia")
    const priceRanges = priceType === 'sale' ? EstatePriceRanges : estateRentPriceRanges

    useEffect(() => {
        const priceParam = searchParams.get('gia')
        if (priceParam) {
            setSelectedPrice(priceParam)

            const [minStr, maxStr] = priceParam.split('-')
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
                console.log(setSelectedPrice)
                setDisplayValue(formatPriceForDisplay(min, max))
                setCustomMinPrice(min.toString())
                setCustomMaxPrice(max ? max.toString() : '')
            }
        }
        setSelectedPrice("Chọn giá")
    }, [searchParams, priceType, priceRanges,price])

    const handlePriceChange = (value: string) => {
        setSelectedPrice(value)

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

        updateUrl(value)
    }
    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        setCustomMinPrice('');
        setCustomMaxPrice('');
        setSelectedPrice('');
        setDisplayValue('');
        
        const params = new URLSearchParams(searchParams.toString());
        params.delete('gia');
        router.push(`?${params.toString()}`, { scroll: false });
    }
    

    const handleCustomPriceApply = () => {
        if (customMinPrice || customMaxPrice) {
            const min = customMinPrice ? parseInt(customMinPrice) : 0
            const max = customMaxPrice ? parseInt(customMaxPrice) : (priceType === 'sale' ? 1000000000000 : null)

            const formattedValue = max
                ? `${formatPriceForUrl(min)}-${formatPriceForUrl(max)}`
                : `${formatPriceForUrl(min)}-`;

            setSelectedPrice(formattedValue)

            setDisplayValue(formatPriceForDisplay(min, max))

            updateUrl(formattedValue)
        }
    }

    const updateUrl = (priceValue: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (priceValue) {
            params.set('gia', priceValue)
        } else {
            params.delete('gia')
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
                    <SelectTrigger className={`${displayValue && price ? "border border-red-500 text-red-500" : ""} w-full sm:w-[200px]`}>
                        <SelectValue placeholder="Chọn giá">
                            {price ? displayValue : "Chọn giá"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <div className='grid grid-cols-2 gap-4 p-4'>
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
