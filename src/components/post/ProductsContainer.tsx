import React from 'react'
import ProductCard from '../products/ProductCard'
import { Post } from './postSchema'

function convertCurrency(valueStr: string) {
    if (valueStr.includes("tr")) {
        return valueStr.replace("tr", "000000");
    } else if (valueStr.includes("ty") || valueStr.includes("tỷ")) {
        return valueStr.replace("ty", "000000000").replace("tỷ", "000000000");
    } else {
        return valueStr;
    }
}

function handleFormatPriceToNumber({ gia }: { gia: string }) {
    if (!gia) { return }
    const parts = gia.split("-");
    if (parts)
        return {
            min: Number(convertCurrency(parts[0])),
            max: Number(convertCurrency(parts[1]))
        }
    return null
}

// TODO: fix type
function ProductsContainer({ data, searchParam,cardVariant="vertical" }: { data: any[], searchParam: any,cardVariant?:"horizontal" | "vertical" }) {

    if (!data || data.length === 0) {
        return <div>Không có bài viết phù hợp với yêu cầu </div>
    }

    const { gia, area, bedrooms, phuong, quan, thanhPho } = searchParam
    const formatedPrice = handleFormatPriceToNumber({ gia })

    const filteredResult = data?.filter((post: Post) => {
        let areaCondition = true;
        let bedroomsCondition = true;
        let priceCondition = true;
        let locationCondition = true;
        if (area) {
            const [minArea, maxArea] = area.split("-").map(Number);
            if (minArea && maxArea) {
                areaCondition = Number(post.dienTichDat) >= minArea && Number(post.dienTichDat) <= maxArea;
            } else if (minArea) {
                areaCondition = Number(post.dienTichDat) >= minArea;
            } else {
                areaCondition = false;
            }
        }

        if (bedrooms) {
            if (bedrooms === "5+") {
                bedroomsCondition = post.soPhongNgu > 5;
            } else {
                bedroomsCondition = post.soPhongNgu === Number(bedrooms);
            }
        }

        if (gia && formatedPrice) {
            priceCondition = Number(post.giaTien) >= formatedPrice.min &&
                Number(post.giaTien) <= formatedPrice.max;
        }

        if (thanhPho || quan || phuong) {
            locationCondition = true;
            if (thanhPho) {
                locationCondition = locationCondition && post.thanhPhoCodeName === thanhPho;
            }
            if (quan) {
                locationCondition = locationCondition && post.quanCodeName === quan;
            }
            if (phuong) {
                locationCondition = locationCondition && post.phuongCodeName === phuong;
            }
        }
        return areaCondition && bedroomsCondition && priceCondition && locationCondition;
    });

    return (
        <div className="flex flex-col col-span-4 gap-4 py-4 min-h-fit">
            {filteredResult && filteredResult.length > 0 ? filteredResult.map((data: Post, index: number) => {
                return (
                    <ProductCard variant={cardVariant} post={data} key={index} />
                )
            }) : <div>Không có bài viết phù hợp với yêu cầu </div>
            }
        </div>
    )
}

export default ProductsContainer