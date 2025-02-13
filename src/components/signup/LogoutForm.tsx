"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormMessage,
} from "@/components/ui/form"
import { signInSchema } from "./authSchema"
import { useActionState, useRef } from "react"
import { login, logout } from "@/actions/authActions"


export function LogoutForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  })

  return (
    <Form {...form}>
      <form 
        ref={formRef}
        action={() => logout()}
        className="w-2/3 space-y-6">
        <Button className="mt-14" type="submit">Đăng xuất</Button>
      </form>
    </Form>
  )
}
