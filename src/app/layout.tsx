import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import SessionProvider from "@/components/SessionProvider"
import { authOptions } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang="en">
            <body className={cn(inter.className, "bg-gray-100")}>
                <SessionProvider session={session}>
                    {children}
                </SessionProvider>
                <div className="fixed top-0 right-0">
                    <Toaster />
                </div>
            </body>
        </html>
    )
}
