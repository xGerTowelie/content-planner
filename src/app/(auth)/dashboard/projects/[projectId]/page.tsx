import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import ProjectDisplay from "@/components/ProjectDisplay"
import { authOptions } from "@/lib/auth"

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return <ProjectDisplay {...params} />
}
