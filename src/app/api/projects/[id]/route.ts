import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
        where: { id: params.id },
        include: { steps: true },
    })

    if (!project || project.userId !== session.user.id) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
}
