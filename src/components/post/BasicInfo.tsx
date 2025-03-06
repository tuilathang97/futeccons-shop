"use client"

import { FaqItem } from "../blocks/faq";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useFormContext } from "react-hook-form";
import { Province } from "types";
import { Post } from "./postSchema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const BasicInfo = ({ provinces }: { provinces: Province[] }) => {
  const form = useFormContext<Post>();
  const [selectedProvince, selectedDistrict] = form.watch(["thanhPho", "quan"]);
  
  const districts = provinces.find(province => province.name === selectedProvince)?.districts || [];
  const wards = districts.find(district => district.name === selectedDistrict)?.wards || [];
  return (
    <FaqItem
      question="Thông tin cơ bản"
      index={0}
      isFinish={false}
    >
      <div className="flex flex-col items-center justify-center md:grid md:grid-cols-3 gap-4">
        {/* Phần địa chỉ */}
        <div className="col-span-3 w-full">
          <h3 className="text-lg font-medium mb-2">Thông tin địa chỉ</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="thanhPho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thành phố</FormLabel>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/Huyện</FormLabel>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phuong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/Xã</FormLabel>
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
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Thông tin loại hình */}
        <FormField
          control={form.control}
          name="duong"
          render={({ field }) => (
            <FormItem className="w-full md:w-[200px]">
              <FormLabel className="w-full md:w-[200px]">Đường</FormLabel>
              <Select {...field} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đường" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {/* Thay thế danh sách đường bằng dữ liệu thực tế */}
                    <SelectItem value="duong-1">Đường 1</SelectItem>
                    <SelectItem value="duong-2">Đường 2</SelectItem>
                    <SelectItem value="duong-3">Đường 3</SelectItem>
                    {/* Thêm các đường khác nếu có */}
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
              <FormLabel>Loại hình nhà ở</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
              <FormLabel>Giấy tờ pháp lý</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Giá tiền</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Nhập giá tiền"
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
              name="dienTichDat"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Diện tích đất (m²)</FormLabel>
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
                  <FormLabel>Số phòng ngủ</FormLabel>
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
                  <FormLabel>Số phòng vệ sinh</FormLabel>
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
              <FormLabel>Nội dung bài viết</FormLabel>
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

