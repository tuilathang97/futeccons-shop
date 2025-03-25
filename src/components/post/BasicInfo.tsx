"use client"

import { FaqItem } from "../blocks/faq";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";
import { Province } from "types";
import { Post } from "./postSchema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useMemo } from "react";

const BasicInfo = ({ provinces, userId }: { provinces: Province[], userId: string }) => {
  const form = useFormContext<Post>();

  // Watch all required fields to determine section completion status
  const [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    duong,
    loaiHinhNhaO,
    giayToPhapLy,
    giaTien,
    dienTichDat,
    soTang,
    soPhongNgu,
    soPhongVeSinh
  ] = form.watch([
    "thanhPho",
    "quan",
    "phuong",
    "duong",
    "loaiHinhNhaO",
    "giayToPhapLy",
    "giaTien",
    "dienTichDat",
    "soTang",
    "soPhongNgu",
    "soPhongVeSinh"
  ]);

  const districts = provinces.find(province => province.name === selectedProvince)?.districts || [];
  const wards = districts.find(district => district.name === selectedDistrict)?.wards || [];

  // Check if the section is complete
  const isSectionComplete = useMemo(() => {
    // Check required string fields
    const isStringFieldsValid =
      Boolean(selectedProvince) &&
      Boolean(selectedDistrict) &&
      Boolean(selectedWard) &&
      Boolean(duong) &&
      Boolean(loaiHinhNhaO) &&
      Boolean(giayToPhapLy) &&
      Boolean(giaTien);

    // Check number fields with specific requirements
    const isDienTichDatValid =
      typeof dienTichDat === 'number' &&
      dienTichDat >= 10 &&
      dienTichDat <= 1000000;

    const isSoTangValid =
      typeof soTang === 'number' &&
      soTang <= 20;

    const isSoPhongNguValid =
      typeof soPhongNgu === 'number' &&
      soPhongNgu >= 1;

    const isSoPhongVeSinhValid =
      typeof soPhongVeSinh === 'number' &&
      soPhongVeSinh >= 1;

    // Return true only if all validations pass
    return isStringFieldsValid &&
      isDienTichDatValid &&
      isSoTangValid &&
      isSoPhongNguValid &&
      isSoPhongVeSinhValid;
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    duong,
    loaiHinhNhaO,
    giayToPhapLy,
    giaTien,
    dienTichDat,
    soTang,
    soPhongNgu,
    soPhongVeSinh
  ]);

  function handleCurrency(currencyString: string) {
    const withoutSeparators = currencyString.replace(/\./g, '');
    const normalizedString = withoutSeparators.replace(',', '.');
    const numValue = Number(normalizedString);
    if (!isNaN(numValue)) {
      return new Intl.NumberFormat("vi-VN").format(numValue)
    }
    form.setError("giaTien", { message: "giá tiền không được bao gồm chữ" })
    return ""
  }

  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find(p => p.name === selectedProvince);
      if (province) {
        form.setValue("thanhPhoCodeName", province.codename);
      }
    }

    if (selectedProvince && selectedDistrict) {
      const province = provinces.find(p => p.name === selectedProvince);
      const district = province?.districts.find(d => d.name === selectedDistrict);
      if (district) {
        form.setValue("quanCodeName", district.codename);
      }
    }
    if (selectedProvince && selectedDistrict && selectedWard) {
      const province = provinces.find(p => p.name === selectedProvince);
      const district = province?.districts.find(d => d.name === selectedDistrict);
      const ward = district?.wards.find(w => w.name === selectedWard);
      if (ward) {
        form.setValue("phuongCodeName", ward.codename);
      }
    }

  }, [selectedProvince, selectedDistrict, selectedWard, provinces, form]);

  return (
    <FaqItem
      question="Thông tin cơ bản"
      index={0}
      isFinish={isSectionComplete}
    >
      <div className="flex flex-col items-center justify-center md:grid md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input defaultValue={userId} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Section */}
        <div className="col-span-3 w-full">
          <h3 className="text-lg font-medium mb-2">Thông tin địa chỉ</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="thanhPho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thành phố <span className="text-red-500">*</span></FormLabel>
                  <Select {...field} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {provinces.map((province) => (
                          <SelectItem key={province.code} value={province.name}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* Hidden field for thanhPhoCodeName */}
                  <FormField
                    control={form.control}
                    name="thanhPhoCodeName"
                    render={({ field }) => (
                      <input
                        type="hidden"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/Huyện <span className="text-red-500">*</span></FormLabel>
                  <Select disabled={!selectedProvince} {...field} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {districts.map((district) => (
                          <SelectItem key={district.code} value={district.name}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* Hidden field for quanCodeName */}
                  <FormField
                    control={form.control}
                    name="quanCodeName"
                    render={({ field }) => (
                      <input
                        type="hidden"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phuong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/Xã <span className="text-red-500">*</span></FormLabel>
                  <Select disabled={!selectedDistrict} {...field} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {wards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.name}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* Hidden field for phuongCodeName */}
                  <FormField
                    control={form.control}
                    name="phuongCodeName"
                    render={({ field }) => (
                      <input
                        type="hidden"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Fields */}
        <FormField
          control={form.control}
          name="duong"
          render={({ field }) => (
            <FormItem className="w-full md:w-[200px]">
              <FormLabel className="w-full md:w-[200px]">Đường <span className="text-red-500">*</span></FormLabel>
              <Select {...field} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đường" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="duong-1">Đường 1</SelectItem>
                    <SelectItem value="duong-2">Đường 2</SelectItem>
                    <SelectItem value="duong-3">Đường 3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loaiHinhNhaO"
          render={({ field }) => (
            <FormItem className="w-full md:w-[200px]">
              <FormLabel>Loại hình nhà ở <span className="text-red-500">*</span></FormLabel>
              <Select {...field} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hình nhà ở" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="chung-cu">Chung cư</SelectItem>
                    <SelectItem value="nha-rieng">Nhà riêng</SelectItem>
                    <SelectItem value="dat">Đất</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="giayToPhapLy"
          render={({ field }) => (
            <FormItem className="w-full md:w-[200px]">
              <FormLabel>Giấy tờ pháp lý <span className="text-red-500">*</span></FormLabel>
              <Select {...field} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giấy tờ pháp lý" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="so-hong">Sổ hồng</SelectItem>
                    <SelectItem value="so-do">Sổ đỏ</SelectItem>
                    <SelectItem value="giay-to-khac">Giấy tờ khác</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Detailed Information Section */}
        <div className="col-span-3 w-full mt-4">
          <h3 className="text-lg font-medium mb-2">Thông tin chi tiết</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="giaTien"
              render={({ field: { ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Giá tiền <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập giá tiền"
                      type='currency'
                      value={handleCurrency(fieldProps.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dienTichDat"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Diện tích đất (m²) <span className="text-red-500">*</span> </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập diện tích"
                      type="number"
                      value={value ?? ''}
                      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soTang"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Số tầng</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập số tầng"
                      type="number"
                      value={value ?? ''}
                      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soPhongNgu"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Số phòng ngủ <span className="text-red-500">*</span> </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập số phòng ngủ"
                      type="number"
                      value={value ?? ''}
                      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soPhongVeSinh"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Số phòng vệ sinh <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập số phòng vệ sinh"
                      type="number"
                      value={value ?? ''}
                      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </FaqItem>
  )
}

export default BasicInfo;
