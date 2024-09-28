import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { Button } from "@/components/ui/button"
import { authOptions } from '@/lib/auth'

export default async function Home() {
    const session = await getServerSession(authOptions)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Welcome to Video Project Manager</h1>

            {session ? (
                <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
            ) : (
                <Link href="/login"><Button>Login</Button></Link>
            )}

        </div>
    )
}
