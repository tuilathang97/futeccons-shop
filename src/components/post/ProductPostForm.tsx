"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { FaqSection } from "../blocks/faq";
import { Post, PostSchema } from "./postSchema";
import React from "react";
import { useImageUpload } from "@/contexts/ImageUploadContext";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createPost } from "@/actions/postActions";
import { useRouter } from "next/navigation";


export function ProductPostForm({ children }: { children: React.ReactNode }) {
  const [state, formAction] = useActionState(createPost, { success: false, message: "", data: null});
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { previews, previewsFiles, clearPreviews } = useImageUpload();
  const router = useRouter();
  const form = useForm<Post>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      level1Category: "",
      level2Category: "",
      level3Category: "",
      giaTien: 0,
      duong: "",
      phuong: "",
      quan: "",
      thanhPho: "",
      loaiHinhNhaO: "",
      dienTichDat: 0,
      soTang: 0,
      soPhongNgu: 0,
      soPhongVeSinh: 0,
      giayToPhapLy: "",
      noiDung: "",
      tieuDeBaiViet: ""
    },
  });
  useEffect(() => {
    if (state?.message)
      toast({
        description: state?.message,
      })
      if (state.success) { 
        form.reset();
        clearPreviews(); 
        setIsLoading(false);
      } else {
        setIsLoading(false);
        router.refresh()
      }
      return
  }, [state?.message])
  const handleSubmit = form.handleSubmit(async () => {
    setIsLoading(true);
    const formElement = formRef?.current;
    if (formElement) {
      const formData = new FormData(formElement);

      if (previewsFiles.length > 0) {
        previewsFiles.forEach((file, index) => {
          formData.append(`image${index}`, file);
        });

        formData.append('imagesCount', previewsFiles?.length?.toString());
      }

      startTransition(() => {
        formAction(formData);
        setIsLoading(false)
      });
    }
  });
  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full space-y-6"
      >
        <FaqSection
          title="Đăng Tin"
          description="Mua bán, cho thuê, sang nhượng bất động sản"
        >
          <div className="max-w-2xl flex flex-col mx-auto space-y-2">
            {children}
          </div>
        </FaqSection>
        <div className="w-full max-w-2xl py-6 mx-auto">
          <Button className="w-full flex items-center justify-center" type="submit" disabled={isLoading}>
            {isLoading ? <p className="flex items-center gap-2">Đang đăng tin...<Loader2 className="animate-spin" /></p> : "Đăng tin"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
