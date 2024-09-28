
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import StepsDisplay from "@/components/StepsDisplay"

export default async function StepsPage({ params }: { params: { stepId: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return <StepsDisplay {...params} />
}
