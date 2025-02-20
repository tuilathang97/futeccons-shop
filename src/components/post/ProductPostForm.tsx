"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { useRef } from "react"
import { signUp } from "@/actions/authActions"
import { FaqSection } from "../blocks/faq"
import { Post, PostSchema } from "./postSchema"
import React from "react"


export function ProductPostForm({ children }: {children: React.ReactNode}) {
  // const [state, formAction] = useActionState(signUp, {message: ""});
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<Post>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
    },
  });

  return (
    <Form {...form}>
      <form 
        ref={formRef}
        action={(formData) => signUp(formData)}
        className="w-full space-y-6">
        <FaqSection
          title="Đăng Tin"
          description="Mua bán, cho thuê, sang nhượng bất động sản"
        >
          <div className="max-w-2xl mx-auto space-y-2">
            {
              children
            }
          </div>
        </FaqSection>
        <Button className="mt-14" type="submit">Đăng tin</Button>
      </form>
    </Form>
  )
}
