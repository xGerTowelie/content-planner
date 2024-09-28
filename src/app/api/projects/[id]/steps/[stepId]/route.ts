import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
    _: Request,
    { params }: { params: { id: string; stepId: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
        })

        if (!project || project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const step = await prisma.step.findUnique({
            where: { id: params.stepId },
            include: { resources: true },
        })

        if (!step || step.projectId !== params.id) {
            return NextResponse.json({ error: 'Step not found' }, { status: 404 })
        }

        return NextResponse.json(step)
    } catch (error) {
        console.error('Error fetching step:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string; stepId: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { title, videoContent, audioContent, scriptContent, status, resources } = await request.json()

        const project = await prisma.project.findUnique({
            where: { id: params.id },
        })

        if (!project || project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const step = await prisma.step.findUnique({
            where: { id: params.stepId },
        })

        if (!step || step.projectId !== params.id) {
            return NextResponse.json({ error: 'Step not found' }, { status: 404 })
        }

        // Remove the stepId from resources before creating
        const resourcesWithoutStepId = resources.map(({ id, name, url }: { id: string, name: string, url: string }) => ({ id, name, url }))

        const updatedStep = await prisma.step.update({
            where: { id: params.stepId },
            data: {
                title,
                videoContent,
                audioContent,
                scriptContent,
                status,
                resources: {
                    deleteMany: {},
                    create: resourcesWithoutStepId,
                },
            },
            include: { resources: true },
        })

        return NextResponse.json(updatedStep)
    } catch (error) {
        console.error('Error updating step:', error)
        return NextResponse.json({ error: 'Failed to update step' }, { status: 500 })
    }
}

export async function DELETE(
    _: Request,
    { params }: { params: { id: string; stepId: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
        })

        if (!project || project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const step = await prisma.step.findUnique({
            where: { id: params.stepId },
        })

        if (!step || step.projectId !== params.id) {
            return NextResponse.json({ error: 'Step not found' }, { status: 404 })
        }

        await prisma.step.delete({
            where: { id: params.stepId },
        })

        return NextResponse.json({ message: 'Step deleted successfully' })
    } catch (error) {
        console.error('Error deleting step:', error)
        return NextResponse.json({ error: 'Failed to delete step' }, { status: 500 })
    }
}
