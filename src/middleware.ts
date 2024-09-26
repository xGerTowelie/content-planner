import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const isAuthenticated = !!token

    console.log('Current path:', req.nextUrl.pathname)

    if (isAuthenticated && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
        console.log('Authenticated user trying to access login or signup page, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (!isAuthenticated && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/signup' && req.nextUrl.pathname !== '/') {
        console.log('Unauthenticated user trying to access protected route, redirecting to login')
        return NextResponse.redirect(new URL('/login', req.url))
    }

    console.log('Allowing access to:', req.nextUrl.pathname)
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
