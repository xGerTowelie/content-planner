import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return NextResponse.json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email } })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
    }
}
