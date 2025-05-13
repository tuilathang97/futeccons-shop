"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { createPost } from "@/actions/authActions";
import { FaqSection } from "../blocks/faq";
import { Post, PostSchema } from "./postSchema";
import React from "react";
import { useImageUpload } from "@/contexts/ImageUploadContext";
import { toast } from "@/hooks/use-toast";


export function ProductPostForm({ children }: { children: React.ReactNode }) {
  const [state, formAction] = useActionState(createPost, { message: "" });
  const formRef = useRef<HTMLFormElement>(null);
  
  const { previews, previewsFiles } = useImageUpload();

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
    if (state.message)
      toast({
        description: state.message,
      })
    return
  }, [state.message])
  const handleSubmit = form.handleSubmit(async (data) => {
    const formElement = formRef?.current;
    if (formElement) {
      const formData = new FormData(formElement);
      
      if (previewsFiles.length > 0) {
        previewsFiles.forEach((file, index) => {
          formData.append(`image${index}`, file);
        });
        
        formData.append('imagesCount', previewsFiles.length.toString());
      }
      
      startTransition(() => {
        formAction(formData);
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
          <Button  className="w-full" type="submit">
            Đăng tin
          </Button>
        </div>
      </form>
    </Form>
  );
}
