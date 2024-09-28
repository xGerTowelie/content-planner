'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, CheckCircleIcon, ClockIcon, FileIcon, PickaxeIcon, PlusIcon, SquarePenIcon, UsersIcon } from "lucide-react"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Step } from '@prisma/client'


interface Project {
    id: string
    name: string
    description: string | null
    status: string
    createdAt: string
    updatedAt: string
    steps: Step[]
}

export default function ProjectDisplay({ projectId }: { projectId: string }) {
    const [project, setProject] = useState<Project | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isNewStepDialogOpen, setIsNewStepDialogOpen] = useState(false)
    const [newStepTitle, setNewStepTitle] = useState('')
    const [newStepDescription, setNewStepDescription] = useState('')
    const [newStepStatus, setNewStepStatus] = useState('upcoming')
    const { toast } = useToast()

    useEffect(() => {
        fetchProject()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId])

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch project')
            }
            const data = await response.json()
            setProject(data)
        } catch (error) {
            console.error('Error fetching project:', error)
            toast({
                title: "Error",
                description: "Failed to load project. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewStep = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/steps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newStepTitle,
                    description: newStepDescription,
                    status: newStepStatus,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create new step')
            }

            const newStep = await response.json()
            setProject(prevProject => {
                if (!prevProject) return null
                return {
                    ...prevProject,
                    steps: [...prevProject.steps, newStep],
                }
            })

            setIsNewStepDialogOpen(false)
            setNewStepTitle('')
            setNewStepDescription('')
            setNewStepStatus('upcoming')

            toast({
                title: "Success",
                description: "New step created successfully",
            })
        } catch (error) {
            console.error('Error creating new step:', error)
            toast({
                title: "Error",
                description: "Failed to create new step. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading project...</div>
    }

    if (!project) {
        return <div className="text-center text-red-500">Project not found</div>
    }

    const completedSteps = project.steps.filter(step => step.status === 'completed').length
    const progress = (completedSteps / project.steps.length) * 100

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Project Steps</CardTitle>
                        <Button size="sm" onClick={() => setIsNewStepDialogOpen(true)}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add New Step
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList>
                                <TabsTrigger value="all">All Steps</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <ul className="space-y-2">
                                    {project.steps.map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <Link href={`/dashboard/projects/${projectId}/steps/${step.id}`} className="flex items-center">
                                                <StepStatus status={step.status} />
                                                {step.title}
                                            </Link>
                                            <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="completed">
                                <ul className="space-y-2">
                                    {project.steps.filter(step => step.status === 'completed').map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <Link href={`/dashboard/projects/${projectId}/steps/${step.id}`} className="flex items-center">
                                                <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                                                {step.title}
                                            </Link>
                                            <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="in-progress">
                                <ul className="space-y-2">
                                    {project.steps.filter(step => step.status === 'in-progress').map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <Link href={`/dashboard/projects/${projectId}/steps/${step.id}`} className="flex items-center">
                                                <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
                                                {step.title}
                                            </Link>
                                            <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="upcoming">
                                <ul className="space-y-2">
                                    {project.steps.filter(step => step.status === 'upcoming').map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <Link href={`/dashboard/projects/${projectId}/steps/${step.id}`} className="flex items-center">
                                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-300" />
                                                {step.title}
                                            </Link>
                                            <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={progress} className="w-full mb-2" />
                            <p className="text-center">{progress.toFixed(0)}% Complete</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                                        Completed Steps
                                    </span>
                                    <span>{completedSteps} / {project.steps.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
                                        In Progress
                                    </span>
                                    <span>{project.steps.filter(step => step.status === 'in-progress').length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                        Upcoming
                                    </span>
                                    <span>{project.steps.filter(step => step.status === 'upcoming').length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <FileIcon className="mr-2 h-4 w-4" />
                                        Description
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{project.description || 'No description provided'}</p>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        Created
                                    </span>
                                    <span className="text-sm text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <ClockIcon className="mr-2 h-4 w-4" />
                                        Last Updated
                                    </span>
                                    <span className="text-sm text-gray-500">{new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <UsersIcon className="mr-2 h-4 w-4" />
                                        Status
                                    </span>
                                    <span className="text-sm font-medium text-green-600 capitalize">{project.status}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Dialog open={isNewStepDialogOpen} onOpenChange={setIsNewStepDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Step</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="step-title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="step-title"
                                value={newStepTitle}
                                onChange={(e) => setNewStepTitle(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="step-description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="step-description"
                                value={newStepDescription}
                                onChange={(e) => setNewStepDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="step-status" className="text-right">
                                Status
                            </Label>
                            <Select value={newStepStatus} onValueChange={setNewStepStatus}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleNewStep}>Add Step</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function StepStatus({ status }: { status: string }) {
    switch (status) {
        case "completed": return <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
        case "in-progress": return <PickaxeIcon className="mr-2 h-4 w-4 text-blue-500" />
        case "upcoming": return <SquarePenIcon className="mr-2 h-4 w-4 text-grey-300" />
        default: return null
    }
}
