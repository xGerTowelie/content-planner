import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
            include: { steps: true },
        })

        if (!project || project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error('Error fetching project:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name, description, status } = await request.json()

        const project = await prisma.project.findUnique({
            where: { id: params.id },
        })

        if (!project || project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const updatedProject = await prisma.project.update({
            where: { id: params.id },
            data: { name, description, status },
        })

        return NextResponse.json(updatedProject)
    } catch (error) {
        console.error('Error updating project:', error)
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
    }
}

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
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

        await prisma.step.deleteMany({
            where: { projectId: params.id },
        })

        await prisma.project.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Project deleted successfully' })
    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }
}
