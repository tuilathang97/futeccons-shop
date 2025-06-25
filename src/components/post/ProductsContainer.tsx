import React from 'react'
import ProductCard from '../products/ProductCard'
import { Post } from '@/db/schema'
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

function ProductsContainer({ data, searchParam }: { data: Post[], searchParam: {
    gia?: string,
    area?: string,
    bedrooms?: string,
    thanhPho?: string,
    quan?: string,
    phuong?: string,
}  }) {  
    if (!data || data.length === 0) {
        return <div>Không có bài viết phù hợp với yêu cầu </div>
    }

    const { gia, area, bedrooms,thanhPho,quan,phuong } = searchParam
    const formatedPrice = handleFormatPriceToNumber({ gia: gia || "" })

    const filteredResult = data?.filter((post: Post) => {
        let areaCondition = true;
        let bedroomsCondition = true;
        let priceCondition = true;
        let thanhPhoCondition = true;
        let quanCondition = true;
        let phuongCondition = true;
        if(thanhPho){
            thanhPhoCondition = post.thanhPhoCodeName === thanhPho;
        }
        if(quan){
            quanCondition = post.quanCodeName === quan;
        }
        if(phuong){
            phuongCondition = post.phuongCodeName === phuong;
        }
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

        return areaCondition && bedroomsCondition && priceCondition && thanhPhoCondition && quanCondition && phuongCondition;
    });
    return (
        <div className={`flex flex-col col-span-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-h-fit`}>
            {filteredResult && filteredResult.length > 0 ? filteredResult.map((data: Post, index: number) => {
                return (
                    <ProductCard post={data} key={index} />
                )
            }) : <div>Không có bài viết phù hợp với yêu cầu </div>
            }
        </div>
    )
}

export default ProductsContainer