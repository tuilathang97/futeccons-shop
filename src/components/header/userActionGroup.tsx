import React from 'react'
import LoginHeaderForm from "./actions/LoginHeaderForm"
import RegisterForm from "./actions/RegisterForm"


function UserActionGroup() {
    return (
        <div className='flex gap-2'>
            <LoginHeaderForm/>
            <RegisterForm/>
        </div>
    )
}

export default UserActionGroup


