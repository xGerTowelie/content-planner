import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, CheckCircleIcon, ClockIcon, FileIcon, PlusIcon, UsersIcon } from "lucide-react"
import Link from 'next/link'

export default function ProjectDisplay({ projectId }: { projectId: string }) {
    const steps = [
        { id: 1, title: "Write script", status: "completed" },
        { id: 2, title: "Create storyboard", status: "in-progress" },
        { id: 3, title: "Record voiceover", status: "upcoming" },
        { id: 4, title: "Edit footage", status: "upcoming" },
        { id: 5, title: "Add special effects", status: "upcoming" },
    ]

    return (
        <>
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Project {projectId}</h1>
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Project Steps</CardTitle>
                        <Button size="sm">
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
                                    {steps.map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <Link href="/dashboard/projects/1/steps/1" className="flex items-center">
                                                <CheckCircleIcon className={`mr-2 h-4 w-4 ${step.status === 'completed' ? 'text-green-500' :
                                                    step.status === 'in-progress' ? 'text-blue-500' : 'text-gray-300'
                                                    }`} />
                                                {step.title}
                                            </Link>
                                            <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="completed">
                                <ul className="space-y-2">
                                    {steps.filter(step => step.status === 'completed').map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <span className="flex items-center">
                                                <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                                                {step.title}
                                            </span>
                                            <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="in-progress">
                                <ul className="space-y-2">
                                    {steps.filter(step => step.status === 'in-progress').map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <span className="flex items-center">
                                                <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
                                                {step.title}
                                            </span>
                                            <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="upcoming">
                                <ul className="space-y-2">
                                    {steps.filter(step => step.status === 'upcoming').map((step) => (
                                        <li key={step.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                                            <span className="flex items-center">
                                                <CheckCircleIcon className="mr-2 h-4 w-4 text-gray-300" />
                                                {step.title}
                                            </span>
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
                            <Progress value={30} className="w-full mb-2" />
                            <p className="text-center">30% Complete</p>
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
                                        <CheckCircleIcon className="mr-2 h-4 w-4" />
                                        Completed Steps
                                    </span>
                                    <span>1 / 5</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <UsersIcon className="mr-2 h-4 w-4" />
                                        Team Members
                                    </span>
                                    <span>7</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        Due Date
                                    </span>
                                    <span>Aug 15, 2023</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <ClockIcon className="mr-2 h-4 w-4" />
                                    <span>Step &quot;Create storyboard&quot; started 2h ago</span>
                                </li>
                                <li className="flex items-center">
                                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                                    <span>Step &quot;Write script&quot; completed yesterday</span>
                                </li>
                                <li className="flex items-center">
                                    <UsersIcon className="mr-2 h-4 w-4" />
                                    <span>New team member added 3 days ago</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
