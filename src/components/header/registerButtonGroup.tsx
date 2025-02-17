import React from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '../ui/input'
import { Label } from '../ui/label'

function RegisterButtonGroup() {
    return (
        <div className='flex gap-2'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Login</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-4 flex flex-col gap-2 min-w-[300px]'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='header-username-input'>User name</Label>
                        <Input id="header-username-input" type='text' placeholder='Input user name'></Input>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='header-password-input'>Password</Label>
                        <Input id="header-password-input" type='text' placeholder='Input password'></Input>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <Button variant={"outline"}>Login</Button>
                        <Button variant={"outline"}>Forgot password ?</Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Register</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-4 flex gap-2 flex-col min-w-[300px]'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='header-username-register-input'>User name</Label>
                        <Input id="header-username-register-input" type='text' placeholder='Input user name'></Input>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='header-password-register-input'>Password</Label>
                        <Input id="header-password-register-input" type='text' placeholder='Input password'></Input>
                    </div>
                    <Button variant={"outline"}>Register</Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default RegisterButtonGroup


