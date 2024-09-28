// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        email: string | null
        name: string | null
    }

    interface Session {
        user: User
        expires: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        email: string | null
        name: string | null
    }
}
