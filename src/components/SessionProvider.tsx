'use client'

import { Session } from 'next-auth'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function SessionProvider({ session, children }: { session: Session | null, children: React.ReactNode }) {
    return <NextAuthSessionProvider {...session}>{children}</NextAuthSessionProvider>
}

export default SessionProvider
