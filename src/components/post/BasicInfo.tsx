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
    soPhongVeSinh,
    chieuNgang,
    chieuDai
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
    "soPhongVeSinh",
    "chieuNgang",
    "chieuDai"
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

    const isChieuNgangValid = Boolean(chieuNgang);
    const isChieuDaiValid = Boolean(chieuDai);

    // Return true only if all validations pass
    return isStringFieldsValid &&
      isDienTichDatValid &&
      isSoTangValid &&
      isSoPhongNguValid &&
      isSoPhongVeSinhValid &&
      isChieuNgangValid &&
      isChieuDaiValid;
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
    soPhongVeSinh,
    chieuNgang,
    chieuDai
  ]);

  // Handle currency conversion for display and storage
  function formatCurrency(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    // Convert to string if it's a number
    const stringValue = typeof value === 'number' ? value.toString() : value;

    // Remove any non-numeric characters
    const numericValue = stringValue.replace(/[^\d]/g, '');

    // Convert to number and format
    const number = Number(numericValue);
    if (isNaN(number)) return '';

    return new Intl.NumberFormat("vi-VN").format(number);
  }

  function parseCurrency(formattedValue: string): number {
    // Remove all dots and replace comma with dot for decimal
    const numericString = formattedValue.replace(/\./g, '');
    const number = Number(numericString);
    return isNaN(number) ? 0 : number;
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
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem className="w-full md:w-[200px]">
              <FormLabel className="w-full md:w-[200px]">Đường <span className="text-red-500">*</span></FormLabel>

              <Input
                {...fieldProps}
                placeholder="Nhập tên đường"
                type="text"
                onChange={(e) => onChange(e.target.value === '' ? '' : e.target.value)}
              />
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
                    <SelectItem value="Chung cư">Chung cư</SelectItem>
                    <SelectItem value="Nhà riêng">Nhà riêng</SelectItem>
                    <SelectItem value="Đất">Đất</SelectItem>
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
                    <SelectItem value="Sổ hồng">Sổ hồng</SelectItem>
                    <SelectItem value="Sổ đỏ">Sổ đỏ</SelectItem>
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
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Giá tiền <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập giá tiền"
                      value={formatCurrency(value)}
                      onChange={(e) => {
                        const formatted = e.target.value.replace(/[^\d.]/g, '');
                        const numericValue = parseCurrency(formatted);
                        onChange(numericValue);
                      }}
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
              name="dienTichSuDung"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Diện tích sử dụng (m²) </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập diện tích sử dụng"
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
              name="chieuNgang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chiều ngang (m) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập chiều ngang"
                      type="number"
                      onChange={(e) => {
                        field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chieuDai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chiều dài (m) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập chiều dài"
                      type="number"
                      onChange={(e) => {
                        field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="huongCuaChinh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hướng cửa chính <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hướng cửa chính" />
                          <span className="text-red-500">*</span>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent >
                        <SelectGroup>
                          <SelectItem value="Đông">Đông</SelectItem>
                          <SelectItem value="Tây">Tây</SelectItem>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Bắc">Bắc</SelectItem>
                          <SelectItem value="Đông Bắc">Đông Bắc</SelectItem>
                          <SelectItem value="Đông Nam">Đông Nam</SelectItem>
                          <SelectItem value="Tây Bắc">Tây Bắc</SelectItem>
                          <SelectItem value="Tây Nam">Tây Nam</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
