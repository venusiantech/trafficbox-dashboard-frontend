'use client'
import React from 'react'
import AuthInit from './auth-init'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AuthInit />
            {children}
        </>
    )
}

export default AuthProvider