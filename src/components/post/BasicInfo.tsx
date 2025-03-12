"use client"

import { FaqItem } from "../blocks/faq";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useFormContext } from "react-hook-form";
import { Province } from "types";
import { Post } from "./postSchema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";


const BasicInfo = ({ provinces, userId }: { provinces: Province[], userId: string }) => {
  const form = useFormContext<Post>();
  const [selectedProvince, selectedDistrict, selectedWard] = form.watch(["thanhPho", "quan", "phuong"]);
  const districts = provinces.find(province => province.name === selectedProvince)?.districts || [];
  const wards = districts.find(district => district.name === selectedDistrict)?.wards || [];
  const price = form.watch("giaTien")
  function currencyStringToNumber(currencyString:string) {
    // Define the Vietnamese locale
    const userLocale = 'vi-VN';

    // Remove any currency symbols and whitespace
    const cleanedString = currencyString.trim().replace(/^[^\d-]+/, '').replace(/[^\d.,\-]+$/, '');

    // Create a NumberFormat instance for parsing
    const numberFormat = new Intl.NumberFormat(userLocale);

    // Get the formatting options to determine decimal and group separators
    const formatParts = numberFormat.formatToParts(1234.5);
    const decimalSeparator = formatParts.find(part => part.type === 'decimal')?.value || ',';
    const groupSeparator = formatParts.find(part => part.type === 'group')?.value || '.';

    // Replace group separators (.) and normalize decimal separator (,)
    const normalizedString = cleanedString
      .replace(new RegExp(`\\${groupSeparator}`, 'g'), '') // Remove thousand separators
      .replace(decimalSeparator, '.'); // Replace the decimal separator with a dot for parsing

    // Parse the string to a number
    const number = parseFloat(normalizedString);

    // Check if the result is a valid number
    if (isNaN(number)) {
      throw new Error('Invalid number format');
    }

    return number;
  }

  // Example usage
  try {
    const result = currencyStringToNumber("1.234.567,89"); // Input in Vietnamese format
    console.log(result); // Output: 1234567.89
  } catch (error) {
    console.error(error);
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

  }, [selectedProvince, selectedDistrict, selectedWard, price]);
  return (
    <FaqItem
      question="Thông tin cơ bản"
      index={0}
      isFinish={false}
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

        {/* Phần địa chỉ */}
        <div className="col-span-3 w-full">
          <h3 className="text-lg font-medium mb-2">Thông tin địa chỉ</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="thanhPho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thành phố <span className="text-red-500">*</span></FormLabel>
                  <Select {...field} onValueChange={field.onChange} >
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
                  <Select disabled={selectedProvince ? false : true} {...field} onValueChange={field.onChange} value={field.value}>
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
                  <Select disabled={selectedDistrict ? false : true} {...field} onValueChange={field.onChange} value={field.value}>
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

        {/* Nhóm các trường số */}
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

        {/* Nội dung bài viết - chiếm toàn bộ chiều rộng */}
        <FormField
          control={form.control}
          name="noiDung"
          render={({ field }) => (
            <FormItem className="md:col-span-3 mt-4 w-full">
              <FormLabel>Nội dung bài viết <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về bất động sản của bạn..."
                  className="resize-none min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FaqItem>
  )
}

export default BasicInfo;
