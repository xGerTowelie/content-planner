import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { Button } from "@/components/ui/button"
import { authOptions } from '@/lib/auth'

export default async function Home() {
    const session = await getServerSession(authOptions)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Content Planner!</h1>
            <h2 className="text-2xl font-semibold mb-8 text-center">Nice to have you here  ✌️😊</h2>

            {session ? (
                <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
            ) : (
                <Link href="/login"><Button className="text-2xl py-6 px-8 md:text-lg md:px-4 md:py-2">Login</Button></Link>
            )}

        </div>
    )
}
