"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Video, Mic, FileText, Link as LinkIcon, Plus, Trash2, Copy } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { SaveButton } from "./SaveButton"
import { useRouter } from "next/navigation"

interface Resource {
    id?: string
    name: string
    url: string
}

interface Step {
    id: string
    title: string
    videoContent: string | null
    audioContent: string | null
    scriptContent: string | null
    status: string
    resources: Resource[]
}

export default function StepsDisplay({ stepId, projectId }: { stepId: string; projectId: string }) {
    const [step, setStep] = useState<Step | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [newResourceName, setNewResourceName] = useState("")
    const [newResourceUrl, setNewResourceUrl] = useState("")
    const [isDirty, setIsDirty] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        fetchStep()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepId, projectId])

    const fetchStep = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/steps/${stepId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch step')
            }
            const data = await response.json()
            setStep(data)
        } catch (error) {
            console.error('Error fetching step:', error)
            toast({
                title: "Error",
                description: "Failed to load step. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const updateStepField = (field: keyof Step, value: string) => {
        if (step) {
            setStep({ ...step, [field]: value })
            setIsDirty(true)
        }
    }

    const saveStep = async () => {
        if (!step) return

        try {
            const response = await fetch(`/api/projects/${projectId}/steps/${stepId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...step,
                    resources: step.resources.map(({ id, name, url }) => ({ id, name, url }))
                }),
            })
            if (!response.ok) {
                throw new Error('Failed to update step')
            }
            const updatedStep: Step = await response.json()
            setStep(updatedStep)
            setIsDirty(false)
            toast({
                title: "Success",
                description: "Step updated successfully",
            })
            if (updatedStep.status === "completed") {
                router.push(`/dashboard/projects/${projectId}`)
            }
        } catch (error) {
            console.error('Error updating step:', error)
            toast({
                title: "Error",
                description: "Failed to update step. Please try again.",
                variant: "destructive",
            })
        }
    }

    const addResource = () => {
        if (newResourceName && newResourceUrl && step) {
            const newResource: Resource = { name: newResourceName, url: newResourceUrl }
            setStep({
                ...step,
                resources: [...step.resources, newResource]
            })
            setNewResourceName("")
            setNewResourceUrl("")
            setIsDirty(true)
        }
    }

    const removeResource = (index: number) => {
        if (step) {
            const newResources = step.resources.filter((_, i) => i !== index)
            setStep({
                ...step,
                resources: newResources
            })
            setIsDirty(true)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied to clipboard",
                description: "The resource URL has been copied to your clipboard.",
            })
        })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!step) {
        return <div>Step not found</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-10 flex justify-between items-center">
                <Link href={`/dashboard/projects/${projectId}`}>
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Project
                    </Button>
                </Link>
                <SaveButton onSave={saveStep} isDirty={isDirty} />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center mb-10">
                <input
                    value={step.title}
                    onChange={(e) => updateStepField('title', e.target.value)}
                    className="text-3xl bg-transparent border-b-2 pb-2 font-bold w-full lg:mr-6 focus:outline-none"
                />
                <div className="flex items-center space-x-2">
                    <Label htmlFor="status">Status:</Label>
                    <Select
                        value={step.status}
                        onValueChange={(value) => updateStepField('status', value)}
                    >
                        <SelectTrigger id="status" className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Step Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="video">
                                <TabsList>
                                    <TabsTrigger value="video">
                                        <Video className="mr-2 h-4 w-4" />
                                        Video
                                    </TabsTrigger>
                                    <TabsTrigger value="audio">
                                        <Mic className="mr-2 h-4 w-4" />
                                        Audio
                                    </TabsTrigger>
                                    <TabsTrigger value="script">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Script
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="video">
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Video Brainstorming</h3>
                                        <textarea
                                            className="w-full h-32 p-2 border rounded"
                                            placeholder="Enter your video ideas here..."
                                            value={step.videoContent || ''}
                                            onChange={(e) => updateStepField('videoContent', e.target.value)}
                                        ></textarea>
                                    </div>
                                </TabsContent>
                                <TabsContent value="audio">
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Audio Brainstorming</h3>
                                        <textarea
                                            className="w-full h-32 p-2 border rounded"
                                            placeholder="Enter your audio ideas here..."
                                            value={step.audioContent || ''}
                                            onChange={(e) => updateStepField('audioContent', e.target.value)}
                                        ></textarea>
                                    </div>
                                </TabsContent>
                                <TabsContent value="script">
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Script Writing</h3>
                                        <textarea
                                            className="w-full h-64 p-2 border rounded"
                                            placeholder="Write your script here..."
                                            value={step.scriptContent || ''}
                                            onChange={(e) => updateStepField('scriptContent', e.target.value)}
                                        ></textarea>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <Input
                                        placeholder="Resource name"
                                        value={newResourceName}
                                        onChange={(e) => setNewResourceName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="URL"
                                        value={newResourceUrl}
                                        onChange={(e) => setNewResourceUrl(e.target.value)}
                                    />
                                    <Button onClick={addResource}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Resource
                                    </Button>
                                </div>
                                {step.resources.map((resource, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <div className="flex items-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(resource.url)}
                                                aria-label="Copy resource URL"
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                            </Button>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                <LinkIcon className="mr-2 h-4 w-4" />
                                                {resource.name}
                                            </a>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removeResource(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
