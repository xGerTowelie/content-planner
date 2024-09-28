"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Video, Mic, FileText, Link as LinkIcon, Plus, Trash2, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function StepsDisplay({ stepId }: { stepId: string }) {
    const [stepName, setStepName] = useState("Write Script")
    const [status, setStatus] = useState("draft")
    const [resources, setResources] = useState<{ name: string; url: string }[]>([])
    const [newResourceName, setNewResourceName] = useState("")
    const [newResourceUrl, setNewResourceUrl] = useState("")

    console.log('view steps for id:', stepId)

    const addResource = () => {
        if (newResourceName && newResourceUrl) {
            setResources([...resources, { name: newResourceName, url: newResourceUrl }])
            setNewResourceName("")
            setNewResourceUrl("")
        }
    }

    const removeResource = (index: number) => {
        setResources(resources.filter((_, i) => i !== index))
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied to clipboard",
                description: "The resource URL has been copied to your clipboard.",
            })
        })
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <Link href="/dashboard/projects/1">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Project
                    </Button>
                </Link>
            </div>
            <div className="flex justify-between items-center mb-6">
                <input
                    value={stepName}
                    onChange={(e) => setStepName(e.target.value)}
                    className="text-3xl font-bold w-1/2 focus:outline-none"
                />
                <div className="flex items-center space-x-2">
                    <Label htmlFor="status">Status:</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
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
                                        ></textarea>
                                    </div>
                                </TabsContent>
                                <TabsContent value="audio">
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Audio Brainstorming</h3>
                                        <textarea
                                            className="w-full h-32 p-2 border rounded"
                                            placeholder="Enter your audio ideas here..."
                                        ></textarea>
                                    </div>
                                </TabsContent>
                                <TabsContent value="script">
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Script Writing</h3>
                                        <textarea
                                            className="w-full h-64 p-2 border rounded"
                                            placeholder="Write your script here..."
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
                                {resources.map((resource, index) => (
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
