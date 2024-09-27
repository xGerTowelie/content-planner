import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { title, description, status } = await request.json()

        const project = await prisma.project.findUnique({
            where: { id: params.id },
        })

        if (!project || project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const newStep = await prisma.step.create({
            data: {
                title,
                description,
                status,
                projectId: params.id,
            },
        })

        return NextResponse.json(newStep, { status: 201 })
    } catch (error) {
        console.error('Error creating step:', error)
        return NextResponse.json({ error: 'Failed to create step' }, { status: 500 })
    }
}
