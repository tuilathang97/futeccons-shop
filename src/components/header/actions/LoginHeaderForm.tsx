import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

function LoginHeaderForm() {    
    return (
        <div>
            <Link href="/dang-nhap">
                <Button variant="secondary">
                    Đăng nhập
                </Button>
            </Link>
        </div>
    )
}

export default LoginHeaderForm
