'use client'

import Sidebar from "@/components/Sidebar"
import { Card, CardContent } from "@/components/ui/card"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                <Card className="h-full">
                    <CardContent className="p-6">
                        {children}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
