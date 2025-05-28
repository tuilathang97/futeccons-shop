"use client"

import { queryMappingString } from "../filterComponent/FilteredProvinces";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function useSelectAddress() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
  
    const handleSelectAddress = (thanhPho: string, quan?: string, phuong?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      params.delete(queryMappingString.thanhPho);
      params.delete(queryMappingString.quan);
      params.delete(queryMappingString.phuong);
      
      if (thanhPho) {
        params.set(queryMappingString.thanhPho, thanhPho);
        if (quan) {
          params.set(queryMappingString.quan, quan);
          if (phuong) {
            params.set(queryMappingString.phuong, phuong);
          }
        }
      }
      
      router.push(`${pathname}?${params.toString()}`);
    };
  
    return { handleSelectAddress };
  }