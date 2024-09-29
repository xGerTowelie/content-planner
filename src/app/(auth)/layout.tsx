"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Top bar for small devices */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-md">
                <h1 className="text-2xl font-bold">VidManager</h1>
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main content area */}
            <div className="flex flex-1 lg:overflow-hidden">
                {/* Sidebar for large devices */}
                <div className="hidden lg:block">
                    <Sidebar />
                </div>

                {/* Main content */}
                <main className="flex-1 p-6 lg:overflow-hidden">
                    <div className="h-full lg:hidden">
                        {children}
                    </div>
                    <Card className="p-4 hidden lg:block h-full">
                        {children}
                    </Card>
                </main>
            </div>
        </div>
    )
}
