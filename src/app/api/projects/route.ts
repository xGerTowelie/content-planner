import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const projects = await prisma.project.findMany({
            where: { userId: session.user.id },
            include: { steps: true },
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name) {
        return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    try {
        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                userId: session.user.id,
            },
        })

        return NextResponse.json(newProject, { status: 201 })
    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
