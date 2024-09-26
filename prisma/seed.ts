import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function clearDatabase() {
    await prisma.step.deleteMany({})
    await prisma.project.deleteMany({})
    await prisma.user.deleteMany({})
}

async function main() {
    console.log('Clearing database...')
    await clearDatabase()
    console.log('Database cleared.')

    const password = await hash('compakt', 12)
    const user = await prisma.user.create({
        data: {
            email: 'mail@towelie.dev',
            name: 'Towelie',
            password,
        },
    })

    const project1 = await prisma.project.create({
        data: {
            name: 'Product Launch Video',
            description: 'Create a promotional video for our new software release',
            userId: user.id,
            steps: {
                create: [
                    { title: 'Brainstorm concept', status: 'completed' },
                    { title: 'Write script', status: 'completed' },
                    { title: 'Storyboard creation', status: 'in-progress' },
                    { title: 'Voice-over recording', status: 'upcoming' },
                    { title: 'Animation and graphics', status: 'upcoming' },
                    { title: 'Final editing and post-production', status: 'upcoming' },
                ],
            },
        },
    })

    const project2 = await prisma.project.create({
        data: {
            name: 'Company Culture Documentary',
            description: 'Showcase our unique company culture through a short documentary',
            userId: user.id,
            steps: {
                create: [
                    { title: 'Interview key team members', status: 'completed' },
                    { title: 'Capture office b-roll footage', status: 'in-progress' },
                    { title: 'Edit interview segments', status: 'upcoming' },
                    { title: 'Create motion graphics', status: 'upcoming' },
                    { title: 'Compose background music', status: 'upcoming' },
                ],
            },
        },
    })

    const project3 = await prisma.project.create({
        data: {
            name: 'Tutorial Series: Advanced React Patterns',
            description: 'Create a series of video tutorials covering advanced React patterns',
            userId: user.id,
            steps: {
                create: [
                    { title: 'Outline course structure', status: 'completed' },
                    { title: 'Write scripts for each lesson', status: 'in-progress' },
                    { title: 'Record screencasts', status: 'upcoming' },
                    { title: 'Edit and add annotations', status: 'upcoming' },
                    { title: 'Create thumbnail images', status: 'upcoming' },
                    { title: 'Upload and publish on learning platform', status: 'upcoming' },
                ],
            },
        },
    })

    const project4 = await prisma.project.create({
        data: {
            name: 'Client Testimonial Videos',
            description: 'Produce a series of client testimonial videos for our website',
            userId: user.id,
            steps: {
                create: [
                    { title: 'Contact and schedule clients', status: 'completed' },
                    { title: 'Prepare interview questions', status: 'completed' },
                    { title: 'Set up filming equipment', status: 'in-progress' },
                    { title: 'Conduct and record interviews', status: 'upcoming' },
                    { title: 'Edit individual testimonials', status: 'upcoming' },
                    { title: 'Create compilation video', status: 'upcoming' },
                ],
            },
        },
    })

    console.log({ user, project1, project2, project3, project4 })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
