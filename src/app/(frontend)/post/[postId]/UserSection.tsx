'use client'
import PostSectionWrapper from "@/components/postSectionWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const UserSection = ({user}: {user: User}) => {
  const [isHiddenPhoneNumber, setIsHiddenPhoneNumber] = useState(true)
  const {toast} = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.number || "");
      return {success: true, message: "Đã copy số điện thoại"}
    } catch (err) {
      return {success: false, message: "Không thể copy số điện thoại" + err}
    }
  };

  const handleShowPhoneNumber = async () => {
    setIsHiddenPhoneNumber(!isHiddenPhoneNumber)
    if(!isHiddenPhoneNumber){
      const isCopied = await handleCopy()
      if(isCopied.success) {
        toast({
          title: isCopied.message,
          description: "Đã copy số điện thoại",
          variant: "success"
        })
      }
    }
  }

  return (
    <PostSectionWrapper className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <Avatar>
          <div className='flex'>
            <AvatarImage className='object-cover' src={user.image || ""} alt="user_avatar" />
            <AvatarFallback>User</AvatarFallback>
          </div>
        </Avatar>
        <div className="flex flex-col gap-1">
          <p className='text-base font-semibold'>{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</p>
          <Link href={`/user/${user.id}`} className='text-sm text-gray-500'>Ấn để xem trang cá nhân</Link>
        </div>
      </div>
      <Separator className='w-full' />
      <Button variant={"outline"} onClick={handleShowPhoneNumber}>
        <Phone />
        {isHiddenPhoneNumber ? "Bấm để hiện số" : user.number}
      </Button>
      <Button variant={"outline"} className="w-full">Nhắn tin với {user.name}</Button>
    </PostSectionWrapper>
  );
};

export default UserSection;