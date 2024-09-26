'use client'

import { Button } from "@/components/ui/button"
import { signOut } from 'next-auth/react'

export default function SignOutButton() {
    return (
        <Button onClick={() => signOut()} className="mt-4 w-full">Sign Out</Button>
    )
}
