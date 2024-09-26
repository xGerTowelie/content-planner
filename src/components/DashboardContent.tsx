'use client'

import { Input } from "@/components/ui/input"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardContent() {
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Projects</h2>
                <div className="flex space-x-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input className="pl-10 pr-4 py-2 rounded-full" placeholder="Search projects..." />
                    </div>
                    <Button className="rounded-full">
                        <PlusIcon className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Link key={i} href={`/dashboard/projects/${i + 1}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-2">Project {i + 1}</h3>
                                <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-green-600">Completed</span>
                                    <span className="text-sm text-gray-500">2 days ago</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    )
}
