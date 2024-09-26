import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import SessionProvider from "@/components/SessionProvider"
import { authOptions } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    {children}
                </SessionProvider>
                <Toaster position="top-right" />
            </body>
        </html>
    )
}
