"use client"
import { updateUser, updateUserAvatar } from '@/actions/userActions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { PencilIcon, X } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { validateImageFile } from '@/lib/utils/imageUtils'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from '@/contexts/SessionContext'

function UserProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name)
  const [number, setNumber] = useState(user.number)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const { setUser } = useSession()
  
  const defaultUserInfo = {
    name: user?.name,
    number: user?.number || "",
    image: user?.image || null,
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
  if (!name && !number) {
    return <div>No user info</div>
  }

  const handleSubmit = async () => {
    if (name === defaultUserInfo.name && number === defaultUserInfo.number && !image) {
      toast({
        title: "Không thể thay đổi",
        description: "Không có thay đổi nào",
        variant: "destructive",
      })
      return
    }
    if (name.length > 15 || number?.length !== 10 || !number.startsWith("0") || name.length < 2) {
      toast({
        title: "Không thể thay đổi",
        description: "Tên và số điện thoại không hợp lệ",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        let avatarUploadSuccess = true;
        const updatedUserData = { ...user };
        
        // Upload avatar first if there's a new image
        if (image) {
          setIsUploadingAvatar(true);
          try {
            const formData = new FormData();
            formData.append('avatar', image);
            
            const avatarResult = await updateUserAvatar(formData);
            
            if (avatarResult.success) {
              // Update user in SessionContext with new avatar
              if (avatarResult.data && typeof avatarResult.data === 'object' && 'imageUrl' in avatarResult.data) {
                updatedUserData.image = avatarResult.data.imageUrl as string;
              }
              // Clear the preview and file after successful upload
              setImage(null);
              setImagePreview(null);
              
              toast({
                title: "Thành công",
                description: "Cập nhật ảnh đại diện thành công",
              });
            } else {
              avatarUploadSuccess = false;
              toast({
                title: "Lỗi",
                description: avatarResult.message,
                variant: "destructive",
              });
            }
          } catch (err) {
            console.error('Avatar upload error:', err);
            avatarUploadSuccess = false;
            toast({
              title: "Lỗi",
              description: "Có lỗi xảy ra khi cập nhật ảnh đại diện",
              variant: "destructive",
            });
          } finally {
            setIsUploadingAvatar(false);
          }
        }

        // Update name and number if they changed and avatar upload was successful (or no avatar to upload)
        if (avatarUploadSuccess && (name !== defaultUserInfo.name || number !== defaultUserInfo.number)) {
          const res = await updateUser(user.id, { name, number });
          if (res.success) {
            // Update user data with new name and number
            updatedUserData.name = name;
            updatedUserData.number = number;
            
            toast({
              title: "Thành công",
              description: res.message,
            });
          } else {
            toast({
              title: "Lỗi",
              description: res.message,
              variant: "destructive",
            });
            return; // Exit early if user info update failed
          }
        }
        
        if (avatarUploadSuccess) {
          setUser(updatedUserData);
          router.refresh();
        }
      } catch (err) {
        console.error('User update error:', err);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi cập nhật thông tin",
          variant: "destructive",
        });
      }
    });
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
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              defaultValue={number || ""}
              onChange={(e) => setNumber(e.target.value)}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
          <div className="flex items-center flex-col gap-4">
            <div className="flex items-center gap-2 w-full">
              <Input
                id="image"
                type="file"
                accept="image/*"
                placeholder="Chọn ảnh đại diện mới"
                onChange={handleImageChange}
                className="w-full"
                disabled={isUploadingAvatar || isPending}
              />
              {imagePreview && (
                <X
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
              )}
            </div>
            <Label className="text-center">
              Ảnh đại diện
            </Label>

            {/* Current Avatar Display */}
            <div className='flex items-center gap-2'>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={user.image || ""}
                      alt="Current avatar"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xs text-gray-500">Ảnh hiện tại</p>
              </div>
              {imagePreview && (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-xs text-blue-600">Ảnh xem trước</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button 
              className='min-w-full' 
              type="submit" 
              onClick={handleSubmit}
              disabled={isPending || isUploadingAvatar}
            >
              {isPending || isUploadingAvatar ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserProfileForm 