import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link";

function RegisterForm() {

    return (
        <div>
            <Link href="/dang-ky">
                <Button variant="secondary">
                    Đăng ký
                </Button>
            </Link>
        </div>
    )
}

export default RegisterForm