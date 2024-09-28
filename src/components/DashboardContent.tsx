'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { SearchIcon, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { CreateProjectDialog } from './CreateProjectDialog'
import { useToast } from "@/hooks/use-toast"
import { Project } from '@prisma/client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const ITEMS_PER_PAGE = 9

export default function DashboardContent() {
    const [projects, setProjects] = useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const { toast } = useToast()

    useEffect(() => {
        fetchProjects()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const filtered = projects.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredProjects(filtered)
        setCurrentPage(1)
    }, [searchQuery, projects])

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects')
            if (!response.ok) {
                throw new Error('Failed to fetch projects')
            }
            const data = await response.json()
            setProjects(data)
            setFilteredProjects(data)
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

    const handleDeleteProject = async () => {
        if (!deleteProjectId) return

        try {
            const response = await fetch(`/api/projects/${deleteProjectId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete project')
            }

            setProjects(projects.filter(project => project.id !== deleteProjectId))
            setFilteredProjects(filteredProjects.filter(project => project.id !== deleteProjectId))
            toast({
                title: "Success",
                description: "Project deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting project:', error)
            toast({
                title: "Error",
                description: "Failed to delete project. Please try again.",
                variant: "destructive",
            })
        } finally {
            setDeleteProjectId(null)
        }
    }

    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Projects</h2>
                <div className="flex space-x-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            className="pl-10 pr-4 py-2 rounded-full"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <CreateProjectDialog onProjectCreated={handleProjectCreated} />
                </div>
            </div>
            {isLoading ? (
                <p>Loading projects...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedProjects.map((project) => (
                            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 flex flex-col h-full ">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => setDeleteProjectId(project.id)}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p className="flex-grow text-gray-600 mb-4">{project.description}</p>
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
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
            <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project and all its associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500" onClick={handleDeleteProject}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
