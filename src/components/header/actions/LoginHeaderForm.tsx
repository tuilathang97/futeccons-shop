import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

function LoginHeaderForm() {    
    return (
        <div>
            <Link href="/auth/sign-in">
                <Button>
                    Đăng nhập
                </Button>
            </Link>
        </div>
    )
}

export default LoginHeaderForm
