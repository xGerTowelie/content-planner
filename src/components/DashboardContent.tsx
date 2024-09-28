'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { CreateProjectDialog } from './CreateProjectDialog'
import { useToast } from "@/hooks/use-toast"
import { Project } from '@prisma/client'

export default function DashboardContent() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetchProjects()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects')
            if (!response.ok) {
                throw new Error('Failed to fetch projects')
            }
            const data = await response.json()
            setProjects(data)
        } catch (error) {
            console.error('Error fetching projects:', error)
            toast({
                title: "Error",
                description: "Failed to load projects. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleProjectCreated = (newProject: Project) => {
        setProjects([...projects, newProject])
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Projects</h2>
                <div className="flex space-x-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input className="pl-10 pr-4 py-2 rounded-full" placeholder="Search projects..." />
                    </div>
                    <CreateProjectDialog onProjectCreated={handleProjectCreated} />
                </div>
            </div>
            {isLoading ? (
                <p>Loading projects...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-green-600">{project.status}</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(project.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}
