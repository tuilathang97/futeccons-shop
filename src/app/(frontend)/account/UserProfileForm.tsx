"use client"
import { updateUser } from '@/actions/userActions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { PencilIcon, X } from 'lucide-react'
import React, { useState } from 'react'
import { convertImageToBase64, validateImageFile } from '@/lib/utils/imageUtils'

function UserProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name)
  const [number, setNumber] = useState(user.number)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null)
  const {toast} = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate the image file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          title: "Lỗi",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try{
      const res = await updateUser(user.id, { name ,number, image: image ? await convertImageToBase64(image) : ""})
      if(res.success){
        toast({
          title: "Thành công",
          description: res.message,
        })
      }
    } catch (e) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "destructive",
      })
      return e
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PencilIcon className="w-4 h-4" />
          Chỉnh sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Hãy sửa 1 hoặc nhiều thông tin cá nhân rồi nhấn nút lưu ở dưới để lưu
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Tên hiện tại
            </Label>
            <Input
              id="name"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              điện thoại
            </Label>
            <Input
              id="phoneNumber"
              defaultValue={number || ""}
              onChange={(e) => setNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Separator className="min-w-full h-1 bg-gray-200/50 " />
          <div className="flex items-center flex-col gap-4">
            <Label className="text-right">
              Ảnh đại diện
            </Label>
            <div className="flex items-center gap-2 w-full">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {imagePreview && (
                <X
                  className="cursor-pointer"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
              )}
            </div>
            {imagePreview && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className='min-w-full' type="submit" onClick={handleSubmit}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserProfileForm