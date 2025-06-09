import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link";

function RegisterForm() {

    return (
        <div>
            <Link href="/auth/sign-up">
                <Button>
                    Đăng ký
                </Button>
            </Link>
        </div>
    )
}

export default RegisterForm